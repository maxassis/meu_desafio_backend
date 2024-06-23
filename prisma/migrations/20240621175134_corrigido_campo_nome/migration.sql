/*
  Warnings:

  - You are about to drop the column `nome` on the `desafio` table. All the data in the column will be lost.
  - Added the required column `name` to the `desafio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "desafio" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT NOT NULL;
