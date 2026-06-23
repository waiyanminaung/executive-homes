/*
  Warnings:

  - You are about to drop the column `rentPrice` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "rentPrice",
DROP COLUMN "salePrice";

-- CreateTable
CREATE TABLE "property_pricing_tiers" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "salePrice" DOUBLE PRECISION,
    "rentPrice" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "property_pricing_tiers" ADD CONSTRAINT "property_pricing_tiers_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
