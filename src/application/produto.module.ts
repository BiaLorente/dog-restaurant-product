import { Module } from '@nestjs/common';
import { ProdutoController } from './controller/produto.controller';
import { DataBaseModule } from 'src/infrastructure/data/database.module';
import { IProdutoRepository } from 'src/domain/repositories/product-repository.interface';
import { IProdutoUseCase } from 'src/domain/use-cases/produto-use-case.interface';
import { ProdutoUseCase } from 'src/domain/use-cases/produto-use-case.service';
import { databaseProviders } from 'src/infrastructure/data/database.provider';
import { categoriaProviders } from 'src/infrastructure/data/repositories/categoria.provider';
import { ProductRepository } from 'src/infrastructure/data/repositories/produto-repository';
import { produtoProviders } from 'src/infrastructure/data/repositories/produto.provider';

@Module({
  imports: [DataBaseModule],
  controllers: [ProdutoController],
  providers: [
    ...produtoProviders,
    ...categoriaProviders,
    ...databaseProviders,
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
  ],
})
export class ProdutoModule {}
