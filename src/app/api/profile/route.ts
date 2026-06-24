import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

type ProfileUpdatePayload = {
  fullName?: string;
  avatarUrl?: string;
  targetRole?: string;
  graduationYear?: number;
  preferredLocation?: string;
};

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    return NextResponse.json({ profile: auth.profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch profile." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const data: ProfileUpdatePayload = await req.json();
    const updateData: Record<string, unknown> = {};

    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.targetRole !== undefined) updateData.targetRole = data.targetRole;
    if (data.graduationYear !== undefined) updateData.graduationYear = data.graduationYear;
    if (data.preferredLocation !== undefined) updateData.preferredLocation = data.preferredLocation;

    const profile = await prisma.profile.update({
      where: { id: auth.profile.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        targetRole: true,
        graduationYear: true,
        preferredLocation: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to update profile." }, { status: 500 });
  }
}
