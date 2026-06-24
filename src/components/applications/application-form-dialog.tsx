"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateApplication, useUpdateApplication, useApplication } from "@/lib/api/hooks";
import { ApplicationStatus, ApplicationSource } from "@/generated/prisma/enums";

const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  jobUrl: z.string().url("Must be a valid URL"),
  status: z.enum(["SAVED", "APPLIED", "OA", "TECHNICAL_ROUND", "HR_ROUND", "FINAL_ROUND", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"]),
  source: z.enum(["LINKEDIN", "REFERRAL", "CAREERS_PAGE", "COLD_EMAIL", "CAMPUS", "INDEED", "OTHER"]),
  referralUsed: z.boolean(),
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId?: number | null;
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  applicationId,
}: ApplicationFormDialogProps) {
  console.log(applicationId)
  const { data: existingApp } =
  useApplication(applicationId ?? 0);
  const { mutate: createApplication, isPending: isCreating } = useCreateApplication();
  const { mutate: updateApplication ,isPending:isUpdating } =
  useUpdateApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    if (existingApp?.Application) {
      reset(existingApp.Application);
    } else {
      reset({
        companyName: "",
        roleTitle: "",
        jobUrl: "",
        status: "APPLIED",
        source: "LINKEDIN",
        referralUsed: false,
        notes: "",
      });
    }
  }, [existingApp, reset, open]);

  const onSubmit = (data: ApplicationFormValues) => {
    if (applicationId) {
      updateApplication({
        id: applicationId!,
        data,
      });
    } else {
      createApplication(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {applicationId ? "Edit Application" : "Create Application"}
          </DialogTitle>
          <DialogDescription>
            {applicationId
              ? "Update your application details"
              : "Add a new job application to track"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Google"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title</Label>
            <Input
              id="roleTitle"
              placeholder="Software Engineer Intern"
              {...register("roleTitle")}
            />
            {errors.roleTitle && (
              <p className="text-sm text-red-500">{errors.roleTitle.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              type="url"
              placeholder="https://..."
              {...register("jobUrl")}
            />
            {errors.jobUrl && (
              <p className="text-sm text-red-500">{errors.jobUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                {...register("status")}
              >
                <option value="SAVED">Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="OA">OA</option>
                <option value="TECHNICAL_ROUND">Technical Round</option>
                <option value="HR_ROUND">HR Round</option>
                <option value="FINAL_ROUND">Final Round</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                {...register("source")}
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="REFERRAL">Referral</option>
                <option value="CAREERS_PAGE">Careers Page</option>
                <option value="COLD_EMAIL">Cold Email</option>
                <option value="CAMPUS">Campus</option>
                <option value="INDEED">Indeed</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="referralUsed"
              className="h-4 w-4 rounded border-slate-300"
              {...register("referralUsed")}
            />
            <Label htmlFor="referralUsed" className="cursor-pointer">
              Used a referral
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              placeholder="Any additional notes..."
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              {...register("notes")}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
