"use client";

import type React from "react";
import { useEffect, type ReactNode } from "react";
import { User, Shield, Clock, CheckCircle, ArrowLeft, MapPin, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import AuthForm from "../componentes/gestion-usuario/auth-form";
import { Button } from "../componentes/ui/Button";
import { Badge } from "../componentes/ui/Badge";

interface LoginPageProps {
  children?: ReactNode;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  useEffect(() => {
    localStorage.removeItem("Token"); // Borra el token al cargar la página
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-surface via-background to-gradientSoft overflow-y-auto text-onSurface">
      {/* Header */}
      <header className="bg-surface shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-principal" />
              <div>
                <h1 className="text-xl font-bold text-principalDark">Proyecto 1</h1>
                <p className="text-xs text-onSurface/70">Productos para</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-principal hover:text-hoverPrincipal transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-r from-gradientLight to-gradientWarm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Left Side - Branding & Info */}
            <div className="space-y-6">
              <Badge className="bg-principal text-onPrimary">Acceso al Sistema</Badge>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-principalDark">
                  Bienvenido a <span className="text-principal">NOMBRE AQUI</span>
                </h1>
                <p className="text-lg text-onSurface/80 leading-relaxed">
                  Accede a tu cuenta para gestionar inventario, consultar datos y administrar tu negocio de manera
                  eficiente.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-principal flex-shrink-0" />
                  <span className="text-onSurface/70">Gestión completa de inventario</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-principal flex-shrink-0" />
                  <span className="text-onSurface/70">Control de ventas y cotizaciones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-principal flex-shrink-0" />
                  <span className="text-onSurface/70">Reportes y estadísticas en tiempo real</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-principal">20+</div>
                  <div className="text-sm text-onSurface/60">Tradición y Calidad</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-principal">100%</div>
                  <div className="text-sm text-onSurface/60">Calidad Garantizada</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-sm">
                {/* Login Card Wrapper */}
                <div className="bg-surface rounded-xl shadow-2xl p-6 border border-accent/40">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <div className="bg-principal p-2.5 rounded-full">
                        <User className="h-6 w-6 text-onPrimary" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-principalDark mb-1">Iniciar Sesión</h2>
                    <p className="text-sm text-onSurface/70">Accede a tu cuenta</p>
                  </div>

                  {/* Auth Form Component */}
                  <AuthForm />

                  {/* Security Info */}
                  <div className="mt-4 pt-4 border-t border-accent/30">
                    <div className="flex items-center justify-center space-x-4 text-xs text-onSurface/60">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-principal" />
                        <span>Seguro</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-principal" />
                        <span>24/7</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="mt-4 text-center">
                  <p className="text-onSurface/70 text-xs mb-3">¿Problemas para acceder?</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-principal text-principal hover:bg-principal hover:text-onPrimary rounded-full px-3 py-1.5 text-xs"
                  >
                    Contactar Soporte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-footer text-darkText py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wheat className="h-8 w-8 text-principal" />
                <div>
                  <h3 className="text-xl font-bold">Proyecto 1</h3>
                  <p className="text-sm text-darkText/80">Productos </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-darkText/80 mb-4">Tradición y Calidad desde 2001.</p>
            </div>

            <div className="text-right flex flex-col items-end text-darkText/80">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div className="text-right">
                  <p>Bulevarl</p>
                  <p> - Cba.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-darkText/30 mt-8 pt-8 text-center text-darkText/70">
            <p>&copy; 2025 Proyecto 1. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
