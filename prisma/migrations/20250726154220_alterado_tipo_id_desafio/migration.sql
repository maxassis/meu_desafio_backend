/*
  Warnings:

  - The primary key for the `desafio` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "inscription" DROP CONSTRAINT "inscription_desafioId_fkey";

-- AlterTable
ALTER TABLE "desafio" DROP CONSTRAINT "desafio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "desafio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "desafio_id_seq";

-- AlterTable
ALTER TABLE "inscription" ALTER COLUMN "desafioId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "inscription" ADD CONSTRAINT "inscription_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
