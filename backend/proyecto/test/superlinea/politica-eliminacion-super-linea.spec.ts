import { Test, TestingModule } from '@nestjs/testing';
import { PoliticaEliminacionSuperLinea } from 'src/modules/gestion-productos/superlinea/domain/services/politica-eliminacion-super-linea.service';
import { ISuperLineaRepository } from 'src/modules/gestion-productos/superlinea/domain/interfaces/super-linea.repository.interface';

describe('PoliticaEliminacionSuperLinea (Domain Service Tests)', () => {
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

  it('debe retornar true si existen líneas activas vinculadas', async () => {
    repository.existsLineasActivasBySuperLinea.mockResolvedValue(true);

    const result = await politica.tieneLineasActivasParaSuperLinea(1);

    expect(repository.existsLineasActivasBySuperLinea).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  it('debe retornar false si no existen líneas activas vinculadas', async () => {
    repository.existsLineasActivasBySuperLinea.mockResolvedValue(false);

    const result = await politica.tieneLineasActivasParaSuperLinea(2);

    expect(repository.existsLineasActivasBySuperLinea).toHaveBeenCalledWith(2);
    expect(result).toBe(false);
  });
});
