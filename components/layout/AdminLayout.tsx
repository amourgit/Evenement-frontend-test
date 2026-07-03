import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { MockModeBanner } from "../dev/MockModeBanner";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: 'dashboard' | 'events' | 'editor';
  setActiveTab?: (tab: 'dashboard' | 'events' | 'editor') => void;
  onLogout?: () => void;
  onGoToPublic?: () => void;
}

export function AdminLayout({ children, activeTab, setActiveTab, onLogout, onGoToPublic }: AdminLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base text-ink">
      <MockModeBanner />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} onGoToPublic={onGoToPublic} />
        <div className="ledger-grain flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
