import AdminPageHeader from "./components/AdminPageHeader";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Welcome to the admin panel."
      />
    </div>
  );
}
