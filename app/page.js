import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import JobCard from "@/components/JobCard";
import { CATS, PROVINCIAS } from "@/lib/constants";

export const revalidate = 0;

export default async function Home() {
  const supabase = supabaseServer();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("estado", "aprovada")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("estado", "aprovada");

  return (
    <>
      <section className="bg-verde pb-10">
        <div className="max-w-6xl mx-auto px-5 pt-14 pb-14">
          <h1 className="text-4xl sm:text-5xl leading-tight max-w-2xl font-display font-semibold text-paper">
            O trabalho certo,<br />onde estiveres.
          </h1>
          <p className="mt-4 max-w-lg text-base text-paper/80">
            Vagas verificadas em todas as províncias — de Cabo Delgado a Maputo, do campo à cidade.
          </p>
          <form action="/vagas" className="mt-8 bg-white rounded-sm p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input name="q" type="text" placeholder="Cargo ou palavra-chave" className="flex-1 px-4 py-3 text-sm outline-none rounded-sm text-ink" />
            <select name="prov" className="px-4 py-3 text-sm outline-none rounded-sm border-t sm:border-t-0 sm:border-l border-musgoLine text-ink">
              <option value="">Todas as províncias</option>
              {PROVINCIAS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <button type="submit" className="px-6 py-3 text-sm font-semibold rounded-sm bg-ouro text-verde">Procurar</button>
          </form>
          <p className="mt-6 text-sm font-mono text-musgo">{count ?? 0} vagas ativas · 11 províncias</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-xl font-semibold font-display text-ink mb-5">Áreas em destaque</h2>
        <div className="flex flex-wrap gap-3">
          {CATS.map((c) => (
            <Link key={c} href={`/vagas?cat=${encodeURIComponent(c)}`} className="px-4 py-2 rounded-full text-sm font-medium border border-ouro text-ink">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold font-display text-ink">Vagas recentes</h2>
          <Link href="/vagas" className="text-sm font-medium text-brick">Ver todas →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(jobs || []).map((j) => <JobCard key={j.id} job={j} />)}
          {(!jobs || jobs.length === 0) && (
            <p className="text-sm text-musgo col-span-full">Ainda não há vagas aprovadas. Sê o primeiro a publicar uma.</p>
          )}
        </div>
      </section>

      <section className="bg-brick">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold font-display text-paper">Precisas de contratar?</h2>
            <p className="text-sm mt-1 text-paper/85">Publica a tua vaga e alcança candidatos em todo o país.</p>
          </div>
          <Link href="/publicar" className="px-6 py-3 text-sm font-semibold rounded-sm bg-paper text-brick self-start">Publicar vaga</Link>
        </div>
      </section>
    </>
  );
}
