"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useProfile } from "@/lib/api/hooks";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const { data: profileData } = useProfile();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 dark:border-slate-700 dark:bg-slate-950"
    >
      {/* Left Side: Mobile Hamburger Menu */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden mr-2"
        >
          <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      {/* Right Side: Theme & User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {session?.user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {profileData?.profile?.fullName || session.user.name || "Account"}
              </p>
              {profileData?.profile?.email && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profileData.profile.email}
                </p>
              )}
            </div>
            
            {/* Mobile Fallback Avatar */}
            <div className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-1 sm:ml-2"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}