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
import styles from "./privacy.module.css";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "information-collection", title: "Information We Collect" },
    { id: "information-use", title: "How We Use Information" },
    { id: "information-sharing", title: "Information Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "user-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies and Tracking" },
    { id: "third-party", title: "Third-Party Services" },
    { id: "data-retention", title: "Data Retention" },
    { id: "international", title: "International Transfers" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Information" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simplified text version for download
    const element = document.createElement("a");
    const file = new Blob(
      [document.querySelector(`.${styles.content}`).innerText],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = "personalized-wellness-planner-privacy-policy.txt";
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
              <FaShieldAlt />
            </div>
            <div>
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.subtitle}>
                How we collect, use, and protect your personal information
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
                At Personalized Wellness Planner, we respect your privacy and
                are committed to protecting your personal data. This privacy
                policy explains how we collect, use, disclose, and safeguard
                your information when you use our service.
              </p>
            </section>

            <section id="information-collection" className={styles.section}>
              <h2>1. Information We Collect</h2>

              <h3>1.1 Personal Information</h3>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul>
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  password, and profile preferences
                </li>
                <li>
                  <strong>Profile Data:</strong> Work schedule, wellness goals,
                  and productivity preferences
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages, feedback, and
                  support requests
                </li>
                <li>
                  <strong>Payment Information:</strong> Billing details
                  processed through secure third-party providers
                </li>
              </ul>

              <h3>1.2 Automatically Collected Information</h3>
              <ul>
                <li>
                  <strong>Usage Data:</strong> How you interact with our
                  service, features used, and time spent
                </li>
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  operating system, and device identifiers
                </li>
                <li>
                  <strong>Location Data:</strong> General location based on IP
                  address (not precise location)
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> We use cookies to
                  enhance your experience and analyze usage
                </li>
              </ul>

              <h3>1.3 Third-Party Integration Data</h3>
              <p>When you connect third-party services, we may collect:</p>
              <ul>
                <li>
                  <strong>Calendar Data:</strong> Events, schedules, and
                  availability from Google Calendar
                </li>
                <li>
                  <strong>Task Management:</strong> Projects, tasks, and
                  progress from Jira, Trello, and similar tools
                </li>
                <li>
                  <strong>Communication Tools:</strong> Meeting data from
                  integrated platforms
                </li>
              </ul>
            </section>

            <section id="information-use" className={styles.section}>
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>
                  <strong>Provide Our Service:</strong> Deliver personalized
                  wellness recommendations and productivity insights
                </li>
                <li>
                  <strong>Personalization:</strong> Customize your experience
                  based on your preferences and usage patterns
                </li>
                <li>
                  <strong>Communication:</strong> Send service updates, wellness
                  tips, and respond to your inquiries
                </li>
                <li>
                  <strong>Analytics:</strong> Understand how our service is used
                  to improve features and functionality
                </li>
                <li>
                  <strong>Security:</strong> Protect against fraud, abuse, and
                  security threats
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Meet legal obligations and
                  enforce our terms of service
                </li>
              </ul>
            </section>

            <section id="information-sharing" className={styles.section}>
              <h2>3. Information Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share
                information in the following circumstances:
              </p>

              <h3>3.1 With Your Consent</h3>
              <p>
                We share information when you explicitly consent, such as
                connecting third-party applications.
              </p>

              <h3>3.2 Service Providers</h3>
              <p>
                We work with trusted third-party service providers who assist us
                in:
              </p>
              <ul>
                <li>Cloud hosting and data storage</li>
                <li>Payment processing</li>
                <li>Email and communication services</li>
                <li>Analytics and performance monitoring</li>
              </ul>

              <h3>3.3 Legal Requirements</h3>
              <p>We may disclose information when required by law or to:</p>
              <ul>
                <li>Respond to legal process or government requests</li>
                <li>Protect the rights, property, or safety of our users</li>
                <li>Prevent fraud or security threats</li>
              </ul>

              <h3>3.4 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred as part of the transaction.
              </p>
            </section>

            <section id="data-security" className={styles.section}>
              <h2>4. Data Security</h2>
              <p>
                We implement robust security measures to protect your
                information:
              </p>
              <ul>
                <li>
                  <strong>Encryption:</strong> Data is encrypted in transit and
                  at rest using industry-standard protocols
                </li>
                <li>
                  <strong>Access Controls:</strong> Strict access controls and
                  authentication mechanisms
                </li>
                <li>
                  <strong>Regular Audits:</strong> Security assessments and
                  vulnerability testing
                </li>
                <li>
                  <strong>Employee Training:</strong> Regular security training
                  for all team members
                </li>
                <li>
                  <strong>Incident Response:</strong> Procedures for detecting
                  and responding to security incidents
                </li>
              </ul>
              <p>
                While we strive to protect your information, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section id="user-rights" className={styles.section}>
              <h2>5. Your Rights and Choices</h2>
              <p>
                You have the following rights regarding your personal
                information:
              </p>

              <h3>5.1 Access and Portability</h3>
              <ul>
                <li>Request a copy of your personal data</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h3>5.2 Correction and Updates</h3>
              <ul>
                <li>Update your profile information at any time</li>
                <li>Correct inaccurate or incomplete data</li>
              </ul>

              <h3>5.3 Deletion</h3>
              <ul>
                <li>Delete your account and associated data</li>
                <li>Request removal of specific information</li>
              </ul>

              <h3>5.4 Communication Preferences</h3>
              <ul>
                <li>Opt out of marketing communications</li>
                <li>Manage notification settings</li>
              </ul>

              <h3>5.5 Data Processing</h3>
              <ul>
                <li>Object to certain data processing activities</li>
                <li>Restrict processing of your data</li>
              </ul>
            </section>

            <section id="cookies" className={styles.section}>
              <h2>6. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our service</li>
                <li>Provide personalized content and recommendations</li>
                <li>Measure the effectiveness of our marketing</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but some
                features may not work properly if cookies are disabled.
              </p>
            </section>

            <section id="third-party" className={styles.section}>
              <h2>7. Third-Party Services</h2>
              <p>Our service integrates with third-party platforms:</p>
              <ul>
                <li>
                  <strong>Google Workspace:</strong> Calendar and productivity
                  tools
                </li>
                <li>
                  <strong>Jira & Trello:</strong> Project and task management
                </li>
                <li>
                  <strong>Microsoft Outlook:</strong> Email and calendar
                  integration
                </li>
              </ul>
              <p>
                These integrations are governed by the respective third-party
                privacy policies in addition to this policy.
              </p>
            </section>

            <section id="data-retention" className={styles.section}>
              <h2>8. Data Retention</h2>
              <p>We retain your information for as long as:</p>
              <ul>
                <li>Your account is active</li>
                <li>Needed to provide our services</li>
                <li>Required by law or for legitimate business purposes</li>
              </ul>
              <p>
                When you delete your account, we will delete or anonymize your
                personal information within 30 days, except as required for
                legal compliance.
              </p>
            </section>

            <section id="international" className={styles.section}>
              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your information in accordance with
                applicable data protection laws.
              </p>
            </section>

            <section id="changes" className={styles.section}>
              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any material changes by:
              </p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification</li>
                <li>Displaying a prominent notice in our service</li>
              </ul>
              <p>
                Your continued use of the service after changes become effective
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section id="contact" className={styles.section}>
              <h2>11. Contact Information</h2>
              <p>
                If you have questions about this privacy policy or our data
                practices, please contact us:
              </p>
              <div className={styles.contactInfo}>
                <p>
                  <strong>Email:</strong>{" "}
                  privacy@personalizedwellnessplanner.com
                </p>
                <p>
                  <strong>Address:</strong> EPITA Action Learning Project
                  <br />
                  Paris, France
                </p>
                <p>
                  <strong>Data Protection Officer:</strong>{" "}
                  dpo@personalizedwellnessplanner.com
                </p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              <Link href={"/terms"} className={styles.footerLink}>
                <FaFileContract />
                Terms and Conditions
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
