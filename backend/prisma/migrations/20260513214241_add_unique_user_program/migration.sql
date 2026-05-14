/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Program_userId_key" ON "Program"("userId");
