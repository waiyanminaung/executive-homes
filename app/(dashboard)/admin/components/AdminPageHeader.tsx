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
        "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",
      )}
    >
      <div className={classNames("space-y-2")}>
        <p
          className={classNames(
            "text-[10px] font-black uppercase tracking-[0.35em] text-white/30",
          )}
        >
          {eyebrow}
        </p>
        <h1
          className={classNames(
            "text-2xl font-black uppercase tracking-tighter text-white lg:text-3xl",
          )}
        >
          {title}
        </h1>
        <p
          className={classNames(
            "max-w-2xl text-xs leading-relaxed text-white/40 lg:text-sm",
          )}
        >
          {description}
        </p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
