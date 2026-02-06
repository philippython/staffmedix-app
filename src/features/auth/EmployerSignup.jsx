import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployerSignup.module.css";
import { nigerianStates } from "../../data/data";
import { useEmployerSignUpMutation } from "../../services/employerApi";

export default function EmployerSignup() {
  const [employerSignUp, { isLoading: loading, isError: error }] =
    useEmployerSignUpMutation();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    registration_number: "",
    contact_person_full_name: "",
    contact_person_phone_number: "",
    contact_person_email: "",
    contact_person_address: "",
    contact_person_city: "",
    contact_person_state: "",
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
      await employerSignUp(formData).unwrap();

      setSuccess("Account created Successfully");
    } catch (err) {
      setErrMsg(err.data?.detail);
    }
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        {success === "" ? (
          <>
            <div className={styles.signupHeader}>
              <h1>Register Your Healthcare Organization</h1>
              <p>Connect with qualified healthcare professionals</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleSubmit}>
              {error && <p className={styles.errMsg}>{errMsg}</p>}
              <div className={styles.sectionTitle}>
                Organization Information
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="company_name">Organization Name *</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Hospital/Clinic Name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="username">Organization Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="registration_number">
                    CAC Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="registration_number"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    placeholder="CAC/BN/RC Number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className={styles.sectionTitle}>Contact Information</div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_full_name">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contact_person_full_name"
                    name="contact_person_full_name"
                    value={formData.contact_person_full_name}
                    onChange={handleChange}
                    placeholder="Full name of HR/Admin"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_email">Email Address *</label>
                  <input
                    type="contact_person_email"
                    id="contact_person_email"
                    name="contact_person_email"
                    value={formData.contact_person_email}
                    onChange={handleChange}
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_phone_number">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contact_person_phone_number"
                    name="contact_person_phone_number"
                    value={formData.contact_person_phone_number}
                    onChange={handleChange}
                    placeholder="+234 XXX XXX XXXX"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_address">Address *</label>
                  <input
                    type="text"
                    id="contact_person_address"
                    name="contact_person_address"
                    value={formData.contact_person_address}
                    onChange={handleChange}
                    placeholder="Street address"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_city">City *</label>
                  <input
                    type="text"
                    id="contact_person_city"
                    name="contact_person_city"
                    value={formData.contact_person_city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact_person_state">State *</label>
                  <select
                    id="contact_person_state"
                    name="contact_person_state"
                    value={formData.contact_person_state}
                    onChange={handleChange}
                    required
                  >
                    {nigerianStates.map((state) => (
                      <option>{state}</option>
                    ))}
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
                    I agree to the <Link to="/terms">Terms and Conditions</Link>{" "}
                    and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button type="submit" className={styles.submitButton}>
                {loading
                  ? "Creating your employer account...."
                  : "Register Organization"}
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
          </>
        ) : (
          <p>
            {success} <Link to="/auth"> Click here</Link> to login
          </p>
        )}
      </div>
    </div>
  );
}
