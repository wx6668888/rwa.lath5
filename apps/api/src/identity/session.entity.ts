import { Column, Entity, PrimaryColumn } from 'typeorm'

export type SessionState = 'active' | 'revoked' | 'expired'

@Entity({ schema: 'app', name: 'sessions' })
export class Session {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'device_id', type: 'uuid', nullable: true })
  deviceId!: string | null

  @Column({ name: 'token_hash', type: 'bytea' })
  tokenHash!: Buffer

  @Column({ type: 'varchar', default: 'active' })
  state!: SessionState

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date

  @Column({ name: 'last_seen_at', type: 'timestamptz', default: () => 'now()' })
  lastSeenAt!: Date

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null

  @Column({ name: 'revoke_reason', type: 'varchar', nullable: true })
  revokeReason!: string | null
}
