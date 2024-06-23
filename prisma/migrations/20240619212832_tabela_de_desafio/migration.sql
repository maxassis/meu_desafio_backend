-- CreateTable
CREATE TABLE "desafio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,

    CONSTRAINT "desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "corridaId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,

    CONSTRAINT "participation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
