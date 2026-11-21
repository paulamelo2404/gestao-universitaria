
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

* **Estrutura do Monorepo:** Pastas `frontend`, `backend` e `shared` configuradas.
* **Frontend:** Tela de Login responsiva e conectada à API.
* **Dashboard:** Painel do aluno desenvolvido, com informações acadêmicas e card da próxima aula.
* **Atalhos de acesso rápido:** Implementados acessos ao Boletim e aos Avisos.
* **Navegação:** Integração entre Login, Dashboard, Boletim e Avisos.
* **Boletim:** Tela implementada para consulta de notas e frequência.
* **Avisos:** Tela implementada para exibição de comunicados acadêmicos.
* **Backend:** Servidor Express com CORS configurado.
* **Banco de Dados:** Modelagem das entidades Aluno, Disciplina, Aula, Nota e Aviso.
* **API:** Rotas implementadas para buscar aluno por matrícula, próxima aula, notas e avisos.


---

## 🚧 O que falta fazer (Próximos Passos)

- [ ] Implementar a navegação inferior (Bottom Nav), caso faça parte dos requisitos do projeto.
- [ ] Validar o funcionamento integrado.
- [ ] Escrever o documento final da 2ª entrega.
- [ ] Gravar o vídeo de 1 minuto de demonstração.


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

**Atenção:** Antes de rodar o Prisma, renomeie o arquivo .env.example (que está na pasta backend) para .env. Se preferir, crie um arquivo .env manualmente e cole a linha DATABASE_URL="file:./dev.db"

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


