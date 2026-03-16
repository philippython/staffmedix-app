import { useState } from "react";
import { useNavigate } from "react-router";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import styles from "./AdminCreateUser.module.css";
import { useCreateUserMutation } from "../../services/userApi";

export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "TALENT",       // RoleType enum — send uppercase to match choices
    isActive: true,
  });
  const [errors, setErrors]           = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast]             = useState(null);

  const [createUser, { isLoading }] = useCreateUserMutation();

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role: role.toUpperCase() }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.username.trim())        e.username = "Username is required";
    else if (formData.username.length < 3) e.username = "Username must be at least 3 characters";
    if (!formData.email.trim())           e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
    if (!formData.firstName.trim())       e.firstName = "First name is required";
    if (!formData.lastName.trim())        e.lastName  = "Last name is required";
    if (!formData.password)               e.password  = "Password is required";
    else if (formData.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword)        e.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        username:   formData.username,
        email:      formData.email,
        password:   formData.password,
        first_name: formData.firstName,
        last_name:  formData.lastName,
        role:       formData.role,
        is_active:  formData.isActive,
      };
      console.log("[AdminCreateUser] POST →", payload);
      const result = await createUser(payload).unwrap();
      console.log("[AdminCreateUser] response →", result);

      showToast("User created successfully!");
      setTimeout(() => navigate("/admin-dashboard/all-users"), 1500);
    } catch (error) {
      if (error.data) {
        const apiErrors = {};
        Object.keys(error.data).forEach(key => {
          apiErrors[key] = Array.isArray(error.data[key])
            ? error.data[key][0]
            : error.data[key];
        });
        setErrors(apiErrors);
        // Surface non-field errors as toast
        const detail = error.data?.detail ?? error.data?.non_field_errors?.[0];
        if (detail) showToast(String(detail), "error");
        else showToast("Please fix the errors below", "error");
      } else {
        showToast("Failed to create user. Please try again.", "error");
      }
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      <main className={styles.adminCreateUser}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Create New User</h1>
              <p>Add a new user to the platform</p>
            </div>
          </div>

          <div className={styles.formContainer}>
            {errors.form && <div className={styles.formError}>{errors.form}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.section}>
                <h3>User Information</h3>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name <span className={styles.required}>*</span></label>
                    <Input>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName}
                        onChange={handleChange} placeholder="John"
                        className={errors.firstName ? styles.errorInput : ""} />
                    </Input>
                    {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name <span className={styles.required}>*</span></label>
                    <Input>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName}
                        onChange={handleChange} placeholder="Doe"
                        className={errors.lastName ? styles.errorInput : ""} />
                    </Input>
                    {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="username">Username <span className={styles.required}>*</span></label>
                  <Input>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <input type="text" id="username" name="username" value={formData.username}
                      onChange={handleChange} placeholder="johndoe"
                      className={errors.username ? styles.errorInput : ""} />
                  </Input>
                  {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address <span className={styles.required}>*</span></label>
                  <Input>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input type="email" id="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="john@example.com"
                      className={errors.email ? styles.errorInput : ""} />
                  </Input>
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Account Settings</h3>

                <div className={styles.formGroup}>
                  <label>Role <span className={styles.required}>*</span></label>
                  <CustomSelect
                    options={["Talent", "Employer", "Admin"]}
                    selectedOption={
                      formData.role === "TALENT"   ? "Talent"   :
                      formData.role === "EMPLOYER" ? "Employer" : "Admin"
                    }
                    onOptionChange={handleRoleChange}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">Password <span className={styles.required}>*</span></label>
                    <Input variant="full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input type={showPassword ? "text" : "password"} id="password" name="password"
                        value={formData.password} onChange={handleChange} placeholder="••••••••"
                        className={errors.password ? styles.errorInput : ""} />
                      <button type="button" className={styles.togglePassword}
                        onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </Input>
                    {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password <span className={styles.required}>*</span></label>
                    <Input variant="full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                        className={errors.confirmPassword ? styles.errorInput : ""} />
                    </Input>
                    {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    <span>Account is active</span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => navigate("/admin-dashboard/all-users")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Creating User..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}