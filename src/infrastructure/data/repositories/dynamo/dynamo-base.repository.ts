import { Item } from 'aws-sdk/clients/simpledb';
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

export abstract class BaseDynamoDbRepository {
  protected abstract readonly tableName: string;
  protected readonly dynamoDb: DynamoDBDocumentClient;

  constructor() {
    console.log('Initializing DynamoDB configuration with IRSA');

    // Log environment variables for debugging
    console.log('Configured Region:', process.env.AWS_REGION);
    console.log('IAM Role ARN:', process.env.AWS_ROLE_ARN);
    console.log('Token file path:', process.env.AWS_WEB_IDENTITY_TOKEN_FILE);

    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);

    this.testConnection();
  }

  private async testConnection() {
    try {
      const data = await this.dynamoDb.send(
        new ScanCommand({ TableName: this.tableName }),
      );
      console.log(`Items in table ${this.tableName}:`, data.Items);
    } catch (error) {
      console.error(
        `Error connecting to DynamoDB for table ${this.tableName}:`,
        error,
      );
    }
  }

  async create(item: PutItemInputAttributeMap): Promise<void> {
    console.log('Create method called');
    console.log(this.dynamoDb.config.credentials);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    await this.dynamoDb.send(command);
  }

  async read(id: string): Promise<Item | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    const result = await this.dynamoDb.send(command);
    return (result.Item as Item) || null;
  }

  async update(id: string, attributes: Partial<Item>): Promise<void> {
    const updateExpression =
      'set ' +
      Object.keys(attributes)
        .map((key, index) => `#${key} = :val${index}`)
        .join(', ');
    const expressionAttributeNames = Object.keys(attributes).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {},
    );
    const expressionAttributeValues = Object.values(attributes).reduce(
      (acc, val, index) => ({ ...acc, [`:val${index}`]: val }),
      {},
    );

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    await this.dynamoDb.send(command);
  }

  async readAll(): Promise<Item[]> {
    try {
      const data = await this.dynamoDb.send(
        new ScanCommand({ TableName: this.tableName }),
      );
      return (data.Items as unknown as Item[]) || [];
    } catch (error) {
      console.error(
        `Error reading all items from table ${this.tableName}:`,
        error,
      );
      throw new Error(`Could not read all items from table ${this.tableName}`);
    }
  }
}
