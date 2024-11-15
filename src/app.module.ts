import { Module } from '@nestjs/common';
import { ProdutoModule } from './application/produto.module';

@Module({
  imports: [ProdutoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
