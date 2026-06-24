"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Download, Trash2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResumes, useCreateResume } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumesPage() {
  const { data: resumesData, isLoading } = useResumes();
  const { mutate: createResume, isPending } = useCreateResume();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", fileUrl: "", isDefault: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createResume(formData, {
      onSuccess: () => {
        setFormData({ name: "", fileUrl: "", isDefault: false });
        setShowUploadForm(false);
      },
    });
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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Resumes</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Manage your resume versions and uploads.
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(!showUploadForm)} 
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Resume
        </Button>
      </motion.div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Add a new resume version</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resume Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Resume 2025"
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm sm:text-base dark:border-slate-700 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">File URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm sm:text-base dark:border-slate-700 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    required
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your resume to a file hosting service and paste the URL here
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <label htmlFor="isDefault" className="text-sm cursor-pointer select-none">
                    Set as default resume
                  </label>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending} className="w-full sm:flex-1">
                    {isPending ? "Uploading..." : "Upload Resume"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resumes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Your Resumes</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {resumesData?.resumes?.length || 0} resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 sm:h-16 w-full" />
                ))}
              </div>
            ) : resumesData?.resumes && resumesData.resumes.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {resumesData.resumes.map((resume) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex flex-1 items-start sm:items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                            {resume.name}
                          </h3>
                          {resume.isDefault && (
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Created {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 sm:gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-center px-4">
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  No resumes uploaded yet. Add your first resume!
                </p>
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="w-full sm:w-auto"
                >
                  Upload Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}