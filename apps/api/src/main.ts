import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/http-exception.filter'
import { RequestContextMiddleware } from './common/request-context.middleware'

function parseOrigins(value: string | undefined) {
  return (value ?? 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const prefix = process.env.API_PREFIX ?? 'v1'

  app.use(helmet())
  app.enableCors({ origin: parseOrigins(process.env.CORS_ORIGINS), credentials: true })
  app.use(new RequestContextMiddleware().use)
  app.setGlobalPrefix(prefix)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
  app.useGlobalFilters(new HttpExceptionFilter())

  const openApiConfig = new DocumentBuilder()
    .setTitle('RWA.LAT API')
    .setDescription('Versioned API contracts for the RWA.LAT investment application.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig)
  SwaggerModule.setup('docs', app, openApiDocument, { useGlobalPrefix: true })

  await app.listen(Number(process.env.PORT ?? 4000))
}

void bootstrap()
