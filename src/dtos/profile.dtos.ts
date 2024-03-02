import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  occupation_status: string;

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

  @IsDate()
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
