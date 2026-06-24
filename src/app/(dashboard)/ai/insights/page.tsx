"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAIInsights, useDashboardMetrics } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsPage() {
  const { mutate: generateInsights, data: insights, isPending, isError, error } = useAIInsights();
  const { data: metrics } = useDashboardMetrics();

  const handleGenerate = () => {
    generateInsights();
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">AI Insights</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Get AI-powered analysis of your application journey.
        </p>
      </motion.div>

      {/* Stats Overview */}
      {insights?.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* This grid is already responsive, but we ensure text sizes are clean */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Applications", value: insights.stats.totalApplications },
                  { label: "Offers", value: insights.stats.offers },
                  { label: "Rejections", value: insights.stats.rejections },
                  { label: "Interviews", value: insights.stats.interviews },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Response Rate</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {insights.stats.responseRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Offer Rate</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {insights.stats.offerRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          {/* Made responsive: stacked on mobile, row on small screens and up */}
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Personalized insights for your job search
              </CardDescription>
            </div>
            {/* Button spans full width on mobile */}
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              size="sm"
              className="w-full sm:w-auto gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Insights
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {isError && (
              <p className="mb-4 text-sm text-destructive">{error.message}</p>
            )}
            {isPending ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 sm:h-6 w-full" />
                ))}
              </div>
            ) : insights?.insights ? (
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                  {insights.insights.split("\n").map((paragraph, i) => (
                    paragraph.trim() && (
                      <p key={i} className="mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                <Sparkles className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md">
                  No insights generated yet. Click the button above to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}