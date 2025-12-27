import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Users,
  Star,
  ExternalLink,
  Stethoscope,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const advertisements = [
  {
    id: 1,
    organizationName: "Lagos General Hospital",
    logo: null,
    tagline: "Excellence in Healthcare Since 1965",
    description: "Join Nigeria's premier healthcare institution with state-of-the-art facilities and a commitment to exceptional patient care. We offer competitive salaries, continuous training, and career growth opportunities.",
    location: "Lagos, Nigeria",
    type: "Hospital",
    employees: "500+",
    openPositions: 12,
    rating: 4.8,
    verified: true,
    featured: true,
    benefits: ["Health Insurance", "Housing Allowance", "Training Programs", "Pension"],
  },
  {
    id: 2,
    organizationName: "First Consultants Medical Center",
    logo: null,
    tagline: "Specialized Care, Personal Touch",
    description: "A leading private medical center specializing in cardiology, neurology, and orthopedics. We're looking for passionate healthcare professionals to join our growing team.",
    location: "Abuja, Nigeria",
    type: "Medical Center",
    employees: "200+",
    openPositions: 8,
    rating: 4.6,
    verified: true,
    featured: true,
    benefits: ["Competitive Salary", "Professional Development", "Flexible Hours"],
  },
  {
    id: 3,
    organizationName: "PharmaCare Plus",
    logo: null,
    tagline: "Your Health, Our Priority",
    description: "Nigeria's fastest-growing pharmacy chain with over 50 locations. We offer excellent opportunities for pharmacists and pharmacy technicians across the country.",
    location: "Multiple Locations",
    type: "Pharmacy Chain",
    employees: "300+",
    openPositions: 15,
    rating: 4.4,
    verified: true,
    featured: false,
    benefits: ["Stock Options", "Health Benefits", "Career Advancement"],
  },
  {
    id: 4,
    organizationName: "HealthFirst Diagnostics",
    logo: null,
    tagline: "Precision in Every Test",
    description: "Leading diagnostic laboratory seeking skilled lab scientists and technicians. Join us in our mission to provide accurate and timely diagnostic services.",
    location: "Port Harcourt, Nigeria",
    type: "Laboratory",
    employees: "100+",
    openPositions: 5,
    rating: 4.5,
    verified: true,
    featured: false,
    benefits: ["Modern Equipment", "Research Opportunities", "Competitive Pay"],
  },
  {
    id: 5,
    organizationName: "MediCare Nursing Home",
    logo: null,
    tagline: "Compassionate Care for Every Patient",
    description: "Specialized nursing home providing long-term care services. We're looking for dedicated nurses and caregivers who share our commitment to patient wellbeing.",
    location: "Ibadan, Nigeria",
    type: "Nursing Home",
    employees: "75+",
    openPositions: 6,
    rating: 4.3,
    verified: false,
    featured: false,
    benefits: ["Supportive Environment", "Training", "Work-Life Balance"],
  },
];

const Ads = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-secondary via-background to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Building2 className="w-3 h-3 mr-1" />
              Featured Organizations
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Top Healthcare Employers
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore leading healthcare organizations actively hiring talented professionals like you. Find your ideal workplace today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/jobs">Browse Open Positions</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/employer-dashboard">Advertise Your Organization</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Organizations</h2>
              <p className="text-muted-foreground">Premium partners actively recruiting</p>
            </div>
            <Badge variant="premium">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {advertisements.filter(ad => ad.featured).map((ad) => (
              <div
                key={ad.id}
                className="bg-card rounded-2xl shadow-soft border-2 border-primary/20 p-6 card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                
                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-foreground">{ad.organizationName}</h3>
                        {ad.verified && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                      </div>
                      <p className="text-primary font-medium">{ad.tagline}</p>
                    </div>
                    <Badge variant="premium" className="flex-shrink-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">{ad.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {ad.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ad.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {ad.employees} employees
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-4 h-4" />
                      {ad.openPositions} open positions
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning" />
                      {ad.rating} rating
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" asChild>
                      <Link to="/jobs">View Open Positions</Link>
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Ads */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">All Organizations</h2>
            <p className="text-muted-foreground">Explore all healthcare organizations on our platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.filter(ad => !ad.featured).map((ad) => (
              <div
                key={ad.id}
                className="bg-card rounded-2xl shadow-soft p-6 card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground truncate">{ad.organizationName}</h3>
                      {ad.verified && (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-primary">{ad.type}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ad.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {ad.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    {ad.openPositions} jobs
                  </span>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <Link to="/jobs">View Positions</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Want to Advertise Your Organization?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Reach thousands of qualified healthcare professionals. Boost your visibility and attract top talent with our advertising solutions.
          </p>
          <Button size="lg" asChild>
            <Link to="/employer-dashboard">
              Start Advertising
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ads;
