"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications, useDeleteApplication } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationStatus, ApplicationSource } from "@/generated/prisma/enums";
import { ApplicationFormDialog } from "@/components/applications/application-form-dialog";

const statusColors: Record<ApplicationStatus, string> = {
  SAVED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  APPLIED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  OA: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  TECHNICAL_ROUND: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  HR_ROUND: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  FINAL_ROUND: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  INTERVIEW: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  OFFER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  WITHDRAWN: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};

const sourceLabels: Record<ApplicationSource, string> = {
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  CAREERS_PAGE: "Careers Page",
  COLD_EMAIL: "Cold Email",
  CAMPUS: "Campus",
  INDEED: "Indeed",
  OTHER: "Other",
};

export default function ApplicationsPage() {
  const { data: applicationsData, isLoading } = useApplications();
  const { mutate: deleteApplication } = useDeleteApplication();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
    }
  };

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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Applications</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Track and manage all your job applications in one place.
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          size="lg" 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </motion.div>

      {/* Create/Edit Dialog */}
      <ApplicationFormDialog
        open={showCreateDialog || !!editingId}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingId(null);
          }
        }}
        applicationId={editingId}
      />

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {applicationsData?.Application?.length || 0} applications total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : applicationsData?.Application && applicationsData.Application.length > 0 ? (
              <div className="space-y-4">
                {applicationsData.Application.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                          {app.companyName}
                        </h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {app.roleTitle}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {app.location && (
                          <div className="flex items-center gap-2">
                            <span>{app.location}</span>
                            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>{sourceLabels[app.source]}</span>
                          <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        </div>
                        <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Actions container: aligns right on mobile with a subtle top border for separation */}
                    <div className="flex items-center justify-end gap-1 sm:gap-2 pt-3 sm:pt-0 mt-1 sm:mt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(app.id)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(app.id)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-center px-4">
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm">
                  No applications yet. Start by creating your first application!
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 w-full sm:w-auto"
                >
                  Create Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}