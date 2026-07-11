import { ArgumentsHost, ServiceUnavailableException } from '@nestjs/common'
import { API_ERROR_CODES } from '@rwa-lat/contracts'
import { HttpExceptionFilter } from '../src/common/http-exception.filter'

describe('HTTP exception envelope', () => {
  it('preserves a stable domain error code', () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/v1/health/ready' }),
        getResponse: () => ({ locals: { requestId: 'request-123' }, status }),
      }),
    } as unknown as ArgumentsHost

    new HttpExceptionFilter().catch(
      new ServiceUnavailableException({
        code: API_ERROR_CODES.DATABASE_UNAVAILABLE,
        message: 'The database is not ready.',
      }),
      host,
    )

    expect(status).toHaveBeenCalledWith(503)
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: {
          code: API_ERROR_CODES.DATABASE_UNAVAILABLE,
          message: 'The database is not ready.',
        },
        requestId: 'request-123',
        path: '/v1/health/ready',
      }),
    )
  })
})
