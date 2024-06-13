/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `userData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userData_usersId_key" ON "userData"("usersId");
