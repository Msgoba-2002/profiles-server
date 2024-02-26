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
    return profile;
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    let profilePicPath: string;

    if (dto.profile_picture) {
      try {
        const uploadFilePath = await this.storageService.upload(
          dto.profile_picture,
        );
        profilePicPath = uploadFilePath;
      } catch (err) {
        throw new Error('Failed to upload profile picture');
      }
    }

    const profile = await this.prisma.profile.create({
      data: {
        ...dto,
        profile_picture: profilePicPath,
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
