import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class StorageService {
  constructor(
    private readonly s3Service: AwsS3Service,
    private readonly configService: ConfigService,
  ) {}

  public async upload(file: Express.Multer.File) {
    const uploadedFilePath = await this.s3Service.awsUpload(
      file.buffer,
      file.mimetype,
      this.configService.get<string>('AWS_PROFILE_PIC_FOLDER'),
    );

    return uploadedFilePath;
  }

  public async delete(path: string) {
    try {
      await this.s3Service.awsDelete(path);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getSignedDownloadUrl(path: string) {
    if (!path) return null;
    try {
      const url = await this.s3Service.awsGetSignedDownUrl(path);
      return url;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getSignedUploadUrl(contentType: string) {
    const key = uuidV4();
    const url = await this.s3Service.awsGetSignedUpUrl(key, contentType);
    return { url };
  }
}
