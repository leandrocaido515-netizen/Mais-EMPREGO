import { supabaseServer } from "../../lib/supabaseServer";
import JobCard from "../../components/JobCard";
import { CATS, PROVINCIAS } from "../../lib/constants";

export const revalidate = 0;

export default async function Vagas({ searchParams }) {
  const supabase = supabaseServer();
  let query = supabase.from("jobs").select("*").eq("estado", "aprovada").order("created_at", { ascending: false });

  if (searchParams.prov) query = query.eq("provincia", searchParams.prov);
  if (searchParams.cat) query = query.eq("categoria", searchParams.cat);
  if (searchParams.q) query = query.ilike("titulo", `%${searchParams.q}%`);

  const { data: jobs } = await query;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-5 pt-10 pb-4">
        <h1 className="text-2xl font-semibold font-display text-ink">Vagas disponíveis</h1>
        <p className="text-sm mt-1 font-mono text-musgo">{jobs?.length || 0} vagas encontradas</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16 grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="pt-2">
          <form className="flex flex-col gap-6">
            <input name="q" defaultValue={searchParams.q || ""} placeholder="Cargo ou palavra-chave" className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-musgo mb-2">Província</h3>
              <div className="flex flex-col gap-1">
                {PROVINCIAS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-ink">
                    <input type="radio" name="prov" value={p} defaultChecked={searchParams.prov === p} /> {p}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-musgo mb-2">Categoria</h3>
              <div className="flex flex-col gap-1">
                {CATS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-ink">
                    <input type="radio" name="cat" value={c} defaultChecked={searchParams.cat === c} /> {c}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-sm bg-ouro text-verde self-start">Filtrar</button>
          </form>
        </aside>

        <div className="grid sm:grid-cols-2 gap-4 content-start">
          {(jobs || []).map((j) => <JobCard key={j.id} job={j} />)}
          {(!jobs || jobs.length === 0) && (
            <p className="text-sm text-musgo col-span-full">Nenhuma vaga corresponde a estes filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}
