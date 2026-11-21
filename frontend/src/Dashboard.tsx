

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
}

function Dashboard({
  aluno,
  proximaAula,
  onAbrirBoletim,
  onAbrirAvisos
}: DashboardProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <p className="text-sm text-gray-500">
            Sistema de Gestão Universitária
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Olá, {aluno.nome}!
          </h1>

          <p className="mt-1 text-gray-500">
            Bem-vindo(a) ao seu ambiente acadêmico.
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-emerald-700 p-6 text-white">
          <p className="text-sm text-emerald-100">
            Minha vida acadêmica
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {aluno.curso}
          </h2>

          <p className="mt-2 text-sm text-emerald-100">
            {aluno.semestre}º semestre
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Visão geral
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Curso</p>
              <p className="mt-2 font-semibold text-gray-900">
                {aluno.curso}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Semestre atual</p>
              <p className="mt-2 font-semibold text-gray-900">
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Próxima aula
          </h2>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            {proximaAula ? (
              <>
                <p className="font-semibold text-gray-900">
                  {proximaAula.disciplina?.nome ?? 'Disciplina'}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {new Date(proximaAula.dataHora).toLocaleString('pt-BR')}
                </p>

                {proximaAula.sala && (
                  <p className="mt-1 text-sm text-gray-500">
                    Sala: {proximaAula.sala}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma aula disponível no momento.
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;
