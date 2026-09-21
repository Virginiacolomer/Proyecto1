import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthGuard } from '../../src/modules/gestion-usuario/auth/auth.guard';
import { ProductoService } from '../../src/modules/gestion-productos/producto/application/services/producto.service';

describe('Producto (e2e) - HU-008', () => {
  let app: INestApplication;
  let productoService: ProductoService;

  beforeAll(async () => {
    const mockAuthGuard = { canActivate: jest.fn(() => true) };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true, whitelist: true, forbidNonWhitelisted: true 
    }));
    productoService = moduleFixture.get<ProductoService>(ProductoService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Escenario 2: Alta de producto exitosa sin enviar el campo precio', () => {
    it('debería registrar exitosamente el producto sin errores estructurales al omitir precio', async () => {
      const createSpy = jest.spyOn(productoService, 'create').mockResolvedValue({
        message: 'Producto creado exitosamente'
      } as any);

      // Enviamos el payload OMITIENDO el precio, tal como debe hacer el frontend
      const response = await request(app.getHttpServer())
        .post('/producto')
        .send({ 
          denominacion: 'PRODUCTO TEST', 
          costo: 1000, 
          porcentaje: 21,
          utilizaStockMinimo: false,
          utilizaPack: false,
          alicuotaIva: 21,
          lineaId: 1, 
          marcaId: 1, 
          presentacionId: 1, 
          usuarioCreatedId: 1 
        })
        .expect(201);

      // Verificamos que el servicio haya recibido los datos omitiendo precio
      expect(createSpy).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Escenario 3: Edición de producto exitosa sin enviar el campo precio', () => {
    it('debería procesar la actualización exitosamente sin errores estructurales', async () => {
      const updateSpy = jest.spyOn(productoService, 'update').mockResolvedValue({
        message: 'Producto actualizado exitosamente'
      } as any);

      // Enviamos el payload OMITIENDO el precio
      const response = await request(app.getHttpServer())
        .put('/producto/1')
        .send({ 
          costo: 2000, 
          usuarioUpdatedId: 1 
        })
        .expect(200);

      expect(updateSpy).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
