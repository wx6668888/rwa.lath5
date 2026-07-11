import { IsIn, IsOptional, IsString, Length } from 'class-validator'
import { DeviceDto } from './wallet.dto'

export class OAuthCallbackDto {
  @IsIn(['google', 'x'])
  provider!: 'google' | 'x'

  @IsString()
  @Length(1, 255)
  subject!: string

  @IsOptional()
  @IsString()
  @Length(1, 80)
  displayName?: string

  @IsOptional()
  @IsString()
  @Length(2, 3)
  locale?: string

  @IsOptional()
  device?: DeviceDto
}
