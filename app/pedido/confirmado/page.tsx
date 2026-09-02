"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { formatoMoneda, ULTIMO_PEDIDO_KEY } from "@/lib/cart";

type LineaPedido = {
  id: string;
  marca: string;
  modelo: string;
  cantidad: number;
  precio: number;
  moneda: "PEN" | "USD";
};

type PedidoGuardado = {
  lineas: LineaPedido[];
  total: number;
  moneda: "PEN" | "USD";
  cargoId?: string | null;
};

export default function PedidoConfirmadoPage() {
  const [pedido, setPedido] = useState<PedidoGuardado | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ULTIMO_PEDIDO_KEY);
      if (raw) setPedido(JSON.parse(raw) as PedidoGuardado);
    } catch {
      setPedido(null);
    }
    setListo(true);
  }, []);

  return (
    <>
      <Header />
      <main className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <Link
            href="/#catalogo"
            className="font-mono text-[11px] uppercase tracking-widest2 text-taupe transition hover:text-amber"
          >
            ← Volver al catálogo
          </Link>

          {!listo ? (
            <p className="mt-10 font-mono text-[11px] uppercase tracking-widest2 text-taupe">
              Cargando pedido…
            </p>
          ) : !pedido || pedido.lineas.length === 0 ? (
            <div className="mt-10 border border-line/40 bg-panel p-8 text-center">
              <p className="font-display text-xl text-ink">No hay un pedido reciente para mostrar</p>
              <Link
                href="/#catalogo"
                className="mt-4 inline-block border border-amber px-5 py-2 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="mt-8 border border-line/40 bg-panel p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">Pago confirmado</p>
              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">Gracias</h1>
              <p className="mt-3 text-sm leading-relaxed text-taupe">
                Recibimos tu pago con Culqi. Te contactaremos para coordinar la entrega.
              </p>
              {pedido.cargoId && (
                <p className="mt-2 font-mono text-[11px] text-taupe">Ref. {pedido.cargoId}</p>
              )}

              <ul className="mt-6 divide-y divide-line/40 border-y border-line/40">
                {pedido.lineas.map((linea) => (
                  <li key={linea.id} className="flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">
                        {linea.marca}
                      </p>
                      <p className="font-display text-xl font-medium tracking-tight text-ink">
                        {linea.modelo}
                      </p>
                      <p className="mt-1 text-[12px] text-taupe">
                        {linea.cantidad} × {formatoMoneda(linea.precio, linea.moneda)}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-amber">
                      {formatoMoneda(linea.precio * linea.cantidad, linea.moneda)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest2 text-taupe">Total pagado</span>
                <span className="font-mono text-xl text-amber">
                  {formatoMoneda(pedido.total, pedido.moneda)}
                </span>
              </div>

              <Link
                href="/#catalogo"
                className="mt-8 block w-full border border-amber py-2.5 text-center text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
              >
                Seguir viendo el catálogo
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
