import {
  aulaFutura,
  Caixa,
  CardAviso,
  Erro,
  Esqueleto,
  f1,
  Ingresso,
  lerAluno,
  porRecencia,
  SemSessao,
  Shell,
  useApi,
  agruparPorDisciplina,
  cx,
  type Aula,
  type Aviso,
  type Nota,
} from '../lib/sgu';

export default function Inicio() {
  const aluno = lerAluno();
  const aulaApi = useApi<Aula | null>(
    aluno ? '/api/aulas/proxima' : null,
    { vazioEm404: true }
  );
  const notasApi = useApi<Nota[]>(aluno ? `/api/notas/${aluno.id}` : null);
  const avisosApi = useApi<Aviso[]>(aluno ? `/api/avisos/${aluno.id}` : null);

  if (!aluno) return <SemSessao />;

  const grupos = notasApi.dados ? agruparPorDisciplina(notasApi.dados) : [];
  const comMedia = grupos.filter((grupo) => grupo.media !== null);
  const mediaGeral = comMedia.length
    ? comMedia.reduce((total, grupo) => total + (grupo.media ?? 0), 0) /
      comMedia.length
    : null;
  const frequenciaGeral = grupos.length
    ? Math.round(
        grupos.reduce((total, grupo) => total + grupo.frequencia, 0) /
          grupos.length
      )
    : null;
  const avisos = avisosApi.dados ? [...avisosApi.dados].sort(porRecencia) : [];
  const avisosNovos =
    avisosApi.estado === 'ok' ? avisos.filter((aviso) => !aviso.lida).length : null;
  const aula = aulaApi.dados;

  return (
    <Shell aluno={aluno} ativa="inicio" avisosNovos={avisosNovos}>
      <h1 className={cx.titulo}>Início</h1>
      <p className={cx.sub}>Resumo da sua vida acadêmica</p>

      <div className={cx.secao}>Próxima aula</div>
      {aulaApi.estado === 'carregando' && <Esqueleto altura={160} />}
      {aulaApi.estado === 'erro' && (
        <Erro texto={aulaApi.erro} onRetry={aulaApi.recarregar} />
      )}
      {aulaApi.estado === 'ok' && aula && aulaFutura(aula) && (
        <Ingresso aula={aula} />
      )}
      {aulaApi.estado === 'ok' && (!aula || !aulaFutura(aula)) && (
        <Caixa
          titulo="Nenhuma aula futura cadastrada"
          texto="Quando uma nova aula for cadastrada, ela aparecerá aqui."
        />
      )}

      <div className="mt-4 grid grid-cols-3 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(20,64,47,.08)] dark:bg-[#1A2A23] dark:shadow-none">
        <div className="px-1.5 py-4 text-center">
          <b className="block text-2xl">
            {notasApi.estado === 'ok' && mediaGeral !== null ? f1(mediaGeral) : '—'}
          </b>
          <span className={`text-xs ${cx.mudo}`}>Média parcial</span>
        </div>
        <div className="border-l border-[#E3E6DE] px-1.5 py-4 text-center dark:border-[#2A3B33]">
          <b className="block text-2xl">
            {notasApi.estado === 'ok' && frequenciaGeral !== null
              ? `${frequenciaGeral}%`
              : '—'}
          </b>
          <span className={`text-xs ${cx.mudo}`}>Frequência</span>
        </div>
        <div className="border-l border-[#E3E6DE] px-1.5 py-4 text-center dark:border-[#2A3B33]">
          <b className="block text-2xl text-[#C0532F] dark:text-[#F0875E]">
            {avisosNovos ?? '—'}
          </b>
          <span className={`text-xs ${cx.mudo}`}>Avisos novos</span>
        </div>
      </div>

      {notasApi.estado === 'erro' && (
        <div className="mt-3">
          <Erro texto={notasApi.erro} onRetry={notasApi.recarregar} />
        </div>
      )}

      <a
        href="#disciplinas"
        className="mt-4 flex items-center justify-between rounded-[18px] bg-white p-4 font-semibold shadow-[0_2px_8px_rgba(20,64,47,.08)] transition active:scale-[.98] dark:bg-[#1A2A23] dark:shadow-none"
      >
        Minhas disciplinas
        <span aria-hidden="true">→</span>
      </a>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-[15px] font-semibold">Avisos recentes</h2>
        <a
          href="#avisos"
          className="text-sm font-medium text-[#14402F] underline dark:text-[#7FB083]"
        >
          Ver todos os avisos
        </a>
      </div>

      <div className="mt-2.5">
        {avisosApi.estado === 'carregando' && <Esqueleto altura={110} />}
        {avisosApi.estado === 'erro' && (
          <Erro texto={avisosApi.erro} onRetry={avisosApi.recarregar} />
        )}
        {avisosApi.estado === 'ok' && avisos.length === 0 && (
          <Caixa titulo="Nenhum aviso" texto="Você não tem avisos no momento." />
        )}
        {avisosApi.estado === 'ok' && avisos[0] && <CardAviso a={avisos[0]} />}
      </div>
    </Shell>
  );
}
