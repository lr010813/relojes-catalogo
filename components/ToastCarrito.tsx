"use client";

import { useCart } from "@/lib/CartContext";

export default function ToastCarrito() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 border border-line/40 bg-panel px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-amber shadow-sm">
      {toast}
    </div>
  );
}
