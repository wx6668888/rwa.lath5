import { Body, Controller, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IdentityService } from './identity.service'
import { RegisterEmailDto } from './dto/register-email.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { RecoverDto } from './dto/recover.dto'
import { OAuthCallbackDto } from './dto/oauth-callback.dto'
import { WalletChallengeDto, WalletVerifyDto } from './dto/wallet.dto'

@ApiTags('identity')
@Controller('auth')
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}

  @Post('register/email')
  @ApiOperation({ summary: 'Register a new account with an email address' })
  @ApiCreatedResponse({ description: 'Account created; email verification required.' })
  async registerEmail(@Body() dto: RegisterEmailDto) {
    const result = await this.identity.registerEmail(dto.email, dto.locale)
    return { userId: result.userId, verificationToken: result.verificationToken }
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify an email using the verification token' })
  @ApiOkResponse({ description: 'Email verified.' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.identity.verifyEmail(dto.token)
  }

  @Post('wallet/challenge')
  @ApiOperation({ summary: 'Issue a single-use nonce for wallet signature' })
  @ApiOkResponse({ description: 'Challenge nonce issued.' })
  async walletChallenge(@Body() dto: WalletChallengeDto) {
    return this.identity.createWalletChallenge(dto.address)
  }

  @Post('wallet/verify')
  @ApiOperation({ summary: 'Verify wallet signature and open a session' })
  @ApiOkResponse({ description: 'Wallet authenticated; session issued.' })
  async walletVerify(@Body() dto: WalletVerifyDto) {
    return this.identity.verifyWalletSignature(dto.address, dto.signature, dto.nonce, dto.device)
  }

  @Post('oauth/:provider')
  @ApiOperation({ summary: 'Sign in or bind via Google / X OAuth subject' })
  @ApiOkResponse({ description: 'OAuth identity resolved; session issued.' })
  async oauth(@Param('provider') provider: string, @Body() dto: OAuthCallbackDto) {
    if (dto.provider !== provider) {
      return this.identity.oauthLogin(dto.provider, dto.subject, {
        displayName: dto.displayName,
        locale: dto.locale,
        device: dto.device,
      })
    }
    return this.identity.oauthLogin(provider as 'google' | 'x', dto.subject, {
      displayName: dto.displayName,
      locale: dto.locale,
      device: dto.device,
    })
  }

  @Post('recover')
  @ApiOperation({ summary: 'Request an account recovery token' })
  @ApiOkResponse({ description: 'Recovery request processed.' })
  async recover(@Body() dto: RecoverDto) {
    return this.identity.recover(dto.email)
  }

  @Post('logout')
  @ApiOperation({ summary: 'Revoke the current session' })
  @ApiOkResponse({ description: 'Session revoked.' })
  async logout(@Body() body: { sessionId: string; token: string }) {
    return this.identity.revokeSession(body.sessionId, body.token)
  }
}
