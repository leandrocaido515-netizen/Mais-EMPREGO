import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState('entrar'); // 'entrar' ou 'registar'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('candidato');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setCarregando(false);
    if (error) {
      setMensagem('Erro: ' + error.message);
    } else {
      router.push('/');
    }
  }

  async function registar(e) {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setCarregando(false);
      setMensagem('Erro: ' + error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: perfilError } = await supabase.from('profiles').insert({
        id: user.id,
        tipo,
        nome,
        email,
      });

      if (perfilError) {
        setMensagem('Conta criada, mas houve um erro no perfil: ' + perfilError.message);
      } else {
        setMensagem('Conta criada com sucesso! Verifica o teu email para confirmar.');
      }
    }
    setCarregando(false);
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</h2>

        <form onSubmit={modo === 'entrar' ? entrar : registar}>
          {modo === 'registar' && (
            <>
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="candidato">Sou candidato</option>
                <option value="empresa">Sou empresa</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn" disabled={carregando}>
            {carregando ? 'A processar...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {mensagem && <p style={{ marginTop: 10 }}>{mensagem}</p>}

        <p style={{ marginTop: 16 }}>
          {modo === 'entrar' ? (
            <>Não tens conta? <a onClick={() => setModo('registar')} style={{ color: '#2563eb', cursor: 'pointer' }}>Cria uma aqui</a></>
          ) : (
            <>Já tens conta? <a onClick={() => setModo('entrar')} style={{ color: '#2563eb', cursor: 'pointer' }}>Entra aqui</a></>
          )}
        </p>
      </div>
    </div>
  );
}
