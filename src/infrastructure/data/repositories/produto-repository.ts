import { Inject } from '@nestjs/common';
import { IDynamoDbRepository } from './dynamo/dynamodb-repository.interface';
import { Item } from 'aws-sdk/clients/simpledb';
import { DynamoDB } from 'aws-sdk';
import { IProdutoRepository } from 'src/domain/ports/product-repository.interface';
import { ProdutoModel } from '../db-model/produto.model';
export class ProductRepository implements IProdutoRepository {
  constructor(
    @Inject(IDynamoDbRepository)
    private readonly db: IDynamoDbRepository,
  ) {}
  async create(produto: ProdutoModel): Promise<void> {
    const item = this.convertProdutoEntityToDynamoItem(produto);
    try {
      await this.db.create(item);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getAll(): Promise<ProdutoModel[]> {
    const items = await this.db.readAll();
    return items.map((item) => this.convertDynamoItemToProduto(item));
  }

  async getById(id: string): Promise<ProdutoModel | null> {
    const item = await this.db.read(id);
    return item ? this.convertDynamoItemToProduto(item) : null;
  }

  async update(id: string, produto: Partial<ProdutoModel>): Promise<void> {
    const updateItem = this.convertProdutoPartialEntityToDynamoItem(produto);

    try {
      await this.db.update(id, updateItem);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // async updateStatus(id: string, ativo: boolean): Promise<void> {
  //   const statusUpdate = { ativo };

  //   try {
  //     await this.db.update(id, statusUpdate);
  //   } catch (error) {
  //     console.error('Error updating product status:', error);
  //     throw error;
  //   }
  // }

  convertProdutoPartialEntityToDynamoItem = (
    produto: Partial<ProdutoModel>,
  ): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
    return {
      ...(produto.id && { produtoId: produto.id }),
      ...(produto.nome && { produtoNome: produto.nome }),
      ...(produto.descricao && { produtoDescricao: produto.descricao }),
      ...(produto.preco && { preco: produto.preco }),
      ...(produto.categoria && { categoriaId: produto.categoria }),
      ...(produto.ativo !== undefined && { ativo: produto.ativo }),
    };
  };

  convertProdutoEntityToDynamoItem = (
    produto: ProdutoModel,
  ): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
    return {
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoDescricao: produto.descricao,
      preco: produto.preco,
      categoriaId: produto.categoria,
      ativo: produto.ativo,
    };
  };

  convertDynamoItemToProduto = (dynamoItem: Item): ProdutoModel => {
    return {
      id: dynamoItem.Attributes['id'],
      nome: dynamoItem.Attributes['nome'],
      descricao: dynamoItem.Attributes['descricao'],
      preco: dynamoItem.Attributes['preco'],
      categoria: dynamoItem.Attributes['categoria'],
      ativo: dynamoItem.Attributes['ativo'],
    };
  };
}
