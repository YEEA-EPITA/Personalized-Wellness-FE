import { FaStar } from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";

const Reviews = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      quote:
        "This app completely transformed how I manage my remote work. The burnout alerts helped me catch stress early, and I'm 40% more productive now.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateCo",
      quote:
        "As an entrepreneur, I used to work 16-hour days without breaks. The wellness nudges and community support have been game-changing.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Marketing Director",
      company: "Remote Solutions",
      quote:
        "The Google Calendar integration is seamless, and the task management features help me stay organized while maintaining my well-being.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Loved by Remote Workers Worldwide</h2>
          <p>
            Join thousands of professionals who have transformed their work-life
            balance
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorInfo}>
                  <h4>{testimonial.name}</h4>
                  <p>
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
