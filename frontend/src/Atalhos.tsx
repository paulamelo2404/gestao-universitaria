
interface AtalhosProps {
  onAbrirBoletim: () => void;
  onAbrirAvisos: () => void;
}

function Atalhos({ onAbrirBoletim, onAbrirAvisos }: AtalhosProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Acesso rápido
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">

        <button
          type="button"
          onClick={onAbrirBoletim}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-500 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
            📊
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Boletim
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Consulte suas notas e desempenho.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onAbrirAvisos}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-emerald-500 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
            🔔
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Avisos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe comunicados acadêmicos.
            </p>
          </div>
        </button>

      </div>
    </section>
  );
}

export default Atalhos;
