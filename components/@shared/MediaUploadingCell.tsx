import { RotateCcw } from "lucide-react";
import { classNames } from "@/utils/classNames";

interface MediaUploadingCellProps {
  className?: string;
  filename?: string;
  progress?: number;
  status?: "uploading" | "error";
  onRetry?: () => void;
}

export default function MediaUploadingCell({
  className,
  filename,
  progress,
  status = "uploading",
  onRetry,
}: MediaUploadingCellProps) {
  return (
    <div
      className={classNames(
        "relative aspect-square overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-2 p-2",
        className ?? "rounded-lg border-2 border-transparent",
        status === "error" ? "bg-red-50 border-red-200" : "animate-pulse",
      )}
    >
      {status === "error" ? (
        <>
          <button
            type="button"
            onClick={onRetry}
            className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] font-medium">Retry</span>
          </button>

          {filename && (
            <p className="text-[9px] text-red-400 text-center line-clamp-2 leading-tight">{filename}</p>
          )}
        </>
      ) : (
        <>
          <div className="w-full px-1.5">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>

          <span className="text-[11px] font-medium text-gray-500">{progress ?? 0}%</span>
        </>
      )}
    </div>
  );
}
