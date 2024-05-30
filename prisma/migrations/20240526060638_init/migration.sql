/*
  Warnings:

  - You are about to drop the column `outcomeCategoryId` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `incomeCategoryId` on the `Outcome` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_outcomeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_incomeCategoryId_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "outcomeCategoryId";

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "incomeCategoryId";
