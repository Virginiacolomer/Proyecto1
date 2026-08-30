import { Module } from '@nestjs/common';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './application/controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from '../usuario/usuario.module';
import { Rol } from '../rol/domain/entities/rol.entity';
import { Usuario } from '../usuario/domain/entities/usuario.entity';
import { UsuarioService } from '../usuario/application/services/usuario.service';
import { RolModule } from '../rol/rol.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol]),
  JwtModule.registerAsync({
    global: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_ACCESS') }, // Valor por defecto
    }),
  }),
  UsuarioModule,
  RolModule
],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService],
})
export class AuthModule {}
