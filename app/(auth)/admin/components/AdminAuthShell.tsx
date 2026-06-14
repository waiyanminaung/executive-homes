import { Building2 } from "lucide-react";

interface AdminAuthShellProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AdminAuthShell({
  title,
  children,
  footer,
}: AdminAuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-700 text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Executive Homes
            </p>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{title}</h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {children}
        </div>

        {footer ? <div className="mt-6 text-center">{footer}</div> : null}
      </div>
    </div>
  );
}
