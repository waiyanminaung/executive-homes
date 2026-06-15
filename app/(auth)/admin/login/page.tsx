"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoadingButton, RHFInput, RHFError } from "@geckoui/geckoui";
import { authClient } from "@/lib/auth-client";
import { DEFAULT_ADMIN_LOGIN_VALUES } from "@/constants/auth";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/validation/authSchema";
import AdminAuthShell from "../components/AdminAuthShell";

export default function AdminLoginPage() {
  const router = useRouter();

  const methods = useForm<AdminLoginFormValues>({
    values: DEFAULT_ADMIN_LOGIN_VALUES,
    resolver: zodResolver(adminLoginSchema),
  });

  const handleLogin = methods.handleSubmit(async (values) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      methods.setError("root", {
        message: error.message ?? "Login failed. Please try again.",
      });
      return;
    }

    router.push("/admin");
  });

  return (
    <AdminAuthShell title="Sign in to Admin">
      <FormProvider {...methods}>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <RHFInput name="email" id="email" type="email" placeholder="admin@example.com" />
            <RHFError name="email" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <RHFInput name="password" id="password" type="password" placeholder="••••••••" />
            <RHFError name="password" />
          </div>

          {methods.formState.errors.root ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {methods.formState.errors.root.message}
            </p>
          ) : null}

          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            loadingText="Signing in..."
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Sign in
          </LoadingButton>
        </form>
      </FormProvider>

      <div className="mt-6 text-center">
        <Link
          href="/admin/register"
          className="text-sm text-gray-500 hover:text-primary-700 transition-colors"
        >
          Create admin account
        </Link>
      </div>
    </AdminAuthShell>
  );
}
