import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 4050);

  await app.listen(port);


  logger.debug(`Application is running on: http://localhost:${port}`);
  logger.debug(`Documentation: http://localhost:${port}/docs`);
}
bootstrap();
