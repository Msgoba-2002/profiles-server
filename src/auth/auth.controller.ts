import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './local.auth.guard';
import { CreateUserDto } from '../dtos';
import { AuthenticatedGuard } from './authenticated.guard';
import { GoogleAuthGuard } from './google.auth.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.createUser(dto);

    // Send verification email
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async googleLoginRedirect(): Promise<any> {
    return {
      url: this.configService.get('APP_FRONTEND_URL') + 'login/success',
      statusCode: 301,
    };
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getLoggedInUser(@Req() req: any): Promise<any> {
    const userObject = await this.userService.getUserById(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      user: userObject,
    };
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: any): Promise<any> {
    await req.session.destroy();
    return {
      statusCode: HttpStatus.OK,
      message: 'Logged out',
    };
  }

  @Patch('verify-email')
  async verifyEmail(@Query() token: string): Promise<any> {
    return await this.authService.verifyEmail(token);
  }

  @Post('send-verification')
  @UseGuards(AuthenticatedGuard)
  async sendVerification(@Req() req: any): Promise<any> {
    const user = await this.userService.getUserById(req.user.id);
    return await this.authService.sendVerificationEmail(user);
  }

  @Post('forgot-password')
  async forgotPassword(): Promise<any> {

  }

  @Patch('update-password')
  async resetPassword(): Promise<any> {

  }
}
