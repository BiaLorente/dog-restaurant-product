import { ProdutoModel } from 'src/infrastructure/data/db-model/produto.model';

export interface IProdutoRepository {
  create(produto: ProdutoModel);
  getAll(): Promise<ProdutoModel[] | null>;
  getById(id: string): Promise<ProdutoModel | null>;
  update(id: string, produto: Partial<ProdutoModel>): Promise<void>;
}
export const IProdutoRepository = Symbol('IProdutoRepository');
