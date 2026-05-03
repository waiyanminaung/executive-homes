import { classNames } from "@/utils/classNames";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
      )}
    >
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/30">
          {eyebrow}
        </p>
        <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-white">
          {title}
        </h1>
        <p className="max-w-2xl text-sm lg:text-base text-white/45 leading-relaxed">
          {description}
        </p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
