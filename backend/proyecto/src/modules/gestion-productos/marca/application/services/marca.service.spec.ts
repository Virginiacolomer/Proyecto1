import { Test, TestingModule } from '@nestjs/testing';
import { MarcaService } from './marca.service';
import { IMarcaRepository } from '../../domain/interfaces/marca.repository.interface';


describe('MarcaService', () => {
  let service: MarcaService;
  let repository: jest.Mocked<IMarcaRepository>;
/*
  beforeEach(async () => {
    const mockRepository: Partial<IMarcaRepository> = {
      findAll: jest.fn(),
      findByDenominacion: jest.fn(), // Agregar este método
        create: jest.fn(), // Agregar este método
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaService,
        { provide: 'IMarcaRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MarcaService>(MarcaService);
    repository = module.get('IMarcaRepository');
  });

  describe('findAll', () => {
    it('debería retornar una lista de marcas', async () => {
      const marcasMock: Marca[] = [
        { id: 1, denominacion: 'Nike', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, denominacion: 'Adidas', createdAt: new Date(), updatedAt: new Date() },
      ];

      repository.findAll.mockResolvedValue(marcasMock);

      const result = await service.findAll(0, 10);

      expect(repository.findAll).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(marcasMock);
    });
  });


  describe('create', () => {
    it('debería crear una nueva marca si la denominación no existe', async () => {
      const createMarcaDto: CreateMarcaDto = { denominacion: 'Nike' };

      repository.findByDenominacion.mockResolvedValue(null); // No existe
      repository.create.mockResolvedValue({
        id: 1,
        ...createMarcaDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createMarcaDto);

      expect(repository.findByDenominacion).toHaveBeenCalledWith('Nike');
      expect(repository.create).toHaveBeenCalledWith(createMarcaDto);
      expect(result).toEqual({
        id: 1,
        denominacion: 'Nike',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('debería lanzar un error si la denominación ya existe', async () => {
      const createMarcaDto: CreateMarcaDto = { denominacion: 'Nike' };

      repository.findByDenominacion.mockResolvedValue({
        id: 1,
        denominacion: 'Nike',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(createMarcaDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });


  */
});
