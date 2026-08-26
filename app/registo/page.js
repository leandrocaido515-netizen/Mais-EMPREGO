"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { CATS, PROVINCIAS } from "@/lib/constants";

export default function Registo() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [f, setF] = useState({ tipo: "candidato", nome: "", email: "", senha: "", provincia: "", area_interesse: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const criar = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.senha });
    if (error) { setErro(error.message); setCarregando(false); return; }

    const userId = data.user?.id;
    if (userId) {
      const { error: perfilErro } = await supabase.from("profiles").insert({
        id: userId,
        tipo: f.tipo,
        nome: f.nome,
        email: f.email,
        provincia: f.provincia || null,
        area_interesse: f.area_interesse || null,
      });
      if (perfilErro) { setErro(perfilErro.message); setCarregando(false); return; }
    }

    setCarregando(false);
    router.push(f.tipo === "candidato" ? "/perfil" : "/");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-5 py-14">
        <h1 className="text-2xl font-semibold font-display text-ink">Criar conta</h1>
        <p className="text-sm mt-1 mb-8 text-musgo">Junta-te ao +Emprego como candidato ou empresa.</p>

        <form onSubmit={criar} className="bg-white rounded-sm p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex gap-4">
            {["candidato", "empresa"].map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm capitalize text-ink">
                <input type="radio" name="tipo" checked={f.tipo === t} onChange={() => setF({ ...f, tipo: t })} /> {t}
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-1 text-sm text-ink">
            {f.tipo === "candidato" ? "Nome completo" : "Nome da empresa/organização"}
            <input required value={f.nome} onChange={set("nome")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Email
            <input type="email" required value={f.email} onChange={set("email")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Palavra-passe
            <input type="password" required minLength={6} value={f.senha} onChange={set("senha")} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>

          {f.tipo === "candidato" && (
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
          )}

          {erro && <span className="text-xs text-brick">{erro}</span>}

          <button disabled={carregando} className="text-sm font-semibold px-6 py-3 rounded-sm bg-ouro text-verde disabled:opacity-60">
            {carregando ? "A criar conta..." : "Criar conta"}
          </button>
          <Link href="/login" className="text-sm text-brick">Já tenho conta — entrar</Link>
        </form>
        <p className="text-xs mt-4 text-musgo">
          Consoante a configuração do teu projeto Supabase, pode ser necessário confirmar o email antes de entrar.
        </p>
      </div>
    </div>
  );
}
