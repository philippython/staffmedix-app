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
      query: ({ limit = 10, offset = 0, ordering } = {}) => ({
        url: "job-postings/",
        params: {
          limit,
          offset,
          ordering,
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
  }),
});

export const { useGetJobsQuery, useCreateJobMutation, useGetJobByIdQuery } =
  jobsApi;
