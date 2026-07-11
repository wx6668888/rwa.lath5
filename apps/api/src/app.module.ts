import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { HealthModule } from './health/health.module'
import { ComplianceModule } from './compliance/compliance.module'
import { IdentityModule } from './identity/identity.module'
import { SecurityModule } from './security/security.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : ['.env'],
    }),
    DatabaseModule,
    HealthModule,
    IdentityModule,
    ComplianceModule,
    SecurityModule,
  ],
})
export class AppModule {}
