import Button from "./Button";
import styles from "./JobHero.module.css";
import { useState } from "react";

export default function JobHero() {
  const [location, setLocation] = useState("Lagos");
  const [selected, setSelected] = useState(false);

  function handleLocationClick(e) {
    setSelected(!selected);
    setLocation(e.target.textContent);
  }
  return (
    <header className={styles.jobHero}>
      <h3>Find Your Next Healthcare Opportunity</h3>
      <div>
        <div className={styles.inputDiv}>
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
            class="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            className={styles.input}
            type="text"
            placeholder="Search by job title, profession..."
          />
        </div>

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
        <div className={styles.dropdown}>
          {selected && (
            <ul>
              <li onClick={handleLocationClick}>Lagos</li>
              <li onClick={handleLocationClick}>Ogun</li>
              <li onClick={handleLocationClick}>Port-Harcout</li>
            </ul>
          )}
        </div>

        <Button variant={"coloredButton"}>
          <div className={styles.searchButton}>
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
              class="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <p>Search Jobs</p>
          </div>
        </Button>
      </div>
    </header>
  );
}
