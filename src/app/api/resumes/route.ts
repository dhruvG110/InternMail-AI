import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getAuthenticatedProfile } from "@/app/lib/db/session";

type RequestPayloadData = {
  fileUrl: string;
  isDefault: boolean;
  name: string;
};

export async function GET() {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: auth.profile.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        name: true,
        version: true,
        fileUrl: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch resumes." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedProfile();
    if (!auth) {
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    }

    const data: RequestPayloadData = await req.json();

    if (!data.fileUrl?.trim()) {
      return NextResponse.json({ message: "File URL is required." }, { status: 400 });
    }

    if (!data.name?.trim()) {
      return NextResponse.json({ message: "Resume name is required." }, { status: 400 });
    }

    if (data.isDefault) {
      await prisma.resume.updateMany({
        where: { userId: auth.profile.id },
        data: { isDefault: false },
      });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: auth.profile.id,
        name: data.name.trim(),
        fileUrl: data.fileUrl.trim(),
        isDefault: data.isDefault ?? false,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to create resume." }, { status: 500 });
  }
}
