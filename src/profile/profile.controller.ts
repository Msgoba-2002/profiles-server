import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from '../dtos/profile.dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param() params: Record<string, string>): Promise<any> {
    const userId = params.userId;
    return this.profileService.getUserProfile(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('profile_picture'))
  async createProfile(
    @Body() dto: CreateProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })
        .addMaxSizeValidator({ maxSize: 5_000_000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.profileService.createProfile(userId, {
      ...dto,
      profile_picture: file,
    });
  }
}
