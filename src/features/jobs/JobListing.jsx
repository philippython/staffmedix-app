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
import { useGetTalentProfileQuery } from "../../services/talentApi.js";
import { useWhoAmIQuery } from "../../services/userApi.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../store/slices/jobFilterSlice";
import { useNavigate } from "react-router";

export default function JobListing() {
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrPage] = useState(1);
  const [optimisticallyApplied, setOptimisticallyApplied] = useState(new Set());
  const ordering = useSelector((state) => state.jobFilter.ordering);
  const rawFilters = useSelector((state) => state.jobFilter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [applyToJob] = useApplyToJobMutation();

  // whoAmI gives us role + talent_id
  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const talentId = whoAmI?.talent_id;
  const isTalent = whoAmI?.role === "TALENT" && !!talentId;

  // Fetch talent profile which contains applied_jobs
  const { data: talentProfile } = useGetTalentProfileQuery(talentId, {
    skip: !isTalent,
  });

  // Set of applied job IDs for O(1) lookup — merge server data + optimistic
  const appliedJobIds = new Set([
    ...(talentProfile?.applied_jobs?.map((app) => app.job) ?? []),
    ...optimisticallyApplied,
  ]);

  console.log(appliedJobIds);

  const { SHIFT_TYPE_MAP, EMPLOYMENT_TYPE_MAP, ORDERING_MAP } = FILTER_MAPS;
  const apiFilters = {
    title: rawFilters.title || undefined,
    location: rawFilters.location || undefined,
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
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!isTalent) {
      navigate("/auth");
      return;
    }

    // Optimistically mark as applied immediately
    setOptimisticallyApplied((prev) => new Set(prev).add(jobId));

    try {
      await applyToJob(jobId).unwrap();
    } catch (error) {
      // Revert on failure
      setOptimisticallyApplied((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
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
        jobs.map((job) => {
          const hasApplied = appliedJobIds.has(job.id);
          const isThisJobApplying =
            optimisticallyApplied.has(job.id) && !appliedJobIds.has(job.id);
          return (
            <JobOpening
              key={job.id}
              job={job}
              onApply={() => handleApplyNow(job.id)}
              isApplying={isThisJobApplying}
              hasApplied={hasApplied}
              truncateDescription // tells JobOpening to clamp description to 2 lines
            />
          );
        })}

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
