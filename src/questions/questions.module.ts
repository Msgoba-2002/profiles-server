import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [AuthModule, PrismaModule],
})
export class QuestionsModule {}
