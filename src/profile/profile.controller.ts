import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dtos';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserIsOwnerGuard } from '../auth/user.isowner.guard';

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

  @UseGuards(AuthenticatedGuard, UserIsOwnerGuard)
  @Patch(':userId/:profileId')
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
      skipNullProperties: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @Param('profileId') profileId: string,
  ): Promise<any> {
    return this.profileService.updateProfile(profileId, dto);
  }
}
