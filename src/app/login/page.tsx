import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to your dashboard"
      subtitle="Track applications, interviews, and AI insights from one polished workspace built for students."
      formTitle="Sign in"
      formDescription="Access your dashboard"
      footer={
        <p>
          New to InternTrack AI?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Create account
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
