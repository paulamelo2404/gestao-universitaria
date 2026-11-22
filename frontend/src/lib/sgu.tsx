import { useEffect, useState, type ReactNode } from 'react';

/* ============ API ============ */
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

/* Chave onde o login salva o aluno. CONFIRA no App.tsx se é esta mesma. */
export const ALUNO_KEY = 'aluno';
export const TEMA_KEY = 'sgu-theme';

export type Aluno = {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  semestre: number;
  createdAt?: string | null;
};
export type Disciplina = {
  id: number;
  nome?: string;
  professor?: string;
  sala?: string;
  bloco?: string;
  horario?: string;
};
export type Nota = {
  id: number;
  alunoId: number;
  disciplinaId: number;
  avaliacao: string;
  valor: number;
  peso: number;
  frequencia: number;
  disciplina?: Disciplina;
};
export type Aula = {
  id: number;
  disciplinaId: number;
  dataHora: string | null;
  sala?: string | null;
  disciplina?: Disciplina;
};
export type Aviso = {
  id: number;
  alunoId: number | null;
  titulo: string;
  mensagem?: string | null;
  lida: boolean;
  createdAt?: string | null;
};

class HttpError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function buscar<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, { signal });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new HttpError('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
  }
  if (!res.ok) throw new HttpError(`O servidor respondeu com erro (${res.status}).`, res.status);
  return (await res.json()) as T;
}

type Estado<T> = { estado: 'carregando' | 'ok' | 'erro'; dados: T | null; erro: string };

export function useApi<T>(path: string | null, opcoes?: { vazioEm404?: boolean }) {
  const [s, setS] = useState<Estado<T>>({ estado: 'carregando', dados: null, erro: '' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!path) return;
    const ctl = new AbortController();
    setS({ estado: 'carregando', dados: null, erro: '' });
    buscar<T>(path, ctl.signal)
      .then((dados) => setS({ estado: 'ok', dados, erro: '' }))
      .catch((e: unknown) => {
        if (ctl.signal.aborted) return;
        if (opcoes?.vazioEm404 && e instanceof HttpError && e.status === 404) {
          setS({ estado: 'ok', dados: null, erro: '' });
          return;
        }
        setS({ estado: 'erro', dados: null, erro: e instanceof Error ? e.message : 'Erro inesperado.' });
      });
    return () => ctl.abort();
  }, [path, tentativa]);

  return { ...s, recarregar: () => setTentativa((n) => n + 1) };
}

/* ============ sessão e tema ============ */
export function lerAluno(): Aluno | null {
  try {
    const bruto = localStorage.getItem(ALUNO_KEY);
    if (!bruto) return null;
    const obj = JSON.parse(bruto) as Aluno | { aluno: Aluno };
    const a = 'aluno' in obj ? obj.aluno : obj;
    return a && typeof a.id === 'number' ? a : null;
  } catch {
    return null;
  }
}

function alternarTema() {
  const r = document.documentElement;
  const escuro = !r.classList.contains('dark');
  r.classList.toggle('dark', escuro);
  r.dataset.theme = escuro ? 'dark' : 'light';
  try {
    localStorage.setItem(TEMA_KEY, escuro ? 'dark' : 'light');
  } catch {
    /* sem armazenamento: o tema vale só nesta sessão */
  }
}

export function sair() {
  try {
    localStorage.removeItem(ALUNO_KEY);
  } catch {
    /* ignora */
  }
  window.location.hash = '#login';
}

/* ============ utilitários ============ */
export const f1 = (x: number) => x.toFixed(1).replace('.', ',');
export const fData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
export const iniciais = (nome: string) => {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
};

export type GrupoDisciplina = {
  disciplina: Disciplina;
  notas: Nota[];
  pesoTotal: number;
  media: number | null;
  frequencia: number;
};

export function agruparPorDisciplina(notas: Nota[]): GrupoDisciplina[] {
  const m = new Map<number, { disciplina: Disciplina; notas: Nota[] }>();
  for (const n of notas) {
    const g = m.get(n.disciplinaId) ?? { disciplina: n.disciplina ?? { id: n.disciplinaId }, notas: [] };
    g.notas.push(n);
    m.set(n.disciplinaId, g);
  }
  return [...m.values()].map((g) => {
    const pesoTotal = g.notas.reduce((a, n) => a + n.peso, 0);
    const media = pesoTotal > 0 ? g.notas.reduce((a, n) => a + n.valor * n.peso, 0) / pesoTotal : null;
    const frequencia = Math.round(g.notas.reduce((a, n) => a + n.frequencia, 0) / g.notas.length);
    return { ...g, pesoTotal, media, frequencia };
  });
}

/* Inter, como no protótipo. Carregue-a no index.html (veja as instruções). */
export const FONTE = { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" } as const;

/* ============ estilos reutilizáveis (Tailwind) ============ */
export const cx = {
  card: 'rounded-[22px] bg-white p-[18px] shadow-[0_2px_8px_rgba(20,64,47,.08)] dark:bg-[#1A2A23] dark:shadow-none',
  titulo: 'mb-1 mt-5 text-[28px] font-bold leading-[1.15]',
  sub: 'm-0 text-sm text-[#5E6F66] dark:text-[#93A89C]',
  secao: 'mb-2.5 mt-6 text-[15px] font-semibold',
  mudo: 'text-[#5E6F66] dark:text-[#93A89C]',
  pill: 'rounded-full bg-[#E2EDDC] px-3.5 py-2.5 text-sm font-semibold text-[#14402F] transition hover:brightness-95 dark:bg-[#24402F] dark:text-[#E6F0EA]',
  tag: 'rounded-full bg-[#E2EDDC] px-2.5 py-1 text-xs font-bold text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]',
  tagGeral: 'rounded-full bg-[#E3E6DE] px-2.5 py-1 text-xs font-bold text-[#5E6F66] dark:bg-[#2A3B33] dark:text-[#93A89C]',
  linha: 'border-t border-[#E3E6DE] dark:border-[#2A3B33]',
};

/* ============ ícones ============ */
const ICONES = {
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </>
  ),
  out: <path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" />,
  cal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  book: <path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14" />,
  bell: <path d="M6 9a6 6 0 0112 0c0 6 2 7 2 8H4c0-1 2-2 2-8zM10 20a2 2 0 004 0" />,
};
type NomeIcone = keyof typeof ICONES;

export function Icone({ nome, className = 'h-[22px] w-[22px]' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`flex-none fill-none stroke-current ${className}`}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONES[nome]}
    </svg>
  );
}

/* ============ blocos de interface ============ */
export function Esqueleto({ altura }: { altura: number }) {
  return (
    <div
      className="mb-3 animate-pulse rounded-[18px] bg-[#E3E6DE] dark:bg-[#2A3B33]"
      style={{ height: altura }}
      aria-busy="true"
      aria-label="Carregando"
    />
  );
}

export function Caixa({ titulo, texto, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="rounded-[20px] border-[1.5px] border-dashed border-[#5E6F66] bg-white p-5 dark:border-[#93A89C] dark:bg-[#1A2A23]">
      <b className="mb-1 block text-base">{titulo}</b>
      <span className={`block text-sm leading-[1.45] ${cx.mudo}`}>{texto}</span>
      {children}
    </div>
  );
}

export function Erro({ texto, onRetry }: { texto: string; onRetry: () => void }) {
  return (
    <Caixa titulo="Não foi possível carregar" texto={texto}>
      <button type="button" onClick={onRetry} className={`mt-3 ${cx.pill}`}>
        Tentar novamente
      </button>
    </Caixa>
  );
}

export function SemSessao() {
  return (
    <div style={FONTE} className="mx-auto min-h-screen w-full max-w-[390px] bg-[#F6F7F2] px-5 pt-14 text-[#17382B] dark:bg-[#0F1A15] dark:text-[#E6F0EA]">
      <Caixa titulo="Sessão não iniciada" texto="Entre com sua matrícula para carregar os dados.">
        <a href="#login" className="mt-3 inline-block text-sm font-semibold underline">
          Ir para o login
        </a>
      </Caixa>
    </div>
  );
}

const ABAS: { rota: string; rotulo: string; icone: NomeIcone }[] = [
  { rota: 'inicio', rotulo: 'Início', icone: 'home' },
  { rota: 'aula', rotulo: 'Aulas', icone: 'cal' },
  { rota: 'disciplinas', rotulo: 'Disciplinas', icone: 'book' },
  { rota: 'boletim', rotulo: 'Boletim', icone: 'book' },
  { rota: 'avisos', rotulo: 'Avisos', icone: 'bell' },
];

const btnIcone =
  'grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-[#E2EDDC] text-[#14402F] transition active:scale-95 dark:bg-[#24402F] dark:text-[#E6F0EA]';

export function Shell({
  aluno,
  ativa,
  avisosNovos,
  children,
}: {
  aluno: Aluno;
  ativa: string;
  avisosNovos?: number | null;
  children: ReactNode;
}) {
  /* Se a tela não informar o total, o Shell busca, para o selo aparecer em todas as telas. */
  const contagem = useApi<Aviso[]>(avisosNovos === undefined ? `/api/avisos/${aluno.id}` : null);
  const novos =
    avisosNovos !== undefined
      ? avisosNovos
      : contagem.estado === 'ok' && contagem.dados
        ? contagem.dados.filter((a) => !a.lida).length
        : null;
  return (
    <div style={FONTE} className="min-h-screen bg-[#E3E6DE] text-[#17382B] antialiased dark:bg-[#0F1A15] dark:text-[#E6F0EA]">
      <main className="mx-auto min-h-screen w-full max-w-[390px] bg-[#F6F7F2] px-5 pb-28 pt-4 dark:bg-[#0F1A15]">
        <div className="flex items-center gap-3 rounded-[22px] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(20,64,47,.08)] dark:bg-[#1A2A23] dark:shadow-none">
          <a
            href="#perfil"
            aria-label="Perfil"
            className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-[#E2EDDC] text-sm font-bold text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]"
          >
            {iniciais(aluno.nome)}
          </a>
          <div className="min-w-0 flex-1">
            <b className="block truncate text-[17px]">Olá, {aluno.nome.split(' ')[0]}</b>
            <small className={`text-[13px] ${cx.mudo}`}>
              {aluno.semestre}º semestre de {aluno.curso}
            </small>
          </div>
          <button type="button" onClick={alternarTema} aria-label="Alternar tema" className={btnIcone}>
            <span className="dark:hidden">
              <Icone nome="moon" />
            </span>
            <span className="hidden dark:inline">
              <Icone nome="sun" />
            </span>
          </button>
          <button type="button" onClick={sair} aria-label="Sair" className={btnIcone}>
            <Icone nome="out" />
          </button>
        </div>
        {children}
      </main>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[390px] -translate-x-1/2 justify-around bg-white px-2 pb-5 pt-2.5 shadow-[0_-1px_0_rgba(20,64,47,.08)] dark:bg-[#1A2A23]"
      >
        {ABAS.map((a) => {
          const atual = a.rota === ativa;
          return (
            <a
              key={a.rota}
              href={`#${a.rota}`}
              aria-current={atual ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] leading-3 transition ${
                atual
                  ? 'bg-[#E2EDDC] font-bold text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]'
                  : 'font-medium text-[#5E6F66] hover:bg-[#E3E6DE] dark:text-[#93A89C] dark:hover:bg-[#2A3B33]'
              }`}
            >
              <Icone nome={a.icone} />
              {a.rotulo}
              {a.rota === 'avisos' && novos ? (
                <span className="absolute right-1 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#C0532F] px-1.5 text-[11px] font-bold text-white dark:bg-[#F0875E] dark:text-[#2A1308]">
                  {novos}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

/* ============ aula, ingresso e aviso (usados em mais de uma tela) ============ */
export const aulaFutura = (a: Aula | null | undefined) =>
  Boolean(a && a.dataHora && new Date(a.dataHora) > new Date());

export function Ingresso({ aula }: { aula: Aula }) {
  const d = aula.disciplina ?? { id: aula.disciplinaId };
  const entalhe =
    "before:absolute before:-top-3 before:h-[22px] before:w-[22px] before:rounded-full before:bg-[#F6F7F2] before:content-[''] " +
    "after:absolute after:-top-3 after:h-[22px] after:w-[22px] after:rounded-full after:bg-[#F6F7F2] after:content-[''] " +
    'before:-left-[33px] after:-right-[33px] dark:before:bg-[#0F1A15] dark:after:bg-[#0F1A15]';
  return (
    <section className="overflow-hidden rounded-[24px] bg-[#14402F] p-[22px] text-white dark:bg-[#1E5A42]">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[50px] font-bold leading-none tracking-[-0.02em]">{d.horario ?? ''}</div>
        <div className="max-w-[130px] text-right text-[15px] font-semibold leading-[1.35] text-[#F2A57D]">
          {aula.dataHora ? fData(aula.dataHora) : ''}
        </div>
      </div>
      <h2 className="mb-0.5 mt-5 text-2xl font-bold">{d.nome ?? 'Aula'}</h2>
      <p className="m-0 text-[15px] text-[#C9DDD0]">{d.professor ?? ''}</p>
      <div className={`relative mb-4 mt-5 border-t-2 border-dashed border-white/30 ${entalhe}`} />
      <div className="flex gap-14">
        <div>
          <span className="block text-[13px] text-[#C9DDD0]">Sala</span>
          <b className="text-[28px]">{aula.sala ?? d.sala ?? '—'}</b>
        </div>
        <div>
          <span className="block text-[13px] text-[#C9DDD0]">Bloco</span>
          <b className="text-[28px]">{d.bloco ?? '—'}</b>
        </div>
      </div>
    </section>
  );
}

export const porRecencia = (a: Aviso, b: Aviso) =>
  (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0) ||
  b.id - a.id;

export function CardAviso({ a }: { a: Aviso }) {
  const individual = a.alunoId !== null && a.alunoId !== undefined;
  return (
    <article className={`${cx.card} mb-3 !rounded-[18px] !p-4`}>
      <div className="flex items-center justify-between gap-2.5">
        <span className={individual ? cx.tag : cx.tagGeral}>{individual ? 'Individual' : 'Aviso geral'}</span>
        {!a.lida && <span className="text-[13px] font-semibold text-[#C0532F] dark:text-[#F0875E]">● Novo</span>}
      </div>
      <h3 className="mb-1.5 mt-3 text-[17px] font-bold">{a.titulo}</h3>
      {a.mensagem ? <p className={`mb-3 mt-0 text-sm leading-[1.45] ${cx.mudo}`}>{a.mensagem}</p> : null}
      <small className={`text-xs ${cx.mudo}`}>{a.createdAt ? fData(a.createdAt) : 'Sem data'}</small>
    </article>
  );
}
