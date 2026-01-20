import styles from "./CustomSelect.module.css";
import { useState } from "react";

export default function CustomSelect() {
  const [location, setLocation] = useState("Lagos");
  const [selected, setSelected] = useState(false);

  function handleLocationClick(e) {
    setSelected(!selected);
    setLocation(e.target.textContent);
  }

  return (
    <div>
      <div
        style={{ outline: selected ? "2px solid var(--dark-teal)" : "none" }}
        className={styles.select}
        onClick={() => setSelected(!selected)}
      >
        {location}
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
          class="lucide lucide-chevron-down h-4 w-4 opacity-50"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>
      <div
        style={{ display: selected ? "block" : "none" }}
        className={styles.dropdown}
      >
        {selected && (
          <ul>
            <li onClick={handleLocationClick}>Lagos</li>
            <li onClick={handleLocationClick}>Ogun</li>
            <li onClick={handleLocationClick}>Port-Harcout</li>
          </ul>
        )}
      </div>
    </div>
  );
}
