import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './modules/gestion-productos/marca/marca.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineaModule } from './modules/gestion-productos/linea/linea.module';
import { ProductoModule } from './modules/gestion-productos/producto/producto.module';
import { ConfigModule } from '@nestjs/config';
import { ProveedorModule } from './modules/organizacion/proveedor/proveedor.module';
import { PersonalModule } from './modules/organizacion/personal/personal.module';
import { ClienteModule } from './modules/organizacion/cliente/cliente.module';
import { UsuarioModule } from './modules/gestion-usuario/usuario/usuario.module';
import { SeedFamiliaProductoModule } from './modules/common/seed/seedFamiliaProducto/seed-familia-producto.module';
import { SeedOrganizacionModule } from './modules/common/seed/seed-organizacion/seed-organizacion.module';
import { AuthModule } from './modules/gestion-usuario/auth/auth.module';
import { RolModule } from './modules/gestion-usuario/rol/rol.module';
import { SeedAllModule } from './modules/common/seed/seed-all/seed-all.module';
import { SeedUsuarioModule } from './modules/common/seed/seed-usuario/seed-usuario.module';
import { FilesModule } from './modules/common/files/files.module';
import { ProveedorOperacionModule } from './modules/organizacion/proveedor-operacion/proveedor-operacion.module';
import { DomicilioModule } from './modules/gutil/domicilio/domicilio.module';
import { LocalidadModule } from './modules/gutil/localidad/localidad.module';
import { ProvinciaModule } from './modules/gutil/provincia/provincia.module';
import { ConfiguracionSistemaModule } from './modules/gestion-sistema/configuracion-sistema/configuracion-sistema.module';
import { CondicionIvaModule } from './modules/gutil/condicion-iva/condicion-iva.module';
import { EmpresaOperacionModule } from './modules/organizacion/empresa-operacion/empresa-operacion.module';
import { ClienteOperacionModule } from './modules/organizacion/cliente-operacion/cliente-operacion.module';
import { ProductoOperacionModule } from './modules/gestion-productos/producto-operacion/producto-operacion.module';
import { BusquedasModule } from './modules/gestion-documentos/busquedas/busquedas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as 'mysql') || 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10), // Si PORT es undefined, usa 3306
      username: process.env.DB_USERNAME, //"admin", //
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: '-03:00',

      //  Auto-carga de entidades desde los módulos
      // Las entidades se registran automáticamente cuando usás
      // TypeOrmModule.forFeature([Entidad]) en tus módulos
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // entities,
      synchronize: false,  
      ssl: process.env.DB_SSL === 'true',
    }),

    MarcaModule,
    LineaModule,
    ProductoModule,
    CondicionIvaModule,
    LocalidadModule,
    ProvinciaModule,
    ClienteModule,
    PersonalModule,
    ProveedorModule,

    UsuarioModule,
    AuthModule,
    RolModule,
    SeedFamiliaProductoModule,
    SeedOrganizacionModule,
    SeedAllModule,
    SeedUsuarioModule,
    FilesModule,
    ProveedorOperacionModule,
    DomicilioModule,
    ConfiguracionSistemaModule,
    EmpresaOperacionModule,
    ClienteOperacionModule,
    ProductoOperacionModule,
    BusquedasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
