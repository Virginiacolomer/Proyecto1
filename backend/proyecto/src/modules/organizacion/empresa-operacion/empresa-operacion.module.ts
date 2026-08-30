import { Module } from '@nestjs/common';
import { EmpresaOperacionService } from './empresa-operacion.service';
import { EmpresaOperacionController } from './empresa-operacion.controller';

@Module({
  controllers: [EmpresaOperacionController],
  providers: [EmpresaOperacionService],
})
export class EmpresaOperacionModule {}
