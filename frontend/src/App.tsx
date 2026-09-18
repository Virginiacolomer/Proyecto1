import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import GestionUsuario from "./componentes/gestion-usuario/gestion-usuario";
import { ThemeProvider } from "./componentes/herramientas/herramientas-visuales/theme-context";
import CondicionIva from "./componentes/gestion-organizacion/condicion-iva/consultar-condicion-iva";
import AdministracionPage from "./pages/administracion-page";
import LoginPage from "./pages/login-page";
import HomePage from "./pages/home-page";
import ConsultarMarcas from "./componentes/gestion-producto/marca/utils/consultar-marca";
import ConsultarProducto from "./componentes/gestion-producto/producto/utils/consultar-producto";
import ConsultarCliente from "./componentes/gestion-organizacion/cliente/utils/consultar-cliente";
import ConsultarProveedores from "./componentes/gestion-organizacion/proveedor/utils/consultar-proveedor";
import ConsultarLocalidad from "./componentes/gestion-organizacion/localidad/utils/consultar-localidad";
import ConsultarLinea from "./componentes/gestion-producto/linea/utils/consultar-linea";

import PrivateRoute from "./utils/PrivateRoute";
import { Rol } from "./interfaces/generales/interfaces-generales";
import CambioPreciosMasivo from "./componentes/gestion-producto/precios/cambio-precios-masivo/util/cambio-precios-masivo";
import DashboardHome from "./pages/dashboard-home";

import ListaPrecios from "./componentes/gestion-producto/precios/lista_precios/util/lista-precios";
import ConsultarPersonal from "./componentes/gestion-organizacion/personal/utils/consultar-personal";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas dentro del panel de administración */}
          <Route
            element={
              <PrivateRoute allowedRoles={[Rol.ADMINISTRADOR, Rol.EMPLEADO, Rol.REPOSITOR, Rol.VENDEDOR, Rol.ROOT, Rol.COBRADOR, Rol.REPARTIDOR]} />
            }
          >
            <Route path="/admin" element={<AdministracionPage />}>
              <Route index element={<DashboardHome />} />
              <Route element={<PrivateRoute allowedRoles={[Rol.EMPLEADO, Rol.ADMINISTRADOR]} />}>
                <Route path="marca" element={<ConsultarMarcas />} />
              </Route>
     
              <Route path="linea" element={<ConsultarLinea />} />
              <Route path="usuario" element={<GestionUsuario />} />
              <Route path="producto" element={<ConsultarProducto />} />
              <Route path="cliente" element={<ConsultarCliente />} />
              <Route path="proveedor" element={<ConsultarProveedores />} />
              <Route path="personal" element={<ConsultarPersonal />} />
              <Route path="cambio-precios-masivo" element={<CambioPreciosMasivo />} />
              <Route path="lista-precios" element={<ListaPrecios />} />
              <Route path="localidad" element={<ConsultarLocalidad />} />
              <Route path="condicion-iva" element={<CondicionIva />} />     


            </Route>
          </Route>

          {/* Otras rutas que quieras agregar */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
