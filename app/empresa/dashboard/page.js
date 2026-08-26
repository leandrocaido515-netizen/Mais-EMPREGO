"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function DashboardEmpresa() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login?next=/empresa/dashboard"); return; }

      const { data: minhasVagas } = await supabase
        .from("jobs")
        .select("id, titulo, estado, created_at")
        .eq("empresa_id", data.user.id)
        .order("created_at", { ascending: false });

      const comCandidaturas = await Promise.all(
        (minhasVagas || []).map(async (job) => {
          const { data: apps } = await supabase
            .from("applications")
            .select("id, created_at, estado, profiles(nome, email, telefone, cv_url)")
            .eq("job_id", job.id)
            .order("created_at", { ascending: false });
          return { ...job, candidaturas: apps || [] };
        })
      );
      setJobs(comCandidaturas);
    });
  }, []);

  const abrirCV = async (caminho) => {
    if (!caminho) return;
    const { data } = await supabase.storage.from("cvs").createSignedUrl(caminho, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  if (jobs === null) {
    return <div className="max-w-4xl mx-auto px-5 py-16 text-sm text-musgo">A carregar...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-semibold font-display text-ink mb-1">As minhas vagas</h1>
        <p className="text-sm text-musgo mb-8">Vagas publicadas e candidaturas recebidas.</p>

        {jobs.length === 0 && <p className="text-sm text-musgo">Ainda não publicaste nenhuma vaga.</p>}

        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-sm p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-ink">{job.titulo}</h2>
                <span className="text-xs font-mono px-2 py-1 rounded-sm" style={{
                  background: job.estado === "aprovada" ? "#EAF2E9" : job.estado === "pendente" ? "#FBF0DD" : "#F3E4E2",
                  color: job.estado === "aprovada" ? "#2E5A3C" : job.estado === "pendente" ? "#8A6416" : "#8A3327",
                }}>
                  {job.estado}
                </span>
              </div>

              <p className="text-xs text-musgo mt-1">{job.candidaturas.length} candidatura{job.candidaturas.length === 1 ? "" : "s"}</p>

              {job.candidaturas.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {job.candidaturas.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-sm border-t border-musgoLine pt-2">
                      <div>
                        <p className="text-ink font-medium">{c.profiles?.nome}</p>
                        <p className="text-musgo text-xs">{c.profiles?.email} {c.profiles?.telefone ? `· ${c.profiles.telefone}` : ""}</p>
                      </div>
                      {c.profiles?.cv_url ? (
                        <button onClick={() => abrirCV(c.profiles.cv_url)} className="text-xs font-semibold text-brick">Ver CV</button>
                      ) : (
                        <span className="text-xs text-musgo">Sem CV</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
