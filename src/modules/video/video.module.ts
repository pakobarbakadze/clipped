import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [SharedModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
