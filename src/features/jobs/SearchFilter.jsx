import styles from "./SearchFilter.module.css";

export default function SearchFilter() {
  return (
    <div className={styles.searchFilter}>
      <div className={styles.filter}>
        <h5>Filters</h5>
        <p>Clear all</p>
      </div>

      <ul>
        <h5>Profession</h5>
        <li>
          <div className={styles.radio}>
            <div>
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
                class="lucide lucide-check h-4 w-4"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <p>Registered Nurse</p>
          </div>
        </li>
      </ul>
      <ul>
        <h5>Experience Level</h5>
        <li>
          <div className={styles.radioSelect}>
            <div>
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
                class="lucide lucide-check h-4 w-4"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <p>Entry Level (0-2 years)</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
