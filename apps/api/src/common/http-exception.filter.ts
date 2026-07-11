import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>()
    const isHttpException = exception instanceof HttpException
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = isHttpException ? exception.getResponse() : undefined
    const message = typeof exceptionResponse === 'object' && exceptionResponse && 'message' in exceptionResponse
      ? (exceptionResponse as { message: unknown }).message
      : isHttpException ? exception.message : 'Internal server error'
    const code = typeof exceptionResponse === 'object' && exceptionResponse && 'code' in exceptionResponse
      ? (exceptionResponse as { code: unknown }).code
      : isHttpException ? exception.name : 'INTERNAL_SERVER_ERROR'

    response.status(status).json({
      error: {
        code,
        message,
      },
      requestId: response.locals.requestId,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }
}
