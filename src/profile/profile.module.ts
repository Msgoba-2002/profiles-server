import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { ProfileController } from './profile.controller';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [UserModule, PrismaModule, StorageModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
