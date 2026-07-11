import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { buildDatabaseOptions } from './database-options'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => buildDatabaseOptions(process.env),
    }),
  ],
})
export class DatabaseModule {}
