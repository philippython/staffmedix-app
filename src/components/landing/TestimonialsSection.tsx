import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Chioma Nwankwo",
    role: "Medical Director",
    facility: "Lagos University Teaching Hospital",
    quote: "StaffMedix has transformed our hiring process. Every nurse and doctor we've hired through the platform came with verified credentials, saving us weeks of background checks.",
    rating: 5,
  },
  {
    name: "Ngozi Adeleke",
    role: "Registered Nurse",
    facility: "Verified Professional",
    quote: "As a healthcare worker, having my credentials verified by StaffMedix opened doors to better opportunities. Employers trust my profile because they know it's been thoroughly vetted.",
    rating: 5,
  },
  {
    name: "Dr. Emeka Okonkwo",
    role: "HR Manager",
    facility: "First Consultants Medical Centre",
    quote: "The quality of candidates on StaffMedix is exceptional. We've reduced our time-to-hire by 60% and significantly improved our staff retention rates.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Healthcare Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from the employers and professionals who use StaffMedix every day
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative bg-card rounded-2xl p-8 shadow-soft card-hover"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 right-8">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-warning text-warning"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.facility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
