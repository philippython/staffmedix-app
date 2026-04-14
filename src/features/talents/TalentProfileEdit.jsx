import { useState, useEffect, useMemo } from "react";
import {
  useWithdrawMutation,
  useGetAccountDetailsQuery,
  useCreateAccountDetailsMutation,
  useUpdateAccountDetailsMutation,
  useGetBanksQuery,
  useResolveAccountQuery,
  useGetRecipientsQuery,
} from "../../services/paymentApi";
import { Link, useParams } from "react-router";
import styles from "./TalentProfileEdit.module.css";
import {
  useGetMyProfileQuery,
  useUpdateTalentProfileMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUploadCredentialMutation,
  useDeleteCredentialMutation,
  useUploadProfileImageMutation,
} from "../../services/talentApi";

export default function TalentProfileEdit() {
  const { talentId } = useParams();

  // ── useState FIRST (payment hooks below reference these) ─────────────
  const [activeSection, setActiveSection]   = useState("basic");
  const [withdrawAmt, setWithdrawAmt]       = useState("");
  const [bankSearch, setBankSearch]         = useState("");
  const [selectedBank, setSelectedBank]     = useState(null);
  const [acctNumber, setAcctNumber]         = useState("");
  const [acctName, setAcctName]             = useState("");
  // resolveEnabled removed — derived from acctNumber.length === 10 && !!selectedBank
  const [payMsg, setPayMsg]                 = useState({ text: "", type: "" });

  // ── Payment hooks ─────────────────────────────────────────────────────────
  // Talents are RECIPIENTS of payments, not the payment.user (that's the employer)
  // So we use getRecipients to get their earnings, NOT getPayments
  const [withdraw, { isLoading: withdrawing }] = useWithdrawMutation();
  const { data: accountRaw }                   = useGetAccountDetailsQuery(undefined, {
    // returns [] when no account exists — see account_viewset.py
  });
  const [createAccount]                        = useCreateAccountDetailsMutation();
  const [updateAccount]                        = useUpdateAccountDetailsMutation();
  const { data: banksRaw }                     = useGetBanksQuery();
  const canResolve = acctNumber.length === 10 && !!selectedBank;
  const { data: resolvedAcct, isFetching: resolvingAcct, isError: resolveError } = useResolveAccountQuery(
    { accountNumber: acctNumber, bankCode: selectedBank?.code },
    { skip: !canResolve }
  );

  // Log resolve state changes
  if (typeof window !== "undefined") {
    if (canResolve && !window.__resolveLogged) {
      window.__resolveLogged = true;
      console.log("[resolveAccount] firing →", { accountNumber: acctNumber, bankCode: selectedBank?.code });
    }
    if (!canResolve) window.__resolveLogged = false;
    if (resolvedAcct) console.log("[resolveAccount] success →", resolvedAcct);
    if (resolveError)  console.warn("[resolveAccount] error — check bank_code is valid Paystack bank code");
  }
  const allBanks  = banksRaw ?? [];
  const savedAcct = Array.isArray(accountRaw) ? (accountRaw[0] ?? null) : (accountRaw?.results?.[0] ?? accountRaw?.[0] ?? null);

  // Talent's payment recipients — this is their earnings history
  const { data: recipientsRaw } = useGetRecipientsQuery();
  const myRecipients       = recipientsRaw?.results ?? recipientsRaw ?? [];
  const hasAssignedPayment = myRecipients.length > 0;

  // 5% platform commission — talent receives 95% of employer payment
  const PLATFORM_FEE = 0.05;
  const TALENT_SHARE = 1 - PLATFORM_FEE; // 0.95

  const pendingRecipients  = myRecipients.filter(r => !r.eligible);
  const eligibleRecipients = myRecipients.filter(r => r.eligible === true);

  // Total gross paid by employer for this talent
  const totalGross = myRecipients
    .filter(r => r.payment_status === "success" || r.payment_status === "SUCCESS")
    .reduce((sum, r) => sum + parseFloat(r.payment_amount ?? 0), 0);

  // What talent actually receives after 5% platform fee
  const totalEarned       = totalGross * TALENT_SHARE;
  const platformFeeTotal  = totalGross * PLATFORM_FEE;

  // Withdrawable = 95% of eligible (approved) payments only
  const withdrawableGross = eligibleRecipients
    .filter(r => r.payment_status === "success" || r.payment_status === "SUCCESS")
    .reduce((sum, r) => sum + parseFloat(r.payment_amount ?? 0), 0);
  const withdrawableAmt = withdrawableGross * TALENT_SHARE;

  // eligible: at least one recipient is approved
  const eligible = eligibleRecipients.length > 0;

  function fmtMoney(n) {
    if (!n) return "₦0";
    return `₦${Number(n).toLocaleString()}`;
  }

  function showMsg(text, type = "success") {
    setPayMsg({ text, type });
    setTimeout(() => setPayMsg({ text: "", type: "" }), 4000);
  }

  async function handleWithdraw() {
    // Talent can only withdraw 95% of the eligible gross amount
    const amt = parseFloat(withdrawAmt) || withdrawableAmt;
    if (!amt || amt <= 0) { showMsg("Enter a valid amount", "error"); return; }
    if (amt > withdrawableAmt) { showMsg(`Max withdrawable is ${fmtMoney(withdrawableAmt)} (95% of approved payments)`, "error"); return; }
    if (!savedAcct) { showMsg("Add your bank account before withdrawing", "error"); return; }
    console.log("[withdraw] sending:", { amount: amt, to: savedAcct?.bank_name, account: savedAcct?.account_number });
    try {
      const result = await withdraw({ amount: amt }).unwrap();
      console.log("[withdraw] success:", result);
      showMsg(`Withdrawal of ${fmtMoney(amt)} initiated. Funds arrive in 1-2 business days.`);
      setWithdrawAmt("");
    } catch (err) {
      console.error("[withdraw] error:", err);
      showMsg(err?.data?.error ?? err?.data?.detail ?? `Withdrawal failed (${err?.status ?? "unknown error"}). Check your account details.`, "error");
    }
  }

  async function handleSaveAccount() {
    const bankName    = selectedBank?.name   ?? savedAcct?.bank_name    ?? "";
    const bankCode    = selectedBank?.code   ?? savedAcct?.bank_code    ?? "";
    const acctNum     = acctNumber           || savedAcct?.account_number || "";
    const acctNameVal = (resolvedAcct?.account_name ?? acctName ?? savedAcct?.account_name ?? "").trim();

    console.log("[handleSaveAccount] called", {
      selectedBank,
      savedAcct,
      acctNumber,
      acctName,
      resolvedAcct,
      bankName,
      bankCode,
      acctNum,
      acctNameVal,
    });

    if (!bankCode) {
      console.warn("[handleSaveAccount] no bankCode — user must select a bank");
      showMsg("Please search and select a bank first", "error"); return;
    }
    if (!acctNum || String(acctNum).length !== 10) {
      console.warn("[handleSaveAccount] invalid account number:", acctNum);
      showMsg("Please enter a valid 10-digit account number", "error"); return;
    }
    // acctName is optional — if empty, use account number as fallback name
    // This allows saving even if resolve hasn't completed
    const finalAcctName = acctNameVal || acctNum;

    const payload = {
      bank_name:      bankName,
      bank_code:      bankCode,
      account_number: String(acctNum),
      account_name:   finalAcctName,
    };

    console.log("[handleSaveAccount] sending payload →", payload);

    try {
      let result;
      if (savedAcct?.id) {
        console.log("[handleSaveAccount] PATCH existing account id:", savedAcct.id);
        result = await updateAccount({ id: savedAcct.id, data: payload }).unwrap();
      } else {
        console.log("[handleSaveAccount] POST new account");
        result = await createAccount(payload).unwrap();
      }
      console.log("[handleSaveAccount] success →", result);
      showMsg("Account details saved ✓");
    } catch (err) {
      console.error("[handleSaveAccount] error →", err);
      const msg = err?.data?.detail
        ?? err?.data?.non_field_errors?.[0]
        ?? JSON.stringify(err?.data)
        ?? "Failed to save account";
      showMsg(String(msg), "error");
    }
  }

  // Fetch complete profile with nested data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetMyProfileQuery(talentId);

  // Extract nested data from profile
  const skills = profile?.skill || [];
  const workExperience = profile?.work_experience || [];
  const education = profile?.education || [];
  const credentials = profile?.credentials || [];

  // Calculate profile completeness
  const profileCompleteness = useMemo(() => {
    if (!profile) return { percentage: 0, missing: [] };

    const checks = [
      {
        name: "Profile Photo",
        completed: !!profile.images && profile.images.length > 0,
        weight: 15,
      },
      {
        name: "Full Name",
        completed: !!profile.full_name?.trim(),
        weight: 10,
      },
      {
        name: "Profession",
        completed: !!profile.profession,
        weight: 10,
      },
      {
        name: "Specialization",
        completed: !!profile.specialization?.trim(),
        weight: 10,
      },
      {
        name: "Phone Number",
        completed: !!profile.phone_number?.trim(),
        weight: 5,
      },
      {
        name: "Location",
        completed: !!profile.location?.trim(),
        weight: 5,
      },
      {
        name: "Biography",
        completed: !!profile.biography?.trim() && profile.biography.length > 50,
        weight: 10,
      },
      {
        name: "Years of Experience",
        completed:
          profile.years_of_experience !== null &&
          profile.years_of_experience >= 0,
        weight: 5,
      },
      {
        name: "At least 3 Skills",
        completed: skills.length >= 3,
        weight: 10,
      },
      {
        name: "At least 1 Work Experience",
        completed: workExperience.length >= 1,
        weight: 10,
      },
      {
        name: "At least 1 Education",
        completed: education.length >= 1,
        weight: 5,
      },
      {
        name: "Resume/CV Uploaded",
        completed: credentials.some((c) => c.type === "RESUME"),
        weight: 5,
      },
      {
        name: "Professional License",
        completed: credentials.some((c) => c.type === "LICENSE"),
        weight: 5,
      },
      {
        name: "At least 1 Certification",
        completed: credentials.some((c) => c.type === "CERTIFICATE"),
        weight: 5,
      },
    ];

    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
    const completedWeight = checks
      .filter((check) => check.completed)
      .reduce((sum, check) => sum + check.weight, 0);

    const percentage = Math.round((completedWeight / totalWeight) * 100);
    const missing = checks.filter((check) => !check.completed);

    return { percentage, missing, checks };
  }, [profile, skills, workExperience, education, credentials]);

  // Mutations
  const [updateProfile, { isLoading: updating }] =
    useUpdateTalentProfileMutation();
  const [addSkill] = useAddSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [addWork] = useAddWorkExperienceMutation();
  const [updateWork] = useUpdateWorkExperienceMutation();
  const [deleteWork] = useDeleteWorkExperienceMutation();
  const [addEdu] = useAddEducationMutation();
  const [updateEdu] = useUpdateEducationMutation();
  const [deleteEdu] = useDeleteEducationMutation();
  const [uploadCredential] = useUploadCredentialMutation();
  const [deleteCredentialMutation] = useDeleteCredentialMutation();
  const [uploadImage] = useUploadProfileImageMutation();

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    full_name: "",
    profession: "",
    specialization: "",
    phone_number: "",
    location: "",
    biography: "",
    license_number: "",
    years_of_experience: "",
  });

  const [newSkill, setNewSkill] = useState("");

  // Sync resolved account name into acctName state
  useEffect(() => {
    if (resolvedAcct?.account_name) {
      setAcctName(resolvedAcct.account_name);
    }
  }, [resolvedAcct?.account_name]);

  // Pre-fill bank account form from savedAcct when it loads
  useEffect(() => {
    if (savedAcct) {
      setAcctNumber(savedAcct.account_number ?? "");
      setAcctName(savedAcct.account_name ?? "");
      // Note: we can't re-select the bank object from just a name/code
      // so just show the saved data; user can search to change it
    }
  }, [savedAcct?.id]);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setBasicInfo({
        full_name: profile.full_name || "",
        profession: profile.profession || "",
        specialization: profile.specialization || "",
        phone_number: profile.phone_number || "",
        location: profile.location || "",
        biography: profile.biography || "",
        license_number: profile.license_number || "",
        years_of_experience: profile.years_of_experience || "",
      });
    }
  }, [profile]);

  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ talentId, data: basicInfo }).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        error?.data?.detail || "Failed to update profile. Please try again.",
      );
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        await addSkill({
          talentId,
          data: { name: newSkill.trim() },
        }).unwrap();
        setNewSkill("");
      } catch (error) {
        alert(error?.data?.detail || "Failed to add skill.");
      }
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await deleteSkill({
        talentId,
        skillId,
      }).unwrap();
    } catch (error) {
      alert(error?.data?.detail || "Failed to delete skill.");
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await uploadCredential({
        talentId,
        data: formData,
      }).unwrap();
      alert("File uploaded successfully!");
      e.target.value = "";
    } catch (error) {
      alert(error?.data?.detail || "Failed to upload file.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadImage({ talentId, formData }).unwrap();
      alert("Profile image uploaded successfully!");
      e.target.value = "";
    } catch (error) {
      alert(error?.data?.detail || "Failed to upload image.");
    }
  };

  if (profileLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (profileError) {
    return (
      <div className={styles.error}>
        Failed to load profile. Please try again.
      </div>
    );
  }

  if (!talentId) {
    return (
      <div className={styles.error}>
        Unable to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className={styles.profileEdit}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1>Edit Profile</h1>
            {profile?.verified ? (
              <span className={styles.verifiedBadge}>✓ Verified</span>
            ) : (
              <span className={styles.unverifiedBadge}>ⓘ Unverified</span>
            )}
          </div>
          <p>Keep your profile up to date</p>
        </div>
        <Link to="/employee-dashboard" className={styles.backBtn}>
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Completeness Card */}
      <div className={styles.completenessCard}>
        <div className={styles.completenessHeader}>
          <div>
            <h3>Profile Completeness</h3>
            <p className={styles.completenessText}>
              {profileCompleteness.percentage === 100
                ? "🎉 Your profile is complete!"
                : `Complete your profile to stand out to employers`}
            </p>
          </div>
          <div className={styles.completenessPercentage}>
            {profileCompleteness.percentage}%
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${profileCompleteness.percentage}%`,
              backgroundColor:
                profileCompleteness.percentage === 100
                  ? "#10b981"
                  : profileCompleteness.percentage >= 75
                    ? "#059669"
                    : profileCompleteness.percentage >= 50
                      ? "#f59e0b"
                      : "#ef4444",
            }}
          ></div>
        </div>

        {profileCompleteness.missing.length > 0 && (
          <div className={styles.missingItems}>
            <p className={styles.missingTitle}>Missing items:</p>
            <div className={styles.missingList}>
              {profileCompleteness.missing.map((item, index) => (
                <span key={index} className={styles.missingItem}>
                  • {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <button
            className={activeSection === "basic" ? styles.active : ""}
            onClick={() => setActiveSection("basic")}
          >
            👤 Basic Information
          </button>
          <button
            className={activeSection === "skills" ? styles.active : ""}
            onClick={() => setActiveSection("skills")}
          >
            🎯 Skills ({skills.length})
          </button>
          <button
            className={activeSection === "work" ? styles.active : ""}
            onClick={() => setActiveSection("work")}
          >
            📋 Work History ({workExperience.length})
          </button>
          <button
            className={activeSection === "education" ? styles.active : ""}
            onClick={() => setActiveSection("education")}
          >
            🎓 Education ({education.length})
          </button>
          <button
            className={activeSection === "documents" ? styles.active : ""}
            onClick={() => setActiveSection("documents")}
          >
            📄 Documents ({credentials.length})
          </button>
          <button
            className={activeSection === "earnings" ? styles.active : ""}
            onClick={() => setActiveSection("earnings")}
          >
            💰 Earnings & Payments
          </button>
        </aside>

        <div className={styles.editContent}>
          {activeSection === "basic" && (
            <div className={styles.section}>
              <h2>Basic Information</h2>
              <form onSubmit={handleBasicSubmit}>
                <div className={styles.formGroup}>
                  <label>Profile Photo</label>
                  <div className={styles.photoUpload}>
                    <div className={styles.currentPhoto}>
                      {profile?.images?.length > 0 && profile.images[profile.images.length - 1].image
                        ? <img src={profile.images[profile.images.length - 1].image} alt="Profile" />
                        : <span>👩‍⚕️</span>
                      }
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <p className={styles.hint}>
                        PNG, JPG up to 5MB. Recommended: 300x300px
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={basicInfo.full_name}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Profession *</label>
                    <select
                      name="profession"
                      value={basicInfo.profession}
                      onChange={handleBasicChange}
                      required
                    >
                      <option value="">Select profession</option>
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="lab-tech">Lab Technician</option>
                      <option value="lab-scientist">
                        Medical Lab Scientist
                      </option>
                      <option value="radiographer">Radiographer</option>
                      <option value="physiotherapist">Physiotherapist</option>
                      <option value="dentist">Dentist</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={basicInfo.specialization}
                    onChange={handleBasicChange}
                    placeholder="e.g., ICU Specialist, Pediatric Nurse"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={basicInfo.phone_number}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={basicInfo.location}
                      onChange={handleBasicChange}
                      placeholder="City, State"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>License Number</label>
                    <input
                      type="text"
                      name="license_number"
                      value={basicInfo.license_number}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Years of Experience *</label>
                    <input
                      type="number"
                      name="years_of_experience"
                      value={basicInfo.years_of_experience}
                      onChange={handleBasicChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Professional Summary *</label>
                  <textarea
                    name="biography"
                    value={basicInfo.biography}
                    onChange={handleBasicChange}
                    rows="6"
                    placeholder="Write a brief summary of your professional background (at least 50 characters)..."
                  ></textarea>
                  <p className={styles.hint}>
                    {basicInfo.biography.length}/50 characters minimum
                  </p>
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "skills" && (
            <div className={styles.section}>
              <h2>Skills</h2>

              <div className={styles.skillsSection}>
                <div className={styles.skillInput}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className={styles.addBtn}
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </button>
                </div>

                <div className={styles.skillTags}>
                  {skills.length === 0 ? (
                    <p className={styles.emptyState}>
                      No skills added yet. Add at least 3 skills to improve your
                      profile!
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className={styles.skillTag}>
                        <span>{skill.name}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className={styles.removeBtn}
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "work" && (
            <div className={styles.section}>
              <h2>Work History</h2>
              <WorkExperienceSection
                talentId={talentId}
                experiences={workExperience}
                onAdd={addWork}
                onUpdate={updateWork}
                onDelete={deleteWork}
              />
            </div>
          )}

          {activeSection === "education" && (
            <div className={styles.section}>
              <h2>Education</h2>
              <EducationSection
                talentId={talentId}
                education={education}
                onAdd={addEdu}
                onUpdate={updateEdu}
                onDelete={deleteEdu}
              />
            </div>
          )}

          {activeSection === "documents" && (
            <div className={styles.section}>
              <h2>Documents</h2>
              <div className={styles.uploadSection}>
                <h3>📄 Resume/CV</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "RESUME")}
                />
                <p className={styles.hint}>PDF, DOC, DOCX up to 10MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>📜 Professional License</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, "LICENSE")}
                />
                <p className={styles.hint}>PDF, JPG, PNG up to 5MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>🏆 Certifications</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, "CERTIFICATE")}
                />
                <p className={styles.hint}>PDF, JPG, PNG</p>
              </div>

              <div className={styles.documentslist}>
                <h3>Uploaded Documents</h3>
                {credentials.length === 0 ? (
                  <p className={styles.emptyState}>
                    No documents uploaded yet. Upload your resume, license, and
                    certifications!
                  </p>
                ) : (
                  credentials.map((doc) => (
                    <div key={doc.id} className={styles.docItem}>
                      <span>
                        {doc.type} -{" "}
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() =>
                          deleteCredentialMutation({
                            talentId,
                            credentialId: doc.id,
                          })
                        }
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeSection === "earnings" && (
            <div className={styles.section}>
              <h2>Earnings & Payments</h2>

              <div className={styles.paySummaryGrid}>
                <div className={styles.paySummaryCard}>
                  <span className={styles.paySummaryIcon}>💰</span>
                  <div>
                    <p className={styles.paySummaryVal}>{fmtMoney(totalEarned)}</p>
                    <p className={styles.paySummaryLbl}>Total Earned (after 5% fee)</p>
                  </div>
                </div>
                <div className={styles.paySummaryCard}>
                  <span className={styles.paySummaryIcon}>💸</span>
                  <div>
                    <p className={styles.paySummaryVal}>{fmtMoney(withdrawableAmt)}</p>
                    <p className={styles.paySummaryLbl}>Withdrawable</p>
                  </div>
                </div>
                <div className={styles.paySummaryCard}>
                  <span className={styles.paySummaryIcon}>⏳</span>
                  <div>
                    <p className={styles.paySummaryVal}>{pendingRecipients.length}</p>
                    <p className={styles.paySummaryLbl}>Pending Approval</p>
                  </div>
                </div>
                <div className={styles.paySummaryCard}>
                  <span className={styles.paySummaryIcon}>✅</span>
                  <div>
                    <p className={styles.paySummaryVal}>{eligibleRecipients.length}</p>
                    <p className={styles.paySummaryLbl}>Approved</p>
                  </div>
                </div>
              </div>

              {/* Withdraw — only shown when an employer has assigned a payment to this talent */}
              {!hasAssignedPayment ? (
                <div className={styles.noPaymentBanner}>
                  💼 Withdrawal is available once an employer assigns a locum payment to you for a job you applied to.
                </div>
              ) : (
                <>
                  {!eligible && (
                    <div className={styles.ineligibleBanner}>
                      ⏳ Withdrawal is locked until admin approves your payment. Once approved, funds will be available to withdraw to your connected bank account.
                    </div>
                  )}
                  <div className={styles.payBlock}>
                    <h3>Withdraw Funds</h3>
                    <p className={styles.payHint}>Funds are sent to your saved bank account.</p>
                    {!savedAcct && <p className={styles.payWarn}>⚠️ Connect your bank account below so funds can be transferred once your payment is approved.</p>}
                    <div className={styles.payFormCol}>
                      {myRecipients.length > 0 && (
                        <div className={styles.recipientList}>
                          {pendingRecipients.length > 0 && (
                            <div className={styles.recipientGroup}>
                              <p className={styles.recipientGroupLabel}>⏳ Pending Admin Approval</p>
                              {pendingRecipients.map(r => (
                                <div key={r.id} className={styles.recipientItem}>
                                  <span>🏥 {r.job_title ?? "Locum job"}</span>
                                  <span className={styles.recipientLocked}>Pending</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {eligibleRecipients.length > 0 && (
                            <div className={styles.recipientGroup}>
                              <p className={styles.recipientGroupLabel}>✅ Approved — Ready to Withdraw</p>
                              {eligibleRecipients.map(r => (
                                <div key={r.id} className={styles.recipientItem}>
                                  <span>🏥 {r.job_title ?? "Locum job"}</span>
                                  <span className={styles.recipientEligible}>
                                    {fmtMoney(parseFloat(r.payment_amount ?? 0) * TALENT_SHARE)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {eligible && (
                        <p className={styles.payHint}>
                          Max withdrawable: <strong>{fmtMoney(withdrawableAmt)}</strong> (95% of ₦{Number(withdrawableGross).toLocaleString()} approved)
                        </p>
                      )}
                      <input
                        type="number"
                        className={styles.payInput}
                        placeholder={eligible ? `Up to ${fmtMoney(withdrawableAmt)}` : "Not eligible yet"}
                        value={withdrawAmt}
                        onChange={e => setWithdrawAmt(e.target.value)}
                        disabled={!eligible}
                        max={withdrawableAmt}
                      />
                      <button
                        className={styles.payBtn}
                        onClick={handleWithdraw}
                        disabled={withdrawing || !eligible || !savedAcct}
                      >
                        {!eligible ? "🔒 Awaiting Admin Approval" : withdrawing ? "Processing…" : `💸 Withdraw${withdrawAmt ? " ₦" + Number(withdrawAmt).toLocaleString() : ""}`}
                      </button>
                      {payMsg.text && (
                        <p className={payMsg.type === "error" ? styles.payMsgError : styles.payMsgOk}>{payMsg.text}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className={styles.payBlock}>
                <h3>Bank Account Details</h3>
                {savedAcct ? (
                  <div className={styles.savedAcctBanner}>
                    🏦 <strong>{savedAcct.bank_name}</strong> — {savedAcct.account_number}
                    <span style={{display:"block",fontSize:"0.78rem",marginTop:"0.2rem",color:"#065f46"}}>
                      Account Name: {savedAcct.account_name}
                    </span>
                  </div>
                ) : (
                  <p className={styles.payWarn}>No bank account saved yet. Add one below.</p>
                )}
                <div className={styles.payFormCol}>
                  <div className={styles.bankSearchWrap}>
                    <input
                      className={styles.payInput}
                      placeholder={selectedBank ? `✓ ${selectedBank.name} — type to change` : "Search bank name…"}
                      value={bankSearch}
                      onChange={e => {
                        setBankSearch(e.target.value);
                        // Clear selection if user starts typing a new bank
                        if (e.target.value) setSelectedBank(null);
                      }}
                    />
                    {bankSearch.length > 0 && allBanks.filter(b =>
                      b.name.toLowerCase().includes(bankSearch.toLowerCase())
                    ).length > 0 && (
                      <div className={styles.bankDropdown}>
                        {allBanks
                          .filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()))
                          .slice(0, 8)
                          .map(b => (
                            <div key={b.id} className={styles.bankOption}
                              onClick={() => { setSelectedBank(b); setBankSearch(""); }}>
                              {b.name}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.payFormRow}>
                    <div className={styles.payFormGroup}>
                      <label>
                        Account Number
                        {canResolve && resolvingAcct && (
                          <span className={styles.resolveSpinner}> ⏳ Looking up…</span>
                        )}
                        {canResolve && resolvedAcct && !resolvingAcct && (
                          <span className={styles.resolveOk}> ✓ Found</span>
                        )}
                        {canResolve && resolveError && !resolvingAcct && (
                          <span className={styles.resolveErr}> ✕ Not found</span>
                        )}
                      </label>
                      <input
                        className={styles.payInput}
                        placeholder="10-digit number"
                        maxLength={10}
                        value={acctNumber}
                        onChange={e => setAcctNumber(e.target.value)}
                      />
                    </div>
                    <div className={styles.payFormGroup}>
                      <label>Account Name</label>
                      <input
                        className={`${styles.payInput} ${resolvedAcct ? styles.payInputResolved : ""} ${resolveError ? styles.payInputError : ""}`}
                        value={resolvingAcct ? "" : (resolvedAcct?.account_name ?? acctName)}
                        onChange={e => {
                          // Always allow manual entry — resolvedAcct takes priority when set
                          setAcctName(e.target.value);
                        }}
                        placeholder={resolvingAcct ? "Looking up account…" : resolveError ? "Not found — type name manually" : "Auto-filled or type manually"}
                        readOnly={resolvingAcct}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.payBtnOutline}
                    onClick={handleSaveAccount}
                    disabled={!acctNumber || !selectedBank && !savedAcct}
                  >
                    💾 Save Account
                  </button>
                  {payMsg.text && (
                    <p className={payMsg.type === "error" ? styles.payMsgError : styles.payMsgOk}
                       style={{marginTop:"0.5rem",fontSize:"0.85rem"}}>
                      {payMsg.text}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.payBlock}>
                <h3>Payment History</h3>
                {myRecipients.length === 0 ? (
                  <p className={styles.emptyState}>No payment history yet.</p>
                ) : (
                  <div className={styles.txTableWrap}>
                    <div className={styles.txTable}>
                      <div className={styles.txHead}>
                        <span>Date</span>
                        <span>Job</span>
                        <span>Employer</span>
                        <span>Amount</span>
                        <span>Status</span>
                      </div>
                      {myRecipients.map(r => {
                        const jobTitle  = r.job_title ?? "—";
                        const employer  = r.company_name || r.employer_email || "—";
                        const status    = r.payment_status ?? "pending";
                        const isSuccess = ["success","SUCCESS"].includes(r.payment_status ?? "");
                        const date      = r.payment_date ?? r.date;
                        return (
                          <div key={r.id} className={styles.txRow}>
                            <span className={styles.txDate}>
                              {date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </span>
                            <span className={styles.txRef}>{jobTitle}</span>
                            <span className={styles.txReason}>{employer}</span>
                            <span className={styles.txAmt}>
                              {fmtMoney(parseFloat(r.payment_amount ?? 0) * TALENT_SHARE)}
                              <span className={styles.txAmtNote}> (95% of {fmtMoney(r.payment_amount ?? 0)})</span>
                            </span>
                            <span className={`${styles.txStatus} ${isSuccess ? styles.txOk : styles.txFail}`}>
                              {r.eligible ? "✓ Eligible" : "⏳ Pending"} · {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Work Experience Component
function WorkExperienceSection({
  talentId,
  experiences,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    job_title: "",
    facility: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      job_title: "",
      facility: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      end_date: formData.end_date ? formData.end_date : null,
    };

    try {
      if (editingId) {
        await onUpdate({
          talentId,
          workId: editingId,
          data: payload,
        }).unwrap();
      } else {
        await onAdd({
          talentId,
          data: payload,
        }).unwrap();
      }
      resetForm();
    } catch (error) {
      alert(error?.data?.detail || "Failed to save work experience.");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      job_title: exp.job_title || "",
      facility: exp.facility || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }

    try {
      await onDelete({ talentId, workId: id }).unwrap();
    } catch (error) {
      alert(error?.data?.detail || "Failed to delete work experience.");
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            resetForm();
          }
        }}
        className={styles.addWorkBtn}
      >
        {showForm ? "Cancel" : "+ Add Work Experience"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.workForm}>
          <div className={styles.formGroup}>
            <label>Job Title *</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              placeholder="e.g., Senior ICU Nurse"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Facility/Hospital *</label>
            <input
              type="text"
              name="facility"
              value={formData.facility}
              onChange={(e) =>
                setFormData({ ...formData, facility: e.target.value })
              }
              placeholder="e.g., Lagos General Hospital"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date (Leave blank if current)</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              placeholder="Describe your responsibilities and achievements..."
              required
            />
          </div>

          <button type="submit" className={styles.saveBtn}>
            {editingId ? "Update" : "Add"} Experience
          </button>
        </form>
      )}

      <div className={styles.experienceList}>
        {experiences.length === 0 ? (
          <p className={styles.emptyState}>
            No work history added yet. Add at least 1 work experience!
          </p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className={styles.experienceItem}>
              <h4>{exp.job_title}</h4>
              <p className={styles.facility}>{exp.facility}</p>
              <p className={styles.dates}>
                {new Date(exp.start_date).toLocaleDateString()} -{" "}
                {exp.end_date
                  ? new Date(exp.end_date).toLocaleDateString()
                  : "Present"}
              </p>
              <p className={styles.description}>{exp.description}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(exp)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Education Component
function EducationSection({ talentId, education, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate({
          talentId,
          educationId: editingId,
          data: formData,
        }).unwrap();
      } else {
        await onAdd({
          talentId,
          data: formData,
        }).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ degree: "", institution: "", year: "" });
    } catch (error) {
      alert(error?.data?.detail || "Failed to save education.");
    }
  };

  const handleEdit = (edu) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
    });
    setEditingId(edu.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this education?")) {
      try {
        await onDelete({
          talentId,
          educationId: id,
        }).unwrap();
      } catch (error) {
        alert(error?.data?.detail || "Failed to delete education.");
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingId(null);
            setFormData({ degree: "", institution: "", year: "" });
          }
        }}
        className={styles.addEducationBtn}
      >
        {showForm ? "Cancel" : "+ Add Education"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.eduForm}>
          <div className={styles.formGroup}>
            <label>Degree *</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              placeholder="e.g., Bachelor of Science in Nursing"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              placeholder="e.g., University of Lagos"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Graduation Year *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              min="1950"
              max={new Date().getFullYear()}
              required
            />
          </div>
          <button type="submit" className={styles.saveBtn}>
            {editingId ? "Update" : "Add"} Education
          </button>
        </form>
      )}

      <div className={styles.educationList}>
        {education.length === 0 ? (
          <p className={styles.emptyState}>
            No education added yet. Add at least 1 educational qualification!
          </p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className={styles.educationItem}>
              <h4>{edu.degree}</h4>
              <p className={styles.institution}>{edu.institution}</p>
              <p className={styles.year}>Graduated: {edu.year}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(edu)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}