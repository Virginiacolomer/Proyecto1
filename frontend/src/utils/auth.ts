import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: number;          // usuarioId
  personalId: number;
  roles: number[];
  empresaId: number;
  puntoVentaId: number;
}

const getToken = (): string | null => {
  return localStorage.getItem("Token");
};

const getDecodedToken = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

// ===================== getters individuales =====================

export const getUsuarioId = (): number => {
  return getDecodedToken()?.sub ?? 0;
};

export const getEmpresaId = (): number => {
  return getDecodedToken()?.empresaId ?? 0;
};

export const getPuntoVentaId = (): number => {
  return getDecodedToken()?.puntoVentaId ?? 0;
};

export const getPersonalId = (): number => {
  return getDecodedToken()?.personalId ?? 0;
};

export const getRoles = (): number[] => {
  console.log("ROLES: "+getDecodedToken()?.roles);
  return getDecodedToken()?.roles ?? [];
};

export const hasRole = (role: number): boolean => {
  return getRoles().includes(role);
};

// ===================== getter completo =====================

export const getAuthData = () => {
  const decoded = getDecodedToken();

  return {
    usuarioId: decoded?.sub ?? 0,
    empresaId: decoded?.empresaId ?? 0,
    puntoVentaId: decoded?.puntoVentaId ?? 0,
  };
};

export const getAuthDataWithPersonal = () => {
  const decoded = getDecodedToken();

  return {
    usuarioId: decoded?.sub ?? 0,
    empresaId: decoded?.empresaId ?? 0,
    personalId: decoded?.personalId ?? 0,
    puntoVentaId: decoded?.puntoVentaId ?? 0,
  };
};