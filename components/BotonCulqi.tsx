"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CULQI_PUBLIC_KEY, NEGOCIO } from "@/lib/config";
import { useCart } from "@/lib/CartContext";
import { formatoMoneda, ULTIMO_PEDIDO_KEY } from "@/lib/cart";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function BotonCulqi() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const moneda = items[0]?.moneda || "PEN";

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

    const lineas = items.map((item) => ({ id: item.id, cantidad: item.cantidad }));
    const montoCentimos = Math.round(total * 100);

    setCargando(true);
    setMensaje(null);
    window.Culqi.publicKey = CULQI_PUBLIC_KEY;
    window.Culqi.settings({
      title: NEGOCIO.nombre,
      currency: moneda,
      amount: montoCentimos,
    });
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        const res = await fetch("/api/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, items: lineas }),
        });
        const data = await res.json();
        if (data.ok) {
          try {
            window.sessionStorage.setItem(
              ULTIMO_PEDIDO_KEY,
              JSON.stringify({
                lineas: data.pedido.lineas,
                total: data.pedido.total,
                moneda: data.pedido.moneda,
                cargoId: data.cargoId,
              })
            );
          } catch {
            /* sessionStorage puede fallar en modo privado estricto */
          }
          clearCart();
          router.push("/pedido/confirmado");
          return;
        }
        setMensaje("No se pudo procesar el pago: " + (data.error || "intenta de nuevo."));
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
