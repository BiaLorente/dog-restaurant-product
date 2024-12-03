import { CategoriaModel } from 'src/infrastructure/data/db-model/categoria.model';

export interface ICategoriaRepository {
  createCategoria(categoria: CategoriaModel): Promise<void>;
  getAllCategorias(): Promise<CategoriaModel[]>;
}
export const ICategoriaRepository = Symbol('ICategoriaRepository');
