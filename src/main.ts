import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const { PORT, COOKIE_SECRET } = process.env;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  SwaggerConfigInit(app);
  app.use(cookieParser(COOKIE_SECRET));

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`swagger : http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
