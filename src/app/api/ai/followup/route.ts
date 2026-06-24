import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";
import { generateAIResponse } from "@/app/lib/db/ai/gemini";
import { checkAIRateLimit, getCachedAIResponse, saveAIResponse } from "@/app/lib/db/ai/cache";
import { AIGenerationType, FollowupType } from "@/generated/prisma/enums";

type RequestPayload = {
  applicationId: number;
};

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedProfile();

    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const data: RequestPayload = await req.json();

    const application = await prisma.application.findFirst({
      where: {
        id: data.applicationId,
        userId: auth.profile.id,
      },
      select: { id: true, companyName: true, roleTitle: true },
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    const prompt = `
Generate:

1. Professional Follow-up Email

2. Professional LinkedIn Follow-up Message

Company: ${application.companyName}
Role: ${application.roleTitle}

Return in this format:

EMAIL:
...

LINKEDIN:
...
`;

    const cached = await getCachedAIResponse({
      profileId: auth.profile.id,
      type: AIGenerationType.FOLLOWUP,
      prompt,
      applicationId: application.id,
    });

    if (cached) {
      return NextResponse.json({
        message: "Follow-up retrieved from cache.",
        followup: cached.response,
        cached: true,
      });
    }

    const rateLimit = await checkAIRateLimit(auth.profile.id);
    if (!rateLimit.allowed) {
      return NextResponse.json({ message: rateLimit.message }, { status: 429 });
    }

    const response = await generateAIResponse(prompt);

    await saveAIResponse({
      profileId: auth.profile.id,
      type: AIGenerationType.FOLLOWUP,
      prompt,
      response,
      applicationId: application.id,
    });

    await prisma.followup.create({
      data: {
        applicationId: application.id,
        type: FollowupType.EMAIL,
        content: response,
      },
    });

    return NextResponse.json({
      message: "Follow-up generated.",
      followup: response,
      cached: false,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to generate follow-up." }, { status: 500 });
  }
}
