import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import Aulas from './pages/Aulas';
import Boletim from './pages/Boletim';
import Avisos from './pages/Avisos';
import Disciplinas from './pages/Disciplinas';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';

type Aluno = {
  id: number;
  nome: string;
  matricula: string;
  email?: string;
  curso?: string;
  semestre?: number;
};

type Tema = 'light' | 'dark';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const MATRICULA_TESTE = '202410001';

/* Mesma chave e mesmos valores das outras telas, para o tema acompanhar o aluno. */
const lerTema = (): Tema => {
  const salvo = localStorage.getItem('sgu-theme');

  if (salvo === 'dark' || salvo === 'light') {
    return salvo;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/* As telas internas usam o variant dark: do Tailwind, que lê a classe "dark" no <html>. */
const aplicarTema = (t: Tema) => {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.dataset.theme = t;
};

const lerRota = () => window.location.hash.replace('#', '') || 'login';

const temAlunoSalvo = () => Boolean(localStorage.getItem('aluno'));

/* Cores por tema. As classes ficam escritas por extenso para o Tailwind encontrá-las. */
const paletas = {
  claro: {
    fundo: 'bg-[#F6F7F2]',
    card: 'bg-white',
    titulo: 'text-[#17382B]',
    texto: 'text-[#5E6F66]',
    campo:
      'bg-[#F6F7F2] border-[#E3E6DE] text-[#17382B] placeholder:text-[#8A978F]',
    suave: 'bg-[#E2EDDC] text-[#14402F]',
    link: 'text-[#14402F]',
    divisor: 'border-[#E3E6DE]',
    erro: 'text-[#B3382C]',
  },
  escuro: {
    fundo: 'bg-[#17231D]',
    card: 'bg-[#24352B]',
    titulo: 'text-[#E6F0EA]',
    texto: 'text-[#A9BDB1]',
    campo:
      'bg-[#17231D] border-[#344F3C] text-[#E6F0EA] placeholder:text-[#7F948A]',
    suave: 'bg-[#344F3C] text-[#E2EDDC]',
    link: 'text-[#9CC7A5]',
    divisor: 'border-[#344F3C]',
    erro: 'text-[#F08A7E]',
  },
} as const;

function Login() {
  const [matricula, setMatricula] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tema, setTema] = useState<Tema>(lerTema);

  const temaClaro = tema === 'light';
  const p = temaClaro ? paletas.claro : paletas.escuro;

  const alternarTema = () => {
    const novoTema: Tema = temaClaro ? 'dark' : 'light';
    setTema(novoTema);
    localStorage.setItem('sgu-theme', novoTema);
    aplicarTema(novoTema);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const matriculaLimpa = matricula.trim();

    if (!matriculaLimpa) {
      setErro('Informe sua matrícula para continuar.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const response = await fetch(
        `${API_URL}/api/alunos/${encodeURIComponent(matriculaLimpa)}`
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Matrícula não encontrada.');
        }

        throw new Error(data?.erro || 'Não foi possível realizar o acesso.');
      }

      const aluno = data as Aluno;

      localStorage.setItem('aluno', JSON.stringify(aluno));

      window.location.hash = '#inicio';
    } catch (err) {
      if (err instanceof TypeError) {
        setErro('Não foi possível conectar ao servidor.');
      } else {
        setErro(err instanceof Error ? err.message : 'Erro inesperado.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-5 py-10 ${p.fundo}`}
    >
      <section className="w-full max-w-md">
        <div className={`rounded-[30px] p-8 shadow-lg ${p.card}`}>
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={alternarTema}
              aria-label="Alternar tema"
              className={`w-[42px] h-[42px] flex items-center justify-center rounded-full ${p.suave}`}
            >
              {temaClaro ? (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
                </svg>
              )}
            </button>
          </div>

          <div
            className={`mx-auto mb-5 flex h-[62px] w-[62px] items-center justify-center rounded-full ${p.suave}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 9l10-5 10 5-10 5z" />
              <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>
          </div>

          <h1 className={`text-3xl font-bold text-center ${p.titulo}`}>
            Bem-vindo de volta
          </h1>

          <p className={`text-center mt-2 mb-8 ${p.texto}`}>
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="matricula"
                className={`block mb-2 text-sm font-semibold ${p.titulo}`}
              >
                Matrícula
              </label>
              <input
                id="matricula"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={matricula}
                onChange={(e) => {
                  setMatricula(e.target.value);
                  if (erro) setErro('');
                }}
                placeholder="Ex: 202410001"
                disabled={carregando}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? 'erro-login' : undefined}
                className={`w-full rounded-[14px] border-[1.5px] p-4 text-base outline-none focus:border-[#6F9468] focus:ring-4 focus:ring-[#6F9468]/30 disabled:opacity-60 ${p.campo}`}
              />
              {erro && (
                <div
                  id="erro-login"
                  role="alert"
                  className={`mt-2 text-sm ${p.erro}`}
                >
                  {erro}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={carregando || !matricula.trim()}
              className="w-full rounded-2xl bg-[#F2A57D] py-4 font-bold text-[#3B1D0E] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className={`mt-5 border-t pt-4 text-center ${p.divisor}`}>
            <button
              type="button"
              onClick={() => {
                setMatricula(MATRICULA_TESTE);
                setErro('');
              }}
              disabled={carregando}
              className={`text-sm underline ${p.link}`}
            >
              Preencher com a matrícula de teste
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [rota, setRota] = useState(lerRota);

  useEffect(() => {
    const atualizarRota = () => setRota(lerRota());

    window.addEventListener('hashchange', atualizarRota);

    return () => window.removeEventListener('hashchange', atualizarRota);
  }, []);

  /* Aplica o tema salvo (classe "dark" no <html>) assim que o app abre. */
  useEffect(() => {
    aplicarTema(lerTema());
  }, []);

  /* Sem aluno salvo, qualquer rota interna volta para o login. */
  if (rota !== 'login' && !temAlunoSalvo()) {
    return <Login />;
  }

  switch (rota) {
    case 'inicio':
      return <Inicio />;

    case 'aula':
      return <Aulas />;

    case 'boletim':
      return <Boletim />;

    case 'disciplinas':
      return <Disciplinas />;

    case 'avisos':
      return <Avisos />;

    case 'perfil':
      return <Perfil />;

    case 'login':
      return <Login />;

    default:
      /* Rota desconhecida: volta para o início, em vez de mostrar o login. */
      return <Aulas />;
  }
}
