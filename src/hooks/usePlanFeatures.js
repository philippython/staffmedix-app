/**
 * usePlanFeatures — derives feature flags from the current employer's active subscription.
 * Import this hook wherever plan-gated logic is needed.
 */
import { useWhoAmIQuery } from "../services/userApi";
import { useGetSubscriptionsQuery, useGetPlanByIdQuery } from "../services/subscriptionApi";

function normalizePlanType(type = "") {
  return type.toLowerCase().trim();
}

export function usePlanFeatures() {
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  // Log when skip fires so we know if companyId never arrives
  if (typeof window !== "undefined" && !companyId && !window.__skipWarned) {
    window.__skipWarned = true;
    console.warn("[usePlanFeatures] companyId is", companyId, "— subscriptions query SKIPPED. Check whoAmI response.");
  }
  if (companyId) window.__skipWarned = false;

  const { data: subsData, isLoading: subsLoading } = useGetSubscriptionsQuery(
    { companyId },
    { skip: !companyId }
  );

  const allSubs  = subsData?.results ?? subsData ?? [];
  const activeSub =
    allSubs.find((s) => s.active === true) ??
    allSubs.find((s) => s.expiry_date && new Date(s.expiry_date) > new Date()) ??
    null;

  // activeSub.plan can be either:
  //   a) a plain UUID string  -> need to fetch full plan object
  //   b) a nested plan object {id, type, name, amount} -> use directly (depth=1 or serializer nesting)
  const planIsObject = activeSub?.plan && typeof activeSub.plan === "object";
  const planId       = planIsObject ? activeSub.plan.id : activeSub?.plan;

  const { data: planData } = useGetPlanByIdQuery(planId, {
    skip: !planId || planIsObject,  // skip fetch if plan already nested
  });

  // Resolve plan info from nested object or fetched data
  const resolvedPlan = planIsObject ? activeSub.plan : planData;
  const planType = normalizePlanType(resolvedPlan?.type ?? resolvedPlan?.name ?? "basic");

  const isBasic        = !activeSub || planType === "basic";
  const isProfessional = planType === "professional";
  const isEnterprise   = planType === "enterprise";

  // ── Debug log ─────────────────────────────────────────────────────────────
  if (typeof window !== "undefined" && !window.__planFeaturesLogged) {
    window.__planFeaturesLogged = true;

    console.group("%c[usePlanFeatures] Plan Debug", "color:#0d9269;font-weight:bold");
    console.log("companyId          →", companyId);
    console.log("subsData raw       →", subsData);
    console.log("allSubs            →", allSubs);
    console.log("activeSub          →", activeSub);
    console.log("planType           →", planType);
    console.log("isProfessional     →", isProfessional);
    console.log("isEnterprise       →", isEnterprise);
    console.groupEnd();

    // ── Raw backend fetch so you can see exactly what the API returns ──────
    // Reads token from redux store key — adjust if your localStorage key differs
    const token =
      window.__redux_token ??
      Object.values(localStorage)
        .map(v => { try { return JSON.parse(v); } catch { return null; } })
        .filter(Boolean)
        .flatMap(v => typeof v === "object" ? Object.values(v) : [])
        .find(v => typeof v === "string" && v.length > 20 && !v.includes(" "));

    if (companyId && token) {
      const base = import.meta.env.VITE_API_BASE_URL;
      // 1. All subscriptions (no filter)
      fetch(`${base}/subscriptions/subscription/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(r => r.json())
        .then(d => console.log("%c[RAW] GET /subscriptions/subscription/ →", "color:#8b5cf6;font-weight:bold", d))
        .catch(e => console.error("[RAW] subscriptions error", e));

      // 2. Subscriptions filtered by company
      fetch(`${base}/subscriptions/subscription/?company=${companyId}`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(r => r.json())
        .then(d => console.log(`%c[RAW] GET /subscriptions/subscription/?company=${companyId} →`, "color:#8b5cf6;font-weight:bold", d))
        .catch(e => console.error("[RAW] subscriptions?company error", e));

      // 3. whoAmI — confirm company_id field name
      fetch(`${base}/users/who-am-i/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(r => r.json())
        .then(d => {
          console.log("%c[RAW] GET /users/who-am-i/ →", "color:#0ea5e9;font-weight:bold", d);
          console.log("  company_id field →", d.company_id, "| all keys:", Object.keys(d));
        })
        .catch(e => console.error("[RAW] who-am-i error", e));

      // 4. Plans list
      fetch(`${base}/subscriptions/plan/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(r => r.json())
        .then(d => console.log("%c[RAW] GET /subscriptions/plan/ →", "color:#0ea5e9;font-weight:bold", d))
        .catch(e => console.error("[RAW] plans error", e));
    } else {
      console.warn("[usePlanFeatures] Cannot run raw fetch — companyId:", companyId, "token found:", !!token);
      console.warn("  Try: localStorage.debug to see all keys");
      console.log("  All localStorage keys:", Object.keys(localStorage));
    }
  }
  if (typeof window !== "undefined" && companyId !== window.__lastCompanyId) {
    window.__lastCompanyId = companyId;
    window.__planFeaturesLogged = false;
  }


  // ── Feature flags ─────────────────────────────────────────────────────────
  const canPostLocum         = isEnterprise;
  const hasUnlimitedJobs     = isProfessional || isEnterprise;
  const maxJobsPerMonth      = isBasic ? 3 : Infinity;
  const hasMessaging         = isProfessional || isEnterprise;
  const hasFeaturedListings  = isProfessional || isEnterprise;
  const hasDetailedAnalytics = isProfessional || isEnterprise;
  const hasAdvancedSearch    = isProfessional || isEnterprise;
  const hasLocumTools        = isEnterprise;

  return {
    planType,
    planName: resolvedPlan?.type ?? resolvedPlan?.name ?? "Basic",
    isBasic,
    isProfessional,
    isEnterprise,
    activeSub,
    planData,
    // Feature flags
    canPostLocum,
    hasUnlimitedJobs,
    maxJobsPerMonth,
    hasMessaging,
    hasFeaturedListings,
    hasDetailedAnalytics,
    hasAdvancedSearch,
    hasLocumTools,
  };
}