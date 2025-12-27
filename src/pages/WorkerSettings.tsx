import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Briefcase,
  FileText,
  Settings,
  Menu,
  X,
  Search,
  User,
  Bell,
  Lock,
  Mail,
  Phone,
  Globe,
  BookmarkCheck,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const sidebarLinks = [
  { name: "Dashboard", href: "/worker-dashboard", icon: LayoutDashboard },
  { name: "Browse Jobs", href: "/jobs", icon: Search },
  { name: "My Applications", href: "/worker-dashboard", icon: FileText },
  { name: "Saved Jobs", href: "/worker-dashboard", icon: BookmarkCheck },
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/worker-settings", icon: Settings },
];

const WorkerSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    jobAlerts: true,
    applicationUpdates: true,
    interviewReminders: true,
    newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

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
          <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            {/* Account Settings */}
            <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="email"
                        type="email"
                        defaultValue="adaeze.nwankwo@email.com"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+234 801 234 5678"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="yo">Yoruba</SelectItem>
                        <SelectItem value="ig">Igbo</SelectItem>
                        <SelectItem value="ha">Hausa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="wat">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wat">West Africa Time (WAT)</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Job Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about new matching jobs</p>
                  </div>
                  <Switch
                    checked={notifications.jobAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, jobAlerts: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Application Updates</p>
                    <p className="text-sm text-muted-foreground">Updates on your job applications</p>
                  </div>
                  <Switch
                    checked={notifications.applicationUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, applicationUpdates: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Interview Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for scheduled interviews</p>
                  </div>
                  <Switch
                    checked={notifications.interviewReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, interviewReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Weekly healthcare industry updates</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newsletter: checked })
                    }
                  />
                </div>
              </div>
            </section>

            {/* Privacy Settings */}
            <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Privacy Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to employers</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, profileVisible: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Show Email Address</p>
                    <p className="text-sm text-muted-foreground">Display email on public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showEmail: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Show Phone Number</p>
                    <p className="text-sm text-muted-foreground">Display phone on public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showPhone: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Allow Direct Messages</p>
                    <p className="text-sm text-muted-foreground">Let employers message you directly</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowMessages: checked })
                    }
                  />
                </div>
              </div>
            </section>

            {/* Password Section */}
            <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="mt-2" />
                </div>
                <Button variant="outline">Update Password</Button>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link to="/worker-dashboard">Cancel</Link>
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerSettings;
