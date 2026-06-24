import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/app/lib/db/prismaClient";
import { authConfig } from "@/auth.config";

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    : null;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@interntrack.ai" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        const passwordMatches = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatches) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
    ...(googleProvider ? [googleProvider] : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: authConfig.sessionMaxAge,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const email = user.email.toLowerCase();
      let existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        const randomPassword = await bcrypt.hash(`${Date.now()}-${Math.random()}`, 10);
        existingUser = await prisma.user.create({
          data: {
            email,
            password: randomPassword,
            role: "USER",
          },
        });

        await prisma.profile.create({
          data: {
            email,
            userId: existingUser.id,
            fullName: profile?.name ?? user.name ?? "",
            avatarUrl: (profile as { picture?: string })?.picture ?? user.image ?? null,
          },
        });
      } else {
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: existingUser.id },
        });

        if (!existingProfile) {
          await prisma.profile.create({
            data: {
              email,
              userId: existingUser.id,
              fullName: profile?.name ?? user.name ?? "",
              avatarUrl: (profile as { picture?: string })?.picture ?? user.image ?? null,
            },
          });
        }
      }

      user.id = existingUser.id.toString();
      user.role = existingUser.role;

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.userId = user.id;
        token.role = user.role ?? authConfig.defaultRole;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        session.user.role = (token.role as string) ?? authConfig.defaultRole;
      }

      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}${authConfig.dashboardRedirectPath}`;
    },
  },
  pages: {
    signIn: authConfig.signInPath,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export default authOptions;
