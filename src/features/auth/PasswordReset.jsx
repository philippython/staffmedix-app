import styles from "./PasswordReset.module.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function PasswordReset() {
  const [username, setUsername] = useState("");
  // const navigate = useNavigate();

  return (
    <div className={styles.passwordResetContainer}>
      <div className={styles.authForm}>
        <h4>Welcome back</h4>
        <p>Enter the email linked to your account</p>
        <form className={styles.form}>
          <label>Email</label>
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
            <input
              type="text"
              placeholder="example@gmail.com"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Input>
        </form>
        <Button variant={"coloredButton"}>Reset Password</Button>

        <Link className={styles.backLink} to={"/"}>
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
