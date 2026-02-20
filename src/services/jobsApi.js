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
  tagTypes: ["Jobs", "AppliedJobs"],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: ({
        limit = 10,
        offset = 0,
        ...filters //
      } = {}) => ({
        url: "job-postings/",
        params: {
          limit,
          offset,
          ...filters,
        },
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
    }),

    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: "applied-jobs/",
        method: "POST",
        body: {
          job: jobId,
        },
      }),
      invalidatesTags: ["AppliedJobs"],
    }),

    // Get all applied jobs for current user
    getAppliedJobs: builder.query({
      query: ({ limit = 10, offset = 0, talent } = {}) => ({
        url: "applied-jobs/",
        params: {
          limit,
          offset,
          ...(talent && { talent }),
        },
      }),
      providesTags: ["AppliedJobs"],
    }),

    // Get applied job by ID
    getAppliedJobById: builder.query({
      query: (appliedJobId) => `applied-jobs/${appliedJobId}/`,
      providesTags: ["AppliedJobs"],
    }),

    // Delete/Withdraw applied job
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
  useApplyToJobMutation,
  useGetAppliedJobsQuery,
  useGetAppliedJobByIdQuery,
  useDeleteAppliedJobMutation,
} = jobsApi;
