import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dtos';
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
    if (profile.profile_picture) {
      if (profile.profile_picture.includes('http')) {
        return profile;
      } else {
        const profilePicUrl = await this.storageService.getSignedDownloadUrl(
          profile.profile_picture,
        );
        return { ...profile, profile_picture: profilePicUrl };
      }
    }
    return profile;
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

  async updateProfile(profileId: string, dto: UpdateProfileDto) {
    const updatedProfile = await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: dto,
    });

    return updatedProfile;
  }
}
