import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/interviews/`;

export const interviewsApi = createApi({
  reducerPath: "interviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Interview", "AppliedJobs"],
  endpoints: (builder) => ({
    getInterviews: builder.query({
      query: ({ company, talent, limit = 100, offset = 0 } = {}) => ({
        url: "",
        params: {
          ...(company && { company }),
          ...(talent && { talent }),
          limit,
          offset,
        },
      }),
      providesTags: ["Interview"],
    }),

    getInterviewById: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: "Interview", id }],
    }),

    createInterview: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      // Invalidate both Interview AND AppliedJobs so the list refetches
      // with the new interview nested inside the applied job
      invalidatesTags: ["Interview", "AppliedJobs"],
    }),

    updateInterview: builder.mutation({
      query: ({ interviewId, data }) => ({
        url: `${interviewId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Interview", "AppliedJobs"],
    }),

    deleteInterview: builder.mutation({
      query: (interviewId) => ({
        url: `${interviewId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Interview"],
    }),
  }),
});

export const {
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  useCreateInterviewMutation,
  useUpdateInterviewMutation,
  useDeleteInterviewMutation,
} = interviewsApi;
