import { useEffect, useState, type FormEvent } from 'react';

import { API_URL, Icone, lerAluno } from './lib/sgu';
import Aulas from './pages/Aulas';
import Avisos from './pages/Avisos';
import Boletim from './pages/Boletim';
import Disciplinas from './pages/Disciplinas';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';

type Tema = 'light' | 'dark';

type AlunoLogin = {
  id: number;
  nome: string;
  matricula: string;
  email?: string;
  curso?: string;
  semestre?: number;
};

const MATRICULA_TESTE = '202410001';

function lerTema(): Tema {
  try {
    const tema = localStorage.getItem('sgu-theme');
    if (tema === 'dark' || tema === 'light') return tema;
  } catch {
    // O tema do sistema é usado quando o armazenamento não está disponível.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'dark');
  document.documentElement.dataset.theme = tema;
}

function validarAluno(dados: unknown): dados is AlunoLogin {
  return (
    typeof dados === 'object' &&
    dados !== null &&
    'id' in dados &&
    typeof dados.id === 'number' &&
    'nome' in dados &&
    typeof dados.nome === 'string' &&
    'matricula' in dados &&
    typeof dados.matricula === 'string'
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [matricula, setMatricula] = useState('');
  const [erro, setErro] = useState('');
  const [mensagemRecuperacao, setMensagemRecuperacao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tema, setTema] = useState<Tema>(lerTema);
  const claro = tema === 'light';

  useEffect(() => {
    aplicarTema(tema);
    try {
      localStorage.setItem('sgu-theme', tema);
    } catch {
      // O tema continua aplicado nesta sessão.
    }
  }, [tema]);

  async function handleLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const matriculaLimpa = matricula.trim();

    if (!matriculaLimpa) {
      setErro('Informe sua matrícula para continuar.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch(
        `${API_URL}/api/alunos/${encodeURIComponent(matriculaLimpa)}`
      );
      const dados: unknown = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        const detalhe =
          typeof dados === 'object' &&
          dados !== null &&
          'erro' in dados &&
          typeof dados.erro === 'string'
            ? dados.erro
            : 'Não foi possível realizar o acesso.';
        throw new Error(
          resposta.status === 404 ? 'Matrícula não encontrada.' : detalhe
        );
      }

      if (!validarAluno(dados)) {
        throw new Error('O servidor retornou dados inválidos para o aluno.');
      }

      localStorage.setItem('aluno', JSON.stringify(dados));
      window.location.hash = '#inicio';
      onLogin();
    } catch (error) {
      setErro(
        error instanceof TypeError
          ? 'Não foi possível conectar ao servidor.'
          : error instanceof Error
            ? error.message
            : 'Erro inesperado ao entrar.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className={`min-h-screen ${
        claro ? 'bg-[#E3E6DE]' : 'bg-[#0A1410]'
      }`}
    >
      <main
        className={`relative mx-auto flex min-h-screen w-full max-w-97.5 items-center justify-center px-5 py-10 ${
          claro ? 'bg-[#F6F7F2]' : 'bg-[#0F1A15]'
        }`}
      >
        <button
          type="button"
          onClick={() => setTema(claro ? 'dark' : 'light')}
          aria-label="Alternar tema"
          className={`absolute right-5 top-4 grid size-10.5 place-items-center rounded-full ${
            claro
              ? 'bg-[#E2EDDC] text-[#14402F]'
              : 'bg-[#24402F] text-[#E6F0EA]'
          }`}
        >
          <Icone nome={claro ? 'moon' : 'sun'} />
        </button>

        <section className="w-full max-w-87.5 pt-8">
        <div
          className={`rounded-[30px] px-6 py-7.5 text-center shadow-[0_10px_30px_rgba(20,64,47,.12)] ${
            claro ? 'bg-white' : 'bg-[#1A2A23]'
          }`}
        >
          <div
            className={`mx-auto mb-4.5 grid size-15.5 place-items-center rounded-full ${
              claro
                ? 'bg-[#E2EDDC] text-[#14402F]'
                : 'bg-[#24402F] text-[#E6F0EA]'
            }`}
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

          <h1
            className={`text-[26px] font-bold leading-tight ${
              claro ? 'text-[#17382B]' : 'text-[#E6F0EA]'
            }`}
          >
            Bem-vindo de volta
          </h1>
          <p
            className={`mb-0 mt-1.5 text-sm ${
              claro ? 'text-[#5E6F66]' : 'text-[#93A89C]'
            }`}
          >
            Acesse sua conta para continuar
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-6.5 space-y-4 text-left"
            noValidate
          >
            <div>
              <label
                htmlFor="matricula"
                className={`mb-2 block text-sm font-semibold ${
                  claro ? 'text-[#17382B]' : 'text-[#E6F0EA]'
                }`}
              >
                Matrícula
              </label>
              <input
                id="matricula"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={matricula}
                onChange={(evento) => {
                  setMatricula(evento.target.value);
                  if (erro) setErro('');
                  if (mensagemRecuperacao) setMensagemRecuperacao('');
                }}
                placeholder="Ex: 202410001"
                disabled={carregando}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? 'erro-login' : undefined}
                className={`w-full rounded-[14px] border-[1.5px] p-4 text-base outline-none focus:border-[#6F9468] focus:ring-4 focus:ring-[#6F9468]/30 disabled:opacity-60 ${
                  claro
                    ? 'border-[#E3E6DE] bg-[#F6F7F2] text-[#17382B] placeholder:text-[#8A978F]'
                    : 'border-[#2A3B33] bg-[#0F1A15] text-[#E6F0EA] placeholder:text-[#7F948A]'
                }`}
              />
              {erro && (
                <p
                  id="erro-login"
                  role="alert"
                  className={`mt-2 text-sm ${
                    claro ? 'text-[#B3382C]' : 'text-[#F08A7E]'
                  }`}
                >
                  {erro}
                </p>
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

          <button
            type="button"
            onClick={() => {
              setErro('');
              setMensagemRecuperacao(
                'Procure a secretaria acadêmica para recuperar sua matrícula.'
              );
            }}
            className={`mt-5 text-sm underline ${
              claro ? 'text-[#14402F]' : 'text-[#7FB083]'
            }`}
          >
            Esqueceu a matrícula?
          </button>
          {mensagemRecuperacao && (
            <p
              role="status"
              className={`mt-2 text-sm ${
                claro ? 'text-[#5E6F66]' : 'text-[#93A89C]'
              }`}
            >
              {mensagemRecuperacao}
            </p>
          )}

          <div
            className={`mt-5 border-t pt-4 text-center ${
              claro ? 'border-[#E3E6DE]' : 'border-[#2A3B33]'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setMatricula(MATRICULA_TESTE);
                setErro('');
              }}
              disabled={carregando}
              className={`text-sm underline ${
                claro ? 'text-[#14402F]' : 'text-[#7FB083]'
              }`}
            >
              Preencher com a matrícula de teste
            </button>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}

function lerRota() {
  return window.location.hash.replace('#', '') || 'login';
}

export default function App() {
  const [rota, setRota] = useState(lerRota);
  const [aluno, setAluno] = useState(lerAluno);
  const concluirLogin = () => {
    setAluno(lerAluno());
    setRota('inicio');
  };

  useEffect(() => {
    const atualizarRota = () => {
      setRota(lerRota());
      setAluno(lerAluno());
    };
    window.addEventListener('hashchange', atualizarRota);
    aplicarTema(lerTema());

    return () => window.removeEventListener('hashchange', atualizarRota);
  }, []);

  if (rota !== 'login' && !aluno) return <Login onLogin={concluirLogin} />;

  switch (rota) {
    case 'inicio':
      return <Inicio />;
    case 'aula':
      return <Aulas />;
    case 'disciplinas':
      return <Disciplinas />;
    case 'boletim':
      return <Boletim />;
    case 'avisos':
      return <Avisos />;
    case 'perfil':
      return <Perfil />;
    case 'login':
      return <Login onLogin={concluirLogin} />;
    default:
      return <Inicio />;
  }
}
