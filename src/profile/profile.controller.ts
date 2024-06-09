import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dtos';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserIsOwnerGuard } from '../auth/user.isowner.guard';
import { use } from 'passport';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':profileId')
  async getProfile(@Param() params: Record<string, string>): Promise<any> {
    const profileId = params.profileId;
    return this.profileService.getUserProfile(profileId);
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

  @UseGuards(AuthenticatedGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getRandomProfiles(
    @Query('count') count: string,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.profileService.getRandomProfiles(+count, userId);
  }
}
