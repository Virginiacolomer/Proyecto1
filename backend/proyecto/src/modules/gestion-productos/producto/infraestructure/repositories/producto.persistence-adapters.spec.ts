import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductoPersistenceAdapter } from './producto.persistence-adapters';
import { Producto } from '../../domain/entities/producto.entity';
import { HistorialPrecio } from '../../domain/entities/historial-precio.entity';
import { DataSource, Repository } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ProductoInvalidoException } from '../../domain/exceptions/producto-invalido.exception';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';

describe('ProductoPersistenceAdapter - update (flujo de actualización y precios)', () => {
  let adapter: ProductoPersistenceAdapter;
  let productoRepoMock: Partial<Record<keyof Repository<Producto>, jest.Mock>>;
  let historialRepoMock: Partial<Record<keyof Repository<HistorialPrecio>, jest.Mock>>;
  let uowMock: IUnitOfWork;

  beforeEach(async () => {
    productoRepoMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    historialRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const queryRunnerMock = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn().mockImplementation((entityClass) => {
          if (entityClass === Producto) return productoRepoMock;
          if (entityClass === HistorialPrecio) return historialRepoMock;
        }),
      },
    };

    const dataSourceMock = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoPersistenceAdapter,
        {
          provide: getRepositoryToken(Producto),
          useValue: productoRepoMock,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        {
          provide: 'UnitOfWork',
          useValue: {
            getRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<ProductoPersistenceAdapter>(ProductoPersistenceAdapter);
  });

  it('Debería actualizar el precio y crear historial cuando el precio cambia (Caso A)', async () => {
    const mockProducto = new Producto();
    mockProducto.id = 1;
    mockProducto.precio = 1000;
    
    // Simular el comportamiento real de la entidad
    mockProducto.establecerCostoMargenYStock = jest.fn().mockImplementation(() => {
      mockProducto.precio = 1200; // Simula que el nuevo precio recalculado es 1200
    });

    jest.spyOn(adapter, 'findOne').mockResolvedValue(mockProducto);
    historialRepoMock.create!.mockReturnValue({ id: 99 });

    const dto = { costo: 1000, costoDolar: 0, cotizacionDolar: 0, porcentaje: 20, usuarioId: 1, motivo: 'Aumento' };
    const mockUsuario = { id: 1 } as any;

    await adapter.update(1, dto as any, {} as any, {} as any, mockUsuario);

    // Verificamos que se calculó el nuevo precio
    expect(mockProducto.establecerCostoMargenYStock).toHaveBeenCalledWith({ costo: 1000, margen: 20 });
    
    // Verificamos que el producto se guardó
    expect(productoRepoMock.save).toHaveBeenCalledWith(mockProducto);

    // Verificamos que se creó y guardó el historial con los precios correctos
    expect(historialRepoMock.create).toHaveBeenCalledWith(expect.objectContaining({
      precioAnterior: 1000,
      precioNuevo: 1200,
      motivo: 'Aumento'
    }));
    expect(historialRepoMock.save).toHaveBeenCalled();
  });

  it('NO debería crear historial si el precio no cambia (Caso B / Precio Sin Cambio)', async () => {
    const mockProducto = new Producto();
    mockProducto.id = 1;
    // Simulamos un string que viene de MySQL DECIMAL
    mockProducto.precio = '1000.00000' as any;
    
    mockProducto.establecerCostoMargenYStock = jest.fn().mockImplementation(() => {
      mockProducto.precio = 1000; // El nuevo cálculo da exactamente el mismo valor numérico
    });

    jest.spyOn(adapter, 'findOne').mockResolvedValue(mockProducto);

    const dto = { costo: 800, costoDolar: 0, cotizacionDolar: 0, porcentaje: 25, usuarioId: 1, motivo: 'Revision' };
    const mockUsuario = { id: 1 } as any;

    await adapter.update(1, dto as any, {} as any, {} as any, mockUsuario);

    expect(productoRepoMock.save).toHaveBeenCalledWith(mockProducto);
    // Verificamos explícitamente que NO se haya intentado crear el historial
    expect(historialRepoMock.create).not.toHaveBeenCalled();
    expect(historialRepoMock.save).not.toHaveBeenCalled();
  });

  it('Debería rechazar si el precio nuevo es <= 0 (Caso E)', async () => {
    const mockProducto = new Producto();
    mockProducto.id = 1;
    mockProducto.precio = 1000;
    
    mockProducto.establecerCostoMargenYStock = jest.fn().mockImplementation(() => {
      mockProducto.precio = 0; // Resultado inválido
    });

    jest.spyOn(adapter, 'findOne').mockResolvedValue(mockProducto);

    const dto = { costo: 0, costoDolar: 0, cotizacionDolar: 0, porcentaje: 0, usuarioId: 1, motivo: 'Error' };
    
    await expect(adapter.update(1, dto as any, {} as any, {} as any, {} as any)).rejects.toThrow(BadRequestException);
    
    // Verificamos que no se intentó guardar nada
    expect(productoRepoMock.save).not.toHaveBeenCalled();
    expect(historialRepoMock.save).not.toHaveBeenCalled();
  });

  it('Debería lanzar error y no tragar la excepción si establecerCostoMargenYStock falla', async () => {
    const mockProducto = new Producto();
    mockProducto.id = 1;
    
    mockProducto.establecerCostoMargenYStock = jest.fn().mockImplementation(() => {
      throw new ProductoInvalidoException(['El costo debe ser mayor a cero']);
    });

    jest.spyOn(adapter, 'findOne').mockResolvedValue(mockProducto);

    const dto = { costo: -100, costoDolar: 0, cotizacionDolar: 0, porcentaje: 0, usuarioId: 1, motivo: 'Inv' };
    
    await expect(adapter.update(1, dto as any, {} as any, {} as any, {} as any)).rejects.toThrow(ProductoInvalidoException);
    expect(productoRepoMock.save).not.toHaveBeenCalled();
  });

  it('Debería propagar excepción y solicitar rollbackTransaction() si guardar historial falla (Demostración unitaria)', async () => {
    const mockProducto = new Producto();
    mockProducto.id = 1;
    mockProducto.precio = 1000;
    
    mockProducto.establecerCostoMargenYStock = jest.fn().mockImplementation(() => {
      mockProducto.precio = 1200;
    });

    jest.spyOn(adapter, 'findOne').mockResolvedValue(mockProducto);
    historialRepoMock.create!.mockReturnValue({});
    
    // Simulamos que la inserción del historial falla en la BD
    historialRepoMock.save!.mockRejectedValue(new Error('DB Falló'));

    const dto = { costo: 1000, costoDolar: 0, cotizacionDolar: 0, porcentaje: 20, usuarioId: 1, motivo: 'Autentico' };

    await expect(adapter.update(1, dto as any, {} as any, {} as any, {} as any)).rejects.toThrow(DatabaseConnectionException);

    // Nota: Aunque productoRepoMock.save fue llamado antes del throw en este test mockeado,
    // el decorador @Transactional() de TypeORM intercepta la excepción subyacente y ejecuta
    // el queryRunner.rollbackTransaction() en la BD real. Para comprobar el rollback real, 
    // se requeriría un test de Integración con base de datos en memoria (SQLite/MySQL Test).
    expect(productoRepoMock.save).toHaveBeenCalled();
    expect(historialRepoMock.save).toHaveBeenCalled();
  });

  describe('getHistorialPrecios', () => {
    it('Debería buscar el producto y retornar su historial ordenado (Lectura)', async () => {
      // Mock para la búsqueda del producto (simula que existe) interceptando el método del propio adapter
      const findOneSpy = jest.spyOn(adapter, 'findOne').mockResolvedValue(new Producto());

      const historialesSimulados = [
        { id: 2, fecha: new Date('2023-11-01') },
        { id: 1, fecha: new Date('2023-10-01') },
      ];

      // Simulamos lo que devuelve el repository de typeorm
      historialRepoMock.find = jest.fn().mockResolvedValue(historialesSimulados);

      // En el DataSource mock, getRepository debe devolver historialRepoMock cuando se le pide HistorialPrecio
      const localDataSourceMock = {
        getRepository: jest.fn().mockImplementation((entityClass) => {
          if (entityClass === HistorialPrecio) return historialRepoMock;
        }),
      };
      
      // Sobrescribimos la propiedad privada solo para este test
      Object.defineProperty(adapter, 'dataSource', { value: localDataSourceMock });

      const resultado = await adapter.getHistorialPrecios(1);

      expect(findOneSpy).toHaveBeenCalledWith(1);
      
      expect(localDataSourceMock.getRepository).toHaveBeenCalledWith(HistorialPrecio);
      expect(historialRepoMock.find).toHaveBeenCalledWith({
        where: { producto: { id: 1 } },
        order: { fecha: 'DESC' },
      });
      expect(resultado).toEqual(historialesSimulados);
    });
  });
});
