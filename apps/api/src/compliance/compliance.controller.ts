import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ComplianceService } from './compliance.service'
import {
  DecideKycDto,
  EvaluateEligibilityDto,
  OpenRiskFlagDto,
  ResolveRiskFlagDto,
  ScreenDto,
  StartKycDto,
  SubmitKycDto,
} from './dto/compliance.dto'

@ApiTags('compliance')
@Controller('v1/compliance')
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Post('kyc/start')
  startKyc(@Body() dto: StartKycDto) {
    return this.service.startKyc('demo-user', dto.provider)
  }

  @Post('kyc/submit')
  submitKyc(@Body() dto: SubmitKycDto) {
    return this.service.submitKyc('demo-user', dto.providerCaseRef)
  }

  @Post('kyc/:caseId/decision')
  decideKyc(@Param('caseId') caseId: string, @Body() dto: DecideKycDto) {
    return this.service.decideKyc(caseId, dto.decision, dto.reasonCode)
  }

  @Get('kyc/status')
  kycStatus() {
    return this.service.getKycStatus('demo-user')
  }

  @Post('screening')
  screen(@Body() dto: ScreenDto) {
    return this.service.screen('demo-user', dto.kind, dto.identifiers ?? {})
  }

  @Get('screening')
  listScreening() {
    return this.service.listScreening('demo-user')
  }

  @Post('eligibility/evaluate')
  evaluate(@Body() dto: EvaluateEligibilityDto) {
    return this.service.evaluateEligibility('demo-user', dto.productScope, dto.region)
  }

  @Get('eligibility/:productScope')
  getEligibility(@Param('productScope') productScope: string) {
    return this.service.getEligibility('demo-user', productScope)
  }

  @Post('risk-flags')
  openRiskFlag(@Body() dto: OpenRiskFlagDto) {
    return this.service.openRiskFlag('demo-user', dto.category, dto.severity, dto.source, dto.reasonCode)
  }

  @Put('risk-flags/:id')
  resolveRiskFlag(@Param('id') id: string, @Body() dto: ResolveRiskFlagDto) {
    return this.service.resolveRiskFlag(id, dto.state)
  }
}
