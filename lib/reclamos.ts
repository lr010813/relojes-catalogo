import { promises as fs } from "fs";
import path from "path";
import { randomInt } from "crypto";

const SEQ_PATH = path.join(process.cwd(), "data", "reclamos-seq.json");

type SeqFile = { year: number; seq: number };

async function leerSeq(): Promise<SeqFile> {
  const year = new Date().getFullYear();
  try {
    const raw = await fs.readFile(SEQ_PATH, "utf8");
    const parsed = JSON.parse(raw) as SeqFile;
    if (parsed.year === year && typeof parsed.seq === "number") return parsed;
  } catch {
    /* archivo ausente o inválido */
  }
  return { year, seq: 0 };
}

/** Genera un código tipo REC-2026-0001. Usa contador en disco cuando es posible. */
export async function generarCodigoReclamo(): Promise<string> {
  const year = new Date().getFullYear();
  try {
    const actual = await leerSeq();
    const siguiente = actual.year === year ? actual.seq + 1 : 1;
    await fs.mkdir(path.dirname(SEQ_PATH), { recursive: true });
    await fs.writeFile(SEQ_PATH, JSON.stringify({ year, seq: siguiente }, null, 2), "utf8");
    return `REC-${year}-${String(siguiente).padStart(4, "0")}`;
  } catch {
    const fallback = `${Date.now().toString().slice(-4)}${randomInt(10, 99)}`;
    return `REC-${year}-${fallback}`;
  }
}

export type ReclamoPayload = {
  nombres: string;
  apellidoPaterno: string;
  tipoDocumento: "DNI" | "CE";
  numeroDocumento: string;
  email: string;
  telefono?: string;
  tipo: "Reclamo" | "Queja";
  productoServicio: string;
  montoReclamado?: string;
  detalle: string;
  pedidoConsumidor: string;
};
