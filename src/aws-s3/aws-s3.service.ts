import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private awsS3Client: typeof S3Client.prototype;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    this.awsS3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  private getObjectKey(path: string) {
    const pathArray = path.split('/');
    return `${pathArray[pathArray.length - 2]}/${pathArray[pathArray.length - 1]}`;
  }

  public async awsDelete(objPath: string): Promise<any> {
    const objKey = this.getObjectKey(objPath);
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>(this.bucketName),
      Key: objKey,
    });

    const response = await this.awsS3Client.send(command);
    return response;
  }

  public async awsUpload(
    dataBuffer: Buffer,
    fileType: string,
    location: string,
  ): Promise<any> {
    const fileKey = location + uuidV4() + '.' + fileType.split('/')[1];
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: dataBuffer,
    });

    const response = await this.awsS3Client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      return fileKey;
    }
  }

  public async awsGetSignedDownUrl(objPath: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.getObjectKey(objPath),
    });

    const response = getSignedUrl(this.awsS3Client, command, {
      expiresIn: 3600,
    });
    return response;
  }

  public async awsGetSignedUpUrl(
    key: string,
    contentType: string,
  ): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.awsS3Client, command, {
      expiresIn: 1800,
    });
  }
}
