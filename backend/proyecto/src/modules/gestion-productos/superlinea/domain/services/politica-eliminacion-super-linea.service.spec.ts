import { Test, TestingModule } from '@nestjs/testing';
import { PoliticaEliminacionSuperLinea } from './politica-eliminacion-super-linea.service';
import { ISuperLineaRepository } from '../interfaces/super-linea.repository.interface';

describe('PoliticaEliminacionSuperLinea (In-module Domain Unit Tests)', () => {
  let politica: PoliticaEliminacionSuperLinea;
  let repository: jest.Mocked<ISuperLineaRepository>;

  beforeEach(async () => {
    const mockRepo: Partial<ISuperLineaRepository> = {
      existsLineasActivasBySuperLinea: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliticaEliminacionSuperLinea,
        { provide: 'ISuperLineaRepository', useValue: mockRepo },
      ],
    }).compile();

    politica = module.get<PoliticaEliminacionSuperLinea>(PoliticaEliminacionSuperLinea);
    repository = module.get('ISuperLineaRepository');
  });

  it('debe estar definido', () => {
    expect(politica).toBeDefined();
  });
});
