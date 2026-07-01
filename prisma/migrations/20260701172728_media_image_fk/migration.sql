/*
  Warnings:

  - The values [BOTH] on the enum `HomeSectionListingType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageKey` on the `home_area_cards` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `property_images` table. All the data in the column will be lost.
  - Added the required column `mediaImageId` to the `home_area_cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaImageId` to the `property_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HomeSectionListingType_new" AS ENUM ('RENT', 'SALE');
ALTER TABLE "public"."home_sections" ALTER COLUMN "listingType" DROP DEFAULT;
ALTER TABLE "home_sections" ALTER COLUMN "listingType" TYPE "HomeSectionListingType_new" USING ("listingType"::text::"HomeSectionListingType_new");
ALTER TYPE "HomeSectionListingType" RENAME TO "HomeSectionListingType_old";
ALTER TYPE "HomeSectionListingType_new" RENAME TO "HomeSectionListingType";
DROP TYPE "public"."HomeSectionListingType_old";
ALTER TABLE "home_sections" ALTER COLUMN "listingType" SET DEFAULT 'RENT';
COMMIT;

-- AlterTable
ALTER TABLE "home_area_cards" DROP COLUMN "imageKey",
ADD COLUMN     "mediaImageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "home_sections" ALTER COLUMN "listingType" SET DEFAULT 'RENT';

-- AlterTable
ALTER TABLE "property_images" DROP COLUMN "url",
ADD COLUMN     "mediaImageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_mediaImageId_fkey" FOREIGN KEY ("mediaImageId") REFERENCES "media_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_area_cards" ADD CONSTRAINT "home_area_cards_mediaImageId_fkey" FOREIGN KEY ("mediaImageId") REFERENCES "media_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
