import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarVagas() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setVagas(data);
      setLoading(false);
    }
    carregarVagas();
  }, []);

  return (
    <div>
      <nav>
        <strong>+EMPREGO</strong>
        <div>
          <Link href="/login" className="btn" style={{ marginRight: 8 }}>Entrar</Link>
          <Link href="/publicar" className="btn">Publicar vaga</Link>
        </div>
      </nav>

      <div className="container">
        <h2>Vagas disponíveis</h2>

        {loading && <p>A carregar...</p>}
        {!loading && vagas.length === 0 && <p>Ainda não há vagas publicadas.</p>}

        {vagas.map((vaga) => (
          <Link href={`/vaga/${vaga.id}`} key={vaga.id}>
            <div className="card">
              <h3>{vaga.titulo}</h3>
              <p>{vaga.organizacao}</p>
              <p>{vaga.local} · {vaga.tipo_contrato}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
