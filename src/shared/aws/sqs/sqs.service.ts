import {
  CreateQueueCommand,
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class SQSService {
  private readonly SQSClient: SQSClient;
  private readonly queueUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    this.SQSClient = new SQSClient({
      region: this.configService.get('AWS_REGION'),
      endpoint: isDevelopment ? 'http://sqs-local:9324' : undefined,
      credentials: isDevelopment
        ? { accessKeyId: 'local', secretAccessKey: 'local' }
        : {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
          },
    });

    // Get queue URL based on environment
    this.queueUrl = isDevelopment
      ? 'http://sqs-local:9324/queue/video-processing'
      : this.configService.get('AWS_SQS_QUEUE_URL');
  }

  async onModuleInit() {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    if (isDevelopment) {
      try {
        const createQueueCommand = new CreateQueueCommand({
          QueueName: 'video-processing',
        });
        await this.SQSClient.send(createQueueCommand);
        this.logger.log('Created SQS queue: video-processing');
      } catch (error) {
        this.logger.warn(
          `Queue already exists or couldn't be created: ${error.message}`,
        );
      }
    }
  }

  async sendMessage(messageBody: any): Promise<string> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(messageBody),
      });

      const response = await this.SQSClient.send(command);
      this.logger.log(`Message sent to SQS: ${response.MessageId}`);

      return response.MessageId;
    } catch (error) {
      this.logger.error(
        `Error sending message to SQS: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async receiveMessages(maxMessages = 10) {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20, // Long polling
      });

      const response = await this.SQSClient.send(command);
      return response.Messages || [];
    } catch (error) {
      this.logger.error(
        `Error receiving messages from SQS: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteMessage(receiptHandle: string) {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.SQSClient.send(command);
      this.logger.log(`Message deleted from SQS: ${receiptHandle}`);
    } catch (error) {
      this.logger.error(
        `Error deleting message from SQS: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
