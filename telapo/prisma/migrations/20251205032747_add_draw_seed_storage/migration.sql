-- CreateTable
CREATE TABLE "DrawSeed" (
    "id" UUID NOT NULL,
    "seed" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrawSeed_pkey" PRIMARY KEY ("id")
);
