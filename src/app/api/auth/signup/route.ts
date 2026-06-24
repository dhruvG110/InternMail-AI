import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/db/prismaClient";
import bcrypt from "bcrypt";

type RequestSignUpData = {
  fullName: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: RequestSignUpData = await req.json();

    if (!data.email?.trim()) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    if (!data.fullName?.trim()) {
      return NextResponse.json({ message: "Full name is required." }, { status: 400 });
    }

    if (!data.password || data.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const email = data.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "Already a member. Please login." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        role: "USER",
        email,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        email,
        userId: newUser.id,
        fullName: data.fullName.trim(),
      },
    });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Unable to create account. Please try again." },
      { status: 500 },
    );
  }
}
