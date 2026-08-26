import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function DetalheVaga() {
  const router = useRouter();
  const { id } = router.query;

  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!id) return;

    async function carregarVaga() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setVaga(data);
      setLoading(false);
    }
    carregarVaga();
  }, [id]);

  async function candidatar() {
    setMensagem('');

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setMensagem('Precisas de iniciar sessão para te candidatares.');
      return;
    }

    const { error } = await supabase.from('applications').insert({
      job_id: id,
      candidato_id: user.id,
      estado: 'pendente',
    });

    if (error) {
      setMensagem('Erro ao candidatar: ' + error.message);
    } else {
      setMensagem('Candidatura enviada com sucesso!');
    }
  }

  if (loading) return <div className="container"><p>A carregar...</p></div>;
  if (!vaga) return <div className="container"><p>Vaga não encontrada.</p></div>;

  return (
    <div className="container">
      <div className="card">
        <h2>{vaga.titulo}</h2>
        <p><strong>{vaga.organizacao}</strong></p>
        <p>{vaga.local} · {vaga.provincia} · {vaga.tipo_contrato}</p>
        <p>{vaga.categoria}</p>

        <h3 style={{ marginTop: 16 }}>Descrição</h3>
        <p>{vaga.descricao}</p>

        <button className="btn" style={{ marginTop: 16 }} onClick={candidatar}>
          Candidatar-me
        </button>

        {mensagem && <p style={{ marginTop: 10 }}>{mensagem}</p>}
      </div>
    </div>
  );
    }
