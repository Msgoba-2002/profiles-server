import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from '../dtos/profile.dtos';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param() params: Record<string, string>): Promise<any> {
    const userId = params.userId;
    return this.profileService.getUserProfile(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Body() dto: CreateProfileDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.profileService.createProfile(userId, {
      ...dto,
    });
  }
}
