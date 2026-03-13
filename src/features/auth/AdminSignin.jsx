import styles from "./PasswordReset.module.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { useLoginMutation } from "../../services/authApi";
import { loginSuccess } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router";

export default function AdminSigin() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: loading, isError: error }] = useLoginMutation();
  const { loginErrorMsg } = useAuthRedirect();

  const dispatch = useDispatch();

  async function handleSignIn() {
    try {
      const response = await login({ username, password }).unwrap();

      dispatch(  
        loginSuccess({
          token: response?.token,
          expiry: response?.expiry,
        }),
      );
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div className={styles.passwordResetContainer}>
      <div className={styles.authForm}>
        <h4>Administrator login</h4>
        <p>Enter your credentials to access your account</p>
        <form className={styles.form}>
          {error ? (
            <p className={styles.errMsg}>Username or Password is invalid</p>
          ) : (
            <p className={styles.errMsg}>{loginErrorMsg}</p>
          )}

          <label>Username</label>
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
              placeholder="johndoe123"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Input>
          <label>Password</label>
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
                   <input
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••••"
                     onChange={(e) => setPassword(e.target.value)}
                     value={password}
                   />
                   {showPassword ? (
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
                       class="lucide lucide-eye w-5 h-5"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                       <circle cx="12" cy="12" r="3"></circle>
                     </svg>
                   ) : (
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
                       class="lucide lucide-eye-off w-5 h-5"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
                       <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                       <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
                       <path d="m2 2 20 20"></path>
                     </svg>
                   )}
                 </Input>
        </form>
        <Button variant={"coloredButton"} onClick={handleSignIn}>
          {loading ? "Sign in...." : "Sign in"}
        </Button>

        <Link className={styles.backLink} to={"/"}>
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
