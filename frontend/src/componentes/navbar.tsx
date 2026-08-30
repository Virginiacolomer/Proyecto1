import { Bell, User, Sun, Moon, Lock, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/DropDownMenu";
import { Button } from "./ui/Button";
import { cn } from "../utils/Utils";
import { useTheme } from "./herramientas/herramientas-visuales/theme-context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axiosConfig from "../utils/axiosConfig";

import { APP_CONFIG } from "../config/versionamiento";

import CambiarContrasenaModal from "./gestion-usuario/cambiar-contrasena-modal";
import { ModalPortal } from "../utils/modal-portal";

import { getEmpresaId } from "../utils/auth";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 bg-principal rounded-lg transition-all duration-200 hover:bg-blue-900 hover:scale-105 text-white border border-white/20 hover:border-white/40"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function NotificationsButton() {

  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/admin/notificaciones")}
      className="h-10 w-10 bg-principal rounded-lg transition-all duration-200 hover:bg-blue-900 hover:scale-105 text-white border border-white/20 hover:border-white/40 relative"
    >
      <Bell className="h-5 w-5" />

    </Button>
  );
}

function ProfileButton() {
  const navigate = useNavigate();
  const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-principal rounded-lg transition-all duration-200 hover:bg-blue-900 hover:scale-105 text-white border border-white/20 hover:border-white/40"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg rounded-lg mt-2"
        >
          <DropdownMenuItem
            className="hover:bg-slate-100 text-gray-700 dark:text-white dark:hover:bg-slate-700 transition-colors cursor-pointer rounded-md mx-1 my-1"
            onClick={() => setMostrarCambioContrasena(true)}
          >
            <Lock className="h-4 w-4 mr-2 text-gray-700" />
            Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-slate-100 text-gray-700 dark:text-white dark:hover:bg-slate-700 transition-colors cursor-pointer rounded-md mx-1 my-1"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 text-gray-700" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {mostrarCambioContrasena && (
        <ModalPortal>
          <CambiarContrasenaModal onClose={() => setMostrarCambioContrasena(false)} />
        </ModalPortal>
      )}
    </>
  );
}

interface NavbarProps {
  className?: string;
}

interface DecodedToken {
  sub: number;
  empresaId: number;
}

export function Navbar({ className }: NavbarProps) {
  const [empresaNombre, setEmpresaNombre] = useState("Cargando...");
  const [userEmail, setUserEmail] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const empresaId = getEmpresaId();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("Token");
      if (!token) return;

      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const usuarioId = decodedToken.sub;
        const empresaId = decodedToken.empresaId;

        const empresaResponse = await axios.get(`${axiosConfig.apiUrl}/empresa/${empresaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpresaNombre(empresaResponse.data.denominacion);

        const userResponse = await axios.get(`${axiosConfig.apiUrl}/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(userResponse.data.mail);
        setUserRoles(
          (userResponse.data.roles ?? []).map((r: { denominacion: string }) => r.denominacion)
        );
      } catch (error) {
        console.error("Error al obtener datos del usuario o empresa", error);
        setEmpresaNombre("Error al cargar");
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className={cn("bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-700", className)}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-1 sm:py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo y Branding - Siempre visible */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/JSFenix.png"
              alt="Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full object-contain"
            />
            <div className="hidden sm:inline">
              <h1 className="text-sm sm:text-base md:text-lg font-bold leading-tight">(Nombre de tu Equipo)</h1>
              <p className="text-xs text-gray-300 leading-tight">{APP_CONFIG.nombreSistema} {APP_CONFIG.version}</p>
            </div>
          </div>

          {/* Sección Central - Info empresa y alerta */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 min-w-0">
            {/* Separador */}
            <div className="hidden md:block w-px h-10 bg-slate-700 flex-shrink-0" />

            {/* Info empresa - Oculta en móvil muy pequeño */}
            <div className="hidden sm:block flex-shrink-0">
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-blue-400 truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                  {empresaNombre}
                </p>
                <p className="text-gray-300 text-xs truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                  {userEmail}
                </p>
                {userRoles.length > 0 && (
                  <p className="text-yellow-400 text-xs truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                    {userRoles.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Separador */}
            <div className="hidden md:block w-px h-10 bg-slate-700 flex-shrink-0" />


          </div>

          {/* Controles de usuario - Siempre visibles */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <ThemeToggleButton />
            </div>
       
            <div className="scale-75 sm:scale-90 md:scale-100">
              <NotificationsButton />
            </div>
            <div className="scale-75 sm:scale-90 md:scale-100">
              <ProfileButton />
            </div>
          </div>
        </div>

        {/* Info móvil - Solo visible en pantallas pequeñas */}
        <div className="sm:hidden mt-1 pt-1 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-blue-400 truncate">{empresaNombre}</p>
              <p className="text-gray-300 truncate">{userEmail}</p>
              {userRoles.length > 0 && (
                <p className="text-yellow-400 text-xs truncate">{userRoles.join(", ")}</p>
              )}
            </div>
          </div>
          {/* Banner de notificaciones del sistema — debajo de los datos del usuario */}
       
        </div>
      </div>
    </header>
  );
}
