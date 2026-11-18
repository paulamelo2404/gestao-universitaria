// useState cria "variáveis de estado": quando elas mudam,
// o React redesenha a tela automaticamente.
import { useState } from 'react';


function App() {
  // guarda o que o usuário digita no campo de matrícula.
  const [matricula, setMatricula] = useState('');
  //guarda a mensagem de erro a ser exibida (vazio = sem erro).
  const [erro, setErro] = useState('');
  //indica se a requisição está em andamento.
  // Serve para desabilitar o botão e mostrar "Entrando...".
  const [carregando, setCarregando] = useState(false);

  //indica se a requisição está em andamento.
  // Serve para desabilitar o botão e mostrar "Entrando...".
    const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    // Limpa erro anterior e marca que a requisição começou
    setErro('');
    setCarregando(true);

     try {

      // Faz uma requisição GET para a rota do backend que busca o aluno
      // pela matrícula. É a mesma rota definida em server.ts:
      const response = await fetch(`http://localhost:3333/api/alunos/${matricula}`);

      // response.ok é false quando o status HTTP é 404, 500 etc.
      // Se não for ok, tentamos ler a mensagem de erro que o backend enviou.
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        // Lança um erro para ser capturado pelo catch abaixo.
        throw new Error(data.erro || 'Matrícula não encontrada');
      }

      // Converte o corpo da resposta (JSON) em objeto JavaScript.
      const aluno = await response.json();

      // Guarda os dados do aluno no localStorage do navegador.
      // JSON.stringify converte o objeto em texto, pois o localStorage
      // só armazena strings. As próximas telas (Dashboard, Notas, Avisos)
      // vão usar aluno.id para chamar as outras rotas da API.
      localStorage.setItem('aluno', JSON.stringify(aluno));

      // Feedback de sucesso. Quando o Dashboard existir,
      // troque este alert por uma navegação para a nova tela.
      alert(`Bem-vindo, ${aluno.nome}!`);
    } catch (err) {

      // Captura qualquer erro (rede, 404, JSON inválido etc.)
      // e exibe a mensagem no estado "erro".
      setErro(err instanceof Error ? err.message : 'Erro ao conectar com o servidor');
    } finally {

      // Roda sempre, com sucesso ou erro: religa o botão.
      setCarregando(false);
    }
};

return (
    // Fundo da tela (cinza bem clarinho)
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">JS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              type="text"
              value={matricula}

              // Atualiza o estado "matricula" a cada tecla digitada
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ex: 202410001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              required

              // Desabilita o campo enquanto a requisição está em andamento
              disabled={carregando}
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-emerald-600 hover:underline">
            Esqueceu a matricula?
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
