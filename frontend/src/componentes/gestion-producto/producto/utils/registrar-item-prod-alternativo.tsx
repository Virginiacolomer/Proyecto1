import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import React from "react";
import ProductoService from "../services/producto-service";
import { ItemProdAlternativo } from "../../../../interfaces/gestion-producto/producto/interfaces-item-prod-alternativo";
import {
  FormValues,
  ItemsProdAlternativoEnPayload,
  ItemsProdAlternativoTabla,
  schema,
} from "../interfaces/interfaces-validaciones-item-prod-alternativo";
import { SelectProdAlternativos } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import Select from "react-select";
import { Button } from "../../../ui/Button";
import { Search } from "lucide-react";
import { getUsuarioId } from "../../../../utils/auth";

export default function RegistrarProductoAlternativoForm({
  itemsProdAlternativo,
  onAddItem,
  onDeleteItem,
  marcaId,
  productoId,
  onItemSinAgregar,
}: {
  itemsProdAlternativo?: ItemProdAlternativo[];
  onAddItem: (nuevoItem: ItemsProdAlternativoEnPayload) => void;
  onDeleteItem: (rowIndex: number) => void;
  marcaId: number;
  productoId: number;
  onItemSinAgregar: (itemSinAgregar: boolean) => void;
}) {
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
  const [prodAlternativos, setProdAlternativos] = React.useState<SelectProdAlternativos[]>([]);
  const [itemsProdAlternativoNuevos, setItemsProdAlternativoNuevos] = React.useState<ItemsProdAlternativoTabla[]>([]);
  const [itemsProdAlternativoExistentes, setItemsProdAlternativosExistentes] = React.useState<ItemProdAlternativo[]>(
    [],
  );
  const [prodAlternativoIdsAgregados, setProdAlternativoIdsAgregados] = useState<Set<number>>(new Set());
  const [nroPieza, setNroPieza] = useState("");
  const [codProveedorExacto, setCodProveedorExacto] = useState(false);

  const productoAlternativoId = watch("productoAlternativoId");
  console.log("Producto Alternativo ID:", productoAlternativoId);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setItemsProdAlternativosExistentes(itemsProdAlternativo || []);

        // 2. Agregar todos los producto.id al Set
        const nuevosIds = (itemsProdAlternativo ?? []).map((item) => item.productoAlternativoId);
        setProdAlternativoIdsAgregados(new Set(nuevosIds));
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [itemsProdAlternativo]);

  useEffect(() => {
    const validarCampos = () => {
      if (productoAlternativoId !== undefined) {
        onItemSinAgregar(true);
      } else {
        onItemSinAgregar(false);
      }
    };
    validarCampos();
  }, [productoAlternativoId, onItemSinAgregar]);

  const handleDeleteItemProdAlternativo = async (rowIndex: number, nuevo: boolean) => {
    try {
      if (onDeleteItem) {
        if (!nuevo) {
          onDeleteItem(rowIndex); // Usamos el índice de la fila para eliminar
          // 2. Eliminar el producto correspondiente del Set
          const productoIdsArray = Array.from(prodAlternativoIdsAgregados);
          const productoIdAEliminar = productoIdsArray[rowIndex];
          const nuevoSet = new Set(prodAlternativoIdsAgregados);
          nuevoSet.delete(productoIdAEliminar);
          setProdAlternativoIdsAgregados(nuevoSet);
        } else {
          onDeleteItem(rowIndex + itemsProdAlternativoExistentes.length);
          // 2. Eliminar el producto correspondiente del Set
          const productoIdsArray = Array.from(prodAlternativoIdsAgregados);
          const productoIdAEliminar = productoIdsArray[rowIndex + itemsProdAlternativoExistentes.length];
          const nuevoSet = new Set(prodAlternativoIdsAgregados);
          nuevoSet.delete(productoIdAEliminar);
          setProdAlternativoIdsAgregados(nuevoSet);
        }
      }

      if (nuevo) {
        // Eliminamos también de la lista de proveedores nuevos (local)
        setItemsProdAlternativoNuevos((prev) => prev.filter((_, index) => index !== rowIndex));
      } else {
        setItemsProdAlternativosExistentes((prev) => prev.filter((_, index) => index !== rowIndex));
      }
    } catch (error) {
      console.error("Error al eliminar el item proveedor:", error);
    }
  };

  const handleAddItemProdAlternativo = async () => {
    const isValid = await methods.trigger([`productoAlternativoId`]);
    if (!isValid) {
      console.error("Error en la validación: ", methods.formState.errors);
      return;
    }

    const productoSeleccionado = prodAlternativos.find((option) => option.id === watch("productoAlternativoId"));
    if (productoSeleccionado?.id && prodAlternativoIdsAgregados.has(productoSeleccionado.id)) {
      alert("Este producto ya fue agregado en otro ítem.");
      return;
    }

    const nuevoItemForm: ItemsProdAlternativoEnPayload = {
      usuarioCreatedId: usuarioCreatedId,
      productoAlternativoId: Number(getValues("productoAlternativoId")),
    };

    if (onAddItem) {
      onAddItem(nuevoItemForm);
      setProdAlternativoIdsAgregados((prev) => new Set(prev).add(Number(getValues("productoAlternativoId"))));
    }

    const nuevoItemTabla: ItemsProdAlternativoTabla = {
      productoAlternativo:
        prodAlternativos.find((prodAlternativo) => prodAlternativo.id === Number(getValues("productoAlternativoId")))
          ?.denominacion || "",
      numeroPieza:
        prodAlternativos.find((prodAlternativo) => prodAlternativo.id === Number(getValues("productoAlternativoId")))
          ?.codigoProveedor || "",
      proveedor:
        prodAlternativos.find((prodAlternativo) => prodAlternativo.id === Number(getValues("productoAlternativoId")))
          ?.proveedor || "",
    };
    setItemsProdAlternativoNuevos((prev) => [...prev, nuevoItemTabla]);

    methods.reset({
      productoAlternativoId: undefined,
    });
    setNroPieza("");
  };

  const handleBuscarCodigoProducto = async (marcaId: number, productoId: number) => {
    try {
      const productos = await ProductoService.obtenerTotales(
        {
          codigoProveedor: nroPieza,
          codProveedorExacto: codProveedorExacto,
          marcaId: marcaId,
          productoId: productoId,
        },
        "alternativos",
      );

      if (productos) {
        console.log("Productos encontrados:", productos);
        setProdAlternativos(productos.data);
      } else {
        console.log("No se encontró un producto con el código ingresado.");
      }
    } catch (error) {
      console.error("Error al buscar el producto por código:", error);
    }
  };

  const nroPiezaRef = useRef<HTMLInputElement>(null);
  const buscarProductoRef = useRef<HTMLButtonElement>(null);
  const selectAlternativoRef = useRef<HTMLDivElement>(null);

  const handleEnterEnNroPieza = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Ejecutar clic del botón (si está presente)
      if (buscarProductoRef.current) {
        buscarProductoRef.current.click();
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        // Buscar el componente Select y abrirlo
        const selectDiv = selectAlternativoRef.current;
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
            <div className="flex items-end space-x-4 w-full">
              {/* Label + Input de código */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Codigo:</label>
                <input
                  type="text"
                  ref={nroPiezaRef}
                  onKeyDown={handleEnterEnNroPieza}
                  placeholder="Codigo"
                  className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={nroPieza}
                  onChange={(e) => setNroPieza(e.target.value)}
                  disabled={marcaId === 0 || marcaId === undefined ? true : false}
                />
              </div>

              <div className="flex items-center space-x-2 px-2.5 py-2 mt-5 text-black bg-white rounded-lg border border-gray-300">
                <input
                  type="checkbox"
                  name="codProveedorExacto"
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-blue-500"
                  checked={codProveedorExacto || false}
                  onChange={(e) => setCodProveedorExacto(e.target.checked)}
                />
                <label htmlFor="codProveedorExacto" className="text-sm text-black">
                  Exacto
                </label>
              </div>

              {/* Botón de búsqueda */}
              <Button
                type="button"
                ref={buscarProductoRef}
                variant="outline"
                size="icon"
                className="hidden bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                onClick={() => handleBuscarCodigoProducto(marcaId, productoId)}
                disabled={marcaId === 0 || marcaId === undefined ? true : false}
              >
                <Search size={20} />
              </Button>

              <div className="flex flex-col flex-1">
                <label className="block text-sm font-medium text-gray-700 py-1">Alternativos</label>
                <div ref={selectAlternativoRef}>
                  <Select
                    value={prodAlternativos.find((option) => option.id === watch("productoAlternativoId")) || null}
                    options={prodAlternativos}
                    getOptionLabel={(option) => option.codigoProveedorDenominacion}
                    getOptionValue={(option) => String(option.id)}
                    onChange={(selectedOption) => {
                      methods.setValue(`productoAlternativoId`, selectedOption?.id || 0);
                    }}
                    placeholder="Seleccione"
                    className="text-black"
                    isDisabled={marcaId === 0 || marcaId === undefined ? true : false}
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
                  {errors.productoAlternativoId?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.productoAlternativoId.message}</p>
                  )}
                </div>
              </div>

              {/* Botón para agregar sublíneas nuevas */}
              <button
                type="button"
                onClick={handleAddItemProdAlternativo}
                className="bg-white mt-2 text-blue-600 hover:text-blue-800"
              >
                ➕ Agregar alternativo
              </button>
            </div>

            {/* Tabla de Proveedores */}
            <div className="space-y-2 col-span-full">
              <label className="block text-sm font-medium text-gray-700">Alternativos</label>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Codigo</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Producto</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Proveedor</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sublíneas existentes (ya guardadas en la base de datos) */}
                  {itemsProdAlternativoExistentes?.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{item.codigoProveedorProductoAlternativo}</td>
                      <td className="px-4 py-2 text-black">{item.productoAlternativo}</td>
                      <td className="px-4 py-2 text-black">{item.proveedor}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteItemProdAlternativo(index, false)}
                          className="bg-white text-red-600 hover:text-red-800"
                          disabled={item.sistema === 1}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Sublíneas nuevas (agregadas dinámicamente) */}
                  {itemsProdAlternativoNuevos.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{item.numeroPieza}</td>
                      <td className="px-4 py-2 text-black">{item.productoAlternativo}</td>
                      <td className="px-4 py-2 text-black">{item.proveedor}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteItemProdAlternativo(index, true)}
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
