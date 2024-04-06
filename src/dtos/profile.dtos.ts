import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(11)
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  occupation_status: string;

  @ValidateIf((o) => o.occupation_status !== 'Unemployed')
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsOptional()
  @IsString()
  place_of_work?: string;

  @IsArray()
  @IsNotEmpty()
  @MaxLength(20, { each: true })
  hobbies: string[];

  @IsDateString()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  marital_status: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  final_class?: string;

  @IsOptional()
  @IsString()
  current_position?: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsString()
  @IsNotEmpty()
  place_of_residence: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
