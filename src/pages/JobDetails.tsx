import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Bookmark,
} from "lucide-react";

const jobData = {
  id: 1,
  title: "Senior ICU Nurse",
  facility: "Lagos University Teaching Hospital",
  location: "Lagos, Nigeria",
  jobType: "Full-time",
  shiftType: "Rotating (Day/Night)",
  salary: "₦450,000 - ₦650,000",
  posted: "2 days ago",
  deadline: "January 31, 2025",
  applicants: 24,
  verified: true,
  description: `We are seeking an experienced and compassionate Senior ICU Nurse to join our critical care team at Lagos University Teaching Hospital. The ideal candidate will have extensive experience in intensive care nursing and a passion for providing exceptional patient care.

As a Senior ICU Nurse, you will be responsible for managing critically ill patients, coordinating with multidisciplinary teams, and mentoring junior nursing staff. This role offers an opportunity to work in one of Nigeria's leading teaching hospitals with access to advanced medical technology and continuous professional development opportunities.`,
  responsibilities: [
    "Provide direct nursing care to critically ill patients in the ICU",
    "Monitor and assess patient conditions, documenting observations accurately",
    "Operate and maintain life-support equipment including ventilators and monitors",
    "Collaborate with physicians, respiratory therapists, and other healthcare professionals",
    "Mentor and supervise junior nursing staff",
    "Participate in quality improvement initiatives and research activities",
    "Respond to medical emergencies and participate in resuscitation efforts",
    "Educate patients' families about care plans and procedures",
  ],
  requirements: [
    "Bachelor's degree in Nursing (B.Sc Nursing)",
    "Valid Nursing and Midwifery Council of Nigeria (NMCN) license",
    "Minimum 5 years of ICU/Critical Care nursing experience",
    "Current BLS and ACLS certifications",
    "Proficiency in operating ICU equipment and ventilators",
    "Excellent communication and teamwork skills",
    "ICU specialty certification is a plus",
  ],
  benefits: [
    "Competitive salary with performance bonuses",
    "Health insurance coverage for employee and dependents",
    "Paid annual leave and public holidays",
    "Continuous professional development opportunities",
    "Pension and retirement benefits",
    "Meal allowance during shifts",
  ],
};

const JobDetails = () => {
  const { id } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Board
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {jobData.title}
                      </h1>
                      {jobData.verified && (
                        <Badge variant="verified">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified Employer
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-lg text-primary font-medium">
                      <Building2 className="w-5 h-5" />
                      {jobData.facility}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {jobData.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {jobData.jobType}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {jobData.shiftType}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="text-lg font-semibold text-primary">{jobData.salary}</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium text-foreground">{jobData.posted}</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium text-foreground">{jobData.deadline}</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applicants</p>
                    <p className="font-medium text-foreground">{jobData.applicants} applied</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Job Description</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {jobData.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {jobData.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {jobData.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-24">
                <Button
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => setShowApplyModal(true)}
                >
                  Apply Now
                </Button>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Application deadline: {jobData.deadline}
                </p>

                {/* Employer Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">About the Employer</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{jobData.facility}</p>
                      {jobData.verified && (
                        <Badge variant="verified" className="mt-2">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified Employer
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Leading teaching hospital providing world-class healthcare services and 
                    training the next generation of medical professionals.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold text-foreground mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-success" />
              Application Submitted!
            </DialogTitle>
            <DialogDescription>
              Your application for <span className="font-semibold text-foreground">{jobData.title}</span> at{" "}
              <span className="font-semibold text-foreground">{jobData.facility}</span> has been successfully submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary/50 rounded-xl p-4 my-4">
            <p className="text-sm text-muted-foreground">
              The employer will review your verified profile and credentials. You'll be notified 
              when there's an update on your application status.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyModal(false)}>
              Close
            </Button>
            <Button asChild>
              <Link to="/jobs">Browse More Jobs</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;
