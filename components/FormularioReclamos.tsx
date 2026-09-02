"use client";

import { FormEvent, useState } from "react";
import { LEGAL } from "@/lib/config";

type Estado =
  | { tipo: "idle" }
  | { tipo: "enviando" }
  | { tipo: "ok"; codigo: string }
  | { tipo: "error"; mensaje: string };

const inputClass =
  "mt-1.5 w-full border border-line/40 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-amber";
const labelClass = "block font-mono text-[10px] uppercase tracking-widest2 text-taupe";

export default function FormularioReclamos() {
  const [estado, setEstado] = useState<Estado>({ tipo: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setEstado({ tipo: "enviando" });
    try {
      const res = await fetch("/api/reclamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: data.get("nombres"),
          apellidoPaterno: data.get("apellidoPaterno"),
          tipoDocumento: data.get("tipoDocumento"),
          numeroDocumento: data.get("numeroDocumento"),
          email: data.get("email"),
          telefono: data.get("telefono"),
          tipo: data.get("tipo"),
          productoServicio: data.get("productoServicio"),
          montoReclamado: data.get("montoReclamado"),
          detalle: data.get("detalle"),
          pedidoConsumidor: data.get("pedidoConsumidor"),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setEstado({ tipo: "error", mensaje: json.error || "No se pudo registrar el reclamo." });
        return;
      }
      setEstado({ tipo: "ok", codigo: json.codigo });
      form.reset();
    } catch {
      setEstado({ tipo: "error", mensaje: "Error de red. Intenta de nuevo." });
    }
  }

  if (estado.tipo === "ok") {
    return (
      <div className="border border-line/40 bg-panel p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">Constancia</p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
          Reclamo registrado
        </h2>
        <p className="mt-3 text-sm text-taupe">
          Guarda este código. Es tu constancia de ingreso al Libro de Reclamaciones.
        </p>
        <p className="mt-6 border border-amber bg-paper px-4 py-4 text-center font-mono text-2xl text-amber">
          {estado.codigo}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-taupe">
          Tienes derecho a recibir respuesta según los plazos establecidos por ley — verificar plazo
          exacto vigente antes de publicar.
        </p>
        <button
          type="button"
          onClick={() => setEstado({ tipo: "idle" })}
          className="mt-6 w-full border border-amber py-2.5 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
        >
          Registrar otro reclamo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 border border-line/40 bg-panel p-6">
      <section>
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
          Identificación del establecimiento
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-taupe">Razón social</dt>
            <dd className="text-ink">{LEGAL.razonSocial}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-taupe">RUC</dt>
            <dd className="font-mono text-ink">{LEGAL.ruc}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-taupe">Dirección</dt>
            <dd className="text-ink sm:text-right">{LEGAL.direccion}</dd>
          </div>
        </dl>
      </section>

      <section className="border-t border-line/40 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">Datos del consumidor</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className={labelClass}>Nombres *</span>
            <input name="nombres" required autoComplete="given-name" className={inputClass} />
          </label>
          <label className="block sm:col-span-1">
            <span className={labelClass}>Apellido paterno *</span>
            <input name="apellidoPaterno" required autoComplete="family-name" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Tipo de documento *</span>
            <select name="tipoDocumento" required defaultValue="DNI" className={inputClass}>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Número de documento *</span>
            <input name="numeroDocumento" required className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Correo electrónico *</span>
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Teléfono (opcional)</span>
            <input name="telefono" type="tel" autoComplete="tel" className={inputClass} />
          </label>
        </div>
      </section>

      <section className="border-t border-line/40 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">Detalle del reclamo</p>
        <div className="mt-4 space-y-4">
          <fieldset>
            <legend className={labelClass}>Tipo *</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="tipo" value="Reclamo" required defaultChecked />
                Reclamo
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="tipo" value="Queja" required />
                Queja
              </label>
            </div>
            <p className="mt-2 text-[12px] text-taupe">
              Reclamo: disconformidad relacionada al producto o servicio. Queja: malestar o
              disconformidad no relacionada directamente al producto o servicio.
            </p>
          </fieldset>

          <label className="block">
            <span className={labelClass}>Producto o servicio contratado *</span>
            <textarea name="productoServicio" required rows={3} className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>Monto reclamado (opcional)</span>
            <input name="montoReclamado" placeholder="Ej. S/ 300" className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>Detalle del reclamo o queja *</span>
            <textarea name="detalle" required rows={5} className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>Pedido del consumidor *</span>
            <textarea
              name="pedidoConsumidor"
              required
              rows={3}
              placeholder="Qué solicitas como solución"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {estado.tipo === "error" && (
        <p className="text-center text-sm text-amber">{estado.mensaje}</p>
      )}

      <button
        type="submit"
        disabled={estado.tipo === "enviando"}
        className="w-full border border-amber bg-amber py-3 text-[11px] uppercase tracking-widest2 text-paper transition hover:bg-amberLight disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-taupe"
      >
        {estado.tipo === "enviando" ? "Enviando…" : "Registrar en el Libro de Reclamaciones"}
      </button>
    </form>
  );
}
