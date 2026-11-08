import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sistema de Gestão Universitária está rodando!' });
});

// Rota: Buscar aluno pela matrícula (Login)
app.get('/api/alunos/:matricula', async (req, res) => {
  try {
    const { matricula } = req.params;
    const aluno = await prisma.aluno.findUnique({
      where: { matricula },
      include: { notas: true, avisos: true }
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Rota: Próxima Aula
app.get('/api/aulas/proxima', async (req, res) => {
  try {
    const aula = await prisma.aula.findFirst({
      include: { disciplina: true },
      orderBy: { dataHora: 'asc' }
    });
    res.json(aula);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar aula' });
  }
});

// Rota: Notas do Aluno
app.get('/api/notas/:alunoId', async (req, res) => {
  try {
    const { alunoId } = req.params;
    const notas = await prisma.nota.findMany({
      where: { alunoId: Number(alunoId) },
      include: { disciplina: true }
    });
    res.json(notas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar notas' });
  }
});

// Rota: Avisos do Aluno
app.get('/api/avisos/:alunoId', async (req, res) => {
  try {
    const { alunoId } = req.params;
    const avisos = await prisma.aviso.findMany({
      where: {
        OR: [
          { alunoId: Number(alunoId) },
          { alunoId: null }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(avisos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar avisos' });
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});