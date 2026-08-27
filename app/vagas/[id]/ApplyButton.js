"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseClient";

export default function ApplyButton({ jobId }) {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [estado, setEstado] = useState("idle");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: existente } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("candidato_id", data.user.id)
        .maybeSingle();
      if (existente) setEstado("ja_candidatado");
    });
  }, [jobId]);

  const candidatar = async () => {
    if (!userId) {
      router.push(`/login?next=/vagas/${jobId}`);
      return;
    }
    setEstado("enviando");
    const { error } = await supabase.from("applications").insert({ job_id: jobId, candidato_id: userId });
    setEstado(error ? "erro" : "enviado");
  };

  if (estado === "enviado" || estado === "ja_candidatado") {
    return <span className="text-sm font-semibold px-5 py-3 rounded-sm bg-[#EAF2E9] text-[#2E5A3C]">✓ Candidatura enviada</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={candidatar}
        disabled={estado === "enviando"}
        className="text-sm font-semibold px-6 py-3 rounded-sm bg-brick text-paper disabled:opacity-60"
      >
        {estado === "enviando" ? "A enviar..." : userId ? "Candidatar-me" : "Entrar para candidatar-me"}
      </button>
      {estado === "erro" && <span className="text-xs text-brick">Não foi possível enviar. Tenta novamente.</span>}
    </div>
  );
}
