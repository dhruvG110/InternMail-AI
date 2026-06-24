"use client";

import { motion } from "framer-motion";
import { TrendingUp, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardMetrics, useApplications, useInterviews } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

const statItems = [
  {
    title: "Total Applications",
    icon: Briefcase,
    color: "from-blue-600 to-blue-400",
    key: "ApplicatioMetrics",
  },
  {
    title: "Offers",
    icon: CheckCircle,
    color: "from-green-600 to-green-400",
    key: "offerMetrics",
  },
  {
    title: "Rejections",
    icon: XCircle,
    color: "from-red-600 to-red-400",
    key: "rejectedMetrics",
  },
  {
    title: "Response Rate",
    icon: TrendingUp,
    color: "from-purple-600 to-purple-400",
    key: "responseRate",
  },
];

type StatCardProps = {
  title: string;
  icon: LucideIcon;
  color: string;
  value: number | string | undefined;
  isLoading: boolean;
  isPercentage?: boolean;
};

function StatCard({
  title,
  icon: Icon,
  color,
  value,
  isLoading,
  isPercentage = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                {title}
              </p>

              {isLoading ? (
                <Skeleton className="mt-2 h-6 sm:h-8 w-16 sm:w-20" />
              ) : (
                <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">
                  {isPercentage && typeof value === "number"
                    ? `${(value * 100).toFixed(1)}%`
                    : value ?? 0}
                </p>
              )}
            </div>

            <div className={`shrink-0 rounded-lg bg-gradient-to-br ${color} p-2 sm:p-3`}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: appData, isLoading: appsLoading } = useApplications();
  const { data: interviewData, isLoading: interviewsLoading } = useInterviews();

  const isLoading = metricsLoading || appsLoading || interviewsLoading;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Welcome back! Here's your internship application summary.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard
              title={item.title}
              icon={item.icon}
              color={item.color}
              value={metrics?.[item.key as keyof typeof metrics]}
              isLoading={isLoading}
              isPercentage={item.key === "responseRate"}
            />
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your latest job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : appData?.Application && appData.Application.length > 0 ? (
                <ul className="space-y-3">
                  {appData.Application.slice(0, 3).map((app) => (
                    <li
                      key={app.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {app.companyName}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                          {app.roleTitle}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-primary">
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No applications yet. Start by adding your first application!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your next scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : interviewData?.interviews && interviewData.interviews.length > 0 ? (
                <ul className="space-y-3">
                  {interviewData.interviews.slice(0, 3).map((interview) => (
                    <li
                      key={interview.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {interview.application?.companyName}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                          {interview.round} Round
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-primary">
                        {new Date(interview.interviewDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No interviews scheduled yet.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}