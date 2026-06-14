"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoadingButton } from "@geckoui/geckoui";
import {
  ADMIN_REGISTER_REDIRECT_PATH,
  DEFAULT_ADMIN_REGISTER_VALUES,
} from "@/constants/auth";
import { authClient } from "@/lib/auth-client";
import {
  adminRegisterSchema,
  type AdminRegisterFormValues,
} from "@/validation/authSchema";
import AdminAuthShell from "../components/AdminAuthShell";
import AdminRegisterField from "./components/AdminRegisterField";

export default function AdminRegisterPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<AdminRegisterFormValues>({
    values: DEFAULT_ADMIN_REGISTER_VALUES,
    resolver: zodResolver(adminRegisterSchema),
  });

  useEffect(() => {
    if (session.data) {
      router.replace("/admin");
    }
  }, [router, session.data]);

  const handleRegister = methods.handleSubmit(async (values) => {
    setSubmitError(null);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setSubmitError(error.message ?? "Registration failed. Please try again.");
      return;
    }

    router.push(ADMIN_REGISTER_REDIRECT_PATH);
  });

  return (
    <AdminAuthShell title="Create admin account">
      <FormProvider {...methods}>
        <form onSubmit={handleRegister} className="space-y-5">
          <AdminRegisterField name="name" label="Full name" placeholder="John Smith" />
          <AdminRegisterField name="email" label="Email address" type="email" placeholder="admin@example.com" />
          <AdminRegisterField name="password" label="Password" type="password" placeholder="••••••••" />
          <AdminRegisterField name="confirmPassword" label="Confirm password" type="password" placeholder="••••••••" />

          {submitError ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {submitError}
            </p>
          ) : null}

          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            loadingText="Creating account..."
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Create account
          </LoadingButton>
        </form>
      </FormProvider>

      <div className="mt-6 text-center">
        <Link
          href="/admin/login"
          className="text-sm text-gray-500 hover:text-primary-700 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </AdminAuthShell>
  );
}
