"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaFileContract,
  FaShieldAlt,
  FaInfoCircle,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import styles from "./styles.module.css";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "agreement", title: "Agreement to Terms" },
    { id: "eligibility", title: "Eligibility" },
    { id: "account", title: "Your Account" },
    { id: "service-use", title: "Using the Service" },
    { id: "privacy", title: "Privacy" },
    { id: "content", title: "Content & Intellectual Property" },
    { id: "subscription", title: "Subscription & Payment" },
    { id: "termination", title: "Termination" },
    { id: "disclaimer", title: "Disclaimer & Liability" },
    { id: "governing-law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [document.querySelector(`.${styles.content}`).innerText],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = "personalized-wellness-planner-terms-and-conditions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            <FaArrowLeft />
            Back to Home
          </Link>
          <div className={styles.headerInfo}>
            <div className={styles.iconWrapper}>
              <FaFileContract />
            </div>
            <div>
              <h1 className={styles.title}>Terms and Conditions</h1>
              <p className={styles.subtitle}>
                Your agreement to use Personalized Wellness Planner
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <button onClick={handlePrint} className={styles.actionBtn}>
              <FaPrint />
              Print
            </button>
            <button onClick={handleDownload} className={styles.actionBtn}>
              <FaDownload />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h3>Quick Navigation</h3>
            <nav className={styles.nav}>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`${styles.navLink} ${
                    activeSection === section.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.lastUpdated}>
              <FaInfoCircle />
              <span>
                <strong>Last Updated:</strong> January 20, 2025
              </span>
            </div>

            <section className={styles.intro}>
              <p className={styles.introText}>
                Welcome to Personalized Wellness Planner. These Terms and
                Conditions ("Terms") govern your use of our wellness management
                platform and services. By accessing or using our service, you
                agree to be bound by these Terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2>General Information</h2>
              <p>
                Personalized Wellness Planner is a comprehensive wellness
                management platform designed to help remote workers and
                entrepreneurs achieve peak performance while maintaining their
                well-being through intelligent task management and wellness
                insights.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you
                and Personalized Wellness Planner regarding your use of our
                Service, including our website, mobile applications, and related
                services.
              </p>
            </section>

            <section id="agreement" className={styles.section}>
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing, browsing, or using our Service, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms and our Privacy Policy, which is incorporated by
                reference.
              </p>
              <p>
                If you do not agree to these Terms, you must not use our
                Service. We may modify these Terms at any time, and your
                continued use of the Service after such modifications
                constitutes your acceptance of the updated Terms.
              </p>
              <h3>1.1 Updates to Terms</h3>
              <p>We will notify you of material changes to these Terms by:</p>
              <ul>
                <li>Posting the updated Terms on our website</li>
                <li>
                  Sending an email notification to your registered email address
                </li>
                <li>Displaying a prominent notice within the Service</li>
              </ul>
            </section>

            <section id="eligibility" className={styles.section}>
              <h2>2. Eligibility</h2>
              <p>
                You must be at least 18 years old to use the Service. By using
                the Service, you represent and warrant that:
              </p>
              <ul>
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>
                  You are not barred from using the Service under applicable law
                </li>
                <li>
                  Your use of the Service will not violate any applicable law or
                  regulation
                </li>
              </ul>
              <p>
                Users under 18 may only use the Service with explicit parental
                or guardian consent and supervision.
              </p>
            </section>

            <section id="account" className={styles.section}>
              <h2>3. Your Account</h2>
              <p>
                To access certain features of the Service, you must create an
                account using a valid email address or through third-party
                authentication services (Google, Microsoft, etc.).
              </p>

              <h3>3.1 Account Responsibilities</h3>
              <p>You are responsible for:</p>
              <ul>
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and up-to-date account information</li>
                <li>
                  Promptly notifying us of any unauthorized use of your account
                </li>
                <li>Logging out of your account at the end of each session</li>
              </ul>

              <h3>3.2 Account Security</h3>
              <p>
                We recommend using strong, unique passwords and enabling
                two-factor authentication when available. You must immediately
                notify us at support@personalizedwellnessplanner.com if you
                suspect any unauthorized access to your account.
              </p>

              <h3>3.3 Account Suspension</h3>
              <p>We may suspend or terminate accounts that:</p>
              <ul>
                <li>Violate these Terms or our Privacy Policy</li>
                <li>Engage in fraudulent or abusive behavior</li>
                <li>Pose security risks to our Service or other users</li>
              </ul>
            </section>

            <section id="service-use" className={styles.section}>
              <h2>4. Using the Service</h2>
              <p>
                The Service is designed for personal wellness planning and
                productivity management. You agree to use the Service only for
                lawful purposes and in accordance with these Terms.
              </p>

              <h3>4.1 Permitted Uses</h3>
              <p>You may use the Service to:</p>
              <ul>
                <li>Manage your personal wellness and productivity goals</li>
                <li>
                  Integrate with your existing productivity tools (Jira, Trello,
                  Google Calendar)
                </li>
                <li>Receive personalized wellness recommendations</li>
                <li>Track your work-life balance metrics</li>
              </ul>

              <h3>4.2 Prohibited Uses</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>
                  Attempt to gain unauthorized access to our systems or other
                  users' accounts
                </li>
                <li>Interfere with or disrupt the Service or its servers</li>
                <li>
                  Use the Service to transmit viruses, malware, or other harmful
                  code
                </li>
                <li>Impersonate others or provide false information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Use the Service to spam, harass, or abuse other users</li>
                <li>
                  Reverse engineer, decompile, or attempt to extract source code
                </li>
              </ul>

              <h3>4.3 Medical Disclaimer</h3>
              <p className={styles.warning}>
                <strong>Important:</strong> The Service does not provide medical
                advice, diagnosis, or treatment. Our wellness recommendations
                are for informational purposes only. Always consult qualified
                healthcare professionals for medical decisions and before making
                significant changes to your health routine.
              </p>
            </section>

            <section id="privacy" className={styles.section}>
              <h2>5. Privacy</h2>
              <p>
                Your privacy is fundamental to our Service. Our{" "}
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
                explains in detail how we collect, use, store, and protect your
                personal information.
              </p>

              <h3>5.1 Data Collection</h3>
              <p>We collect information including:</p>
              <ul>
                <li>Account information (email, name, preferences)</li>
                <li>Wellness and productivity data you provide</li>
                <li>Usage data and analytics</li>
                <li>
                  Data from integrated third-party services (with your consent)
                </li>
              </ul>

              <h3>5.2 Data Protection</h3>
              <p>
                We implement industry-standard security measures to protect your
                data and do not sell your personal information to third parties.
              </p>
            </section>

            <section id="content" className={styles.section}>
              <h2>6. Content and Intellectual Property</h2>
              <p>
                All content and materials available through the Service,
                including but not limited to logos, designs, text, graphics,
                software, and features, are the exclusive property of
                Personalized Wellness Planner or our licensors.
              </p>

              <h3>6.1 Our Intellectual Property</h3>
              <p>You may not:</p>
              <ul>
                <li>
                  Reproduce, distribute, or create derivative works of our
                  content
                </li>
                <li>
                  Use our trademarks, logos, or brand elements without
                  permission
                </li>
                <li>
                  Remove or alter copyright notices or proprietary markings
                </li>
                <li>
                  Use our content for commercial purposes without authorization
                </li>
              </ul>

              <h3>6.2 Your Content</h3>
              <p>
                You retain ownership of content you submit to the Service (your
                wellness data, preferences, etc.). By using the Service, you
                grant us a limited license to use your content solely to provide
                and improve our Service.
              </p>
            </section>

            <section id="subscription" className={styles.section}>
              <h2>7. Subscription and Payment</h2>

              <h3>7.1 Free Trial</h3>
              <p>
                We offer a 14-day free trial for new users. No credit card is
                required for the trial period. You can cancel anytime during the
                trial without charge.
              </p>

              <h3>7.2 Paid Subscriptions</h3>
              <p>
                After the free trial, continued use requires a paid
                subscription. Subscription fees are:
              </p>
              <ul>
                <li>Charged in advance on a monthly or annual basis</li>
                <li>Non-refundable except as required by law</li>
                <li>Subject to change with 30 days' notice</li>
              </ul>

              <h3>7.3 Cancellation</h3>
              <p>
                You may cancel your subscription at any time through your
                account settings. Cancellation takes effect at the end of your
                current billing period.
              </p>
            </section>

            <section id="termination" className={styles.section}>
              <h2>8. Termination</h2>

              <h3>8.1 Termination by You</h3>
              <p>
                You may terminate your account at any time by contacting our
                support team or through your account settings.
              </p>

              <h3>8.2 Termination by Us</h3>
              <p>
                We may terminate or suspend your access to the Service
                immediately, without prior notice, for:
              </p>
              <ul>
                <li>Violation of these Terms</li>
                <li>Non-payment of subscription fees</li>
                <li>Extended periods of inactivity</li>
                <li>Security reasons or to protect other users</li>
                <li>Legal or regulatory requirements</li>
              </ul>

              <h3>8.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service ceases
                immediately. We will delete your personal data in accordance
                with our Privacy Policy, typically within 30 days of
                termination.
              </p>
            </section>

            <section id="disclaimer" className={styles.section}>
              <h2>9. Disclaimers and Limitation of Liability</h2>

              <h3>9.1 Service Disclaimer</h3>
              <p>
                The Service is provided "as is" and "as available" without
                warranties of any kind, either express or implied. To the
                fullest extent permitted by law, we disclaim all warranties,
                including but not limited to:
              </p>
              <ul>
                <li>Merchantability and fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
                <li>Continuous, uninterrupted, or error-free operation</li>
                <li>Accuracy, reliability, or completeness of content</li>
              </ul>

              <h3>9.2 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Personalized Wellness
                Planner shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including but not
                limited to loss of profits, data, or business opportunities.
              </p>
            </section>

            <section id="governing-law" className={styles.section}>
              <h2>10. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the
                laws of France and the European Union, without regard to
                conflict of law principles.
              </p>

              <h3>10.1 Jurisdiction</h3>
              <p>
                Any disputes arising from these Terms or your use of the Service
                shall be subject to the exclusive jurisdiction of the courts
                located in Paris, France.
              </p>

              <h3>10.2 Dispute Resolution</h3>
              <p>
                Before pursuing legal action, we encourage you to contact us
                directly to resolve any disputes. We are committed to working
                with you to find a fair resolution.
              </p>
            </section>

            <section id="contact" className={styles.section}>
              <h2>11. Contact Information</h2>
              <p>
                If you have questions about these Terms or need support, please
                contact us:
              </p>
              <div className={styles.contactInfo}>
                <p>
                  <strong>Email:</strong>{" "}
                  support@personalizedwellnessplanner.com
                </p>
                <p>
                  <strong>Legal:</strong> legal@personalizedwellnessplanner.com
                </p>
                <p>
                  <strong>Address:</strong> EPITA Action Learning Project
                  <br />
                  Paris, France
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond to all
                  inquiries within 48 hours.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>12. Final Provisions</h2>
              <p>
                These Terms constitute the entire agreement between you and
                Personalized Wellness Planner regarding your use of the Service.
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will remain in full force and effect.
              </p>
              <p className={styles.thankYou}>
                Thank you for choosing Personalized Wellness Planner. We're
                committed to helping you achieve your wellness and productivity
                goals while maintaining the highest standards of service and
                data protection.
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              <Link href={"/privacy"} className={styles.footerLink}>
                <FaShieldAlt />
                Privacy Policy
              </Link>
              <Link href={"/"} className={styles.footerLink}>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
