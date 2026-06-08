import { CONTACT_METHODS } from "../constants";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

export function ContactMain() {
  return (
    <section className="bg-white px-4 py-[70px]">
      <div className="mx-auto grid w-full max-w-[1186px] gap-6 lg:grid-cols-[minmax(0,572px)_minmax(0,1fr)]">
        <ContactForm />
        <ContactInfo methods={CONTACT_METHODS} />
      </div>
    </section>
  );
}
