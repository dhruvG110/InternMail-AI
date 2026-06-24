import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "OA"
  | "TECHNICAL_ROUND"
  | "HR_ROUND"
  | "FINAL_ROUND"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

type ApplicationSource =
  | "LINKEDIN"
  | "REFERRAL"
  | "CAREERS_PAGE"
  | "COLD_EMAIL"
  | "CAMPUS"
  | "INDEED"
  | "OTHER";

type RequestPayload = {
  companyName?: string;
  roleTitle?: string;
  jobUrl?: string;
  status?: ApplicationStatus;
  source?: ApplicationSource;
  referralUsed?: boolean;
  notes?: string;
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

    const { id: applicationId } = await params;
    const application = await prisma.application.findFirst({
      where: {
        id: Number(applicationId),
        userId: auth.profile.id,
      },
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ Application: application });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch application." }, { status: 500 });
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

    const { id: applicationId } = await params;
    const data: RequestPayload = await req.json();

    const existingApplication = await prisma.application.findFirst({
      where: {
        id: Number(applicationId),
        userId: auth.profile.id,
      },
    });

    if (!existingApplication) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.jobUrl !== undefined) updateData.jobUrl = data.jobUrl;
    if (data.referralUsed !== undefined) updateData.referralUsed = data.referralUsed;
    if (data.roleTitle !== undefined) updateData.roleTitle = data.roleTitle;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;

    const application = await prisma.application.update({
      where: { id: Number(applicationId) },
      data: updateData,
    });

    return NextResponse.json({ updatedApplication: application });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to update application." }, { status: 500 });
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

    const { id: applicationId } = await params;

    const existingApplication = await prisma.application.findFirst({
      where: {
        id: Number(applicationId),
        userId: auth.profile.id,
      },
    });

    if (!existingApplication) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    await prisma.application.delete({
      where: { id: Number(applicationId) },
    });

    return NextResponse.json({ message: "Application deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to delete application." }, { status: 500 });
  }
}
