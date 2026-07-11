import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateApplicationSchema1783742400000 implements MigrationInterface {
  name = 'CreateApplicationSchema1783742400000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS app')
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP SCHEMA IF EXISTS app')
  }
}
