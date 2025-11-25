"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/dashboard/components/SideBar";
import DashboardTopbar from "@/app/dashboard/components/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Auto-close when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && open) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Lock body scroll on mobile open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Sidebar drawer */}
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-[#006D77] shadow-2xl transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar onClose={() => setOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:ml-64">

        {/* Topbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white border-b border-gray-200 shadow-sm">
          <DashboardTopbar onMenuClick={() => setOpen(true)} />
        </div>

        {/* Content scroll area */}
        <main className="flex-1 overflow-y-auto pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
