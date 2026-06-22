import { prisma } from "@/lib/prisma";
import type { ContactInfo } from "@/types/contactInfo";

const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: "singleton",
  phone: "+66(0)92-598-7462",
  email: "ehb.bkk@gmail.com",
  whatsapp: "+66(0)92-598-7462",
  address: "59/109 Soi 26 Sukhumvit Rd, Klongtoey, Bangkok",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  line: "https://line.me",
};

export async function getContactInfo(): Promise<ContactInfo> {
  const info = await prisma.contactInfo.findUnique({ where: { id: "singleton" } });

  return info ?? DEFAULT_CONTACT_INFO;
}
