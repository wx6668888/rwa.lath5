import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ schema: 'app', name: 'users' })
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id!: string

  @Column({ type: 'varchar', default: 'active' })
  status!: 'active' | 'restricted' | 'suspended' | 'closed'

  @Column({ type: 'varchar', default: 'en' })
  locale!: string

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt!: Date | null
}
