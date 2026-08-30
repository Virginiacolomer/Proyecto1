# Checklist de Testing - Circuito Mínimo

> Objetivo: verificar que el sistema funciona end-to-end tras cambios en front y back.
> Estrategia: seguir el flujo de negocio real (ABM base → compra → venta → cobro → banco).
> Marcar cada ítem con ✅ OK | ❌ Error | ⚠️ Parcial

---

## 1. Autenticación

- [ ] Login con usuario y contraseña válidos → redirige a `/admin`
- [ ] Login con credenciales inválidas → muestra error
- [ ] Acceso directo a `/admin` sin sesión → redirige a login
- [ ] Logout → limpia sesión y redirige

---

## 2. ABM Base (datos maestros)

Son la base de todo. Si algo falla acá, va a romper en cascada.

- [ ] **Clientes** → listar, crear, editar
- [ ] **Proveedores** → listar, crear, editar
- [ ] **Productos** → listar, crear, editar — verificar precios con formato `1.234,56`
- [ ] **Marcas** → listar, crear
- [ ] **Líneas / Sublíneas** → listar
- [ ] **Unidades de medida** → listar
- [ ] **Presentaciones** → listar

---

## 3. Gestión de Compras

- [ ] **Pedido de compra** → crear con al menos 1 ítem, verificar totales formateados
- [ ] **Carga de compra** → crear desde pedido o manual
- [ ] **Factura de compra** → registrar, verificar que impacta en stock

---

## 4. Gestión de Stock

- [ ] **Ajuste de stock** → crear ajuste positivo y negativo
- [ ] **Motivo de ajuste** → listar

---

## 5. Gestión de Ventas

- [ ] **Presupuesto de venta** → crear con cliente y productos, verificar importes formateados
- [ ] **Pedido de venta** → crear desde presupuesto o manual, verificar importe total con formato `1.234,56`
- [ ] **Confirmar pedido masivo** → seleccionar pedidos y confirmar
- [ ] **Factura de venta** → generar desde pedido, verificar totales
- [ ] **Remito de venta** → generar
- [ ] **Nota de crédito de venta** → generar
- [ ] **Nota de débito de venta** → generar

---

## 6. Pedido Venta Mobile ⚠️ (modificado)

- [ ] Ingresar con rol VENDEDOR
- [ ] Ver listado de pedidos → verificar que `importeTotal` muestra formato `1.234,56` (punto miles, coma decimales)
- [ ] Crear nuevo pedido mobile → agregar productos, verificar subtotales y total formateados
- [ ] Entregar pedido → flujo completo

---

## 7. Gestión de Cobros y Pagos

- [ ] **Recibo de venta** → crear recibo asociado a factura
- [ ] **Cartera de cheques** → listar, registrar cheque
- [ ] **Cartera de cupones** → listar
- [ ] **Tarjetas de crédito** → listar
- [ ] **Orden de pago** → crear
- [ ] **Libro de caja** → listar movimientos
- [ ] **Movimiento de caja** → registrar ingreso y egreso

---

## 8. Gestión Bancaria

- [ ] **Bancos** → listar
- [ ] **Cuentas bancarias** → listar
- [ ] **Retenciones** → listar, crear
- [ ] **Tipo de retención** → listar
- [ ] **Tipo de movimiento bancario** → listar
- [ ] **Motivo de devolución de cheque** → listar

---

## 9. Configuración del Sistema

- [ ] **Usuarios** → listar, crear con rol
- [ ] **Personal** → listar
- [ ] **Localidades** → listar
- [ ] **Condición IVA** → listar
- [ ] **Familia de banco** → listar
- [ ] **Motivo de gasto / Tipo de gasto** → listar
- [ ] **Motivo de movimiento de caja** → listar
- [ ] **Área de notificación** → listar
- [ ] **Motivo de notificación** → listar

---

## 10. Precios

- [ ] **Lista de precios** → cargar y visualizar, verificar formato de precios
- [ ] **Cambio de precios masivo** → aplicar cambio porcentual, verificar resultado

---

## Notas de regresión

Cosas puntuales a verificar por los cambios recientes:

- [ ] En toda tabla que muestre importes, el formato es `1.234,56` (no `1,234.56`)
- [ ] El pedido mobile muestra `importeTotal` formateado correctamente en la lista de pedidos
- [ ] Las llamadas al back no devuelven 401/403 inesperados (token JWT vigente)
- [ ] Las llamadas al back no devuelven 500 (cambios en endpoints del back)
- [ ] El dashboard carga sin errores de consola
