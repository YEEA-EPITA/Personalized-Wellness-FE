"use client";
import { useSearchParams } from "next/navigation";
import ForgotPassword from "@/shared/components/auth/forgotpassword/index";
import VerifyOtp from "@/shared/components/auth/forgotpassword/verifyOtp";
import ResetPassword from "@/shared/components/auth/forgotpassword/resetPassword";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const { useSearchParams } = require("next/navigation"); // Dynamic import for clarity
  const params = useSearchParams();
  const step = params.get("step");
  const email = params.get("email");

  if (step === "verifyOtp") return <VerifyOtp email={email} />;
  if (step === "resetPassword") return <ResetPassword email={email} />;

  return <ForgotPassword />;
}