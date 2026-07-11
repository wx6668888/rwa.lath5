import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { keccak_256 } from '@noble/hashes/sha3'
import { secp256k1 } from '@noble/curves/secp256k1'
import { IDENTITY_ERROR_CODES } from './identity.errors'

const KEY_VERSION = 1
const NONCE_TTL_MS = 5 * 60 * 1000
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

interface ChallengeRecord {
  nonce: string
  expiresAt: number
}

@Injectable()
export class IdentityCrypto {
  private readonly hmacKey: Buffer
  private readonly encKey: Buffer
  private readonly challenges = new Map<string, ChallengeRecord>()

  constructor(private readonly config: ConfigService) {
    this.hmacKey = Buffer.from(this.config.getOrThrow<string>('IDENTITY_HMAC_KEY'), 'hex')
    this.encKey = Buffer.from(this.config.getOrThrow<string>('IDENTITY_ENC_KEY'), 'hex')
    if (this.hmacKey.length !== 32) {
      throw new Error('IDENTITY_HMAC_KEY must be 32 bytes (64 hex characters)')
    }
    if (this.encKey.length !== 32) {
      throw new Error('IDENTITY_ENC_KEY must be 32 bytes (64 hex characters)')
    }
  }

  /** Stable lookup hash for an identifier (email or provider subject). Case-insensitive. */
  hashIdentifier(value: string): Buffer {
    return createHmac('sha256', this.hmacKey).update(value.toLowerCase()).digest()
  }

  /** Store hash for a session token. The plaintext token is only returned to the client. */
  hashToken(token: string): Buffer {
    return createHmac('sha256', this.hmacKey).update(token).digest()
  }

  hmac(value: string): Buffer {
    return createHmac('sha256', this.hmacKey).update(value).digest()
  }

  encrypt(plain: string): { ciphertext: Buffer; keyVersion: number } {
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', this.encKey, iv)
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return { ciphertext: Buffer.concat([iv, tag, enc]), keyVersion: KEY_VERSION }
  }

  decrypt(blob: Buffer): string {
    const iv = blob.subarray(0, 12)
    const tag = blob.subarray(12, 28)
    const enc = blob.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', this.encKey, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
  }

  generateSessionToken(): string {
    return randomBytes(32).toString('hex')
  }

  generateNonce(): string {
    return `rwa-auth.${randomBytes(20).toString('hex')}`
  }

  /** Generates a 160-bit Base32 secret suitable for RFC 6238 TOTP enrollment. */
  generateTotpSecret(): string {
    const bytes = randomBytes(20)
    let output = ''
    let buffer = 0
    let bits = 0
    for (const byte of bytes) {
      buffer = (buffer << 8) | byte
      bits += 8
      while (bits >= 5) {
        output += BASE32_ALPHABET[(buffer >>> (bits - 5)) & 31]
        bits -= 5
      }
    }
    if (bits > 0) output += BASE32_ALPHABET[(buffer << (5 - bits)) & 31]
    return output
  }

  verifyTotp(secret: string, code: string, now = Date.now()): boolean {
    if (!/^\d{6}$/.test(code)) return false
    for (const offset of [-1, 0, 1]) {
      const expected = this.totpCode(secret, Math.floor(now / 30_000) + offset)
      if (timingSafeEqual(Buffer.from(expected), Buffer.from(code))) return true
    }
    return false
  }

  private totpCode(secret: string, counter: number): string {
    const normalized = secret.replace(/\s|=/g, '').toUpperCase()
    let buffer = 0
    let bits = 0
    const bytes: number[] = []
    for (const char of normalized) {
      const index = BASE32_ALPHABET.indexOf(char)
      if (index < 0) throw new Error('TOTP secret is not valid Base32')
      buffer = (buffer << 5) | index
      bits += 5
      if (bits >= 8) {
        bytes.push((buffer >>> (bits - 8)) & 255)
        bits -= 8
      }
    }
    const counterBytes = Buffer.alloc(8)
    counterBytes.writeBigUInt64BE(BigInt(counter))
    const digest = createHmac('sha1', Buffer.from(bytes)).update(counterBytes).digest()
    const offset = digest[digest.length - 1] & 15
    const value = ((digest[offset] & 127) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3]
    return String(value % 1_000_000).padStart(6, '0')
  }

  /** Signed, tamper-evident state token (used for email verification / recovery links). */
  signState(payload: string): string {
    const mac = createHmac('sha256', this.hmacKey).update(payload).digest('hex')
    return `${Buffer.from(payload).toString('base64url')}.${mac}`
  }

  verifyState(token: string): string | null {
    const dot = token.indexOf('.')
    if (dot < 0) return null
    const payload = token.slice(0, dot)
    const mac = token.slice(dot + 1)
    const expected = createHmac('sha256', this.hmacKey).update(
      Buffer.from(payload, 'base64url').toString(),
    ).digest('hex')
    if (mac.length !== expected.length) return null
    let diff = 0
    for (let i = 0; i < mac.length; i++) diff |= mac.charCodeAt(i) ^ expected.charCodeAt(i)
    if (diff !== 0) return null
    return Buffer.from(payload, 'base64url').toString()
  }

  /** Issue a single-use wallet challenge nonce bound to the address. */
  issueWalletChallenge(address: string): string {
    const nonce = this.generateNonce()
    this.challenges.set(address.toLowerCase(), { nonce, expiresAt: Date.now() + NONCE_TTL_MS })
    return nonce
  }

  /** Consume a wallet challenge nonce, enforcing single-use and TTL. */
  consumeWalletChallenge(address: string, nonce: string): void {
    const key = address.toLowerCase()
    const record = this.challenges.get(key)
    if (!record || record.nonce !== nonce) {
      throw new UnauthorizedException({
        code: IDENTITY_ERROR_CODES.NONCE_MISMATCH,
        message: 'Wallet challenge nonce does not match.',
      })
    }
    if (record.expiresAt < Date.now()) {
      this.challenges.delete(key)
      throw new UnauthorizedException({
        code: IDENTITY_ERROR_CODES.NONCE_EXPIRED,
        message: 'Wallet challenge nonce has expired.',
      })
    }
    this.challenges.delete(key)
  }

  /** Verify an EIP-191 personal_sign signature recovers to the claimed address. */
  verifyWalletSignature(address: string, message: string, signature: string): boolean {
    try {
      const prefix = `\x19Ethereum Signed Message:\n${Buffer.byteLength(message, 'utf8')}${message}`
      const msgHash = keccak_256(Buffer.from(prefix, 'utf8'))
      const sigBytes = Buffer.from(signature.replace(/^0x/, ''), 'hex')
      if (sigBytes.length !== 65) return false
      const recovery = sigBytes[64] >= 27 ? sigBytes[64] - 27 : sigBytes[64]
      const compact = new Uint8Array(Buffer.concat([sigBytes.subarray(0, 32), sigBytes.subarray(32, 64)]))
      const sigObj = secp256k1.Signature.fromCompact(compact).addRecoveryBit(recovery)
      const point = sigObj.recoverPublicKey(msgHash)
      const pub = point.toRawBytes(false)
      const addr = keccak_256(pub.subarray(1)).subarray(12)
      const recovered = `0x${Buffer.from(addr).toString('hex')}`
      return recovered.toLowerCase() === address.toLowerCase()
    } catch {
      return false
    }
  }
}
