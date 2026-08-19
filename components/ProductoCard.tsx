"use client";

import Link from "next/link";
import type { Producto } from "@/lib/productos";
import BotonAgregarCarrito from "./BotonAgregarCarrito";

function formatoPrecio(producto: Producto) {
  const monto = Number(producto.precio);
  const valor = Number.isFinite(monto) ? monto : 0;
  const simbolo = producto.moneda === "USD" ? "$" : "S/";
  return `${simbolo} ${valor.toLocaleString("es-PE")}`;
}

export default function ProductoCard({ producto }: { producto: Producto }) {
  const href = `/reloj/${producto.id}`;
  const alt = `${producto.marca} ${producto.modelo}`;

  return (
    <article className="group flex flex-col border border-line/40 bg-panel transition hover:border-amber/60">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden border-b-2 border-amber bg-white p-4">
          {producto.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={producto.imagen}
              alt={alt}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-widest2 text-taupe">
              Sin foto
            </div>
          )}
          <span className="absolute left-0 top-0 bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-amber">
            {producto.categoria}
          </span>
        </div>

        <div className="p-5 pb-0">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-taupe">{producto.marca}</p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink">{producto.modelo}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-taupe">{producto.descripcion}</p>
        </div>
      </Link>

      <div className="mt-auto p-5 pt-4">
        <div className="flex items-center justify-between border-t border-line/40 pt-4">
          <span className="font-mono text-lg text-amber">{formatoPrecio(producto)}</span>
          <span className="text-[11px] text-taupe">
            {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
          </span>
        </div>

        <div className="mt-4">
          <BotonAgregarCarrito producto={producto} />
        </div>
      </div>
    </article>
  );
}
