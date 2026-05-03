import { classNames } from "@/utils/classNames";

interface AdminAuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AdminAuthShell({
  title,
  subtitle,
  children,
  footer,
}: AdminAuthShellProps) {
  return (
    <div
      className={classNames(
        "min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6",
        "bg-linear-to-br from-[#0A0A0A] via-[#111] to-accent/5",
      )}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-6 lg:mb-10">
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-2">
            {title}
          </h1>
          <p className="text-white/40 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em]">
            {subtitle}
          </p>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50" />
          {children}
        </div>

        {footer ? <div className="mt-8">{footer}</div> : null}
      </div>
    </div>
  );
}
