-- AlterTable
ALTER TABLE "_action" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "_article" ALTER COLUMN "publishedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_event" ADD COLUMN     "publishedAt" TIMESTAMP(3);
