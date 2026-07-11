import type { Response } from 'express'
import type { DataSource } from 'typeorm'
import { API_ERROR_CODES } from '@rwa-lat/contracts'
import { HealthController } from '../src/health/health.controller'

describe('database readiness', () => {
  const response = { locals: { requestId: 'request-123' } } as unknown as Response

  it('reports ready only after PostgreSQL answers a probe', async () => {
    const query = jest.fn().mockResolvedValue([{ '?column?': 1 }])
    const controller = new HealthController({ query } as unknown as DataSource)

    await expect(controller.ready(response)).resolves.toMatchObject({
      status: 'ready',
      requestId: 'request-123',
    })
    expect(query).toHaveBeenCalledWith('SELECT 1')
  })

  it('reports a stable unavailable error when PostgreSQL cannot answer', async () => {
    const query = jest.fn().mockRejectedValue(new Error('connection lost'))
    const controller = new HealthController({ query } as unknown as DataSource)

    await expect(controller.ready(response)).rejects.toMatchObject({
      response: {
        code: API_ERROR_CODES.DATABASE_UNAVAILABLE,
        message: 'The database is not ready.',
      },
    })
  })
})
