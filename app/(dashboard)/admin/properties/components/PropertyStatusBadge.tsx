import { classNames } from "@/utils/classNames";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  FOR_SALE: { label: "For Sale", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  FOR_RENT: { label: "For Rent", className: "bg-purple-50 text-purple-700 ring-purple-600/20" },
  FOR_SALE_AND_RENT: { label: "Sale & Rent", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" },
  SOLD: { label: "Sold", className: "bg-gray-50 text-gray-600 ring-gray-500/10" },
  RENTED: { label: "Rented", className: "bg-gray-50 text-gray-600 ring-gray-500/10" },
  OFF_MARKET: { label: "Off Market", className: "bg-red-50 text-red-700 ring-red-600/20" },
};

interface PropertyStatusBadgeProps {
  status: string;
}

export default function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-50 text-gray-600 ring-gray-500/10" };

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
