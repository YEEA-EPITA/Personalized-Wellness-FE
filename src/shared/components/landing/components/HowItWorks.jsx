import styles from "@/shared/components/landing/LandingPage.module.css";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Connect Your Platforms",
      description:
        "Sync with Google Calendar, Jira, and Trello to automatically analyze your work patterns, tasks, and schedule in one unified dashboard",
    },
    {
      number: 2,
      title: "Manage Tasks Seamlessly",
      description:
        "Use our unified Kanban board to create, update, and track tasks across Jira projects and Trello boards while maintaining wellness balance",
    },
    {
      number: 3,
      title: "Get Intelligent Insights",
      description:
        "Receive personalized recommendations and burnout alerts based on your task load, project deadlines, and work patterns across all platforms",
    },
    {
      number: 4,
      title: "Join the Community",
      description:
        "Connect with other remote workers, share experiences, and participate in wellness challenges while staying productive",
    },
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>
            Get started in minutes and transform your remote work experience
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
