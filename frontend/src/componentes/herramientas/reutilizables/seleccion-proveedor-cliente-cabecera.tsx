import { useEffect, useRef } from "react";
import Select from "react-select";
import { Operador, SelectVendedor } from "../../../interfaces/generales/interfaces-generales";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../formateo-de-campos/form-input";
import { PlusCircle, UserRound } from "lucide-react";
import { formatearCuit, limpiarCuit } from "../formateo-de-campos/cuit-input";
import { useCabeceraDocumento } from "../../../context/cabecera-documentos-context";
import { jwtDecode } from "jwt-decode";
import { documentosConfig } from "./documentos-config/documentos";
import { Button } from "../../ui/Button";
import RegistrarActualizarClienteForm from "../../gestion-organizacion/cliente/utils/registrar-actualizar-cliente";
import RegistrarActualizarProveedorForm from "../../gestion-organizacion/proveedor/utils/registrar-actualizar-proveedor";

interface FormValues {
  entidadId: number;
  domicilio: string;
  condicionIva: string;
  letra: string;
  cuit: string;
  dni: string;
}

const schema = yup.object().shape({
  entidadId: yup.number().required(),
  domicilio: yup.string().required(),
  condicionIva: yup.string().required(),
  letra: yup.string().required(),
  cuit: yup.string(),
  dni: yup.string(),
});

export default function SeleccionProveedorClienteCabecera({ disabledByItems = false }: { disabledByItems?: boolean }) {
  const token = localStorage.getItem("Token");
  const empresaId = token ? jwtDecode<{ empresaId: number }>(token).empresaId : 0;

  const {
    cabeceraExistente,
    updateCabecera,
    setDenominacionEntidad,
    denominacionEntidad,
    mostrarFormularioEntidad,
    setMostrarFormularioEntidad,
    entidades,
    setEntidades,
    operador,
    tipoDocumento,
    setVendedor
  } = useCabeceraDocumento();

  const denominacionRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { watch } = methods;

  const entidadId = watch("entidadId");
  const domicilio = watch("domicilio");
  const condicionIva = watch("condicionIva");
  const letra = watch("letra");
  const cuit = watch("cuit");
  const dni = watch("dni");

  useEffect(() => {
    updateCabecera({
      entidadId,
      domicilio,
      condicionIva,
      letra,
      cuit: limpiarCuit(cuit || ""),
      dni,
    });
  }, [entidadId, domicilio, condicionIva, letra]);

  useEffect(() => {
    if (cabeceraExistente) {
      methods.reset({
        entidadId: cabeceraExistente.entidadId,
        domicilio: cabeceraExistente.domicilio || "",
        condicionIva: cabeceraExistente.condicionIva || "",
        letra: cabeceraExistente.letra || "",
        cuit: cabeceraExistente.cuit || "",
        dni: cabeceraExistente.dni || "",
      });
    }
  }, [cabeceraExistente]);

  const handleBuscarEntidades = async () => {
    const config = documentosConfig[tipoDocumento];
    if (!config) return;

    const { service, entidad } = config;

    const resultado = await service.obtenerTotales(
      { empresaId, denominacion: denominacionEntidad },
      entidad
    );

    setEntidades(resultado?.data);
  };

  // Buscar automáticamente mientras se escribe (sin necesidad de Enter)
  useEffect(() => {
    if (cabeceraExistente) return;
    const timer = setTimeout(() => {
      if (denominacionEntidad.trim().length >= 2) {
        handleBuscarEntidades();
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [denominacionEntidad]);

  const handleEnterEnSelect = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBuscarEntidades();
      setTimeout(() => {
        const input = selectRef.current?.querySelector("input");
        input?.focus();
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
        );
      }, 200);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-2 sm:mx-4">
        <div
          className="
            flex flex-col gap-3
            md:flex-row md:items-end md:gap-4
          "
        >
          {/* Cliente / Proveedor */}
          <div className="w-full md:w-[520px]">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <UserRound className="w-5 h-5 text-blue-600" />
              Datos del{" "}
              {operador === Operador.PROVEEDOR ? "proveedor" : "cliente"}
            </label>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* Buscar */}
              <input
                ref={denominacionRef}
                type="text"
                placeholder="Buscar"
                value={denominacionEntidad}
                onChange={(e) => setDenominacionEntidad(e.target.value)}
                onKeyDown={handleEnterEnSelect}
                disabled={disabledByItems}
                className="font-input-cabecera bg-white w-full md:w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {/* Select */}
              <div
                ref={selectRef}
                className="w-full md:flex-[1.5] md:min-w-[320px]"
              >
                <Select
                  value={entidades?.find(e => e.id === entidadId) || null}
                  options={entidades}
                  placeholder="Seleccionar..."
                  getOptionLabel={(o) => o.denominacion}
                  getOptionValue={(o) => String(o.id)}
                  isDisabled={!!cabeceraExistente || disabledByItems}
                  onChange={(o) => {
                    methods.setValue("entidadId", o?.id || 0);
                    methods.setValue("domicilio", o?.domicilioString || "");
                    methods.setValue("condicionIva", o?.condicionIva || "");
                    methods.setValue("letra", o?.letra || "");

                    if (operador === Operador.PROVEEDOR) {
                      methods.setValue("cuit", o?.cuit || "");
                      methods.setValue("dni", "");
                    }

                    if (operador === Operador.CLIENTE) {
                      if (o?.condicionIva === "CONSUMIDOR FINAL") {
                        methods.setValue("dni", o?.dni || "");
                        methods.setValue("cuit", "");
                      } else {
                        methods.setValue("dni", "");
                        methods.setValue("cuit", formatearCuit(o?.cuit || ""));
                      }

                      if (o?.vendedor) {
                        setVendedor(o.vendedor);
                      } else {
                        setVendedor({} as SelectVendedor);
                      }
                    }
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "36px",
                      height: "36px",
                      fontSize: "0.875rem",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>

              {/* Botón agregar */}
              <Button
                type="button"
                title={`Agregar ${operador === Operador.PROVEEDOR ? "proveedor" : "cliente"}`}
                variant="outline"
                size="icon"
                className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                onClick={() => setMostrarFormularioEntidad(true)}
                disabled={disabledByItems}
              >
                <PlusCircle size={20} />
              </Button>
            </div>
          </div>

          {/* Letra */}
          <div className="w-full md:w-[70px]">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Letra
            </label>
            <FormInput name="letra" label="" disabled />
          </div>

          {/* Condición IVA */}
          <div className="w-full md:w-[220px]">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Condición IVA
            </label>
            <FormInput name="condicionIva" label="" disabled />
          </div>

          {/* CUIT / DNI */}
          {(operador === Operador.PROVEEDOR ||
            condicionIva !== "CONSUMIDOR FINAL") && (
            <div className="w-full md:w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                CUIT
              </label>
              <FormInput name="cuit" label="" disabled />
            </div>
          )}

          {operador === Operador.CLIENTE &&
            condicionIva === "CONSUMIDOR FINAL" && (
              <div className="w-full md:w-[120px]">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  DNI
                </label>
                <FormInput name="dni" label="" disabled />
              </div>
            )}

          {/* Domicilio */}
          <div className="w-full md:w-[340px]">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Domicilio
            </label>
            <FormInput name="domicilio" label="" disabled />
          </div>
        </div>

        <div className="mt-1 border-t border-gray-200" />
        
        {mostrarFormularioEntidad && operador === Operador.CLIENTE && (
         <RegistrarActualizarClienteForm
            onClose={() => setMostrarFormularioEntidad(false)}
            onSuccess={() => setMostrarFormularioEntidad(false)}
          />
        )}

       {mostrarFormularioEntidad && operador === Operador.PROVEEDOR && (
          <RegistrarActualizarProveedorForm
           onClose={() => setMostrarFormularioEntidad(false)}
            onSuccess={() => setMostrarFormularioEntidad(false)}
          />
        )}

      </div>
    </FormProvider>




  );
}
