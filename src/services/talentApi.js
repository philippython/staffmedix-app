import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/talents/`;

export const talentApi = createApi({
  reducerPath: "talentApi",
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
  tagTypes: ["TalentProfile", "Applications"],
  endpoints: (builder) => ({
    talentSignUp: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get talent profile by ID - Returns FULL profile with nested data
    // Backend response structure:
    // {
    //   id, full_name, profession, location, etc.,
    //   user: { id, username, email, ... },
    //   skill: [{id, name, talent}, ...],           ← Note: "skill" not "skills"
    //   work_experience: [{id, job_title, ...}, ...],
    //   education: [{id, degree, institution, year}, ...],
    //   credentials: [{id, file, type, upload_date}, ...]
    // }
    getTalentProfile: builder.query({
      query: (talentId) => `talent/${talentId}/`,
      providesTags: (result, error, talentId) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Get current talent's profile (alias for getTalentProfile)
    getMyProfile: builder.query({
      query: (talentId) => `talent/${talentId}/`,
      providesTags: (result, error, talentId) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Update talent profile
    updateTalentProfile: builder.mutation({
      query: ({ talentId, data }) => ({
        url: `talent/${talentId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Get talent's applications
    getTalentApplications: builder.query({
      query: (talentId) => `talent/${talentId}/applications/`,
      providesTags: ["Applications"],
    }),

    // Get talent's stats/dashboard data
    getTalentStats: builder.query({
      query: (talentId) => `talent/${talentId}/stats/`,
    }),

    // ============ WORK EXPERIENCE ============
    // Add work experience
    addWorkExperience: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "work-experience/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Update work experience
    updateWorkExperience: builder.mutation({
      query: ({ workId, data }) => ({
        url: `work-experience/${workId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Delete work experience
    deleteWorkExperience: builder.mutation({
      query: ({ workId }) => ({
        url: `work-experience/${workId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ============ EDUCATION ============
    // Add education
    addEducation: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "education/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Update education
    updateEducation: builder.mutation({
      query: ({ educationId, data }) => ({
        url: `education/${educationId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Delete education
    deleteEducation: builder.mutation({
      query: ({ educationId }) => ({
        url: `education/${educationId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ============ SKILLS ============
    // Add skill
    addSkill: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "skill/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Delete skill
    deleteSkill: builder.mutation({
      query: ({ skillId }) => ({
        url: `skill/${skillId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ============ CREDENTIALS/DOCUMENTS ============
    // Upload credential
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
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // Delete credential
    deleteCredential: builder.mutation({
      query: ({ credentialId }) => ({
        url: `credential/${credentialId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ============ PROFILE IMAGE ============
    // Upload profile image
    // talentApi.js
    uploadProfileImage: builder.mutation({
      query: ({ talentId, formData }) => {
        formData.append("talent", talentId);
        return {
          url: `talent-profile-image/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
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
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useUploadCredentialMutation,
  useDeleteCredentialMutation,
  useUploadProfileImageMutation,
} = talentApi;
