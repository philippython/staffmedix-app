import JobOpening from "./JobOpening.jsx";
import SearchFilter from "./SearchFilter.jsx";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./JobListing.module.css";
import { filters } from "../../data/data.js";
import FILTER_MAPS from "../../data/filter_map.js";
import {
  useGetJobsQuery,
  useApplyToJobMutation,
} from "../../services/jobsApi.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../store/slices/jobFilterSlice";
import { useNavigate } from "react-router";

export default function JobListing() {
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrPage] = useState(1);
  const ordering = useSelector((state) => state.jobFilter.ordering);
  const rawFilters = useSelector((state) => state.jobFilter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  // Apply to job mutation
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

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

  async function handleApplyNow(jobId) {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Check if user is a talent
    if (userRole !== "talent") {
      navigate("/auth");
      return;
    }

    try {
      await applyToJob(jobId).unwrap();
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert(
        error?.data?.detail ||
          "Failed to submit application. Please try again.",
      );
    }
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
      {jobs &&
        jobs.map((job) => (
          <JobOpening
            key={job.id}
            job={job}
            onApply={() => handleApplyNow(job.id)}
            isApplying={isApplying}
          />
        ))}
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
