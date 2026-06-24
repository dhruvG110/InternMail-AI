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
  companyName: string;
  roleTitle: string;
  jobUrl: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  referralUsed: boolean;
  notes: string;
};

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedProfile();

    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const data: RequestPayload = await req.json();

    if (!data.companyName?.trim() || !data.roleTitle?.trim()) {
      return NextResponse.json({ message: "Company name and role title are required." }, { status: 400 });
    }

    const newApplication = await prisma.application.create({
      data: {
        companyName: data.companyName.trim(),
        source: data.source,
        jobUrl: data.jobUrl?.trim() || null,
        referralUsed: data.referralUsed ?? false,
        notes: data.notes?.trim() || null,
        status: data.status,
        roleTitle: data.roleTitle.trim(),
        appliedDate: new Date(),
        userId: auth.profile.id,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to create application." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();

    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId: auth.profile.id },
      orderBy: { appliedDate: "desc" },
      select: {
        id: true,
        userId: true,
        companyName: true,
        roleTitle: true,
        jobUrl: true,
        location: true,
        status: true,
        source: true,
        referralUsed: true,
        resumeId: true,
        appliedDate: true,
        lastFollowupDate: true,
        followupCount: true,
        salaryRange: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ Application: applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch applications." }, { status: 500 });
  }
}
