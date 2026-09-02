"use client";

import { CartProvider } from "@/lib/CartContext";
import CarritoDrawer from "./CarritoDrawer";
import Footer from "./Footer";
import ToastCarrito from "./ToastCarrito";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Footer />
      <CarritoDrawer />
      <ToastCarrito />
    </CartProvider>
  );
}
