import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        geist: ["var(--font-geist-sans)"],
        geistMono: ["var(--font-geist-mono)"],
      },
      colors: {
        // 🎨 Paleta cálida basada en dorado/beige/amarillo
        principal: "#b5854c",        // Dorado cálido principal
        hoverPrincipal: "#8a6639",  // Dorado/marrón más oscuro (hover)
        principalDark: "#5c3d2e",   // Marrón profundo (para fondos oscuros)
        background: "#fdf7f2",      // Beige claro (fondos generales)
        surface: "#ffffff",         // Blanco puro (cartas, secciones limpias)
        onPrimary: "#ffffff",       // Texto claro sobre dorado/marrón
        onSurface: "#5c3d2e",       // Texto marrón oscuro sobre fondos claros
        accent: "#f3e1c6",          // Beige/dorado suave para detalles y bordes
        darkBg: "#3a2b22",          // Fondo marrón oscuro alternativo
        darkText: "#eaddd0",        // Texto claro en modo oscuro cálido
        footer: "#5c3d2e",          // Marrón oscuro (footer principal)

        gradientSoft: "#fdfcf9",    // Beige muy sutil (fondo degrade)
        gradientLight: "#fff9f4",   // Beige claro cálido (inicio de gradient)
        gradientWarm: "#fdf2e9",    // Beige cálido más saturado (fin de gradient)
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".label-base": {
          fontSize: "0.75rem",      // text-xs
          fontWeight: "500",        // font-medium
          color: "#4b5563",         // text-gray-600
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",           // gap-1
        },
        ".btn": {
          width: "20rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          borderRadius: "0.5rem",
          transitionProperty: "all",
          transitionDuration: "200ms",
          fontWeight: "500",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        ".btn-primary": {
          backgroundColor: "#b5854c", // dorado cálido principal
          color: "#ffffff",           // texto claro para contraste
          "&:hover": {
            backgroundColor: "#8a6639", // dorado/marrón más oscuro
          },
        },
        ".btn-dark": {
          backgroundColor: "#5c3d2e", // marrón profundo
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#3a2b22", // marrón más oscuro en hover
          },
        },
        ".btn-onClose-title-form": {
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          width: "2rem",
          height: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          backgroundColor: "#DC2626", // rojo para cerrar
          color: "#FFFFFF",
          transitionProperty: "all",
          transitionDuration: "200ms",
          "&:hover": {
            backgroundColor: "#B91C1C", // rojo más oscuro
          },
        },
        // 📝 Formulario
        ".form-header": {
          position: "sticky",
          top: "0px",
          backgroundImage: "linear-gradient(to right, #b5854c, #8a6639)", // degradado dorado a marrón
          color: "#FFFFFF",
          padding: "0.5rem", // p-3
          borderTopLeftRadius: "0.5rem",  // rounded-t-xl
          borderTopRightRadius: "0.5rem",
        },
        ".form-title": {
          fontSize: "1rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        },
        ".form-subtitle": {
          color: "#FFFFFF", // gris neutro
          marginTop: "0.25rem",
        },
        "input[type='date']::-webkit-calendar-picker-indicator": {
          opacity: "1",
          cursor: "pointer",
          filter: "brightness(0.3)",
        },
        ".form-icon": {
          width: "1.5rem",
          height: "1.5rem",
          color: "#0a0a0aff", // dorado cálido
        },
        ".consultar-icon": {
          width: "1.5rem",
          height: "1.5rem",
          color: "#8a6639", // marrón/dorado oscuro
        },
        /* inputs compactos estilo encabezado */
        ".font-input-cabecera": {
          height: "36px",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          fontSize: "0.875rem",
          backgroundColor: "#f3f4f6", // gray-100
          borderWidth: "1px",
          borderColor: "#d1d5db",     // gray-300
          borderRadius: "0.375rem",  // rounded-md
          color: "#000000",
        },

        ".row-pendiente": {
          backgroundColor: "#fff7ed", /* naranja suave */
        },

        ".row-parcial": {
          backgroundColor: "#fef9c3", /* amarillo */
        },

        ".row-entregado": {
          backgroundColor: "#ecfdf5", /* verde suave */
        }


      });
    }),
  ],
};
