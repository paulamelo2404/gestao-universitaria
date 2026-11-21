
import { useEffect, useState, type FormEvent } from 'react';
import Dashboard from './Dashboard';

interface Aluno {
  id: number;
  nome: string;
  curso: string;
  semestre: number;
}

interface Aula {
  dataHora: string;
  sala?: string | null;
  disciplina?: {
    nome: string;
  } | null;
}

interface Nota {
  id: number;
  avaliacao: string;
  valor: number;
  frequencia: number;
  disciplina: {
    nome: string;
  };
}

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  createdAt: string;
}

type Tela = 'login' | 'dashboard' | 'boletim' | 'avisos';

function App() {
  const [matricula, setMatricula] = useState('');
  const [erro, setErro] = useState('');
  const [erroTela, setErroTela] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(false);

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [tela, setTela] = useState<Tela>('login');

  const [proximaAula, setProximaAula] = useState<Aula | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  // Busca a próxima aula quando o Dashboard é aberto.
  useEffect(() => {
    if (tela !== 'dashboard') return;

    const buscarProximaAula = async () => {
      try {
        const response = await fetch(
          'http://localhost:3333/api/aulas/proxima'
        );

        if (!response.ok) {
          throw new Error('Não foi possível buscar a próxima aula.');
        }

        const dados = await response.json();
        setProximaAula(dados);
      } catch {
        setProximaAula(null);
      }
    };

    buscarProximaAula();
  }, [tela]);

  // Mantém o login original e abre o Dashboard após o acesso.
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      const response = await fetch(
        `http://localhost:3333/api/alunos/${matricula}`
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || 'Matrícula não encontrada');
      }

      const dados = await response.json();

      const alunoLogado: Aluno = {
        id: dados.id,
        nome: dados.nome,
        curso: dados.curso,
        semestre: dados.semestre
      };

      localStorage.setItem('aluno', JSON.stringify(dados));

      setAluno(alunoLogado);
      setTela('dashboard');
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao conectar com o servidor'
      );
    } finally {
      setCarregando(false);
    }
  };

  // Abre o Boletim e busca as notas do aluno.
  const handleAbrirBoletim = async () => {
    if (!aluno) return;

    setCarregandoTela(true);
    setErroTela('');

    try {
      const response = await fetch(
        `http://localhost:3333/api/notas/${aluno.id}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível buscar suas notas.');
      }

      const dados = await response.json();
      setNotas(dados);
      setTela('boletim');
    } catch (err) {
      setErroTela(
        err instanceof Error ? err.message : 'Erro ao buscar notas.'
      );
    } finally {
      setCarregandoTela(false);
    }
  };

  // Abre Avisos e busca os comunicados do aluno.
  const handleAbrirAvisos = async () => {
    if (!aluno) return;

    setCarregandoTela(true);
    setErroTela('');

    try {
      const response = await fetch(
        `http://localhost:3333/api/avisos/${aluno.id}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível buscar os avisos.');
      }

      const dados = await response.json();
      setAvisos(dados);
      setTela('avisos');
    } catch (err) {
      setErroTela(
        err instanceof Error ? err.message : 'Erro ao buscar avisos.'
      );
    } finally {
      setCarregandoTela(false);
    }
  };

  // Volta para o Dashboard sem precisar fazer login novamente.
  const voltarDashboard = () => {
    setErroTela('');
    setTela('dashboard');
  };

  // Exibe o carregamento enquanto busca notas ou avisos.
  if (carregandoTela) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-gray-600">Carregando informações...</p>
      </main>
    );
  }

  // Tela de login.
  if (tela === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-700">JS</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta
            </h1>

            <p className="text-gray-500 mt-2">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matrícula
              </label>

              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ex: 202410001"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                required
                disabled={carregando}
              />
            </div>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-sm text-emerald-600 hover:underline">
              Esqueceu a matricula?
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Tela do Dashboard.
  if (tela === 'dashboard' && aluno) {
    return (
      <Dashboard
        aluno={aluno}
        proximaAula={proximaAula}
        onAbrirBoletim={handleAbrirBoletim}
        onAbrirAvisos={handleAbrirAvisos}
      />
    );
  }

  // Tela do Boletim.
  if (tela === 'boletim') {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={voltarDashboard}
            className="mb-6 text-emerald-700 font-medium hover:underline"
          >
            ← Voltar ao Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Meu Boletim
          </h1>

          {erroTela && (
            <p className="mb-4 text-red-600">{erroTela}</p>
          )}

          {notas.length > 0 ? (
            <div className="grid gap-4">
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <h2 className="font-semibold text-gray-900">
                    {nota.disciplina.nome}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Avaliação: {nota.avaliacao}
                  </p>

                  <p className="mt-1 text-gray-600">
                    Nota: {nota.valor}
                  </p>

                  <p className="mt-1 text-gray-600">
                    Frequência: {nota.frequencia}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Nenhuma nota disponível no momento.
            </p>
          )}
        </div>
      </main>
    );
  }

  // Tela de Avisos.
  if (tela === 'avisos') {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={voltarDashboard}
            className="mb-6 text-emerald-700 font-medium hover:underline"
          >
            ← Voltar ao Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Avisos acadêmicos
          </h1>

          {erroTela && (
            <p className="mb-4 text-red-600">{erroTela}</p>
          )}

          {avisos.length > 0 ? (
            <div className="grid gap-4">
              {avisos.map((aviso) => (
                <div
                  key={aviso.id}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <h2 className="font-semibold text-gray-900">
                    {aviso.titulo}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {aviso.mensagem}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {new Date(aviso.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Nenhum aviso disponível no momento.
            </p>
          )}
        </div>
      </main>
    );
  }

  return null;
}

export default App;
