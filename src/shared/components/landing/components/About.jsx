import {
  FaHeart,
  FaCode,
  FaLightbulb,
  FaRocket,
  FaCog,
  FaLinkedin,
  FaGithub,
  FaUsers,
} from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";

const About = () => {
  const values = [
    {
      icon: <FaHeart />,
      title: "Wellness First",
      description:
        "Your mental and physical health should never be compromised for productivity",
    },
    {
      icon: <FaCode />,
      title: "Seamless Integration",
      description: "Work with your existing tools, don't replace them",
    },
    {
      icon: <FaLightbulb />,
      title: "Smart Insights",
      description:
        "AI-powered recommendations that learn and adapt to your work patterns",
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      description:
        "Connect with like-minded professionals on similar wellness journeys",
    },
  ];

  const team = [
    {
      icon: <FaRocket />,
      name: "Team Member 1",
      role: "Project Lead & Full-Stack Developer",
      company: "EPITA Action Learning Project",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      icon: <FaCode />,
      name: "Team Member 2",
      role: "Frontend Developer & UI/UX Designer",
      company: "EPITA Action Learning Project",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      icon: <FaCog />,
      name: "Team Member 3",
      role: "Backend Developer & System Architect",
      company: "EPITA Action Learning Project",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      icon: <FaLightbulb />,
      name: "Team Member 4",
      role: "Product Designer & Research Specialist",
      company: "EPITA Action Learning Project",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
  ];

  const stats = [
    { number: "2025", label: "Founded" },
    { number: "50K+", label: "Active Users" },
    { number: "85%", label: "Burnout Reduction" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>About Personalized Wellness Planner</h2>
          <p>
            We're passionate about empowering remote workers and entrepreneurs
            to achieve their best work while maintaining their well-being
          </p>
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.aboutStory}>
            <h3>Our Mission</h3>
            <p>
              In today's remote-first world, we noticed that productivity tools
              were missing something crucial - the human element. Traditional
              task management focuses on getting things done, but often ignores
              the toll it takes on mental health and well-being.
            </p>
            <p>
              That's why we created Personalized Wellness Planner - the first
              productivity platform that puts your wellness at the center of
              your workflow. By integrating with tools you already use like
              Jira, Trello, and Google Calendar, we help you stay productive
              while preventing burnout.
            </p>
          </div>

          <div className={styles.aboutValues}>
            <h3>Our Values</h3>
            <div className={styles.valuesGrid}>
              {values.map((value, index) => (
                <div key={index} className={styles.valueItem}>
                  <div className={styles.valueIcon}>{value.icon}</div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.aboutTeam}>
            <h3>Meet Our Team</h3>
            <div className={styles.teamGrid}>
              {team.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <div className={styles.memberAvatar}>{member.icon}</div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <p>{member.company}</p>
                  <div className={styles.memberSocial}>
                    <a href={member.social.linkedin} aria-label="LinkedIn">
                      <FaLinkedin />
                    </a>
                    <a href={member.social.github} aria-label="GitHub">
                      <FaGithub />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.aboutStats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
