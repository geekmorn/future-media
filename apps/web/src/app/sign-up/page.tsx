import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Sign Up | Future Media",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[740px] h-[14px] bg-[#7c34f8] blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[740px] h-[14px] bg-[#7c34f8] blur-[100px]" />

      {/* Sign up card */}
      <div className="relative w-full max-w-[561px] mx-4">
        <div className="backdrop-blur-[100px] bg-[rgba(0,0,0,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[24px] shadow-[0px_10px_8px_0px_rgba(0,0,0,0.08)] px-8 py-9">
          {/* Top blur effect */}
          <div className="absolute -top-[14px] left-0 right-0 h-[14px] bg-[#7c34f8] blur-[100px]" />

          {/* Logo */}
          <div className="text-center mb-[42px]">
            <h1 className="text-[32px] font-medium leading-[38px] text-white">
              Logo
            </h1>
          </div>

          {/* Form header */}
          <div className="flex items-center justify-between gap-3 mb-7">
            <h2 className="text-[24px] font-medium leading-[28px] text-white">
              Sign up
            </h2>
            <div className="flex items-center gap-2 text-[14px] leading-[20px]">
              <span className="text-[rgba(255,255,255,0.8)]">
                Already have an account?
              </span>
              <Link
                href="/sign-in"
                className="font-medium text-[#9747ff] underline decoration-solid underline-offset-2 hover:text-[#b777ff] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Sign up form */}
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

