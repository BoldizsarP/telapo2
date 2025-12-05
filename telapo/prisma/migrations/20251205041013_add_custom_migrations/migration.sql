-- CreateTable
CREATE TABLE "CustomMigration" (
    "id" UUID NOT NULL,
    "migrationName" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomMigration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomMigration_migrationName_key" ON "CustomMigration"("migrationName");
