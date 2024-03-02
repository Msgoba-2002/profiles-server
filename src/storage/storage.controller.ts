import { Body, Controller, Get } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('upload-url')
  async getSignedUploadUrl(@Body('contentType') contentType: string) {
    return await this.storageService.getSignedUploadUrl(contentType);
  }
}
