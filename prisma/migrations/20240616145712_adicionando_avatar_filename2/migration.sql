/*
  Warnings:

  - You are about to drop the column `avatar` on the `userData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userData" DROP COLUMN "avatar",
ADD COLUMN     "avatar_filename" TEXT,
ADD COLUMN     "avatar_url" TEXT;
