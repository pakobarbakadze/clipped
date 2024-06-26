import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/shared/aws/s3/s3.service';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly logger: LoggerService,
  ) {}

  public async uploadVideo(file: Buffer, fileName: string) {
    await this.s3Service.uploadFile(file, fileName);
  }

  public async downloadVideo(fileName: string) {
    this.logger.error('Not implemented');
  }
}
