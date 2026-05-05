import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/jobs/`;

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Jobs", "AppliedJobs", "TalentProfile"],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: ({ limit = 10, offset = 0, ...filters } = {}) => ({
        url: "job-postings/",
        params: { limit, offset, ...filters },
      }),
      providesTags: ["Jobs"],
    }),

    createJob: builder.mutation({
      query: (newJob) => ({
        url: "job-postings/",
        method: "POST",
        body: newJob,
      }),
      invalidatesTags: ["Jobs"],
    }),

    getJobById: builder.query({
      query: (jobId) => `job-postings/${jobId}/`,
      providesTags: (result, error, jobId) => [{ type: "Jobs", id: jobId }],
    }),

    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `job-postings/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Jobs", id }, "Jobs"],
    }),

    deleteJob: builder.mutation({
      query: (id) => ({
        url: `job-postings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: "applied-jobs/",
        method: "POST",
        body: { job: jobId },
      }),
      // Invalidate AppliedJobs AND TalentProfile so applied_jobs list
      // is fresh immediately — prevents stale data and duplicate applications
      invalidatesTags: ["AppliedJobs", "TalentProfile"],
    }),

    getAppliedJobs: builder.query({
      query: ({ limit = 10, offset = 0, talent, company } = {}) => ({
        url: "applied-jobs/",
        params: {
          limit,
          offset,
          ...(talent  && { talent }),
          ...(company && { company }),
        },
      }),
      providesTags: ["AppliedJobs"],
    }),

    getAppliedJobById: builder.query({
      query: (appliedJobId) => `applied-jobs/${appliedJobId}/`,
      providesTags: ["AppliedJobs"],
    }),

    updateAppliedJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `applied-jobs/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AppliedJobs"],
    }),

    deleteAppliedJob: builder.mutation({
      query: (appliedJobId) => ({
        url: `applied-jobs/${appliedJobId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppliedJobs"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
  useGetAppliedJobsQuery,
  useGetAppliedJobByIdQuery,
  useUpdateAppliedJobMutation,
  useDeleteAppliedJobMutation,
} = jobsApi;