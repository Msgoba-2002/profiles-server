import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { IUser } from './userTypes';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    const hashedPw = await bcrypt.hash(dto.password, 12);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPw,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUser = await this.prisma.user.update({
      where: { id: user_id },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
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
      },
    });

    return user;
  }

  async getUserByEmail(email: string, getPw: boolean = false): Promise<IUser> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        password: getPw,
      },
    });

    return user;
  }

  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
