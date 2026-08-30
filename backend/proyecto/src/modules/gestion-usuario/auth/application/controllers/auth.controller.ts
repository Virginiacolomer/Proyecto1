import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegistrarUsuarioDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { Usuario } from '../../../usuario/domain/entities/usuario.entity';
import { CambiarContrasenaDto } from '../../dto/cambiar-contrasena.dto';
import { RecuperarPasswordDto } from '../../dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from '../../dto/verificar-codigo.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('registrar')
  async register(@Body() registrarUsuarioDto: RegistrarUsuarioDto): Promise<Usuario> {
    return this.authService.registrarUsuario(registrarUsuarioDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    // Verificar las credenciales y obtener los tokens y el usuario
    const resultado = await this.authService.login(loginDto);  // Pasar el DTO directamente

    if (!resultado) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    return resultado;
  }

  @Post('login-con-google')
  async loginConGoogle(@Body() body: { token: string; empresaId: number }): Promise<any> {
    console.log(' Proceso de login con Google iniciado', body);
    return this.authService.loginConGoogle(body.token, body.empresaId);
  }

  @Post('recuperar')
  async recuperarPassword(@Body() dto: RecuperarPasswordDto) {
    return this.authService.enviarCodigoRecuperacion(dto);
  }

  @Post('verificar-codigo')
  async verificarCodigo(
    @Body() dto: VerificarCodigoDto
  ) {
    return this.authService.verificarCodigo(dto);
  }

  @Patch('cambiar-contrasena')
  async cambiarContrasena(@Body() dto: CambiarContrasenaDto) {
    return this.authService.cambiarContrasena(dto);
  }

}
