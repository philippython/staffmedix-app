import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Basic",
    description: "Perfect for small clinics getting started",
    price: "₦25,000",
    period: "/month",
    popular: false,
    features: [
      { name: "3 active job posts", included: true },
      { name: "View verified candidates", included: true },
      { name: "Basic applicant tracking", included: true },
      { name: "Email support", included: true },
      { name: "Priority listing", included: false },
      { name: "Featured employer badge", included: false },
      { name: "Analytics dashboard", included: false },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Standard",
    description: "Best for growing healthcare facilities",
    price: "₦75,000",
    period: "/month",
    popular: true,
    features: [
      { name: "10 active job posts", included: true },
      { name: "View verified candidates", included: true },
      { name: "Advanced applicant tracking", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "Priority listing", included: true },
      { name: "Featured employer badge", included: true },
      { name: "Basic analytics dashboard", included: true },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For large hospitals and healthcare groups",
    price: "₦150,000",
    period: "/month",
    popular: false,
    features: [
      { name: "Unlimited job posts", included: true },
      { name: "View verified candidates", included: true },
      { name: "Advanced applicant tracking", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Priority listing", included: true },
      { name: "Featured employer badge", included: true },
      { name: "Full analytics dashboard", included: true },
      { name: "Dedicated account manager", included: true },
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 text-center">
          <div className="container">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start hiring verified healthcare professionals today. All plans include access 
              to our credential verification system.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 md:pb-28">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-card rounded-2xl shadow-soft p-8 ${
                    plan.popular
                      ? "ring-2 ring-primary shadow-glow"
                      : "border border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="px-4 py-1">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                            <X className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span
                          className={
                            feature.included ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Subscribe Now
                  </Button>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                All plans include a 14-day free trial. No credit card required to start.
              </p>
              <p className="text-sm text-muted-foreground">
                Need a custom plan for your organization?{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact our sales team
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ or Trust Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Trusted by Leading Healthcare Facilities
              </h2>
              <p className="text-muted-foreground mb-8">
                Over 500 hospitals, clinics, and healthcare organizations across Nigeria 
                trust StaffMedix for their recruitment needs.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-60">
                {["LUTH", "ABUTH", "UCH Ibadan", "FMC Abuja", "Evercare"].map((name) => (
                  <div
                    key={name}
                    className="px-6 py-3 bg-card rounded-lg border border-border"
                  >
                    <span className="font-semibold text-muted-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
