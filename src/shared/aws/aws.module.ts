import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { S3Service } from './s3/s3.service';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { SQSService } from './sqs/sqs.service';

@Module({
  imports: [LoggerModule],
  providers: [S3Service, DynamoDBService, SQSService],
  exports: [S3Service, DynamoDBService, SQSService],
})
export class AwsModule {}
