import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, UserPlus } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Healthcare Hiring?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of healthcare facilities and professionals already using StaffMedix
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* For Employers */}
          <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              For Employers
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Post jobs and hire from our pool of pre-verified healthcare professionals. 
              Reduce hiring risks and save time.
            </p>
            <Button size="lg" variant="hero" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link to="/employer-dashboard">
                Start Hiring
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* For Workers */}
          <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-6">
              <UserPlus className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              For Healthcare Workers
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Get your credentials verified and unlock access to top healthcare 
              facilities across Nigeria.
            </p>
            <Button size="lg" variant="hero" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link to="/worker-signup">
                Create Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
