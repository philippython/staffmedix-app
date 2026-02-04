import JobOpening from "./JobOpening.jsx";
import SearchFilter from "./SearchFilter.jsx";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./JobListing.module.css";
import { filters } from "../../data/data.js";
import FILTER_MAPS from "../../data/filter_map.js";
import { useGetJobsQuery } from "../../services/jobsApi.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../store/slices/jobFilterSlice";

export default function JobListing() {
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrPage] = useState(1);
  const ordering = useSelector((state) => state.jobFilter.ordering);
  const rawFilters = useSelector((state) => state.jobFilter);
  const dispatch = useDispatch();

  const { SHIFT_TYPE_MAP, EMPLOYMENT_TYPE_MAP, ORDERING_MAP } = FILTER_MAPS;
  const apiFilters = {
    title: rawFilters.title || undefined,
    location: rawFilters.location || undefined,

    // Map multi-select arrays and join for DRF __in filtering
    employment_type:
      rawFilters.employment_type
        .map((val) => EMPLOYMENT_TYPE_MAP[val])
        .filter(Boolean)
        .join(",") || undefined,

    shift_type:
      rawFilters.shift_type
        .map((val) => SHIFT_TYPE_MAP[val])
        .filter(Boolean)
        .join(",") || undefined,

    experience: rawFilters.experience.length
      ? rawFilters.experience.join(",")
      : undefined,

    // Map ordering from user-friendly option
    ordering: ORDERING_MAP[rawFilters.ordering] || "-created_at",
  };

  const {
    data: { count, results: jobs } = {},
    isLoading,
    isError,
  } = useGetJobsQuery({
    offset: currentPage === 1 ? 0 : (currentPage - 1) * 10,
    ...apiFilters,
  });

  function handleOptionChange(option) {
    dispatch(updateFilters({ ordering: option }));
  }

  function handlePageChange(newPage) {
    setCurrPage(newPage);
  }

  return (
    <div className={styles.jobListing}>
      <div className={styles.searchFilterCount}>
        <p>
          Showing <strong>{jobs?.length || 0}</strong> jobs
        </p>
        <CustomSelect
          filter={filters[0]}
          options={filters}
          onOptionChange={handleOptionChange}
          selectedOption={ordering}
        />
      </div>

      <button
        className={styles.filter}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        {showFilter ? "Show Filters" : "Hide Filters"}
      </button>

      {!showFilter && <SearchFilter variant={"block"} />}
      {isError ? (
        <div className={styles.error}>
          Error loading jobs, Check your internet connection :(
        </div>
      ) : null}
      {jobs && jobs.map((job) => <JobOpening key={job.id} job={job} />)}
      {isError || isLoading ? null : (
        <Pagination
          pages={Math.ceil(count / 10) || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
