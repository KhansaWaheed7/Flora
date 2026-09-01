import AdminLayout from "../../layouts/AdminLayout";
import { MessageCircle } from "lucide-react";

export default function ChatMonitoring() {
  return (
    <AdminLayout title="Chat Monitoring" subtitle="Monitor and manage user-doctor conversations">
      <div className="rounded-2xl bg-white p-12 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-[#FEE4EB] flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-[#F33B7D]" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[#0D0D0D] mb-2">Chat Monitoring Coming Soon</h2>
        <p className="text-sm text-[#8F8C8C] max-w-md mx-auto">
          Backend endpoints for chat monitoring are not implemented yet. This feature will allow admins to view and monitor all user-doctor conversations.
        </p>
        <p className="text-xs text-[#B8AEB2] mt-4">
          Status: Pending backend development
        </p>
      </div>
    </AdminLayout>
  );
}
