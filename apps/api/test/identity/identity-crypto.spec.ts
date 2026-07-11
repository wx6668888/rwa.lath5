import { IdentityCrypto } from '../../src/identity/identity-crypto.service'
import { secp256k1 } from '@noble/curves/secp256k1'
import { keccak_256 } from '@noble/hashes/sha3'

function makeCrypto(): IdentityCrypto {
  const cfg: any = {
    getOrThrow: (k: string) =>
      k === 'IDENTITY_HMAC_KEY' || k === 'IDENTITY_ENC_KEY'
        ? 'a'.repeat(64)
        : (() => {
            throw new Error(`unknown config ${k}`)
          })(),
  }
  return new IdentityCrypto(cfg)
}

function deriveAddress(priv: Uint8Array): string {
  const pub = secp256k1.getPublicKey(priv, false)
  return '0x' + Buffer.from(keccak_256(pub.subarray(1)).subarray(12)).toString('hex')
}

function signMessage(priv: Uint8Array, message: string): string {
  const prefix = `\x19Ethereum Signed Message:\n${Buffer.byteLength(message)}${message}`
  const msgHash = keccak_256(Buffer.from(prefix, 'utf8'))
  const sig = secp256k1.sign(msgHash, priv)
  const rBytes = Buffer.from(sig.r.toString(16).padStart(64, '0'), 'hex')
  const sBytes = Buffer.from(sig.s.toString(16).padStart(64, '0'), 'hex')
  const sigBytes = Buffer.concat([rBytes, sBytes, Buffer.from([sig.recovery! + 27])])
  return '0x' + sigBytes.toString('hex')
}

describe('IdentityCrypto', () => {
  const crypto = makeCrypto()

  it('hashIdentifier is case-insensitive and stable', () => {
    expect(crypto.hashIdentifier('A@B.com').equals(crypto.hashIdentifier('a@b.com'))).toBe(true)
  })

  it('encrypt / decrypt round-trips', () => {
    const { ciphertext } = crypto.encrypt('hello@x.com')
    expect(crypto.decrypt(ciphertext)).toBe('hello@x.com')
  })

  it('signState / verifyState round-trips and rejects tampering', () => {
    const token = crypto.signState('user1:email@x.com')
    expect(crypto.verifyState(token)).toBe('user1:email@x.com')
    expect(crypto.verifyState('not.a.token')).toBeNull()
  })

  it('verifyWalletSignature recovers the claimed address from a real EIP-191 signature', () => {
    const priv = secp256k1.utils.randomPrivateKey()
    const address = deriveAddress(priv)
    const message = crypto.issueWalletChallenge(address)
    const signature = signMessage(priv, message)
    expect(crypto.verifyWalletSignature(address, message, signature)).toBe(true)
    expect(crypto.verifyWalletSignature('0x' + '0'.repeat(40), message, signature)).toBe(false)
  })

  it('verifyWalletSignature rejects malformed signatures', () => {
    expect(crypto.verifyWalletSignature('0x' + '1'.repeat(40), 'x', '0xdead')).toBe(false)
  })
})
