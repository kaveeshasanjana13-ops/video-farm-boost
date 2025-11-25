import { useState } from "react";
import { Button } from "@/components/ui/button";
import surakshaCardNFC from "@/assets/suraksha-nfc-student-id.jpg";
import surakshaCardRFID from "@/assets/suraksha-rfid-card.png";
import surakshaCardQR from "@/assets/suraksha-card-design.jpg";
const SmartNFCSection = () => {
  // Enhanced 3D card interaction without auto-rotation
  const [currentCard, setCurrentCard] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardTypes = [{
    id: 'nfc',
    name: 'Smart NFC ID',
    subtitle: 'First Time in Sri Lanka',
    image: surakshaCardNFC,
    description: 'Revolutionizing student identification with cutting-edge NFC technology. Our Smart NFC ID cards provide seamless access to campus facilities, digital payments, and instant information sharing.',
    features: [{
      icon: 'blue',
      text: 'Custom Student Webpage'
    }, {
      icon: 'green',
      text: 'Contactless Access'
    }, {
      icon: 'purple',
      text: 'Digital Payments'
    }, {
      icon: 'orange',
      text: 'Instant Information'
    }],
    highlight: 'Free Custom Webpages: Every student gets their own personalized webpage linked to their NFC card, showcasing their academic journey, projects, and achievements - completely free of charge.'
  }, {
    id: 'rfid',
    name: 'RFID Card System',
    subtitle: 'Enhanced Security & Access',
    image: surakshaCardRFID,
    description: 'Advanced RFID technology for secure campus access and attendance tracking. Our RFID cards offer reliable, long-range identification with enhanced security features.',
    features: [{
      icon: 'blue',
      text: 'Long-Range Detection'
    }, {
      icon: 'green',
      text: 'Enhanced Security'
    }, {
      icon: 'purple',
      text: 'Attendance Tracking'
    }, {
      icon: 'orange',
      text: 'Access Control'
    }],
    highlight: 'Enhanced Security: RFID cards provide secure access control with encrypted data transmission and tamper-resistant technology for maximum campus security.'
  }, {
    id: 'qr',
    name: 'QR/Barcode Card',
    subtitle: 'Universal Compatibility',
    image: surakshaCardQR,
    description: 'Traditional yet effective QR code and barcode technology for universal device compatibility. Perfect for institutions requiring simple, cost-effective identification solutions.',
    features: [{
      icon: 'blue',
      text: 'Universal Scanning'
    }, {
      icon: 'green',
      text: 'Cost Effective'
    }, {
      icon: 'purple',
      text: 'Easy Integration'
    }, {
      icon: 'orange',
      text: 'Backup Solution'
    }],
    highlight: 'Universal Compatibility: QR codes work with any smartphone or tablet, ensuring maximum accessibility and compatibility across all devices and platforms.'
  }];
  const currentCardData = cardTypes[currentCard];
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRotating || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = (e.clientX - centerX) / rect.width * 45;
    const rotateX = (centerY - e.clientY) / rect.height * 45;
    setRotationY(rotateY);
    setRotationX(rotateX);
  };
  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsRotating(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsRotating(false);
      setRotationY(0);
      setRotationX(0);
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setIsRotating(true);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = (touch.clientX - centerX) / rect.width * 45;
    const rotateX = (centerY - touch.clientY) / rect.height * 45;
    setRotationY(rotateY);
    setRotationX(rotateX);
  };
  const handleTouchStart = () => {
    setIsDragging(true);
    setIsRotating(true);
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    setRotationY(0);
    setRotationX(0);
  };
  return <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        {/* Card Selection Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1 gap-1 shadow-lg">
            {cardTypes.map((card, index) => <button key={card.id} onClick={() => setCurrentCard(index)} className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${currentCard === index ? 'bg-white text-blue-600 shadow-lg transform scale-105' : 'text-blue-600 hover:bg-white/10 hover:scale-105'}`}>
                {card.id.toUpperCase()}
              </button>)}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* 3D Card Section - Left Side */}
          <div className="flex justify-center order-1 lg:order-1">
            <div className="perspective-1000 cursor-grab group select-none" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{
            perspective: '1000px'
          }}>
              <div className="w-80 h-48 md:w-96 md:h-60 lg:w-[420px] lg:h-[260px] shadow-2xl transition-all duration-300 ease-out rounded-2xl overflow-hidden group-hover:shadow-3xl group-active:cursor-grabbing" style={{
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
              transitionDuration: isDragging ? '0ms' : '300ms'
            }}>
                <div className="relative w-full h-full">
                  <img src={currentCardData.image} alt={`Suraksha LMS ${currentCardData.name}`} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Drag or hover to rotate the card in 3D space
              </p>
            </div>
          </div>

          {/* Content Section - Right Side */}
          <div className="space-y-8 order-2 lg:order-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentCardData.name}
                </h2>
                
              </div>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  {currentCardData.description}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentCardData.features.map((feature, index) => <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <div className={`w-3 h-3 rounded-full bg-${feature.icon}-500`}></div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>)}
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-blue-700 dark:text-blue-300">{currentCardData.name} Benefits:</strong> 
                    <span className="ml-2">{currentCardData.highlight}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default SmartNFCSection;