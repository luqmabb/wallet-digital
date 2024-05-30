/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_categoryId_fkey";

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "outcomeCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Outcome" ADD COLUMN     "incomeCategoryId" INTEGER;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "incomeCategory" (
    "id" SERIAL NOT NULL,
    "nameCategory" TEXT NOT NULL,

    CONSTRAINT "incomeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcomeCategory" (
    "id" SERIAL NOT NULL,
    "nameCategory" TEXT NOT NULL,

    CONSTRAINT "outcomeCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "incomeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_outcomeCategoryId_fkey" FOREIGN KEY ("outcomeCategoryId") REFERENCES "outcomeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "outcomeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_incomeCategoryId_fkey" FOREIGN KEY ("incomeCategoryId") REFERENCES "incomeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
