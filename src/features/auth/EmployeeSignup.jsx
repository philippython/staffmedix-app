import { useState } from "react";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import styles from "./EmployeeSignup.module.css";
import { useCreateUserMutation } from "../../services/userApi";
import { useCreateTalentProfileMutation } from "../../services/talentApi";
import { useLoginMutation } from "../../services/authApi";
import { loginSuccess } from "../../store/slices/authSlice";

const PROFESSIONS = [
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Laboratory Technician",
  "Medical Radiographer",
  "Medical Laboratory Scientist",
  "Physician Assistant",
  "Occupational Therapist",
  "Radiographer",
  "Physiotherapist",
  "Dentist",
  "Other",
];

export default function EmployeeSignup() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [createTalentProfile, { isLoading: creatingProfile }] =
    useCreateTalentProfileMutation();

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [talentForm, setTalentForm] = useState({
    full_name: "",
    phone_number: "",
    profession: "",
    license_number: "",
    years_of_experience: "",
    specialization: "",
    biography: "",
  });

  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const handleTalentChange = (e) =>
    setTalentForm({ ...talentForm, [e.target.name]: e.target.value });

  async function handleStep1(e) {
    e.preventDefault();
    setErrMsg("");
    if (userForm.password !== userForm.confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }
    try {
      console.log({
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        confirm_password: userForm.confirmPassword,
        role: "TALENT",
      });
      // 1. Create the user account
      await createUser({
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        confirm_password: userForm.confirmPassword,
        role: "TALENT",
      }).unwrap();

      // 2. Log in to get token and save it to Redux so prepareHeaders picks it up
      const loginRes = await login({
        username: userForm.username,
        password: userForm.password,
      }).unwrap();

      console.log(loginRes);
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
      console.log(err);
    }
  }

  async function handleStep2(e) {
    e.preventDefault();
    setErrMsg("");
    try {
      // Token is now in Redux — talentApi's prepareHeaders sends it automatically
      await createTalentProfile({ data: { ...talentForm } }).unwrap();
      setSuccess(true);
    } catch (err) {
      setErrMsg(err?.data?.detail || "Error saving profile. Please try again.");
    }
  }

  if (success) {
    return (
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2>You're in!</h2>
            <p>
              Your healthcare professional account has been created
              successfully.
            </p>
            <Link to="/employee-dashboard" className={styles.loginLink}>
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
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressStep} ${step >= 1 ? styles.active : ""}`}
          >
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Account</span>
          </div>
          <div
            className={`${styles.progressLine} ${step >= 2 ? styles.filled : ""}`}
          />
          <div
            className={`${styles.progressStep} ${step >= 2 ? styles.active : ""}`}
          >
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Profile</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className={styles.signupHeader}>
              <h1>Create Your Account</h1>
              <p>Join thousands of verified healthcare professionals</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleStep1}>
              {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username *</label>
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
                    placeholder="your.email@example.com"
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
                Already have an account? <Link to="/auth">Login here</Link>
              </p>
            </div>
            <div className={styles.altPrompt}>
              <p>
                Are you an employer?{" "}
                <Link to="/auth/employer-signup">Sign up as an employer</Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.signupHeader}>
              <h1>Your Professional Profile</h1>
              <p>Tell us about your healthcare expertise</p>
            </div>

            <form className={styles.signupForm} onSubmit={handleStep2}>
              {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={talentForm.full_name}
                    onChange={handleTalentChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone_number">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={talentForm.phone_number}
                    onChange={handleTalentChange}
                    placeholder="+234 XXX XXX XXXX"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="profession">Profession *</label>
                  <select
                    id="profession"
                    name="profession"
                    value={talentForm.profession}
                    onChange={handleTalentChange}
                    required
                  >
                    <option value="">Select your profession</option>
                    {PROFESSIONS.map((p) => (
                      <option
                        key={p}
                        value={p.toLowerCase().replace(/ /g, "-")}
                      >
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="specialization">Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={talentForm.specialization}
                    onChange={handleTalentChange}
                    placeholder="e.g. Cardiology, Paediatrics"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="license_number">License Number</label>
                  <input
                    type="text"
                    id="license_number"
                    name="license_number"
                    value={talentForm.license_number}
                    onChange={handleTalentChange}
                    placeholder="Professional license number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="years_of_experience">
                    Years of Experience *
                  </label>
                  <select
                    id="years_of_experience"
                    name="years_of_experience"
                    value={talentForm.years_of_experience}
                    onChange={handleTalentChange}
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

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="biography">Short Bio</label>
                  <textarea
                    id="biography"
                    name="biography"
                    value={talentForm.biography}
                    onChange={handleTalentChange}
                    placeholder="Tell employers a bit about yourself…"
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
                  {creatingProfile ? "Saving Profile…" : "Complete Signup"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
