import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const profileFilter = { userId: auth.profile.id };

    const [appliedCount, oaCount, techRCount, hrRCount, finalRCount, offerCount] =
      await Promise.all([
        prisma.application.count({ where: { ...profileFilter, status: "APPLIED" } }),
        prisma.application.count({ where: { ...profileFilter, status: "OA" } }),
        prisma.application.count({ where: { ...profileFilter, status: "TECHNICAL_ROUND" } }),
        prisma.application.count({ where: { ...profileFilter, status: "HR_ROUND" } }),
        prisma.application.count({ where: { ...profileFilter, status: "FINAL_ROUND" } }),
        prisma.application.count({ where: { ...profileFilter, status: "OFFER" } }),
      ]);

    return NextResponse.json({
      appliedCount,
      oaCount,
      techRCount,
      hrRCount,
      finalRCount,
      offerCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch funnel data." }, { status: 500 });
  }
}
