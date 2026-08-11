"use client";

import { useEffect, useState } from "react";
import type { Producto } from "@/lib/productos";

const VACIO: Producto = {
  id: "",
  marca: "",
  modelo: "",
  precio: 0,
  moneda: "PEN",
  descripcion: "",
  imagen: "",
  imagenes: [],
  stock: 1,
  categoria: "",
  genero: "Unisex",
};

export default function AdminPage() {
  const [clave, setClave] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editando, setEditando] = useState<Producto>(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (autenticado) cargarProductos();
  }, [autenticado]);

  async function cargarProductos() {
    const res = await fetch("/api/productos");
    setProductos(await res.json());
  }

  async function guardarTodo(nuevaLista: Producto[]) {
    setGuardando(true);
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": clave },
      body: JSON.stringify(nuevaLista),
    });
    setGuardando(false);
    if (res.ok) {
      setAviso("Guardado ✓");
      setProductos(nuevaLista);
    } else {
      setAviso("Error al guardar. Revisa tu clave.");
    }
    setTimeout(() => setAviso(""), 2500);
  }

  function agregarOActualizar() {
    if (!editando.marca || !editando.modelo) return;
    const id = editando.id || Date.now().toString();
    const nuevo = { ...editando, id };
    const existe = productos.some((p) => p.id === id);
    const nuevaLista = existe
      ? productos.map((p) => (p.id === id ? nuevo : p))
      : [...productos, nuevo];
    guardarTodo(nuevaLista);
    setEditando(VACIO);
  }

  function eliminar(id: string) {
    guardarTodo(productos.filter((p) => p.id !== id));
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="w-full max-w-sm border border-line/40 bg-panel p-8">
          <h1 className="font-display text-2xl text-ink">Acceso admin</h1>
          <p className="mt-1 text-sm text-taupe">Ingresa la clave configurada en ADMIN_PASSWORD.</p>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="mt-4 w-full border border-line/40 bg-paper px-3 py-2 text-ink outline-none focus:border-amber"
            placeholder="Clave"
          />
          <button
            onClick={() => setAutenticado(true)}
            className="mt-4 w-full bg-amber py-2 text-xs uppercase tracking-widest2 text-paper hover:bg-amberLight"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-12 text-ink">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl">Administrar catálogo</h1>
        {aviso && <p className="mt-2 text-sm text-amber">{aviso}</p>}

        <div className="mt-8 grid grid-cols-2 gap-3 border border-line/40 bg-panel p-6">
          {(["marca", "modelo", "categoria", "imagen"] as const).map((campo) => (
            <input
              key={campo}
              placeholder={campo}
              value={(editando as any)[campo]}
              onChange={(e) => setEditando({ ...editando, [campo]: e.target.value })}
              className="border border-line/40 bg-paper px-3 py-2 text-sm outline-none focus:border-amber"
            />
          ))}
          <input
            type="number"
            placeholder="precio"
            value={editando.precio}
            onChange={(e) => setEditando({ ...editando, precio: Number(e.target.value) })}
            className="border border-line/40 bg-paper px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <input
            type="number"
            placeholder="stock"
            value={editando.stock}
            onChange={(e) => setEditando({ ...editando, stock: Number(e.target.value) })}
            className="border border-line/40 bg-paper px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <textarea
            placeholder="descripción"
            value={editando.descripcion}
            onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
            className="col-span-2 border border-line/40 bg-paper px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <button
            onClick={agregarOActualizar}
            disabled={guardando}
            className="col-span-2 bg-amber py-2 text-xs uppercase tracking-widest2 text-paper hover:bg-amberLight"
          >
            {editando.id ? "Actualizar reloj" : "Agregar reloj"}
          </button>
        </div>

        <div className="mt-10 space-y-2">
          {productos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border border-line/40 bg-panel px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {p.marca} {p.modelo}
                </p>
                <p className="text-xs text-taupe">
                  S/ {p.precio} · stock {p.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditando(p)} className="text-xs text-amber hover:underline">
                  Editar
                </button>
                <button onClick={() => eliminar(p.id)} className="text-xs text-taupe hover:text-ink hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
