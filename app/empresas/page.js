"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../lib/supabaseClient";

export default function Nav() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setUser(profile);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-verde">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-sm font-bold text-sm bg-ouro text-verde font-display">+</span>
          <span className="text-lg text-paper font-display font-semibold">Emprego</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-paper/80">
          <Link href="/vagas">Vagas</Link>
          <Link href="/empresas">Empresas</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/perfil" className="text-sm text-paper/90">{user.nome.split(" ")[0]}</Link>
              <button onClick={logout} className="text-sm text-paper/60">Sair</button>
            </>
          ) : (
            <Link href="/login" className="hidden sm:inline text-sm text-paper/85">Entrar</Link>
          )}
          <Link href="/publicar" className="text-sm font-semibold px-4 py-2 rounded-sm bg-ouro text-verde">
            Publicar vaga
          </Link>
        </div>
      </div>
    </header>
  );
}
