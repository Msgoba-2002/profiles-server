import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';

export interface IVerifyEmail {
  token: string;
}

export class IReqPasswordReset {
  @IsString()
  @IsEmail()
  email: string;
}

export class IResetPassword {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ValidateIf((o) => !!o.password)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Match('password')
  confirm_password: string;
}
