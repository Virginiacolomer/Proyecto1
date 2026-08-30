import { Module } from '@nestjs/common';
import { BusquedasService } from './busquedas.service';
import { BusquedasController } from './busquedas.controller';

@Module({
   imports: [

    ],
  controllers: [BusquedasController],
  providers: [BusquedasService],
})
export class BusquedasModule {}
