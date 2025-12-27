import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  Menu,
  X,
  Eye,
  Megaphone,
  Search,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  TrendingUp,
  Ban,
  DollarSign,
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

const allAds = [
  {
    id: 1,
    organizationName: "Lagos General Hospital",
    title: "Premium Organization Showcase",
    status: "Active",
    featured: true,
    views: 1245,
    clicks: 89,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    budget: "₦150,000",
    approved: true,
  },
  {
    id: 2,
    organizationName: "First Consultants Medical",
    title: "Hiring Medical Staff",
    status: "Pending",
    featured: false,
    views: 0,
    clicks: 0,
    startDate: "2024-01-25",
    endDate: "2024-02-25",
    budget: "₦50,000",
    approved: false,
  },
  {
    id: 3,
    organizationName: "PharmaCare Plus",
    title: "Pharmacy Chain Expansion",
    status: "Active",
    featured: false,
    views: 567,
    clicks: 34,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    budget: "₦75,000",
    approved: true,
  },
  {
    id: 4,
    organizationName: "HealthFirst Diagnostics",
    title: "Lab Scientists Wanted",
    status: "Rejected",
    featured: false,
    views: 0,
    clicks: 0,
    startDate: "2024-01-18",
    endDate: "2024-02-18",
    budget: "₦40,000",
    approved: false,
  },
  {
    id: 5,
    organizationName: "MediCare Nursing Home",
    title: "Join Our Care Team",
    status: "Active",
    featured: true,
    views: 890,
    clicks: 56,
    startDate: "2024-01-12",
    endDate: "2024-02-12",
    budget: "₦100,000",
    approved: true,
  },
];

const AdminAds = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const filteredAds = allAds.filter(ad => {
    const matchesStatus = filterStatus === "all" || ad.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = ad.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Advertisement Management</h1>
              <p className="text-muted-foreground">Review and manage all platform advertisements</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/ads">
                <Eye className="w-4 h-4 mr-2" />
                View Public Ads Page
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">15</p>
                  <p className="text-sm text-muted-foreground">Total Ads</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">10</p>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₦1.2M</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by organization or ad title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ads List */}
          <div className="bg-card rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">All Advertisements</h2>
            <div className="space-y-4">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{ad.organizationName}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{ad.title}</h3>
                        <Badge
                          variant={
                            ad.status === "Active" ? "success" :
                            ad.status === "Pending" ? "pending" :
                            "destructive"
                          }
                        >
                          {ad.status}
                        </Badge>
                        {ad.featured && (
                          <Badge variant="premium">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {ad.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {ad.clicks} clicks
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {ad.startDate} - {ad.endDate}
                        </span>
                        <span className="font-medium text-foreground">{ad.budget}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ad.status === "Pending" && (
                        <>
                          <Button size="sm" className="bg-success hover:bg-success/90">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {ad.status === "Active" && (
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAds;
