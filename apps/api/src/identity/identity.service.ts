import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'node:crypto'
import { Repository } from 'typeorm'
import { IDENTITY_ERROR_CODES } from './identity.errors'
import { IdentityCrypto } from './identity-crypto.service'
import { Device } from './device.entity'
import { LoginIdentity } from './login-identity.entity'
import { Session } from './session.entity'
import { User } from './user.entity'

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export interface AuthResult {
  userId: string
  sessionId: string
  token: string
}

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(LoginIdentity) private readonly loginIdentities: Repository<LoginIdentity>,
    @InjectRepository(Device) private readonly devices: Repository<Device>,
    @InjectRepository(Session) private readonly sessions: Repository<Session>,
    private readonly crypto: IdentityCrypto,
  ) {}

  async registerEmail(email: string, locale = 'en'): Promise<{ userId: string; verificationToken: string }> {
    const normalized = email.toLowerCase().trim()
    const hash = this.crypto.hashIdentifier(normalized)
    const existing = await this.loginIdentities.findOne({
      where: { kind: 'email', identifierHash: hash },
    })
    if (existing && existing.state === 'verified') {
      throw new ConflictException({
        code: IDENTITY_ERROR_CODES.EMAIL_TAKEN,
        message: 'An account with this email already exists.',
      })
    }

    const userId = randomUUID()
    await this.users.save(
      this.users.create({ id: userId, status: 'active', locale }),
    )
    const { ciphertext, keyVersion } = this.crypto.encrypt(normalized)
    await this.loginIdentities.save(
      this.loginIdentities.create({
        id: randomUUID(),
        userId,
        kind: 'email',
        state: 'pending',
        identifierHash: hash,
        identifierCiphertext: ciphertext,
        encryptionKeyVersion: keyVersion,
      }),
    )

    const verificationToken = this.crypto.signState(`${userId}:${normalized}`)
    return { userId, verificationToken }
  }

  async verifyEmail(token: string): Promise<{ userId: string; verified: true }> {
    const payload = this.crypto.verifyState(token)
    if (!payload) {
      throw new UnauthorizedException({
        code: IDENTITY_ERROR_CODES.INVALID_VERIFICATION,
        message: 'Verification token is invalid.',
      })
    }
    const [userId, email] = payload.split(':')
    const hash = this.crypto.hashIdentifier(email)
    const identity = await this.loginIdentities.findOne({
      where: { kind: 'email', userId, identifierHash: hash },
    })
    if (!identity) {
      throw new NotFoundException({
        code: IDENTITY_ERROR_CODES.IDENTITY_NOT_FOUND,
        message: 'Email identity not found.',
      })
    }
    if (identity.state !== 'verified') {
      identity.state = 'verified'
      identity.verifiedAt = new Date()
      await this.loginIdentities.save(identity)
    }
    return { userId, verified: true }
  }

  async createWalletChallenge(address: string): Promise<{ address: string; nonce: string }> {
    const normalized = address.toLowerCase()
    return { address: normalized, nonce: this.crypto.issueWalletChallenge(normalized) }
  }

  async verifyWalletSignature(
    address: string,
    signature: string,
    nonce: string,
    device?: { fingerprint?: string; name?: string },
  ): Promise<AuthResult> {
    const normalized = address.toLowerCase()
    this.crypto.consumeWalletChallenge(normalized, nonce)
    if (!this.crypto.verifyWalletSignature(normalized, nonce, signature)) {
      throw new UnauthorizedException({
        code: IDENTITY_ERROR_CODES.INVALID_SIGNATURE,
        message: 'Wallet signature does not recover to the claimed address.',
      })
    }
    return this.upsertExternalWallet(normalized, device)
  }

  private async upsertExternalWallet(
    address: string,
    device?: { fingerprint?: string; name?: string },
  ): Promise<AuthResult> {
    const hash = this.crypto.hashIdentifier(address)
    const identity = await this.loginIdentities.findOne({
      where: { kind: 'external_wallet', identifierHash: hash },
    })
    if (identity) {
      if (identity.state !== 'verified') {
        identity.state = 'verified'
        identity.verifiedAt = new Date()
        await this.loginIdentities.save(identity)
      }
      return this.issueSession(identity.userId, device)
    }
    const userId = randomUUID()
    await this.users.save(this.users.create({ id: userId, status: 'active', locale: 'en' }))
    const { ciphertext, keyVersion } = this.crypto.encrypt(address)
    await this.loginIdentities.save(
      this.loginIdentities.create({
        id: randomUUID(),
        userId,
        kind: 'external_wallet',
        state: 'verified',
        identifierHash: hash,
        identifierCiphertext: ciphertext,
        encryptionKeyVersion: keyVersion,
        verifiedAt: new Date(),
      }),
    )
    return this.issueSession(userId, device)
  }

  async oauthLogin(
    provider: 'google' | 'x',
    subject: string,
    meta?: { displayName?: string; locale?: string; device?: { fingerprint?: string; name?: string } },
  ): Promise<AuthResult> {
    const key = `${provider}:${subject}`
    const hash = this.crypto.hashIdentifier(key)
    const identity = await this.loginIdentities.findOne({
      where: { kind: provider, identifierHash: hash },
    })
    if (identity) {
      return this.issueSession(identity.userId, meta?.device)
    }
    const userId = randomUUID()
    await this.users.save(
      this.users.create({ id: userId, status: 'active', locale: meta?.locale ?? 'en' }),
    )
    const { ciphertext, keyVersion } = this.crypto.encrypt(key)
    await this.loginIdentities.save(
      this.loginIdentities.create({
        id: randomUUID(),
        userId,
        kind: provider,
        state: 'verified',
        identifierHash: hash,
        identifierCiphertext: ciphertext,
        encryptionKeyVersion: keyVersion,
        verifiedAt: new Date(),
      }),
    )
    return this.issueSession(userId, meta?.device)
  }

  async recover(email: string): Promise<{ recoveryToken: string | null; delivered: boolean }> {
    const normalized = email.toLowerCase().trim()
    const hash = this.crypto.hashIdentifier(normalized)
    const identity = await this.loginIdentities.findOne({
      where: { kind: 'email', identifierHash: hash, state: 'verified' },
    })
    if (!identity) {
      return { recoveryToken: null, delivered: false }
    }
    const recoveryToken = this.crypto.signState(`recover:${identity.userId}:${normalized}`)
    return { recoveryToken, delivered: true }
  }

  async revokeSession(sessionId: string, token: string): Promise<{ revoked: true }> {
    const tokenHash = this.crypto.hashToken(token)
    const session = await this.sessions.findOne({
      where: { id: sessionId, tokenHash, state: 'active' },
    })
    if (!session) {
      throw new NotFoundException({
        code: IDENTITY_ERROR_CODES.SESSION_NOT_FOUND,
        message: 'Active session not found.',
      })
    }
    session.state = 'revoked'
    session.revokedAt = new Date()
    session.revokeReason = 'user_logout'
    await this.sessions.save(session)
    return { revoked: true }
  }

  private async issueSession(
    userId: string,
    device?: { fingerprint?: string; name?: string },
  ): Promise<AuthResult> {
    const fingerprint = device?.fingerprint ?? 'anonymous'
    const fingerprintHash = this.crypto.hashIdentifier(`${userId}:${fingerprint}`)
    let deviceRow = await this.devices.findOne({
      where: { userId, fingerprintHash },
    })
    if (!deviceRow) {
      deviceRow = await this.devices.save(
        this.devices.create({
          id: randomUUID(),
          userId,
          fingerprintHash,
          trustState: 'untrusted',
          displayName: device?.name ?? null,
        }),
      )
    }

    const token = this.crypto.generateSessionToken()
    const session = await this.sessions.save(
      this.sessions.create({
        id: randomUUID(),
        userId,
        deviceId: deviceRow.id,
        tokenHash: this.crypto.hashToken(token),
        state: 'active',
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      }),
    )
    return { userId, sessionId: session.id, token }
  }
}
