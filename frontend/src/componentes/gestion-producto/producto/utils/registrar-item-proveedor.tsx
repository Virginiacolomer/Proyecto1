import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";

import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import {
  FormValues,
  ItemsProveedorEnPayload,
  ItemsProveedorTabla,
  schema,
} from "../interfaces/interfaces-validaciones-item-proveedor";
import ProductoService from "../services/producto-service";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { Proveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { Button } from "../../../ui/Button";
import { Search } from "lucide-react";
import Select from "react-select";
import { getUsuarioId } from "../../../../utils/auth";

export default function RegistrarProveedorForm({
  itemsProveedor,
  onAddItem,
  onDeleteItem,
  onItemSinAgregar,
}: {
  itemsProveedor?: ItemProveedor[];
  onAddItem: (nuevoItem: ItemsProveedorEnPayload) => void;
  onDeleteItem: (rowIndex: number) => void;
  onItemSinAgregar: (itemSinAgregar: boolean) => void;
}) {
  console.log("items proveedor PROPIEDAD", itemsProveedor);

  //===================== CONSTANTES VARIAS ============================================
  const usuario = getUsuarioId();
  const usuarioCreatedId = usuario;

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = methods;

  console.log("estos son los errores", errors);

  // Obtener proveedores, marcas y líneas
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([]);
  const [itemsProveedorNuevos, setItemsProveedorNuevos] = React.useState<ItemsProveedorTabla[]>([]);
  const [itemsProveedorExistentes, setItemsProveedorExistentes] = React.useState<ItemProveedor[]>([]);
  const [proveedorIdsAgregados, setProveedorIdsAgregados] = useState<Set<number>>(new Set());
  const [denominacionProveedor, setDenominacionProveedor] = useState("");

  console.log("items proveedor EXISTENTESSSSSSSSSSSSSSSS", itemsProveedorExistentes);

  const proveedorId = watch("proveedorId");
  const codigoProveedor = watch("codigoProveedor");

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setItemsProveedorExistentes(itemsProveedor || []);

        // 2. Agregar todos los producto.id al Set
        const nuevosIds = (itemsProveedor ?? []).map((item) => item.proveedorId);
        setProveedorIdsAgregados(new Set(nuevosIds));
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [itemsProveedor]);

  useEffect(() => {
    const validarCampos = () => {
      if (
        proveedorId !== undefined ||
        (proveedorId !== undefined && codigoProveedor !== undefined && codigoProveedor !== "")
      ) {
        onItemSinAgregar(true);
      } else {
        onItemSinAgregar(false);
      }
    };
    validarCampos();
  }, [proveedorId, codigoProveedor, onItemSinAgregar]);

  const handleDeleteItemProveedor = async (rowIndex: number, nuevo: boolean) => {
    try {
      if (onDeleteItem) {
        if (!nuevo) {
          onDeleteItem(rowIndex); // Usamos el índice de la fila para eliminar
          // 2. Eliminar el proveedor correspondiente del Set
          const proveedorIdsArray = Array.from(proveedorIdsAgregados);
          const proveedorIdAEliminar = proveedorIdsArray[rowIndex];
          const nuevoSet = new Set(proveedorIdsAgregados);
          nuevoSet.delete(proveedorIdAEliminar);
          setProveedorIdsAgregados(nuevoSet);
        } else {
          onDeleteItem(rowIndex + itemsProveedorExistentes.length);
          // 2. Eliminar el proveedor correspondiente del Set
          const proveedorIdsArray = Array.from(proveedorIdsAgregados);
          const proveedorIdAEliminar = proveedorIdsArray[rowIndex + itemsProveedorExistentes.length];
          const nuevoSet = new Set(proveedorIdsAgregados);
          nuevoSet.delete(proveedorIdAEliminar);
          setProveedorIdsAgregados(nuevoSet);
        }
      }

      if (nuevo) {
        // Eliminamos también de la lista de proveedores nuevos (local)
        setItemsProveedorNuevos((prev) => prev.filter((_, index) => index !== rowIndex));
      } else {
        setItemsProveedorExistentes((prev) => prev.filter((_, index) => index !== rowIndex));
      }
    } catch (error) {
      console.error("Error al eliminar el item proveedor:", error);
    }
  };

  const handleAddItemProveedor = async () => {
    const isValid = await methods.trigger([`proveedorId`, `codigoProveedor`]);
    if (!isValid) {
      console.error("Error en la validación: ", methods.formState.errors);
      return;
    }

    const proveedorSeleccionado = proveedores.find((option) => option.id === Number(watch("proveedorId")));
    console.log("Proveedor seleccionado:", proveedorSeleccionado);
    if (!proveedorSeleccionado) {
      console.error("No se encontró un proveedor con el ID seleccionado.");
      return;
    }

    if (proveedorIdsAgregados.has(proveedorSeleccionado.id)) {
      alert("Este proveedor ya fue agregado en otro ítem.");
      return;
    }

    const nuevoItemForm: ItemsProveedorEnPayload = {
      usuarioCreatedId: usuarioCreatedId,
      codigoProveedor: getValues("codigoProveedor"),
      proveedorId: Number(getValues("proveedorId")),
    };

    if (onAddItem) {
      onAddItem(nuevoItemForm);
      setProveedorIdsAgregados((prev) => new Set(prev).add(Number(getValues("proveedorId"))));
    }

    const nuevoItemTabla: ItemsProveedorTabla = {
      codigoProveedor: getValues("codigoProveedor"),
      proveedor: proveedores.find((proveedor) => proveedor.id === Number(getValues("proveedorId")))?.denominacion || "",
    };
    setItemsProveedorNuevos((prev) => [...prev, nuevoItemTabla]);

    methods.reset({
      proveedorId: undefined,
      codigoProveedor: "",
    });
  };

  const handleBuscarDenominacionProveedor = async () => {
    try {
      const proveedores = await ProductoService.obtenerTotales({ denominacion: denominacionProveedor }, "proveedores");
      if (proveedores) {
        console.log("Proveedores encontrados:", proveedores);
        setProveedores(proveedores.data);
      } else {
        console.log("No se encontró un producto con el código ingresado.");
      }
    } catch (error) {
      console.error("Error al buscar el producto por código:", error);
    }
  };

  const denominacionProveedorRef = useRef<HTMLInputElement>(null);
  const buscarProveedorRef = useRef<HTMLButtonElement>(null);
  const selectProveedorRef = useRef<HTMLDivElement>(null);

  const handleEnterEnProveedor = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Ejecutar clic del botón (si está presente)
      if (buscarProveedorRef.current) {
        buscarProveedorRef.current.click();
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        // Buscar el componente Select y abrirlo
        const selectDiv = selectProveedorRef.current;
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

  return (
    <div className="col-span-full flex flex-col w-full">
      <div className="">
        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <div className="w-full ">
              {/* Label + Input de código */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Denominación:</label>
                <input
                  type="text"
                  ref={denominacionProveedorRef}
                  onKeyDown={handleEnterEnProveedor}
                  placeholder="proveedor"
                  className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={denominacionProveedor}
                  onChange={(e) => setDenominacionProveedor(e.target.value)}
                />
              </div>

              {/* Botón de búsqueda */}
              <Button
                type="button"
                ref={buscarProveedorRef}
                variant="outline"
                size="icon"
                className="hidden bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                onClick={handleBuscarDenominacionProveedor}
              >
                <Search size={20} />
              </Button>

              <label className="block text-sm font-medium text-gray-700 py-1">Proveedores</label>
              <div ref={selectProveedorRef}>
                <Select
                  value={proveedores.find((option) => option.id === watch("proveedorId")) || null}
                  options={proveedores}
                  getOptionLabel={(option) => option.denominacion}
                  getOptionValue={(option) => String(option.id)}
                  onChange={(selectedOption) => {
                    methods.setValue(`proveedorId`, selectedOption?.id || 0);
                  }}
                  placeholder="Seleccione"
                  className="text-black"
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
                {errors.proveedorId?.message && (
                  <p className="text-sm text-red-600 mt-1">{errors.proveedorId.message}</p>
                )}
              </div>
            </div>

            <FormInput name={`codigoProveedor`} placeholder="Codigo Proveedor" label={""} />

            {/* Botón para agregar sublíneas nuevas */}
            <button
              type="button"
              onClick={handleAddItemProveedor}
              className="bg-white mt-2 text-blue-600 hover:text-blue-800"
            >
              ➕ Agregar proveedor
            </button>

            {/* Tabla de Proveedores */}
            <div className="space-y-2 col-span-full">
              <label className="block text-sm font-medium text-gray-700">Proveedores</label>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Proveedor</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Codigo Proveedor</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sublíneas existentes (ya guardadas en la base de datos) */}
                  {itemsProveedorExistentes?.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{item.proveedor}</td>
                      <td className="px-4 py-2 text-black">{item.codigoProveedor}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteItemProveedor(index, false)}
                          className="bg-white text-red-600 hover:text-red-800"
                          disabled={item.sistema === 1}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Sublíneas nuevas (agregadas dinámicamente) */}
                  {itemsProveedorNuevos.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{item.proveedor}</td>
                      <td className="px-4 py-2 text-black">{item.codigoProveedor}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteItemProveedor(index, true)}
                          className="bg-white text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
