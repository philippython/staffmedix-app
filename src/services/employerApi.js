import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/organizations/`;

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    employerSignUp: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useEmployerSignUpMutation } = employerApi;
