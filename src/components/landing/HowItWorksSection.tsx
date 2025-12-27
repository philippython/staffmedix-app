import { Upload, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Credentials",
    description: "Healthcare workers submit their licenses, certifications, and professional documents through our secure portal.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "StaffMedix Verifies",
    description: "Our team validates every credential with issuing councils and regulatory bodies across Nigeria.",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Employers Hire Safely",
    description: "Access a pool of pre-verified healthcare professionals, ready to join your facility with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, secure process to connect verified healthcare professionals with trusted employers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-border">
            <div className="absolute left-1/4 -translate-x-1/2 -top-1 w-3 h-3 rounded-full bg-primary" />
            <div className="absolute right-1/4 translate-x-1/2 -top-1 w-3 h-3 rounded-full bg-primary" />
          </div>

          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft card-hover text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full">
                  <span className="text-sm font-bold text-primary-foreground">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 mt-4 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Arrow between cards (mobile) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
