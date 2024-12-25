/*
  Warnings:

  - Added the required column `distance` to the `desafio` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_desafio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "distance" DECIMAL NOT NULL
);
INSERT INTO "new_desafio" ("description", "id", "location", "name") SELECT "description", "id", "location", "name" FROM "desafio";
DROP TABLE "desafio";
ALTER TABLE "new_desafio" RENAME TO "desafio";
CREATE UNIQUE INDEX "desafio_name_key" ON "desafio"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
