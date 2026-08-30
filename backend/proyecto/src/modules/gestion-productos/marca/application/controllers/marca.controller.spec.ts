import { Test, TestingModule } from '@nestjs/testing';
import { MarcaController } from './marca.controller';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MarcaService } from '../services/marca.service';



describe('MarcaController - Decorators', () => {
  let controller: MarcaController;
  let service: MarcaService;

  const mockService = {
    findByDenominacionFiltered: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ rolId: 1 }), // Simula el payload del token
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret'), // Simula el JWT_SECRET
  };

  const mockReflector = {
    getAllAndOverride: jest.fn().mockReturnValue(['Administrador']), // Simula los roles requeridos
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcaController],
      providers: [
        {
          provide: MarcaService,
          useValue: mockService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        NormalizeDenominacionSearchPipe,
      ],
    })
      .overrideGuard(AuthGuard) // Usa la clase directamente
      .useValue({ canActivate: () => true }) // Mock del guard
      .compile();

    controller = module.get<MarcaController>(MarcaController);
    service = module.get<MarcaService>(MarcaService);
  });

  it('debería usar NormalizeDenominacionSearchPipe en el método search-by', () => {
    const prototype = Object.getPrototypeOf(controller);
    const method = prototype.findByDenominacionFiltered;

    const metadata = Reflect.getMetadata('__pipes__', method);

    const hasNormalizePipe = metadata?.some(
      (pipe: any) => pipe === NormalizeDenominacionSearchPipe,
    );

    expect(hasNormalizePipe).toBe(true);
  });

  it('debería llamar al servicio con los parámetros correctos', async () => {
    const dto = { denominacion: 'PRUEBA', skip: 0, take: 10 };
    const result = ['resultado simulado'];
    mockService.findByDenominacionFiltered.mockResolvedValue(result);

    const response = await controller.findByDenominacionFiltered(dto);

    expect(service.findByDenominacionFiltered).toHaveBeenCalledWith('PRUEBA', 0, 10);
    expect(response).toBe(result);
  });

  it('debería usar cadena vacía si denominacion no está definido', async () => {
    const dto = { skip: 0, take: 10 }; // sin denominacion
    const result = [];
    mockService.findByDenominacionFiltered.mockResolvedValue(result);

    const response = await controller.findByDenominacionFiltered(dto as any);

    expect(service.findByDenominacionFiltered).toHaveBeenCalledWith('', 0, 10);
    expect(response).toBe(result);
  });

  it('debería propagar errores si el service falla', async () => {
    mockService.findByDenominacionFiltered.mockRejectedValue(new Error('Fallo del service'));

    await expect(
      controller.findByDenominacionFiltered({ denominacion: 'algo', skip: 0, take: 10 }),
    ).rejects.toThrow('Fallo del service');
  });
});
