
import { Icone } from './lib/sgu';

interface AtalhosProps {
  onAbrirBoletim: () => void;
  onAbrirAvisos: () => void;
}

function Atalhos({ onAbrirBoletim, onAbrirAvisos }: AtalhosProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-[#E6F0EA]">
        Acesso rápido
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAbrirBoletim}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-500 hover:shadow-sm dark:border-[#2A3B33] dark:bg-[#1A2A23]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E2EDDC] text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]">
            <Icone nome="chart" className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#E6F0EA]">
              Boletim
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#93A89C]">
              Consulte suas notas e desempenho.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onAbrirAvisos}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-500 hover:shadow-sm dark:border-[#2A3B33] dark:bg-[#1A2A23]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E2EDDC] text-[#14402F] dark:bg-[#24402F] dark:text-[#E6F0EA]">
            <Icone nome="bell" className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#E6F0EA]">
              Avisos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#93A89C]">
              Acompanhe comunicados acadêmicos.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Atalhos;
