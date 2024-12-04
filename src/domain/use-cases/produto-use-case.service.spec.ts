import { TestingModule, Test } from '@nestjs/testing';
import { Categoria } from '../entities/Categoria';
import { Produto } from '../entities/Produto';
import { ProdutoUseCase } from './produto-use-case.service';
import { IProdutoGateway } from '../ports/produto-gateway.interface';

describe('ProdutoUseCase', () => {
  let service: ProdutoUseCase;
  let mockProdutoGateway: Partial<IProdutoGateway>;

  beforeEach(async () => {
    mockProdutoGateway = {
      updateStatus: jest.fn().mockResolvedValue(undefined),
      getAllCategorias: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue(undefined),
      createCategoria: jest.fn().mockResolvedValue(undefined),
      getByCategoria: jest.fn().mockResolvedValue([]),
      getAll: jest.fn().mockResolvedValue([]),
      getByNome: jest.fn().mockResolvedValue(null),
      getById: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoUseCase,
        {
          provide: IProdutoGateway,
          useValue: mockProdutoGateway,
        },
      ],
    }).compile();

    service = module.get<ProdutoUseCase>(ProdutoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update status of a product', async () => {
    const id = 'some-id';
    const ativo = true;
    const result = await service.updateStatus(id, ativo);
    expect(mockProdutoGateway.updateStatus).toHaveBeenCalledWith(id, ativo);
    expect(result).toBe(id);
  });

  it('should update a product', async () => {
    const id = 'some-id';
    const produto = new Produto(
      'some-name',
      'some-category',
      100,
      'Description',
    );
    const result = await service.update(id, produto);
    expect(mockProdutoGateway.update).toHaveBeenCalledWith(id, produto);
    expect(result).toBe(id);
  });

  it('should create a product', async () => {
    const produto = new Produto(
      'some-name',
      'some-category',
      100,
      'Description',
    );
    const result = await service.create(produto);
    expect(mockProdutoGateway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String), // Ensure a UUID is generated
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco,
        descricao: produto.descricao,
        ativo: produto.ativo,
      }),
    );
    expect(result).toBe(produto.id);
  });

  it('should create a category', async () => {
    const categoria = new Categoria('some-name');
    const result = await service.createCategoria(categoria);
    expect(mockProdutoGateway.createCategoria).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: categoria.nome,
      }),
    );
    expect(result).toBe(categoria.id);
  });

  it('should get all categories', async () => {
    const categories = await service.getAllCategorias();
    expect(mockProdutoGateway.getAllCategorias).toHaveBeenCalled();
    expect(categories).toEqual([]);
  });

  it('should get product by name', async () => {
    const nome = 'some-name';
    const result = await service.getByNome(nome);
    expect(mockProdutoGateway.getByNome).toHaveBeenCalledWith(nome);
    expect(result).toBeNull();
  });

  it('should get product by id', async () => {
    const id = 'some-id';
    const result = await service.getById(id);
    expect(mockProdutoGateway.getById).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });

  it('should get products by category', async () => {
    const categoria = 'some-category';
    const produtos = await service.getByCategoria(categoria);
    expect(mockProdutoGateway.getByCategoria).toHaveBeenCalledWith(categoria);
    expect(produtos).toEqual([]);
  });

  it('should get all products', async () => {
    const produtos = await service.getAll();
    expect(mockProdutoGateway.getAll).toHaveBeenCalled();
    expect(produtos).toEqual([]);
  });
});
