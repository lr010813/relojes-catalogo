"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Producto } from "@/lib/productos";
import {
  CART_STORAGE_KEY,
  productoACartItem,
  subtotal,
  totalArticulos,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (producto: Producto) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  cantidadTotal: number;
  abierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  toast: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function leerStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === "string");
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [listo, setListo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setItems(leerStorage());
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, listo]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!abierto) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  const addItem = useCallback((producto: Producto) => {
    if (producto.stock <= 0) return false;
    let agregado = false;
    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock) return prev;
        agregado = true;
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1, stock: producto.stock, imagen: producto.imagen }
            : item
        );
      }
      agregado = true;
      return [...prev, productoACartItem(producto, 1)];
    });
    if (agregado) setToast("✓ Agregado al carrito");
    return agregado;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, cantidad: number) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        const siguiente = Math.min(Math.max(cantidad, 0), item.stock);
        if (siguiente === 0) return [];
        return [{ ...item, cantidad: siguiente }];
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total: subtotal(items),
      cantidadTotal: totalArticulos(items),
      abierto,
      abrirCarrito: () => setAbierto(true),
      cerrarCarrito: () => setAbierto(false),
      toast,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, abierto, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
