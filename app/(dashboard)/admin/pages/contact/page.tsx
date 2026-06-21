"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton, RHFInput, RHFError, toast } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { contactInfoSchema, type ContactInfoInput } from "@/validation/contactInfoSchema";
import AdminPageHeader from "../../components/AdminPageHeader";

const DEFAULT_VALUES: ContactInfoInput = {
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  facebook: "",
  instagram: "",
  line: "",
};

export default function AdminContactPage() {
  const { data, trigger: refetch } = useRead((api) => api("admin/contact-info").GET());
  const { trigger: save } = useWrite((api) => api("admin/contact-info").PUT());

  const contactInfo = data?.contactInfo;

  const methods = useForm<ContactInfoInput>({
    values: contactInfo
      ? {
          phone: contactInfo.phone,
          email: contactInfo.email,
          whatsapp: contactInfo.whatsapp,
          address: contactInfo.address,
          facebook: contactInfo.facebook,
          instagram: contactInfo.instagram,
          line: contactInfo.line,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(contactInfoSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await save({ body: values });
    await refetch();
    toast.success("Contact info saved.");
  });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Contact Page"
        description="Manage contact details shown on the public contact page and footer."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Contact Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <RHFInput name="phone" placeholder="+66(0)92-598-7462" />
                <RHFError name="phone" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <RHFInput name="email" type="email" placeholder="ehb.bkk@gmail.com" />
                <RHFError name="email" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <RHFInput name="whatsapp" placeholder="+66(0)92-598-7462" />
                <RHFError name="whatsapp" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <RHFInput name="address" placeholder="59/109 Soi 26 Sukhumvit Rd, Klongtoey, Bangkok" />
                <RHFError name="address" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Social Links</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <RHFInput name="facebook" placeholder="https://facebook.com/yourpage" />
                <RHFError name="facebook" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <RHFInput name="instagram" placeholder="https://instagram.com/yourhandle" />
                <RHFError name="instagram" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Line</label>
                <RHFInput name="line" placeholder="https://line.me/ti/p/yourlineid" />
                <RHFError name="line" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              loading={methods.formState.isSubmitting}
              loadingText="Saving..."
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
