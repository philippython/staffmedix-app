import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./EmployerSettings.module.css";
import {
  useGetCompanyContactPersonsQuery,
  useUpdateCompanyContactPersonMutation,
  useGetCompanyServicesQuery,
  useCreateCompanyServiceMutation,
  useDeleteCompanyServiceMutation,
  useGetCompanyProfileByIdQuery,
  useUpdateCompanyProfileMutation,
} from "../../services/employerApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useSelector } from "react-redux";

export default function EmployerSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [newService, setNewService] = useState("");
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const companyId = whoAmI?.company_id;

  // Profile
  const { data: company = {} } = useGetCompanyProfileByIdQuery(companyId, {
    skip: !companyId,
  });
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateCompanyProfileMutation();
  const [profileForm, setProfileForm] = useState({
    company_name: "",
    organization_type: "",
    registration_number: "",
    size: "",
    website: "",
    description: "",
  });

  // Sync profile form when data loads
  useState(() => {
    if (company?.id) {
      setProfileForm({
        company_name: company.company_name ?? "",
        organization_type: company.organization_type ?? "",
        registration_number: company.registration_number ?? "",
        size: company.size ?? "",
        website: company.website ?? "",
        description: company.description ?? "",
      });
    }
  }, [company]);

  // Contact person
  const { data: contactPersonData } = useGetCompanyContactPersonsQuery(
    { companyId },
    { skip: !companyId },
  );
  const contactPerson =
    contactPersonData?.results?.[0] ?? contactPersonData?.[0] ?? {};
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

  // Sync contact form when data loads
  useState(() => {
    if (contactPerson?.id) {
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

  // Services
  const { data: servicesData } = useGetCompanyServicesQuery(
    { companyId },
    { skip: !companyId },
  );
  const services = servicesData?.results ?? servicesData ?? [];
  const [createService, { isLoading: addingService }] =
    useCreateCompanyServiceMutation();
  const [deleteService] = useDeleteCompanyServiceMutation();

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleContactChange = (e) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  async function handleProfileSubmit(e) {
    e.preventDefault();
    try {
      await updateProfile({ profileId: companyId, data: profileForm }).unwrap();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    try {
      await updateContactPerson({
        personId: contactPerson.id,
        data: contactForm,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update contact person:", err);
    }
  }

  async function handleAddService(e) {
    e.preventDefault();
    if (!newService.trim()) return;
    try {
      await createService({
        name: newService.trim(),
        company: companyId,
      }).unwrap();
      setNewService("");
    } catch (err) {
      console.error("Failed to add service:", err);
    }
  }

  async function handleDeleteService(serviceId) {
    try {
      await deleteService(serviceId).unwrap();
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  }

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
          <button
            className={activeSection === "profile" ? styles.active : ""}
            onClick={() => setActiveSection("profile")}
          >
            🏥 Organization Profile
          </button>
          <button
            className={activeSection === "contact" ? styles.active : ""}
            onClick={() => setActiveSection("contact")}
          >
            👤 Contact Person
          </button>
          <button
            className={activeSection === "services" ? styles.active : ""}
            onClick={() => setActiveSection("services")}
          >
            📋 Services
          </button>
          <button
            className={activeSection === "billing" ? styles.active : ""}
            onClick={() => setActiveSection("billing")}
          >
            💳 Billing & Subscription
          </button>
        </aside>

        <div className={styles.settingsContent}>
          {/* Organization Profile */}
          {activeSection === "profile" && (
            <div className={styles.section}>
              <h2>Organization Profile</h2>
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
                    placeholder="Brief description of your organization…"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Organization Logo</label>
                  <div className={styles.fileUpload}>
                    <input type="file" accept="image/*" />
                    <p className={styles.fileHint}>
                      PNG, JPG up to 5MB. Recommended: 300x300px
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Contact Person */}
          {activeSection === "contact" && (
            <div className={styles.section}>
              <h2>Contact Person</h2>
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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={savingContact}
                >
                  {savingContact ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Services */}
          {activeSection === "services" && (
            <div className={styles.section}>
              <h2>Services</h2>
              <p className={styles.sectionDesc}>
                Add the services your organization offers. Each service can be
                added and removed individually.
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
                  disabled={addingService}
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
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteService(service.id)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing */}
          {activeSection === "billing" && (
            <div className={styles.section}>
              <h2>Billing & Subscription</h2>
              <div className={styles.currentPlan}>
                <h3>Current Plan: Professional</h3>
                <p>₦25,000/month • Renews on Feb 28, 2026</p>
                <Link to="/pricing" className={styles.changePlanBtn}>
                  Change Plan
                </Link>
              </div>
              <div className={styles.billingHistory}>
                <h3>Billing History</h3>
                <div className={styles.invoiceList}>
                  <div className={styles.invoiceItem}>
                    <span>Jan 2026</span>
                    <span>₦25,000</span>
                    <button className={styles.downloadBtn}>Download</button>
                  </div>
                  <div className={styles.invoiceItem}>
                    <span>Dec 2025</span>
                    <span>₦25,000</span>
                    <button className={styles.downloadBtn}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
