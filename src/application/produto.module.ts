import { Module } from '@nestjs/common';
import { ProdutoController } from './controller/produto.controller';
import { IProdutoRepository } from 'src/domain/ports/product-repository.interface';
import { IProdutoUseCase } from 'src/domain/use-cases/produto-use-case.interface';
import { ProdutoUseCase } from 'src/domain/use-cases/produto-use-case.service';
import { ProductRepository } from 'src/infrastructure/data/repositories/produto-repository';
import { ProdutoGateway } from 'src/domain/adapters/product.gateway';
import { IProdutoGateway } from 'src/domain/ports/produto-gateway.interface';
import { ProductDynamoDbRepository } from 'src/infrastructure/data/repositories/produtos-dynamodb.repository';
import { IDynamoDbRepository } from 'src/infrastructure/data/repositories/dynamodb-repository.interface';
import { CategoryDynamoDbRepository } from 'src/infrastructure/data/repositories/categorias-dynamodb.repository';

@Module({
  imports: [],
  controllers: [ProdutoController],
  providers: [
    ProductRepository,
    {
      provide: IProdutoRepository,
      useClass: ProductRepository,
    },
    ProdutoUseCase,
    {
      provide: IProdutoUseCase,
      useClass: ProdutoUseCase,
    },
    ProdutoGateway,
    {
      provide: IProdutoGateway,
      useClass: ProdutoGateway,
    },
    ProductDynamoDbRepository,
    {
      provide: IDynamoDbRepository,
      useClass: ProductDynamoDbRepository,
    },
    CategoryDynamoDbRepository,
    {
      provide: IDynamoDbRepository,
      useClass: CategoryDynamoDbRepository,
    },
  ],
})
export class ProdutoModule {}
