import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { StorageController } from './storage.controller';

@Global()
@Module({
  providers: [StorageService],
  exports: [StorageService],
  imports: [AwsS3Module],
  controllers: [StorageController],
})
export class StorageModule {}
