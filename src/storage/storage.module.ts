import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Global()
@Module({
  providers: [StorageService],
  exports: [StorageService],
  imports: [AwsS3Module],
})
export class StorageModule {}
