"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/lib/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  targetRole: z.string().optional(),
  graduationYear: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  preferredLocation: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: profileData, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profileData?.profile) {
      reset({
        fullName: profileData.profile.fullName,
        targetRole: profileData.profile.targetRole || "",
        graduationYear: profileData.profile.graduationYear?.toString() || "",
        preferredLocation: profileData.profile.preferredLocation || "",
        avatarUrl: profileData.profile.avatarUrl || "",
      });
    }
  }, [profileData, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Manage your profile information and preferences.
        </p>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update your personal and professional details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 sm:h-12 w-full" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g., Software Engineer, Product Manager"
                    {...register("targetRole")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="2025"
                    {...register("graduationYear")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredLocation">Preferred Location</Label>
                  <Input
                    id="preferredLocation"
                    placeholder="e.g., San Francisco, Remote"
                    {...register("preferredLocation")}
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your login email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 sm:h-12 w-full" />
            ) : (
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200">
                {profileData?.profile?.email}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}