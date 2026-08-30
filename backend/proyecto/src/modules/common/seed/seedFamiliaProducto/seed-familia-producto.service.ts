import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Linea } from 'src/modules/gestion-productos/linea/domain/entities/linea.entity';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class SeedFamiliaProductoService {
  constructor(

    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,

    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,



    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,


  ) {}


  async seedLineas() {
    const entryData = [
      {
        denominacion: 'Aceites',
        sistema: 0,
        usuarioCreatedId: 1,
      },

      {
        denominacion: 'Aceitunas',
        sistema: 0,
        usuarioCreatedId: 1,
      },

      {
        denominacion: 'Azucar',
        sistema: 0,
        usuarioCreatedId: 1,
      },
    
      {
        denominacion: 'BOLSAS',
        sistema: 0,
        usuarioCreatedId: 1,
      },

      {
        denominacion: 'Chocolates',
        sistema: 0,
        usuarioCreatedId: 1,
      },

      {
        denominacion: 'HARINAS',
        sistema: 0,
        usuarioCreatedId: 1,
      },

      {
        denominacion: 'MARGARINAS Y GRASAS',
        sistema: 0,
        usuarioCreatedId: 1,
      },

    
    ];

    for (const data of entryData) {
      const exists = await this.lineaRepository.findOneBy({
        denominacion: data.denominacion.toUpperCase(),
      });

      if (!exists) {
        
        const usuarioCreated = await this.usuarioRepository.findOneBy({
          id: data.usuarioCreatedId,
        });

        if (!usuarioCreated) {
          console.log(
            `⚠️ No se encontró el usuario "${data.usuarioCreatedId}".`,
          );
          continue; // Evita crear la línea sin superlínea
        }

        const linea = this.lineaRepository.create({
          denominacion: data.denominacion.toUpperCase(),
          sistema: data.sistema,

          usuarioCreatedId: usuarioCreated.id,
        } as DeepPartial<Linea>); 

        await this.lineaRepository.save(linea);
        console.log(`✅ Linea "${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ Linea "${data.denominacion}" ya existe.`);
      }
    }
  }

  // Seed de Marcas
  async seedMarcas() {
    const entryData = [
      { denominacion: 'SIN MARCA', usuarioCreatedId: 1, sistema: 0 },
      { denominacion: 'CAROYENSE', usuarioCreatedId: 1, sistema: 0 },
      { denominacion: 'CIRCE', usuarioCreatedId: 1, sistema: 0 },
    
    ];

    for (const data of entryData) {
      const exists = await this.marcaRepository.findOneBy({
        denominacion: data.denominacion,
      });

      if (!exists) {
        const usuarioCreated = await this.usuarioRepository.findOneBy({
          id: data.usuarioCreatedId,
        });

        if (!usuarioCreated) {
          console.log(
            `⚠️ No se encontró el usuario "${data.usuarioCreatedId}".`,
          );
          continue; // Evita crear la línea sin superlínea
        }

        const marca = this.marcaRepository.create({
          denominacion: data.denominacion.toUpperCase(),
          usuarioCreatedId: usuarioCreated.id,
          sistema: data.sistema,
        } as DeepPartial<Marca>);

        await this.marcaRepository.save(marca);
        console.log(`✅ Marca "${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ Marca "${data.denominacion}" ya existe.`);
      }
    }
  }


  async runAllSeeds() {
    console.log('🚀 Iniciando todos los seeds...');


   await  this.seedLineas();
    await this.seedMarcas();

    console.log('✅ Todos los seeds completados.');
  }
}
