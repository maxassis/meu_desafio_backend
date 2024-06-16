-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('homem', 'mulher', 'nao_bianrio', 'prefiro_nao_responder');

-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('corrida', 'bicicleta');

-- AlterTable
ALTER TABLE "userData" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "sport" "Sport",
ALTER COLUMN "avatar" DROP NOT NULL;
