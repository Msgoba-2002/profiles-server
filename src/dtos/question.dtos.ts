import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  question: string;

  @IsArray()
  @IsNotEmpty()
  @MinLength(3, { each: true })
  options: string[];

  @IsNumber()
  @IsNotEmpty()
  correct_option: number;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsNumber()
  @IsNotEmpty()
  provided_answer: number;
}

export class CheckAnswerDto {
  @IsArray()
  @IsNotEmpty()
  answers: AnswerDto[];
}
