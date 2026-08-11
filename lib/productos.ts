import fs from "fs";
import path from "path";
import Papa from "papaparse";

// Único punto de acceso al catálogo. Fuente principal: Google Sheets (CSV).
// data/productos.json es respaldo si el Sheet falla o viene mal formado.

export type Genero = "Hombre" | "Mujer" | "Unisex";

export type Producto = {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  moneda: "PEN" | "USD";
  descripcion: string;
  imagen: string;
  imagenes: string[];
  stock: number;
  categoria: string;
  genero: Genero;
};

const DATA_PATH = path.join(process.cwd(), "data", "productos.json");

export const SHEETS_CSV_URL =
  process.env.SHEETS_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGibiW8rElQnall9WIol_aYpnmtApPauboJ_Oy5ZmGENYi-tAA-_bDU-3PLJWB8b0FN5mGLp3bLHIe/pub?gid=948333778&single=true&output=csv";

/** Último catálogo leído con éxito del Sheet (memoria del proceso). */
let ultimoCatalogoValido: Producto[] | null = null;

type FilaSheet = {
  marca?: string;
  modelo?: string;
  precio?: string;
  moneda?: string;
  descripcion?: string;
  imagen?: string;
  imagenes_extra?: string;
  stock?: string;
  categoria?: string;
  genero?: string;
};

function slugId(marca: string, modelo: string, index: number): string {
  const base = `${marca}-${modelo}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || String(index + 1);
}

function parseGenero(raw: string): Genero {
  const g = raw.trim().toLowerCase();
  if (g === "mujer") return "Mujer";
  if (g === "unisex") return "Unisex";
  return "Hombre";
}

function parseMoneda(raw: string): "PEN" | "USD" {
  return raw.trim().toUpperCase() === "USD" ? "USD" : "PEN";
}

function parseImagenes(portada: string, extras: string): string[] {
  const extraList = extras
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const todas = [portada.trim(), ...extraList].filter(Boolean);
  return Array.from(new Set(todas));
}

function filaAProducto(fila: FilaSheet, index: number): Producto | null {
  const marca = (fila.marca || "").trim();
  const modelo = (fila.modelo || "").trim();
  if (!marca || !modelo) return null;

  const imagen = (fila.imagen || "").trim();
  const imagenes = parseImagenes(imagen, fila.imagenes_extra || "");

  return {
    id: slugId(marca, modelo, index),
    marca,
    modelo,
    precio: Number(fila.precio) || 0,
    moneda: parseMoneda(fila.moneda || "PEN"),
    descripcion: (fila.descripcion || "").trim(),
    imagen: imagen || imagenes[0] || "",
    imagenes: imagenes.length > 0 ? imagenes : imagen ? [imagen] : [],
    stock: Number(fila.stock) || 0,
    categoria: (fila.categoria || "").trim(),
    genero: parseGenero(fila.genero || "Hombre"),
  };
}

function parseCsv(text: string): Producto[] {
  const parsed = Papa.parse<FilaSheet>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error("CSV sin filas válidas");
  }

  const productos = parsed.data
    .map((fila, i) => filaAProducto(fila, i))
    .filter((p): p is Producto => p !== null);

  if (productos.length === 0) {
    throw new Error("CSV sin productos");
  }

  return productos;
}

function leerProductosLocal(): Producto[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Producto[];
}

export async function leerProductos(): Promise<Producto[]> {
  try {
    const res = await fetch(SHEETS_CSV_URL, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Sheet HTTP ${res.status}`);
    }

    const text = await res.text();
    const productos = parseCsv(text);
    ultimoCatalogoValido = productos;
    return productos;
  } catch (err) {
    console.error("[productos] Fallo al leer Google Sheet, usando respaldo:", err);
    if (ultimoCatalogoValido && ultimoCatalogoValido.length > 0) {
      return ultimoCatalogoValido;
    }
    return leerProductosLocal();
  }
}

export async function obtenerProducto(id: string): Promise<Producto | undefined> {
  const productos = await leerProductos();
  return productos.find((p) => p.id === id);
}

export function guardarProductos(productos: Producto[]) {
  // Escribe el JSON local (respaldo / panel admin en desarrollo).
  // La fuente de verdad en producción es el Google Sheet.
  fs.writeFileSync(DATA_PATH, JSON.stringify(productos, null, 2));
}

export function marcasUnicas(productos: Producto[]): string[] {
  return Array.from(new Set(productos.map((p) => p.marca))).sort();
}
