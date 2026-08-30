import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { Rol } from "../interfaces/generales/interfaces-generales";
import { getRoles, getEmpresaId } from "../utils/auth";

const userRoles: number[] = getRoles();
const empresaId: number = getEmpresaId();

const accesos = [
  {
    label: "Productos",
    icon: ShoppingBag,
    path: "/admin/producto", //<Route path="producto" element={<ConsultarProducto />} /> eso debe estar en App.tsx
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    shadowColor: "hover:shadow-blue-500/50",
    description: "",
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPOSITOR, Rol.REPARTIDOR,Rol.ROOT]
  },





  {
    label: "Clientes",
    icon: Users,
    path: "/admin/cliente",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    shadowColor: "hover:shadow-purple-500/50",
    description: "",
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.COBRADOR, Rol.REPARTIDOR, Rol.COBRADOR,Rol.ROOT]
  },
  {
    label: "Proveedores",
    icon: Users,
    path: "/admin/proveedor",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    shadowColor: "hover:shadow-blue-500/50",
    description: "",
    roles: [Rol.ADMINISTRADOR,Rol.ROOT]
  },
];

const DashboardHome = () => {
  const [certVisible, setCertVisible] = useState<boolean>(
    () => localStorage.getItem('afip-cert-visible') !== 'false'
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* Columna izquierda: botones de acceso */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accesos.filter((item) => {// aca filtra los accesos de las card, en acceso estan todas las propiedades de las card
            if (!item.roles) return true;

            return item.roles.some((role) =>
              userRoles.includes(role)
            );
          }).map(
            (
              {
                label,
                icon: Icon,
                path,
                color,
                hoverColor,
                shadowColor,
                description,
              },
              index
            ) => (
              <Link
                key={label}
                to={path}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden transform hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideUp 0.5s ease-out forwards",
                  opacity: 0,
                }}
              >
                {/* Efecto de fondo al hover */}
                <div
                  className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icono con animación */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-4 rounded-xl text-white ${color} ${hoverColor} ${shadowColor} transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}
                    >
                      <Icon size={28} strokeWidth={2.5} />
                    </div>

                    {/* Flecha que aparece al hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight
                        size={24}
                        className="text-gray-400 group-hover:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Texto */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {description}
                    </p>
                  </div>

                  {/* Barra decorativa inferior */}
                  <div className="mt-4 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent via-current to-transparent rounded-full opacity-30" />
                </div>

                {/* Efecto de brillo que cruza la tarjeta */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            )
          )}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;