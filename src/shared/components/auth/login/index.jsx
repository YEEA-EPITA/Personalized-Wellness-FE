"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Styles
import styles from "./styles.module.css";

// Icons
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaRocket,
} from "react-icons/fa";

// Components
import ControlledTextInput from "@/shared/components/inputs/textInput";
import ControlledPasswordInput from "@/shared/components/inputs/passwordInput";

// Utils, Schemas, Hooks
import useSubmitFunction from "@/shared/hooks/useSubmitFunction";
import { loginUserSchema } from "@/shared/schemas/auth";
import { AUTH_ROUTES } from "@/shared/utils/paths";

// Redux
import { signInUser } from "@/shared/redux/slices/user";
import Image from "next/image";

export default function Loginform() {
  const { isLoading, onSubmitFunction } = useSubmitFunction();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginUserSchema),
  });

  const onSubmit = (data) => {
    onSubmitFunction({
      reduxFunction: signInUser,
      data,
    });
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    router.push(
      `${process.env.NEXT_PUBLIC_SERVER_JAVA_URL}/oauth2/authorization/google`
    );
  };

  return (
    <div className={styles.authContainer}>
      {/* Left Side - Branding */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
            </div>
            <span className={styles.logoText}>
              Personalized Wellness Planner
            </span>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome Back to Your
              <span className={styles.highlight}> Wellness Journey</span>
            </h1>
            <p className={styles.heroDescription}>
              Sign in to continue optimizing your productivity and well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>
              Sign in to your account to continue your wellness journey
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <FaEnvelope
                  className={styles.inputIcon}
                  style={{ top: errors?.email ? "49%" : "" }}
                />
                <ControlledTextInput
                  label="Email Address"
                  placeholder="Enter your email"
                  name="email"
                  control={control}
                  type="text"
                  errors={errors}
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "2.75rem",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(2.75rem, 16px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(2.75rem, -9px) scale(0.75)",
                    },
                  }}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <FaLock
                  className={styles.inputIcon}
                  style={{ top: errors?.password ? "49%" : "" }}
                />
                <ControlledPasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  name="password"
                  control={control}
                  errors={errors}
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "2.75rem",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(2.75rem, 16px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(2.75rem, -9px) scale(0.75)",
                    },
                  }}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Link
                href="/auth/forgotpassword"
                className={styles.forgotPassword}
              >
                Forgot Password?
              </Link>
            </div>

            <div className={styles.submitButtonWrapper}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.loader}></div>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight className={styles.btnIcon} />
                  </>
                )}
              </button>
            </div>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className={styles.loader}></div>
              ) : (
                <>
                  <FaGoogle className={styles.googleIcon} />
                  Continue with Google
                </>
              )}
            </button>

            <div className={styles.registerPrompt}>
              <span>
                Don't have an account?{" "}
                <Link
                  href={AUTH_ROUTES.register}
                  className={styles.registerLink}
                >
                  Create Account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
