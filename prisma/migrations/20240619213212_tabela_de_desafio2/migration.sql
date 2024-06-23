/*
  Warnings:

  - Changed the type of `location` on the `desafio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "desafio" DROP COLUMN "location",
ADD COLUMN     "location" JSON NOT NULL;
