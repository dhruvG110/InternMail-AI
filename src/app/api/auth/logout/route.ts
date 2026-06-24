import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      message: "This route is deprecated. Please use NextAuth signOut from the client.",
    },
    { status: 410 },
  );
}