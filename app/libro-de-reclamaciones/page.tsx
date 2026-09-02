import LegalPageShell from "@/components/LegalPageShell";
import FormularioReclamos from "@/components/FormularioReclamos";
import { LEGAL } from "@/lib/config";

export default function LibroDeReclamacionesPage() {
  return (
    <LegalPageShell title="Libro de Reclamaciones" eyebrow="Atención al consumidor">
      <p className="text-taupe">
        Conforme al Código de Protección y Defensa del Consumidor y a la normativa del Libro de
        Reclamaciones (DS 011-2011-PCM y modificatorias), {LEGAL.nombreComercial} ({LEGAL.razonSocial}
        , RUC {LEGAL.ruc}) pone a tu disposición este formulario para registrar un reclamo o una queja.
      </p>
      <FormularioReclamos />
    </LegalPageShell>
  );
}
