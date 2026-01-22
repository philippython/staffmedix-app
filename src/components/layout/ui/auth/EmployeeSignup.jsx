import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployeeSignup.module.css";

export default function EmployeeSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    license: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h1>Create Your Healthcare Professional Account</h1>
          <p>Join thousands of verified healthcare workers</p>
        </div>

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 XXX XXX XXXX"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profession">Profession *</label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              >
                <option value="">Select your profession</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="lab-technician">Laboratory Technician</option>
                <option value="radiographer">Radiographer</option>
                <option value="physiotherapist">Physiotherapist</option>
                <option value="dentist">Dentist</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="license">License Number *</label>
              <input
                type="text"
                id="license"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="Professional license number"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Years of Experience *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" required />
              <span>
                I agree to the <Link to="/terms">Terms and Conditions</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>
        </form>

        <div className={styles.loginPrompt}>
          <p>
            Already have an account? <Link to="/auth">Login here</Link>
          </p>
        </div>

        <div className={styles.employerPrompt}>
          <p>
            Are you an employer?{" "}
            <Link to="/auth/employer-signup">Sign up as an employer</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
