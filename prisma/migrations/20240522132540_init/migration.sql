/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Outcome` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Outcome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_transactionId_fkey";

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "transactionId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
