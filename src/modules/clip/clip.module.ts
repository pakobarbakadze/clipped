import { Module } from '@nestjs/common';
import { ClipsService } from './services/clip.service';
import { AwsModule } from 'src/shared/aws/aws.module';
import { ClipController } from './controllers/clip.controller';

@Module({
  imports: [AwsModule],
  controllers: [ClipController],
  providers: [ClipsService],
  exports: [ClipsService],
})
export class ClipModule {}
