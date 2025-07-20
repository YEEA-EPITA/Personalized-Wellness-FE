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
  FaUser,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

// Components
import ControlledTextInput from "@/shared/components/inputs/textInput";
import ControlledPasswordInput from "@/shared/components/inputs/passwordInput";

// Utils, Schemas, Hooks
import useSubmitFunction from "@/shared/hooks/useSubmitFunction";
import { registerUserSchema } from "@/shared/schemas/auth";
import { AUTH_ROUTES } from "@/shared/utils/paths";

// Redux
import { createUser } from "@/shared/redux/slices/user";
import Image from "next/image";

export default function Registerform() {
  const { isLoading, onSubmitFunction } = useSubmitFunction();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerUserSchema),
  });

  const onSubmit = (data) => {
    onSubmitFunction({
      reduxFunction: createUser,
      data,
    });
  };

  const handleGoogleRegister = () => {
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
              Start Your
              <span className={styles.highlight}> Wellness Journey</span>
            </h1>
            <p className={styles.heroDescription}>
              Join thousands of professionals optimizing their productivity and
              well-being.
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎯</span>
              <span>Personalized Recommendations</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <span>Advanced Analytics</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔒</span>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>
              Enter your details to get started on your wellness journey
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <FaUser
                    className={styles.inputIcon}
                    style={{ top: errors?.firstName ? "41%" : "" }}
                  />
                  <ControlledTextInput
                    label="First Name"
                    placeholder="Enter your first name"
                    name="firstName"
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
                    onInput={(e) =>
                      (e.target.value =
                        e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).replace(/[^a-zA-Z]/g, ""))
                    }
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <FaUser
                    className={styles.inputIcon}
                    style={{ top: errors?.lastName ? "41%" : "" }}
                  />
                  <ControlledTextInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    name="lastName"
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
                    onInput={(e) =>
                      (e.target.value =
                        e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).replace(/[^a-zA-Z ]/g, ""))
                    }
                  />
                </div>
              </div>
            </div>

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
                  type="email"
                  errors={errors}
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "2.75rem",
                    },
                  }}
                />
              </div>
            </div>

            <div className={styles.passwordRow}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <FaLock
                    className={styles.inputIcon}
                    style={{ top: errors?.password ? "35%" : "" }}
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

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <FaShieldAlt
                    className={styles.inputIcon}
                    style={{ top: errors?.confirmPassword ? "49%" : "" }}
                  />
                  <ControlledPasswordInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
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
            </div>

            <div className={styles.termsWrapper}>
              <label className={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  I agree to the{" "}
                  <Link href="/terms" className={styles.termsLink}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className={styles.submitButtonWrapper}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <div className={styles.loader}></div>
                ) : (
                  <>
                    Create Account
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
              onClick={handleGoogleRegister}
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

            <div className={styles.loginPrompt}>
              <span>
                Already have an account?{" "}
                <Link href={AUTH_ROUTES.login} className={styles.loginLink}>
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
