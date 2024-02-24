import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserIsOwnerGuard } from '../auth/user.isowner.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthenticatedGuard, UserIsOwnerGuard)
  @Patch(':userId')
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
      skipNullProperties: true,
    }),
  )
  async updateUser(
    @Body() dto: UpdateUserDto,
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.userService.updateUser({ data: dto, user_id: userId });
  }

  @UseGuards(AuthenticatedGuard, UserIsOwnerGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<any> {
    await this.userService.deleteUser(userId);
    return HttpStatus.NO_CONTENT;
  }
}
