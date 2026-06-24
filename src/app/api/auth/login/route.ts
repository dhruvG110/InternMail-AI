import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      message: "This route is deprecated. Please use NextAuth credentials sign-in via /api/auth/signin.",
    },
    { status: 410 },
  );
}
