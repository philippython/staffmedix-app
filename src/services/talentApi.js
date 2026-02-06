import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const talentApi = createApi({
  reducerPath: "talentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/talents/",
  }),
  endpoints: (builder) => ({
    talentSignUp: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useTalentSignUpMutation } = talentApi;
