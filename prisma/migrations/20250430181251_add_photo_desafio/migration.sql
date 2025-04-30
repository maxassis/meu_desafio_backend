/*
  Warnings:

  - Made the column `description` on table `desafio` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_desafio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "distance" DECIMAL NOT NULL,
    "photo" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_desafio" ("description", "distance", "id", "location", "name") SELECT "description", "distance", "id", "location", "name" FROM "desafio";
DROP TABLE "desafio";
ALTER TABLE "new_desafio" RENAME TO "desafio";
CREATE UNIQUE INDEX "desafio_name_key" ON "desafio"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
