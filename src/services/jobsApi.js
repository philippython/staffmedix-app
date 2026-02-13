import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/jobs/",
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
      query: ({ jobId, companyId }) => ({
        url: "applied-jobs/",
        method: "POST",
        body: {
          job: jobId,
          company: companyId,
        },
      }),
      invalidatesTags: ["AppliedJobs"],
    }),

    // Get all applied jobs for current user
    getAppliedJobs: builder.query({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "applied-jobs/",
        params: {
          limit,
          offset,
        },
      }),
      providesTags: ["AppliedJobs"],
    }),

    // Get applied job by ID
    getAppliedJobById: builder.query({
      query: (appliedJobId) => `applied-jobs/${appliedJobId}/`,
      providesTags: ["AppliedJobs"],
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
} = jobsApi;
