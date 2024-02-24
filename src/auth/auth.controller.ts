import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  // Patch,
  Post,
  // Query,
  Redirect,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async register(@Body() dto: CreateUserDto): Promise<any> {
    try {
      const existingUser = await this.userService.getUserByEmail(dto.email);
      if (existingUser) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userService.createUser(dto);
      if (user) {
        await this.authService.sendVerificationEmail(user);
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
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

  // @Patch('verify-email')
  // async verifyEmail(@Query() token: string): Promise<any> {
  //   return await this.authService.verifyEmail(token);
  // }

  @Post('send-verification')
  @UseGuards(AuthenticatedGuard)
  async sendVerification(@Req() req: any): Promise<any> {
    const user = await this.userService.getUserById(req.user.id);
    return await this.authService.sendVerificationEmail(user);
  }

  // @Post('forgot-password')
  // async forgotPassword(): Promise<any> {

  // }

  // @Patch('update-password')
  // async resetPassword(): Promise<any> {

  // }
}
