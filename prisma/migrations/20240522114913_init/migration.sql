/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Income` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_transactionId_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "transactionId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
