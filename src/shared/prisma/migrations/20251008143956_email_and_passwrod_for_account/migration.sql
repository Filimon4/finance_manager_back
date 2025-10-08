/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");
