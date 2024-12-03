import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { IProdutoUseCase } from '../../domain/use-cases/produto-use-case.interface';
import { NotFoundException } from '@nestjs/common';
import { ProdutoOutput } from '../output/produto-output';
import { CategoriaOutput } from '../output/categoria-output';
import { Produto } from '../../domain/entities/Produto';
import { Categoria } from '../../domain/entities/Categoria';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let produtoUseCaseMock: jest.Mocked<IProdutoUseCase>;

  beforeEach(async () => {
    produtoUseCaseMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByNome: jest.fn(),
      getByCategoria: jest.fn(),
      getAllCategorias: jest.fn(),
      create: jest.fn(),
      createCategoria: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [{ provide: IProdutoUseCase, useValue: produtoUseCaseMock }],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of products', async () => {
      const produtos = [
        new Produto('Produto 1', 'Categoria 1', 100, 'Description', true, '1'),
      ];
      produtoUseCaseMock.getAll.mockResolvedValue(produtos);

      const result = await controller.getAll();

      expect(result).toEqual([
        new ProdutoOutput(
          'Produto 1',
          '1',
          'Categoria 1',
          100,
          'Description',
          true,
        ),
      ]);
      expect(produtoUseCaseMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getAllCategories', () => {
    it('should return a list of categories', async () => {
      const categorias = [new Categoria('Categoria 1', '1')];
      produtoUseCaseMock.getAllCategorias.mockResolvedValue(categorias);

      const result = await controller.getAllCategories();

      expect(result).toEqual([new CategoriaOutput('Categoria 1', '1')]);
      expect(produtoUseCaseMock.getAllCategorias).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a product by ID', async () => {
      const produto = new Produto(
        'Produto 1',
        'Categoria 1',
        100,
        'Description',
        true,
        '1',
      );
      produtoUseCaseMock.getById.mockResolvedValue(produto);

      const result = await controller.getById('1');

      expect(result).toEqual(
        new ProdutoOutput(
          'Produto 1',
          '1',
          'Categoria 1',
          100,
          'Description',
          true,
        ),
      );
      expect(produtoUseCaseMock.getById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product is not found', async () => {
      produtoUseCaseMock.getById.mockResolvedValue(null);

      await expect(controller.getById('1')).rejects.toThrow(
        new NotFoundException('Produto com id 1 não encontrado.'),
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product and return its ID', async () => {
      produtoUseCaseMock.create.mockResolvedValue('1');

      const produtoInput = {
        nome: 'Produto 1',
        categoriaId: 'Categoria 1',
        preco: 100,
        descricao: 'Description',
        ativo: true,
      };

      const result = await controller.createProduct(produtoInput);

      expect(result).toEqual({ produtoId: '1' });
      expect(produtoUseCaseMock.create).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      produtoUseCaseMock.update.mockResolvedValue('1');

      const produtoInput = {
        nome: 'Produto Atualizado',
        categoriaId: 'Categoria 1',
        preco: 150,
        descricao: 'Desc Atualizada',
        ativo: true,
      };

      const result = await controller.updateProduct('1', produtoInput);

      expect(result).toEqual({
        id: '1',
        message: 'Produto atualizado com  sucesso.',
      });
      expect(produtoUseCaseMock.update).toHaveBeenCalledWith(
        '1',
        expect.anything(),
      );
    });

    it('should throw NotFoundException if product is not found', async () => {
      produtoUseCaseMock.update.mockResolvedValue(null);

      const produtoInput = {
        nome: 'Produto Atualizado',
        categoriaId: 'Categoria 1',
        preco: 150,
        descricao: 'Desc Atualizada',
        ativo: true,
      };

      await expect(controller.updateProduct('1', produtoInput)).rejects.toThrow(
        new NotFoundException('Produto com id 1 não encontrado.'),
      );
    });
  });

  describe('updateProductStatus', () => {
    it('should update product status successfully', async () => {
      produtoUseCaseMock.updateStatus.mockResolvedValue('1');

      const result = await controller.updateProductStatus('1', true);

      expect(result).toEqual({
        id: '1',
        message: 'Produto atualizado com  sucesso.',
      });
      expect(produtoUseCaseMock.updateStatus).toHaveBeenCalledWith('1', true);
    });

    it('should throw NotFoundException if product is not found', async () => {
      produtoUseCaseMock.updateStatus.mockResolvedValue(null);

      await expect(controller.updateProductStatus('1', true)).rejects.toThrow(
        new NotFoundException('Produto com id 1 não encontrado.'),
      );
    });
  });
});
