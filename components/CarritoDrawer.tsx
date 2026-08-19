"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { formatoMoneda } from "@/lib/cart";

export default function CarritoDrawer() {
  const router = useRouter();
  const { items, abierto, cerrarCarrito, removeItem, updateQuantity, total, cantidadTotal } =
    useCart();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="absolute inset-0 bg-ink/40"
        onClick={cerrarCarrito}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line/40 bg-paper">
        <div className="flex items-center justify-between border-b-2 border-amber px-5 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">Pedido</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Carrito</h2>
          </div>
          <button
            type="button"
            onClick={cerrarCarrito}
            className="font-mono text-[11px] uppercase tracking-widest2 text-taupe transition hover:text-amber"
          >
            Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-xl text-ink">Tu carrito está vacío</p>
            <Link
              href="/#catalogo"
              onClick={cerrarCarrito}
              className="mt-4 border border-amber px-5 py-2 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
            >
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="border border-line/40 bg-panel p-3">
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden border-b-2 border-amber bg-white">
                        {item.imagen ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imagen}
                            alt={`${item.marca} ${item.modelo}`}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-widest2 text-taupe">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">
                          {item.marca}
                        </p>
                        <p className="truncate font-display text-lg font-medium tracking-tight text-ink">
                          {item.modelo}
                        </p>
                        <p className="mt-1 font-mono text-sm text-amber">
                          {formatoMoneda(item.precio, item.moneda)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-line/40">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="px-3 py-1.5 text-ink transition hover:text-amber"
                        >
                          −
                        </button>
                        <span className="min-w-[2ch] border-x border-line/40 px-3 py-1.5 text-center font-mono text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          disabled={item.cantidad >= item.stock}
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="px-3 py-1.5 text-ink transition hover:text-amber disabled:cursor-not-allowed disabled:text-taupe"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-mono text-[10px] uppercase tracking-widest2 text-taupe transition hover:text-ink"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line/40 bg-paper px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest2 text-taupe">
                  {cantidadTotal} {cantidadTotal === 1 ? "artículo" : "artículos"}
                </span>
                <span className="font-mono text-lg text-amber">{formatoMoneda(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push("/checkout");
                  cerrarCarrito();
                }}
                className="mt-4 block w-full border border-amber bg-amber py-2.5 text-center text-[11px] uppercase tracking-widest2 text-paper transition hover:bg-amberLight"
              >
                Proceder al pago
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
