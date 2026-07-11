import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator'

export class RegisterEmailDto {
  @IsEmail()
  email!: string

  @IsOptional()
  @IsString()
  @Length(2, 3)
  locale?: string
}
