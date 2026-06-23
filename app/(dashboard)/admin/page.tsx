import Link from "next/link";
import {
  Building2,
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowRight,
  Clock,
} from "lucide-react";
import { getDashboardData } from "@/hono/services/dashboard.service";
import AdminPageHeader from "./components/AdminPageHeader";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 6) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default async function AdminDashboardPage() {
  const {
    publishedCount,
    draftCount,
    totalEnquiries,
    unreadEnquiries,
    recentEnquiries,
    recentProperties,
    propertiesByType,
  } = await getDashboardData();

  const stats = [
    {
      label: "Published",
      value: publishedCount,
      icon: Eye,
      href: "/admin/properties?published=true",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: EyeOff,
      href: "/admin/properties?published=false",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Enquiries",
      value: totalEnquiries,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Unread",
      value: unreadEnquiries,
      icon: Bell,
      href: "/admin/enquiries",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your property listings and enquiries."
        actions={
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Add Property
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`bg-white rounded-xl border ${stat.border} p-5 flex items-center gap-4 hover:shadow-sm transition-shadow group`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Enquiries</h2>
              {unreadEnquiries > 0 && (
                <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadEnquiries} unread
                </span>
              )}
            </div>
            <Link href="/admin/enquiries" className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <MessageSquare className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No enquiries yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentEnquiries.map((enquiry) => (
                <Link
                  key={enquiry.id}
                  href="/admin/enquiries"
                  className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 mt-0.5">
                    {enquiry.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{enquiry.name}</p>
                      {!enquiry.isRead && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{enquiry.email}</p>
                    {enquiry.property && (
                      <p className="text-xs text-primary-600 mt-0.5 truncate">{enquiry.property.title}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{enquiry.message}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-xs text-gray-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatRelative(enquiry.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">By Type</h2>
            </div>
          </div>

          {propertiesByType.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <FileText className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No property types</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {propertiesByType.map((type) => {
                const pct = publishedCount > 0
                  ? Math.round((type._count.properties / publishedCount) * 100)
                  : 0;

                return (
                  <div key={type.id} className="px-6 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-700">{type.name}</p>
                      <span className="text-sm font-semibold text-gray-900">{type._count.properties}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Properties</h2>
          </div>
          <Link href="/admin/properties" className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Building2 className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No properties yet</p>
            <Link href="/admin/properties/new" className="mt-3 text-xs text-primary-600 hover:underline font-medium">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {recentProperties.map((property) => {
              const firstImage = property.images[0];
              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug}`}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {firstImage ? (
                      <img
                        src={firstImage.url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{property.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {property.propertyType.name} · {property.province.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        property.isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {property.isPublished ? "Published" : "Draft"}
                      </span>
                      {property.isFeatured && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
