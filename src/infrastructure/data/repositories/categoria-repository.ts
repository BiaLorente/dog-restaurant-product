import { Inject } from '@nestjs/common';
import { IDynamoDbRepository } from './dynamo/dynamodb-repository.interface';
import { CategoriaModel } from '../db-model/categoria.model';
import { DynamoDB } from 'aws-sdk';
import { Item } from 'aws-sdk/clients/simpledb';

export class CategoriaRepository {
  constructor(
    @Inject(IDynamoDbRepository)
    private readonly db: IDynamoDbRepository,
  ) {}
  async createCategoria(categoria: CategoriaModel): Promise<void> {
    const item = convertCategoriaEntityToDynamoItem(categoria);
    await this.db.create(item);
  }

  async getAllCategorias(): Promise<CategoriaModel[]> {
    const items = await this.db.readAll();
    return items.map((item) => convertDynamoItemToCategoria(item));
  }
}

const convertCategoriaEntityToDynamoItem = (
  categoria: CategoriaModel,
): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
  return {
    CategoriaId: categoria.categoriaId,
    CategoriaDescricao: categoria.categoriaDescricao,
  };
};

const convertDynamoItemToCategoria = (dynamoItem: Item): CategoriaModel => {
  return {
    categoriaId: dynamoItem.Attributes['categoriaId'],
    categoriaDescricao: dynamoItem.Attributes['categoriaId'],
  };
};
