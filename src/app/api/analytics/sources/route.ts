import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const applicationSource = await prisma.application.groupBy({
      by: ["source"],
      where: { userId: auth.profile.id },
      _count: { source: true },
    });

    return NextResponse.json({ applicationSource });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch source analytics." }, { status: 500 });
  }
}
