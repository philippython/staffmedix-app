import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  Menu,
  X,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
  Activity,
  UserCheck,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Workers", href: "/admin/workers", icon: Users },
  { name: "Organizations", href: "/admin/organizations", icon: Building2 },
  { name: "Advertisements", href: "/admin/ads", icon: Megaphone },
  { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const statsCards = [
  {
    title: "Total Workers",
    value: "2,847",
    change: "+124 this month",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-secondary",
  },
  {
    title: "Total Organizations",
    value: "156",
    change: "+12 this month",
    icon: Building2,
    color: "text-accent-foreground",
    bgColor: "bg-accent",
  },
  {
    title: "Verified Profiles",
    value: "2,134",
    change: "75% verified",
    icon: ShieldCheck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Pending Reviews",
    value: "89",
    change: "12 urgent",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const recentWorkers = [
  { name: "Dr. Adaeze Nwankwo", profession: "ICU Nurse", status: "Verified", date: "2 hours ago" },
  { name: "Emmanuel Okafor", profession: "Pharmacist", status: "Pending", date: "5 hours ago" },
  { name: "Fatima Bello", profession: "Medical Doctor", status: "Verified", date: "1 day ago" },
  { name: "Chidinma Eze", profession: "Lab Scientist", status: "Rejected", date: "2 days ago" },
];

const recentOrganizations = [
  { name: "Lagos General Hospital", type: "Hospital", workers: 45, status: "Active" },
  { name: "First Consultants Medical", type: "Clinic", workers: 23, status: "Active" },
  { name: "PharmaCare Plus", type: "Pharmacy", workers: 12, status: "Pending" },
  { name: "HealthFirst Diagnostics", type: "Laboratory", workers: 18, status: "Active" },
];

const activityData = [
  { action: "Worker verified", target: "Dr. Adaeze Nwankwo", time: "2 hours ago", icon: CheckCircle, color: "text-success" },
  { action: "New organization registered", target: "MediCare Clinic", time: "4 hours ago", icon: Building2, color: "text-primary" },
  { action: "Verification rejected", target: "John Doe", time: "6 hours ago", icon: XCircle, color: "text-destructive" },
  { action: "New worker signup", target: "Sarah Johnson", time: "8 hours ago", icon: UserCheck, color: "text-accent-foreground" },
];

const AdminDashboard = () => {
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

          {/* Admin Badge */}
          <div className="px-4 py-3 border-b border-border">
            <Badge variant="destructive" className="w-full justify-center py-1">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Admin Panel
            </Badge>
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

          {/* Admin Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">Super Admin</p>
                <p className="text-xs text-muted-foreground">admin@staffmedix.com</p>
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/verifications">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  89 Pending
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/verifications">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Review Queue
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
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-success mt-2">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Workers */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Recent Workers</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentWorkers.map((worker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-semibold text-primary text-sm">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{worker.name}</p>
                        <p className="text-xs text-muted-foreground">{worker.profession}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        worker.status === "Verified" ? "verified" :
                        worker.status === "Pending" ? "pending" : "destructive"
                      }
                      className="text-xs"
                    >
                      {worker.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Organizations */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Organizations</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentOrganizations.map((org, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.type} • {org.workers} workers</p>
                      </div>
                    </div>
                    <Badge
                      variant={org.status === "Active" ? "success" : "pending"}
                      className="text-xs"
                    >
                      {org.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {activityData.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted", activity.color)}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">234</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12.4K</p>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">567</p>
                <p className="text-sm text-muted-foreground">Hires Made</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">89%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
