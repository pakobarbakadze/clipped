import { Injectable } from '@nestjs/common';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class VideoService {
  constructor(private readonly s3Service: S3Service) {}

  public async uploadVideo(file: Buffer, fileName: string) {
    await this.s3Service.uploadFile(file, fileName);
  }
}
