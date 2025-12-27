import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Upload,
} from "lucide-react";

const EditWorkerProfile = () => {
  const navigate = useNavigate();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Dr. Adaeze Nwankwo",
    profession: "registered-nurse",
    specialization: "Intensive Care Unit (ICU)",
    location: "Lagos, Nigeria",
    email: "adaeze.nwankwo@email.com",
    phone: "+234 801 234 5678",
    bio: "Dedicated ICU nurse with 8+ years of experience in critical care settings. Passionate about patient safety and evidence-based nursing practice.",
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: "Senior ICU Nurse",
      facility: "Lagos University Teaching Hospital",
      startDate: "2020-01",
      endDate: "",
      current: true,
      description: "Lead nurse in 20-bed ICU. Supervise junior nurses and coordinate patient care.",
    },
    {
      id: 2,
      role: "Staff Nurse",
      facility: "First Consultants Medical Centre",
      startDate: "2016-03",
      endDate: "2020-01",
      current: false,
      description: "Provided direct patient care in medical-surgical and ICU departments.",
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "B.Sc Nursing",
      institution: "University of Lagos",
      year: "2016",
    },
    {
      id: 2,
      degree: "ICU Nursing Certification",
      institution: "Nigerian Institute of Medical Research",
      year: "2018",
    },
  ]);

  const [skills, setSkills] = useState([
    "Critical Care",
    "Ventilator Management",
    "Patient Assessment",
    "Emergency Response",
    "Team Leadership",
    "Electronic Health Records",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        role: "",
        facility: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: number, field: string, value: string | boolean) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now(),
        degree: "",
        institution: "",
        year: "",
      },
    ]);
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

          {/* Personal Information */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">AN</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Select
                  value={personalInfo.profession}
                  onValueChange={(value) =>
                    setPersonalInfo({ ...personalInfo, profession: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered-nurse">Registered Nurse</SelectItem>
                    <SelectItem value="medical-doctor">Medical Doctor</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="lab-technician">Lab Technician</SelectItem>
                    <SelectItem value="physiotherapist">Physiotherapist</SelectItem>
                    <SelectItem value="radiographer">Radiographer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={personalInfo.specialization}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, specialization: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={personalInfo.location}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={personalInfo.bio}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, bio: e.target.value })
                  }
                  placeholder="Tell employers about yourself..."
                />
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className="border border-border rounded-xl p-5 relative"
                >
                  {experiences.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 text-destructive hover:text-destructive"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, "role", e.target.value)
                        }
                        placeholder="e.g., Senior Nurse"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Facility / Hospital</Label>
                      <Input
                        value={exp.facility}
                        onChange={(e) =>
                          updateExperience(exp.id, "facility", e.target.value)
                        }
                        placeholder="e.g., Lagos General Hospital"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                      />
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(exp.id, "current", e.target.checked)
                          }
                          className="rounded"
                        />
                        I currently work here
                      </label>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, "description", e.target.value)
                        }
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Education</h2>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="border border-border rounded-xl p-5 relative"
                >
                  {education.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 text-destructive hover:text-destructive"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Degree / Certificate</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        placeholder="e.g., B.Sc Nursing"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="e.g., University of Lagos"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) =>
                          updateEducation(edu.id, "year", e.target.value)
                        }
                        placeholder="e.g., 2020"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Skills & Competencies</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button variant="outline" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditWorkerProfile;
