import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class DeviceDto {
  @IsOptional()
  @IsString()
  @Length(8, 128)
  fingerprint?: string

  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string
}

export class WalletChallengeDto {
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  address!: string
}

export class WalletVerifyDto {
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  address!: string

  @IsString()
  @Matches(/^0x[0-9a-fA-F]{130}$/)
  signature!: string

  @IsString()
  nonce!: string

  @IsOptional()
  device?: DeviceDto
}
