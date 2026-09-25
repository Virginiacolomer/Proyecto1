import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { ProductoService } from 'src/modules/gestion-productos/producto/application/services/producto.service';

describe('Producto - Búsqueda Rápida (e2e)', () => {
  let app: INestApplication;
  let productoService: ProductoService;

  beforeAll(async () => {
    // 1. ANULAR SEGURIDAD: Hacemos un mock del AuthGuard para que todos 
    // los requests del test pasen como "autorizados" (Evita el error 401).
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
    
    // Habilitamos los Pipes globales para que se aplique la limpieza de texto
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Obtenemos la instancia real del servicio para poder "espiarlo"
    productoService = moduleFixture.get<ProductoService>(ProductoService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/producto/search-by (GET)', () => {
    
    it('Escenario 1: Debería hacer trim y uppercase de la búsqueda', async () => {
      // Le decimos al servicio que devuelva un producto falso
      const findBySpy = jest.spyOn(productoService, 'findBy').mockResolvedValue({
        data: [{ id: 1, denominacion: 'Coca Cola' } as any],
        total: 1,
      });

      // Enviamos el HTTP Request con texto sucio (" CoCa ")
      const response = await request(app.getHttpServer())
        .get('/producto/search-by?denominacion=%20CoCa%20')
        .expect(200);

      // Verificamos que el Pipe del controlador haya limpiado el texto a "COCA"
      expect(findBySpy).toHaveBeenCalledWith(
        'COCA', 
        undefined,
        false, 
        undefined,
        undefined,
        undefined,
        undefined, // superLineaId (no se envía: no filtra, igual que marcaId/lineaId)
        undefined,
        undefined,
        0, 
        10, 
      );

      expect(response.body.data).toHaveLength(1);
    });

    it('Escenario 2: Búsqueda sin coincidencias retorna vacío', async () => {
      jest.spyOn(productoService, 'findBy').mockResolvedValue({
        data: [],
        total: 0,
      });

      const response = await request(app.getHttpServer())
        .get('/producto/search-by?denominacion=palabrainexistente')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('Escenario 3: Búsqueda sin texto debe devolver la lista normal', async () => {
      const findBySpy = jest.spyOn(productoService, 'findBy').mockResolvedValue({
        data: [{ id: 1, denominacion: 'Producto 1' } as any],
        total: 100,
      });

      // Petición HTTP sin parámetro de denominación (blanqueo)
      const response = await request(app.getHttpServer())
        .get('/producto/search-by')
        .expect(200);

      // Verificamos que el default parameter de denominación sea ''
      expect(findBySpy).toHaveBeenCalledWith(
        '', 
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        undefined, // superLineaId (no se envía: no filtra, igual que marcaId/lineaId)
        undefined,
        undefined,
        0, 
        10,
      );

      expect(response.body.total).toBe(100);
    });

  });
});
