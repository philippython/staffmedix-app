import styles from "./SearchFilter.module.css";
import { exprienceLevels, employment_type, shift_type } from "../../data/data";
import extractMinYear from "../../utils/extractMinYear";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleMultiFilter,
  clearAllFilters,
} from "../../store/slices/jobFilterSlice";

export default function SearchFilter({ variant }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.jobFilter);

  const handleToggle = (field, value) => {
    dispatch(toggleMultiFilter({ field, value }));
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  return (
    <div
      className={
        variant === "block"
          ? styles.searchFilter
          : `${styles.searchFilter} ${styles.searchFilterResponsive}`
      }
    >
      {/* Header */}
      <div className={styles.filter}>
        <h5>Filters</h5>
        <p onClick={handleClearAll}>Clear all</p>
      </div>

      {/* Employment Type */}
      <ul>
        <h5>Employment type</h5>
        <li>
          {employment_type.map((empType) => (
            <div
              key={empType}
              className={
                filters.employment_type.includes(empType)
                  ? styles.radioSelect
                  : styles.radio
              }
              onClick={() => handleToggle("employment_type", empType)}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
              <p>{empType}</p>
            </div>
          ))}
        </li>
      </ul>

      {/* Shift Type */}
      <ul>
        <h5>Shift type</h5>
        <li>
          {shift_type.map((shift) => (
            <div
              key={shift}
              className={
                filters.shift_type.includes(shift)
                  ? styles.radioSelect
                  : styles.radio
              }
              onClick={() => handleToggle("shift_type", shift)}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
              <p>{shift}</p>
            </div>
          ))}
        </li>
      </ul>

      {/* Experience Level */}
      <ul>
        <h5>Experience level</h5>
        <li>
          {exprienceLevels.map((exp) => {
            const minYear = extractMinYear(exp);

            return (
              <div
                key={exp}
                className={
                  filters.experience.includes(minYear)
                    ? styles.radioSelect
                    : styles.radio
                }
                onClick={() => handleToggle("experience", exp)}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check h-4 w-4"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>

                <p>{exp}</p>
              </div>
            );
          })}
        </li>
      </ul>
    </div>
  );
}
