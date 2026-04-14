import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/payments/`;

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Payment", "Account", "Recipient", "Bank"],
  endpoints: (builder) => ({

    // ── Payments ──────────────────────────────────────────────────────────

    getPayments: builder.query({
      query: () => "",
      providesTags: ["Payment"],
    }),

    getPaymentById: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    /**
     * POST /payments/initiate/
     * plan_id — required for subscription payments (stored in payment.note)
     * note    — optional label for locum payments
     * Returns: { payment_id, authorization_url, reference }
     */
    initiatePayment: builder.mutation({
      query: ({ amount, reason, plan_id, note }) => ({
        url: "initiate/",
        method: "POST",
        body: {
          amount,
          reason,
          ...(plan_id && { plan_id }),
          ...(note   && { note }),
        },
      }),
      invalidatesTags: ["Payment"],
    }),

    /** GET /payments/verify/?reference= (lazy query version) */
    verifyPayment: builder.query({
      query: (reference) => ({
        url: "verify/",
        params: { reference },
      }),
      providesTags: (result, error, reference) => [{ type: "Payment", id: reference }],
    }),

    /** POST-style imperative verify — used in PaystackReturn after redirect */
    verifyPaymentMutation: builder.mutation({
      query: (reference) => ({
        url: "verify/",
        method: "GET",          // verify is a GET but we need imperative call
        params: { reference },
      }),
      invalidatesTags: ["Payment"],
    }),

    withdraw: builder.mutation({
      query: ({ amount }) => ({
        url: "withdraw/",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Payment"],
    }),

    // ── Banks ─────────────────────────────────────────────────────────────

    getBanks: builder.query({
      query: () => "banks/",
      providesTags: ["Bank"],
    }),

    resolveAccount: builder.query({
      query: ({ accountNumber, bankCode }) => ({
        url: "resolve-account/",
        params: {
          account_number: accountNumber,
          bank_code:      bankCode,
        },
      }),
    }),

    // ── Account Details ───────────────────────────────────────────────────
    // OneToOne with User — list returns [] or [record], create upserts

    getAccountDetails: builder.query({
      query: () => "accounts/",
      providesTags: ["Account"],
      transformResponse: (response) => response, // plain array from backend
    }),

    createAccountDetails: builder.mutation({
      query: (data) => ({
        url: "accounts/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),

    updateAccountDetails: builder.mutation({
      query: ({ id, data }) => ({
        url: `accounts/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),

    deleteAccountDetails: builder.mutation({
      query: (id) => ({
        url: `accounts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),

    // ── Payment Recipients ────────────────────────────────────────────────
    // Talent: sees records where talent=user  (their earnings)
    // Employer: sees records where payment__user=user (payments they made)

    getRecipients: builder.query({
      query: ({ paymentId } = {}) => ({
        url: "payment-recipients/",
        params: paymentId ? { payment: paymentId } : {},
      }),
      providesTags: ["Recipient"],
    }),

    getRecipientById: builder.query({
      query: (id) => `payment-recipients/${id}/`,
      providesTags: (result, error, id) => [{ type: "Recipient", id }],
    }),

    createRecipient: builder.mutation({
      query: ({ paymentId, talentId, jobId }) => ({
        url: "payment-recipients/",
        method: "POST",
        body: {
          payment: paymentId,
          talent:  talentId,
          job:     jobId,
        },
      }),
      invalidatesTags: ["Recipient", "Payment"],
    }),

    /** PATCH /payments/payment-recipients/<id>/ — admin approve/revoke */
    updateRecipient: builder.mutation({
      query: ({ id, eligible }) => ({
        url: `payment-recipients/${id}/`,
        method: "PATCH",
        body: { eligible },
      }),
      invalidatesTags: ["Recipient"],
    }),

    deleteRecipient: builder.mutation({
      query: (id) => ({
        url: `payment-recipients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipient"],
    }),

  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentQuery,
  useVerifyPaymentMutationMutation,
  useWithdrawMutation,
  useGetBanksQuery,
  useResolveAccountQuery,
  useGetAccountDetailsQuery,
  useCreateAccountDetailsMutation,
  useUpdateAccountDetailsMutation,
  useDeleteAccountDetailsMutation,
  useGetRecipientsQuery,
  useGetRecipientByIdQuery,
  useCreateRecipientMutation,
  useUpdateRecipientMutation,
  useDeleteRecipientMutation,
} = paymentApi;