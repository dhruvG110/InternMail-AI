"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar as CalendarIcon, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterviews, useCreateInterview } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewFormDialog } from "@/components/interviews/interview-form-dialog";

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const roundColors = {
  OA: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  TECHNICAL: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  HR: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  FINAL: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export default function InterviewsPage() {
  const { data: interviewsData, isLoading } = useInterviews();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const sortedInterviews = interviewsData?.interviews
    ? [...interviewsData.interviews].sort((a, b) => {
        return new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime();
      })
    : [];

  const upcomingInterviews = sortedInterviews.filter(
    (i) => new Date(i.interviewDate) > new Date()
  );
  const pastInterviews = sortedInterviews.filter(
    (i) => new Date(i.interviewDate) <= new Date()
  );

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Interviews</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Schedule and track your interview rounds.
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </motion.div>

      {/* Create/Edit Dialog */}
      <InterviewFormDialog
        open={showCreateDialog || !!editingId}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingId(null);
          }
        }}
      />

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {upcomingInterviews.length} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {upcomingInterviews.map((interview) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                          {interview.application?.companyName}
                        </h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roundColors[interview.round]}`}>
                          {interview.round}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {interview.application?.roleTitle}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {new Date(interview.interviewDate).toLocaleDateString()} at{" "}
                          {new Date(interview.interviewDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className={`rounded-full px-2.5 py-0.5 font-medium ${statusColors[interview.status]}`}>
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Past Interviews</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {pastInterviews.length} completed or cancelled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {pastInterviews.map((interview) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-slate-200 p-4 opacity-75 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                          {interview.application?.companyName}
                        </h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roundColors[interview.round]}`}>
                          {interview.round}
                        </span>
                      </div>
                      {interview.feedback && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {interview.feedback}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 sm:h-20 w-full" />
          ))}
        </div>
      ) : sortedInterviews.length === 0 ? (
        <Card>
          <CardContent className="flex h-40 flex-col items-center justify-center px-4">
            <div className="text-center">
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No interviews scheduled yet.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 w-full sm:w-auto"
              >
                Schedule an Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}