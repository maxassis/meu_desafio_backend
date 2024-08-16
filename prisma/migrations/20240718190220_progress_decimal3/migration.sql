/*
  Warnings:

  - Made the column `distanceKm` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "participation" ALTER COLUMN "progress" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "distanceKm" SET NOT NULL,
ALTER COLUMN "distanceKm" SET DEFAULT 0;
