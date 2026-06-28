import AdminPageHeader from "../components/AdminPageHeader";
import { UsersTable } from "./components/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader title="Users" description="Manage admin users and access levels." />
      <UsersTable />
    </div>
  );
}
