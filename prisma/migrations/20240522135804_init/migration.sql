/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Outcome` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameCategory]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryName` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `Outcome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_categoryId_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameCategory_key" ON "Category"("nameCategory");

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("nameCategory") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("nameCategory") ON DELETE RESTRICT ON UPDATE CASCADE;
