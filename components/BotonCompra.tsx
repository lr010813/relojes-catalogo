"use client";

import { useState, type MouseEvent } from "react";
import type { Producto } from "@/lib/productos";
import { CULQI_PUBLIC_KEY } from "@/lib/config";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function BotonCompra({ producto }: { producto: Producto }) {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const iniciarPago = (e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!CULQI_PUBLIC_KEY) {
      setMensaje("Configura NEXT_PUBLIC_CULQI_PUBLIC_KEY para activar pagos.");
      return;
    }
    setCargando(true);
    window.Culqi.publicKey = CULQI_PUBLIC_KEY;
    window.Culqi.settings({
      title: producto.marca + " " + producto.modelo,
      currency: producto.moneda,
      amount: Math.round(producto.precio * 100),
    });
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        const res = await fetch("/api/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            monto: Math.round(producto.precio * 100),
            moneda: producto.moneda,
            producto: `${producto.marca} ${producto.modelo}`,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setMensaje("¡Pago exitoso! Te contactaremos para coordinar la entrega.");
        } else {
          setMensaje("No se pudo procesar el pago: " + (data.error || "intenta de nuevo."));
        }
      } else if (window.Culqi.error) {
        setMensaje("Pago cancelado o rechazado.");
      }
      setCargando(false);
    };
    window.Culqi.open();
  };

  return (
    <div>
      <button
        type="button"
        onClick={iniciarPago}
        disabled={producto.stock === 0 || cargando}
        className="w-full border border-amber py-2.5 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper disabled:cursor-not-allowed disabled:border-line disabled:text-taupe disabled:hover:bg-transparent disabled:hover:text-taupe"
      >
        {cargando ? "Procesando…" : producto.stock === 0 ? "Agotado" : "Comprar ahora"}
      </button>
      {mensaje && <p className="mt-3 text-center text-xs text-amber">{mensaje}</p>}
    </div>
  );
}
