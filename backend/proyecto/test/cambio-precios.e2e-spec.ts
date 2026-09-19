import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

/**
 * E2E de CR-006 (Actualización masiva de precios) contra una base MySQL
 * real (no hay mocks acá, a diferencia de los tests unitarios).
 *
 * Prerrequisitos para correr este archivo:
 *   1) docker compose -p proyecto up -d   (en backend/proyecto)
 *   2) yarn migration:run
 *   3) que exista el usuario seedeado administrador@gmail.com / 12345678
 *      con empresaId 1 (GET http://localhost:3000/api/seed-all/execute)
 *   4) yarn test:e2e --testPathPattern=cambio-precios
 *
 * Nota importante: acá SÍ se respeta la validación real del DTO
 * (`@IsPositive()` en `valor`), a diferencia de los tests unitarios de
 * cambio-precios.service.spec.ts, que la saltean a propósito para probar
 * la regla del dominio de forma aislada. Por eso este archivo NO repite
 * el "Caso 3/4" (precio resultante <= 0): con un `valor` siempre positivo,
 * la API real nunca deja llegar un pedido que pueda producir ese
 * resultado — la reject la hace el propio DTO, antes de tocar el dominio.
 */
jest.setTimeout(30000); // login + crear 6 fixtures por HTTP puede superar los 5s por defecto

describe('CambioPrecios (e2e) - CR-006', () => {
  let app: INestApplication<App>;
  let server: App;
  let token: string;
  let usuarioId: number;

  let marcaId: number;
  let lineaGaseosasId: number;
  let lineaOtraId: number;
  let productoCocaColaId: number;
  let productoSpriteId: number;
  let productoOtraLineaId: number;

  const sufijo = Date.now();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replica lo que hace main.ts (createNestApplication() en el test NO
    // ejecuta bootstrap()): prefijo /api y el mismo ValidationPipe global.
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
    server = app.getHttpServer();

    // --- Login con el usuario seedeado (ver README de levantamiento) ---
    const loginRes = await request(server).post('/api/auth/login').send({
      mail: 'administrador@gmail.com',
      contrasena: '12345678',
      empresaId: 1,
    });

    if (loginRes.status !== 201 && loginRes.status !== 200) {
      throw new Error(
        `No se pudo loguear con el usuario seedeado (status ${loginRes.status}). ` +
          `Verificá que corriste el seed-all antes de este test. Body: ${JSON.stringify(loginRes.body)}`,
      );
    }

    token = loginRes.body.accessToken;
    usuarioId = loginRes.body.usuario.id;

    // --- Fixtures: marca, dos líneas y tres productos ---
    await crearMarca();
    lineaGaseosasId = await crearLinea(`Gaseosas E2E ${sufijo}`);
    lineaOtraId = await crearLinea(`Otra Linea E2E ${sufijo}`);

    productoCocaColaId = await crearProducto(`Coca-Cola E2E ${sufijo}`, lineaGaseosasId, 1000);
    productoSpriteId = await crearProducto(`Sprite E2E ${sufijo}`, lineaGaseosasId, 2000);
    productoOtraLineaId = await crearProducto(`Detergente E2E ${sufijo}`, lineaOtraId, 1000);
  });

  afterAll(async () => {
    // Limpieza best-effort: si algo falla acá no hace fallar la suite.
    await Promise.allSettled([
      eliminarProducto(productoCocaColaId),
      eliminarProducto(productoSpriteId),
      eliminarProducto(productoOtraLineaId),
      eliminarLinea(lineaGaseosasId),
      eliminarLinea(lineaOtraId),
      eliminarMarca(marcaId),
    ]);
    await app.close();
  });

  // ------------------------------------------------------------------
  // Helpers de fixtures (usan la API real, con el token de Administrador)
  // ------------------------------------------------------------------

  async function crearMarca(): Promise<void> {
    await request(server)
      .post('/api/marca')
      .set('Authorization', `Bearer ${token}`)
      .send({ denominacion: `Marca E2E ${sufijo}`, usuarioCreatedId: usuarioId })
      .expect(201);

    const res = await request(server)
      .get('/api/marca/search-by')
      .set('Authorization', `Bearer ${token}`)
      .query({ denominacion: `Marca E2E ${sufijo}` });

    marcaId = res.body.data.find((m: any) => m.denominacion.includes(`${sufijo}`))?.id;
    if (!marcaId) throw new Error('No se pudo obtener el id de la marca de prueba.');
  }

  async function crearLinea(denominacion: string): Promise<number> {
    await request(server)
      .post('/api/linea')
      .set('Authorization', `Bearer ${token}`)
      .send({ denominacion, utilizaStockMinimo: false, usuarioCreatedId: usuarioId })
      .expect(201);

    const res = await request(server)
      .get('/api/linea/search-by')
      .set('Authorization', `Bearer ${token}`)
      .query({ denominacion });

    const id = res.body.data.find((l: any) => l.denominacion.includes(`${sufijo}`))?.id;
    if (!id) throw new Error(`No se pudo obtener el id de la línea "${denominacion}".`);
    return id;
  }

  async function crearProducto(
    denominacion: string,
    lineaId: number,
    precio: number,
  ): Promise<number> {
    const res = await request(server)
      .post('/api/producto')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denominacion,
        lineaId,
        marcaId,
        alicuotaIva: 21,
        utilizaStockMinimo: false,
        utilizaPack: false,
        precio,
        usuarioCreatedId: usuarioId,
      })
      .expect(201);

    void res; // el create no devuelve el id (solo un mensaje) -> hay que buscarlo

    const busqueda = await request(server)
      .get('/api/producto/search-by-rapido')
      .set('Authorization', `Bearer ${token}`)
      .query({ codigo: denominacion, exacto: false, skip: 0, take: 5 });

    // El backend normaliza la denominación a minúsculas al crear
    // (NormalizeDenominacionPipe), así que comparamos por el sufijo único
    // en vez de por igualdad exacta contra el string original.
    const id = busqueda.body.data.find((p: any) =>
      p.denominacion?.toLowerCase().includes(`${sufijo}`),
    )?.id;
    if (!id) throw new Error(`No se pudo obtener el id del producto "${denominacion}".`);
    return id;
  }

  async function obtenerPrecio(productoId: number): Promise<number> {
    const res = await request(server)
      .get(`/api/producto/${productoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    return res.body.precio;
  }

  async function eliminarProducto(id: number) {
    if (!id) return;
    await request(server)
      .delete(`/api/producto/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .query({ usuarioId });
  }

  async function eliminarLinea(id: number) {
    if (!id) return;
    await request(server)
      .delete(`/api/linea/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .query({ usuarioId });
  }

  async function eliminarMarca(id: number) {
    if (!id) return;
    await request(server)
      .delete(`/api/marca/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .query({ usuarioId });
  }

  // ------------------------------------------------------------------
  // Tests
  // ------------------------------------------------------------------

  it('rechaza simular sin token (401)', async () => {
    await request(server)
      .post('/api/cambio-precios/simular')
      .send({ tipoAjuste: 'PORCENTAJE', valor: 10 })
      .expect(401);
  });

  it('rechaza aplicar sin motivo (400 - validación del DTO)', async () => {
    await request(server)
      .post('/api/cambio-precios/aplicar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipoAjuste: 'PORCENTAJE',
        valor: 10,
        lineaId: lineaGaseosasId,
        usuarioCreatedId: usuarioId,
        // sin "motivo"
      })
      .expect(400);
  });

  it('simular no persiste nada (el precio sigue igual después)', async () => {
    const precioAntes = await obtenerPrecio(productoCocaColaId);

    const res = await request(server)
      .post('/api/cambio-precios/simular')
      .set('Authorization', `Bearer ${token}`)
      .send({ tipoAjuste: 'PORCENTAJE', valor: 10, lineaId: lineaGaseosasId })
      .expect(201);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productoId: productoCocaColaId, precioNuevo: 1100 }),
      ]),
    );

    const precioDespues = await obtenerPrecio(productoCocaColaId);
    expect(precioDespues).toBe(precioAntes);
  });

  it('aplica un 10% a la línea Gaseosas, persiste el cambio y no toca otra línea', async () => {
    const res = await request(server)
      .post('/api/cambio-precios/aplicar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipoAjuste: 'PORCENTAJE',
        valor: 10,
        lineaId: lineaGaseosasId,
        motivo: 'Aumento e2e de la línea Gaseosas',
        usuarioCreatedId: usuarioId,
      })
      .expect(201);

    expect(res.body.fallidos).toHaveLength(0);
    expect(res.body.actualizados).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productoId: productoCocaColaId, precioNuevo: 1100 }),
        expect.objectContaining({ productoId: productoSpriteId, precioNuevo: 2200 }),
      ]),
    );

    // Quedó realmente guardado en la base.
    expect(await obtenerPrecio(productoCocaColaId)).toBe(1100);
    expect(await obtenerPrecio(productoSpriteId)).toBe(2200);

    // El producto de la otra línea no se tocó.
    expect(await obtenerPrecio(productoOtraLineaId)).toBe(1000);
  });
});
