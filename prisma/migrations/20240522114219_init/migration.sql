/*
  Warnings:

  - You are about to drop the column `category` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Outcome` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Outcome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_category_fkey";

-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_category_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
