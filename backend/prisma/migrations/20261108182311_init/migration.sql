-- CreateTable
CREATE TABLE "Aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "semestre" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "sala" TEXT NOT NULL,
    "bloco" TEXT NOT NULL,
    "horario" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "disciplinaId" INTEGER NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "sala" TEXT NOT NULL,
    CONSTRAINT "Aula_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "avaliacao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "peso" REAL NOT NULL DEFAULT 1.0,
    "frequencia" REAL NOT NULL,
    CONSTRAINT "Nota_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Nota_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aviso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aviso_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_matricula_key" ON "Aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");
