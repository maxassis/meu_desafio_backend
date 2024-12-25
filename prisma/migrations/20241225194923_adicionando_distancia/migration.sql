-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "userData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "avatar_url" TEXT,
    "avatar_filename" TEXT,
    "full_name" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "sport" TEXT,
    "birthDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,
    CONSTRAINT "userData_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "desafio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "participation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "desafioId" INTEGER NOT NULL,
    "progress" DECIMAL NOT NULL DEFAULT 0,
    CONSTRAINT "participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "participation_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "date" DATETIME,
    "duration" DATETIME,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userData_usersId_key" ON "userData"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "desafio_name_key" ON "desafio"("name");
