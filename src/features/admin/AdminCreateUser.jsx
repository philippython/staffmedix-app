import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Button from "../../components/Button";
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
    role: "talent",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role: role.toLowerCase() }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        is_active: formData.isActive ? 1 : 0,
      }).unwrap();

      alert("User created successfully!");
      navigate("/admin-dasboard/all-users");
    } catch (error) {
      console.error("Failed to create user:", error);

      if (error.data) {
        const apiErrors = {};
        Object.keys(error.data).forEach((key) => {
          if (Array.isArray(error.data[key])) {
            apiErrors[key] = error.data[key][0];
          } else {
            apiErrors[key] = error.data[key];
          }
        });
        setErrors(apiErrors);
      } else {
        setErrors({ form: "Failed to create user. Please try again." });
      }
    }
  };

  return (
    <>
      <main className={styles.adminCreateUser}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Create New User</h1>
              <p>Add a new user to the platform</p>
            </div>
           
          </div>

          <div className={styles.formContainer}>
            {errors.form && (
              <div className={styles.formError}>{errors.form}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.section}>
                <h3>User Information</h3>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">
                      First Name <span className={styles.required}>*</span>
                    </label>
                    <Input>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={errors.firstName ? styles.errorInput : ""}
                      />
                    </Input>
                    {errors.firstName && (
                      <span className={styles.errorMessage}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">
                      Last Name <span className={styles.required}>*</span>
                    </label>
                    <Input>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={errors.lastName ? styles.errorInput : ""}
                      />
                    </Input>
                    {errors.lastName && (
                      <span className={styles.errorMessage}>
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="username">
                    Username <span className={styles.required}>*</span>
                  </label>
                  <Input>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={errors.username ? styles.errorInput : ""}
                    />
                  </Input>
                  {errors.username && (
                    <span className={styles.errorMessage}>
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    Email Address <span className={styles.required}>*</span>
                  </label>
                  <Input>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={errors.email ? styles.errorInput : ""}
                    />
                  </Input>
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Account Settings</h3>

                <div className={styles.formGroup}>
                  <label>
                    Role <span className={styles.required}>*</span>
                  </label>
                  <CustomSelect
                    options={["Talent", "Employer", "Admin"]}
                    selectedOption={
                      formData.role === "talent"
                        ? "Talent"
                        : formData.role === "employer"
                        ? "Employer"
                        : "Admin"
                    }
                    onOptionChange={handleRoleChange}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">
                      Password <span className={styles.required}>*</span>
                    </label>
                    <Input>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={errors.password ? styles.errorInput : ""}
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </Input>
                    {errors.password && (
                      <span className={styles.errorMessage}>
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">
                      Confirm Password <span className={styles.required}>*</span>
                    </label>
                    <Input>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={
                          errors.confirmPassword ? styles.errorInput : ""
                        }
                      />
                    </Input>
                    {errors.confirmPassword && (
                      <span className={styles.errorMessage}>
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <span>Account is active</span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <Link to="/admin-dashboard/all-users">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="coloredButton"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating User..." : "Create User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}