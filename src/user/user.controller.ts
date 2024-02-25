import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Req() req: any,
    @Param('userId') userId: string,
  ): Promise<any> {
    req.session.destroy();
    await this.userService.deleteUser(userId);
    return HttpStatus.NO_CONTENT;
  }
}
