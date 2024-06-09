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

  async getUserProfile(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        nickname: true,
        profile_picture: true,
        occupation_status: true,
        occupation: true,
        place_of_work: true,
        hobbies: true,
        birthday: true,
        marital_status: true,
        final_class: true,
        // current_position: true,
        bio: true,
        place_of_residence: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
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

  async getRandomProfiles(count: number, userId: string) {
    const allUsersWithProfiles = await this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        Profile: {
          select: {
            id: true,
            nickname: true,
            profile_picture: true,
          },
        },
      },
      where: {
        Profile: { isNot: null },
        id: { not: userId },
      },
    });

    let usersToParse = allUsersWithProfiles;
    if (count < allUsersWithProfiles.length) {
      // Pick random users from the list
      const indexesToPick = [];
      while (indexesToPick.length < count) {
        const randomIndex = Math.floor(
          Math.random() * allUsersWithProfiles.length,
        );
        if (!indexesToPick.includes(randomIndex)) {
          indexesToPick.push(randomIndex);
        }
      }

      usersToParse = indexesToPick.map((index) => allUsersWithProfiles[index]);
    }

    const profilesWithSignedUrls = await Promise.all(
      usersToParse.map(async (user) => {
        if (user.Profile.profile_picture) {
          if (user.Profile.profile_picture.includes('http')) {
            return user;
          } else {
            const profilePicUrl =
              await this.storageService.getSignedDownloadUrl(
                user.Profile.profile_picture,
              );
            user.Profile.profile_picture = profilePicUrl;
            return user;
          }
        }
      }),
    );

    return { profiles: profilesWithSignedUrls };
  }
}
