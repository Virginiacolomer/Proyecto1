import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../componentes/herramientas/alertas/alertas-confirmacion";

interface PrivateRouteProps {
  allowedRoles: number[];
}

interface DecodedToken {
  sub: number;
  roles: number[];
  empresaId: number;
  puntoVentaId: number;
 // rolId: number;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem("Token");
  const location = useLocation();
  let userRole: number | null = null;
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();

  const decodedToken: DecodedToken = jwtDecode(token);

  if (!decodedToken.roles || !Array.isArray(decodedToken.roles)) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = decodedToken.roles;

  const hasPermission = userRoles.some(role =>
    allowedRoles.includes(role)
  );


  if (!token) {
    // Si no está logueado, redirige a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (token) {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const userRoles = decodedToken.roles;
      const hasPermission = userRoles.some(role =>
        allowedRoles.includes(role)
      );
      if (hasPermission) {
        return <Outlet />;
      }
      //userRole = decodedToken.rolId;
    } catch (error) {
      console.error("Error decoding token", error);
    }
  }

//  const userRoles = decodedToken.roles;

  


 // if (userRole !== null && allowedRoles.includes(userRole)) {
    // Si el rol es permitido, renderiza el componente hijo
 //   return <Outlet />;
 // }

  // Si el rol no es permitido, muestra una alerta
  React.useEffect(() => {
    const handleConfirmation = async () => {
      const confirmed = await showConfirmation({
        type: TipoAlertaConfirmacion.WARNING_ERROR,
        title: TituloAlertaConfirmacion.WARNING_ERROR,
        message: "No tienes permiso para acceder a esta sección.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: () => {},
      });
      if (confirmed) {
        window.location.href = "/admin";
      }
    };
    handleConfirmation();
  }, []);

  // Redirige al usuario a una página de acceso denegado o login
  return (
    <>
      <AlertasConfirmacion />
    </>
  );
};

export default PrivateRoute;
