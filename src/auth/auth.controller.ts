import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
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
import {
  IReqPasswordReset,
  IResetPassword,
  IVerifyEmail,
} from '../dtos/authDtos';

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
  @HttpCode(HttpStatus.OK)
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
  async googleLoginRedirect(@Request() req): Promise<any> {
    return {
      url: this.configService.get('APP_FRONTEND_URL') + '/user/' + req.user.id,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: any): Promise<any> {
    await req.session.destroy();
    return HttpStatus.NO_CONTENT;
  }

  @Patch('verify-email')
  async verifyEmail(@Body() dto: IVerifyEmail): Promise<any> {
    const { token } = dto;
    try {
      await this.authService.verifyEmail(token);
      return {
        statusCode: HttpStatus.OK,
        message: 'Email verified successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('send-verification')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  async sendVerification(@Req() req: any): Promise<any> {
    const user = await this.userService.getUserById(req.user.id);
    await this.authService.sendVerificationEmail(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Verification email sent',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: IReqPasswordReset): Promise<any> {
    const { email } = dto;
    try {
      const user = await this.userService.getUserByEmail(email, false);
      if (!user) {
        return {
          statusCode: HttpStatus.OK,
        };
      }

      await this.authService.sendForgotPasswordEmail(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset email sent',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('update-password')
  async resetPassword(@Body() dto: IResetPassword): Promise<any> {
    const { token, password } = dto;

    try {
      await this.authService.updatePassword(token, password);
      return {
        statusCode: HttpStatus.OK,
        message: 'Password updated successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
