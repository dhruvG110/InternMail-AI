"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { prefetchDashboardQueries } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Lifted mobile state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    prefetchDashboardQueries(queryClient);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      {/* Pass the toggle down to the Navbar */}
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <main 
        className={cn(
          "mt-16 p-4 sm:p-8 transition-all duration-300",
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}