import Dashboard from '../Dashboard';
import { lerAluno, SemSessao, Shell, useApi, type Aula } from '../lib/sgu';

export default function Inicio() {
  const aluno = lerAluno();
  const aulaApi = useApi<Aula | null>(aluno ? '/api/aulas/proxima' : null, {
    vazioEm404: true,
  });

  if (!aluno) return <SemSessao />;

  const aula = aulaApi.dados;
  const proximaAula =
    aula?.dataHora === null || !aula?.dataHora
      ? null
      : {
          dataHora: aula.dataHora,
          sala: aula.sala,
          disciplina: aula.disciplina
            ? { nome: aula.disciplina.nome ?? 'Disciplina' }
            : null,
        };

  return (
    <Shell aluno={aluno} ativa="inicio">
      <Dashboard
        aluno={aluno}
        proximaAula={proximaAula}
        carregandoProximaAula={aulaApi.estado === 'carregando'}
        erroProximaAula={aulaApi.estado === 'erro' ? aulaApi.erro : ''}
        onTentarNovamente={aulaApi.recarregar}
        onAbrirBoletim={() => {
          window.location.hash = '#boletim';
        }}
        onAbrirAvisos={() => {
          window.location.hash = '#avisos';
        }}
      />
    </Shell>
  );
}
