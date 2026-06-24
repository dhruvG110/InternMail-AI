import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getSession } from "@/app/lib/db/session";

type InterviewRound = "OA" | "TECHNICAL" | "HR" | "FINAL";

type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

type InterviewUpdatePayload = {
  interviewDate?: string;
  round?: InterviewRound;
  status?: InterviewStatus;
  feedback?: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Please Login" }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(session.userId),
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    const { id } = await params;

    const interview = await prisma.interview.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        application: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 },
      );
    }

    if (interview.application.userId !== profile.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      {
        interview,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Please Login" }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(session.userId),
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    const { id } = await params;

    const interview = await prisma.interview.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        application: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 },
      );
    }

    if (interview.application.userId !== profile.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const data: InterviewUpdatePayload = await req.json();

    const updateData: Record<string, unknown> = {};

    if (data.interviewDate !== undefined) {
      updateData.interviewDate = new Date(data.interviewDate);
    }

    if (data.round !== undefined) {
      updateData.round = data.round;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.feedback !== undefined) {
      updateData.feedback = data.feedback;
    }

    const updatedInterview = await prisma.interview.update({
      where: {
        id: interview.id,
      },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Interview Updated Successfully",
        interview: updatedInterview,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Please Login" }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(session.userId),
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    const { id } = await params;

    const interview = await prisma.interview.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        application: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 },
      );
    }

    if (interview.application.userId !== profile.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.interview.delete({
      where: {
        id: interview.id,
      },
    });

    return NextResponse.json(
      {
        message: "Interview Deleted Successfully",
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
