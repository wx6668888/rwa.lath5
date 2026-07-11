import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

export type ScreeningKind = 'sanctions' | 'pep' | 'adverse_media' | 'wallet_risk'
export type ScreeningState = 'pending' | 'clear' | 'potential_match' | 'confirmed_match' | 'dismissed'

@Entity({ schema: 'app', name: 'screening_cases' })
export class ScreeningCase {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ type: 'varchar' })
  kind!: ScreeningKind

  @Column({ type: 'varchar', default: 'pending' })
  state!: ScreeningState

  @Column({ type: 'varchar' })
  provider!: string

  @Column({ name: 'provider_reference_hash', type: 'bytea', nullable: true })
  providerReferenceHash!: Buffer | null

  @Column({ name: 'reason_code', type: 'varchar', nullable: true })
  reasonCode!: string | null

  @Column({ name: 'opened_at', type: 'timestamptz', default: () => 'now()' })
  openedAt!: Date

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt!: Date | null
}
