-- CreateTable
CREATE TABLE "Whishlist" (
    "userId" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Whishlist_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Whishlist_userId_key" ON "Whishlist"("userId");

-- AddForeignKey
ALTER TABLE "Whishlist" ADD CONSTRAINT "Whishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
