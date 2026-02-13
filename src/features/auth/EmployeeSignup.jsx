import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployeeSignup.module.css";
import { useTalentSignUpMutation } from "../../services/talentApi";

export default function EmployeeSignup() {
  const [talentSignUp, { isLoading: loading, isError: error }] =
    useTalentSignUpMutation();
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    profession: "",
    license_number: "",
    years_of_experience: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Form submitted:", formData);
    try {
      await talentSignUp(formData).unwrap();

      setSuccess("Account created Successfully");
    } catch (err) {
      console.error("Talent sign up", err);
    }
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        {success === "" ? (
          <>
            <div className={styles.signupHeader}>
              <h1>Create Your Healthcare Professional Account</h1>
              <p>Join thousands of verified healthcare workers</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleSubmit}>
              {error && (
                <p className={styles.errMsg}>
                  Error creating account. Please try again.
                </p>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
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
                    <option value="lab-technician">
                      Laboratory Technician
                    </option>
                    <option value="radiographer">Radiographer</option>
                    <option value="physiotherapist">Physiotherapist</option>
                    <option value="dentist">Dentist</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="license_number">
                    License Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="license_number"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="Professional license number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="years_of_experience">
                    Years of experience *
                  </label>
                  <select
                    id="years_of_experience"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select experience</option>
                    {[...Array(15)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

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

                <label className={styles.checkboxLabel}>
                  <input type="checkbox" required />
                  <span>
                    I agree to the <Link to="/terms">Terms and Conditions</Link>{" "}
                    and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>

                <button type="submit" className={styles.submitButton}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
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
          </>
        ) : (
          <p>
            {success} <Link to="/auth">Click here</Link> to login
          </p>
        )}
      </div>
    </div>
  );
}
