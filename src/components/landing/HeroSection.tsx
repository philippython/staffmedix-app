import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Building2, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container relative py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <Badge variant="secondary" className="px-4 py-2">
              <ShieldCheck className="h-4 w-4 mr-2" />
              100% Credential Verified Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Hire Verified Nigerian Healthcare Professionals{" "}
              <span className="text-primary">With Confidence</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              StaffMedix ensures every healthcare worker is credentialed and verified 
              before appearing on the platform. Safe hiring, guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" asChild>
                <Link to="/jobs">
                  Hire Talent
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="hero" asChild>
                <Link to="/worker-signup">Create Worker Profile</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">10,000+</p>
                  <p className="text-sm text-muted-foreground">Verified Workers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Healthcare Facilities</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Verified Profiles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              {/* Decorative Cards */}
              <div className="absolute top-0 right-0 w-72 h-48 bg-card rounded-2xl shadow-elevated p-6 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Dr. Adaeze O.</p>
                    <p className="text-sm text-muted-foreground">Registered Nurse</p>
                  </div>
                </div>
                <Badge variant="verified" className="mb-3">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Verified Professional
                </Badge>
                <div className="flex gap-2">
                  <div className="h-2 flex-1 rounded-full bg-success" />
                  <div className="h-2 flex-1 rounded-full bg-success" />
                  <div className="h-2 flex-1 rounded-full bg-success" />
                </div>
              </div>

              <div className="absolute top-32 left-0 w-64 h-40 bg-card rounded-2xl shadow-elevated p-6 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-foreground text-sm">Lagos General Hospital</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Hiring: ICU Nurses, Pharmacists</p>
                <Badge variant="verified" className="text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Verified Employer
                </Badge>
              </div>

              <div className="absolute bottom-0 right-12 w-56 h-32 bg-primary rounded-2xl shadow-glow p-5 animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-primary-foreground font-semibold mb-2">Quick Match</p>
                <p className="text-primary-foreground/80 text-sm">Find the perfect candidate in under 48 hours</p>
              </div>
            </div>

            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/5 to-accent/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
