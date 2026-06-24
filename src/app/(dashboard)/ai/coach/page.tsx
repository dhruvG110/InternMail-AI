"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAICoach } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoachPage() {
  const { mutate: generateCoaching, data: coaching, isPending, isError, error } = useAICoach();

  const handleGenerate = () => {
    generateCoaching();
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Career Coach</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Get personalized career coaching from AI.
        </p>
      </motion.div>

      {/* Coaching Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          {/* Made responsive: stacked on mobile, row on small screens and up */}
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Personalized Coaching</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                AI-generated career advice based on your progress
              </CardDescription>
            </div>
            {/* Button spans full width on mobile for better UX */}
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              size="sm"
              className="w-full sm:w-auto gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Coaching...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Coaching
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
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-4 sm:h-6 w-full" />
                ))}
              </div>
            ) : coaching?.advice ? (
              <div className="space-y-6">
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                  {coaching.advice.split("\n\n").map((section, i) => (
                    <div key={i}>
                      {section.split("\n").map((line, j) => {
                        if (line.match(/^#+/)) {
                          return (
                            <h3 key={j} className="mt-4 font-semibold text-slate-900 dark:text-white">
                              {line.replace(/^#+\s*/, "")}
                            </h3>
                          );
                        }
                        if (line.startsWith("- ") || line.startsWith("* ")) {
                          return (
                            <li key={j} className="ml-4 sm:ml-6 text-slate-700 dark:text-slate-300">
                              {line.replace(/^[-*]\s*/, "")}
                            </li>
                          );
                        }
                        return line.trim() && (
                          <p key={j} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                <Sparkles className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md">
                  No coaching generated yet. Click the button above to get personalized advice!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How to Get the Most Out of AI Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 sm:space-y-3">
              <li className="flex gap-3 items-start sm:items-center">
                <span className="font-bold text-primary flex-shrink-0 mt-0.5 sm:mt-0">1</span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  Complete your profile with your target role and preferred location
                </span>
              </li>
              <li className="flex gap-3 items-start sm:items-center">
                <span className="font-bold text-primary flex-shrink-0 mt-0.5 sm:mt-0">2</span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  Regularly update your application status as you progress
                </span>
              </li>
              <li className="flex gap-3 items-start sm:items-center">
                <span className="font-bold text-primary flex-shrink-0 mt-0.5 sm:mt-0">3</span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  Generate coaching multiple times to get fresh perspectives
                </span>
              </li>
              <li className="flex gap-3 items-start sm:items-center">
                <span className="font-bold text-primary flex-shrink-0 mt-0.5 sm:mt-0">4</span>
                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  Implement the suggestions and track your progress
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}