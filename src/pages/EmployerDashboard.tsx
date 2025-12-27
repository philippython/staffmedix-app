import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Settings,
  Menu,
  X,
  Plus,
  Eye,
  Users,
  TrendingUp,
  FileText,
  ChevronRight,
  Calendar,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/employer-dashboard", icon: LayoutDashboard },
  { name: "Job Posts", href: "/job-posting", icon: Briefcase },
  { name: "Subscription", href: "/pricing", icon: CreditCard },
  { name: "Settings", href: "/employer-settings", icon: Settings },
];

const statsCards = [
  {
    title: "Active Job Posts",
    value: "12",
    change: "+2 this week",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-secondary",
  },
  {
    title: "Profile Views",
    value: "1,284",
    change: "+18% vs last month",
    icon: Eye,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Total Applicants",
    value: "89",
    change: "12 new this week",
    icon: Users,
    color: "text-accent-foreground",
    bgColor: "bg-accent",
  },
  {
    title: "Hire Rate",
    value: "34%",
    change: "+5% improvement",
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const recentApplications = [
  {
    name: "Dr. Adaeze Nwankwo",
    role: "ICU Nurse",
    jobTitle: "Senior ICU Nurse",
    date: "2 hours ago",
    status: "New",
  },
  {
    name: "Emmanuel Okafor",
    role: "Pharmacist",
    jobTitle: "Clinical Pharmacist",
    date: "5 hours ago",
    status: "Reviewed",
  },
  {
    name: "Fatima Bello",
    role: "Medical Doctor",
    jobTitle: "General Practitioner",
    date: "1 day ago",
    status: "Shortlisted",
  },
  {
    name: "Chidinma Eze",
    role: "Lab Scientist",
    jobTitle: "Senior Lab Scientist",
    date: "2 days ago",
    status: "New",
  },
];

const activeJobs = [
  {
    title: "Senior ICU Nurse",
    applicants: 24,
    views: 156,
    posted: "3 days ago",
    status: "Active",
  },
  {
    title: "Clinical Pharmacist",
    applicants: 18,
    views: 98,
    posted: "1 week ago",
    status: "Active",
  },
  {
    title: "General Practitioner",
    applicants: 12,
    views: 234,
    posted: "2 weeks ago",
    status: "Closing Soon",
  },
];

const EmployerDashboard = () => {
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

          {/* Company Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">Lagos General Hospital</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
              </div>
            </div>
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your hiring overview.</p>
            </div>
            <Button asChild>
              <Link to="/job-posting">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Link>
            </Button>
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

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentApplications.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-semibold text-primary text-sm">
                          {app.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{app.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.role} • Applied for {app.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          app.status === "New"
                            ? "default"
                            : app.status === "Shortlisted"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {app.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Jobs */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Active Job Posts</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/job-posting">
                    Manage Jobs
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {activeJobs.map((job, index) => (
                  <Link
                    key={index}
                    to="/job-posting"
                    className="block p-4 border border-border rounded-xl hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <Badge
                        variant={job.status === "Closing Soon" ? "warning" : "verified"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicants} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {job.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {job.posted}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
