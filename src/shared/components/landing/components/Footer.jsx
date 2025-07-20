import { useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "", show: false });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: "", type: "", show: false });
    }, 3000);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showMessage("Thank you for subscribing!", "success");
      setEmail("");
    } catch (error) {
      showMessage("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerData = {
    newsletter: {
      title: "Stay Updated",
      description:
        "Get the latest wellness tips and productivity insights delivered to your inbox.",
    },
    brand: {
      logo: {
        src: "/images/logo.png",
        alt: "Personalized Wellness Planner Logo",
      },
      name: "Personalized Wellness Planner",
      description:
        "Empowering remote workers and entrepreneurs to achieve peak performance while maintaining their well-being through intelligent task management and wellness insights.",
    },
    socialLinks: [
      { icon: <FaTwitter />, href: "#", label: "Twitter" },
      { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
      { icon: <FaGithub />, href: "#", label: "GitHub" },
      { icon: <FaInstagram />, href: "#", label: "Instagram" },
    ],
    linkGroups: [
      {
        title: "Product",
        links: [
          { text: "Features", href: "#features" },
          { text: "Jira Integration", href: "#integrations" },
          { text: "Trello Integration", href: "#integrations" },
          { text: "Pricing", href: "#pricing" },
          { text: "Roadmap", href: "#roadmap" },
        ],
      },
      {
        title: "Company",
        links: [
          { text: "About Us", href: "#about" },
          { text: "Team", href: "#team" },
          { text: "Careers", href: "#careers" },
          { text: "Blog", href: "#blog" },
          { text: "Contact", href: "#contact" },
        ],
      },
      {
        title: "Resources",
        links: [
          { text: "Help Center", href: "#help" },
          { text: "Community", href: "#community" },
          { text: "Documentation", href: "#docs" },
          { text: "API", href: "#api" },
          { text: "Status", href: "#status" },
        ],
      },
    ],
    bottomLinks: [
      { text: "Privacy Policy", href: "#privacy" },
      { text: "Terms of Service", href: "#terms" },
      { text: "Cookie Policy", href: "#cookies" },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter Section */}
        <div className={styles.newsletterSection}>
          <h4>{footerData.newsletter.title}</h4>
          <p>{footerData.newsletter.description}</p>
          <form
            className={styles.newsletterForm}
            onSubmit={handleNewsletterSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.newsletterInput}
              required
              disabled={isSubscribing}
            />
            <button
              type="submit"
              className={styles.newsletterBtn}
              disabled={isSubscribing || !email.trim()}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* Message Display */}
          {message.show && (
            <div
              className={`${styles.newsletterMessage} ${
                styles[`message-${message.type}`]
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <img
                src={footerData.brand.logo.src}
                alt={footerData.brand.logo.alt}
                className={styles.logoIcon}
              />
              <span className={styles.logoText}>{footerData.brand.name}</span>
            </div>
            <p>{footerData.brand.description}</p>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              {footerData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {footerData.linkGroups.map((group, index) => (
            <div key={index} className={styles.linkGroup}>
              <h4>{group.title}</h4>
              {group.links.map((link, linkIndex) => (
                <a key={linkIndex} href={link.href}>
                  {link.text}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p>
              &copy; {new Date().getFullYear()} Personalized Wellness Planner.
              All rights reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              {footerData.bottomLinks.map((link, index) => (
                <a key={index} href={link.href}>
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
