/*
  Warnings:

  - You are about to drop the `Whishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Whishlist" DROP CONSTRAINT "Whishlist_userId_fkey";

-- DropTable
DROP TABLE "Whishlist";

-- CreateTable
CREATE TABLE "Wishlist" (
    "userId" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_key" ON "Wishlist"("userId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
