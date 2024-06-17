import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;

  const app = await NestFactory.create(AppModule);

  const loggerService = app.get(LoggerService);
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  await app.listen(PORT);
}
bootstrap();
