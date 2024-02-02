-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_logo_id_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "logo_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
