-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_participation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "desafioId" INTEGER NOT NULL,
    "progress" DECIMAL NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    CONSTRAINT "participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "participation_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_participation" ("desafioId", "id", "progress", "userId") SELECT "desafioId", "id", "progress", "userId" FROM "participation";
DROP TABLE "participation";
ALTER TABLE "new_participation" RENAME TO "participation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
