import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./EmployerSettings.module.css";
import {
  useGetCompanyProfileByIdQuery,
  useUpdateCompanyProfileMutation,
  useUploadCompanyLogoMutation,
  useGetCompanyContactPersonsQuery,
  useUpdateCompanyContactPersonMutation,
  useGetCompanyContactsQuery,
  useCreateCompanyContactMutation,
  useUpdateCompanyContactMutation,
  useGetCompanyServicesQuery,
  useCreateCompanyServiceMutation,
  useDeleteCompanyServiceMutation,
} from "../../services/employerApi";
import { useWhoAmIQuery } from "../../services/userApi";
import {
  useGetSubscriptionsQuery,
  useGetPlansQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../../services/subscriptionApi";
import { useSelector } from "react-redux";

const ORG_TYPE_LABELS = {
  hospital: "Hospital",
  clinic: "Clinic",
  pharmacy: "Pharmacy",
  laboratory: "Laboratory",
  ngo: "NGO / Non-profit",
  other: "Other",
};

const SIZE_LABELS = {
  1: "1–10 employees",
  11: "11–50 employees",
  51: "51–200 employees",
  201: "201–500 employees",
  501: "500+ employees",
};

function Field({ label, value }) {
  return (
    <div className={styles.readField}>
      <span className={styles.readLabel}>{label}</span>
      <span className={styles.readValue}>
        {value || <em className={styles.empty}>Not set</em>}
      </span>
    </div>
  );
}

export default function EmployerSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [newService, setNewService] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null); // plan chosen for confirmation modal
  const [subscribingPlanId, setSubscribingPlanId] = useState(null); // track which plan is loading
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // cancel confirmation modal
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const companyId = whoAmI?.company_id;

  // ── Profile ──────────────────────────────────────────────────────────────
  const { data: company, isLoading: loadingProfile } =
    useGetCompanyProfileByIdQuery(companyId, { skip: !companyId });
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateCompanyProfileMutation();
  const [uploadLogo, { isLoading: uploadingLogo }] =
    useUploadCompanyLogoMutation();

  const [profileForm, setProfileForm] = useState({
    company_name: "",
    organization_type: "",
    registration_number: "",
    size: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    if (company) {
      setProfileForm({
        company_name: company.company_name ?? "",
        organization_type: company.organization_type ?? "",
        registration_number: company.registration_number ?? "",
        size: String(company.size ?? ""),
        website: company.website ?? "",
        description: company.description ?? "",
      });
    }
  }, [company]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    try {
      await updateProfile({ profileId: companyId, data: profileForm }).unwrap();
      setSuccessMsg("Profile updated successfully.");
      setEditingProfile(false);
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to update profile.",
      );
    }
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    try {
      await updateProfile({ profileId: companyId, data: formData }).unwrap();
      setSuccessMsg("Logo uploaded.");
    } catch {
      setErrMsg("Failed to upload logo.");
    }
  }

  // ── Contact Person ───────────────────────────────────────────────────────
  const { data: contactPersonData } = useGetCompanyContactPersonsQuery(
    { companyId },
    { skip: !companyId },
  );
  const contactPerson =
    contactPersonData?.results?.[0] ?? contactPersonData?.[0] ?? null;
  const [updateContactPerson, { isLoading: savingContact }] =
    useUpdateCompanyContactPersonMutation();

  const [contactForm, setContactForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (contactPerson) {
      setContactForm({
        full_name: contactPerson.full_name ?? "",
        email: contactPerson.email ?? "",
        phone_number: contactPerson.phone_number ?? "",
        address: contactPerson.address ?? "",
        city: contactPerson.city ?? "",
        state: contactPerson.state ?? "",
      });
    }
  }, [contactPerson]);

  async function handleContactSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    try {
      await updateContactPerson({
        personId: contactPerson.id,
        data: contactForm,
      }).unwrap();
      setSuccessMsg("Contact person updated.");
      setEditingContact(false);
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to update contact.",
      );
    }
  }

  // ── Services ─────────────────────────────────────────────────────────────
  const { data: servicesData } = useGetCompanyServicesQuery(
    { companyId },
    { skip: !companyId },
  );
  const services = servicesData?.results ?? servicesData ?? [];
  const [createService, { isLoading: addingService }] =
    useCreateCompanyServiceMutation();
  const [deleteService] = useDeleteCompanyServiceMutation();

  // ── Company Contact ───────────────────────────────────────────────────────
  const { data: companyContactData } = useGetCompanyContactsQuery(
    { companyId },
    { skip: !companyId },
  );
  const companyContact =
    companyContactData?.results?.[0] ?? companyContactData?.[0] ?? null;
  const [createCompanyContact] = useCreateCompanyContactMutation();
  const [updateCompanyContact, { isLoading: savingCompanyContact }] =
    useUpdateCompanyContactMutation();
  const [editingCompanyContact, setEditingCompanyContact] = useState(false);

  const [companyContactForm, setCompanyContactForm] = useState({
    contact_number: "",
    contact_email: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (companyContact) {
      setCompanyContactForm({
        contact_number: companyContact.contact_number ?? "",
        contact_email: companyContact.contact_email ?? "",
        address: companyContact.address ?? "",
        city: companyContact.city ?? "",
        state: companyContact.state ?? "",
      });
    }
  }, [companyContact]);

  async function handleCompanyContactSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    if (!companyId) {
      setErrMsg("Company not loaded.");
      return;
    }
    try {
      if (companyContact?.id) {
        // Record exists — PATCH
        await updateCompanyContact({
          contactId: companyContact.id,
          data: companyContactForm,
        }).unwrap();
      } else {
        // No record yet — POST
        await createCompanyContact({
          ...companyContactForm,
          company: companyId,
        }).unwrap();
      }
      setSuccessMsg("Company contact saved.");
      setEditingCompanyContact(false);
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to save company contact.",
      );
    }
  }

  async function handleAddService(e) {
    e.preventDefault();
    if (!newService.trim() || !companyId) return;
    setErrMsg("");
    setSuccessMsg("");
    try {
      await createService({ name: newService.trim() }).unwrap();
      setNewService("");
      setSuccessMsg("Service added.");
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to add service.",
      );
    }
  }

  async function handleDeleteService(serviceId) {
    setErrMsg("");
    setSuccessMsg("");
    try {
      await deleteService(serviceId).unwrap();
    } catch {
      setErrMsg("Failed to delete service.");
    }
  }

  // ── Subscriptions & Plans ─────────────────────────────────────────────────
  const { data: subscriptionsData } = useGetSubscriptionsQuery(
    { companyId },
    { skip: !companyId },
  );
  const allSubscriptions =
    subscriptionsData?.results ?? subscriptionsData ?? [];
  const subscription = allSubscriptions.find((s) => s.active) ?? null;
  const expiredSubscriptions = allSubscriptions.filter((s) => {
    if (s.active) return false;
    const expiry = new Date(s.expiry_date);
    return expiry < new Date();
  });

  const { data: plansData } = useGetPlansQuery();
  const plans = plansData?.results ?? plansData ?? [];

  const [createSubscription, { isLoading: subscribing }] =
    useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const [deleteSubscription, { isLoading: deleting }] =
    useDeleteSubscriptionMutation();

  async function handleSubscribe(plan) {
    setErrMsg("");
    setSuccessMsg("");
    setSubscribingPlanId(plan.id);
    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + 1);
    const fmt = (d) => d.toISOString().split("T")[0];
    try {
      // Cancel existing active subscription first
      if (subscription?.id) {
        await deleteSubscription(subscription.id).unwrap();
      }
      await createSubscription({
        plan: plan.id,
        company: companyId,
        start_date: fmt(today),
        expiry_date: fmt(expiry),
      }).unwrap();
      setSuccessMsg("Subscription activated successfully.");
      setSelectedPlan(null);
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to subscribe.",
      );
    } finally {
      setSubscribingPlanId(null);
    }
  }

  async function handleCancelSubscription() {
    if (!subscription?.id) return;
    setErrMsg("");
    setSuccessMsg("");
    try {
      await deleteSubscription(subscription.id).unwrap();
      setSuccessMsg(
        "Subscription cancelled. You have been moved to the Basic plan.",
      );
      setShowCancelConfirm(false);
    } catch {
      setErrMsg("Failed to cancel subscription.");
      setShowCancelConfirm(false);
    }
  }

  function switchTab(tab) {
    setActiveSection(tab);
    setSuccessMsg("");
    setErrMsg("");
    setEditingProfile(false);
    setEditingContact(false);
    setEditingCompanyContact(false);
  }

  const handleProfileChange = (e) =>
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleContactChange = (e) =>
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1>Settings</h1>
            <p>Manage your organization profile and preferences</p>
          </div>
          <button
            className={styles.dashboardBtn}
            onClick={() => navigate("/employer-dashboard")}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          {[
            { key: "profile", label: "🏥 Organization Profile" },
            { key: "contact", label: "👤 Contact Person" },
            { key: "services", label: "📋 Services" },
            { key: "companycontact", label: "📍 Company Contact" },
            { key: "billing", label: "💳 Billing & Subscription" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={activeSection === key ? styles.active : ""}
              onClick={() => switchTab(key)}
            >
              {label}
            </button>
          ))}
        </aside>

        <div className={styles.settingsContent}>
          {successMsg && <p className={styles.successMsg}>✓ {successMsg}</p>}
          {errMsg && <p className={styles.errMsg}>✕ {errMsg}</p>}

          {/* ── Organization Profile ── */}
          {activeSection === "profile" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Organization Profile</h2>
                {!editingProfile && !loadingProfile && (
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingProfile(true)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {loadingProfile ? (
                <p>Loading…</p>
              ) : !editingProfile ? (
                // ── READ VIEW ──
                <div className={styles.readView}>
                  <div className={styles.logoSection}>
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt="Logo"
                        className={styles.logoPreview}
                      />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        No logo uploaded
                      </div>
                    )}
                    <label className={styles.logoUploadBtn}>
                      {uploadingLogo ? "Uploading…" : "Upload Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <Field
                    label="Organization Name"
                    value={company?.company_name}
                  />
                  <Field
                    label="Organization Type"
                    value={ORG_TYPE_LABELS[company?.organization_type]}
                  />
                  <Field
                    label="CAC Registration Number"
                    value={company?.registration_number}
                  />
                  <Field
                    label="Organization Size"
                    value={SIZE_LABELS[company?.size]}
                  />
                  <Field label="Website" value={company?.website} />
                  <Field label="Description" value={company?.description} />
                </div>
              ) : (
                // ── EDIT VIEW ──
                <form onSubmit={handleProfileSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Organization Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={profileForm.company_name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Organization Type</label>
                      <select
                        name="organization_type"
                        value={profileForm.organization_type}
                        onChange={handleProfileChange}
                      >
                        <option value="">Select type</option>
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="laboratory">Laboratory</option>
                        <option value="ngo">NGO / Non-profit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>CAC Registration Number</label>
                      <input
                        type="text"
                        name="registration_number"
                        value={profileForm.registration_number}
                        onChange={handleProfileChange}
                        placeholder="CAC/BN/RC Number"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Organization Size</label>
                      <select
                        name="size"
                        value={profileForm.size}
                        onChange={handleProfileChange}
                      >
                        <option value="">Select size</option>
                        <option value="1">1–10 employees</option>
                        <option value="11">11–50 employees</option>
                        <option value="51">51–200 employees</option>
                        <option value="201">201–500 employees</option>
                        <option value="501">500+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileChange}
                      placeholder="https://yourorganization.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Organization Description</label>
                    <textarea
                      name="description"
                      value={profileForm.description}
                      onChange={handleProfileChange}
                      rows="4"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Organization Logo</label>
                    <div className={styles.fileUpload}>
                      {company?.logo && (
                        <img
                          src={company.logo}
                          alt="Current logo"
                          className={styles.logoPreview}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <p className={styles.fileHint}>
                        {uploadingLogo ? "Uploading…" : "PNG, JPG up to 5MB."}
                      </p>
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── Contact Person ── */}
          {activeSection === "contact" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Contact Person</h2>
                {!editingContact && (
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingContact(true)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {!editingContact ? (
                <div className={styles.readView}>
                  <Field label="Full Name" value={contactPerson?.full_name} />
                  <Field label="Email Address" value={contactPerson?.email} />
                  <Field
                    label="Phone Number"
                    value={contactPerson?.phone_number}
                  />
                  <Field label="Address" value={contactPerson?.address} />
                  <Field label="City" value={contactPerson?.city} />
                  <Field label="State" value={contactPerson?.state} />
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={contactForm.full_name}
                        onChange={handleContactChange}
                        placeholder="Full name of HR / Admin"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="contact@organization.com"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={contactForm.phone_number}
                        onChange={handleContactChange}
                        placeholder="+234 XXX XXX XXXX"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={contactForm.address}
                        onChange={handleContactChange}
                        placeholder="Street address"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={contactForm.city}
                        onChange={handleContactChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={contactForm.state}
                        onChange={handleContactChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditingContact(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      disabled={savingContact}
                    >
                      {savingContact ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── Services ── */}
          {activeSection === "services" && (
            <div className={styles.section}>
              <h2>Services</h2>
              <p className={styles.sectionDesc}>
                Add the services your organization offers. Each can be removed
                individually.
              </p>

              <form
                className={styles.addServiceForm}
                onSubmit={handleAddService}
              >
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. Emergency Care, Surgery, Diagnostics…"
                />
                <button
                  type="submit"
                  className={styles.addBtn}
                  disabled={addingService || !companyId}
                >
                  {addingService ? "Adding…" : "+ Add Service"}
                </button>
              </form>

              <div className={styles.servicesList}>
                {services.length === 0 && (
                  <p className={styles.emptyMsg}>No services added yet.</p>
                )}
                {services.map((service) => (
                  <div key={service.id} className={styles.serviceItem}>
                    <span>{service.name}</span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteService(service.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Company Contact ── */}
          {activeSection === "companycontact" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Company Contact</h2>
                {!editingCompanyContact && (
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingCompanyContact(true)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {!editingCompanyContact ? (
                <div className={styles.readView}>
                  <Field
                    label="Contact Number"
                    value={companyContact?.contact_number}
                  />
                  <Field
                    label="Contact Email"
                    value={companyContact?.contact_email}
                  />
                  <Field label="Address" value={companyContact?.address} />
                  <Field label="City" value={companyContact?.city} />
                  <Field label="State" value={companyContact?.state} />
                </div>
              ) : (
                <form onSubmit={handleCompanyContactSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Contact Number</label>
                      <input
                        type="tel"
                        name="contact_number"
                        value={companyContactForm.contact_number}
                        onChange={(e) =>
                          setCompanyContactForm((p) => ({
                            ...p,
                            contact_number: e.target.value,
                          }))
                        }
                        placeholder="+234 XXX XXX XXXX"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact Email</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={companyContactForm.contact_email}
                        onChange={(e) =>
                          setCompanyContactForm((p) => ({
                            ...p,
                            contact_email: e.target.value,
                          }))
                        }
                        placeholder="contact@organization.com"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={companyContactForm.address}
                        onChange={(e) =>
                          setCompanyContactForm((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Street address"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={companyContactForm.city}
                        onChange={(e) =>
                          setCompanyContactForm((p) => ({
                            ...p,
                            city: e.target.value,
                          }))
                        }
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={companyContactForm.state}
                        onChange={(e) =>
                          setCompanyContactForm((p) => ({
                            ...p,
                            state: e.target.value,
                          }))
                        }
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditingCompanyContact(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      disabled={savingCompanyContact}
                    >
                      {savingCompanyContact ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── Billing ── */}
          {activeSection === "billing" && (
            <div className={styles.section}>
              <h2>Billing & Subscription</h2>

              {/* Current subscription banner */}
              {subscription ? (
                <div className={styles.currentSubBanner}>
                  <div className={styles.currentSubLeft}>
                    <span className={styles.currentSubLabel}>Current Plan</span>
                    <h3 className={styles.currentSubName}>
                      {subscription.plan?.type ?? "Active Plan"}
                    </h3>
                    <div className={styles.currentSubDates}>
                      <span>Started {subscription.start_date}</span>
                      <span className={styles.dateDot}>·</span>
                      <span>Expires {subscription.expiry_date}</span>
                    </div>
                  </div>
                  <div className={styles.currentSubRight}>
                    <span className={styles.activeBadge}>● Active</span>
                    <button
                      className={styles.cancelPlanBtn}
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel Plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.noSubBanner}>
                  <div className={styles.noSubIcon}>🆓</div>
                  <div>
                    <strong>Basic Plan (Free)</strong>
                    <p>
                      You are on the free Basic plan. Upgrade to unlock more
                      features.
                    </p>
                  </div>
                </div>
              )}

              {/* Plan cards */}
              <h3 className={styles.subHeading}>Available Plans</h3>
              <div className={styles.planGrid}>
                {plans.length === 0 && (
                  <p className={styles.emptyMsg}>No plans available.</p>
                )}
                {plans.map((plan) => {
                  const isBasic =
                    (plan.type ?? plan.name)?.toLowerCase() === "basic";
                  const isCurrent =
                    subscription?.plan?.id === plan.id ||
                    subscription?.plan === plan.id;
                  const isDefaultBasic = isBasic && !subscription;
                  const isLoading = subscribingPlanId === plan.id;
                  const isDisabled = isCurrent || isBasic || isLoading;
                  return (
                    <div
                      key={plan.id}
                      className={`${styles.planCard2} ${isCurrent || isDefaultBasic ? styles.planCardCurrent : ""} ${isBasic ? styles.planCardBasic : ""}`}
                    >
                      {(isCurrent || isDefaultBasic) && (
                        <div className={styles.currentRibbon}>
                          {isDefaultBasic ? "Default" : "Current"}
                        </div>
                      )}
                      <div className={styles.planCard2Top}>
                        <h4 className={styles.planCard2Name}>
                          {plan.type ?? plan.name}
                        </h4>
                        <div className={styles.planCard2Price}>
                          {isBasic ? (
                            <span className={styles.planFree}>Free</span>
                          ) : (
                            <>
                              <span className={styles.planCurrency}>₦</span>
                              <span className={styles.planAmount}>
                                {plan.amount
                                  ? Number(plan.amount).toLocaleString()
                                  : "—"}
                              </span>
                              <span className={styles.planPer}>/mo</span>
                            </>
                          )}
                        </div>
                        {plan.description && (
                          <p className={styles.planCard2Desc}>
                            {plan.description}
                          </p>
                        )}
                        {plan.duration && !isBasic && (
                          <p className={styles.planCard2Duration}>
                            ⏱ {plan.duration} days
                          </p>
                        )}
                      </div>
                      <button
                        className={
                          isDisabled
                            ? styles.planCard2BtnCurrent
                            : styles.planCard2Btn
                        }
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSelectedPlan(plan)}
                      >
                        {isCurrent
                          ? "✓ Current Plan"
                          : isDefaultBasic
                            ? "✓ Default Plan"
                            : isBasic
                              ? "Free Plan"
                              : isLoading
                                ? "Processing…"
                                : "Choose Plan"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Expired subscriptions */}
              {expiredSubscriptions.length > 0 && (
                <div className={styles.expiredSection}>
                  <h3 className={styles.subHeading}>Past Subscriptions</h3>
                  <div className={styles.expiredList}>
                    {expiredSubscriptions.map((sub) => (
                      <div key={sub.id} className={styles.expiredItem}>
                        <div>
                          <span className={styles.expiredPlanName}>
                            {sub.plan?.type ?? "Plan"}
                          </span>
                          <span className={styles.expiredDates}>
                            {sub.start_date} → {sub.expiry_date}
                          </span>
                        </div>
                        <span className={styles.expiredBadge}>Expired</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribe confirmation modal */}
              {selectedPlan && (
                <div
                  className={styles.modalOverlay}
                  onClick={() => setSelectedPlan(null)}
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className={styles.modalTitle}>Confirm Subscription</h3>
                    <p className={styles.modalSub}>
                      You are about to subscribe to:
                    </p>
                    <div className={styles.modalPlanBox}>
                      <span className={styles.modalPlanName}>
                        {selectedPlan.type ?? selectedPlan.name}
                      </span>
                      <span className={styles.modalPlanPrice}>
                        ₦
                        {selectedPlan.amount
                          ? Number(selectedPlan.amount).toLocaleString()
                          : "—"}{" "}
                        / month
                      </span>
                    </div>
                    {subscription && (
                      <div className={styles.modalWarning}>
                        ⚠️ Your current{" "}
                        <strong>{subscription.plan?.type}</strong> plan will be
                        cancelled immediately.
                      </div>
                    )}
                    <div className={styles.modalDates}>
                      {(() => {
                        const today = new Date();
                        const expiry = new Date(today);
                        expiry.setMonth(expiry.getMonth() + 1);
                        const fmt = (d) =>
                          d.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                        return (
                          <>
                            <div className={styles.modalDateRow}>
                              <span>Start Date</span>
                              <strong>{fmt(today)}</strong>
                            </div>
                            <div className={styles.modalDateRow}>
                              <span>Expiry Date</span>
                              <strong>{fmt(expiry)}</strong>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {selectedPlan.description && (
                      <p className={styles.modalDesc}>
                        {selectedPlan.description}
                      </p>
                    )}
                    <div className={styles.modalActions}>
                      <button
                        className={styles.modalCancel}
                        onClick={() => setSelectedPlan(null)}
                      >
                        Go Back
                      </button>
                      <button
                        className={styles.modalConfirm}
                        onClick={() => handleSubscribe(selectedPlan)}
                        disabled={!!subscribingPlanId}
                      >
                        {subscribingPlanId
                          ? "Processing…"
                          : "Confirm & Subscribe"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel confirmation modal */}
              {showCancelConfirm && (
                <div
                  className={styles.modalOverlay}
                  onClick={() => setShowCancelConfirm(false)}
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className={styles.modalTitle}>Cancel Subscription?</h3>
                    <p className={styles.modalSub}>
                      Are you sure you want to cancel your{" "}
                      <strong>{subscription?.plan?.type}</strong> plan? You will
                      be moved back to the free Basic plan immediately.
                    </p>
                    <div className={styles.modalActions}>
                      <button
                        className={styles.modalCancel}
                        onClick={() => setShowCancelConfirm(false)}
                      >
                        Keep Plan
                      </button>
                      <button
                        className={styles.modalConfirmDanger}
                        onClick={handleCancelSubscription}
                        disabled={deleting}
                      >
                        {deleting ? "Cancelling…" : "Yes, Cancel Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
