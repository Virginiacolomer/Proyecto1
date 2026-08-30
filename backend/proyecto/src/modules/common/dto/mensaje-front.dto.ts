import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class MensajeFrontDto {

    
  @IsString()
  @ApiProperty({  description: 'Mensaje al front' })
  mensaje: string;
}