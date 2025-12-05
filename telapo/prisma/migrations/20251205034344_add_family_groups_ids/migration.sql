-- AlterTable
ALTER TABLE "User" ADD COLUMN     "familyGroupId" UUID;

-- CreateTable
CREATE TABLE "FamilyGroup" (
    "id" UUID NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "FamilyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyGroup_displayName_key" ON "FamilyGroup"("displayName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "FamilyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
