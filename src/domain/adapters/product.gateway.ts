/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject } from '@nestjs/common';
import { IProdutoRepository } from '../ports/product-repository.interface';
import { IProdutoGateway } from '../ports/produto-gateway.interface';
import { ICategoriaRepository } from '../ports/category-repository.interface';
import { Produto } from '../entities/Produto';
import { Categoria } from '../entities/Categoria';
import { CategoriaModel } from 'src/infrastructure/data/db-model/categoria.model';
import { ProdutoModel } from 'src/infrastructure/data/db-model/produto.model';

export class ProdutoGateway implements IProdutoGateway {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async create(produto: Produto): Promise<void> {
    const produtoModel: ProdutoModel = {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      ativo: produto.ativo,
    };

    await this.produtoRepository.create(produtoModel);
  }

  async createCategoria(categoria: Categoria): Promise<void> {
    const categoriaModel: CategoriaModel = {
      categoriaId: categoria.id,
      categoriaDescricao: categoria.nome,
    };

    await this.categoriaRepository.createCategoria(categoriaModel);
  }

  async update(id: string, produto: Produto): Promise<void> {
    const produtoModel: Partial<ProdutoModel> = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      ativo: produto.ativo,
    };

    await this.produtoRepository.update(id, produtoModel);
  }

  async updateStatus(id: string, ativo: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getByNome(nome: string): Promise<Produto> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Produto | null> {
    const model = await this.produtoRepository.getById(id);
    if (!model) return null;

    return new Produto(
      model.nome,
      model.categoria,
      model.preco,
      model.descricao,
      model.ativo,
      model.id,
    );
  }

  async getByCategoria(categoria: string): Promise<Produto[]> {
    throw new Error('Method not implemented.');
  }

  async getAllCategorias(): Promise<Categoria[]> {
    const models = await this.categoriaRepository.getAllCategorias();
    return models.map(
      (model) => new Categoria(model.categoriaId, model.categoriaDescricao),
    );
  }

  async getAll(): Promise<Produto[]> {
    const models = await this.produtoRepository.getAll();
    if (!models) return [];

    return models.map(
      (model) =>
        new Produto(
          model.nome,
          model.categoria,
          model.preco,
          model.descricao,
          model.ativo,
          model.id,
        ),
    );
  }
}
