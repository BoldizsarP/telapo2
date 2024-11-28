/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `PWResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PWResetToken_secret_key" ON "PWResetToken"("secret");
