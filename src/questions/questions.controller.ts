import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { UserIsExcoGuard } from '../auth/user.isexco.guard';
import {
  AnswerDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../dtos/question.dtos';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(UserIsExcoGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() dto: CreateQuestionDto): Promise<any> {
    return this.questionsService.createQuestion(dto);
  }

  @Get()
  async getQuestions(): Promise<any> {
    return this.questionsService.getQuestions();
  }

  @Patch(':questionId')
  @UseGuards(UserIsExcoGuard)
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<any> {
    return this.questionsService.updateQuestion(questionId, dto);
  }

  @Delete(':questionId')
  @UseGuards(UserIsExcoGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('questionId') questionId: string): Promise<any> {
    return this.questionsService.deleteQuestion(questionId);
  }

  @Post('answers')
  @HttpCode(HttpStatus.OK)
  async checkAnswers(@Body() dto: AnswerDto[]): Promise<any> {
    return this.questionsService.checkAnswers({ answers: dto });
  }
}
