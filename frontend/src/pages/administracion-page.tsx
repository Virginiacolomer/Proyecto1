import type React from "react";
import { useState, type ReactNode } from "react";
import { SidebarProvider } from "../componentes/ui/SideBar";
import { Navbar } from "../componentes/navbar";
import { Outlet } from "react-router-dom";
import { SidebarMenus } from "../componentes/menu/sidebarMenus";
import { SidebarFiltros } from "../componentes/sidebarFiltros";
import { FiltrosProvider } from "../context/filtros-contesxt";

interface AdministracionPageProps {
  children?: ReactNode;
}

const AdministracionPage: React.FC<AdministracionPageProps> = () => {
  const [sidebarMenusOpen, setSidebarMenusOpen] = useState(false);
  const [sidebarFiltrosOpen, setSidebarFiltrosOpen] = useState(false);

  const openSidebarMenus = () => {
    setSidebarMenusOpen(true);
    setSidebarFiltrosOpen(false);
  };

  const closeSidebarMenus = () => {
    setSidebarMenusOpen(false);
  };

  const openSidebarFiltros = () => {
    setSidebarFiltrosOpen(true);
    setSidebarMenusOpen(false);
  };

  const closeSidebarFiltros = () => {
    setSidebarFiltrosOpen(false);
  };

  return (
    <SidebarProvider>
     <FiltrosProvider>
        <div className="w-full flex flex-col h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
          {/* Navbar Principal */}
          <Navbar className="w-full" />

          {/* Contenedor flexible para sidebar y contenido principal */}
          <div className="flex flex-1 min-h-0 overflow-hidden relative">

            {/* Barra Lateral, cada icono se visualiza o no en el celular dependiendo la configuracion del archivo menuItems-definition */}
            <SidebarMenus isOpen={sidebarMenusOpen} onClose={closeSidebarMenus} onOpen={openSidebarMenus} />

            <SidebarFiltros isOpen={sidebarFiltrosOpen} onClose={closeSidebarFiltros} onOpen={openSidebarFiltros} />

            {/* Contenido Principal */}
            <main
              className={`flex-1 p-4 md:p-6 min-h-0 overflow-auto bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out 
            ${sidebarFiltrosOpen ? "md:mr-80" : ""}
            ${sidebarMenusOpen ? "md:ml-80" : ""}
          `}
            >
              <div className="bg-gray-200 p-4 md:p-0 rounded-lg shadow-md dark:bg-gray-900 dark:text-white transition-all duration-300 ease-in-out">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </FiltrosProvider>
    </SidebarProvider>
  );
};

export default AdministracionPage;
