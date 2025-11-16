
import React from 'react';

const ScrollingBrands = () => {
  const brands = [
    {
      name: "Brand Logo",
      logo: "/lovable-uploads/d88109e2-80ae-43d5-8fd6-4b756e9804c8.png",
      width: 140,
      height: 48
    },
    {
      name: "CeraVe",
      logo: "/lovable-uploads/a2cfae83-fa74-43ec-a0d4-b459333f2856.png",
      width: 140,
      height: 48
    },
    {
      name: "Samsung",
      logo: "/lovable-uploads/0a14a433-e221-40b5-be64-a161c992abd0.png",
      width: 140,
      height: 48
    },
    {
      name: "Brüler",
      logo: "/lovable-uploads/55f05279-384e-4530-802f-06a4da1cbbec.png",
      width: 140,
      height: 48
    },
    {
      name: "Finmap",
      logo: "/lovable-uploads/a2a2d847-115a-4fd7-a165-218eed8cec5d.png",
      width: 140,
      height: 48
    },
    {
      name: "Vamberg",
      logo: "/lovable-uploads/ee7afda4-e453-4149-bb4a-cbc6c4312319.png",
      width: 140,
      height: 48
    },
    {
      name: "Phonon",
      logo: "/lovable-uploads/71379525-0bff-4e87-ac47-0ece428931c2.png",
      width: 140,
      height: 48
    },
    {
      name: "Herbalife Nutrition",
      logo: "/lovable-uploads/05a729a7-8c8c-45d3-ae52-e3893d82f1f6.png",
      width: 140,
      height: 48
    },
    {
      name: "EAMER",
      logo: "/lovable-uploads/08b0d9bd-6970-493e-9dcb-d13634376569.png",
      width: 140,
      height: 48
    },
    {
      name: "Siberian Wellness",
      logo: "/lovable-uploads/858b4fb4-1fd4-4a75-878f-5724416e6c66.png",
      width: 140,
      height: 48
    },
    {
      name: "Bosch",
      logo: "/lovable-uploads/6224ec25-cc9d-4c83-a164-7e6c05ed103c.png",
      width: 140,
      height: 48
    },
    {
      name: "Tesvor",
      logo: "/lovable-uploads/17ebb6f5-05ec-43c8-be24-1a06d4980ec5.png",
      width: 140,
      height: 48
    },
    {
      name: "21vek.by",
      logo: "/lovable-uploads/f24235f8-6f3e-4329-8b6c-e775bb788ec2.png",
      width: 140,
      height: 48
    },
    {
      name: "CeraVe",
      logo: "/lovable-uploads/a85eb287-4373-400e-a759-0c66fec88eb1.png",
      width: 140,
      height: 48
    },
    {
      name: "Good",
      logo: "/lovable-uploads/59f89eff-08a0-4ee4-9f7a-0baf509ccc95.png",
      width: 60,
      height: 48
    }
  ];

  return (
    <div className="w-full overflow-hidden bg-transparent py-8" style={{ contain: 'layout style' }}>
      <div className="relative min-h-[80px]">
        {/* Fade overlay on left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
        
        {/* Fade overlay on right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        {/* Scrolling container */}
        <div className="flex animate-scroll hover:pause-animation" style={{ willChange: 'transform' }}>
          {/* First set of logos */}
          <div className="flex items-center space-x-20 pl-12 pr-10">
            {brands.map((brand, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-[140px] flex justify-center">
                <div className="bg-white/50 dark:bg-white/60 px-4 py-2 rounded-lg">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    width={brand.width}
                    height={brand.height}
                    className="h-12 w-auto max-w-[140px] saturate-150 brightness-110 hover:saturate-200 hover:brightness-125 transition-all duration-300 object-contain" 
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Second set of logos for seamless loop */}
          <div className="flex items-center space-x-20 pl-10 pr-12">
            {brands.map((brand, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 w-[140px] flex justify-center">
                <div className="bg-white/50 dark:bg-white/60 px-4 py-2 rounded-lg">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    width={brand.width}
                    height={brand.height}
                    className="h-12 w-auto max-w-[140px] object-contain saturate-150 brightness-110 hover:saturate-200 hover:brightness-125 transition-all duration-300" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingBrands;
