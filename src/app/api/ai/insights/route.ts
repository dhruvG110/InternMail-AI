import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";
import { generateAIResponse } from "@/app/lib/db/ai/gemini";
import { checkAIRateLimit, getCachedAIResponse, saveAIResponse } from "@/app/lib/db/ai/cache";
import { AIGenerationType, ApplicationStatus } from "@/generated/prisma/enums";

export async function POST() {
  try {
    const auth = await getAuthenticatedProfile();

    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const profile = auth.profile;

    const applications = await prisma.application.findMany({
      where: { userId: profile.id },
      select: { status: true, source: true, roleTitle: true },
    });

    const totalApplications = applications.length;
    const offers = applications.filter((app) => app.status === ApplicationStatus.OFFER).length;
    const rejections = applications.filter((app) => app.status === ApplicationStatus.REJECTED).length;
    const interviews = applications.filter(
      (app) =>
        app.status === ApplicationStatus.INTERVIEW ||
        app.status === ApplicationStatus.HR_ROUND ||
        app.status === ApplicationStatus.TECHNICAL_ROUND ||
        app.status === ApplicationStatus.FINAL_ROUND,
    ).length;

    const responseCount = applications.filter(
      (app) =>
        app.status !== ApplicationStatus.APPLIED && app.status !== ApplicationStatus.SAVED,
    ).length;

    const responseRate = totalApplications > 0 ? (responseCount / totalApplications) * 100 : 0;
    const offerRate = totalApplications > 0 ? (offers / totalApplications) * 100 : 0;

    const sourceMap = new Map<string, number>();
    const roleMap = new Map<string, number>();

    applications.forEach((app) => {
      sourceMap.set(app.source, (sourceMap.get(app.source) || 0) + 1);
      roleMap.set(app.roleTitle, (roleMap.get(app.roleTitle) || 0) + 1);
    });

    let topSource = "N/A";
    let sourceCount = 0;
    sourceMap.forEach((count, source) => {
      if (count > sourceCount) {
        sourceCount = count;
        topSource = source;
      }
    });

    let topRole = "N/A";
    let roleCount = 0;
    roleMap.forEach((count, role) => {
      if (count > roleCount) {
        roleCount = count;
        topRole = role;
      }
    });

    const prompt = `
Analyze the following internship/job application statistics.

Statistics:

Total Applications: ${totalApplications}

Offers: ${offers}

Rejections: ${rejections}

Interviews: ${interviews}

Response Rate: ${responseRate.toFixed(2)}%

Offer Rate: ${offerRate.toFixed(2)}%

Top Source: ${topSource}

Top Role: ${topRole}

Provide:

1. Performance Summary

2. Key Strengths

3. Key Weaknesses

4. Application Strategy Suggestions

5. Resume Suggestions

6. Interview Preparation Suggestions

7. Final Actionable Insights
 DONT INCLUDE ANY **** or ### in the end of the sentence or the starting keep it simple and concise and point wise
Keep the response concise and practical.
`;

    const cached = await getCachedAIResponse({
      profileId: profile.id,
      type: AIGenerationType.INSIGHT,
      prompt,
    });

    if (cached) {
      return NextResponse.json({
        message: "Insights retrieved from cache.",
        insights: cached.response,
        cached: true,
        stats: {
          totalApplications,
          offers,
          rejections,
          interviews,
          responseRate,
          offerRate,
          topSource,
          topRole,
        },
      });
    }

    const rateLimit = await checkAIRateLimit(profile.id);
    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimit.message }, { status: 429 });
    }

    const response = await generateAIResponse(prompt);

    await saveAIResponse({
      profileId: profile.id,
      type: AIGenerationType.INSIGHT,
      prompt,
      response,
    });

    return NextResponse.json({
      message: "Insights generated.",
      insights: response,
      cached: false,
      stats: {
        totalApplications,
        offers,
        rejections,
        interviews,
        responseRate,
        offerRate,
        topSource,
        topRole,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to generate insights." }, { status: 500 });
  }
}
