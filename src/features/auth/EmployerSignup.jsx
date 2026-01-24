import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployerSignup.module.css";

export default function EmployerSignup() {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    website: "",
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
    console.log("Employer form submitted:", formData);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h1>Register Your Healthcare Organization</h1>
          <p>Connect with qualified healthcare professionals</p>
        </div>

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.sectionTitle}>Organization Information</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="organizationName">Organization Name *</label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Hospital/Clinic Name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="organizationType">Organization Type *</label>
              <select
                id="organizationType"
                name="organizationType"
                value={formData.organizationType}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="hospital">Hospital</option>
                <option value="clinic">Clinic</option>
                <option value="diagnostic-center">Diagnostic Center</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="medical-center">Medical Center</option>
                <option value="nursing-home">Nursing Home</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="registrationNumber">
                CAC Registration Number *
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="CAC/BN/RC Number"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="website">Website (Optional)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          <div className={styles.sectionTitle}>Contact Information</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contactPerson">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Full name of HR/Admin"
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
                placeholder="organization@example.com"
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
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja (FCT)</option>
                <option value="kano">Kano</option>
                <option value="rivers">Rivers</option>
                <option value="oyo">Oyo</option>
                <option value="kaduna">Kaduna</option>
              </select>
            </div>
          </div>

          <div className={styles.sectionTitle}>Security</div>

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
            Register Organization
          </button>
        </form>

        <div className={styles.loginPrompt}>
          <p>
            Already registered? <Link to="/auth">Login here</Link>
          </p>
        </div>

        <div className={styles.employeePrompt}>
          <p>
            Are you a healthcare professional?{" "}
            <Link to="/auth/employee-signup">Sign up as an employee</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
