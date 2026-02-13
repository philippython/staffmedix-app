import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const talentApi = createApi({
  reducerPath: "talentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/talents/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "TalentProfile",
    "Applications",
    "WorkExperience",
    "Education",
    "Skills",
    "Credentials",
  ],
  endpoints: (builder) => ({
    talentSignUp: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get talent profile by ID
    getTalentProfile: builder.query({
      query: (talentId) => `${talentId}/`,
      providesTags: ["TalentProfile"],
    }),

    // Get current talent's profile (requires auth)
    getMyProfile: builder.query({
      query: (talentId) => ({
        url: `${talentId}/`,
        method: "GET",
      }),
      providesTags: ["TalentProfile"],
    }),

    // Update talent profile
    updateTalentProfile: builder.mutation({
      query: ({ talentId, data }) => ({
        url: `${talentId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TalentProfile"],
    }),

    // Get talent's applications
    getTalentApplications: builder.query({
      query: (talentId) => `${talentId}/applications/`,
      providesTags: ["Applications"],
    }),

    // Get talent's stats/dashboard data
    getTalentStats: builder.query({
      query: (talentId) => `${talentId}/stats/`,
    }),

    // ============ WORK EXPERIENCE ============
    // Get work experience - uses talent ID in path
    getWorkExperience: builder.query({
      query: (talentId) => `work-experience/${talentId}/`,
      providesTags: ["WorkExperience"],
    }),

    // Add work experience - POST to base URL with talent in body
    addWorkExperience: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "work-experience/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: ["WorkExperience"],
    }),

    // Update work experience - PATCH to specific work ID
    updateWorkExperience: builder.mutation({
      query: ({ workId, data }) => ({
        url: `work-experience/${workId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["WorkExperience"],
    }),

    // Delete work experience - DELETE specific work ID
    deleteWorkExperience: builder.mutation({
      query: ({ workId }) => ({
        url: `work-experience/${workId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkExperience"],
    }),

    // ============ EDUCATION ============
    // Get education - uses talent ID in path
    getEducation: builder.query({
      query: (talentId) => `education/${talentId}/`,
      providesTags: ["Education"],
    }),

    // Add education - POST to base URL with talent in body
    addEducation: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "education/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: ["Education"],
    }),

    // Update education - PATCH to specific education ID
    updateEducation: builder.mutation({
      query: ({ educationId, data }) => ({
        url: `education/${educationId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Education"],
    }),

    // Delete education - DELETE specific education ID
    deleteEducation: builder.mutation({
      query: ({ educationId }) => ({
        url: `education/${educationId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Education"],
    }),

    // ============ SKILLS ============
    // Get skills - uses talent ID in path
    getSkills: builder.query({
      query: (talentId) => `skill/${talentId}/`,
      providesTags: ["Skills"],
    }),

    // Add skill - POST to base URL with talent in body
    addSkill: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "skill/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: ["Skills"],
    }),

    // Delete skill - DELETE specific skill ID
    deleteSkill: builder.mutation({
      query: ({ skillId }) => ({
        url: `skill/${skillId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Skills"],
    }),

    // ============ CREDENTIALS/DOCUMENTS ============
    // Get credentials - uses talent ID in path
    getCredentials: builder.query({
      query: (talentId) => `credential/${talentId}/`,
      providesTags: ["Credentials"],
    }),

    // Upload credential - POST to base URL with talent in FormData
    uploadCredential: builder.mutation({
      query: ({ talentId, data }) => {
        // data is FormData, append talent to it
        data.append("talent", talentId);
        return {
          url: "credential/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Credentials"],
    }),

    // Delete credential - DELETE specific credential ID
    deleteCredential: builder.mutation({
      query: ({ credentialId }) => ({
        url: `credential/${credentialId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Credentials"],
    }),

    // ============ PROFILE IMAGE ============
    // Upload profile image
    uploadProfileImage: builder.mutation({
      query: ({ talentId, formData }) => ({
        url: `${talentId}/upload-image/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["TalentProfile"],
    }),
  }),
});

export const {
  useTalentSignUpMutation,
  useGetTalentProfileQuery,
  useGetMyProfileQuery,
  useUpdateTalentProfileMutation,
  useGetTalentApplicationsQuery,
  useGetTalentStatsQuery,
  useGetWorkExperienceQuery,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useGetEducationQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useGetSkillsQuery,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useGetCredentialsQuery,
  useUploadCredentialMutation,
  useDeleteCredentialMutation,
  useUploadProfileImageMutation,
} = talentApi;
