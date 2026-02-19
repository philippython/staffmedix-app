import { useState } from "react";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import styles from "./EmployerSignup.module.css";
import { nigerianStates } from "../../data/data";
import { useCreateUserMutation } from "../../services/userApi";
import {
  useCreateCompanyProfileMutation,
  useCreateCompanyContactPersonMutation,
} from "../../services/employerApi";
import { useLoginMutation } from "../../services/authApi";
import { loginSuccess } from "../../store/slices/authSlice";

const STEPS = ["Account", "Company", "Contact"];

export default function EmployerSignup() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [companyId, setCompanyId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [createCompanyProfile, { isLoading: creatingProfile }] =
    useCreateCompanyProfileMutation();
  const [createCompanyContactPerson, { isLoading: creatingContact }] =
    useCreateCompanyContactPersonMutation();

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    company_name: "",
    organization_type: "",
    registration_number: "",
    size: "",
    website: "",
    description: "",
  });

  const [contactForm, setContactForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
  });

  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handleContactChange = (e) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  async function handleStep1(e) {
    e.preventDefault();
    setErrMsg("");
    if (userForm.password !== userForm.confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }
    try {
      await createUser({
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        confirm_password: userForm.confirmPassword,
        role: "EMPLOYER",
      }).unwrap();

      const loginRes = await login({
        username: userForm.username,
        password: userForm.password,
      }).unwrap();

      dispatch(
        loginSuccess({
          token: loginRes.token,
          expiry: loginRes.expiry ?? null,
        }),
      );

      setStep(2);
    } catch (err) {
      setErrMsg(
        err?.data?.detail || "Error creating account. Please try again.",
      );
    }
  }

  async function handleStep2(e) {
    e.preventDefault();
    setErrMsg("");
    try {
      const res = await createCompanyProfile({ ...profileForm }).unwrap();
      setCompanyId(res.id);
      setStep(3);
    } catch (err) {
      setErrMsg(err?.data?.detail || "Error saving company profile.");
    }
  }

  async function handleStep3(e) {
    e.preventDefault();
    setErrMsg("");
    try {
      await createCompanyContactPerson({
        data: { ...contactForm },
      }).unwrap();
      setSuccess(true);
    } catch (err) {
      setErrMsg(err?.data?.detail || "Error saving contact information.");
    }
  }

  if (success) {
    return (
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2>Registration Complete!</h2>
            <p>
              Your healthcare organization account has been created. Our team
              will verify your details shortly.
            </p>
            <Link to="/auth" className={styles.loginLink}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        {/* Progress */}
        <div className={styles.progressBar}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`${styles.progressStep} ${step >= i + 1 ? styles.active : ""}`}
              >
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepLabel}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`${styles.progressLine} ${step >= i + 2 ? styles.filled : ""}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Account */}
        {step === 1 && (
          <>
            <div className={styles.signupHeader}>
              <h1>Register Your Organization</h1>
              <p>Connect with qualified healthcare professionals</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleStep1}>
              {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Organization Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserChange}
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleUserChange}
                    placeholder="admin@organization.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={userForm.password}
                    onChange={handleUserChange}
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
                    value={userForm.confirmPassword}
                    onChange={handleUserChange}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" required />
                <span>
                  I agree to the <Link to="/terms">Terms and Conditions</Link>{" "}
                  and <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={creatingUser || loggingIn}
              >
                {creatingUser || loggingIn ? "Setting up…" : "Continue →"}
              </button>
            </form>

            <div className={styles.loginPrompt}>
              <p>
                Already registered? <Link to="/auth">Login here</Link>
              </p>
            </div>
            <div className={styles.altPrompt}>
              <p>
                Are you a healthcare professional?{" "}
                <Link to="/auth/employee-signup">Sign up as a talent</Link>
              </p>
            </div>
          </>
        )}

        {/* Step 2 — Company Profile */}
        {step === 2 && (
          <>
            <div className={styles.signupHeader}>
              <h1>Company Profile</h1>
              <p>Tell us about your healthcare organization</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleStep2}>
              {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="company_name">Organization Name *</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={profileForm.company_name}
                    onChange={handleProfileChange}
                    placeholder="Hospital / Clinic name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="organization_type">Organization Type</label>
                  <select
                    id="organization_type"
                    name="organization_type"
                    value={profileForm.organization_type}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select type</option>
                    <option value="hospital">Hospital</option>
                    <option value="clinic">Clinic</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="ngo">NGO / Non-profit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="registration_number">
                    CAC Registration Number
                  </label>
                  <input
                    type="text"
                    id="registration_number"
                    name="registration_number"
                    value={profileForm.registration_number}
                    onChange={handleProfileChange}
                    placeholder="CAC/BN/RC Number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="size">Organization Size</label>
                  <select
                    id="size"
                    name="size"
                    value={profileForm.size}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select size</option>
                    <option value="1">1–10 employees</option>
                    <option value="11">11–50 employees</option>
                    <option value="51">51–200 employees</option>
                    <option value="201">201–500 employees</option>
                    <option value="501">500+ employees</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                    placeholder="https://yourorganization.com"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={profileForm.description}
                    onChange={handleProfileChange}
                    placeholder="Brief description of your organization…"
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creatingProfile}
                >
                  {creatingProfile ? "Saving…" : "Continue →"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3 — Contact Person */}
        {step === 3 && (
          <>
            <div className={styles.signupHeader}>
              <h1>Contact Person</h1>
              <p>Who should we reach out to?</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleStep3}>
              {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="full_name">Contact Person *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={contactForm.full_name}
                    onChange={handleContactChange}
                    placeholder="Full name of HR / Admin"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact_email">Email Address *</label>
                  <input
                    type="email"
                    id="contact_email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone_number">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={contactForm.phone_number}
                    onChange={handleContactChange}
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
                    value={contactForm.address}
                    onChange={handleContactChange}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={contactForm.city}
                    onChange={handleContactChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={contactForm.state}
                    onChange={handleContactChange}
                    required
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creatingContact}
                >
                  {creatingContact ? "Finishing up…" : "Complete Registration"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
