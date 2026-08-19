"use client";

import { useState } from "react";
import { CULQI_PUBLIC_KEY, NEGOCIO } from "@/lib/config";
import { useCart } from "@/lib/CartContext";
import { formatoMoneda } from "@/lib/cart";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function BotonCulqi() {
  const { items, total, clearCart } = useCart();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const moneda = items[0]?.moneda || "PEN";
  const descripcion = items.map((item) => `${item.cantidad}× ${item.marca} ${item.modelo}`).join(", ");

  const pagar = () => {
    if (!CULQI_PUBLIC_KEY) {
      setMensaje("Configura NEXT_PUBLIC_CULQI_PUBLIC_KEY para activar pagos.");
      return;
    }
    if (items.length === 0 || total <= 0) return;
    if (!window.Culqi) {
      setMensaje("El checkout de Culqi aún no está listo. Recarga la página.");
      return;
    }

    setCargando(true);
    setMensaje(null);
    window.Culqi.publicKey = CULQI_PUBLIC_KEY;
    window.Culqi.settings({
      title: NEGOCIO.nombre,
      currency: moneda,
      amount: Math.round(total * 100),
    });
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        const res = await fetch("/api/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            monto: Math.round(total * 100),
            moneda,
            producto: descripcion,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setMensaje("¡Pago exitoso! Te contactaremos para coordinar la entrega.");
          clearCart();
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
        onClick={pagar}
        disabled={items.length === 0 || cargando}
        className="w-full border border-amber bg-amber py-3 text-[11px] uppercase tracking-widest2 text-paper transition hover:bg-amberLight disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-taupe"
      >
        {cargando ? "Procesando…" : `Pagar con Culqi · ${formatoMoneda(total, moneda)}`}
      </button>
      {mensaje && <p className="mt-3 text-center text-xs text-amber">{mensaje}</p>}
    </div>
  );
}
