
# 🎓 Sistema de Gestão Universitária - PWA Mobile-First

Projeto Integrador (SENAC) - **2ª Entrega: Prova de Conceito (PoC)**.
O objetivo desta etapa é validar a **Jornada do Aluno** (Login, Notas, Avisos e Próxima Aula) através de um Produto Mínimo Viável (MVP) funcional.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
*   React + Vite
*   TypeScript
*   Tailwind CSS (v4)

**Backend:**
*   Node.js + Express
*   TypeScript
*   Prisma ORM
*   SQLite (Banco de dados local para desenvolvimento)

---

## ✅ O que já foi feito (Status Atual)

*   **Estrutura do Monorepo:** Pastas `frontend`, `backend` e `shared` configuradas.
*   **Frontend:** Tela de Login responsiva e funcional criada com React e Tailwind.
*   **Backend:** Servidor Express rodando com CORS configurado.
*   **Banco de Dados:** Modelagem completa (Aluno, Disciplina, Aula, Nota, Aviso) e banco populado com dados de teste (Persona João da Silva).
*   **API:** Rotas de teste para buscar Aluno por matrícula, Próxima Aula, Notas e Avisos.

---

## 🚧 O que falta fazer (Próximos Passos)

- [ ] Conectar a tela de Login do React com a API (fazer o João logar de verdade).
- [ ] Criar a tela do Dashboard (Painel do Aluno com o card da próxima aula).
- [ ] Criar a tela de Boletim (Notas e Frequência).
- [ ] Criar a tela de Avisos.
- [ ] Criar a navegação inferior (Bottom Nav).
- [ ] Escrever o documento final da 2ª entrega.
- [ ] Gravar o vídeo de 1 minuto de demonstração.

---

## 💻 Como rodar o projeto na sua máquina

**Pré-requisitos:** Ter o [Node.js](https://nodejs.org/) instalado na máquina.

### 1. Clonar o repositório
Abra o terminal e rode:
```bash
git clone https://github.com/paulamelo2404/gestao-universitaria.git
cd gestao-universitaria
```

### 2. Configurar e rodar o Backend
Abra um terminal e entre na pasta do backend:
```bash
cd backend
```
Instale as dependências:
```bash
npm install
```
Crie o banco de dados e as tabelas (Prisma):
```bash
npx prisma migrate dev
```
Popule o banco com os dados do João (Seed):
```bash
npm run seed
```
Inicie o servidor:
```bash
npm run dev
```
*(O backend estará rodando em `http://localhost:3333`)*

### 3. Configurar e rodar o Frontend
Abra **outro terminal** (mantenha o do backend rodando) e volte para a raiz do projeto:
```bash
cd frontend
```
Instale as dependências:
```bash
npm install
```
Inicie o servidor Vite:
```bash
npm run dev
```
*(O frontend estará rodando em `http://localhost:5173`)*

---

## 👥 Integrantes do Grupo 30
*   Brenda Emerson da Paixão
*   Filipe de Lima Silveira
*   Gabrielle Sales Gomes
*   Paula de Melo Souza
*   Gilson Kelvin Arruda Sales
*   Lucas Taveira Fonseca
```


