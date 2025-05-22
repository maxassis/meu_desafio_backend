/*
  Warnings:

  - The `gender` column on the `userData` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sport` column on the `userData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('homem', 'mulher', 'nao_binario', 'prefiro_nao_responder');

-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('corrida', 'bicicleta');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "gpsTask" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "userData" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "sport",
ADD COLUMN     "sport" "Sport";
