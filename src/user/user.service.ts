import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { IUser, IUserWithoutPass } from './userTypes';
import * as bcrypt from 'bcryptjs';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserObject } from '../types/user';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<IUserWithoutPass> {
    let userCreationData = {};
    if (dto.source === 'email') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { source, password, confirm_password, ...rest } = dto;
      const hashedPw = await bcrypt.hash(password, 12);
      userCreationData = {
        ...rest,
        password: hashedPw,
      };
    } else if (dto.source === 'google') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { source, ...rest } = dto;
      userCreationData = { ...rest, password: uuidv4(), email_verified: true };
    }
    const newUser = await this.prisma.user.create({
      data: userCreationData as CreateUserObject,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        email_verified: true,
        questions_verified: true,
      },
    });
    return newUser;
  }

  async updateUser({
    data,
    user_id,
  }: {
    data: UpdateUserDto;
    user_id: string;
  }): Promise<IUser> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user_id },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        email_verified: true,
        questions_verified: true,
      },
    });

    return updatedUser;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        email_verified: true,
        questions_verified: true,
        Profile: true,
      },
    });

    if (user && user.Profile && user.Profile.profile_picture) {
      user.Profile.profile_picture = await this.storage.getSignedDownloadUrl(
        user.Profile.profile_picture,
      );
    }
    return user;
  }

  async getUserByEmail(
    email: string,
    getPw: boolean = false,
    getPwReset = false,
  ): Promise<IUser> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        password: getPw,
        email_verified: true,
        questions_verified: true,
        pw_reset_token: getPwReset,
      },
    });

    return user;
  }

  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUserPosition(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Profile: {
          select: {
            id: true,
            current_position: true,
          },
        },
      },
    });

    return user?.Profile?.current_position;
  }
}
