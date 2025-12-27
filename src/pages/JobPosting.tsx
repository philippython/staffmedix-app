import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Building2,
  Eye,
} from "lucide-react";

const jobTypes = ["Full-time", "Part-time", "Contract", "Locum", "Internship"];
const shiftTypes = ["Day Shift", "Night Shift", "Rotating", "Flexible", "On-call"];
const locations = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Enugu",
  "Kaduna",
  "Remote",
];

const JobPosting = () => {
  const [formData, setFormData] = useState({
    title: "",
    facilityName: "",
    jobType: "",
    shiftType: "",
    location: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    requirements: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Post a New Job
            </h1>
            <p className="text-muted-foreground">
              Create a compelling job listing to attract verified healthcare professionals.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Job Details</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Senior ICU Nurse"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facilityName">Facility Name *</Label>
                      <Input
                        id="facilityName"
                        placeholder="e.g., Lagos General Hospital"
                        value={formData.facilityName}
                        onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Job Type *</Label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shift Type *</Label>
                      <Select
                        value={formData.shiftType}
                        onValueChange={(value) => setFormData({ ...formData, shiftType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          {shiftTypes.map((shift) => (
                            <SelectItem key={shift} value={shift}>
                              {shift}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => setFormData({ ...formData, location: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Salary Range (₦/month)</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          placeholder="Min"
                          value={formData.salaryMin}
                          onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          placeholder="Max"
                          value={formData.salaryMax}
                          onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="List required qualifications, licenses, experience level, etc..."
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Save as Draft</Button>
                <Button size="lg">Publish Job</Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                </div>
                
                <div className="bg-card rounded-2xl shadow-soft p-6 border-2 border-dashed border-border">
                  {/* Preview Card */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {formData.title || "Job Title"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formData.facilityName || "Facility Name"}
                          </span>
                        </div>
                      </div>
                      <Badge variant="verified">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {formData.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {formData.location}
                        </div>
                      )}
                      {formData.jobType && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          <Briefcase className="w-3 h-3" />
                          {formData.jobType}
                        </div>
                      )}
                      {formData.shiftType && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {formData.shiftType}
                        </div>
                      )}
                    </div>

                    {(formData.salaryMin || formData.salaryMax) && (
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <DollarSign className="w-4 h-4" />
                        ₦{formData.salaryMin || "0"} - ₦{formData.salaryMax || "0"} /month
                      </div>
                    )}

                    {formData.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description}
                      </p>
                    )}

                    <Button className="w-full">Apply Now</Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  This is how your job will appear to healthcare professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobPosting;
