"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateInterview, useApplications } from "@/lib/api/hooks";

const interviewSchema = z.object({
  applicationId: z.number().min(1, "Application is required"),
  interviewDate: z.string().min(1, "Interview date is required"),
  round: z.enum(["OA", "TECHNICAL", "HR", "FINAL"]),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  feedback: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

interface InterviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewFormDialog({
  open,
  onOpenChange,
}: InterviewFormDialogProps) {
  const { data: applicationsData } = useApplications();
  const { mutate: createInterview, isPending } = useCreateInterview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
  });

  const onSubmit = (data: InterviewFormValues) => {
    createInterview(data as any);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Add a new interview round for an application
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicationId">Application</Label>
            <select
              id="applicationId"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              {...register("applicationId", { valueAsNumber: true })}
            >
              <option value="">Select an application</option>
              {applicationsData?.Application?.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} - {app.roleTitle}
                </option>
              ))}
            </select>
            {errors.applicationId && (
              <p className="text-sm text-red-500">{errors.applicationId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewDate">Interview Date & Time</Label>
            <Input
              id="interviewDate"
              type="datetime-local"
              {...register("interviewDate")}
            />
            {errors.interviewDate && (
              <p className="text-sm text-red-500">{errors.interviewDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="round">Interview Round</Label>
              <select
                id="round"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                {...register("round")}
              >
                <option value="OA">OA</option>
                <option value="TECHNICAL">Technical</option>
                <option value="HR">HR</option>
                <option value="FINAL">Final</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                {...register("status")}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <textarea
              id="feedback"
              placeholder="Add interview feedback..."
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              {...register("feedback")}
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
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
