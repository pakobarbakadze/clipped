import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
