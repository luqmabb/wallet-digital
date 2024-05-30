/*
  Warnings:

  - Added the required column `userId` to the `incomeCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `outcomeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incomeCategory" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "outcomeCategory" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "incomeCategory" ADD CONSTRAINT "incomeCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outcomeCategory" ADD CONSTRAINT "outcomeCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
