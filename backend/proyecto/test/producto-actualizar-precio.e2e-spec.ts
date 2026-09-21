import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { ProductoService } from 'src/modules/gestion-productos/producto/application/services/producto.service';

describe('Producto - Actualizar (e2e) con Precios', () => {
  let app: INestApplication;
  let productoService: ProductoService;

  beforeAll(async () => {
    // 1. Mock AuthGuard
    const mockAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Habilitar ValidationPipe global para probar class-validator
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    productoService = moduleFixture.get<ProductoService>(ProductoService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PUT /producto/:id', () => {
    
    it('Debería llamar al servicio update si los datos son válidos', async () => {
      const actualizarSpy = jest.spyOn(productoService, 'update').mockResolvedValue({
        mensaje: 'Producto editada con éxito con denominacion: ID 1'
      } as any);

      const payload = {
        denominacion: "Prod Test",
        usuarioUpdatedId: 1,
        lineaId: 1,
        marcaId: 1,
        alicuotaIva: 21,
        costo: 1000,
        porcentaje: 20,
        motivo: "Aumento de costo"
      };

      await request(app.getHttpServer())
        .put('/producto/1')
        .send(payload)
        .expect(200);

      expect(actualizarSpy).toHaveBeenCalledWith(1, expect.objectContaining({
        alicuotaIva: 21,
        costo: 1000,
        denominacion: "PROD TEST",
        lineaId: 1,
        marcaId: 1,
        motivo: "Aumento de costo",
        porcentaje: 20,
        usuarioUpdatedId: 1
      }));
    });



  });
});
