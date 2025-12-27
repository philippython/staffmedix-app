import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Building2,
  Megaphone,
  Edit,
  Trash2,
  Star,
  Calendar,
  TrendingUp,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/employer-dashboard", icon: LayoutDashboard },
  { name: "Job Posts", href: "/job-posting", icon: Briefcase },
  { name: "Advertisements", href: "/employer-ads", icon: Megaphone },
  { name: "Subscription", href: "/pricing", icon: CreditCard },
  { name: "Settings", href: "/employer-settings", icon: Settings },
];

const myAds = [
  {
    id: 1,
    title: "Premium Organization Showcase",
    description: "Highlight our hospital as a top employer with state-of-the-art facilities and excellent work culture.",
    status: "Active",
    featured: true,
    views: 1245,
    clicks: 89,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    budget: "₦150,000",
  },
  {
    id: 2,
    title: "Nursing Department Hiring",
    description: "Promote our nursing department's open positions and benefits to attract qualified nurses.",
    status: "Active",
    featured: false,
    views: 567,
    clicks: 34,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    budget: "₦75,000",
  },
  {
    id: 3,
    title: "Graduate Training Program",
    description: "Advertisement for our new graduate training program for fresh medical professionals.",
    status: "Paused",
    featured: false,
    views: 234,
    clicks: 12,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    budget: "₦50,000",
  },
];

const EmployerAds = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Advertisements</h1>
              <p className="text-muted-foreground">Manage your organization's ads and promotions</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Advertisement</DialogTitle>
                  <DialogDescription>
                    Promote your organization to healthcare professionals
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ad Title</Label>
                    <Input id="title" placeholder="e.g., Premium Organization Showcase" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe what you want to promote..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₦)</Label>
                    <Input id="budget" type="number" placeholder="50000" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" className="rounded" />
                    <Label htmlFor="featured" className="text-sm font-normal">
                      Make this a featured ad (additional cost)
                    </Label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsCreateDialogOpen(false)}>
                    Create Ad
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2,046</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">135</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Featured Ads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ads List */}
          <div className="bg-card rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Your Advertisements</h2>
            <div className="space-y-4">
              {myAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{ad.title}</h3>
                        <Badge
                          variant={
                            ad.status === "Active" ? "success" :
                            ad.status === "Paused" ? "warning" : "secondary"
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
                      <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
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
                      {ad.status === "Active" ? (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="mt-8 bg-primary/5 rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-3">Advertisement Pricing</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-foreground mb-1">Basic Ad</p>
                <p className="text-2xl font-bold text-primary">₦25,000<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mt-2">Standard visibility in the ads section</p>
              </div>
              <div className="bg-card rounded-xl p-4 border-2 border-primary">
                <p className="font-medium text-foreground mb-1">Featured Ad</p>
                <p className="text-2xl font-bold text-primary">₦75,000<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mt-2">Premium placement + featured badge</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-foreground mb-1">Premium Ad</p>
                <p className="text-2xl font-bold text-primary">₦150,000<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mt-2">Homepage banner + all features</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerAds;
