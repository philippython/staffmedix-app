import { Link } from "react-router";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      duration: "Forever",
      features: [
        "Post up to 3 jobs per month",
        "Basic candidate search",
        "Email support",
        "Standard visibility",
        "Basic analytics",
      ],
      recommended: false,
    },
    {
      name: "Professional",
      price: "₦25,000",
      duration: "per month",
      features: [
        "Unlimited job postings",
        "Advanced candidate search",
        "Priority support",
        "Featured job listings",
        "Detailed analytics",
        "Resume database access",
        "Video interview tools",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "₦75,000",
      duration: "per month",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom branding",
        "API access",
        "Advanced reporting",
        "Bulk hiring tools",
        "White-label solution",
        "24/7 phone support",
      ],
      recommended: false,
    },
  ];

  return (
    <div className={styles.pricingPage}>
      <header className={styles.pricingHeader}>
        <h1>Choose Your Plan</h1>
        <p>Find the perfect plan for your healthcare organization</p>
      </header>

      <div className={styles.pricingGrid}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${styles.pricingCard} ${
              plan.recommended ? styles.recommended : ""
            }`}
          >
            {plan.recommended && (
              <span className={styles.recommendedBadge}>Most Popular</span>
            )}
            <h2>{plan.name}</h2>
            <div className={styles.priceSection}>
              <p className={styles.price}>{plan.price}</p>
              <p className={styles.duration}>{plan.duration}</p>
            </div>
            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className={styles.checkmark}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to="/auth/employer-signup"
              className={`${styles.selectButton} ${
                plan.recommended ? styles.primaryButton : ""
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>Can I change my plan later?</h3>
            <p>
              Yes! You can upgrade or downgrade your plan at any time. Changes
              take effect immediately.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>What payment methods do you accept?</h3>
            <p>
              We accept bank transfers, credit/debit cards, and mobile money
              payments.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>Is there a contract?</h3>
            <p>
              No long-term contracts required. You can cancel anytime with no
              penalties.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>Do you offer discounts?</h3>
            <p>
              Yes! We offer 15% discount for annual subscriptions and special
              rates for NGOs.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to Find Top Healthcare Talent?</h2>
        <p>Join hundreds of healthcare organizations using StaffMedix</p>
        <Link to="/auth/employer-signup" className={styles.ctaButton}>
          Start Your Free Trial
        </Link>
      </section>
    </div>
  );
}
