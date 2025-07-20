import Link from "next/link";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { AUTH_ROUTES } from "@/shared/utils/paths";
import styles from "@/shared/components/landing/LandingPage.module.css";

const CTA = () => {
  const ctaData = {
    title: "Ready to Transform Your Remote Work Experience?",
    subtitle:
      "Join thousands of professionals who have already improved their productivity and well-being",
    buttons: [
      {
        text: "Start Free Trial",
        href: AUTH_ROUTES.register,
        type: "primary",
        icon: <FaArrowRight />,
      },
      {
        text: "Sign In",
        href: AUTH_ROUTES.login,
        type: "secondary",
      },
    ],
    note: {
      icon: <FaCheckCircle />,
      text: "No credit card required • 14-day free trial • Cancel anytime",
    },
  };

  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.ctaContent}>
          <h2>{ctaData.title}</h2>
          <p>{ctaData.subtitle}</p>

          <div className={styles.ctaButtons}>
            {ctaData.buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className={
                  button.type === "primary"
                    ? styles.primaryBtn
                    : styles.secondaryBtn
                }
              >
                {button.text}
                {button.icon && button.icon}
              </Link>
            ))}
          </div>

          <p className={styles.ctaNote}>
            {ctaData.note.icon} {ctaData.note.text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
