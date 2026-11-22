

import Atalhos from './Atalhos';

interface DashboardProps {
  aluno: {
    nome: string;
    curso: string;
    semestre: number;
  };
  proximaAula?: {
    dataHora: string;
    sala?: string | null;
    disciplina?: {
      nome: string;
    } | null;
  } | null;
  onAbrirBoletim: () => void;
  onAbrirAvisos: () => void;
  carregandoProximaAula?: boolean;
  erroProximaAula?: string;
  onTentarNovamente?: () => void;
}

function Dashboard({
  aluno,
  proximaAula,
  onAbrirBoletim,
  onAbrirAvisos,
  carregandoProximaAula = false,
  erroProximaAula = '',
  onTentarNovamente,
}: DashboardProps) {
  return (
  <div className="space-y-6 py-5">
    <header>
      <p className="text-sm text-gray-500 dark:text-[#93A89C]">
        Sistema de Gestão Universitária
      </p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-[#E6F0EA]">
        Minha vida acadêmica
      </h1>
      <p className="mt-1 text-gray-500 dark:text-[#93A89C]">
        Bem-vindo(a) ao seu ambiente acadêmico.
      </p>
    </header>

    <section className="rounded-2xl bg-emerald-700 p-6 text-white">
      <p className="text-sm text-emerald-100">Meu curso</p>
      <h2 className="mt-2 text-xl font-semibold">{aluno.curso}</h2>
      <p className="mt-2 text-sm text-emerald-100">
        {aluno.semestre}º semestre
      </p>
    </section>

    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-[#E6F0EA]">
        Visão geral
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#2A3B33] dark:bg-[#1A2A23]">
          <p className="text-sm text-gray-500 dark:text-[#93A89C]">Curso</p>
          <p className="mt-2 font-semibold text-gray-900 dark:text-[#E6F0EA]">
            {aluno.curso}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#2A3B33] dark:bg-[#1A2A23]">
          <p className="text-sm text-gray-500 dark:text-[#93A89C]">
            Semestre atual
          </p>
          <p className="mt-2 font-semibold text-gray-900 dark:text-[#E6F0EA]">
            {aluno.semestre}º semestre
          </p>
        </div>
      </div>
    </section>

    <Atalhos
      onAbrirBoletim={onAbrirBoletim}
      onAbrirAvisos={onAbrirAvisos}
    />

    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-[#E6F0EA]">
        Próxima aula
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#2A3B33] dark:bg-[#1A2A23]">
        {carregandoProximaAula ? (
          <div
            className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-[#2A3B33]"
            aria-busy="true"
            aria-label="Carregando próxima aula"
          />
        ) : erroProximaAula ? (
          <div role="alert">
            <p className="text-sm text-red-600 dark:text-[#F08A7E]">
              Não foi possível carregar a próxima aula: {erroProximaAula}
            </p>
            {onTentarNovamente && (
              <button
                type="button"
                onClick={onTentarNovamente}
                className="mt-3 text-sm font-semibold text-emerald-700 underline dark:text-[#7FB083]"
              >
                Tentar novamente
              </button>
            )}
          </div>
        ) : proximaAula ? (
          <>
            <p className="font-semibold text-gray-900 dark:text-[#E6F0EA]">
              {proximaAula.disciplina?.nome ?? 'Disciplina'}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-[#93A89C]">
              {new Date(proximaAula.dataHora).toLocaleString('pt-BR')}
            </p>
            {proximaAula.sala && (
              <p className="mt-1 text-sm text-gray-500 dark:text-[#93A89C]">
                Sala: {proximaAula.sala}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-[#93A89C]">
            Nenhuma aula disponível no momento.
          </p>
        )}
      </div>
    </section>
  </div>
  );
}

export default Dashboard;
