import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { ProductoService } from 'src/modules/gestion-productos/producto/application/services/producto.service';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { NotFoundException } from '@nestjs/common';

describe('Producto - Historial Precios (e2e)', () => {
  let app: INestApplication;
  let productoService: ProductoService;

  beforeAll(async () => {
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
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    productoService = moduleFixture.get<ProductoService>(ProductoService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /producto/:id/historial-precios', () => {

    it('Debería devolver el historial ordenado correctamente si el producto existe', async () => {
      const historialMock = [
        {
          id: 2,
          precioAnterior: 1200,
          precioNuevo: 1500,
          motivo: 'Aumento inflación',
          fecha: new Date('2023-11-01T10:00:00Z'),
        },
        {
          id: 1,
          precioAnterior: 1000,
          precioNuevo: 1200,
          motivo: 'Aumento inicial',
          fecha: new Date('2023-10-01T10:00:00Z'),
        }
      ];

      const getSpy = jest.spyOn(productoService, 'getHistorialPrecios').mockResolvedValue(historialMock);

      const response = await request(app.getHttpServer())
        .get('/producto/1/historial-precios')
        .expect(200);

      expect(getSpy).toHaveBeenCalledWith(1);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBe(2);
      expect(response.body[1].id).toBe(1);
      expect(response.body[0].motivo).toBe('Aumento inflación');
      // Asegurarse de que no venga un objeto Producto dentro de cada registro
      expect(response.body[0].producto).toBeUndefined();
    });

    it('Debería devolver array vacío si el producto existe pero no tiene historial', async () => {
      const getSpy = jest.spyOn(productoService, 'getHistorialPrecios').mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/producto/2/historial-precios')
        .expect(200);

      expect(getSpy).toHaveBeenCalledWith(2);
      expect(response.body).toEqual([]);
    });

    it('Debería propagar el error 404 si el producto no existe', async () => {
      jest.spyOn(productoService, 'getHistorialPrecios').mockRejectedValue(new NotFoundException('Entidad no encontrada.'));

      await request(app.getHttpServer())
        .get('/producto/999/historial-precios')
        .expect(404);
    });

  });
});
