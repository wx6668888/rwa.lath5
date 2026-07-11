import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'
export type RiskFlagState = 'open' | 'under_review' | 'resolved' | 'dismissed'

@Entity({ schema: 'app', name: 'risk_flags' })
export class RiskFlag {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ type: 'varchar' })
  category!: string

  @Column({ type: 'varchar' })
  severity!: RiskSeverity

  @Column({ type: 'varchar', default: 'open' })
  state!: RiskFlagState

  @Column({ type: 'varchar' })
  source!: string

  @Column({ name: 'reason_code', type: 'varchar' })
  reasonCode!: string

  @Column({ name: 'opened_at', type: 'timestamptz', default: () => 'now()' })
  openedAt!: Date

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt!: Date | null
}
