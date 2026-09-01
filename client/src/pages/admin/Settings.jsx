import AdminLayout from "../../layouts/AdminLayout";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <AdminLayout title="Admin Settings" subtitle="Manage admin profile and preferences">
      <div className="rounded-2xl bg-white p-12 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-[#FEE4EB] flex items-center justify-center">
            <SettingsIcon className="h-8 w-8 text-[#F33B7D]" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[#0D0D0D] mb-2">Admin Settings Coming Soon</h2>
        <p className="text-sm text-[#8F8C8C] max-w-md mx-auto">
          Backend endpoints for admin settings are not implemented yet. This feature will allow admins to manage their profile, change password, and configure preferences.
        </p>
        <p className="text-xs text-[#B8AEB2] mt-4">
          Status: Pending backend development
        </p>
      </div>
    </AdminLayout>
  );
}
