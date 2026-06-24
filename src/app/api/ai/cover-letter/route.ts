import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getSession } from "@/app/lib/db/session";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIGenerationType } from "@/generated/prisma/enums";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type RequestPayload = {
  company: string;
  role: string;
  resumeText: string;
};

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

    const data: RequestPayload = await req.json();

    if (
      !data.company ||
      !data.role ||
      !data.resumeText
    ) {
      return NextResponse.json(
        {
          message: "Please provide all details",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
Act as a professional recruiter.

Generate a tailored cover letter.

Candidate Name:
${profile.fullName}

Target Role:
${data.role}

Company:
${data.company}

Resume:

${data.resumeText}

Requirements:

1. Professional tone
2. Highlight relevant skills
3. Mention projects and achievements
4. Show enthusiasm for the company
5. Keep it under 400 words
6. Ready to submit
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    await prisma.aIGeneration.create({
      data: {
        userId: profile.id,
        type: AIGenerationType.COVER_LETTER,
        prompt,
        response,
      },
    });

    return NextResponse.json(
      {
        message: "Cover Letter Generated",
        coverLetter: response,
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