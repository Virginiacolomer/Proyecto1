import {
  Layers,
  ShoppingBag,
  Tag,
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  PackageCheck,
  Upload,
  Warehouse,
  PackageMinus,
  DollarSign,
  MapPin,
  Building,
  Banknote,
  Archive,
  CreditCard,
  Receipt,
  Landmark,
  Home,
  Smartphone,
  Bell,
  MessageSquare,
} from "lucide-react";
import { Rol } from "../../interfaces/generales/interfaces-generales";

export interface MenuItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
  subMenu?: MenuItem[];
  visibleOnMobile?: boolean;
  roles?: number[];
}

export const menuItems: MenuItem[] = [
  /* cada {} define un item del menu, que puede o no contener submenu */
  {
    icon: Home /* icono que muestra */,
    label: "Inicio" /* nombre que muestra */,
    path: "/admin" /* path a donde vincula */,
    // visibleOnMobile: false /* con esto me oculta el icono cuando estoy en el celular */
    //roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR]
  },




  {
    icon: ShoppingBag,
    label: "Gestión Productos",
    path: "",
    subMenu: [
      {
        icon: ShoppingBag,
        label: "Producto",
        path: "producto",
        roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPARTIDOR, Rol.REPOSITOR,Rol.ROOT],
      },
      {
        icon: DollarSign,
        label: "Configuración",
        path: "",
        subMenu: [
          { icon: Tag, label: "Marca", path: "marca" },
          { icon: Layers, label: "Líneas", path: "linea" },
        ],
        roles: [Rol.ADMINISTRADOR,Rol.ROOT,Rol.ROOT],
      },
    ],
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPARTIDOR, Rol.REPOSITOR,Rol.ROOT],
  },

  
  {
    icon: Building,
    label: "Organización",
    path: "",
    subMenu: [
      {
        icon: Users,
        label: "Cliente",
        path: "cliente",
        roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPARTIDOR, Rol.COBRADOR,Rol.ROOT],
      },
      { icon: Users, label: "Proveedor", path: "proveedor", roles: [Rol.ADMINISTRADOR,Rol.ROOT] },
      { icon: Users, label: "Personal", path: "personal", visibleOnMobile: false, roles: [Rol.ADMINISTRADOR,Rol.ROOT] },
    ],
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPARTIDOR, Rol.COBRADOR,Rol.ROOT], //acá aparece el rol permitido
  },

];
