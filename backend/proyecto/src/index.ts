import { Linea } from "./modules/gestion-productos/linea/domain/entities/linea.entity";
import { Marca } from "./modules/gestion-productos/marca/domain/entities/marca.entity";
import { ProductoOperacion } from "./modules/gestion-productos/producto-operacion/entities/producto-operacion.entity";
import { Producto } from "./modules/gestion-productos/producto/domain/entities/producto.entity";
import { Auditoria } from "./modules/gestion-sistema/auditoria/entities/auditoria.entity";
import { ConfiguracionSistema } from "./modules/gestion-sistema/configuracion-sistema/domain/entities/configuracion-sistema.entity";
import { Rol } from "./modules/gestion-usuario/rol/domain/entities/rol.entity";
import { Usuario } from "./modules/gestion-usuario/usuario/domain/entities/usuario.entity";
import { CondicionIva } from "./modules/gutil/condicion-iva/domain/entities/condicion-iva.entity";
import { Domicilio } from "./modules/gutil/domicilio/entities/domicilio.entity";
import { Localidad } from "./modules/gutil/localidad/domain/entities/localidad.entity";
import { Provincia } from "./modules/gutil/provincia/domain/entities/provincia.entity";
import { Cliente } from "./modules/organizacion/cliente/domain/entities/cliente.entity";
import { Empresa } from "./modules/organizacion/empresa/domain/entities/empresa.entity";
import { AlicuotaIva } from "./modules/organizacion/enums/alicuota-iva.enum";
import { Personal } from "./modules/organizacion/personal/domain/entities/personal.entity";
import { Proveedor } from "./modules/organizacion/proveedor/domain/entities/proveedor.entity";


export const entities = [Marca,
                        Linea, 
                        Producto,
                        ProductoOperacion,
                        Auditoria,
                        ConfiguracionSistema,
                        Rol,
                        Usuario,
                        AlicuotaIva,
                        CondicionIva,
                        Domicilio, 
                        Localidad,
                        Provincia,
                        Usuario,
                        Cliente,
                        Proveedor,
                        Personal,
                        Empresa,
                                       
]; 