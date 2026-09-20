import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthGuard } from '../../src/modules/gestion-usuario/auth/auth.guard';
import { PresentacionService } from '../../src/modules/gestion-productos/presentacion/application/services/presentacion.service';

describe('Presentacion (e2e)', () => {
  let app: INestApplication;
  let presentacionService: PresentacionService;

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

    presentacionService = moduleFixture.get<PresentacionService>(PresentacionService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/presentacion (POST)', () => {
    it('debería crear una presentación', async () => {
      const createSpy = jest.spyOn(presentacionService, 'create').mockResolvedValue({
        message: 'Presentacion 500ml creada exitosamente',
      } as any);

      const response = await request(app.getHttpServer())
        .post('/presentacion')
        .send({ denominacion: ' 500ml ', usuarioCreatedId: 1 })
        .expect(201);

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        denominacion: '500ML',
        usuarioCreatedId: 1
      }));

      expect(response.body.message).toBeDefined();
    });
  });

  describe('/presentacion/search-by (GET)', () => {
    it('debería listar presentaciones con el filtro aplicado', async () => {
      const findBySpy = jest.spyOn(presentacionService, 'findBy').mockResolvedValue({
        data: [{ id: 1, denominacion: 'PACK X6' } as any],
        total: 1,
      });

      const response = await request(app.getHttpServer())
        .get('/presentacion/search-by?denominacion=pack')
        .expect(200);

      expect(findBySpy).toHaveBeenCalledWith('PACK', 0, 10, undefined);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('/presentacion/:id (DELETE)', () => {
    it('debería eliminar lógicamente la presentación (Soft Delete)', async () => {
      const removeSpy = jest.spyOn(presentacionService, 'remove').mockResolvedValue({
        message: 'Presentacion eliminada exitosamente',
      } as any);

      const response = await request(app.getHttpServer())
        .delete('/presentacion/1?usuarioId=2')
        .expect(200);

      expect(removeSpy).toHaveBeenCalledWith(1, 2);
      expect(response.body.message).toBeDefined();
    });
  });
});
