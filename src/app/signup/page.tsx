import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      badge="Get started free"
      title="Start landing more interviews"
      subtitle="Create your account in minutes and organize every application, resume, and interview in one place."
      formTitle="Create account"
      formDescription="Get started in minutes"
      backHref="/"
      backLabel="Back to Home"
      footer={
        <>
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Login
            </Link>
          </p>
          <Link href="/login" className="font-medium text-gray-600 hover:text-blue-600 dark:text-slate-300">
            Back to Login
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
