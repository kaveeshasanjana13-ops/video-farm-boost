const AboutHero = () => {
  return <section className="pt-24 pb-20 cinematic-section overflow-hidden relative">
      {/* Premium background decoration */}
      <div className="absolute inset-0 cinematic-grain opacity-20"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl cinematic-flare"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl cinematic-flare" style={{
      animationDelay: '2s'
    }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="cinematic-gradient-text block cinematic-text-shadow">
                Videos That Convert Viewers Into Revenue
              </span>
            </h1>
            
            
          </div>
        </div>
      </div>
    </section>;
};
export default AboutHero;