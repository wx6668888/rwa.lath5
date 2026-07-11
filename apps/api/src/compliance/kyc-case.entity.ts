import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

export type KycCaseState =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'needs_information'
  | 'approved'
  | 'rejected'
  | 'expired'

@Entity({ schema: 'app', name: 'kyc_cases' })
export class KycCase {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ type: 'varchar', default: 'not_started' })
  state!: KycCaseState

  @Column({ type: 'varchar' })
  provider!: string

  @Column({ name: 'provider_case_hash', type: 'bytea' })
  providerCaseHash!: Buffer

  @Column({ name: 'provider_case_ciphertext', type: 'bytea' })
  providerCaseCiphertext!: Buffer

  @Column({ name: 'encryption_key_version', type: 'int' })
  encryptionKeyVersion!: number

  @Column({ name: 'reason_code', type: 'varchar', nullable: true })
  reasonCode!: string | null

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt!: Date | null

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt!: Date | null

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
