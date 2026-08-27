"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseClient";
import { CATS, PROVINCIAS } from "../../lib/constants";

export default function Perfil() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [f, setF] = useState({ provincia: "", area_interesse: "", telefone: "", resumo: "" });
  const [candidaturas, setCandidaturas] = useState([]);
  const [ficheiroCV, setFicheiroCV] = useState(null);
  const [estado, setEstado] = useState("carregando");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login?next=/perfil"); return; }

      const { data: perfil } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(perfil);
      setF({
        provincia: perfil?.provincia || "",
        area_interesse: perfil?.area_interesse || "",
        telefone: perfil?.telefone || "",
        resumo: perfil?.resumo || "",
      });

      const { data: apps } = await supabase
        .from("applications")
        .select("id, created_at, jobs(titulo, organizacao)")
        .eq("candidato_id", data.user.id)
        .order("created_at", { ascending: false });
      setCandidaturas(apps || []);
      setEstado("idle");
    });
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setEstado("guardando");

    let cv_url = profile.cv_url;
    if (ficheiroCV) {
      const caminho = `${profile.id}/cv.pdf`;
      const { error: uploadErro } = await supabase.storage.from("cvs").upload(caminho, ficheiroCV, { upsert: true });
      if (uploadErro) { setEstado("erro"); return; }
      cv_url = caminho;
    }

    const { error } = await supabase.from("profiles").update({ ...f, cv_url }).eq("id", profile.id);
    if (error) { setEstado("erro"); return; }
    setProfile({ ...profile, ...f, cv_url });
    setEstado("guardado");
  };

  if (estado === "carregando" || !profile) {
    return <div className="max-w-2xl mx-auto px-5 py-16 text-sm text-musgo">A carregar perfil...</div>;
  }

  if (profile.tipo !== "candidato") {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-sm text-musgo">
        O perfil detalhado é para contas de candidato. Gere as tuas vagas em "Publicar vaga".
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-semibold font-display text-ink">O meu perfil</h1>
        <p className="text-sm mt-1 mb-8 text-musgo">{profile.nome} · {profile.email}</p>

        <form onSubmit={guardar} className="bg-white rounded-sm p-6 sm:p-8 flex flex-col gap-5 mb-8">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1 text-sm text-ink">
              Província
              <select value={f.provincia} onChange={set("provincia")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm">
                <option value="">Selecionar</option>
                {PROVINCIAS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Área de interesse
              <select value={f.area_interesse} onChange={set("area_interesse")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm">
                <option value="">Selecionar</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Telefone
            <input value={f.telefone} onChange={set("telefone")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Resumo profissional
            <textarea rows={5} value={f.resumo} onChange={set("resumo")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm resize-none" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            CV em PDF {profile.cv_url && <span className="text-musgo font-normal">(já tens um CV enviado)</span>}
            <input type="file" accept="application/pdf" onChange={(e) => setFicheiroCV(e.target.files?.[0] || null)} className="text-sm" />
          </label>

          {estado === "erro" && <span className="text-xs text-brick">Não foi possível guardar. Tenta novamente.</span>}

          <button disabled={estado === "guardando"} className="self-start text-sm font-semibold px-6 py-3 rounded-sm bg-ouro text-verde disabled:opacity-60">
            {estado === "guardando" ? "A guardar..." : estado === "guardado" ? "Guardado ✓" : "Guardar perfil"}
          </button>
        </form>

        <h2 className="text-lg font-semibold font-display text-ink mb-3">As minhas candidaturas</h2>
        {candidaturas.length === 0 ? (
          <p className="text-sm text-musgo">Ainda não te candidataste a nenhuma vaga.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {candidaturas.map((c) => (
              <div key={c.id} className="bg-white px-4 py-3 rounded-sm flex items-center justify-between text-sm text-ink">
                <span>{c.jobs?.titulo} · {c.jobs?.organizacao}</span>
                <span className="font-mono text-musgo">{new Date(c.created_at).toLocaleDateString("pt-PT")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
