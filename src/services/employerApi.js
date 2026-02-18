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
    // ==================== AUTHENTICATION ====================

    // Employer registration
    employerSignUp: builder.mutation({
      query: (credentials) => ({
        url: "register/",
        method: "POST",
        body: credentials,
      }),
    }),

    // ==================== COMPANY PROFILE ====================

    // Get company profiles (list)
    getCompanyProfiles: builder.query({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: "profile/",
        params: { limit, offset },
      }),
      providesTags: ["CompanyProfile"],
    }),

    // Get company profile by ID
    getCompanyProfileById: builder.query({
      query: (profileId) => `profile/${profileId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyProfile", id }],
    }),

    // Create company profile
    createCompanyProfile: builder.mutation({
      query: (profileData) => ({
        url: "profile/",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // Update company profile
    updateCompanyProfile: builder.mutation({
      query: ({ profileId, data }) => ({
        url: `profile/${profileId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // Upload company logo
    uploadCompanyLogo: builder.mutation({
      query: ({ profileId, formData }) => ({
        url: `profile/${profileId}/upload-logo/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // Delete company profile
    deleteCompanyProfile: builder.mutation({
      query: (profileId) => ({
        url: `profile/${profileId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // ==================== COMPANY CONTACT ====================

    // Get company contacts
    getCompanyContacts: builder.query({
      query: ({ companyId, limit = 10, offset = 0 } = {}) => ({
        url: "contact/",
        params: {
          ...(companyId && { company: companyId }),
          limit,
          offset,
        },
      }),
      providesTags: ["CompanyContact"],
    }),

    // Get contact by ID
    getCompanyContactById: builder.query({
      query: (contactId) => `contact/${contactId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyContact", id }],
    }),

    // Create company contact
    createCompanyContact: builder.mutation({
      query: (contactData) => ({
        url: "contact/",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    // Update company contact
    updateCompanyContact: builder.mutation({
      query: ({ contactId, data }) => ({
        url: `contact/${contactId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    // Delete company contact
    deleteCompanyContact: builder.mutation({
      query: (contactId) => ({
        url: `contact/${contactId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyContact"],
    }),

    // ==================== COMPANY CONTACT PERSON ====================

    // Get company contact persons
    getCompanyContactPersons: builder.query({
      query: ({ companyId, limit = 10, offset = 0 } = {}) => ({
        url: "contact-person/",
        params: {
          ...(companyId && { company: companyId }),
          limit,
          offset,
        },
      }),
      providesTags: ["CompanyContactPerson"],
    }),

    // Get contact person by ID
    getCompanyContactPersonById: builder.query({
      query: (personId) => `contact-person/${personId}/`,
      providesTags: (result, error, id) => [
        { type: "CompanyContactPerson", id },
      ],
    }),

    // Get my contact person (for current company)
    getMyContactPerson: builder.query({
      query: () => "contact-person/me/",
      providesTags: ["CompanyContactPerson"],
    }),

    // Create company contact person
    createCompanyContactPerson: builder.mutation({
      query: (personData) => ({
        url: "contact-person/",
        method: "POST",
        body: personData,
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    // Update company contact person
    updateCompanyContactPerson: builder.mutation({
      query: ({ personId, data }) => ({
        url: `contact-person/${personId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    // Delete company contact person
    deleteCompanyContactPerson: builder.mutation({
      query: (personId) => ({
        url: `contact-person/${personId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyContactPerson"],
    }),

    // ==================== COMPANY SERVICES ====================

    // Get company services
    getCompanyServices: builder.query({
      query: ({ companyId, limit = 100, offset = 0 } = {}) => ({
        url: "service/",
        params: {
          ...(companyId && { company: companyId }),
          limit,
          offset,
        },
      }),
      providesTags: ["CompanyService"],
    }),

    // Get service by ID
    getCompanyServiceById: builder.query({
      query: (serviceId) => `service/${serviceId}/`,
      providesTags: (result, error, id) => [{ type: "CompanyService", id }],
    }),

    // Create company service
    createCompanyService: builder.mutation({
      query: (serviceData) => ({
        url: "service/",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["CompanyService"],
    }),

    // Update company service
    updateCompanyService: builder.mutation({
      query: ({ serviceId, data }) => ({
        url: `service/${serviceId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CompanyService"],
    }),

    // Delete company service
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
  // Authentication
  useEmployerSignUpMutation,

  // Company Profile
  useGetCompanyProfilesQuery,
  useGetCompanyProfileByIdQuery,
  useGetMyCompanyProfileQuery,
  useCreateCompanyProfileMutation,
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
  useGetCompanyContactPersonsQuery,
  useGetCompanyContactPersonByIdQuery,
  useGetMyContactPersonQuery,
  useCreateCompanyContactPersonMutation,
  useUpdateCompanyContactPersonMutation,
  useDeleteCompanyContactPersonMutation,

  // Company Services
  useGetCompanyServicesQuery,
  useGetCompanyServiceByIdQuery,
  useCreateCompanyServiceMutation,
  useUpdateCompanyServiceMutation,
  useDeleteCompanyServiceMutation,
} = employerApi;
