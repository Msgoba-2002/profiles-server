import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('APP_FRONTEND_URL'),
    credentials: true,
  });

  const redisUrl = configService.get('REDIS_URL');
  let redisConfig;
  if (redisUrl) {
    redisConfig = redisUrl;
  } else {
    redisConfig = {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    };
  }
  const redisClient = new Redis(redisConfig);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RedisStore = require('connect-redis').default;

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
  });

  const sessionSecret = configService.get('SESSION_SECRET');
  const port = configService.get('PORT') || 8080;
  const inProd = !configService.get('APP_FRONTEND_URL').includes('localhost');
  app.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: sessionSecret,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: inProd,
        sameSite: 'lax',
        domain: configService.get('COOKIE_DOMAIN'),
      },
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.setGlobalPrefix('api/v1');
  app.set('trust proxy', true);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port, '0.0.0.0');
}
bootstrap();
