import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @ValidateIf((o) => !!o.password)
  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirm_password?: string;

  @IsOptional()
  @IsBoolean()
  questions_verified?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsString()
  pw_reset_token?: string;
}
