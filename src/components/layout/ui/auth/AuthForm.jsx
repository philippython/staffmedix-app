import Toggle from "../app/Toggle";
import styles from "./AuthForm.module.css";
import Button from "../app/Button";
import Input from "../app/Input";
import { Link } from "react-router";

export default function AuthForm() {
  return (
    <div className={styles.authForm}>
      <h4>Welcome back</h4>
      <p>Enter your credentials to access your account</p>
      <Toggle />
      <form className={styles.form}>
        <label>Email Address</label>
        <Input variant={"full"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-mail absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <input type="email" placeholder="you@example.com" />
        </Input>

        <div className={styles.passwordLabel}>
          <label>Password</label>
          <span>Forgot password ? </span>
        </div>
        <Input variant={"full"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-lock absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input type="password" placeholder="••••••••" />
        </Input>
      </form>
      <Button variant={"coloredButton"}>Sign In &rarr;</Button>
      <p className={styles.newParagraph}>New to StaffMedix? </p>
      <Button variant={"outlinedButton"}>Create an account </Button>
      <Link to={"/"}>&larr; Back to home</Link>
    </div>
  );
}
