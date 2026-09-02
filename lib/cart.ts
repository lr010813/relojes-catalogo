import type { Producto } from "@/lib/productos";

export type CartItem = {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  moneda: Producto["moneda"];
  imagen: string;
  stock: number;
  cantidad: number;
};

export const CART_STORAGE_KEY = "meridiano-carrito";
export const ULTIMO_PEDIDO_KEY = "meridiano-ultimo-pedido";

export function productoACartItem(producto: Producto, cantidad = 1): CartItem {
  return {
    id: producto.id,
    marca: producto.marca,
    modelo: producto.modelo,
    precio: producto.precio,
    moneda: producto.moneda,
    imagen: producto.imagen,
    stock: producto.stock,
    cantidad,
  };
}

export function totalArticulos(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.cantidad, 0);
}

export function subtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

export function formatoMoneda(monto: number, moneda: CartItem["moneda"] = "PEN"): string {
  const simbolo = moneda === "USD" ? "$" : "S/";
  return `${simbolo} ${monto.toLocaleString("es-PE")}`;
}
