import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/jobs/",
  }),
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "job-postings/",
    }),
    createJob: builder.mutation({
      query: (newJob) => ({
        url: "job-postings/",
        method: "POST",
        body: newJob,
      }),
    }),
    getJobById: builder.query({
      query: (id) => `job-postings/${id}/`,
    }),
  }),
});

export const { useGetJobsQuery, useCreateJobMutation, useGetJobByIdQuery } =
  jobsApi;
