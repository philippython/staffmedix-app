import { useWhoAmIQuery } from "../services/userApi";
import {
  useGetCompanyProfileByIdQuery,
  useGetCompanyContactPersonsQuery,
  useGetCompanyContactsQuery,
  useGetCompanyServicesQuery,
} from "../services/employerApi";

/**
 * useCompanyVerification
 * Mirrors the exact data fetching from EmployerSettings.
 * Returns completeness score, missing fields, and permission flags.
 */
export function useCompanyVerification() {
  const { data: whoAmI } = useWhoAmIQuery();
  const companyId = whoAmI?.company_id;

  const { data: company } = useGetCompanyProfileByIdQuery(companyId, {
    skip: !companyId,
  });

  const { data: contactPersonData } = useGetCompanyContactPersonsQuery(
    { companyId },
    { skip: !companyId },
  );
  const contactPerson =
    contactPersonData?.results?.[0] ?? contactPersonData?.[0] ?? null;

  const { data: companyContactData } = useGetCompanyContactsQuery(
    { companyId },
    { skip: !companyId },
  );
  const companyContact =
    companyContactData?.results?.[0] ?? companyContactData?.[0] ?? null;

  const { data: servicesData } = useGetCompanyServicesQuery(
    { companyId },
    { skip: !companyId },
  );
  const services = servicesData?.results ?? servicesData ?? [];

  // Build checks using EXACT same fields as EmployerSettings
  const checks = [
    // Organization Profile tab
    { label: "Organization name", done: !!company?.company_name },
    { label: "Organization type", done: !!company?.organization_type },
    { label: "CAC registration number", done: !!company?.registration_number },
    { label: "Organization size", done: !!company?.size },
    { label: "Website", done: !!company?.website },
    { label: "Description", done: !!company?.description },
    { label: "Logo", done: !!company?.logo },
    // Contact Person tab
    { label: "Contact person name", done: !!contactPerson?.full_name },
    { label: "Contact person email", done: !!contactPerson?.email },
    { label: "Contact person phone", done: !!contactPerson?.phone_number },
    // Company Contact tab
    { label: "Company contact number", done: !!companyContact?.contact_number },
    { label: "Company contact email", done: !!companyContact?.contact_email },
    { label: "Company address", done: !!companyContact?.address },
    { label: "Company city", done: !!companyContact?.city },
    { label: "Company state", done: !!companyContact?.state },
    // Services tab
    { label: "At least one service", done: services.length > 0 },
  ];

  const done = checks.filter((c) => c.done).length;
  const total = checks.length;
  const percent = Math.round((done / total) * 100);
  const missing = checks.filter((c) => !c.done).map((c) => c.label);

  const isVerified =
    company?.verified === true || company?.is_verified === true;

  // Only admin-verified companies can post jobs or ads
  const canPostJobs = isVerified;
  const canPostAds = isVerified;

  return {
    isVerified,
    percent,
    score: done,
    total,
    missing,
    canPostJobs,
    canPostAds,
    // expose raw data so consumers don't need to re-fetch
    company,
    contactPerson,
    companyContact,
    services,
    isLoading: !company && !!companyId,
  };
}
