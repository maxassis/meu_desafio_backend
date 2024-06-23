/*
  Warnings:

  - You are about to drop the column `corridaId` on the `participation` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `participation` table. All the data in the column will be lost.
  - Added the required column `desafioId` to the `participation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `participation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "participation" DROP CONSTRAINT "participation_corridaId_fkey";

-- DropForeignKey
ALTER TABLE "participation" DROP CONSTRAINT "participation_usuarioId_fkey";

-- AlterTable
ALTER TABLE "participation" DROP COLUMN "corridaId",
DROP COLUMN "usuarioId",
ADD COLUMN     "desafioId" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
