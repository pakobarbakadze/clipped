import { Module } from '@nestjs/common';
import { AwsModule } from './aws/aws.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule, AwsModule],
  exports: [LoggerModule, AwsModule],
})
export class SharedModule {}
