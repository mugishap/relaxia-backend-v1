/*
  Warnings:

  - Changed the type of `salary` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "currency" AS ENUM ('RWF', 'USD', 'PLN', 'EUR', 'GBP');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "currency" "currency" NOT NULL DEFAULT 'USD',
DROP COLUMN "salary",
ADD COLUMN     "salary" INTEGER NOT NULL;
