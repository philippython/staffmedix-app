import styles from "./Toggle.module.css";
import ToggleItem from "./ToggleItem";
import { useDispatch, useSelector } from "react-redux";
import { roleToggle } from "../store/slices/authSlice";

export default function Toggle() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  return (
    <div className={styles.toggle}>
      <ToggleItem
        variant={role === "employer" ? "inactive" : "active"}
        onClick={() => dispatch(roleToggle())}
      >
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
          class="lucide lucide-user w-4 h-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <p>Healthcare Worker</p>
      </ToggleItem>
      <ToggleItem
        variant={role === "employer" ? "active" : "inactive"}
        onClick={() => dispatch(roleToggle())}
      >
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
          class="lucide lucide-building2 w-4 h-4"
        >
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
          <path d="M10 6h4"></path>
          <path d="M10 10h4"></path>
          <path d="M10 14h4"></path>
          <path d="M10 18h4"></path>
        </svg>
        <p>Employer</p>
      </ToggleItem>
    </div>
  );
}
