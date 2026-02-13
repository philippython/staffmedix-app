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
    }),
    createJob: builder.mutation({
      query: (newJob) => ({
        url: "job-postings/",
        method: "POST",
        body: newJob,
      }),
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
    }),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useGetJobByIdQuery,
  useApplyToJobMutation,
} = jobsApi;
