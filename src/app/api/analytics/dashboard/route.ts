import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const profileId = auth.profile.id;

    const [ApplicatioMetrics, offerMetrics, rejectedMetrics, inRounds] = await Promise.all([
      prisma.application.count({ where: { userId: profileId } }),
      prisma.application.count({ where: { userId: profileId, status: "OFFER" } }),
      prisma.application.count({ where: { userId: profileId, status: "REJECTED" } }),
      prisma.application.count({
        where: {
          userId: profileId,
          status: { in: ["TECHNICAL_ROUND", "HR_ROUND", "FINAL_ROUND", "INTERVIEW", "OA"] },
        },
      }),
    ]);

    const responseRate = ApplicatioMetrics > 0 ? inRounds / ApplicatioMetrics : 0;
    const offerRate = ApplicatioMetrics > 0 ? offerMetrics / ApplicatioMetrics : 0;

    return NextResponse.json({
      ApplicatioMetrics,
      offerMetrics,
      rejectedMetrics,
      inRounds,
      offerRate,
      responseRate,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch dashboard metrics." }, { status: 500 });
  }
}
