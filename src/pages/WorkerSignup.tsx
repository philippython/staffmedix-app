import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Upload, CheckCircle2, User, FileText, GraduationCap } from "lucide-react";

const professions = [
  "Registered Nurse",
  "Medical Doctor",
  "Pharmacist",
  "Laboratory Scientist",
  "Physiotherapist",
  "Radiographer",
  "Dentist",
  "Midwife",
  "Community Health Worker",
  "Other",
];

const councils = [
  "Nursing and Midwifery Council of Nigeria (NMCN)",
  "Medical and Dental Council of Nigeria (MDCN)",
  "Pharmacists Council of Nigeria (PCN)",
  "Medical Laboratory Science Council of Nigeria (MLSCN)",
  "Medical Rehabilitation Therapists Board of Nigeria (MRTB)",
  "Radiographers Registration Board of Nigeria (RRBN)",
  "Community Health Practitioners Registration Board of Nigeria",
  "Other",
];

const WorkerSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    specialization: "",
    licenseNumber: "",
    issuingCouncil: "",
  });

  const progress = (currentStep / 3) * 100;

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Professional Details", icon: FileText },
    { number: 3, title: "Credentials", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Secure Verification Process
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Worker Profile
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of verified healthcare professionals. Complete your profile 
              to unlock opportunities with trusted employers.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 ${
                    currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl shadow-soft p-8 md:p-10">
            {/* Verified Badge Highlight */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-8 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Earn Your Verified Badge
                </h3>
                <p className="text-sm text-muted-foreground">
                  Once your credentials are verified, you'll receive a trusted badge 
                  that employers look for when hiring.
                </p>
              </div>
            </div>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., Adaeze Nwankwo"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="adaeze@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+234 800 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setCurrentStep(2)} size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-foreground mb-6">Professional Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Profession *</Label>
                    <Select
                      value={formData.profession}
                      onValueChange={(value) => setFormData({ ...formData, profession: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions.map((profession) => (
                          <SelectItem key={profession} value={profession}>
                            {profession}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., ICU, Pediatrics, Cardiology"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="e.g., NMCN/RN/123456"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Council *</Label>
                    <Select
                      value={formData.issuingCouncil}
                      onValueChange={(value) => setFormData({ ...formData, issuingCouncil: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select council" />
                      </SelectTrigger>
                      <SelectContent>
                        {councils.map((council) => (
                          <SelectItem key={council} value={council}>
                            {council}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Credentials Upload */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-foreground mb-6">Upload Credentials</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { name: "Professional License", required: true },
                    { name: "ID Card (National/Passport)", required: true },
                    { name: "Certificate of Education", required: false },
                    { name: "Additional Certifications", required: false },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Upload className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <p className="font-medium text-foreground mb-1">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.required ? "Required" : "Optional"} • PDF, JPG, PNG
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button size="lg">
                    Submit for Verification
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkerSignup;
