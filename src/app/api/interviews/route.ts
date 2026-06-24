import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getSession } from "@/app/lib/db/session";
import { ApplicationStatus, InterviewStatus } from "@/generated/prisma/enums";

type InterviewRound = "OA" | "TECHNICAL" | "HR" | "FINAL";

// type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

type CreateInterviewPayload = {
  interviewDate?: string;
  round?: InterviewRound;
  status?: InterviewStatus;
  feedback?: string;
  applicationId:number
};
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "Please Login",
        },
        {
          status: 401,
        },
      );
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(session.userId),
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          message: "Profile not found",
        },
        {
          status: 404,
        },
      );
    }

    const interviews = await prisma.interview.findMany({
      where: {
        application: {
          userId: profile.id,
        },
      },
      include: {
        application: true,
      },
      orderBy: {
        interviewDate: "desc",
      },
    });

    return NextResponse.json(
      {
        interviews,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          message: "Please Login",
        },
        {
          status: 401,
        },
      );
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(session.userId),
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          message: "Profile not found",
        },
        {
          status: 404,
        },
      );
    }

    const data: CreateInterviewPayload = await req.json();

    if (
      !data.applicationId ||
      !data.interviewDate ||
      !data.round
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const interviewDate = new Date(data.interviewDate);

    if (isNaN(interviewDate.getTime())) {
      return NextResponse.json(
        {
          message: "Invalid interview date",
        },
        {
          status: 400,
        },
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: data.applicationId,
        userId: profile.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          message: "Application not found",
        },
        {
          status: 404,
        },
      );
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId: application.id,
        interviewDate,
        round: data.round,
          status: data.status ?? InterviewStatus.SCHEDULED,
        feedback: data.feedback,
      },
    });

    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        status: ApplicationStatus.INTERVIEW,
      },
    });

    return NextResponse.json(
      {
        message: "Interview Created Successfully",
        interview,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    );
  }
}