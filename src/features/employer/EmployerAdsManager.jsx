import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployerAdsManager.module.css";
import { useWhoAmIQuery } from "../../services/userApi";
import { useCompanyVerification } from "../../hooks/useCompanyVerification";
import VerificationBanner from "../../components/VerificationBanner";
import {
  useGetSubscriptionsQuery,
  useGetPlanByIdQuery,
} from "../../services/subscriptionApi";
import {
  useGetAdsQuery,
  useCreateAdMutation,
  useToggleAdMutation,
  useDeleteAdMutation,
  useCreateAdImageMutation,
} from "../../services/adsApi";

// Plan ad limits
const PLAN_LIMITS = {
  basic: 0,
  pro: 3,
  enterprise: Infinity,
};

// Detect plan type from planData object (fetched separately since plan is a UUID)
function getPlanType(planData) {
  if (!planData) return "basic";
  const type = (planData?.type ?? "").toLowerCase();
  if (type.includes("enterprise")) return "enterprise";
  if (type.includes("pro")) return "pro";
  return "basic";
}

// Same robust subscription finder used in EmployerDashboard
function findActiveSubscription(allSubscriptions) {
  return (
    allSubscriptions.find((s) => s.active === true) ??
    allSubscriptions.find(
      (s) => s.expiry_date && new Date(s.expiry_date) > new Date(),
    ) ??
    null
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployerAdsManager() {
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const verification = useCompanyVerification();
  const {
    canPostAds: canPostByProfile,
    isVerified,
    percent,
    company,
  } = verification;

  const { data: subscriptionsData } = useGetSubscriptionsQuery(
    { companyId },
    { skip: !companyId },
  );

  const allSubscriptions =
    subscriptionsData?.results ?? subscriptionsData ?? [];
  const subscription = findActiveSubscription(allSubscriptions);

  // plan is a UUID — fetch full plan details to get type/name
  const { data: planData } = useGetPlanByIdQuery(subscription?.plan, {
    skip: !subscription?.plan,
  });

  const planType = getPlanType(planData);
  const adLimit = PLAN_LIMITS[planType];
  const planName = planData?.type ?? "Basic";

  const { data: adsData, isLoading } = useGetAdsQuery(
    { company: companyId },
    { skip: !companyId },
  );

  const [createAd, { isLoading: creating }] = useCreateAdMutation();
  const [toggleAd] = useToggleAdMutation();
  const [deleteAd] = useDeleteAdMutation();
  const [createAdImage] = useCreateAdImageMutation();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [createErr, setCreateErr] = useState("");

  const ads = adsData?.results ?? adsData ?? [];
  const activeAds = ads.filter((a) => a.active);
  // Must be admin-verified AND within plan limit to create ads
  const canCreateAd =
    canPostByProfile && (adLimit === Infinity || activeAds.length < adLimit);

  async function handleToggle(ad) {
    try {
      await toggleAd({ id: ad.id, active: !ad.active }).unwrap();
    } catch {
      alert("Failed to update ad.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAd(id).unwrap();
      setConfirmDeleteId(null);
    } catch {
      alert("Failed to delete ad.");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateErr("");
    try {
      const newAd = await createAd({
        company: companyId,
        title: newTitle,
        description: newDescription,
        expired_at: newExpiry || null,
        active: true,
      }).unwrap();
      // ForeignKey — one AdsImage record per image, send separately
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles
          .slice(0, 5)
          .map((imageFile) =>
            createAdImage({ adId: newAd.id, companyId, imageFile }),
          );
        await Promise.allSettled(uploadPromises);
      }
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewExpiry("");
      setImageFiles([]);
    } catch (err) {
      setCreateErr(err?.data?.detail || "Failed to create ad.");
    }
  }

  const stats = {
    total: ads.length,
    active: activeAds.length,
    inactive: ads.filter((a) => !a.active).length,
    remaining:
      adLimit === Infinity ? "∞" : Math.max(0, adLimit - activeAds.length),
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Ads Manager</h1>
          <p>Manage your advertising campaigns on StaffMedix</p>
        </div>
        <div className={styles.headerActions}>
          {canCreateAd ? (
            <button
              className={styles.createBtn}
              onClick={() => setShowCreateModal(true)}
            >
              + Create New Ad
            </button>
          ) : (
            <Link
              to="/employer-dashboard/settings"
              className={styles.upgradeBtn}
            >
              ⬆️ Upgrade to Post More Ads
            </Link>
          )}
          <Link to="/employer-dashboard" className={styles.backBtn}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Plan banner */}
      <div className={`${styles.planBanner} ${styles[`plan_${planType}`]}`}>
        <div className={styles.planBannerLeft}>
          <span className={styles.planIcon}>
            {planType === "enterprise"
              ? "🏢"
              : planType === "pro"
                ? "💎"
                : "🔒"}
          </span>
          <div>
            <strong>{planName} Plan</strong>
            <span>
              {planType === "basic"
                ? "Upgrade to post ads and boost your visibility"
                : planType === "pro"
                  ? `${activeAds.length} of ${adLimit} active ads used`
                  : "Unlimited ads — Enterprise plan"}
            </span>
          </div>
        </div>
        {planType === "basic" && (
          <Link
            to="/employer-dashboard/settings"
            className={styles.planUpgradeLink}
          >
            View Plans →
          </Link>
        )}
        {planType === "pro" && (
          <Link
            to="/employer-dashboard/settings"
            className={styles.planUpgradeLink}
          >
            Upgrade to Enterprise →
          </Link>
        )}
      </div>

      {/* Verification banner — show if not verified */}
      {!isVerified && <VerificationBanner verification={verification} />}

      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { icon: "📊", value: stats.total, label: "Total Ads" },
          { icon: "✅", value: stats.active, label: "Active" },
          { icon: "⏸️", value: stats.inactive, label: "Inactive" },
          { icon: "➕", value: stats.remaining, label: "Slots Remaining" },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ads list */}
      {isLoading ? (
        <div className={styles.loading}>Loading ads...</div>
      ) : !canPostByProfile ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔒</span>
          <h3>Verification required</h3>
          <p>
            Only admin-verified organisations can post ads. Your profile is{" "}
            <strong>{percent}%</strong> complete.
            {percent < 100
              ? " Complete your profile to speed up verification."
              : " Awaiting admin verification."}
          </p>
          {percent < 100 && (
            <Link
              to="/employer-dashboard/settings"
              className={styles.createBtn}
            >
              Complete Profile
            </Link>
          )}
        </div>
      ) : ads.length === 0 ? (
        <div className={styles.empty}>
          {planType === "basic" ? (
            <>
              <span className={styles.emptyIcon}>🔒</span>
              <h3>Ads not available on Basic plan</h3>
              <p>
                Upgrade to Pro or Enterprise to start advertising your
                organisation and job posts to thousands of healthcare
                professionals.
              </p>
              <Link
                to="/employer-dashboard/settings"
                className={styles.createBtn}
              >
                View Plans & Upgrade
              </Link>
            </>
          ) : (
            <>
              <span className={styles.emptyIcon}>📢</span>
              <h3>No ads yet</h3>
              <p>
                Create your first ad to boost your visibility on StaffMedix.
              </p>
              <button
                className={styles.createBtn}
                onClick={() => setShowCreateModal(true)}
              >
                + Create Your First Ad
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`${styles.adCard} ${!ad.active ? styles.inactiveCard : ""}`}
            >
              <div className={styles.adCardLeft}>
                <div className={styles.adIconWrap}>📢</div>
                <div className={styles.adInfo}>
                  <h3>{ad.title || "Ad Campaign"}</h3>
                  <p className={styles.adDescription}>{ad.description}</p>
                  <div className={styles.adMeta}>
                    <span>📅 Created: {formatDate(ad.created_at)}</span>
                    {ad.expired_at && (
                      <span>⏰ Expires: {formatDate(ad.expired_at)}</span>
                    )}
                    <span>🔄 Updated: {formatDate(ad.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.adCardRight}>
                <span
                  className={`${styles.statusBadge} ${ad.active ? styles.active : styles.inactive}`}
                >
                  {ad.active ? "Active" : "Inactive"}
                </span>

                {/* Expiry warning */}
                {ad.expired_at && new Date(ad.expired_at) < new Date() && (
                  <span className={styles.expiredBadge}>Expired</span>
                )}

                <div className={styles.adActions}>
                  <button
                    className={ad.active ? styles.pauseBtn : styles.resumeBtn}
                    onClick={() => handleToggle(ad)}
                  >
                    {ad.active ? "⏸ Pause" : "▶ Resume"}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setConfirmDeleteId(ad.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className={styles.tips}>
        <h3>💡 Advertising Tips</h3>
        <ul>
          <li>
            Active ads appear on job search pages and the homepage, boosting
            your visibility.
          </li>
          <li>
            Set an expiry date so ads automatically stop when your campaign
            ends.
          </li>
          {planType === "pro" && (
            <li>
              You have {adLimit - activeAds.length} ad slot
              {adLimit - activeAds.length !== 1 ? "s" : ""} remaining — upgrade
              to Enterprise for unlimited ads.
            </li>
          )}
          {planType === "basic" && (
            <li>Upgrade to Pro to unlock up to 3 simultaneous ad campaigns.</li>
          )}
          {planType === "enterprise" && (
            <li>Enterprise plan — post unlimited ads with no restrictions.</li>
          )}
        </ul>
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Create New Ad</h2>
            <p className={styles.modalSub}>
              Your ad will be displayed across StaffMedix to attract healthcare
              professionals.
            </p>
            <form onSubmit={handleCreate} className={styles.form}>
              <label className={styles.formLabel}>
                Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Hiring Pharmacists in Lagos"
                value={newTitle}
                required
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <label
                className={styles.formLabel}
                style={{ marginTop: "0.75rem" }}
              >
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.formTextarea}
                placeholder="Describe your ad — what role, location, or message you want to promote..."
                value={newDescription}
                required
                rows={3}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <label
                className={styles.formLabel}
                style={{ marginTop: "0.75rem" }}
              >
                Expiry Date <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="datetime-local"
                className={styles.formInput}
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
              />
              <p className={styles.formHint}>Leave blank for no expiry date.</p>

              <label
                className={styles.formLabel}
                style={{ marginTop: "0.75rem" }}
              >
                Ad Images <span className={styles.optional}>(up to 5)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.formInput}
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 5);
                  setImageFiles(files);
                }}
              />
              {imageFiles.length > 0 && (
                <p className={styles.formHint}>
                  {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""}{" "}
                  selected
                </p>
              )}

              {createErr && <p className={styles.formErr}>{createErr}</p>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.createBtn}
                  disabled={creating}
                >
                  {creating ? "Creating…" : "Create Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDeleteId && (
        <div
          className={styles.modalOverlay}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Delete Ad?</h2>
            <p className={styles.modalSub}>
              This ad will be permanently removed and will stop showing
              immediately. This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmDeleteId(null)}
              >
                Keep Ad
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
