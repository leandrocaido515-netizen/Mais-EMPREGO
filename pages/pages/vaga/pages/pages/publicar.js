import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Publicar() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [organizacao, setOrganizacao] = useState('');
  const [provincia, setProvincia] = useState('');
  const [local, setLocal] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function publicarVaga(e) {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setMensagem('Precisas de iniciar sessão como empresa para publicar uma vaga.');
      setCarregando(false);
      return;
    }

    const { error } = await supabase.from('jobs').insert({
      empresa_id: user.id,
      titulo,
      organizacao,
      provincia,
      local,
      categoria,
      tipo_contrato: tipoContrato,
      descricao,
    });

    setCarregando(false);

    if (error) {
      setMensagem('Erro ao publicar: ' + error.message);
    } else {
      setMensagem('Vaga publicada com sucesso!');
      setTimeout(() => router.push('/'), 1200);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Publicar nova vaga</h2>

        <form onSubmit={publicarVaga}>
          <input
            type="text"
            placeholder="Título da vaga"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome da empresa/organização"
            value={organizacao}
            onChange={(e) => setOrganizacao(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Província"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
          />
          <input
            type="text"
            placeholder="Local (cidade/bairro)"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
          <input
            type="text"
            placeholder="Categoria (ex: Vendas, TI, Saúde)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tipo de contrato (ex: Full-time, Estágio)"
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
          />
          <textarea
            placeholder="Descrição da vaga"
            rows={6}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <button type="submit" className="btn" disabled={carregando}>
            {carregando ? 'A publicar...' : 'Publicar vaga'}
          </button>
        </form>

        {mensagem && <p style={{ marginTop: 10 }}>{mensagem}</p>}
      </div>
    </div>
  );
}
