import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { keccak_256 } from '@noble/hashes/sha3'
import { secp256k1 } from '@noble/curves/secp256k1'
import { AppModule } from '../../src/app.module'
import { IdentityService } from '../../src/identity/identity.service'
import { buildDatabaseOptions } from '../../src/database/database-options'

const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip

function signMessage(address: string, message: string): string {
  const priv = secp256k1.utils.randomPrivateKey()
  const pub = secp256k1.getPublicKey(priv, false)
  const derived = '0x' + Buffer.from(keccak_256(pub.subarray(1)).subarray(12)).toString('hex')
  if (derived.toLowerCase() !== address.toLowerCase()) throw new Error('address mismatch')
  const prefix = `\x19Ethereum Signed Message:\n${Buffer.byteLength(message)}${message}`
  const msgHash = keccak_256(Buffer.from(prefix, 'utf8'))
  const sig = secp256k1.sign(msgHash, priv)
  const rBytes = Buffer.from(sig.r.toString(16).padStart(64, '0'), 'hex')
  const sBytes = Buffer.from(sig.s.toString(16).padStart(64, '0'), 'hex')
  const sigBytes = Buffer.concat([rBytes, sBytes, Buffer.from([sig.recovery! + 27])])
  return '0x' + sigBytes.toString('hex')
}

describeDb('Identity API-002 integration', () => {
  let app: INestApplication
  let svc: IdentityService
  let dataSource: DataSource

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    await app.init()
    svc = app.get(IdentityService)
    dataSource = app.get(DataSource)
    await dataSource.query('TRUNCATE TABLE app.users, app.login_identities, app.devices, app.sessions CASCADE')
  })

  afterAll(async () => {
    if (app) await app.close()
  })

  it('registers, verifies email, and recovers', async () => {
    const reg = await svc.registerEmail('integration@rwa.lat')
    expect(reg.verificationToken).toBeTruthy()
    const verified = await svc.verifyEmail(reg.verificationToken)
    expect(verified.verified).toBe(true)
    const recovered = await svc.recover('integration@rwa.lat')
    expect(recovered.delivered).toBe(true)
  })

  it('opens a session via a valid wallet signature', async () => {
    const priv = secp256k1.utils.randomPrivateKey()
    const pub = secp256k1.getPublicKey(priv, false)
    const address = '0x' + Buffer.from(keccak_256(pub.subarray(1)).subarray(12)).toString('hex')
    const { nonce } = await svc.createWalletChallenge(address)
    const signature = signMessage(address, nonce)
    const result = await svc.verifyWalletSignature(address, signature, nonce)
    expect(result.token).toHaveLength(64)
    expect(result.sessionId).toBeTruthy()
  })
})
