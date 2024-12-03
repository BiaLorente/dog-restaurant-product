import { Item } from 'aws-sdk/clients/simpledb';
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { IDynamoDbRepository } from './dynamodb-repository.interface';

export class CategoryDynamoDbRepository implements IDynamoDbRepository {
  private readonly tableName = 'categorias';
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor() {
    console.log('Inicializando configuração do DynamoDB com IRSA');

    // Logando variáveis de ambiente para debug
    console.log('Região configurada:', process.env.AWS_REGION);
    console.log('ARN da função IAM:', process.env.AWS_ROLE_ARN);
    console.log(
      'Caminho do arquivo de token:',
      process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
    );

    const client = new DynamoDBClient({});

    this.dynamoDb = DynamoDBDocumentClient.from(client);

    this.testConnection();
  }

  async testConnection() {
    const params = {
      TableName: 'categorias',
    };

    try {
      const data = await this.dynamoDb.send(new ScanCommand(params));
      console.log('Scan de itens:', data.Items);
    } catch (error) {
      console.error('Erro ao conectar ao DynamoDB:', error);
    }
  }

  async create(item: PutItemInputAttributeMap): Promise<void> {
    console.log('create method called');
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
    const params = {
      TableName: this.tableName,
    };

    try {
      const data = await this.dynamoDb.send(new ScanCommand(params));
      return (data.Items as unknown as Item[]) || [];
    } catch (error) {
      console.error('Error reading all items from DynamoDB:', error);
      throw new Error('Could not read all items');
    }
  }
}
