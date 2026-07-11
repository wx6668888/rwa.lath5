import { Controller, Get, ServiceUnavailableException, Res } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger'
import { API_ERROR_CODES } from '@rwa-lat/contracts'
import type { Response } from 'express'
import { DataSource } from 'typeorm'

@ApiTags('system')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Liveness check' })
  @ApiOkResponse({ description: 'The API process is accepting requests.' })
  live(@Res({ passthrough: true }) response: Response) {
    return this.status('ok', response)
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiOkResponse({ description: 'The API is ready for traffic.' })
  @ApiServiceUnavailableResponse({ description: 'A required dependency is unavailable.' })
  async ready(@Res({ passthrough: true }) response: Response) {
    try {
      await this.dataSource.query('SELECT 1')
    } catch {
      throw new ServiceUnavailableException({
        code: API_ERROR_CODES.DATABASE_UNAVAILABLE,
        message: 'The database is not ready.',
      })
    }

    return this.status('ready', response)
  }

  private status(status: 'ok' | 'ready', response: Response) {
    return {
      status,
      service: 'rwa-lat-api',
      requestId: response.locals.requestId,
      timestamp: new Date().toISOString(),
    }
  }
}
