/*
  Warnings:

  - You are about to alter the column `progress` on the `participation` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "participation" ALTER COLUMN "progress" SET DATA TYPE DECIMAL(10,2);
