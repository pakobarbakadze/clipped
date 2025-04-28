import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class DynamoDBService {
  private readonly docClient: DynamoDBDocumentClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    const dynamoClient = new DynamoDBClient({
      region: this.configService.get('AWS_REGION'),
      endpoint: isDevelopment ? 'http://dynamodb-local:8000' : undefined,
      credentials: isDevelopment
        ? { accessKeyId: 'local', secretAccessKey: 'local' }
        : {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
          },
    });

    this.docClient = DynamoDBDocumentClient.from(dynamoClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      },
    });
  }

  async putItem(tableName: string, item: Record<string, any>) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });

      return await this.docClient.send(command);
    } catch (error) {
      this.logger.error(
        `Error putting item in DynamoDB: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to put item in DynamoDB: ${error.message}`);
    }
  }

  async getItem(tableName: string, key: Record<string, any>) {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });

      return await this.docClient.send(command);
    } catch (error) {
      this.logger.error(
        `Error getting item from DynamoDB: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to get item from DynamoDB: ${error.message}`);
    }
  }

  async deleteItem(tableName: string, key: Record<string, any>) {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
      });

      return await this.docClient.send(command);
    } catch (error) {
      this.logger.error(
        `Error deleting item from DynamoDB: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to delete item from DynamoDB: ${error.message}`);
    }
  }

  async queryItems(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    indexName?: string,
  ) {
    try {
      const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ...(indexName && { IndexName: indexName }),
      });

      return await this.docClient.send(command);
    } catch (error) {
      this.logger.error(
        `Error querying items from DynamoDB: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to query items from DynamoDB: ${error.message}`);
    }
  }

  async updateItem(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeNames: Record<string, string>,
    expressionAttributeValues: Record<string, any>,
  ) {
    try {
      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      return await this.docClient.send(command);
    } catch (error) {
      this.logger.error(
        `Error updating item in DynamoDB: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to update item in DynamoDB: ${error.message}`);
    }
  }
}
