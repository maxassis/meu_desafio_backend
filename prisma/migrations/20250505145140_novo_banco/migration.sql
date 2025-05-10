-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userData" (
    "id" TEXT NOT NULL,
    "avatar_url" TEXT,
    "avatar_filename" TEXT,
    "full_name" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "sport" TEXT,
    "birthDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "userData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desafio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "distance" DECIMAL(65,30) NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "desafioId" INTEGER NOT NULL,
    "progress" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "duration" DECIMAL(65,30) NOT NULL,
    "calories" INTEGER,
    "local" TEXT,
    "distanceKm" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "inscriptionId" INTEGER NOT NULL,
    "usersId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userData_usersId_key" ON "userData"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "desafio_name_key" ON "desafio"("name");

-- AddForeignKey
ALTER TABLE "userData" ADD CONSTRAINT "userData_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscription" ADD CONSTRAINT "inscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscription" ADD CONSTRAINT "inscription_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "inscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
