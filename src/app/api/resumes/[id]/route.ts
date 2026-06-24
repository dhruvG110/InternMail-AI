import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

type ResumeUpdatePayload = {
  name?: string;
  fileUrl?: string;
  isDefault?: boolean;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const { id: resumeId } = await params;
    const resume = await prisma.resume.findFirst({
      where: {
        id: Number(resumeId),
        userId: auth.profile.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ message: "Resume not found." }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch resume." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const { id: resumeId } = await params;
    const data: ResumeUpdatePayload = await req.json();

    const existing = await prisma.resume.findFirst({
      where: { id: Number(resumeId), userId: auth.profile.id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Resume not found." }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    if (data.isDefault === true) {
      await prisma.resume.updateMany({
        where: { userId: auth.profile.id },
        data: { isDefault: false },
      });
    }

    const resume = await prisma.resume.update({
      where: { id: Number(resumeId) },
      data: updateData,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to update resume." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const { id: resumeId } = await params;

    const existing = await prisma.resume.findFirst({
      where: { id: Number(resumeId), userId: auth.profile.id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Resume not found." }, { status: 404 });
    }

    await prisma.resume.delete({ where: { id: Number(resumeId) } });

    return NextResponse.json({ message: "Resume deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to delete resume." }, { status: 500 });
  }
}
