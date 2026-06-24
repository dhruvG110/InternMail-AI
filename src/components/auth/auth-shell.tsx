"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type AuthShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formDescription: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AuthShell({
  badge,
  title,
  subtitle,
  formTitle,
  formDescription,
  children,
  footer,
  backHref = "/",
  backLabel = "Back to Home",
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20" />
        <div className="absolute left-0 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-100/20 blur-3xl dark:bg-blue-950/30" />
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InternTrack AI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="hidden items-center gap-1.5 text-sm text-gray-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 sm:flex"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
              {badge}
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-lg text-gray-600 dark:text-slate-300">{subtitle}</p>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8"
          >
            <div className="mb-6 space-y-1">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                {formTitle}
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{formDescription}</h2>
            </div>

            {children}

            <div className="mt-6 space-y-3 text-center text-sm text-gray-500 dark:text-slate-400">
              {footer}
              <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
