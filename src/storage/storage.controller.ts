import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async fetchSignedUploadUrl(@Body('contentType') contentType: string) {
    return await this.storageService.getSignedUploadUrl(contentType);
  }

  @Delete('delete')
  async deleteFile(@Query('path') path: string) {
    return await this.storageService.delete(path);
  }
}
