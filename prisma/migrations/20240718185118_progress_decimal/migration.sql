/*
  Warnings:

  - You are about to alter the column `progress` on the `participation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "participation" ALTER COLUMN "progress" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "distanceKm" DROP NOT NULL;
