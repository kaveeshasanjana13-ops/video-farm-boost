import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'IMDb', href: '#', icon: Film },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
];

function Film({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
      <line x1="7" x2="7" y1="2" y2="22" />
      <line x1="17" x2="17" y1="2" y2="22" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="2" x2="7" y1="7" y2="7" />
      <line x1="2" x2="7" y1="17" y2="17" />
      <line x1="17" x2="22" y1="17" y2="17" />
      <line x1="17" x2="22" y1="7" y2="7" />
    </svg>
  );
}

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        '.contact-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animate form fields
      const formFields = formRef.current?.querySelectorAll('.form-field');
      if (formFields) {
        formFields.forEach((field, index) => {
          gsap.fromTo(
            field,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: formRef.current,
                start: 'top 80%',
              },
              delay: index * 0.1,
            }
          );
        });
      }

      // Animate social links
      gsap.fromTo(
        '.social-link',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12 lg:px-24 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <div className="contact-title">
            <span className="text-primary text-sm uppercase tracking-[0.3em] font-body mb-6 block">
              Get in Touch
            </span>
            <h2 className="text-section-title text-foreground mb-8">
              Let's Create<br />Something<br />
              <span className="text-primary">Together</span>
            </h2>

            <p className="text-lg text-muted-foreground font-body mb-12 max-w-md">
              Have a project in mind? I'm always open to discussing new
              opportunities and creative collaborations.
            </p>

            {/* Email */}
            <a
              href="mailto:hello@marcuschen.com"
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors group mb-12"
            >
              <Mail className="w-5 h-5" />
              <span className="text-lg font-body link-underline">
                hello@marcuschen.com
              </span>
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>

            {/* Social Links */}
            <div className="social-links flex gap-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="social-link group flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-sm font-body uppercase tracking-wider link-underline">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field">
              <label
                htmlFor="name"
                className="block text-sm uppercase tracking-wider text-muted-foreground font-body mb-3"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-border focus:border-primary py-3 text-foreground font-body placeholder:text-muted-foreground/50 outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-field">
              <label
                htmlFor="email"
                className="block text-sm uppercase tracking-wider text-muted-foreground font-body mb-3"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-border focus:border-primary py-3 text-foreground font-body placeholder:text-muted-foreground/50 outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-field">
              <label
                htmlFor="message"
                className="block text-sm uppercase tracking-wider text-muted-foreground font-body mb-3"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border-b-2 border-border focus:border-primary py-3 text-foreground font-body placeholder:text-muted-foreground/50 outline-none transition-colors resize-none"
                placeholder="Tell me about your project..."
                required
              />
            </div>

            <div className="form-field pt-6">
              <button
                type="submit"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-sm overflow-hidden transition-all hover:pr-12"
              >
                <span>Send Message</span>
                <ArrowUpRight className="w-4 h-4 absolute right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
