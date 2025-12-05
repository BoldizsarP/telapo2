-- CreateTable
CREATE TABLE "LatestDrew" (
    "whoDrewId" UUID NOT NULL,
    "whoWasDrawnId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "DrawHistory" (
    "whoDrewId" UUID NOT NULL,
    "whoWasDrawId" UUID NOT NULL,
    "drewYear" INTEGER NOT NULL DEFAULT 2025
);

-- CreateIndex
CREATE UNIQUE INDEX "LatestDrew_whoDrewId_key" ON "LatestDrew"("whoDrewId");

-- CreateIndex
CREATE UNIQUE INDEX "LatestDrew_whoWasDrawnId_key" ON "LatestDrew"("whoWasDrawnId");

-- CreateIndex
CREATE UNIQUE INDEX "LatestDrew_whoDrewId_whoWasDrawnId_key" ON "LatestDrew"("whoDrewId", "whoWasDrawnId");

-- CreateIndex
CREATE UNIQUE INDEX "DrawHistory_whoDrewId_whoWasDrawId_drewYear_key" ON "DrawHistory"("whoDrewId", "whoWasDrawId", "drewYear");

-- AddForeignKey
ALTER TABLE "LatestDrew" ADD CONSTRAINT "LatestDrew_whoDrewId_fkey" FOREIGN KEY ("whoDrewId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LatestDrew" ADD CONSTRAINT "LatestDrew_whoWasDrawnId_fkey" FOREIGN KEY ("whoWasDrawnId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawHistory" ADD CONSTRAINT "DrawHistory_whoDrewId_fkey" FOREIGN KEY ("whoDrewId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawHistory" ADD CONSTRAINT "DrawHistory_whoWasDrawId_fkey" FOREIGN KEY ("whoWasDrawId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
