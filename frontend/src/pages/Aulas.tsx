import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/* Rotas atendidas pelo App.tsx. */
const ROTAS_DISPONIVEIS = ['inicio', 'aula', 'disciplinas', 'boletim', 'avisos', 'perfil'];
const ROTA_ATUAL = 'aula';

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

type Aula = {
  id: number;
  disciplinaId: number;
  dataHora: string;
  sala?: string;
  disciplina?: Disciplina;
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

function formatarData(data: string): string {
  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return 'Data não informada';
  }

  return valor.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);

  return (
    (partes[0]?.[0] || '') +
    (partes.length > 1 ? partes[partes.length - 1][0] : '')
  ).toUpperCase();
}

function Icone({
  tipo,
}: {
  tipo: 'moon' | 'sun' | 'logout' | 'home' | 'calendar' | 'book' | 'chart' | 'bell';
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
    chart: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" />,
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

export default function Aulas() {
  const [aluno] = useState<Aluno | null>(() => obterAluno());

  const [aula, setAula] = useState<Aula | null>(null);
  const [aulaFutura, setAulaFutura] = useState(false);

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

  // Busca a aula na API. "tentativa" refaz a busca sem recarregar a página.
  useEffect(() => {
    if (!aluno) {
      return;
    }

    let ativo = true;

    async function buscarAula() {
      try {
        setCarregando(true);
        setErro('');

        const response = await fetch(`${API_URL}/api/aulas/proxima`);

        // 404 aqui significa "nenhuma aula cadastrada", não uma falha.
        if (response.status === 404) {
          if (ativo) {
            setAula(null);
            setAulaFutura(false);
          }

          return;
        }

        if (!response.ok) {
          throw new Error(
            `Não foi possível buscar a aula (${response.status}).`
          );
        }

        const dados: Aula | null = await response.json();

        if (!dados) {
          if (ativo) {
            setAula(null);
            setAulaFutura(false);
          }

          return;
        }

        const dataAula = new Date(dados.dataHora);

        if (Number.isNaN(dataAula.getTime())) {
          throw new Error('A data da aula recebida é inválida.');
        }

        if (ativo) {
          setAula(dados);
          setAulaFutura(dataAula.getTime() > Date.now());
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

    void buscarAula();

    return () => {
      ativo = false;
    };
  }, [aluno, tentativa]);

  function alternarTema() {
    setTema((atual) => (atual === 'light' ? 'dark' : 'light'));
  }

  function sair() {
    localStorage.removeItem('aluno');
    window.location.hash = '#login';
  }

  const cor = {
    fundo: claro ? 'bg-[#F6F7F2]' : 'bg-[#0F1A15]',
    cartao: claro ? 'bg-white' : 'bg-[#1A2A23]',
    texto: claro ? 'text-[#17382B]' : 'text-[#E6F0EA]',
    secundario: claro ? 'text-[#5E6F66]' : 'text-[#93A89C]',
    suave: claro ? 'bg-[#E2EDDC]' : 'bg-[#24402F]',
    borda: claro ? 'border-[#E3E6DE]' : 'border-[#2A3B33]',
    verde: claro ? 'text-[#14402F]' : 'text-[#7FB083]',
  };

  const disciplina = aula?.disciplina;

  const horario =
    disciplina?.horario ||
    (aula?.dataHora
      ? new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—');

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
            Entre com sua matrícula para consultar suas aulas.
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
    <div
      className={`min-h-screen ${
        claro
          ? 'bg-[#E3E6DE] text-[#17382B]'
          : 'bg-[#0F1A15] text-[#E6F0EA]'
      }`}
    >
      <main
        className={`relative mx-auto min-h-screen w-full max-w-[390px] transition-colors duration-200 ${cor.fundo}`}
      >
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
            Aulas
          </h1>

          <p className={`text-sm mt-1 ${cor.secundario}`}>
            Próxima aula e último registro
          </p>

          <h2 className={`text-[15px] font-semibold mt-6 mb-[10px] ${cor.texto}`}>
            Próxima aula
          </h2>

          {/* Carregamento */}
          {carregando && (
            <div
              className={`${cor.cartao} rounded-[24px] p-[22px] animate-pulse`}
              aria-busy="true"
              aria-label="Carregando"
            >
              <div className={`h-12 w-28 rounded ${cor.suave}`} />
              <div className={`h-6 w-48 rounded mt-5 ${cor.suave}`} />
              <div className={`h-4 w-32 rounded mt-3 ${cor.suave}`} />
              <div className={`h-10 w-full rounded mt-6 ${cor.suave}`} />
            </div>
          )}

          {/* Erro */}
          {!carregando && erro && (
            <div className={`${cor.cartao} rounded-[20px] p-5`} role="alert">
              <strong className="text-[#B3382C]">
                Não foi possível carregar as aulas
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

          {/* Próxima aula */}
          {!carregando && !erro && aula && aulaFutura && (
            <section className="bg-[#14402F] text-white rounded-[24px] p-[22px] overflow-hidden">
              <div className="flex justify-between items-start gap-3">
                <strong className="text-[50px] leading-none tracking-tight">
                  {horario}
                </strong>

                <span className="text-[#F2A57D] font-semibold text-right text-[15px] leading-snug max-w-[130px]">
                  {formatarData(aula.dataHora)}
                </span>
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {disciplina?.nome || 'Aula'}
              </h2>

              <p className="text-[#C9DDD0] text-[15px] mt-1">
                {disciplina?.professor || ''}
              </p>

              <div className="border-t-2 border-dashed border-white/30 my-5" />

              <div className="flex gap-14">
                <div>
                  <span className="block text-[13px] text-[#C9DDD0]">Sala</span>

                  <strong className="text-[28px]">
                    {aula.sala || disciplina?.sala || '—'}
                  </strong>
                </div>

                <div>
                  <span className="block text-[13px] text-[#C9DDD0]">Bloco</span>

                  <strong className="text-[28px]">
                    {disciplina?.bloco || '—'}
                  </strong>
                </div>
              </div>
            </section>
          )}

          {/* Sem aula futura */}
          {!carregando && !erro && (!aula || !aulaFutura) && (
            <div
              className={`${cor.cartao} border border-dashed ${cor.borda} rounded-[20px] p-5`}
            >
              <strong className={`block text-base ${cor.texto}`}>
                Nenhuma aula futura cadastrada
              </strong>

              <span
                className={`block text-sm mt-1 leading-relaxed ${cor.secundario}`}
              >
                Quando uma nova aula for cadastrada, ela aparecerá aqui.
              </span>
            </div>
          )}

          {/* Último registro */}
          {!carregando && !erro && aula && !aulaFutura && (
            <>
              <h2 className={`text-[15px] font-semibold mt-6 mb-3 ${cor.texto}`}>
                Último registro retornado pela API
              </h2>

              <article className={`${cor.cartao} rounded-[22px] p-[18px] shadow-sm`}>
                <div className="flex justify-between items-center gap-3">
                  <h3 className={`text-lg font-bold ${cor.texto}`}>
                    {disciplina?.nome || 'Aula'}
                  </h3>

                  <span
                    className={`${cor.suave} ${cor.secundario} rounded-full px-3 py-1 text-xs font-bold`}
                  >
                    Já realizada
                  </span>
                </div>

                <p className={`text-sm mt-1 ${cor.secundario}`}>
                  {disciplina?.professor || ''}
                </p>

                <div className={`mt-4 border-t ${cor.borda}`}>
                  {[
                    ['Data', formatarData(aula.dataHora)],
                    ['Horário', horario],
                    ['Sala', aula.sala || disciplina?.sala || '—'],
                    ['Bloco', disciplina?.bloco || '—'],
                  ].map(([nome, valor]) => (
                    <div
                      key={nome}
                      className={`flex justify-between gap-3 py-3 border-b last:border-0 ${cor.borda} text-sm`}
                    >
                      <span className={cor.secundario}>{nome}</span>
                      <strong className={cor.texto}>{valor}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </>
          )}
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
            { rota: 'boletim', nome: 'Boletim', icone: 'chart' as const },
            { rota: 'avisos', nome: 'Avisos', icone: 'bell' as const },
          ].map((item) => {
            const ativo = item.rota === ROTA_ATUAL;
            const disponivel = ROTAS_DISPONIVEIS.includes(item.rota);

            const classe = `relative flex flex-1 flex-col items-center gap-1 text-[10px] leading-3 font-medium px-1 py-2 rounded-2xl ${
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
      </main>
    </div>
  );
}
