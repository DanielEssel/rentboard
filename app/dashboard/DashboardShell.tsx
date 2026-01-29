"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/dashboard/components/SideBar";
import DashboardTopbar from "@/app/dashboard/components/DashboardTopbar";

// Removed local Sidebar to resolve import conflict.

// Removed local DashboardTopbar to resolve import conflict.

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && open) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30 bg-[#006D77]">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
            <Sidebar onClose={() => setOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <DashboardTopbar onMenuClick={() => setOpen(true)} />
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}