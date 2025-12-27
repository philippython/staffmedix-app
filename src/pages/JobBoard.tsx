import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Search,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Building2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const professionFilters = [
  "Registered Nurse",
  "Medical Doctor",
  "Pharmacist",
  "Laboratory Scientist",
  "Physiotherapist",
  "Radiographer",
];

const experienceFilters = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
];

const jobListings = [
  {
    id: 1,
    title: "Senior ICU Nurse",
    facility: "Lagos University Teaching Hospital",
    location: "Lagos",
    jobType: "Full-time",
    shiftType: "Rotating",
    salary: "₦450,000 - ₦650,000",
    posted: "2 days ago",
    verified: true,
    description: "Seeking an experienced ICU nurse to join our critical care team. Must have at least 5 years of ICU experience.",
  },
  {
    id: 2,
    title: "Clinical Pharmacist",
    facility: "First Consultants Medical Centre",
    location: "Abuja",
    jobType: "Full-time",
    shiftType: "Day Shift",
    salary: "₦500,000 - ₦700,000",
    posted: "3 days ago",
    verified: true,
    description: "Looking for a clinical pharmacist to manage medication therapy and provide consultations.",
  },
  {
    id: 3,
    title: "General Practitioner",
    facility: "Evercare Hospital",
    location: "Lagos",
    jobType: "Full-time",
    shiftType: "Flexible",
    salary: "₦800,000 - ₦1,200,000",
    posted: "1 week ago",
    verified: true,
    description: "Join our team of general practitioners providing primary care to diverse patient population.",
  },
  {
    id: 4,
    title: "Laboratory Scientist",
    facility: "PathCare Nigeria",
    location: "Port Harcourt",
    jobType: "Contract",
    shiftType: "Day Shift",
    salary: "₦350,000 - ₦500,000",
    posted: "4 days ago",
    verified: true,
    description: "Experienced laboratory scientist needed for clinical chemistry and hematology departments.",
  },
  {
    id: 5,
    title: "Pediatric Nurse",
    facility: "Reddington Hospital",
    location: "Lagos",
    jobType: "Full-time",
    shiftType: "Rotating",
    salary: "₦400,000 - ₦550,000",
    posted: "5 days ago",
    verified: true,
    description: "Compassionate pediatric nurse needed for our children's ward. NICU experience is a plus.",
  },
  {
    id: 6,
    title: "Radiographer",
    facility: "St. Nicholas Hospital",
    location: "Lagos",
    jobType: "Full-time",
    shiftType: "Day Shift",
    salary: "₦380,000 - ₦520,000",
    posted: "1 week ago",
    verified: false,
    description: "Seeking a skilled radiographer proficient in CT, MRI, and general X-ray procedures.",
  },
];

const JobBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const toggleProfession = (profession: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession]
    );
  };

  const toggleExperience = (exp: string) => {
    setSelectedExperience((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const clearFilters = () => {
    setSelectedProfessions([]);
    setSelectedExperience([]);
    setLocationFilter("");
  };

  const hasActiveFilters =
    selectedProfessions.length > 0 || selectedExperience.length > 0 || locationFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Search Header */}
        <section className="gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground text-center mb-8">
              Find Your Next Healthcare Opportunity
            </h1>

            <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-elevated p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title, profession..."
                    className="pl-12 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="md:w-48 h-12">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="ibadan">Ibadan</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-12">
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside
              className={`lg:w-72 ${
                showFilters ? "block" : "hidden lg:block"
              } space-y-6`}
            >
              <div className="bg-card rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Profession Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Profession</h4>
                  <div className="space-y-3">
                    {professionFilters.map((profession) => (
                      <label
                        key={profession}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedProfessions.includes(profession)}
                          onCheckedChange={() => toggleProfession(profession)}
                        />
                        <span className="text-sm text-muted-foreground">{profession}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Experience Level</h4>
                  <div className="space-y-3">
                    {experienceFilters.map((exp) => (
                      <label key={exp} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedExperience.includes(exp)}
                          onCheckedChange={() => toggleExperience(exp)}
                        />
                        <span className="text-sm text-muted-foreground">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{jobListings.length}</span> jobs
                </p>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                    <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {jobListings.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block bg-card rounded-2xl shadow-soft p-6 card-hover border border-transparent hover:border-primary"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                          {job.verified && (
                            <Badge variant="verified">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Verified Employer
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{job.facility}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            <Briefcase className="w-3 h-3" />
                            {job.jobType}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {job.shiftType}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-primary">{job.salary}</p>
                          <p className="text-xs text-muted-foreground">{job.posted}</p>
                        </div>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon"
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobBoard;
