import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from '../dtos/profile.dtos';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getUserProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    const profilePicUrl = await this.storageService.getSignedDownloadUrl(
      profile.profile_picture,
    );
    return { ...profile, profile_picture: profilePicUrl };
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return profile;
  }
}
