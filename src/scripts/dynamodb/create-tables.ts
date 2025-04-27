import {
  CreateTableCommand,
  CreateTableCommandInput,
  DynamoDBClient,
  ScalarAttributeType,
} from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

function createDynamoDBClient(): DynamoDBClient {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: isDevelopment ? 'http://localhost:8001' : undefined,
    credentials: isDevelopment
      ? { accessKeyId: 'local', secretAccessKey: 'local' }
      : {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
  });
}

async function createClipsTable(
  client: DynamoDBClient,
  tablePrefix: string,
): Promise<void> {
  const clipsTableParams: CreateTableCommandInput = {
    TableName: `${tablePrefix}clips`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
      { AttributeName: 'username', AttributeType: ScalarAttributeType.S },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'username-index',
        KeySchema: [{ AttributeName: 'username', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };

  try {
    const data = await client.send(new CreateTableCommand(clipsTableParams));
    console.log('Created table:', data.TableDescription.TableName);
  } catch (err) {
    console.error('Error creating clips table:', err);
  }
}

async function createTables(): Promise<void> {
  const client = createDynamoDBClient();
  const tablePrefix = process.env.AWS_DYNAMODB_TABLE_PREFIX || 'clipped_';

  await createClipsTable(client, tablePrefix);
}

createTables()
  .then(() => console.log('Tables created successfully'))
  .catch((err) => console.error('Error in table creation:', err));
