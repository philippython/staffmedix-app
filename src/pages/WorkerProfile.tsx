import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Edit,
  Download,
  Clock,
} from "lucide-react";

const workerData = {
  name: "Dr. Adaeze Nwankwo",
  profession: "Registered Nurse",
  specialization: "Intensive Care Unit (ICU)",
  location: "Lagos, Nigeria",
  email: "adaeze.nwankwo@email.com",
  phone: "+234 801 234 5678",
  verified: true,
  yearsExperience: 8,
  bio: "Dedicated ICU nurse with 8+ years of experience in critical care settings. Passionate about patient safety and evidence-based nursing practice.",
  licenses: [
    {
      name: "Registered Nurse License",
      number: "NMCN/RN/2016/123456",
      council: "Nursing and Midwifery Council of Nigeria",
      expiry: "December 2025",
      verified: true,
    },
    {
      name: "BLS Certification",
      number: "AHA-BLS-789012",
      council: "American Heart Association",
      expiry: "March 2025",
      verified: true,
    },
  ],
  experience: [
    {
      role: "Senior ICU Nurse",
      facility: "Lagos University Teaching Hospital",
      period: "2020 - Present",
      description: "Lead nurse in 20-bed ICU. Supervise junior nurses and coordinate patient care.",
    },
    {
      role: "Staff Nurse",
      facility: "First Consultants Medical Centre",
      period: "2016 - 2020",
      description: "Provided direct patient care in medical-surgical and ICU departments.",
    },
  ],
  education: [
    {
      degree: "B.Sc Nursing",
      institution: "University of Lagos",
      year: "2016",
    },
    {
      degree: "ICU Nursing Certification",
      institution: "Nigerian Institute of Medical Research",
      year: "2018",
    },
  ],
  skills: [
    "Critical Care",
    "Ventilator Management",
    "Patient Assessment",
    "Emergency Response",
    "Team Leadership",
    "Electronic Health Records",
  ],
};

const WorkerProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden mb-8">
            {/* Banner */}
            <div className="h-32 gradient-hero relative">
              <Button
                variant="hero"
                size="sm"
                className="absolute top-4 right-4 bg-card/20 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-card/30"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-16 relative">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-2xl bg-secondary border-4 border-card flex items-center justify-center shadow-elevated">
                  <span className="text-4xl font-bold text-primary">
                    {workerData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 pt-4 md:pt-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {workerData.name}
                    </h1>
                    {workerData.verified ? (
                      <Badge variant="verified">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified Professional
                      </Badge>
                    ) : (
                      <Badge variant="pending">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-primary font-medium mb-3">
                    {workerData.profession} • {workerData.specialization}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {workerData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {workerData.yearsExperience} years experience
                    </span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{workerData.bio}</p>
              </section>

              {/* Licenses & Credentials */}
              <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Licenses & Credentials
                </h2>
                <div className="space-y-4">
                  {workerData.licenses.map((license, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{license.name}</h3>
                          <p className="text-sm text-muted-foreground">{license.council}</p>
                          <p className="text-sm text-muted-foreground">
                            License: {license.number} • Expires: {license.expiry}
                          </p>
                        </div>
                      </div>
                      {license.verified && (
                        <Badge variant="verified" className="self-start md:self-center">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Work Experience */}
              <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {workerData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-border pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                      <h3 className="font-semibold text-foreground">{exp.role}</h3>
                      <p className="text-primary font-medium text-sm">{exp.facility}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                      <p className="text-muted-foreground text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <section className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{workerData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{workerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{workerData.location}</span>
                  </div>
                </div>
              </section>

              {/* Education */}
              <section className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-4">
                  {workerData.education.map((edu, index) => (
                    <div key={index}>
                      <p className="font-medium text-foreground">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold text-foreground mb-4">Skills & Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {workerData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkerProfile;
