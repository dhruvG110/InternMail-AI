"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardMetrics } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  const chartData = metrics ? [
    { name: "All Applications", value: metrics.ApplicatioMetrics, fill: "#6445BA" },
    { name: "Offers", value: metrics.offerMetrics, fill: "#22c55e" },
    { name: "Rejections", value: metrics.rejectedMetrics, fill: "#ef4444" },
  ] : [];

  const rateData = metrics ? [
    { name: "Response Rate", value: (metrics.responseRate * 100).toFixed(1) },
    { name: "Offer Rate", value: (metrics.offerRate * 100).toFixed(1) },
  ] : [];

  const COLORS = ["#6445BA", "#22c55e", "#ef4444"];

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Insights into your internship application journey.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Applications", value: metrics?.ApplicatioMetrics, icon: "📊" },
          { label: "Offers", value: metrics?.offerMetrics, icon: "✅" },
          { label: "Rejections", value: metrics?.rejectedMetrics, icon: "❌" },
          { label: "In Rounds", value: metrics?.inRounds, icon: "🎯" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <Skeleton className="h-10 sm:h-12 w-full" />
                ) : (
                  <>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{item.label}</p>
                    <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Breakdown of all applications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] sm:h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Response & Offer Rates</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Percentage metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] sm:h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6445BA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 sm:h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                  <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Response Rate</span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {(metrics?.responseRate ? metrics.responseRate * 100 : 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                  <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Offer Rate</span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {(metrics?.offerRate ? metrics.offerRate * 100 : 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                  <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Rejection Rate</span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {metrics?.ApplicatioMetrics && metrics?.rejectedMetrics
                      ? ((metrics.rejectedMetrics / metrics.ApplicatioMetrics) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">In Progress</span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {metrics?.inRounds}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}