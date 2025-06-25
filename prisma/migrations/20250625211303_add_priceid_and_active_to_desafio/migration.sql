/*
  Warnings:

  - Added the required column `priceId` to the `desafio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "desafio" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priceId" TEXT NOT NULL;
