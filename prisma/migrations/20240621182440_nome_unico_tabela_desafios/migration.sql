/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `desafio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "desafio_name_key" ON "desafio"("name");
