import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Empresa } from 'src/modules/organizacion/empresa/domain/entities/empresa.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import { TipoPersonalN } from 'src/modules/organizacion/personal/enums/tipo-personal';
import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import { Rol } from 'src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import * as bcrypt from 'bcrypt';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import { AlicuotaIva } from 'src/modules/gutil/alicuota-iva/domain/entities/alicuota-iva.entity';
import { EmpresaOperacionService } from 'src/modules/organizacion/empresa-operacion/empresa-operacion.service';

@Injectable()
export class SeedOrganizacionService {
  configuracionSistemaRepository: any;
  constructor(

    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,

    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,

    @InjectRepository(CondicionIva)
    private readonly condicionIVARepository: Repository<CondicionIva>,

    @InjectRepository(Localidad)
    private readonly localidadRepository: Repository<Localidad>,

    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(AlicuotaIva)
    private readonly alicuotaIvaRepository: Repository<AlicuotaIva>,


    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}


  /**
   * El que toca cordoba primero lo mato
   *
   */
  // Seed de Provincia
  async seedProvincia() {
    const entryData = [
      { denominacion: 'Córdoba', usuarioCreatedId: 1 },
      { denominacion: 'Buenos Aires', usuarioCreatedId: 1 },
      { denominacion: 'Ciudad Autónoma de Buenos Aires', usuarioCreatedId: 1 },
      { denominacion: 'Catamarca', usuarioCreatedId: 1 },
      { denominacion: 'Chaco', usuarioCreatedId: 1 },
      { denominacion: 'Chubut', usuarioCreatedId: 1 },
      { denominacion: 'Santa Fe', usuarioCreatedId: 1 },

      { denominacion: 'Corrientes', usuarioCreatedId: 1 },
      { denominacion: 'Entre Ríos', usuarioCreatedId: 1 },
      { denominacion: 'Formosa', usuarioCreatedId: 1 },
      { denominacion: 'Jujuy', usuarioCreatedId: 1 },
      { denominacion: 'La Pampa', usuarioCreatedId: 1 },
      { denominacion: 'La Rioja', usuarioCreatedId: 1 },
      { denominacion: 'Mendoza', usuarioCreatedId: 1 },
      { denominacion: 'Misiones', usuarioCreatedId: 1 },
      { denominacion: 'Neuquén', usuarioCreatedId: 1 },
      { denominacion: 'Río Negro', usuarioCreatedId: 1 },
      { denominacion: 'Salta', usuarioCreatedId: 1 },
      { denominacion: 'San Juan', usuarioCreatedId: 1 },
      { denominacion: 'San Luis', usuarioCreatedId: 1 },
      { denominacion: 'Santa Cruz', usuarioCreatedId: 1 },
      { denominacion: 'Santiago del Estero', usuarioCreatedId: 1 },
      {
        denominacion: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
        usuarioCreatedId: 1,
      },
      { denominacion: 'Tucumán', usuarioCreatedId: 1 },
    ];

    for (const data of entryData) {
      const exists = await this.provinciaRepository.findOneBy({
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

        const dataGuardada = this.provinciaRepository.create({
          denominacion: data.denominacion.toUpperCase(),
          usuarioCreatedId: usuarioCreated.id,
        } as DeepPartial<Provincia>);

        await this.provinciaRepository.save(dataGuardada);
        console.log(`✅ Provincia "${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ Provincia"${data.denominacion}" ya existe.`);
      }
    }
  }
  /*
*
No se les ocurra sacar primero a bell ville 
*/
  async seedLocalidad() {
    const entryData = [
      { localidad: 'Bell Ville', provincia: 'Córdoba', usuarioCreatedId: 1 },
      { localidad: 'Villa María', provincia: 'Córdoba', usuarioCreatedId: 1 },
      { localidad: 'Villa Nueva', provincia: 'Córdoba', usuarioCreatedId: 1 },
      { localidad: 'Leone', provincia: 'Córdoba', usuarioCreatedId: 1 },
      { localidad: 'Morrison', provincia: 'Córdoba', usuarioCreatedId: 1 },
      {
        localidad: 'San Marcos Sud',
        provincia: 'Córdoba',
        usuarioCreatedId: 1,
      },
      { localidad: 'Córdoba', provincia: 'Córdoba', usuarioCreatedId: 1 },
      { localidad: 'Rosario', provincia: 'Santa Fe', usuarioCreatedId: 1 },
      { localidad: 'La Plata', provincia: 'Buenos Aires', usuarioCreatedId: 1 },
      {
        localidad: 'San Fernando del Valle de Catamarca',
        provincia: 'Catamarca',
        usuarioCreatedId: 1,
      },
      { localidad: 'Resistencia', provincia: 'Chaco', usuarioCreatedId: 1 },
      { localidad: 'Rawson', provincia: 'Chubut', usuarioCreatedId: 1 },
      { localidad: 'Santa Fe', provincia: 'Santa Fe', usuarioCreatedId: 1 },
      { localidad: 'Corrientes', provincia: 'Corrientes', usuarioCreatedId: 1 },
      { localidad: 'Paraná', provincia: 'Entre Ríos', usuarioCreatedId: 1 },
      { localidad: 'Formosa', provincia: 'Formosa', usuarioCreatedId: 1 },
      {
        localidad: 'San Salvador de Jujuy',
        provincia: 'Jujuy',
        usuarioCreatedId: 1,
      },
      { localidad: 'Santa Rosa', provincia: 'La Pampa', usuarioCreatedId: 1 },
      { localidad: 'La Rioja', provincia: 'La Rioja', usuarioCreatedId: 1 },
      { localidad: 'Mendoza', provincia: 'Mendoza', usuarioCreatedId: 1 },
      { localidad: 'Posadas', provincia: 'Misiones', usuarioCreatedId: 1 },
      { localidad: 'Neuquén', provincia: 'Neuquén', usuarioCreatedId: 1 },
      { localidad: 'Viedma', provincia: 'Río Negro', usuarioCreatedId: 1 },
      { localidad: 'Salta', provincia: 'Salta', usuarioCreatedId: 1 },
      { localidad: 'San Juan', provincia: 'San Juan', usuarioCreatedId: 1 },
      { localidad: 'San Luis', provincia: 'San Luis', usuarioCreatedId: 1 },
      {
        localidad: 'Río Gallegos',
        provincia: 'Santa Cruz',
        usuarioCreatedId: 1,
      },
      {
        localidad: 'Santiago del Estero',
        provincia: 'Santiago del Estero',
        usuarioCreatedId: 1,
      },
      {
        localidad: 'San Miguel de Tucumán',
        provincia: 'Tucumán',
        usuarioCreatedId: 1,
      },
    ];

    for (const data of entryData) {
      const provincia = await this.provinciaRepository.findOneBy({
        denominacion: data.provincia,
      });

      if (!provincia) {
        console.log(`❌ No se encontró la provincia "${data.provincia}".`);
        continue;
      }

      const exists = await this.localidadRepository.findOneBy({
        denominacion: data.localidad,
        provincia: provincia,
      });

      if (!exists) {
        const usuarioCreated = await this.usuarioRepository.findOneBy({
          id: data.usuarioCreatedId,
        });

        if (!usuarioCreated) {
          console.log(
            `⚠️ No se encontró el usuario "${data.usuarioCreatedId}".`,
          );
          continue; 
        }

        const dataGuardada = this.localidadRepository.create({
          denominacion: data.localidad.toUpperCase(),
          provincia: provincia,
          usuarioCreatedId: usuarioCreated.id,
        } as DeepPartial<Localidad>);

        await this.localidadRepository.save(dataGuardada);
        console.log(
          `✅ Localidad "${data.localidad}" creada en provincia "${data.provincia}".`,
        );
      } else {
        console.log(
          `⚠️ Localidad "${data.localidad}" ya existe en provincia "${data.provincia}".`,
        );
      }
    }
  }

  // Seed de Condicion IVA
  async seedCondicionIVA() {
    const entryData = [
      {
        denominacion: 'Responsable Inscripto',
        letra: 'A',
        requiereCuit: true,
        requiereDocumento: false,
        usuarioCreatedId: 1,
        condicion: 1,
      },
      {
        denominacion: 'Responsable No Inscripto',
        letra: 'B',
        requiereCuit: true,
        requiereDocumento: false,
        usuarioCreatedId: 1,
        condicion: 0,
      },
      {
        denominacion: 'Monotributista',
        letra: 'A',
        usuarioCreatedId: 1,
        requiereCuit: true,
        requiereDocumento: false,
        condicion: 6,
      },
      {
        denominacion: 'Excento',
        letra: 'B',
        requiereCuit: true,
        requiereDocumento: false,
        usuarioCreatedId: 1,
        condicion: 4,
      },
      {
        denominacion: 'Consumidor Final',
        letra: 'B',
        requiereCuit: false,
        requiereDocumento: false /* ojo solo en caso de distrubuidora */,
        usuarioCreatedId: 1,
        condicion: 5,
      },
      {
        denominacion: 'Responsable No Categorizado',
        letra: 'B',
        requiereCuit: true,
        requiereDocumento: false,
        usuarioCreatedId: 1,
        condicion: 7,
      },
    ];

    for (const data of entryData) {
      const exists = await this.condicionIVARepository.findOneBy({
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

        const dataGuardada = this.condicionIVARepository.create({
          denominacion: data.denominacion.toUpperCase(),
          letra: data.letra,
          requiereCuit: data.requiereCuit,
          requiereDocumento: data.requiereDocumento,
          tipoCondicionIvaReceptor: data.condicion,
          usuarioCreatedId: usuarioCreated.id,
        } as DeepPartial<CondicionIva>);

        await this.condicionIVARepository.save(dataGuardada);
        console.log(`✅ Condicion IVA"${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ Condicion IVA"${data.denominacion}" ya existe.`);
      }
    }
  }

  async seedEmpresa() {
    const entryData = [
      {
        denominacion: 'Empresa',
        usuarioCreatedId: 1,
        categoriaIva: 'Responsable Inscripto',
        cuit: '30-33333333-9',
        fechaInicioActividad: new Date('2000-01-01'),
        telefono: '3537-353535',
        domicilio: 'Aca dierecion',
        email: 'empresa@gmail.com',
      },
      {
        denominacion: 'Empresa Respaldo',
        usuarioCreatedId: 1,
        categoriaIva: 'Consumidor Final',
      },
    ];

    for (const data of entryData) {
      const exists = await this.empresaRepository.findOneBy({
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

        const categoriaIva = await this.condicionIVARepository.findOneBy({
          denominacion: data.categoriaIva,
        });

        if (!categoriaIva) {
          console.log(
            `⚠️ No se encontró la condicion iva "${data.categoriaIva}".`,
          );
          continue; // Evita crear la línea sin superlínea
        }
        const dataGuardada = this.empresaRepository.create({
          denominacion: data.denominacion.toUpperCase(),
          usuarioCreatedId: usuarioCreated.id,
          //  categoriaIva: data.categoriaIva,
          cuit: data.cuit,

          fechaInicioActividad: data.fechaInicioActividad,
          telefono: data.telefono,
          domicilio: data.domicilio,
          email: data.email,
          condicionIva: categoriaIva,
        } as DeepPartial<Empresa>);

        await this.empresaRepository.save(dataGuardada);
        console.log(`✅ Empresa"${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ empresa"${data.denominacion}" ya existe.`);
      }
    }
  }

  async seedCliente() {
    const entryData = [
      {
        denominacion: 'Consumidor Final',
        categoriaIva: 'Consumidor Final',
        localidad: 'Villa María',
        sistema: 1,
        usuarioCreatedId: 1,
        vendedorId: 1,
      },
    ];

    for (const data of entryData) {
      const categoriaIva = await this.condicionIVARepository.findOneBy({
        denominacion: data.categoriaIva,
      });

      if (!categoriaIva) {
        console.log(
          `❌ No se encontró la categoria iva "${data.categoriaIva}".`,
        );
        continue;
      }

      const localidad = await this.localidadRepository.findOneBy({
        denominacion: data.localidad,
      });

      if (!localidad) {
        console.log(`❌ No se encontró la provincia "${data.localidad}".`);
        continue;
      }

      const usuarioCreated = await this.usuarioRepository.findOneBy({
        id: data.usuarioCreatedId,
      });

      if (!usuarioCreated) {
        console.log(`⚠️ No se encontró el usuario "${data.usuarioCreatedId}".`);
        continue; // Evita crear la línea sin superlínea
      }

      const vendedor = await this.personalRepository.findOneBy({
        id: data.vendedorId,
      });

      if (!vendedor) {
        console.log(`⚠️ No se encontró el vendedor "${data.vendedorId}".`);
        continue;
      }

      const empresa = await this.empresaRepository.findOneBy({
        id: 1,
      });

      const empresa2 = await this.empresaRepository.findOneBy({
        id: 2,
      });
      if (!empresa) {
        throw new Error('Empresa no encontrada');
      }

      if (!empresa2) {
        throw new Error('Empresa respaldo no encontrada');
      }



      const domicilio = new Domicilio();
      domicilio.localidad = localidad;
      const dataGuardada = this.clienteRepository.create({
        denominacion: data.denominacion.toUpperCase(),
        condicionIva: categoriaIva,
        condicionIvaId: categoriaIva.id,
        usuarioCreated: usuarioCreated,
        domicilio: domicilio,
 
        personal: vendedor,
        personalId: vendedor.id,
        sistema: data.sistema,
      });

      await this.clienteRepository.save(dataGuardada);
      console.log(
        `✅ Cliente "${data.denominacion}" condicion iva "${data.categoriaIva}".`,
      );
    }
  }



async seedPersonal() {
  const entryData = [
    {
      denominacion: 'Negocio',
      mail: 'negocio@gmail.com',
      sistema: 1,
      tipo: TipoPersonalN.VENDEDOR,
      localidad: 'VILLA MARIA',
      roles: ['Vendedor'],
      esVendedor: true,
      contrasena: '12345678',
      usuarioCreatedId: 1,
    },


    {
      denominacion: 'Repositor',
      mail: 'repositor@gmail.com',
      contrasena: '12345678',
      sistema: 1,
      localidad:'VILLA MARIA',
      esVendedor: false,
      roles: ['Repositor'],
      usuarioCreatedId: 1,
    },
    {
      denominacion: 'Jenifer Lopez',
      mail: 'administrador@gmail.com',
      contrasena: '12345678',
        localidad:'VILLA MARIA',
      sistema: 1,
      esVendedor: false,
      roles: ['Administrador', 'Vendedor'], 
      usuarioCreatedId: 1,
    },
    {
      denominacion: 'Thomas Perez',
      mail: 'tomasPerez@gmail.com',
      contrasena: 'tomas',
      sistema: 1,
      localidad: 'VILLA MARIA',
      esVendedor: false,
      roles: ['Administrador'],
      usuarioCreatedId: 1,
    },
    {
      denominacion: 'Repartidor',
      mail: 'repartidor@gmail.com',
      contrasena: '12345678',
      sistema: 1,
      localidad: 'VILLA MARIA',
      esVendedor: false,
      roles: ['Repartidor'],
      usuarioCreatedId: 1,
    },
    {
      denominacion: 'Cobrador',
      mail: 'cobrador@gmail.com',
      contrasena: '12345678',
      localidad: 'VILLA MARIA',
      sistema: 1,
      esVendedor: false,
      roles: ['Cobrador'],
      usuarioCreatedId: 1,
    },
  ];

  for (const data of entryData) {
    // 1. verificar si ya existe personal
    const existsPersonal = await this.personalRepository.findOne({
      where: { mail: data.mail },
      relations: ['usuario'],
    });

    if (existsPersonal) {
      console.log(`⚠️ Personal "${data.mail}" ya existe.`);
      continue;
    }

    // 2. buscar roles
    const roles = await this.rolRepository.findBy({
      denominacion: In(data.roles),
    });

    if (roles.length !== data.roles.length) {
      const faltantes = data.roles.filter(
        r => !roles.some(rol => rol.denominacion === r)
      );
      console.log(`❌ Roles no encontrados: ${faltantes.join(', ')}`);
      continue;
    }

    

    //  crear domicilio vacío
    const domicilio = new Domicilio();

    const personal = this.personalRepository.create({
      denominacion: data.denominacion.toUpperCase(),
      mail: data.mail,
      sistema: data.sistema,
      esVendedor: data.esVendedor,
      domicilio: domicilio,
    });

    await this.personalRepository.save(personal);

    // 5. crear usuario asociado
    const contrasenaHasheada = await bcrypt.hash(data.contrasena, 10);
    const usuario = this.usuarioRepository.create({
      mail: data.mail,
      contrasena: contrasenaHasheada,
      denominacion: data.denominacion,
      personal: personal,
      personalId: personal.id,  
      roles: roles, // 👈 ahora es array
      activo: true,
    });

    await this.usuarioRepository.save(usuario);
    personal.usuario = usuario;
    await this.personalRepository.save(personal);
    console.log(`✅ Personal y usuario "${data.denominacion}" creados.`);
  }
}
  
  async seedProveedor() {
    const entryData = [
      {
        denominacion: 'Proveedor 1.',
        categoriaIva: 'Responsable Inscripto',
        localidad: 'Villa María',
        usuarioCreatedId: 1,
        sistema: 1,
        esProveedorGastos: true, 
        esProveedorMateriaPrima: false, 
        cuit: '30507281784'

      },
      {
       denominacion: 'Proveedor 2.',
        categoriaIva: 'Responsable Inscripto',
        localidad: 'Villa María',
        usuarioCreatedId: 1,
        sistema: 1,
        esProveedorGastos: false, 
        esProveedorMateriaPrima: true,
        cuit: '30507281785'
      },
 
    ];

    for (const data of entryData) {
      const categoriaIva = await this.condicionIVARepository.findOneBy({
        denominacion: data.categoriaIva,
      });

      if (!categoriaIva) {
        console.log(
          `❌ No se encontró la categoria iva "${data.categoriaIva}".`,
        );
        continue;
      }

      const localidad = await this.localidadRepository.findOneBy({
        denominacion: data.localidad,
      });

      if (!localidad) {
        console.log(`❌ No se encontró la provincia "${data.localidad}".`);
        continue;
      }

      const usuarioCreated = await this.usuarioRepository.findOneBy({
        id: data.usuarioCreatedId,
      });

      if (!usuarioCreated) {
        console.log(`⚠️ No se encontró el usuario "${data.usuarioCreatedId}".`);
        continue; // Evita crear la línea sin superlínea
      }

      let empresa1 = await this.empresaRepository.findOneBy({ id: 1 });

      let empresa2 = await this.empresaRepository.findOneBy({ id: 2 });
      if (!empresa1) {
        throw new Error('Empresa no encontrada');
      }
      if (!empresa2) {
        throw new Error('Empresa respaldo no encontrada');
      }
 
    

      const domicilio = new Domicilio();
      domicilio.localidad = localidad;

      const dataGuardada = this.proveedorRepository.create({
        denominacion: data.denominacion.toUpperCase(),
        condicionIva: categoriaIva,
        esProveedorGastos:data.esProveedorGastos,
        esProveedorMateriaPrima:data.esProveedorMateriaPrima,
        cuit:data.cuit,
        domicilio: domicilio,
        usuarioCreated: usuarioCreated,
        codigoProveedor: '',
        sistema: data.sistema,
      });

      await this.proveedorRepository.save(dataGuardada);
      console.log(
        `✅ Proveedor "${data.denominacion}" condicion iva "${data.categoriaIva}".`,
      );
    }
  }


  // Ejecutar todos los seeds
  async runAllSeeds() {
    console.log('🚀 Iniciando todos los seeds...');


    await this.seedProvincia();
    await this.seedPersonal();
    await this.seedLocalidad();
    await this.seedCondicionIVA();
    await this.seedEmpresa();
    await this.seedCliente();
    await this.seedProveedor();

    await this.seedAlicuotaIVA();
    console.log('✅ Todos los seeds completados.');
  }
 

 async seedAlicuotaIVA() {
    const entryData = [
      {
        denominacion: "Normal",
        alicuota: 0.21,
        codigoAfip: 0,
        usuarioCreatedId: 1,
      },
      {
        denominacion: 'Reducida 10,5',
        alicuota: 0.105,
        codigoAfip: 2,
        usuarioCreatedId: 1,
      },
      {
        denominacion: 'Exento',
        alicuota: 0,
        codigoAfip: 3,
        usuarioCreatedId: 1,
      },
      {
        denominacion: "Veinte Siete",
        alicuota: 0.27,
        codigoAfip: 4,
        usuarioCreatedId: 1,
      },
      {
        denominacion:"Reducida 2,5",
        alicuota: 0.025,
        codigoAfip: 5,
        usuarioCreatedId: 1,
      },
   
    ];

    for (const data of entryData) {
      const exists = await this.condicionIVARepository.findOneBy({
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

        const dataGuardada = this.alicuotaIvaRepository.create({
          denominacion: data.denominacion.toUpperCase(),
          alicuota: data.alicuota,
          codigoAfip: data.codigoAfip,
          usuarioCreatedId: usuarioCreated.id,
        } as DeepPartial<AlicuotaIva>);

        await this.alicuotaIvaRepository.save(dataGuardada);
        console.log(`✅ Alicuota IVA"${data.denominacion}" creada.`);
      } else {
        console.log(`⚠️ Alicuota IVA"${data.denominacion}" ya existe.`);
      }
    }
  }

}
