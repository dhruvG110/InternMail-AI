import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import { getSession } from "@/app/lib/db/session";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIGenerationType } from "@/generated/prisma/enums";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type RequestPayload = {
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

    if (!data.resumeText || data.resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          message: "Resume text is required",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
Act as a senior FAANG recruiter.

Analyze the following resume.

Target Role:
${profile.targetRole ?? "Not Specified"}

Resume:

${data.resumeText}

Provide:

1. Overall Summary

2. Strengths

3. Weaknesses

4. Missing Skills

5. ATS Optimization Suggestions

6. Project Improvements

7. Resume Score Out Of 100

Keep the analysis practical and actionable.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    await prisma.aIGeneration.create({
      data: {
        userId: profile.id,
        type: AIGenerationType.COACH,
        prompt,
        response,
      },
    });

    return NextResponse.json(
      {
        message: "Resume Analysis Generated",
        analysis: response,
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