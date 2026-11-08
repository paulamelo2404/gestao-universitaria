import { useState } from 'react';

function App() {
  const [matricula, setMatricula] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tentando logar com a matrícula: ${matricula}`);
  };

  return (
    // Fundo da tela (cinza bem clarinho)
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      {/* Container principal (simula a largura de um celular no desktop) */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        
        {/* Logo e Boas-vindas */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">JS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ex: 202410001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-emerald-600 hover:underline">
            Esqueceu a matrícula?
          </a>
        </div>
      </div>

    </div>
  );
}

export default App;