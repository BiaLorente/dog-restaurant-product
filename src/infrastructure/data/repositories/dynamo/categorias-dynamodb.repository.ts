import { BaseDynamoDbRepository } from './dynamo-base.repository';

export class CategoryDynamoDbRepository extends BaseDynamoDbRepository {
  protected readonly tableName = 'categorias';
}
