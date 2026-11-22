import { CardAviso, Caixa, Erro, Esqueleto, SemSessao, Shell, cx, lerAluno, porRecencia, useApi, type Aviso } from '../lib/sgu';

export default function Avisos() {
  const aluno = lerAluno();
  const api = useApi<Aviso[]>(aluno ? `/api/avisos/${aluno.id}` : null);
  if (!aluno) return <SemSessao />;

  const lista = api.dados ? [...api.dados].sort(porRecencia) : [];
  const novos = lista.filter((a) => !a.lida).length;
  const subtitulo =
    api.estado !== 'ok' ? '\u00A0' : novos === 0 ? 'Tudo em dia' : `${novos} ${novos > 1 ? 'avisos novos' : 'aviso novo'}`;

  return (
    <Shell aluno={aluno} ativa="avisos" avisosNovos={api.estado === 'ok' ? novos : null}>
      <h1 className={cx.titulo}>Avisos</h1>
      <p className={cx.sub}>{subtitulo}</p>
      <div className={cx.secao}>Seus avisos</div>

      {api.estado === 'carregando' && (
        <>
          <Esqueleto altura={120} />
          <Esqueleto altura={120} />
          <Esqueleto altura={100} />
        </>
      )}
      {api.estado === 'erro' && <Erro texto={api.erro} onRetry={api.recarregar} />}
      {api.estado === 'ok' && lista.length === 0 && (
        <Caixa titulo="Nenhum aviso" texto="Você não tem avisos no momento." />
      )}
      {api.estado === 'ok' && lista.map((a) => <CardAviso key={a.id} a={a} />)}
    </Shell>
  );
}
