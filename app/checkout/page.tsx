"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BotonCulqi from "@/components/BotonCulqi";
import { useCart } from "@/lib/CartContext";
import { formatoMoneda } from "@/lib/cart";
import { NEGOCIO, REDES } from "@/lib/config";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const moneda = items[0]?.moneda || "PEN";

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

          <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink">Checkout</h1>
          <p className="mt-2 text-sm text-taupe">Resumen de tu pedido. El pago se procesa con Culqi.</p>

          {items.length === 0 ? (
            <div className="mt-10 border border-line/40 bg-panel p-8 text-center">
              <p className="font-display text-xl text-ink">Tu carrito está vacío</p>
              <Link
                href="/#catalogo"
                className="mt-4 inline-block border border-amber px-5 py-2 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="mt-8 border border-line/40 bg-panel">
              <ul className="divide-y divide-line/40">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">
                        {item.marca}
                      </p>
                      <p className="font-display text-xl font-medium tracking-tight text-ink">
                        {item.modelo}
                      </p>
                      <p className="mt-1 text-[12px] text-taupe">
                        {item.cantidad} × {formatoMoneda(item.precio, item.moneda)}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-amber">
                      {formatoMoneda(item.precio * item.cantidad, item.moneda)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-line/40 px-5 py-4">
                <span className="font-mono text-[11px] uppercase tracking-widest2 text-taupe">Total</span>
                <span className="font-mono text-xl text-amber">{formatoMoneda(total, moneda)}</span>
              </div>
              <div className="px-5 pb-5">
                <BotonCulqi />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t-2 border-amber px-6 py-10 text-center text-xs text-taupe">
        <p>
          {NEGOCIO.nombre} · {NEGOCIO.email}
        </p>
        <p className="mt-2">
          <a href={REDES.instagram} target="_blank" className="mx-2 hover:text-amber">
            Instagram
          </a>
          <a href={REDES.facebook} target="_blank" className="mx-2 hover:text-amber">
            Facebook
          </a>
          <a href={REDES.tiktok} target="_blank" className="mx-2 hover:text-amber">
            TikTok
          </a>
        </p>
      </footer>
    </>
  );
}
