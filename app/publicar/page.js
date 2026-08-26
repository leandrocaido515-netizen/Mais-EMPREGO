"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { CATS, PROVINCIAS } from "@/lib/constants";

export default function Publicar() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [f, setF] = useState({ titulo: "", organizacao: "", local: "", provincia: "", categoria: "", tipo_contrato: "Efetivo", descricao: "", requisitos: "", contacto_email: "", prazo: "" });
  const [estado, setEstado] = useState("idle");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/publicar"); return; }
      setUserId(data.user.id);
    });
  }, []);

  const submeter = async (e) => {
    e.preventDefault();
    setEstado("enviando");
    const { error } = await supabase.from("jobs").insert({
      empresa_id: userId,
      titulo: f.titulo,
      organizacao: f.organizacao,
      local: f.local,
      provincia: f.provincia,
      categoria: f.categoria,
      tipo_contrato: f.tipo_contrato,
      descricao: f.descricao,
      requisitos: f.requisitos.split("\n").map((r) => r.trim()).filter(Boolean),
      contacto_email: f.contacto_email,
      prazo: f.prazo || null,
      estado: "pendente",
    });
    setEstado(error ? "erro" : "enviado");
  };

  if (estado === "enviado") {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16">
        <div className="bg-white rounded-sm p-6 border-l-4 border-ouro">
          <p className="text-sm font-semibold text-ink">Vaga submetida com sucesso.</p>
          <p className="text-sm mt-1 text-musgo">Fica visível ao público depois de aprovada pela nossa equipa (normalmente em 24 horas).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-semibold font-display text-ink">Publicar vaga</h1>
        <p className="text-sm mt-1 mb-8 text-musgo">Preenche os dados abaixo. A vaga é revista antes de ficar visível.</p>

        <form onSubmit={submeter} className="bg-white rounded-sm p-6 sm:p-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-sm text-ink">Título do cargo
            <input required value={f.titulo} onChange={set("titulo")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">Empresa / Organização
            <input required value={f.organizacao} onChange={set("organizacao")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">Localização (distrito/cidade)
            <input required value={f.local} onChange={set("local")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1 text-sm text-ink">Província
              <select required value={f.provincia} onChange={set("provincia")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm">
                <option value="">Selecionar</option>
                {PROVINCIAS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">Categoria
              <select required value={f.categoria} onChange={set("categoria")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm">
                <option value="">Selecionar</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1 text-sm text-ink">Tipo de contrato
              <select value={f.tipo_contrato} onChange={set("tipo_contrato")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm">
                <option>Efetivo</option><option>Contrato a termo</option><option>Estágio</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">Prazo de candidatura
              <input type="date" value={f.prazo} onChange={set("prazo")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-ink">Descrição da função
            <textarea required rows={4} value={f.descricao} onChange={set("descricao")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm resize-none" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">Requisitos (um por linha)
            <textarea rows={3} value={f.requisitos} onChange={set("requisitos")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm resize-none" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">Email de contacto
            <input type="email" required value={f.contacto_email} onChange={set("contacto_email")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>

          {estado === "erro" && <span className="text-xs text-brick">Não foi possível publicar. Tenta novamente.</span>}

          <button disabled={estado === "enviando"} className="self-start text-sm font-semibold px-6 py-3 rounded-sm bg-ouro text-verde disabled:opacity-60">
            {estado === "enviando" ? "A publicar..." : "Submeter vaga"}
          </button>
        </form>
      </div>
    </div>
  );
}
