-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('livre', 'esteira');

-- DropForeignKey
ALTER TABLE "participation" DROP CONSTRAINT "participation_desafioId_fkey";

-- DropForeignKey
ALTER TABLE "participation" DROP CONSTRAINT "participation_userId_fkey";

-- DropForeignKey
ALTER TABLE "userData" DROP CONSTRAINT "userData_usersId_fkey";

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "environment" "Environment" NOT NULL,
    "date" TIMESTAMP(3),
    "duration" TEXT,
    "calories" INTEGER,
    "local" TEXT,
    "distanceKm" DECIMAL(10,2) NOT NULL,
    "participationId" INTEGER NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userData" ADD CONSTRAINT "userData_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "participation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
