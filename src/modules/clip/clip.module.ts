import { Module } from '@nestjs/common';
import { ClipsService } from './services/clip.service';
import { AwsModule } from 'src/shared/aws/aws.module';
import { ClipController } from './controllers/clip.controller';
import { ClipProcessorService } from './services/clip-processor.service';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { ClipProcessorController } from './controllers/clip-processor.controller';

@Module({
  imports: [AwsModule, LoggerModule],
  controllers: [ClipController, ClipProcessorController],
  providers: [ClipsService, ClipProcessorService],
  exports: [ClipsService, ClipProcessorService],
})
export class ClipModule {}
