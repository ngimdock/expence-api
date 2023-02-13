import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // redis connection logic
  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: configService.getOrThrow('REDIS_URL'),
    legacyMode: true,
  });

  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
      }),
    }),
  );

  await redisClient.connect().catch((err) => {
    throw err;
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(3333);
}
bootstrap();
