import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBService } from 'src/shared/aws/dynamodb/dynamodb.service';
import { S3Service } from 'src/shared/aws/s3/s3.service';
import { SQSService } from 'src/shared/aws/sqs/sqs.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClipsService {
  private readonly tableName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly SQSService: SQSService,
    private readonly s3Service: S3Service,
  ) {
    this.tableName = `${this.configService.get('AWS_DYNAMODB_TABLE_PREFIX')}clips`;
  }

  async createClip(
    title: string,
    username: string,
    videoFile: Buffer,
    fileName: string,
  ) {
    const clipId = uuidv4();
    const videoKey = `${clipId}-${fileName}`;

    const clip = {
      id: clipId,
      title,
      username,
      videoKey,
      createdAt: new Date().toISOString(),
      status: 'processing',
    };

    await this.dynamoDBService.putItem(this.tableName, clip);

    await this.s3Service.uploadFile(videoFile, videoKey);

    await this.SQSService.sendMessage({
      clipId,
      videoKey,
      tasks: ['transcode', 'thumbnail', 'metadata'],
    });

    return clip;
  }

  async getClip(id: string) {
    const result = await this.dynamoDBService.getItem(this.tableName, { id });

    if (!result.Item) {
      throw new Error(`Clip with id ${id} not found`);
    }

    const videoKey = result.Item.videoKey;
    const videoStream = await this.s3Service.getFileStream(videoKey);

    return {
      metadata: result.Item,
      videoStream,
    };
  }

  async getUserClips(username: string) {
    const result = await this.dynamoDBService.queryItems(
      this.tableName,
      'username = :username',
      { ':username': username },
      'username-index',
    );

    return result.Items;
  }

  async deleteClip(id: string) {
    const result = await this.dynamoDBService.getItem(this.tableName, { id });

    if (result.Item?.videoKey) {
      await this.s3Service.deleteFile(result.Item.videoKey);
    }

    await this.dynamoDBService.deleteItem(this.tableName, { id });
  }

  async updateClipStatus(
    clipId: string,
    status: string,
    metadata?: Record<string, any>,
  ) {
    let updateExpression = 'SET #status = :status';
    const expressionAttributeNames = { '#status': 'status' };
    const expressionAttributeValues = { ':status': status };

    if (metadata) {
      Object.keys(metadata).forEach((key) => {
        updateExpression += `, #${key} = :${key}`;
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = metadata[key];
      });
    }

    await this.dynamoDBService.updateItem(
      this.tableName,
      { id: clipId },
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
  }
}
