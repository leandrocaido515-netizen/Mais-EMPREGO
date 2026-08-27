import { supabaseServer } from "../../../lib/supabaseServer";
import ApplyButton from "./ApplyButton";

export const revalidate = 0;

export default async function VagaDetalhe({ params }) {
  const supabase = supabaseServer();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", params.id).single();

  if (!job) {
    return <div className="max-w-3xl mx-auto px-5 py-16 text-sm text-musgo">Vaga não encontrada.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <div className="bg-white rounded-sm p-6 sm:p-8 border-l-4 border-ouro">
          <span className="text-xs font-semibold uppercase tracking-wide text-ouro">{job.categoria}</span>
          <h1 className="text-2xl sm:text-3xl mt-2 font-display font-semibold text-ink">{job.titulo}</h1>
          <p className="text-base mt-1 text-musgo">{job.organizacao} · {job.local}, {job.provincia}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-5 pb-5 border-y border-musgoLine font-mono">
            <span className="text-xs text-ink"><b>Tipo:</b> {job.tipo_contrato}</span>
            {job.prazo && <span className="text-xs text-brick"><b>Prazo:</b> {new Date(job.prazo).toLocaleDateString("pt-PT")}</span>}
          </div>

          <h2 className="text-sm font-semibold mt-6 mb-2 text-ink">Descrição da função</h2>
          <p className="text-sm leading-relaxed text-ink">{job.descricao}</p>

          {job.requisitos?.length > 0 && (
            <>
              <h2 className="text-sm font-semibold mt-6 mb-2 text-ink">Requisitos</h2>
              <ul className="text-sm leading-relaxed list-disc pl-5 text-ink">
                {job.requisitos.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <ApplyButton jobId={job.id} />
            <span className="text-xs font-mono text-musgo">Contacto: {job.contacto_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
