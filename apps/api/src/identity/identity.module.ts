import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IdentityController } from './identity.controller'
import { IdentityCrypto } from './identity-crypto.service'
import { IdentityService } from './identity.service'
import { Device } from './device.entity'
import { LoginIdentity } from './login-identity.entity'
import { Session } from './session.entity'
import { User } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginIdentity, Device, Session])],
  controllers: [IdentityController],
  providers: [IdentityService, IdentityCrypto],
  exports: [IdentityService],
})
export class IdentityModule {}
