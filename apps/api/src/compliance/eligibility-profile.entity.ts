import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

export type EligibilityDecision = 'browse_only' | 'ineligible' | 'eligible' | 'manual_review'

@Entity({ schema: 'app', name: 'eligibility_profiles' })
export class EligibilityProfile {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'policy_version', type: 'varchar' })
  policyVersion!: string

  @Column({ name: 'product_scope', type: 'varchar' })
  productScope!: string

  @Column({ type: 'varchar', default: 'browse_only' })
  decision!: EligibilityDecision

  @Column({ name: 'reason_codes', type: 'text', array: true, default: () => `'{}'` })
  reasonCodes!: string[]

  @Column({ name: 'evidence_references', type: 'jsonb', default: () => `'{}'` })
  evidenceReferences!: Record<string, unknown>

  @Column({ name: 'decided_at', type: 'timestamptz', default: () => 'now()' })
  decidedAt!: Date

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
