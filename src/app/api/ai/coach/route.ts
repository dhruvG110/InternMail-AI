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
      select: { status: true, source: true },
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

    const responseRate =
      totalApplications > 0 ? ((offers + interviews) / totalApplications) * 100 : 0;

    const sourceMap = new Map<string, number>();
    applications.forEach((app) => {
      sourceMap.set(app.source, (sourceMap.get(app.source) || 0) + 1);
    });

    let topSource = "N/A";
    let maxCount = 0;
    sourceMap.forEach((count, source) => {
      if (count > maxCount) {
        maxCount = count;
        topSource = source;
      }
    });

    const prompt = `
Act as an experienced career coach.

Analyze the following internship/job search data.

Profile:
Target Role: ${profile.targetRole ?? "Not Specified"}
Preferred Location: ${profile.preferredLocation ?? "Not Specified"}

Statistics:
Total Applications: ${totalApplications}
Offers: ${offers}
Rejections: ${rejections}
Interviews: ${interviews}
Response Rate: ${responseRate.toFixed(2)}%
Top Source: ${topSource}

Provide:

1. What's going well
2. What's going wrong
3. Resume Suggestions
4. Application Strategy
5. Interview Preparation Strategy
6. Next 7 Day Action Plan

DONT INCLUDE ANY **** or ### or * in the end of the sentence or the starting keep it simple and concise and point wise
Keep the advice actionable.
`;

    const cached = await getCachedAIResponse({
      profileId: profile.id,
      type: AIGenerationType.COACH,
      prompt,
    });

    if (cached) {
      return NextResponse.json({
        message: "Career coaching retrieved from cache.",
        advice: cached.response,
        cached: true,
      });
    }

    const rateLimit = await checkAIRateLimit(profile.id);
    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimit.message }, { status: 429 });
    }

    const response = await generateAIResponse(prompt);

    await saveAIResponse({
      profileId: profile.id,
      type: AIGenerationType.COACH,
      prompt,
      response,
    });

    return NextResponse.json({
      message: "Career coaching generated.",
      advice: response,
      cached: false,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to generate coaching." }, { status: 500 });
  }
}
