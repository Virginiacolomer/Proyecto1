import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedUsuarioService {
  constructor(

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

  ) { }


  // Seed de Roles
  async seedRol() {
    /* ojo no cambiar el orden */
    const entryData =  [

      { denominacion: 'Administrador' },
      { denominacion: 'Empleado' },
      { denominacion: 'Repositor' },
      { denominacion: 'Vendedor' },
      { denominacion: 'Admin' },
      { denominacion: 'Repartidor' },
      { denominacion: 'Cobrador' },

    ];


    for (const data of entryData) {
      const exists = await this.rolRepository.findOneBy({
        denominacion: data.denominacion
      });

      if (!exists) {
        const dataGuardada = this.rolRepository.create(data); 
        await this.rolRepository.save(dataGuardada);
        console.log(`✅ Rol "${data.denominacion}" creado.`);
      } else {
        console.log(`⚠️ Rol"${data.denominacion}" ya existe.`);
      }
    }
  }


 // Seed de Usuarios
async seedUsuario() {

  const entryData = [
    { mail: 'admin@gmail.com', contrasena: 'admin', rol: "Admin", denominacion:"Admin" },
  
  ];

  for (const data of entryData) {

    const rol = await this.rolRepository.findOneBy({
      denominacion: data.rol
    });

    if (!rol) {
      console.log(`❌ No se encontró el rol "${data.rol}".`);
      continue;
    }

    const exists = await this.usuarioRepository.findOneBy({
      mail: data.mail
    });

    if (exists) {
      console.log(`⚠️ Usuario "${data.mail}" ya existe.`);
      continue;
    }

    const contrasenaHasheada = await bcrypt.hash(data.contrasena, 10);

    const usuario = this.usuarioRepository.create({
      mail: data.mail,
      contrasena: contrasenaHasheada,
      denominacion: data.denominacion,
      roles: [rol], 
    });

    await this.usuarioRepository.save(usuario);

    console.log(`✅ Usuario "${data.mail}" creado.`);
  }
}


  // Ejecutar todos los seeds
  async runAllSeeds() {
    console.log('🚀 Iniciando todos los seeds...');
  
    await this.seedRol();
    await this.seedUsuario();
    console.log('✅ Todos los seeds completados.');
  }
}

