import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import EmailInput from "../../../herramientas/formateo-de-campos/email-input";
import { Card } from "../../../ui/Card";
import React from "react";
import { Cliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import DomicilioForm, { DatosDomicilio } from "../../../herramientas/reutilizables/domicilio";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-cliente";
import ClienteService from "../services/cliente-service";
import Select from "react-select";
import { parseApiError } from "../../../../utils/errores";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import { User } from "lucide-react";
import { SelectCondicionIva } from "../../../../interfaces/gestion-organizacion/condicion-iva/interfaces-condicion-iva";
import { formatearCuit, limpiarCuit } from "../../../herramientas/formateo-de-campos/cuit-input";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { ResponsePost, SelectVendedor } from "../../../../interfaces/generales/interfaces-generales";
import { getUsuarioId } from "../../../../utils/auth";

export default function RegistrarActualizarClienteForm({
  cliente,
  onClose,
  onSuccess,
}: {
  cliente?: Cliente;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();
  
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();
  const [selectedCondicionIva, setSelectedCondicionIva] = React.useState<SelectCondicionIva>();

  console.log("condicion iva", selectedCondicionIva);

  const methods = useForm<FormValues>({
    resolver: yupResolver(
      schema(selectedCondicionIva?.requiereCuit || false, selectedCondicionIva?.requiereDocumento || false),
    ) as any,
    defaultValues: cliente ? transformData(cliente) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    setError,
    watch,
  } = methods;
  const [condicionesIva, setCondicionesIva] = React.useState<SelectCondicionIva[]>([]);
  const [vendedores, setVendedores] = React.useState<SelectVendedor[]>([]);
  const [datosDomicilio, setDatosDomicilio] = useState<DatosDomicilio>();
  const [denominacionCondicionIva, setDenominacionCondicionIva] = useState(" ");
  const [denominacionVendedor, setDenominacionVendedor] = useState(" ");
  const [selectedVendedor, setSelectedVendedor] = React.useState<SelectVendedor>();

  const denominacionCondicionIvaRef = useRef<HTMLInputElement>(null);
  const selectCondicionIvaRef = useRef<HTMLDivElement>(null);
  const denominacionVendedorRef = useRef<HTMLInputElement>(null);
  const selectVendedorRef = useRef<HTMLDivElement>(null);

  // Debounce automático para condición IVA
  useEffect(() => {
    const timer = setTimeout(() => {
      if (denominacionCondicionIva.trim()) {
        handleBuscarPorDenominacion("CONDICION-IVA");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [denominacionCondicionIva]);

  // Debounce automático para vendedor
  useEffect(() => {
    const timer = setTimeout(() => {
      handleBuscarPorDenominacion("VENDEDOR");
    }, 400);
    return () => clearTimeout(timer);
  }, [denominacionVendedor]);


  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cliente) {
          setValue("condicionIvaId", cliente.condicionIva.id || 0);
          setSelectedCondicionIva(cliente.condicionIva);

          setValue("vendedorId", cliente.vendedor.id || 0);
          setSelectedVendedor(cliente.vendedor);

          setValue("denominacion", cliente.denominacion || "");
          setValue("denominacionAfip", cliente.denominacionAfip || null);
          setValue("cuit", formatearCuit(cliente.cuit || ""));
          setValue("dni", cliente.dni || "");
          setValue("mail", cliente.mail || "");
          setValue("contactoNombre", cliente.contactoNombre || "");
          setValue("contactoCargo", cliente.contactoCargo || "");
          setValue("celular", cliente.celular || "");
          setValue("observacion", cliente.observacion || null);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendedores = await ClienteService.obtenerTotales({ denominacion: denominacionVendedor }, "vendedores");
        if (vendedores) {
          console.log("Vendedores encontrados:", vendedores);
          setVendedores(vendedores.data);
          setValue("vendedorId", 1);
        } else {
          console.log("No se encontró una linea con la denominación ingresada.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    if (!cliente) {
      fetchData();
    }
  }, []);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {

      const cuitLimpio = formData.cuit ? limpiarCuit(formData.cuit) : "";

      if (cliente) {
        const payload = {
          ...formData,
          cuit: cuitLimpio, // sobrescribimos con el limpio
          domicilio: datosDomicilio,
          usuarioUpdatedId: usuarioId,
        };

        console.log("Payload enviado:", JSON.stringify(payload, null, 2));

        response = await ClienteService.actualizar(cliente.id, payload);
      } else {
        const payload = {
          ...formData,
          cuit: cuitLimpio, // sobrescribimos con el limpio
          domicilio: datosDomicilio,
          usuarioCreatedId: usuarioId,
        };

        console.log("Payload enviado:", JSON.stringify(payload, null, 2));

        response = await ClienteService.nuevo(payload);
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      console.error("Error al guardar el cliente:", error);

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
        const condicionesIva = await ClienteService.obtenerTotales(
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

      if (select === "VENDEDOR") {
        const vendedores = await ClienteService.obtenerTotales({ denominacion: denominacionVendedor }, "vendedores");
        if (vendedores) {
          console.log("Vendedores encontrados:", vendedores);
          setVendedores(vendedores.data);
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

      if (select === "VENDEDOR") {
        handleBuscarPorDenominacion("VENDEDOR");
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        let selectDiv: HTMLDivElement | null = null;

        if (select === "CONDICION-IVA") {
          selectDiv = selectCondicionIvaRef.current;
        }

        if (select === "VENDEDOR") {
          selectDiv = selectVendedorRef.current;
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
            <span>{cliente ? "Actualizar Cliente" : "Registrar Cliente"}</span>
          </h2>
          <p className="form-subtitle">
            {cliente ? "Modifica los detalles del Cliente." : "Ingresa los datos del nuevo Cliente para registrarlo."}
          </p>
        </div>

        <fieldset disabled={cliente?.sistema === 1}>
          {/* Formulario */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-3 px-3 py-2">
                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="codigo"
                    label="Codigo"
                    placeholder="Ingresa el Codigo "
                  />

                  <FormInput 
                    name="denominacion" 
                    label="Denominación" 
                    placeholder="Ingresa la denominación" 
                  />

                  <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
                    <label className="block text-sm font-medium text-gray-700 py-1">Vendedor</label>
                    <div className="flex gap-x-4">
                      <div className="w-1/2">
                        <input
                          type="text"
                          ref={denominacionVendedorRef}
                          onKeyDown={(e) => handleEnterEnSelect(e, "VENDEDOR")}
                          placeholder="Denominación"
                          className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={denominacionVendedor}
                          onChange={(e) => setDenominacionVendedor(e.target.value.trimStart())}
                          disabled={cliente && cliente.sistema > 0 ? true : false}
                        />
                      </div>
                      <div ref={selectVendedorRef} className="w-full">
                        <Select
                          value={
                            vendedores.length > 0
                              ? vendedores.find((option) => option.id === watch("vendedorId")) || null
                              : selectedVendedor
                          }
                          options={vendedores}
                          getOptionLabel={(option) => option.denominacion}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(selectedOption) => {
                            methods.setValue(`vendedorId`, selectedOption?.id || 0);
                          }}
                          placeholder="Seleccione"
                          className="text-black"
                          isDisabled={cliente && cliente.sistema > 0 ? true : false}
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
                        {errors.vendedorId?.message && (
                          <p className="text-sm text-red-600 mt-1">{errors.vendedorId.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
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
                          disabled={cliente && cliente.sistema > 0 ? true : false}
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
                            methods.setValue("dni", "");
                          }}
                          placeholder="Seleccione"
                          className="text-black"
                          isDisabled={cliente && cliente.sistema > 0 ? true : false}
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
                        (condicionesIva.length > 0
                          ? condicionesIva.find((option) => option.id === watch("condicionIvaId"))?.requiereCuit
                          : selectedCondicionIva?.requiereCuit)
                      }
                    />
                  </div>
                </div>
                <DomicilioForm
                  onDatos={handleDomicilio}
                  datosDomicilioExistentes={cliente?.domicilio}
                  sistema={cliente?.sistema}
                />
                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EmailInput
                    name="mail"
                    label="Mail"
                    placeholder="Ingresa el mail (opcional)"
                  />
                  <FormInput
                    name="celular"
                    label="Celular"
                    placeholder="Ingresa el celular (opcional)"
                  />
                </div>
                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="contactoNombre"
                    label="Contacto Nombre"
                    placeholder="Ingresa el nombre del contacto (opcional)"
                  />
                  <FormInput
                    name="contactoCargo"
                    label="Contacto Cargo"
                    placeholder="Ingresa el cargo del contacto (opcional)"
                  />
                </div>
                <FormInput 
                  name="observacion" 
                  label="Observación" 
                  placeholder="Ingresa una observación (opcional)" 
                />

                {cliente && (
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PriceInput 
                      name="saldo" 
                      label="Saldo" 
                      value={cliente?.saldo || 0} 
                      onChange={() => {}} 
                      disabled={true}
                      />
                  </div>
                )}
              </CardContent>
              {errors.root?.message && (
                <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
              )}
              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting
                    ? cliente
                      ? "Actualizando..."
                      : "Registrando..."
                    : cliente
                      ? "Actualizar"
                      : "Registrar"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </fieldset>
      </Card>
      <AlertasConfirmacion />
    </div>
  );
}
