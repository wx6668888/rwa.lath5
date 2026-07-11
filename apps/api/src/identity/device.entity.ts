import { Column, Entity, PrimaryColumn } from 'typeorm'

export type DeviceTrustState = 'untrusted' | 'trusted' | 'revoked'

@Entity({ schema: 'app', name: 'devices' })
export class Device {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'fingerprint_hash', type: 'bytea' })
  fingerprintHash!: Buffer

  @Column({ name: 'trust_state', type: 'varchar', default: 'untrusted' })
  trustState!: DeviceTrustState

  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  displayName!: string | null

  @Column({ name: 'first_seen_at', type: 'timestamptz', default: () => 'now()' })
  firstSeenAt!: Date

  @Column({ name: 'last_seen_at', type: 'timestamptz', default: () => 'now()' })
  lastSeenAt!: Date

  @Column({ name: 'trusted_at', type: 'timestamptz', nullable: true })
  trustedAt!: Date | null

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null
}
