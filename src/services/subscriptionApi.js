import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/subscriptions/`;

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Subscription", "Plan"],
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "plan/",
      providesTags: ["Plan"],
    }),

    getPlanById: builder.query({
      query: (planId) => `plan/${planId}/`,
      providesTags: (result, error, id) => [{ type: "Plan", id }],
    }),

    // ── Subscriptions ─────────────────────────────
    getSubscriptions: builder.query({
      query: ({ companyId } = {}) => ({
        url: "subscription/",
        params: companyId ? { company: companyId } : {},
      }),
      providesTags: ["Subscription"],
    }),

    getSubscriptionById: builder.query({
      query: (subscriptionId) => `subscription/${subscriptionId}/`,
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),

    createSubscription: builder.mutation({
      query: (data) => ({
        url: "subscription/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscription: builder.mutation({
      query: ({ subscriptionId, data }) => ({
        url: `subscription/${subscriptionId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `subscription/${subscriptionId}/`,
        method: "PATCH",
        body: { active: false },
      }),
      invalidatesTags: ["Subscription"],
    }),

    deleteSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `subscription/${subscriptionId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
