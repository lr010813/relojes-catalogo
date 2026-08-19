"use client";

import { type MouseEvent } from "react";
import type { Producto } from "@/lib/productos";
import { useCart } from "@/lib/CartContext";

export default function BotonAgregarCarrito({ producto }: { producto: Producto }) {
  const { addItem, items } = useCart();
  const enCarrito = items.find((item) => item.id === producto.id);
  const alMaximo = (enCarrito?.cantidad ?? 0) >= producto.stock;

  const agregar = (e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (producto.stock === 0 || alMaximo) return;
    addItem(producto);
  };

  return (
    <button
      type="button"
      onClick={agregar}
      disabled={producto.stock === 0 || alMaximo}
      className="w-full border border-amber py-2.5 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper disabled:cursor-not-allowed disabled:border-line disabled:text-taupe disabled:hover:bg-transparent disabled:hover:text-taupe"
    >
      {producto.stock === 0 ? "Agotado" : alMaximo ? "Stock máximo" : "Agregar al carrito"}
    </button>
  );
}
