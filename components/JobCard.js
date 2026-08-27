import Link from "next/link";

export default function JobCard({ job }) {
  return (
    <Link
      href={`/vagas/${job.id}`}
      className="bg-white p-5 rounded-sm border-l-4 border-ouro flex flex-col gap-2 hover:shadow-md transition-shadow"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-ouro">{job.categoria}</span>
      <h3 className="text-base font-semibold font-display text-ink">{job.titulo}</h3>
      <p className="text-sm text-musgo">{job.organizacao} · {job.local}, {job.provincia}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-musgoLine">
        <span className="text-xs text-musgo">{job.tipo_contrato}</span>
        <span className="text-xs font-mono text-ink">
          {job.prazo ? `Prazo ${new Date(job.prazo).toLocaleDateString("pt-PT")}` : "Aberta"}
        </span>
      </div>
    </Link>
  );
}
