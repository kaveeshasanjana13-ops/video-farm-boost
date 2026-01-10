import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Kapila Sugath" className="w-8 h-8 object-contain" />
          <span className="text-sm text-muted-foreground font-body">
            © {new Date().getFullYear()} Kapila Sugath. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary font-body transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary font-body transition-colors"
          >
            Terms
          </a>
        </div>

        <div className="text-sm text-muted-foreground font-body">
          Crafted with passion
        </div>
      </div>
    </footer>
  );
};

export default Footer;
