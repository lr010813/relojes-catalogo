import { leerProductos, type Producto } from "@/lib/productos";

export type LineaPedidoInput = {
  id: string;
  cantidad: number;
};

export type LineaPedido = {
  id: string;
  marca: string;
  modelo: string;
  cantidad: number;
  precio: number;
  moneda: Producto["moneda"];
};

export type PedidoCalculado = {
  lineas: LineaPedido[];
  total: number;
  montoCentimos: number;
  moneda: Producto["moneda"];
  descripcion: string;
};

export class PedidoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PedidoError";
  }
}

/** Recalcula el pedido con precios y stock del catálogo (Sheet / JSON). */
export async function calcularPedido(input: LineaPedidoInput[]): Promise<PedidoCalculado> {
  if (!Array.isArray(input) || input.length === 0) {
    throw new PedidoError("El pedido está vacío.");
  }

  const agrupadas = new Map<string, number>();
  for (const linea of input) {
    const cantidad = Number(linea.cantidad);
    if (!linea.id || typeof linea.id !== "string" || !Number.isInteger(cantidad) || cantidad < 1) {
      throw new PedidoError("Hay una cantidad inválida en el pedido.");
    }
    agrupadas.set(linea.id, (agrupadas.get(linea.id) || 0) + cantidad);
  }

  const catalogo = await leerProductos();
  const porId = new Map(catalogo.map((p) => [p.id, p]));
  const lineas: LineaPedido[] = [];
  let moneda: Producto["moneda"] | null = null;

  for (const [id, cantidad] of Array.from(agrupadas.entries())) {
    const producto = porId.get(id);
    if (!producto) {
      throw new PedidoError("Un producto del pedido ya no está disponible.");
    }
    if (producto.stock < cantidad) {
      throw new PedidoError(`Stock insuficiente para ${producto.marca} ${producto.modelo}.`);
    }
    if (moneda && producto.moneda !== moneda) {
      throw new PedidoError("No se pueden mezclar monedas en un mismo pedido.");
    }
    moneda = producto.moneda;

    lineas.push({
      id: producto.id,
      marca: producto.marca,
      modelo: producto.modelo,
      cantidad,
      precio: producto.precio,
      moneda: producto.moneda,
    });
  }

  const total = lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
  if (total <= 0) {
    throw new PedidoError("El total del pedido no es válido.");
  }

  const descripcion = lineas
    .map((l) => `${l.cantidad}× ${l.marca} ${l.modelo}`)
    .join(", ")
    .slice(0, 80);

  return {
    lineas,
    total,
    montoCentimos: Math.round(total * 100),
    moneda: moneda || "PEN",
    descripcion,
  };
}
