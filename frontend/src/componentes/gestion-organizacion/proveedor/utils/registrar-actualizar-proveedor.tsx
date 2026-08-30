import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import { Card } from "../../../ui/Card";
import React from "react";
import { CondicionIva, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import DomicilioForm, { DatosDomicilio } from "../../../herramientas/reutilizables/domicilio";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-proveedor";
import { Proveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import ProveedorService from "../services/proveedor-service";
import { parseApiError } from "../../../../utils/errores";
import { User } from "lucide-react";
import { SelectCondicionIva } from "../../../../interfaces/gestion-organizacion/condicion-iva/interfaces-condicion-iva";
import Select from "react-select";
import { formatearCuit, limpiarCuit } from "../../../herramientas/formateo-de-campos/cuit-input";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { getUsuarioId } from "../../../../utils/auth";

export default function RegistrarActualizarProveedorForm({
  proveedor,
  onClose,
  onSuccess,
}: {
  proveedor?: Proveedor;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();

  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: proveedor ? transformData(proveedor) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    setError,
    watch,
  } = methods;
  const [condicionesIva, setCondicionesIva] = React.useState<CondicionIva[]>([]);
  const [datosDomicilio, setDatosDomicilio] = useState<DatosDomicilio>();
  const [selectedCondicionIva, setSelectedCondicionIva] = React.useState<SelectCondicionIva>();
  const [denominacionCondicionIva, setDenominacionCondicionIva] = useState(" ");

  const denominacionCondicionIvaRef = useRef<HTMLInputElement>(null);
  const selectCondicionIvaRef = useRef<HTMLDivElement>(null);

  console.log("Errores del formulario:", errors);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (proveedor) {
          setValue("condicionIvaId", proveedor.condicionIva.id || 0);
          setSelectedCondicionIva(proveedor.condicionIva);

          console.log("Datos del proveedor:", proveedor);

          setValue("denominacion", proveedor.denominacion || "");
          setValue("denominacionAfip", proveedor.denominacionAfip || null);
          setValue("cuit", formatearCuit(proveedor.cuit || ""));
          setValue("observacion", proveedor.observacion || null);
          setValue("esProveedorGastos", proveedor.esProveedorGastos ?? false);
          setValue("esProveedorMateriaPrima", proveedor.esProveedorMateriaPrima ?? false);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {

      const cuitLimpio = formData.cuit ? limpiarCuit(formData.cuit) : "";

      if (proveedor) {
        const payload = {
          ...formData,
          cuit: cuitLimpio,
          domicilio: datosDomicilio,
          usuarioUpdatedId: usuarioId,
        };

        response = await ProveedorService.actualizar(proveedor.id, payload);
      } else {
        const payload = {
          ...formData,
          cuit: cuitLimpio,
          domicilio: datosDomicilio,
          usuarioCreatedId: usuarioId,
        };

        response = await ProveedorService.nuevo(payload);
      }

      await onSuccess(response.mensaje);
      onClose();
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleDomicilio = (datosDomicilio: DatosDomicilio) => {
    setDatosDomicilio(datosDomicilio);
  };

  const handleBuscarPorDenominacion = async (select: string) => {
    try {
      if (select === "CONDICION-IVA") {
        const condicionesIva = await ProveedorService.obtenerTotales(
          { denominacion: denominacionCondicionIva },
          "condiciones-iva",
        );
        if (condicionesIva) {
          console.log("Condiciones Iva encontradas:", condicionesIva);
          setCondicionesIva(condicionesIva.data);
        } else {
          console.log("No se encontró una linea con la denominación ingresada.");
        }
      }
    } catch (error) {
      console.error("Error al buscar por código:", error);
    }
  };

  const handleEnterEnSelect = async (e: React.KeyboardEvent<HTMLInputElement>, select: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (select === "CONDICION-IVA") {
        handleBuscarPorDenominacion("CONDICION-IVA");
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        let selectDiv: HTMLDivElement | null = null;

        if (select === "CONDICION-IVA") {
          selectDiv = selectCondicionIvaRef.current;
        }

        if (selectDiv) {
          const input = selectDiv.querySelector("input");
          if (input) {
            input.focus();
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          }
        }
      }, 300); // Ajustá este delay según el tiempo de búsqueda, si es necesario
    }
  };

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-5xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-2 mb-12">
        {/* Botón de cierre del modal */}
        <button
          onClick={handleOnClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        {/* Título del formulario */}
        <div className="form-header">
          <button onClick={onClose} className="btn-onClose-title-form">
            &times;
          </button>

          <h2 className="form-title">
            <User className="form-icon" />
            <span>{proveedor ? "Actualizar Proveedor" : "Registrar Proveedor"}</span>
          </h2>
          <p className="form-subtitle">
            {proveedor
              ? "Modifica los detalles del Proveedor."
              : "Ingresa los datos del nuevo Proveedor para registrarlo."}
          </p>
        </div>

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-3 py-2">
              {/* Campos generales */}
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="codigoProveedor"
                  label="Codigo"
                  placeholder="Ingresa el Codigo "
                />
                <FormInput name="denominacion" label="Denominación" placeholder="Ingresa la denominación" />
                <FormInput
                  name="denominacionAfip"
                  label="Denominación AFIP"
                  placeholder="Ingresa la denominación AFIP (opcional)"
                />
              </div>
              <div className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
                  <label className="block text-sm font-medium text-gray-700 py-1">Condicion Iva</label>
                  <div className="flex gap-x-4">
                    <div className="w-50">
                      <input
                        type="text"
                        ref={denominacionCondicionIvaRef}
                        onKeyDown={(e) => handleEnterEnSelect(e, "CONDICION-IVA")}
                        placeholder="Denominación"
                        className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        value={denominacionCondicionIva}
                        onChange={(e) => setDenominacionCondicionIva(e.target.value.trimStart())}
                        disabled={proveedor && proveedor.sistema > 0 ? true : false}
                      />
                    </div>
                    <div ref={selectCondicionIvaRef} className="w-full">
                      <Select
                        value={
                          condicionesIva.length > 0
                            ? condicionesIva.find((option) => option.id === watch("condicionIvaId")) || null
                            : selectedCondicionIva
                        }
                        options={condicionesIva}
                        getOptionLabel={(option) => option.denominacion}
                        getOptionValue={(option) => String(option.id)}
                        onChange={(selectedOption) => {
                          methods.setValue(`condicionIvaId`, selectedOption?.id || 0);
                          setSelectedCondicionIva(selectedOption ?? undefined);
                          methods.setValue("cuit", "");
                        }}
                        placeholder="Seleccione"
                        className="text-black"
                        isDisabled={proveedor && proveedor.sistema > 0 ? true : false}
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          option: (base, { isSelected, isFocused }) => ({
                            ...base,
                            color: isSelected ? "white" : "black",
                            backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      {errors.condicionIvaId?.message && (
                        <p className="text-sm text-red-600 mt-1">{errors.condicionIvaId.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <FormInput
                    name="cuit"
                    label="CUIT"
                    placeholder="XX-XXXXXXXX-X"
                    mask="__-________-_"
                    disabled={
                      !(condicionesIva.length > 0
                        ? condicionesIva.find((option) => option.id === watch("condicionIvaId"))?.requiereCuit
                        : selectedCondicionIva?.requiereCuit)
                    }
                  />
                </div>
                <div className="md:col-span-1">
                  <FormInput
                    name="dni"
                    label="DNI"
                    placeholder="Ingresa el DNI"
                    onKeyDown={(e) => {
                      if (["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
                        return;
                      }
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={
                      !(condicionesIva.length > 0
                        ? condicionesIva.find((option) => option.id === watch("condicionIvaId"))?.requiereDocumento
                        : selectedCondicionIva?.requiereDocumento)
                    }
                  />
                </div>
              </div>

              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="esProveedorGastos"
                    {...methods.register("esProveedorGastos")}
                    disabled={Boolean(proveedor) || watch("esProveedorMateriaPrima")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="esProveedorGastos" className={`text-sm font-medium cursor-pointer ${Boolean(proveedor) || watch("esProveedorMateriaPrima") ? "text-gray-400" : "text-gray-700"}`}>
                    Proveedor Gastos
                  </label>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="esProveedorMateriaPrima"
                    {...methods.register("esProveedorMateriaPrima")}
                    disabled={Boolean(proveedor) || watch("esProveedorGastos")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="esProveedorMateriaPrima" className={`text-sm font-medium cursor-pointer ${Boolean(proveedor) || watch("esProveedorGastos") ? "text-gray-400" : "text-gray-700"}`}>
                    Proveedor Materia Prima
                  </label>
                </div>
              </div>
              {proveedor && (
                <p className="text-xs text-amber-600 col-span-full">
                  El tipo de proveedor no puede modificarse una vez registrado.
                </p>
              )}
              {errors.root?.type !== "manual" && (errors as any)[""]?.message && (
                <p className="text-sm text-red-600">{(errors as any)[""].message}</p>
              )}

              <DomicilioForm onDatos={handleDomicilio} datosDomicilioExistentes={proveedor?.domicilio} />
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* Botón de submit */}
            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? proveedor
                    ? "Actualizando..."
                    : "Registrando..."
                  : proveedor
                    ? "Actualizar"
                    : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <AlertasConfirmacion />
    </div>
  );
}
