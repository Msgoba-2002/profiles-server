import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { IUser } from './userTypes';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
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

  async updateUser(dto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: dto.user_id },
      data: dto,
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

  async getUserById(userId: string) {
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

  async getUserByEmail(email: string, getPw: boolean = false) {
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
}
