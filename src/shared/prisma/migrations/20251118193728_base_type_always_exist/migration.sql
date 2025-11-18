/*
  Warnings:

  - Made the column `base_type` on table `category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "category" ALTER COLUMN "base_type" SET NOT NULL;
