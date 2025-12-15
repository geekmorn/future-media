import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const webUrl = configService.get<string>('WEB_URL') ?? 'http://localhost:3000';
  app.enableCors({
    origin: webUrl,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Future Media API')
    .setDescription('API for the Future Media social platform')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Posts', 'Posts management')
    .addTag('Tags', 'Tags management')
    .addTag('Users', 'Users management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT', 4050);
  await app.listen(port);

  logger.debug(`Application is running on: http://localhost:${port}`);
  logger.debug(`API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
