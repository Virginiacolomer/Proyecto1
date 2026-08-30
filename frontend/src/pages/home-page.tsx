import { Link } from "react-router-dom";
import { Button } from "../componentes/ui/Button";
import { Card, CardContent, CardDescription, CardTitle } from "../componentes/ui/Card";
import { Package, Phone, Mail, MapPin, Users, Truck, Wheat } from "lucide-react";
import logo from "../assets/imagenes/Logo.png";
import { APP_CONFIG } from "../config/versionamiento";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gradient-to-b from-white via-background to-gradientSoft text-principalDark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Proyecto 1" className="h-12 w-auto" />
            <span className="text-xl font-bold tracking-wide">NOMBRE AQUI</span>
             <p className="text-xs text-gray-300 leading-tight">{APP_CONFIG.nombreSistema} {APP_CONFIG.version}</p>
          </div>
          <nav className="hidden md:flex space-x-6 font-medium">
            <Link to="#inicio" className="text-principal hover:text-hoverPrincipal transition-colors">
              Inicio
            </Link>
            <Link to="#productos" className="text-principal hover:text-hoverPrincipal transition-colors">
              Productos
            </Link>
            <Link to="#nosotros" className="text-principal hover:text-hoverPrincipal transition-colors">
              Nosotros
            </Link>
            <Link to="#contacto" className="text-principal hover:text-hoverPrincipal transition-colors">
              Contacto
            </Link>
          </nav>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-principal hover:bg-hoverPrincipal text-white rounded-full px-6"
          >
            Ingresar
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="relative bg-gradient-to-r from-gradientLight to-gradientWarm py-20">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-4">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Detalle de la empresa <span className="text-principal">Rubro</span>
            </h1>
            <p className="text-lg opacity-80">
              Empecemos el camino ...
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-principal hover:bg-hoverPrincipal text-white rounded-full">
                <Package className="h-5 w-5 mr-2" />
                Ver Catálogo
              </Button>
              <Button size="lg" variant="outline" className="border-principal text-principal rounded-full">
                <Truck className="h-5 w-5 mr-2" />
                Cobertura de Envíos
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src={logo} alt="Proyecto 1" className="rounded-xl shadow-xl w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section id="productos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Productos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Productos",
                desc: "Productos de primera calidad.",
              },
             
            ].map((p, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-accent">
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{p.title}</CardTitle>
                  <CardDescription className="text-gray-600">{p.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Wheat className="h-12 w-12 mx-auto text-principal" />
          <h2 className="text-3xl font-bold">Siempre acompañando </h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Proyecto 1 con la misión de aprender.
          </p>
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {[
              { number: "20+", label: "Años de trayectoria" },
              { number: "500+", label: "Productos disponibles" },
              { number: "1000+", label: "Clientes satisfechos" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white shadow-md rounded-xl">
                <div className="text-4xl font-bold text-principal mb-2">{stat.number}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 bg-principal text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Contáctanos</h2>
          <p className="max-w-xl mx-auto opacity-90">Estamos listos para ayudarte con tus pedidos o consultas.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button className="bg-white text-principal hover:bg-gray-100 rounded-full">
              <Phone className="h-5 w-5 mr-2" /> Llamar
            </Button>
            <Button
              variant="outline"
              className="border-white text-principal hover:bg-white hover:text-principal rounded-full"
            >
              <Mail className="h-5 w-5 mr-2" /> Enviar Email
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-2 pt-6">
            <MapPin className="h-5 w-5" />
            <span>Argentina</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-principalDark text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 Proyecto 1. Todos los derechos reservados.</p>
          <Users className="h-5 w-5 opacity-70" />
        </div>
      </footer>
    </div>
  );
}
