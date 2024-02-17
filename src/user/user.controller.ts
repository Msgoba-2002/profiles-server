import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async createUser(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.createUser(dto);
  }

  @Patch(':userId')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async updateUser(
    @Body() dto: CreateUserDto,
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.userService.updateUser({ ...dto, user_id: userId });
  }
}
