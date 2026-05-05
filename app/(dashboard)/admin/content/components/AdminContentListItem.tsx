import Link from "next/link";
import { Edit, Film, Tv, Zap, Flame } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface AdminContentListItemProps {
  item: Content;
  onEdit: (item: Content) => void;
}

export default function AdminContentListItem({
  item,
  onEdit,
}: AdminContentListItemProps) {
  const TypeIcon = item.type === "series" ? Tv : Film;

  return (
    <article
      className={classNames(
        "group flex flex-col justify-between gap-4 rounded-2xl border border-white/5",
        "bg-white/5 p-4 transition-all hover:bg-white/[0.07]",
        "sm:flex-row sm:items-center lg:p-6",
      )}
    >
      <div className={classNames("flex min-w-0 items-center gap-4 lg:gap-6")}>
        <div
          className={classNames(
            "h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10",
            "bg-card shadow-lg lg:h-20 lg:w-16",
          )}
        >
          <img
            src={item.posterUrl}
            alt={item.title}
            className={classNames("h-full w-full object-cover")}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={classNames("min-w-0")}>
          <div className={classNames("mb-1 flex items-center gap-2")}>
            <TypeIcon className="size-3 text-accent" />
            <span
              className={classNames(
                "text-[10px] font-black uppercase tracking-widest text-accent",
              )}
            >
              {item.type}
            </span>
          </div>
          <h3
            className={classNames(
              "truncate text-base font-bold text-white transition-colors",
              "group-hover:text-accent lg:text-xl",
            )}
          >
            {item.title}
          </h3>
          <p
            className={classNames(
              "mt-1 text-[10px] font-bold uppercase tracking-widest text-white/30",
            )}
          >
            {item.year} - {item.rating} IMDb
          </p>
        </div>
      </div>

      <div
        className={classNames(
          "flex flex-wrap items-center justify-between gap-3 sm:justify-end",
        )}
      >
        <div className={classNames("flex flex-wrap gap-2")}>
          {item.isTrending ? (
            <span
              className={classNames(
                "flex items-center gap-1.5 rounded-md bg-accent px-2 py-1",
                "text-[8px] font-black uppercase tracking-widest text-white",
              )}
            >
              <Zap className="size-2.5 fill-current" />
              Trending
            </span>
          ) : null}
          {item.isPopular ? (
            <span
              className={classNames(
                "flex items-center gap-1.5 rounded-md bg-[#FBC02D] px-2 py-1",
                "text-[8px] font-black uppercase tracking-widest text-black",
              )}
            >
              <Flame className="size-2.5 fill-current" />
              Popular
            </span>
          ) : null}
        </div>
        <Link
          href={`/movie/${item.id}`}
          className={classNames(
            "rounded-xl bg-white/5 px-4 py-3 text-[10px] font-black uppercase",
            "tracking-widest text-white/50 transition-all hover:bg-white/10 hover:text-white",
          )}
        >
          Open
        </Link>
        <Button
          type="button"
          variant="icon"
          onClick={() => onEdit(item)}
          className={classNames(
            "rounded-xl bg-white/5 p-3 text-white/50 transition-all",
            "hover:bg-white/10 hover:text-white",
          )}
        >
          <Edit className="size-4" />
        </Button>
      </div>
    </article>
  );
}
