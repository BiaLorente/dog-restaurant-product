import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriaInput } from '../input/categoria-input';
import { ProdutoInput } from '../input/produto-input';
import { CategoriaOutput } from '../output/categoria-output';
import { ProdutoOutput } from '../output/produto-output';
import { ApiTags } from '@nestjs/swagger';
import { Produto } from '../../domain/entities/Produto';
import { Categoria } from '../../domain/entities/Categoria';
import { IProdutoUseCase } from '../../domain/use-cases/produto-use-case.interface';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Get()
  async getAll(): Promise<ProdutoOutput[]> {
    const produto = await this.produtoUseCase.getAll();

    return produto.map(
      (produto) =>
        new ProdutoOutput(
          produto.nome,
          produto.id,
          produto.categoria,
          produto.preco,
          produto.descricao,
          produto.ativo,
        ),
    );
  }

  @Get('/categorias')
  async getAllCategories(): Promise<CategoriaOutput[]> {
    const categorias = await this.produtoUseCase.getAllCategorias();

    return categorias.map(
      (categoria) => new CategoriaOutput(categoria.nome, categoria.id),
    );
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<ProdutoOutput> {
    const produto = await this.produtoUseCase.getById(id);
    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return new ProdutoOutput(
      produto.nome,
      produto.id,
      produto.categoria,
      produto.preco,
      produto.descricao,
      produto.ativo,
    );
  }

  @Get('/nome/:nome')
  async getByName(@Param('nome') nome: string): Promise<ProdutoOutput> {
    const produto = await this.produtoUseCase.getByNome(nome);
    if (!produto) {
      throw new NotFoundException(`Produto com nome ${nome} não encotrado.`);
    }
    return new ProdutoOutput(
      produto.nome,
      produto.id,
      produto.categoria,
      produto.preco,
      produto.descricao,
      produto.ativo,
    );
  }

  @Get('/categorias/:categoria')
  async getByCategory(
    @Param('categoria') categoria: string,
  ): Promise<ProdutoOutput[]> {
    const produtos = await this.produtoUseCase.getByCategoria(categoria);
    if (!produtos || produtos.length < 1) {
      throw new NotFoundException(
        `Produto com categoria ${categoria} não encontrado.`,
      );
    }
    return produtos.map(
      (produto) =>
        new ProdutoOutput(
          produto.id,
          produto.nome,
          produto.categoria,
          produto.preco,
          produto.descricao,
        ),
    );
  }

  @Post()
  async createProduct(@Body() produtoInput: ProdutoInput): Promise<any> {
    const produto = new Produto(
      produtoInput.nome,
      produtoInput.categoriaId,
      produtoInput.preco,
      produtoInput.descricao,
      produtoInput.ativo,
    );
    return { produtoId: await this.produtoUseCase.create(produto) };
  }

  @Post('/categorias')
  async createCategory(@Body() categoriaInput: CategoriaInput) {
    const categoria = new Categoria(categoriaInput.nome);
    return { id: await this.produtoUseCase.createCategoria(categoria) };
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() produtoInput: ProdutoInput,
  ) {
    const produto = new Produto(
      produtoInput.nome,
      produtoInput.categoriaId,
      produtoInput.preco,
      produtoInput.descricao,
    );
    const produtoAtualizado = await this.produtoUseCase.update(id, produto);
    if (!produtoAtualizado) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return { id, message: `Produto atualizado com  sucesso.` };
  }

  @Put('/:id/status')
  async updateProductStatus(@Param('id') id: string, @Body() ativo: boolean) {
    const produtoAtualizado = await this.produtoUseCase.updateStatus(id, ativo);
    if (!produtoAtualizado) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return { id, message: `Produto atualizado com  sucesso.` };
  }
}
