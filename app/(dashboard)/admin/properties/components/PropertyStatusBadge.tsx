import { classNames } from "@/utils/classNames";

interface BadgeConfig {
  label: string;
  className: string;
}

function getListingBadge(isForSale: boolean, isForRent: boolean): BadgeConfig {
  if (isForSale && isForRent) {
    return { label: "Sale & Rent", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" };
  }

  if (isForSale) {
    return { label: "For Sale", className: "bg-blue-50 text-blue-700 ring-blue-600/20" };
  }

  return { label: "For Rent", className: "bg-purple-50 text-purple-700 ring-purple-600/20" };
}

const AVAILABILITY_CONFIG: Record<string, BadgeConfig> = {
  SOLD: { label: "Sold", className: "bg-gray-50 text-gray-600 ring-gray-500/10" },
  RENTED: { label: "Rented", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
};

interface PropertyStatusBadgeProps {
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
}

export default function PropertyStatusBadge({ isForSale, isForRent, availabilityStatus }: PropertyStatusBadgeProps) {
  const availabilityConfig = AVAILABILITY_CONFIG[availabilityStatus];
  const config = availabilityConfig ?? getListingBadge(isForSale, isForRent);

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
