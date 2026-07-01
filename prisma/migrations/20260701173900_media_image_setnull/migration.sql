-- DropForeignKey
ALTER TABLE "home_area_cards" DROP CONSTRAINT "home_area_cards_mediaImageId_fkey";

-- DropForeignKey
ALTER TABLE "property_images" DROP CONSTRAINT "property_images_mediaImageId_fkey";

-- AlterTable
ALTER TABLE "home_area_cards" ALTER COLUMN "mediaImageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "property_images" ALTER COLUMN "mediaImageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_mediaImageId_fkey" FOREIGN KEY ("mediaImageId") REFERENCES "media_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_area_cards" ADD CONSTRAINT "home_area_cards_mediaImageId_fkey" FOREIGN KEY ("mediaImageId") REFERENCES "media_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
