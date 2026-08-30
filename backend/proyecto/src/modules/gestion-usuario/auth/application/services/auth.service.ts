import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrarUsuarioDto } from '../../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../../../usuario/application/services/usuario.service';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import { CambiarContrasenaDto } from '../../dto/cambiar-contrasena.dto';
import { RecuperarPasswordDto } from '../../dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from '../../dto/verificar-codigo.dto';
import { PersonalPersistenceAdapter } from 'src/modules/organizacion/personal/infraestructure/repositories/personal.persistence-adapters';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
    private readonly configService: ConfigService,
  ) {}
  async registrarUsuario(
    registrarUsuarioDto: RegistrarUsuarioDto,
  ): Promise<any> {
    const { mail, contrasena, rolId, denominacion } = registrarUsuarioDto;

    // Hashear la contraseña
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    registrarUsuarioDto.contrasena = contrasenaHasheada;

    // Crear la entidad Usuario pasando todos los parámetros
    const usuario = this.usuarioService.create(registrarUsuarioDto);

    return usuario;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { mail, contrasena, empresaId } = loginDto; // Desestructuramos el DTO

    // Buscar el usuario por mail con todas sus relaciones
    const usuario = await this.usuarioService.findByMail(mail);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar la contraseña
    const contrasenaValidada = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );
    if (!contrasenaValidada) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Obtener tiempos de expiración desde las variables de entorno
    const accessTokenExp = this.configService.get<string>(
      'JWT_EXPIRATION_ACCESS',
      '60s',
    );
    const refreshTokenExp = this.configService.get<string>(
      'JWT_EXPIRATION_REFRESH',
      '7d',
    );

    // Generar los tokens
  // const payload = { id: usuario.id, rolId: 1 , empresaId: empresaId , puntoVentaId: process.env.PUNTO_VENTA_ACTIVO_ID };

    const payload = {
      sub: usuario.id,
      personalId:usuario.personalId,
      roles: usuario.roles.map((r) => r.id),
      empresaId: empresaId,
      puntoVentaId: process.env.PUNTO_VENTA_ACTIVO_ID,
    };  

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExp,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExp,
    });

    return {
      accessToken,
      refreshToken,
      usuario, // Incluye el usuario con todas sus relaciones
    };
  }

  async loginConGoogle(token: string, empresaId: number): Promise<any> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    console.log('🔵 GOOGLE_CLIENT_ID:', clientId);
    const client = new OAuth2Client(clientId);
    console.log('🔵 CLIENTE:', client);

    let email;
    let name;
    // Verificamos el token con Google
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      email = payload?.email;
      name = payload?.name;
      console.log('🟢 Payload de Google:', payload);

      // ... resto del código
    } catch (error) {
      console.error('🔴 Error al verificar el token de Google:', error);
      throw new UnauthorizedException('Token de Google inválido o expirado');
    }

    // Buscar usuario por email
    let usuario = await this.usuarioService.findByMail(email);
    console.log('🟢 Usuario encontrado:', usuario);

    // Si no existe, lo creamos automáticamente
    if (!usuario) {
      console.log('🟠 Usuario no existe, se va a crear uno nuevo');

      const registrarUsuarioDto: RegistrarUsuarioDto = {
        mail: email,
        contrasena: Math.random().toString(36).slice(-10), // contraseña aleatoria
        rolId: 2, // Asignar un rol por defecto, por ejemplo "Empleado"
        denominacion: name,
      };
      console.log('🟠 Registrar Usuario DTO:', registrarUsuarioDto);

      usuario = await this.registrarUsuario(registrarUsuarioDto);
    }

    const payloadJwt = {
      id: usuario?.id,
      rolId: 1, //usuario?.rol.id,
      empresaId: empresaId, // poné la lógica que te sirva
      puntoVentaId: process.env.PUNTO_VENTA_ACTIVO_ID,
    };


    const accessTokenExp = this.configService.get<string>(
      'JWT_EXPIRATION_ACCESS',
      '60s',
    );
    const refreshTokenExp = this.configService.get<string>(
      'JWT_EXPIRATION_REFRESH',
      '7d',
    );

    const accessToken = this.jwtService.sign(payloadJwt, {
      expiresIn: accessTokenExp,
    });
    const refreshToken = this.jwtService.sign(payloadJwt, {
      expiresIn: refreshTokenExp,
    });

    return {
      accessToken,
      refreshToken,
      usuario,
    };
  }

  async enviarCodigoRecuperacion(dto: RecuperarPasswordDto) {
    const { mail } = dto;

    const usuario = await this.usuarioService.findByMail(mail);
    if (!usuario) {
      throw new UnauthorizedException('El correo no está registrado');
    }

    // Generar un código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    usuario.codigoRecuperacion = codigo;
    usuario.codigoExpira = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await this.usuarioService.save(usuario); // O el método que uses para persistir

    await this.enviarCorreoRecuperacion(usuario.mail, codigo);

    return { mensaje: 'Se ha enviado un código de verificación al correo' };
  }

  private async enviarCorreoRecuperacion(destinatario: string, codigo: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASS'),
        },
      });

      console.log(this.configService.get('EMAIL_USER'));
      console.log(this.configService.get('EMAIL_PASS'));
      console.log('Enviando correo a:', destinatario);

      const info = await transporter.sendMail({
        from: `"Sistema de Recuperación" <${this.configService.get('EMAIL_USER')}>`,
        to: destinatario,
        subject: 'Código de recuperación de contraseña',
        text: `Tu código de recuperación es: ${codigo}`,
        html: `<p>Tu código de recuperación es: <strong>${codigo}</strong></p>`,
      });

      console.log('Correo enviado:', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }

  async verificarCodigo(dto: VerificarCodigoDto): Promise<boolean> {
    const { mail, codigo } = dto;
    const usuario = await this.usuarioService.findByMail(mail);
    if (
      !usuario ||
      usuario.codigoRecuperacion !== codigo ||
      usuario.codigoExpira < new Date()
    ) {
      throw new BadRequestException('Código inválido o expirado');
    }
    return true;
  }

  async cambiarContrasena(dto: CambiarContrasenaDto): Promise<string> {
    const { mail, nuevaContrasena } = dto;

    try {
      const usuario = await this.usuarioService.findByMail(mail);

      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const hash = await bcrypt.hash(nuevaContrasena, 10);

      usuario.contrasena = hash;

      await this.usuarioService.save(usuario);

      return 'Contraseña actualizada correctamente.';
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw new InternalServerErrorException(
        'Error interno al cambiar contraseña',
      );
    }
  }
}
