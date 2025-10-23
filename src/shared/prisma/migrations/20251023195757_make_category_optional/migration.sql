-- DropForeignKey
ALTER TABLE "public"."operations" DROP CONSTRAINT "operations_category_id_fkey";

-- AlterTable
ALTER TABLE "operations" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
