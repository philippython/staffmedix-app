import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stethoscope,
  Search,
  Filter,
  Check,
  X,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Verifications", href: "/admin/verifications", icon: FileCheck },
  { name: "Workers", href: "/admin/workers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const pendingVerifications = [
  {
    id: 1,
    name: "Dr. Adaeze Nwankwo",
    profession: "Registered Nurse",
    licenseNumber: "NMCN/RN/2020/456789",
    documentsCount: 4,
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Emmanuel Okafor",
    profession: "Pharmacist",
    licenseNumber: "PCN/2019/123456",
    documentsCount: 3,
    submittedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: 3,
    name: "Fatima Bello",
    profession: "Medical Doctor",
    licenseNumber: "MDCN/2018/789012",
    documentsCount: 5,
    submittedAt: "1 day ago",
    status: "in_review",
  },
  {
    id: 4,
    name: "Chidinma Eze",
    profession: "Laboratory Scientist",
    licenseNumber: "MLSCN/2021/345678",
    documentsCount: 3,
    submittedAt: "1 day ago",
    status: "pending",
  },
  {
    id: 5,
    name: "Oluwaseun Adeyemi",
    profession: "Physiotherapist",
    licenseNumber: "MRTB/2020/901234",
    documentsCount: 4,
    submittedAt: "2 days ago",
    status: "pending",
  },
  {
    id: 6,
    name: "Grace Okoro",
    profession: "Radiographer",
    licenseNumber: "RRBN/2019/567890",
    documentsCount: 3,
    submittedAt: "3 days ago",
    status: "in_review",
  },
];

const documents = [
  { name: "Professional License", type: "pdf", verified: true },
  { name: "National ID Card", type: "jpg", verified: true },
  { name: "Certificate of Education", type: "pdf", verified: false },
  { name: "BLS Certification", type: "pdf", verified: null },
];

const AdminVerification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState<typeof pendingVerifications[0] | null>(null);
  const [showDocPreview, setShowDocPreview] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "in_review":
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            In Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="verified">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StaffMedix</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase px-4 mb-4">Admin</p>
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                link.name === "Verifications"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Verification Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review and verify healthcare worker credentials
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending", value: "24", color: "text-warning" },
            { label: "In Review", value: "8", color: "text-accent-foreground" },
            { label: "Approved Today", value: "12", color: "text-success" },
            { label: "Rejected Today", value: "3", color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl shadow-soft p-5">
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-soft p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, license number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingVerifications.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-semibold text-primary text-sm">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{worker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker.profession}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {worker.licenseNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{worker.documentsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker.submittedAt}</TableCell>
                  <TableCell>{getStatusBadge(worker.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedWorker(worker);
                          setShowDocPreview(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="success" size="sm">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing 1-6 of 24 results
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Document Preview Modal */}
      <Dialog open={showDocPreview} onOpenChange={setShowDocPreview}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Verification</DialogTitle>
            <DialogDescription>
              {selectedWorker?.name} • {selectedWorker?.profession}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground uppercase">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  {doc.verified === true && (
                    <Badge variant="verified">Verified</Badge>
                  )}
                  {doc.verified === false && (
                    <Badge variant="destructive">Issues Found</Badge>
                  )}
                  {doc.verified === null && (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocPreview(false)}>
              Cancel
            </Button>
            <Button variant="destructive">
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button variant="success">
              <Check className="w-4 h-4 mr-2" />
              Approve All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerification;
