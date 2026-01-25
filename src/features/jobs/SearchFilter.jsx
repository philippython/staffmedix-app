import styles from "./SearchFilter.module.css";
import { exprienceLevels, professions } from "../../data/data";
import { useState } from "react";

export default function SearchFilter({ variant }) {
  const [professionFilters, setProfessionFilters] = useState([]);
  const [experienceFilters, setExperienceFilters] = useState([]);

  function clearAllFilters() {
    setProfessionFilters([]);
    setExperienceFilters([]);
  }

  function handleProfessionFilterAdd(clickedFilter) {
    setProfessionFilters((filters) => [...filters, clickedFilter]);
    if (professionFilters.includes(clickedFilter)) {
      setProfessionFilters((filters) =>
        filters.filter((filter) => filter !== clickedFilter),
      );
    }
  }

  function handleExperienceFilterAdd(clickedFilter) {
    setExperienceFilters((filters) => [...filters, clickedFilter]);
    if (experienceFilters.includes(clickedFilter)) {
      setExperienceFilters((filters) =>
        filters.filter((filter) => filter !== clickedFilter),
      );
    }
  }
  return (
    <div
      className={
        variant === "block"
          ? styles.searchFilter
          : `${styles.searchFilter} ${styles.searchFilterResponsive}`
      }
    >
      <div className={styles.filter}>
        <h5>Filters</h5>
        <p onClick={clearAllFilters}>Clear all</p>
      </div>

      <ul>
        <h5>Profession</h5>
        <li>
          {professions.map((profession) => (
            <div
              className={
                professionFilters.includes(profession)
                  ? styles.radioSelect
                  : styles.radio
              }
              key={profession}
              onClick={() => handleProfessionFilterAdd(profession)}
            >
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
              <p>{profession}</p>
            </div>
          ))}
        </li>
      </ul>
      <ul>
        <h5>Profession</h5>
        <li>
          {exprienceLevels.map((experience) => (
            <div
              className={
                experienceFilters.includes(experience)
                  ? styles.radioSelect
                  : styles.radio
              }
              key={experience}
              onClick={() => handleExperienceFilterAdd(experience)}
            >
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
              <p>{experience}</p>
            </div>
          ))}
        </li>
      </ul>
    </div>
  );
}
