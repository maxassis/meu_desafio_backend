/*
  Warnings:

  - You are about to alter the column `duration` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Decimal`.
  - Made the column `duration` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
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
    "participationId" INTEGER NOT NULL,
    "usersId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "participation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("calories", "createdAt", "date", "distanceKm", "duration", "environment", "id", "local", "name", "participationId", "updatedAt", "usersId") SELECT "calories", "createdAt", "date", "distanceKm", "duration", "environment", "id", "local", "name", "participationId", "updatedAt", "usersId" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
