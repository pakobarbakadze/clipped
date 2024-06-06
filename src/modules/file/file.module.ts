import { Module } from '@nestjs/common';
import { VideoModule } from './video/video.module';

@Module({
  imports: [VideoModule],
  exports: [VideoModule],
})
export class FileModule {}
