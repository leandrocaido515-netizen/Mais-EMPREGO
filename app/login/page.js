"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Login() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) { setErro("Email ou palavra-passe incorretos."); return; }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-5 py-14">
        <h1 className="text-2xl font-semibold font-display text-ink">Entrar</h1>
        <p className="text-sm mt-1 mb-8 text-musgo">Acede à tua conta de candidato ou empresa.</p>
        <form onSubmit={entrar} className="bg-white rounded-sm p-6 sm:p-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Palavra-passe
            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="border border-musgoLine rounded-sm px-3 py-2 text-sm" />
          </label>
          {erro && <span className="text-xs text-brick">{erro}</span>}
          <button disabled={carregando} className="text-sm font-semibold px-6 py-3 rounded-sm bg-ouro text-verde disabled:opacity-60">
            {carregando ? "A entrar..." : "Entrar"}
          </button>
          <Link href="/registo" className="text-sm text-brick">Ainda não tenho conta — criar</Link>
        </form>
      </div>
    </div>
  );
}
