const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Suraksha<span className="text-blue-300">LMS</span>
              </h3>
              <p className="text-blue-100 text-lg font-medium mb-2">
                One LMS. One Nation. One Future
              </p>
              <p className="text-blue-200 text-sm mb-1">
                SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD
              </p>
              <p className="text-blue-200 text-xs mb-1">
                Reg. No: PV 00342747
              </p>
              <p className="text-blue-200 text-xs mb-1">
                188/79 The Finans Waththa, Wilimbula, Henegama
              </p>
              <p className="text-blue-200 text-xs font-medium">
                📞 +94 70 330 0524
              </p>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Empowering education across Sri Lanka with our comprehensive Learning Management System. 
              Join thousands of students, teachers, and institutions in building a brighter future together.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="font-bold text-2xl text-white">430</div>
                <div className="text-blue-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-white">30</div>
                <div className="text-blue-200 text-sm">Teachers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-white">6</div>
                <div className="text-blue-200 text-sm">Institutes</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Student Login</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Teacher Portal</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Institute Access</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Course Catalog</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-blue-100 hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="/refund" className="text-blue-100 hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm">
            © 2025 SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD. All rights reserved.<br />
            PV 00342747 | Empowering Sri Lankan Education
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-blue-100 text-sm">🇱🇰 Proudly Sri Lankan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;