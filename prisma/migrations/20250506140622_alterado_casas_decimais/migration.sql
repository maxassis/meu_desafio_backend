/*
  Warnings:

  - You are about to alter the column `distance` on the `desafio` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,5)`.
  - You are about to alter the column `progress` on the `inscription` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,5)`.
  - You are about to alter the column `duration` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,5)`.
  - You are about to alter the column `distanceKm` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,5)`.

*/
-- AlterTable
ALTER TABLE "desafio" ALTER COLUMN "distance" SET DATA TYPE DECIMAL(10,5);

-- AlterTable
ALTER TABLE "inscription" ALTER COLUMN "progress" SET DATA TYPE DECIMAL(10,5);

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "duration" SET DATA TYPE DECIMAL(10,5),
ALTER COLUMN "distanceKm" SET DATA TYPE DECIMAL(10,5);
