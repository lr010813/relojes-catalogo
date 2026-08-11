"use client";

import { useMemo, useState } from "react";
import type { Genero, Producto } from "@/lib/productos";
import ProductoCard from "./ProductoCard";

const GENEROS: Array<"Todos" | Genero> = ["Todos", "Hombre", "Mujer", "Unisex"];

function claseFiltro(activo: boolean) {
  return `border px-4 py-1.5 text-[11px] uppercase tracking-widest2 transition ${
    activo
      ? "border-amber bg-amber text-paper"
      : "border-line/40 text-taupe hover:border-amber/60 hover:text-amber"
  }`;
}

export default function CatalogoGrid({
  productos,
  marcas,
}: {
  productos: Producto[];
  marcas: string[];
}) {
  const [marcaActiva, setMarcaActiva] = useState<string>("Todas");
  const [generoActivo, setGeneroActivo] = useState<"Todos" | Genero>("Todos");

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const okMarca = marcaActiva === "Todas" || p.marca === marcaActiva;
      const okGenero = generoActivo === "Todos" || p.genero === generoActivo;
      return okMarca && okGenero;
    });
  }, [productos, marcaActiva, generoActivo]);

  return (
    <div id="catalogo">
      <div className="mb-3 flex flex-wrap gap-2">
        {["Todas", ...marcas].map((m) => (
          <button
            key={m}
            onClick={() => setMarcaActiva(m)}
            className={claseFiltro(marcaActiva === m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {GENEROS.map((g) => (
          <button
            key={g}
            onClick={() => setGeneroActivo(g)}
            className={claseFiltro(generoActivo === g)}
          >
            {g}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p className="py-20 text-center text-taupe">No hay relojes en esta marca todavía.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
