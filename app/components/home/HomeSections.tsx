import { getHomeSections } from "@/hono/services/homeSection.service";
import { PropertySection } from "./PropertySection";

export async function HomeSections() {
  const sections = await getHomeSections();

  return (
    <>
      {sections.map((section) => (
        <PropertySection key={section.title} section={section} />
      ))}
    </>
  );
}
