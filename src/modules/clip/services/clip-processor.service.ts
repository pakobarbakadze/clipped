import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSService } from 'src/shared/aws/sqs/sqs.service';
import { ClipsService } from './clip.service';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class ClipProcessorService {
  private readonly tableName: string;
  private isProcessing: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly SQSService: SQSService,
    private readonly clipsService: ClipsService,
    private readonly logger: LoggerService,
  ) {
    this.tableName = `${this.configService.get('AWS_DYNAMODB_TABLE_PREFIX')}clips`;
  }

  async startProcessing(): Promise<void> {
    if (this.isProcessing) {
      this.logger.log('Clip processing is already running.');
      return;
    }

    this.isProcessing = true;
    this.logger.log('Starting clip processing...');
    await this.processMessages();
  }

  async processMessages(): Promise<void> {
    try {
      while (this.isProcessing) {
        const messages = await this.SQSService.receiveMessages(5);

        if (messages.length === 0) {
          this.logger.log('No messages to process, waiting...');
          continue;
        }

        for (const message of messages) {
          await this.processMessage(message);
          await this.SQSService.deleteMessage(message.ReceiptHandle);
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in clip processor: ${error.message}`,
        error.stack,
      );
      this.isProcessing = false;
    }
  }

  async processMessage(message: any): Promise<void> {
    try {
      const { clipId, videoKey, tasks } = JSON.parse(message.Body);
      this.logger.log(`Processing clip ${clipId} with tasks: ${tasks}`);

      await this.simulateProcessingTasks(clipId, videoKey, tasks);

      await this.clipsService.updateClipStatus(clipId, 'completed', {
        processedAt: new Date().toISOString(),
        duration: Math.floor(Math.random() * 600),
        resolution: '1920x1080',
      });

      this.logger.log(`Processed clip ${clipId} successfully`);
    } catch (error) {
      this.logger.error(
        `Error processing message: ${error.message}`,
        error.stack,
      );
    }
  }

  private async simulateProcessingTasks(
    clipId: string,
    videoKey: string,
    tasks: string[],
  ): Promise<void> {
    const processingTime = Math.floor(Math.random() * 7000) + 3000;
    this.logger.log(
      `Starting processing of ${clipId}, will take ${processingTime}ms`,
    );

    await new Promise((resolve) => setTimeout(resolve, processingTime / 3));
    await this.clipsService.updateClipStatus(clipId, 'transcoding');

    await new Promise((resolve) => setTimeout(resolve, processingTime / 3));
    await this.clipsService.updateClipStatus(clipId, 'generating_thumbnails');

    await new Promise((resolve) => setTimeout(resolve, processingTime / 3));
  }

  stopProcessing(): void {
    this.isProcessing = false;
    this.logger.log('Clip processor stopped');
  }
}
