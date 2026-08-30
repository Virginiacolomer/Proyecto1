import { Module } from '@nestjs/common';
import { ClienteOperacionService } from './cliente-operacion.service';
import { ClienteOperacionController } from './cliente-operacion.controller';

@Module({
  controllers: [ClienteOperacionController],
  providers: [ClienteOperacionService],
})
export class ClienteOperacionModule {}
