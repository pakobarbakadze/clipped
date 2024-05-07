import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AwsModule } from '../aws/aws.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [AwsModule, SharedModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
