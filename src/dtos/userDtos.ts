import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

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

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
