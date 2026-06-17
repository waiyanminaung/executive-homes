import { Spinner } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface MediaUploadingCellProps {
  className?: string;
}

export default function MediaUploadingCell({ className }: MediaUploadingCellProps) {
  return (
    <div
      className={classNames(
        "relative aspect-square overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center",
        className ?? "rounded-lg border-2 border-transparent",
      )}
    >
      <Spinner className="w-5 h-5 text-gray-400" />
    </div>
  );
}
