import { Injectable, Logger } from '@nestjs/common';
import { UpdateDomicilioDto } from './dto/update-domicilio.dto';
import { Localidad } from '../localidad/domain/entities/localidad.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { EntityManager } from 'typeorm';
import { Domicilio } from './entities/domicilio.entity';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';

@Injectable()
export class DomicilioService {
  private readonly logger = new Logger(DomicilioService.name);  
    

  async create( uow: IUnitOfWork,ciudad: Localidad,direccion: string,usuarioCreatedId:number): Promise<Domicilio> {
    const repo = uow.getRepository(Domicilio);

    const domicilio = repo.create({
      direccion: direccion,
      localidad: ciudad,
      usuarioCreatedId: usuarioCreatedId
    });
  
    const domicilioGuardado = await repo.save(domicilio);
    return domicilioGuardado;
  }


  findAll() {
    return `This action returns all domicilio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} domicilio`;
  }

  update(id: number, updateDomicilioDto: UpdateDomicilioDto) {
    return `This action updates a #${id} domicilio`;
  }

  remove(id: number) {
    return `This action removes a #${id} domicilio`;
  }
}
