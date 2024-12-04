import { BaseDynamoDbRepository } from './dynamo-base.repository';

export class ProductDynamoDbRepository extends BaseDynamoDbRepository {
  protected readonly tableName = 'produtos';
}
