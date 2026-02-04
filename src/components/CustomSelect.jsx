import styles from "./CustomSelect.module.css";
import { useState } from "react";

export default function CustomSelect({
  filter,
  options,
  onOptionChange,
  selectedOption,
}) {
  const [selected, setSelected] = useState(false);

  return (
    <div>
      <div
        style={{ outline: selected ? "2px solid var(--dark-teal)" : "none" }}
        className={styles.select}
        onClick={() => setSelected(!selected)}
      >
        {selectedOption ? selectedOption : filter}
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
        <div
          style={{ display: selected ? "block" : "none" }}
          className={styles.dropdown}
        >
          {selected && (
            <ul>
              {options.map((option) => (
                <li onClick={() => onOptionChange(option)}>{option}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
