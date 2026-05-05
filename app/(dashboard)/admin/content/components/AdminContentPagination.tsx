import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface AdminContentPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function AdminContentPagination({
  page,
  totalPages,
  onChange,
}: AdminContentPaginationProps) {
  return (
    <div
      className={classNames(
        "mt-6 flex flex-col gap-4 rounded-2xl border border-white/5",
        "bg-white/5 px-4 py-4 text-sm text-white/40 sm:flex-row",
        "sm:items-center sm:justify-between",
      )}
    >
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={classNames(
            "rounded-xl border-white/10 bg-card text-white/60",
            "disabled:opacity-40",
          )}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className={classNames(
            "rounded-xl border-white/10 bg-card text-white/60",
            "disabled:opacity-40",
          )}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
