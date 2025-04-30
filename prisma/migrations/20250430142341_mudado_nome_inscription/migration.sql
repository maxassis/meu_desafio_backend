/*
  Warnings:

  - You are about to drop the `participation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `participationId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `inscriptionId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "participation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "inscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "desafioId" INTEGER NOT NULL,
    "progress" DECIMAL NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    CONSTRAINT "inscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inscription_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "date" DATETIME,
    "duration" DECIMAL NOT NULL,
    "calories" INTEGER,
    "local" TEXT,
    "distanceKm" DECIMAL NOT NULL DEFAULT 0,
    "inscriptionId" INTEGER NOT NULL,
    "usersId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "inscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("calories", "createdAt", "date", "distanceKm", "duration", "environment", "id", "local", "name", "updatedAt", "usersId") SELECT "calories", "createdAt", "date", "distanceKm", "duration", "environment", "id", "local", "name", "updatedAt", "usersId" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
