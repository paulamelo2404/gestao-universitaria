import {
  Caixa, Erro, Esqueleto, SemSessao, Shell, agruparPorDisciplina, cx, f1, lerAluno, useApi,
  type GrupoDisciplina, type Nota,
} from '../lib/sgu';

function CardDisciplina({ g }: { g: GrupoDisciplina }) {
  return (
    <article className={`${cx.card} mb-3`}>
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="m-0 text-lg font-bold">{g.disciplina.nome ?? 'Disciplina'}</h3>
          <p className={`${cx.sub} mt-0.5`}>{g.disciplina.professor ?? ''}</p>
        </div>
        <div className="text-right text-[34px] font-bold leading-none">
          {g.media === null ? '—' : f1(g.media)}
          <small className={`mt-1 block text-xs font-medium ${cx.mudo}`}>Média parcial</small>
        </div>
      </div>
      <p className={`${cx.sub} mt-2.5`}>
        {[
          g.disciplina.sala && `Sala ${g.disciplina.sala}`,
          g.disciplina.bloco && `Bloco ${g.disciplina.bloco}`,
          g.disciplina.horario,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>

      <div className="mb-2 mt-4 flex justify-between text-sm font-medium">
        <span>Frequência</span>
        <b>{g.frequencia}%</b>
      </div>
      <div
        className="mb-3.5 h-2 rounded-full bg-[#E3E6DE] dark:bg-[#2A3B33]"
        role="progressbar"
        aria-label="Frequência"
        aria-valuenow={g.frequencia}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i className="block h-full rounded-full bg-[#6F9468] dark:bg-[#7FB083]" style={{ width: `${g.frequencia}%` }} />
      </div>

      <h4 className="mb-1.5 mt-[18px] text-[13px] font-bold text-[#14402F] dark:text-[#7FB083]">Avaliações</h4>
      {g.notas.map((n: Nota, i) => (
        <div key={n.id} className={`flex justify-between py-2.5 text-[15px] ${i > 0 ? cx.linha : ''}`}>
          <span>
            {n.avaliacao}
            <small className={`ml-1.5 text-xs ${cx.mudo}`}>peso {n.peso}</small>
          </span>
          <b>{f1(n.valor)}</b>
        </div>
      ))}
    </article>
  );
}

export default function Boletim() {
  const aluno = lerAluno();
  const api = useApi<Nota[]>(aluno ? `/api/notas/${aluno.id}` : null);
  if (!aluno) return <SemSessao />;

  const grupos = api.dados ? agruparPorDisciplina(api.dados) : [];
  const comMedia = grupos.filter((g) => g.media !== null);
  const mediaGeral = comMedia.length ? comMedia.reduce((a, g) => a + (g.media ?? 0), 0) / comMedia.length : null;
  const freqGeral = grupos.length ? Math.round(grupos.reduce((a, g) => a + g.frequencia, 0) / grupos.length) : null;

  return (
    <Shell aluno={aluno} ativa="boletim">
      <h1 className={cx.titulo}>Boletim</h1>
      <p className={cx.sub}>Notas e frequência por disciplina</p>

      <div className="mt-[18px]">
        {api.estado === 'carregando' && (
          <>
            <Esqueleto altura={96} />
            <Esqueleto altura={260} />
          </>
        )}
        {api.estado === 'erro' && <Erro texto={api.erro} onRetry={api.recarregar} />}
        {api.estado === 'ok' && grupos.length === 0 && (
          <Caixa titulo="Nenhuma avaliação lançada" texto="As notas aparecerão aqui quando forem registradas." />
        )}
        {api.estado === 'ok' && grupos.length > 0 && (
          <>
            <div className="grid grid-cols-2 rounded-[22px] bg-[#E2EDDC] p-[18px] dark:bg-[#24402F]">
              <div>
                <span className={`text-[13px] ${cx.mudo}`}>Média parcial</span>
                <b className="mt-0.5 block text-[34px]">{mediaGeral === null ? '—' : f1(mediaGeral)}</b>
              </div>
              <div className="border-l border-[#14402F]/20 pl-[18px] dark:border-[#E6F0EA]/20">
                <span className={`text-[13px] ${cx.mudo}`}>Frequência</span>
                <b className="mt-0.5 block text-[34px]">{freqGeral}%</b>
              </div>
            </div>

            <div className="mt-3.5">
              {grupos.map((g) => (
                <CardDisciplina key={g.disciplina.id} g={g} />
              ))}
            </div>

            <p className={`mx-1 mt-5 text-[13px] leading-normal ${cx.mudo}`}>
              Média ponderada pelo peso das avaliações.
              {grupos.map((g) => (
                <span key={g.disciplina.id} className="block">
                  {g.disciplina.nome ?? 'Disciplina'}: ({g.notas.map((n) => `${f1(n.valor)} × ${n.peso}`).join(' + ')}) ÷{' '}
                  {g.pesoTotal} = {g.media === null ? '—' : f1(g.media)}
                </span>
              ))}
              É um resultado parcial e pode mudar conforme novas avaliações forem lançadas.
            </p>
          </>
        )}
      </div>
    </Shell>
  );
}
