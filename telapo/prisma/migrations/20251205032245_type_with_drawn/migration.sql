/*
  Warnings:

  - You are about to drop the column `whoWasDrawId` on the `DrawHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[whoDrewId,whoWasDrawnId,drewYear]` on the table `DrawHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `whoWasDrawnId` to the `DrawHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DrawHistory" DROP CONSTRAINT "DrawHistory_whoWasDrawId_fkey";

-- DropIndex
DROP INDEX "DrawHistory_whoDrewId_whoWasDrawId_drewYear_key";

-- AlterTable
ALTER TABLE "DrawHistory" DROP COLUMN "whoWasDrawId",
ADD COLUMN     "whoWasDrawnId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DrawHistory_whoDrewId_whoWasDrawnId_drewYear_key" ON "DrawHistory"("whoDrewId", "whoWasDrawnId", "drewYear");

-- AddForeignKey
ALTER TABLE "DrawHistory" ADD CONSTRAINT "DrawHistory_whoWasDrawnId_fkey" FOREIGN KEY ("whoWasDrawnId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
