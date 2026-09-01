import AdminLayout from "../../layouts/AdminLayout";
import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <AdminLayout title="System Notifications" subtitle="Send and manage system-wide notifications">
      <div className="rounded-2xl bg-white p-12 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-[#FEE4EB] flex items-center justify-center">
            <Bell className="h-8 w-8 text-[#F33B7D]" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[#0D0D0D] mb-2">Notifications Management Coming Soon</h2>
        <p className="text-sm text-[#8F8C8C] max-w-md mx-auto">
          Backend endpoints for notifications are not implemented yet. This feature will allow admins to compose, schedule, and send system-wide notifications to users.
        </p>
        <p className="text-xs text-[#B8AEB2] mt-4">
          Status: Pending backend development
        </p>
      </div>
    </AdminLayout>
  );
}
