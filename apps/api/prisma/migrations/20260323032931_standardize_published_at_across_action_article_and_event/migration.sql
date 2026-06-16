-- AlterTable
ALTER TABLE "action" ADD COLUMN     "published_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "article" ALTER COLUMN "published_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "published_at" TIMESTAMP(3);
