/*
  Warnings:

  - You are about to drop the column `description` on the `desafio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "desafio" DROP COLUMN "description",
ADD COLUMN     "purchaseData" JSONB NOT NULL DEFAULT '{}';
