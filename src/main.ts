import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // transform: true,
    }),
  );

  app.use(
    session({
      secret: 'super_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3333);
}
bootstrap();
