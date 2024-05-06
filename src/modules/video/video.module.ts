import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [AwsModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
