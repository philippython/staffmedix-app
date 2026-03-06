import styles from "./Auth.module.css";
import AuthForm from "./AuthForm";
import AuthHero from "./AuthHero";

export default function Auth() {
  return (
    <div className={styles.auth}>
      <AuthHero />
      <AuthForm />
    </div>
  );
}
