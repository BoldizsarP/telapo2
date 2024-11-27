-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "familyGroup" TEXT NOT NULL,
    "passhash" TEXT NOT NULL,
    "drawsId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_drawsId_key" ON "User"("drawsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_drawsId_fkey" FOREIGN KEY ("drawsId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
