import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  Menu,
  X,
  Search,
  Eye,
  MapPin,
  Clock,
  Calendar,
  Building2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Hourglass,
  User,
  Bell,
  BookmarkCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/worker-dashboard", icon: LayoutDashboard },
  { name: "Browse Jobs", href: "/jobs", icon: Search },
  { name: "My Applications", href: "/worker-dashboard", icon: FileText },
  { name: "Saved Jobs", href: "/worker-dashboard", icon: BookmarkCheck },
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/worker-settings", icon: Settings },
];

const statsCards = [
  {
    title: "Applications Sent",
    value: "12",
    change: "+3 this week",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-secondary",
  },
  {
    title: "Profile Views",
    value: "248",
    change: "+15% vs last month",
    icon: Eye,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Interviews Scheduled",
    value: "3",
    change: "2 upcoming",
    icon: Calendar,
    color: "text-accent-foreground",
    bgColor: "bg-accent",
  },
  {
    title: "Saved Jobs",
    value: "8",
    change: "5 still active",
    icon: BookmarkCheck,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const appliedJobs = [
  {
    id: 1,
    title: "Senior ICU Nurse",
    facility: "Lagos University Teaching Hospital",
    location: "Lagos",
    salary: "₦450,000 - ₦650,000",
    appliedDate: "Dec 20, 2025",
    status: "Under Review",
  },
  {
    id: 2,
    title: "Clinical Pharmacist",
    facility: "First Consultants Medical Centre",
    location: "Abuja",
    salary: "₦500,000 - ₦700,000",
    appliedDate: "Dec 18, 2025",
    status: "Interview Scheduled",
  },
  {
    id: 3,
    title: "General Practitioner",
    facility: "Evercare Hospital",
    location: "Lagos",
    salary: "₦800,000 - ₦1,200,000",
    appliedDate: "Dec 15, 2025",
    status: "Rejected",
  },
  {
    id: 4,
    title: "Pediatric Nurse",
    facility: "Reddington Hospital",
    location: "Lagos",
    salary: "₦400,000 - ₦550,000",
    appliedDate: "Dec 10, 2025",
    status: "Offer Received",
  },
];

const recommendedJobs = [
  {
    id: 5,
    title: "Emergency Room Nurse",
    facility: "National Hospital Abuja",
    location: "Abuja",
    salary: "₦480,000 - ₦620,000",
    posted: "1 day ago",
    matchScore: 95,
  },
  {
    id: 6,
    title: "ICU Specialist Nurse",
    facility: "Cedarcrest Hospital",
    location: "Lagos",
    salary: "₦520,000 - ₦700,000",
    posted: "2 days ago",
    matchScore: 88,
  },
  {
    id: 7,
    title: "Critical Care Nurse",
    facility: "Eko Hospital",
    location: "Lagos",
    salary: "₦450,000 - ₦600,000",
    posted: "3 days ago",
    matchScore: 82,
  },
];

const upcomingInterviews = [
  {
    id: 1,
    jobTitle: "Clinical Pharmacist",
    facility: "First Consultants Medical Centre",
    date: "Dec 28, 2025",
    time: "10:00 AM",
    type: "Video Call",
  },
  {
    id: 2,
    jobTitle: "Senior ICU Nurse",
    facility: "Lagos University Teaching Hospital",
    date: "Jan 2, 2026",
    time: "2:00 PM",
    type: "In-Person",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Under Review":
      return (
        <Badge variant="secondary" className="gap-1">
          <Hourglass className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "Interview Scheduled":
      return (
        <Badge variant="verified" className="gap-1">
          <Calendar className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "Rejected":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "Offer Received":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const WorkerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-card border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">StaffMedix</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 px-6 h-16 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">StaffMedix</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Worker Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">Dr. Adaeze Nwankwo</p>
                <p className="text-xs text-muted-foreground">ICU Nurse</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Adaeze!</h1>
              <p className="text-muted-foreground">Here's your job search overview.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button asChild>
                <Link to="/jobs">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statsCards.map((stat) => (
              <div key={stat.title} className="bg-card rounded-2xl shadow-soft p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-success mt-2">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Applied Jobs */}
            <div className="lg:col-span-2 bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">My Applications</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {appliedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.facility}</span>
                          <span>•</span>
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <p className="text-sm text-primary font-medium mt-1">{job.salary}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        {getStatusBadge(job.status)}
                        <span className="text-xs text-muted-foreground">Applied: {job.appliedDate}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Upcoming Interviews</h2>
              </div>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 border border-border rounded-xl"
                  >
                    <h3 className="font-semibold text-foreground text-sm">{interview.jobTitle}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{interview.facility}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{interview.time}</span>
                    </div>
                    <Badge variant="secondary" className="mt-3">
                      {interview.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-card rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/jobs">
                  Browse All Jobs
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="p-4 border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="verified" className="text-xs">
                      {job.matchScore}% Match
                    </Badge>
                    <span className="text-xs text-muted-foreground">{job.posted}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{job.facility}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </div>
                  <p className="text-sm font-medium text-primary">{job.salary}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;
