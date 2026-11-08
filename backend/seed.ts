import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Criar o Aluno
  const aluno = await prisma.aluno.create({
    data: {
      nome: 'João da Silva',
      matricula: '202410001',
      email: 'joao@aluno.edu.br',
      curso: 'ADS',
      semestre: 4,
    },
  })

  // 2. Criar a Disciplina
  const calc = await prisma.disciplina.create({
    data: { 
      nome: 'Cálculo Aplicado', 
      professor: 'Helena Souza', 
      sala: '302', 
      bloco: 'B', 
      horario: '10:30' 
    },
  })

  // 3. Criar a Aula de hoje
  await prisma.aula.create({
    data: { 
      disciplinaId: calc.id, 
      dataHora: new Date(), 
      sala: '302' 
    },
  })

  // 4. Criar as Notas
  await prisma.nota.createMany({
    data: [
      { alunoId: aluno.id, disciplinaId: calc.id, avaliacao: 'Trabalho de Gestão', valor: 8.5, peso: 1, frequencia: 92 },
      { alunoId: aluno.id, disciplinaId: calc.id, avaliacao: 'Prova 1', valor: 7.0, peso: 2, frequencia: 92 },
    ],
  })

  // 5. Criar os Avisos
  await prisma.aviso.createMany({
    data: [
      { alunoId: aluno.id, titulo: 'Mudança de sala', mensagem: 'A aula de Cálculo foi movida para a Sala 305.' },
      { alunoId: aluno.id, titulo: 'Prazo de trabalho', mensagem: 'Entrega do trabalho de Gestão prorrogada para 25/11.' },
      { alunoId: null, titulo: 'Semana acadêmica', mensagem: 'Inscrições abertas para a semana acadêmica.' },
    ],
  })

  console.log('✅ Banco populado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })