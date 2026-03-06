import styles from "./PasswordReset.module.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { usePasswordResetMutation } from "../../services/authApi";
import { Link } from "react-router";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [password_reset, { isLoading: loading, isError: error }] =
    usePasswordResetMutation();

  async function handleResetPassword() {
    try {
      await password_reset({ email: email }).unwrap();

      setMsg("Check your email for futher information :)");
    } catch (err) {
      console.error("Password does not exist ", err);
    }
  }

  return (
    <div className={styles.passwordResetContainer}>
      <div className={styles.authForm}>
        <h4>Welcome back</h4>
        {msg === "" ? (
          <>
            <p>Enter the email linked to your account</p>
            {error && <p className={styles.errMsg}>Email does not exist</p>}

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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Input>
            </form>
            <Button variant={"coloredButton"} onClick={handleResetPassword}>
              {loading ? "Sending email confirmation...." : "Reset Password"}
            </Button>
          </>
        ) : (
          <p>{msg}</p>
        )}
        <Link className={styles.backLink} to={"/"}>
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
