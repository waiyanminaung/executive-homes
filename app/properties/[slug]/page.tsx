import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import {
  PropertyDetailContent,
  PropertyDetailBreadcrumb,
  PropertyDetailGallery,
  PropertyDetailSidebar,
  PropertyDetailSummary,
  SimilarProperties,
} from "./components";
import { PROPERTY_DETAIL } from "./constants";

export default async function PropertyDetailPage() {
  const property = PROPERTY_DETAIL;

  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <main className="min-h-screen bg-background text-neutral-950">
        <div className="mx-auto w-full max-w-[1292px] px-4 pb-20 md:px-6 xl:px-0">
          <PropertyDetailBreadcrumb title={property.title} />
          <PropertyDetailGallery images={property.imageUrls} title={property.title} />

          <div className="mt-[30px] grid gap-6 lg:grid-cols-[minmax(0,908px)_359px] lg:items-start">
            <div className="grid gap-5">
              <PropertyDetailSummary property={property} />
              <PropertyDetailContent property={property} />
            </div>

            <PropertyDetailSidebar />
          </div>

          <div className="mt-[50px]">
            <SimilarProperties />
          </div>
        </div>
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
