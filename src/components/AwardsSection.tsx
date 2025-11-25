const AwardsSection = () => {
  const awards = [{
    platform: "Capterra",
    award: "SHORTLIST",
    year: "2021"
  }, {
    platform: "GetApp",
    award: "CATEGORY LEADERS",
    year: "2020"
  }, {
    platform: "SourceForge",
    award: "LEADER",
    year: "2022"
  }, {
    platform: "G2",
    award: "AMONG TOP 100",
    year: "2019"
  }, {
    platform: "Slashdot",
    award: "LEADER",
    year: "2022"
  }];
  return <div className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-sky-50/30 to-white relative overflow-hidden">
      {/* Floating Particles Background matching homepage */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
        transform: `scale(${0.5 + Math.random() * 1.5})`
      }} />)}
      </div>

      {/* Geometric Background Elements matching homepage */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 border border-blue-400/50 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 border border-blue-400/40 rounded-full animate-bounce" style={{
        animationDuration: '3s'
      }}></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 border-2 border-blue-500/50 rounded-full animate-ping" style={{
        animationDuration: '4s'
      }}></div>
        <div className="absolute bottom-10 left-20 w-14 h-6 border border-blue-400/40 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Join Millions of Users to
            <br />
            Save Time and Succeed!
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-7xl mx-auto">
          {awards.map((award, index) => <div key={index} className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105">
              {/* Certificate Badge Image */}
              <div className="relative">
                <img src="/assets/awards/award-badge.png" alt={`${award.platform} ${award.award} ${award.year}`} className="w-32 h-32 md:w-40 md:h-40 object-contain" />
                
                {/* Overlay Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center rounded-3xl bg-white/0">
                  {/* Award Type Badge */}
                  
                  
                  {/* Platform Name */}
                  
                  
                  {/* Year */}
                  
                </div>

                {/* Decorative dots at bottom */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-800 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default AwardsSection;