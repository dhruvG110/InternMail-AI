"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  Home,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/applications", icon: Briefcase, label: "Applications" },
  { href: "/resumes", icon: FileText, label: "Resumes" },
  { href: "/interviews", icon: Calendar, label: "Interviews" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/ai/insights", icon: Sparkles, label: "AI Insights" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/ai/coach", icon: GraduationCap, label: "AI Coach" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // Auto-close the mobile drawer when navigating to a new route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-950",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-64 md:w-auto"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
          <div className={cn("overflow-hidden whitespace-nowrap transition-all", collapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100")}>
            <span className="text-lg font-semibold text-slate-950 dark:text-white">
              InternTrack
            </span>
          </div>
          {/* Desktop Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-8 w-8 shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="px-3 pt-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className={cn("whitespace-nowrap transition-all", collapsed ? "md:hidden" : "block")}>
              Back to Home
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 py-4 scrollbar-thin">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors mb-1",
                    isActive
                      ? "text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0 z-10" />
                  <span className={cn("whitespace-nowrap z-10 transition-all", collapsed ? "md:hidden" : "block")}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}