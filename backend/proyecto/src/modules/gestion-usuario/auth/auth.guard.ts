
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IUsuarioRepository } from '../usuario/domain/interfaces/usuario-repository.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,

    @Inject('IUsuarioRepository')
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const token = authorizationHeader.split(' ')[1];
    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      const payload = this.jwtService.verify(token, { secret });

      const usuario = await this.usuarioRepository.findOneWithRoles(
        payload.sub,
      );

      if (!usuario) {
        throw new UnauthorizedException('Usuario no existe');
      }



      request['user'] = usuario;

      const userRoles = usuario.roles.map((r) => r.denominacion);

      console.log('Handler:', context.getHandler().name);
      console.log('Class:', context.getClass().name);
      console.log('requiredRoles:', requiredRoles);

      const tieneRol = userRoles.some((role) => requiredRoles.includes(role));

      if (!tieneRol) {
        throw new ForbiddenException('No tienes permisos');
      }

      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new UnauthorizedException('Token inválido');
    }
  }
}
