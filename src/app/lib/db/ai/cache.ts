import prisma from "@/app/lib/db/prismaClient";
import type { AIGenerationType } from "@/generated/prisma/enums";

const HOURLY_LIMIT = 10;
const DAILY_LIMIT = 30;

export async function checkAIRateLimit(profileId: number) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [hourlyCount, dailyCount] = await Promise.all([
    prisma.aIGeneration.count({
      where: { userId: profileId, createdAt: { gte: oneHourAgo } },
    }),
    prisma.aIGeneration.count({
      where: { userId: profileId, createdAt: { gte: oneDayAgo } },
    }),
  ]);

  if (hourlyCount >= HOURLY_LIMIT) {
    return {
      allowed: false as const,
      message: `AI generation limit reached (${HOURLY_LIMIT} requests per hour). Please try again later.`,
    };
  }

  if (dailyCount >= DAILY_LIMIT) {
    return {
      allowed: false as const,
      message: `Daily AI limit reached (${DAILY_LIMIT} requests per day). Please try again tomorrow.`,
    };
  }

  return { allowed: true as const };
}

export async function getCachedAIResponse(params: {
  profileId: number;
  type: AIGenerationType;
  prompt: string;
  applicationId?: number | null;
}) {
  return prisma.aIGeneration.findFirst({
    where: {
      userId: params.profileId,
      type: params.type,
      prompt: params.prompt,
      applicationId: params.applicationId ?? null,
    },
    orderBy: { createdAt: "desc" },
    select: { response: true },
  });
}

export async function saveAIResponse(params: {
  profileId: number;
  type: AIGenerationType;
  prompt: string;
  response: string;
  applicationId?: number | null;
}) {
  return prisma.aIGeneration.create({
    data: {
      userId: params.profileId,
      type: params.type,
      prompt: params.prompt,
      response: params.response,
      applicationId: params.applicationId ?? null,
    },
  });
}
