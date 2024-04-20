import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CheckAnswerDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../dtos/question.dtos';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(dto: CreateQuestionDto): Promise<any> {
    const question = await this.prisma.question.create({
      data: dto,
    });

    return question;
  }

  async getQuestions(): Promise<any> {
    const questions = await this.prisma.question.findMany({
      select: {
        id: true,
        question: true,
        options: true,
      },
    });

    return questions;
  }

  async updateQuestion(
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<any> {
    const updatedQuestion = await this.prisma.question.update({
      where: { id: questionId },
      data: dto,
    });

    return updatedQuestion;
  }

  async deleteQuestion(questionId: string): Promise<any> {
    return await this.prisma.question.delete({
      where: { id: questionId },
    });
  }

  async checkAnswers(dto: CheckAnswerDto): Promise<any> {
    const questions = await this.prisma.question.findMany({
      select: {
        id: true,
        correct_option: true,
      },
    });
    let score = 0;
    const { answers, userId } = dto;
    answers.forEach((answer) => {
      const question = questions.find((ques) => ques.id === answer.question_id);
      if (question.correct_option === answer.provided_answer) {
        score++;
      }
    });

    if (score === questions.length) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { questions_verified: true },
      });

      return {
        message: 'Congratulations! You have passed the test.',
        success: true,
      };
    }

    return {
      message: 'Sorry! You have failed the test.',
      success: false,
    };
  }
}
