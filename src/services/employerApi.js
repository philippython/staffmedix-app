import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/organizations/`;

export const employerApi = createApi({
  reducerPath: "employerApi",
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
  tagTypes: [
    "CompanyProfile",
    "CompanyContact",
    "CompanyService",
    "CompanyContactPerson",
  ],
  endpoints: (builder) => ({
    createCompanyProfile: builder.mutation({
      query: ({ data }) => ({
        url: "profile/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    getCompanyProfiles: builder.query({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "profile/",
        params: { limit, offset },
      }),
      providesTags: ["CompanyProfile"],
    }),

    getCompanyProfileById: builder.query({
      query: (profileId) => `profile/${profileId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyProfile", id }],
    }),

    updateCompanyProfile: builder.mutation({
      query: ({ profileId, data }) => ({
        url: `profile/${profileId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    uploadCompanyLogo: builder.mutation({
      query: ({ profileId, formData }) => ({
        url: `profile/${profileId}/upload-logo/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    deleteCompanyProfile: builder.mutation({
      query: (profileId) => ({
        url: `profile/${profileId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // ── Company Contact ──────────────────────────

    getCompanyContacts: builder.query({
      query: ({ companyId, limit = 10, offset = 0 } = {}) => ({
        url: "contact/",
        params: { ...(companyId && { company: companyId }), limit, offset },
      }),
      providesTags: ["CompanyContact"],
    }),

    getCompanyContactById: builder.query({
      query: (contactId) => `contact/${contactId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyContact", id }],
    }),

    createCompanyContact: builder.mutation({
      query: (contactData) => ({
        url: "contact/",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    updateCompanyContact: builder.mutation({
      query: ({ contactId, data }) => ({
        url: `contact/${contactId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    deleteCompanyContact: builder.mutation({
      query: (contactId) => ({
        url: `contact/${contactId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    // ── Company Contact Person ───────────────────

    createCompanyContactPerson: builder.mutation({
      query: ({ data }) => ({
        url: "contact-person/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    getCompanyContactPersons: builder.query({
      query: ({ companyId, limit = 10, offset = 0 } = {}) => ({
        url: "contact-person/",
        params: { ...(companyId && { company: companyId }), limit, offset },
      }),
      providesTags: ["CompanyContactPerson"],
    }),

    getCompanyContactPersonById: builder.query({
      query: (personId) => `contact-person/${personId}/`,
      providesTags: (result, error, id) => [
        { type: "CompanyContactPerson", id },
      ],
    }),

    getMyContactPerson: builder.query({
      query: () => "contact-person/me/",
      providesTags: ["CompanyContactPerson"],
    }),

    updateCompanyContactPerson: builder.mutation({
      query: ({ personId, data }) => ({
        url: `contact-person/${personId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    deleteCompanyContactPerson: builder.mutation({
      query: (personId) => ({
        url: `contact-person/${personId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    // ── Company Services ─────────────────────────

    getCompanyServices: builder.query({
      query: ({ companyId, limit = 100, offset = 0 } = {}) => ({
        url: "service/",
        params: { ...(companyId && { company: companyId }), limit, offset },
      }),
      providesTags: ["CompanyService"],
    }),

    getCompanyServiceById: builder.query({
      query: (serviceId) => `service/${serviceId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyService", id }],
    }),

    createCompanyService: builder.mutation({
      query: (serviceData) => ({
        url: "service/",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["CompanyService"],
    }),

    updateCompanyService: builder.mutation({
      query: ({ serviceId, data }) => ({
        url: `service/${serviceId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyService"],
    }),

    deleteCompanyService: builder.mutation({
      query: (serviceId) => ({
        url: `service/${serviceId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyService"],
    }),
  }),
});

export const {
  // Company Profile
  useCreateCompanyProfileMutation,
  useGetCompanyProfilesQuery,
  useGetCompanyProfileByIdQuery,
  useUpdateCompanyProfileMutation,
  useUploadCompanyLogoMutation,
  useDeleteCompanyProfileMutation,

  // Company Contact
  useGetCompanyContactsQuery,
  useGetCompanyContactByIdQuery,
  useCreateCompanyContactMutation,
  useUpdateCompanyContactMutation,
  useDeleteCompanyContactMutation,

  // Company Contact Person
  useCreateCompanyContactPersonMutation,
  useGetCompanyContactPersonsQuery,
  useGetCompanyContactPersonByIdQuery,
  useGetMyContactPersonQuery,
  useUpdateCompanyContactPersonMutation,
  useDeleteCompanyContactPersonMutation,

  // Company Services
  useGetCompanyServicesQuery,
  useGetCompanyServiceByIdQuery,
  useCreateCompanyServiceMutation,
  useUpdateCompanyServiceMutation,
  useDeleteCompanyServiceMutation,
} = employerApi;
