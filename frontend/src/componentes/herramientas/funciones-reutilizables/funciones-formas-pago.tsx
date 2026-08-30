import { ItemEfectivoEnPayload } from "../../gestion-cobros-pagos/gestion-cobros/formas-pago/efectivo/interfaces-validaciones-forma-pago-efectivo";
import { ItemSaldoAFavorEnPayload } from "../../gestion-cobros-pagos/gestion-cobros/formas-pago/interfaces-validaciones-forma-pago-saldo-a-favor";

export const validarItemEfectivoRepetido = (
  itemsAgregados: ItemEfectivoEnPayload[],
  nuevoItem: ItemEfectivoEnPayload,
): boolean => {
  return itemsAgregados.some((item) => item.monto === nuevoItem.monto);
};

export const validarItemSaldoAFavorRepetido = (
  itemsAgregados: ItemSaldoAFavorEnPayload[],
  nuevoItem: ItemSaldoAFavorEnPayload,
): boolean => {
  return itemsAgregados.some(
    (item) => item.saldoAFavorId === nuevoItem.saldoAFavorId && item.monto === nuevoItem.monto,
  );
};
