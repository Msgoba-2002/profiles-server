import { Module } from '@nestjs/common';
import { ProtoProfileService } from './proto-profile.service';
import { ProtoProfileController } from './proto-profile.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ProtoProfileService],
  controllers: [ProtoProfileController],
  imports: [PrismaModule],
})
export class ProtoProfileModule {}
