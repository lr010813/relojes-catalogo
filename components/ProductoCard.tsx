"use client";

import Link from "next/link";
import type { Producto } from "@/lib/productos";
import BotonCompra from "./BotonCompra";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/reloj/${producto.id}`}
      className="group block border border-line/40 bg-panel transition hover:border-amber/60"
    >
      <div className="relative aspect-square overflow-hidden border-b-2 border-amber bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={`${producto.marca} ${producto.modelo}`}
          className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-0 top-0 bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-amber">
          {producto.categoria}
        </span>
      </div>

      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-taupe">{producto.marca}</p>
        <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink">{producto.modelo}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-taupe">{producto.descripcion}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-4">
          <span className="font-mono text-lg text-amber">
            {producto.moneda === "PEN" ? "S/" : "$"} {producto.precio.toLocaleString("es-PE")}
          </span>
          <span className="text-[11px] text-taupe">
            {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
          </span>
        </div>

        <div className="mt-4" onClick={(e) => e.preventDefault()}>
          <BotonCompra producto={producto} />
        </div>
      </div>
    </Link>
  );
}
