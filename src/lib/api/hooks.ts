"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  Resume,
  CreateResumeInput,
  Interview,
  CreateInterviewInput,
  Profile,
  UpdateProfileInput,
  AIInsights,
  AICoachingResponse,
} from "./types";

const STALE_TIME = 1000 * 60 * 5;
const GC_TIME = 1000 * 60 * 10;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message ?? "Request failed");
  }

  return body as T;
}

export const queryKeys = {
  applications: ["applications"] as const,
  application: (id: number) => ["applications", id] as const,
  resumes: ["resumes"] as const,
  interviews: ["interviews"] as const,
  profile: ["profile"] as const,
  analyticsDashboard: ["analytics", "dashboard"] as const,
};

export function prefetchDashboardQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.prefetchQuery({
    queryKey: queryKeys.analyticsDashboard,
    queryFn: () => fetchJson("/api/analytics/dashboard"),
    staleTime: STALE_TIME,
  });
  void queryClient.prefetchQuery({
    queryKey: queryKeys.applications,
    queryFn: () => fetchJson<{ Application: Application[] }>("/api/applications"),
    staleTime: STALE_TIME,
  });
  void queryClient.prefetchQuery({
    queryKey: queryKeys.profile,
    queryFn: () => fetchJson<{ profile: Profile }>("/api/profile"),
    staleTime: STALE_TIME,
  });
  void queryClient.prefetchQuery({
    queryKey: queryKeys.interviews,
    queryFn: () => fetchJson<{ interviews: Interview[] }>("/api/interviews"),
    staleTime: STALE_TIME,
  });
}

export function useApplications() {
  return useQuery<{ Application: Application[] }>({
    queryKey: queryKeys.applications,
    queryFn: () => fetchJson("/api/applications"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useApplication(id: number) {
  return useQuery<{ Application: Application }>({
    queryKey: queryKeys.application(id),
    queryFn: () => fetchJson(`/api/applications/${id}`),
    enabled: !!id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApplicationInput) => {
      return fetchJson("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications });
      queryClient.invalidateQueries({ queryKey: queryKeys.analyticsDashboard });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateApplicationInput;
    }) => {
      return fetchJson(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.application(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.analyticsDashboard,
      });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return fetchJson(`/api/applications/${id}`, { method: "DELETE" });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.applications });
      const previous = queryClient.getQueryData<{ Application: Application[] }>(queryKeys.applications);

      if (previous?.Application) {
        queryClient.setQueryData(queryKeys.applications, {
          Application: previous.Application.filter((app) => app.id !== id),
        });
      }

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.applications, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications });
      queryClient.invalidateQueries({ queryKey: queryKeys.analyticsDashboard });
    },
  });
}

export function useResumes() {
  return useQuery<{ resumes: Resume[] }>({
    queryKey: queryKeys.resumes,
    queryFn: () => fetchJson("/api/resumes"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResumeInput) => {
      return fetchJson("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes });
    },
  });
}

export function useInterviews() {
  return useQuery<{ interviews: Interview[] }>({
    queryKey: queryKeys.interviews,
    queryFn: () => fetchJson("/api/interviews"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInterviewInput) => {
      return fetchJson("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications });
    },
  });
}

export function useProfile() {
  return useQuery<{ profile: Profile }>({
    queryKey: queryKeys.profile,
    queryFn: () => fetchJson("/api/profile"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      return fetchJson("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useDashboardMetrics() {
  return useQuery<{
    ApplicatioMetrics: number;
    offerMetrics: number;
    rejectedMetrics: number;
    inRounds: number;
    responseRate: number;
    offerRate: number;
  }>({
    queryKey: queryKeys.analyticsDashboard,
    queryFn: () => fetchJson("/api/analytics/dashboard"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useAIInsights() {
  return useMutation<AIInsights, Error>({
    mutationFn: async () => {
      return fetchJson("/api/ai/insights", { method: "POST" });
    },
  });
}

export function useAICoach() {
  return useMutation<AICoachingResponse, Error>({
    mutationFn: async () => {
      return fetchJson("/api/ai/coach", { method: "POST" });
    },
  });
}
