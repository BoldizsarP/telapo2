-- CreateTable
CREATE TABLE "PWResetToken" (
    "id" UUID NOT NULL,
    "secret" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "PWResetToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PWResetToken" ADD CONSTRAINT "PWResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
