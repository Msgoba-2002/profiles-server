import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './local.auth.guard';
import { CreateUserDto } from '../dtos';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.createUser(dto);
  }

  @UseGuards(LocalAuthGuard, AuthenticatedGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('google')
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }
}
