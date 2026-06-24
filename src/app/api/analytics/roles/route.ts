import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const applications = await prisma.application.groupBy({
      by: ["roleTitle"],
      where: { userId: auth.profile.id },
      _count: { roleTitle: true },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch role analytics." }, { status: 500 });
  }
}
