import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  public async uploadFile(file: Buffer, fileName: string) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: `videos/${fileName}`,
          Body: file,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
