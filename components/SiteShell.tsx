"use client";

import { CartProvider } from "@/lib/CartContext";
import CarritoDrawer from "./CarritoDrawer";
import ToastCarrito from "./ToastCarrito";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CarritoDrawer />
      <ToastCarrito />
    </CartProvider>
  );
}
