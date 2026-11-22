import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/* Rotas atendidas pelo App.tsx. */
const ROTAS_DISPONIVEIS = ['inicio', 'aula', 'disciplinas', 'boletim', 'avisos', 'perfil'];
const ROTA_ATUAL = 'disciplinas';

type Aluno = {
  id: number;
  nome: string;
  matricula: string;
  email?: string;
  curso?: string;
  semestre?: number;
};

type Disciplina = {
  id?: number;
  nome?: string;
  professor?: string;
  sala?: string;
  bloco?: string;
  horario?: string;
};

type Nota = {
  id: number;
  alunoId: number;
  disciplinaId: number;
  avaliacao: string;
  valor: number;
  peso: number;
  frequencia: number;
  disciplina?: Disciplina;
};

type GrupoDisciplina = {
  disciplinaId: number;
  disciplina: Disciplina;
  notas: Nota[];
};

type Tema = 'light' | 'dark';

function obterAluno(): Aluno | null {
  try {
    const dados = localStorage.getItem('aluno');
    return dados ? (JSON.parse(dados) as Aluno) : null;
  } catch {
    return null;
  }
}

function obterTema(): Tema {
  const salvo = localStorage.getItem('sgu-theme');

  if (salvo === 'dark' || salvo === 'light') {
    return salvo;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);

  return (
    (partes[0]?.[0] || '') +
    (partes.length > 1 ? partes[partes.length - 1][0] : '')
  ).toUpperCase();
}

function formatarNota(valor: number): string {
  return Number(valor).toFixed(1).replace('.', ',');
}

function Icone({
  tipo,
}: {
  tipo: 'moon' | 'sun' | 'logout' | 'home' | 'calendar' | 'book' | 'bell';
}) {
  const paths = {
    moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
      </>
    ),
    logout: <path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" />,
    home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    book: (
      <path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14" />
    ),
    bell: (
      <path d="M6 9a6 6 0 0112 0c0 6 2 7 2 8H4c0-1 2-2 2-8zM10 20a2 2 0 004 0" />
    ),
  };

  return (
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
      {paths[tipo]}
    </svg>
  );
}

export default function Disciplinas() {
  const [aluno] = useState<Aluno | null>(() => obterAluno());

  const [notas, setNotas] = useState<Nota[]>([]);
  const [carregando, setCarregando] = useState(() => Boolean(obterAluno()));
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [tema, setTema] = useState<Tema>(() => obterTema());

  const claro = tema === 'light';

  // Mantém o tema salvo e sincronizado.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark');
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('sgu-theme', tema);
  }, [tema]);

  // Guarda o ID antes do efeito para evitar o erro de aluno nulo.
  const alunoId = aluno?.id;

  // Busca as avaliações do aluno. "tentativa" refaz a busca sem recarregar a página.
  useEffect(() => {
    if (alunoId === undefined) {
      return;
    }

    let ativo = true;

    async function buscarDisciplinas() {
      try {
        setCarregando(true);
        setErro('');

        const response = await fetch(`${API_URL}/api/notas/${alunoId}`);

        if (!response.ok) {
          throw new Error(
            `Não foi possível buscar o boletim (${response.status}).`
          );
        }

        const dados: unknown = await response.json();

        if (!Array.isArray(dados)) {
          throw new Error('Os dados recebidos da API são inválidos.');
        }

        if (ativo) {
          setNotas(dados as Nota[]);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof TypeError
              ? 'Não foi possível conectar ao servidor.'
              : error instanceof Error
                ? error.message
                : 'Erro ao conectar com o servidor.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void buscarDisciplinas();

    return () => {
      ativo = false;
    };
  }, [alunoId, tentativa]);

  function alternarTema() {
    setTema((atual) => (atual === 'light' ? 'dark' : 'light'));
  }

  function sair() {
    localStorage.removeItem('aluno');
    window.location.hash = '#login';
  }

  // Agrupa as avaliações por disciplina.
  const grupos = new Map<number, GrupoDisciplina>();

  notas.forEach((nota) => {
    const existente = grupos.get(nota.disciplinaId);

    if (existente) {
      existente.notas.push(nota);

      if (!existente.disciplina.nome && nota.disciplina?.nome) {
        existente.disciplina = nota.disciplina;
      }
    } else {
      grupos.set(nota.disciplinaId, {
        disciplinaId: nota.disciplinaId,
        disciplina: nota.disciplina || {},
        notas: [nota],
      });
    }
  });

  const listaDisciplinas = Array.from(grupos.values()).map((grupo) => {
    const pesoTotal = grupo.notas.reduce(
      (total, nota) => total + Number(nota.peso || 0),
      0
    );

    const somaNotas = grupo.notas.reduce(
      (total, nota) =>
        total + Number(nota.valor || 0) * Number(nota.peso || 0),
      0
    );

    // Sem peso lançado não há média: mostra "—" em vez de 0,0.
    const media: number | null = pesoTotal > 0 ? somaNotas / pesoTotal : null;

    const frequencia =
      grupo.notas.length > 0
        ? Math.round(
            grupo.notas.reduce(
              (total, nota) => total + Number(nota.frequencia || 0),
              0
            ) / grupo.notas.length
          )
        : 0;

    return {
      ...grupo,
      media,
      frequencia,
    };
  });

  const cor = {
    fundo: claro ? 'bg-[#F6F7F2]' : 'bg-[#0F1A15]',
    cartao: claro ? 'bg-white' : 'bg-[#1A2A23]',
    texto: claro ? 'text-[#17382B]' : 'text-[#E6F0EA]',
    secundario: claro ? 'text-[#5E6F66]' : 'text-[#93A89C]',
    suave: claro ? 'bg-[#E2EDDC]' : 'bg-[#24402F]',
    borda: claro ? 'border-[#E3E6DE]' : 'border-[#2A3B33]',
    verde: claro ? 'text-[#14402F]' : 'text-[#7FB083]',
    barra: claro ? 'bg-[#6F9468]' : 'bg-[#7FB083]',
  };

  if (!aluno) {
    return (
      <main
        className={`min-h-screen ${cor.fundo} flex items-center justify-center p-6`}
      >
        <div className={`${cor.cartao} rounded-[22px] p-6 w-full max-w-sm`}>
          <h1 className={`text-xl font-bold ${cor.texto}`}>
            Sessão não iniciada
          </h1>

          <p className={`text-sm mt-2 ${cor.secundario}`}>
            Entre com sua matrícula para consultar seu boletim.
          </p>

          <a
            href="#login"
            className={`inline-block mt-4 underline font-semibold ${cor.verde}`}
          >
            Ir para o login
          </a>
        </div>
      </main>
    );
  }

  const classeAvatar = `w-[42px] h-[42px] rounded-full ${cor.suave} flex items-center justify-center font-bold text-sm shrink-0 ${cor.texto}`;

  return (
    <main className={`min-h-screen ${cor.fundo} transition-colors duration-200`}>
      <div className="mx-auto w-full max-w-[390px] min-h-screen relative">
        <div className="px-5 pt-6 pb-32">
          {/* Cabeçalho */}
          <header
            className={`${cor.cartao} rounded-[22px] p-[10px_12px] flex items-center gap-3 shadow-sm`}
          >
            {ROTAS_DISPONIVEIS.includes('perfil') ? (
              <a href="#perfil" aria-label="Abrir perfil" className={classeAvatar}>
                {iniciais(aluno.nome)}
              </a>
            ) : (
              <div className={classeAvatar} aria-hidden="true">
                {iniciais(aluno.nome)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <strong className={`block text-[17px] ${cor.texto}`}>
                Olá, {aluno.nome.split(' ')[0]}
              </strong>

              <small className={`text-[13px] ${cor.secundario}`}>
                {aluno.semestre ? `${aluno.semestre}º semestre` : 'Área do aluno'}
                {aluno.curso ? ` de ${aluno.curso}` : ''}
              </small>
            </div>

            <button
              type="button"
              onClick={alternarTema}
              aria-label="Alternar tema"
              className={`w-[42px] h-[42px] rounded-full ${cor.suave} ${cor.texto} flex items-center justify-center shrink-0`}
            >
              <Icone tipo={claro ? 'moon' : 'sun'} />
            </button>

            <button
              type="button"
              onClick={sair}
              aria-label="Sair da conta"
              className={`w-[42px] h-[42px] rounded-full ${cor.suave} ${cor.texto} flex items-center justify-center shrink-0`}
            >
              <Icone tipo="logout" />
            </button>
          </header>

          {/* Título */}
          <h1 className={`text-[28px] font-bold leading-tight mt-5 ${cor.texto}`}>
            Disciplinas
          </h1>

          <p className={`text-sm mt-1 ${cor.secundario}`}>
            Disciplinas com avaliações lançadas
          </p>

          <h2 className={`text-[15px] font-semibold mt-6 mb-[10px] ${cor.texto}`}>
            Em curso
          </h2>

          {/* Carregamento */}
          {carregando && (
            <div className="space-y-3" aria-busy="true" aria-label="Carregando">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className={`${cor.cartao} rounded-[22px] p-[18px] animate-pulse`}
                >
                  <div className={`h-5 w-40 rounded ${cor.suave}`} />
                  <div className={`h-4 w-28 rounded mt-3 ${cor.suave}`} />
                  <div className={`h-4 w-full rounded mt-6 ${cor.suave}`} />
                </div>
              ))}
            </div>
          )}

          {/* Erro */}
          {!carregando && erro && (
            <div className={`${cor.cartao} rounded-[20px] p-5`} role="alert">
              <strong className="text-[#B3382C]">
                Não foi possível carregar o boletim
              </strong>

              <p className={`text-sm mt-2 ${cor.secundario}`}>{erro}</p>

              <button
                type="button"
                onClick={() => setTentativa((t) => t + 1)}
                className={`mt-4 text-sm font-semibold underline ${cor.verde}`}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Lista vazia */}
          {!carregando && !erro && listaDisciplinas.length === 0 && (
            <div
              className={`${cor.cartao} border border-dashed ${cor.borda} rounded-[20px] p-5`}
            >
              <strong className={`block text-base ${cor.texto}`}>
                Nenhuma avaliação lançada
              </strong>

              <span
                className={`block text-sm mt-1 leading-relaxed ${cor.secundario}`}
              >
                As notas aparecem aqui quando houver avaliações lançadas.
              </span>
            </div>
          )}

          {/* Cards das disciplinas */}
          {!carregando &&
            !erro &&
            listaDisciplinas.map((item) => (
              <article
                key={item.disciplinaId}
                className={`${cor.cartao} rounded-[22px] p-[18px] mb-3 shadow-sm`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className={`text-[18px] font-bold ${cor.texto}`}>
                      {item.disciplina.nome || 'Disciplina'}
                    </h3>

                  </div>

                  <div
                    className={`text-[30px] leading-none font-bold text-right ${cor.texto}`}
                  >
                    {item.media === null ? '—' : formatarNota(item.media)}
                    <small
                      className={`block text-xs font-medium mt-1 ${cor.secundario}`}
                    >
                      Média parcial
                    </small>
                  </div>
                </div>

                {/* Frequência */}
                <div className="flex justify-between text-sm mt-4 mb-2">
                  <span className={cor.texto}>Frequência</span>

                  <strong className={cor.texto}>{item.frequencia}%</strong>
                </div>

                <div
                  className={`relative h-2 rounded-full ${claro ? 'bg-[#E3E6DE]' : 'bg-[#2A3B33]'}`}
                  role="progressbar"
                  aria-label="Frequência"
                  aria-valuenow={item.frequencia}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full ${cor.barra}`}
                    style={{
                      width: `${Math.min(100, Math.max(0, item.frequencia))}%`,
                    }}
                  />
                </div>

                {/* Avaliações */}
                <div className={`mt-4 border-t ${cor.borda} pt-3`}>
                  <h4 className={`text-[13px] font-semibold mb-2 ${cor.verde}`}>
                    Avaliações
                  </h4>

                  {item.notas.map((nota) => (
                    <div
                      key={nota.id}
                      className={`flex justify-between items-center gap-3 py-[10px] border-b last:border-0 ${cor.borda} text-sm`}
                    >
                      <span className={cor.texto}>
                        {nota.avaliacao || 'Avaliação'}

                        <small className={`block text-xs mt-1 ${cor.secundario}`}>
                          Peso {nota.peso}
                        </small>
                      </span>

                      <strong className={cor.texto}>
                        {formatarNota(nota.valor)}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
        </div>

        {/* Navegação inferior (acompanha a largura do conteúdo) */}
        <nav
          aria-label="Navegação principal"
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-20 ${cor.cartao} border-t ${cor.borda} flex justify-around px-2 pt-2 pb-5 shadow-sm`}
        >
          {[
            { rota: 'inicio', nome: 'Início', icone: 'home' as const },
            { rota: 'aula', nome: 'Aulas', icone: 'calendar' as const },
            { rota: 'disciplinas', nome: 'Disciplinas', icone: 'book' as const },
            { rota: 'boletim', nome: 'Boletim', icone: 'book' as const },
            { rota: 'avisos', nome: 'Avisos', icone: 'bell' as const },
          ].map((item) => {
            const ativo = item.rota === ROTA_ATUAL;
            const disponivel = ROTAS_DISPONIVEIS.includes(item.rota);

            const classe = `flex flex-1 flex-col items-center gap-1 text-[10px] leading-3 font-medium px-1 py-2 rounded-2xl ${
              ativo ? `${cor.suave} ${cor.texto} font-bold` : cor.secundario
            }`;

            if (!disponivel) {
              return (
                <span
                  key={item.rota}
                  aria-disabled="true"
                  title="Em breve"
                  className={`${classe} opacity-50 cursor-not-allowed`}
                >
                  <Icone tipo={item.icone} />
                  {item.nome}
                </span>
              );
            }

            return (
              <a
                key={item.rota}
                href={`#${item.rota}`}
                aria-current={ativo ? 'page' : undefined}
                className={classe}
              >
                <Icone tipo={item.icone} />
                {item.nome}
              </a>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
