import { Module } from '@nestjs/common';
import { ProdutoController } from './controller/produto.controller';
import { IProdutoRepository } from 'src/domain/ports/product-repository.interface';
import { IProdutoUseCase } from 'src/domain/use-cases/produto-use-case.interface';
import { ProdutoUseCase } from 'src/domain/use-cases/produto-use-case.service';
import { ProductRepository } from 'src/infrastructure/data/repositories/produto-repository';
import { ProdutoGateway } from 'src/domain/adapters/product.gateway';
import { IProdutoGateway } from 'src/domain/ports/produto-gateway.interface';
import { ProductDynamoDbRepository } from 'src/infrastructure/data/repositories/dynamo/produtos-dynamodb.repository';
import { IDynamoDbRepository } from 'src/infrastructure/data/repositories/dynamo/dynamodb-repository.interface';
import { CategoryDynamoDbRepository } from 'src/infrastructure/data/repositories/dynamo/categorias-dynamodb.repository';
import { ICategoriaRepository } from 'src/domain/ports/category-repository.interface';
import { CategoriaRepository } from 'src/infrastructure/data/repositories/categoria-repository';

@Module({
  imports: [],
  controllers: [ProdutoController],
  providers: [
    ProductRepository,
    {
      provide: IProdutoRepository,
      useClass: ProductRepository,
    },
    CategoriaRepository,
    {
      provide: ICategoriaRepository,
      useClass: CategoriaRepository,
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
