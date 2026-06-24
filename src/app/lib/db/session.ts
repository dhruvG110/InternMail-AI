import type { DefaultSession } from "next-auth";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import prisma from "@/app/lib/db/prismaClient";

type AuthUser = DefaultSession["user"] & {
  id?: string | number;
  role?: string;
};

type AuthSession = DefaultSession & {
  user: AuthUser;
};

export type SessionContext = {
  userId: number;
  email: string | null;
  role: string | null;
};

export type AuthenticatedProfile = SessionContext & {
  profile: {
    id: number;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    targetRole: string | null;
    graduationYear: number | null;
    preferredLocation: string | null;
  };
};

export async function getSession(): Promise<SessionContext | null> {
  const session = (await getServerSession(authOptions)) as AuthSession | null;

  if (!session?.user?.id) {
    return null;
  }

  const userId =
    typeof session.user.id === "string"
      ? parseInt(session.user.id, 10)
      : session.user.id;

  if (Number.isNaN(userId)) {
    return null;
  }

  return {
    userId,
    email: session.user.email ?? null,
    role: session.user.role ?? null,
  };
}

export async function getAuthenticatedProfile(): Promise<AuthenticatedProfile | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      targetRole: true,
      graduationYear: true,
      preferredLocation: true,
    },
  });

  if (!profile) {
    return null;
  }

  return { ...session, profile };
}

export async function createSession() {
  throw new Error("Legacy session creation is not supported. Use NextAuth signIn instead.");
}

export async function deleteSession() {
  throw new Error("Legacy session deletion is not supported. Use NextAuth signOut instead.");
}
