import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const ServicesHighlight: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('services-highlight');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services-highlight" className="py-20 bg-dark-800 relative">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative mb-2">
            Unleashing possibilities in the 
            <span className="text-primary"> digital world.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-gray-300 mb-6">
              Our team of experts combines creativity with technical expertise to deliver 
              cutting-edge digital solutions. We focus on creating memorable digital experiences 
              that drive engagement and conversions.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center mr-3 mt-1">
                  <span className="text-white text-xs">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Customer-centric Focus</h4>
                  <p className="text-gray-400">We prioritize your audience's needs in every project.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center mr-3 mt-1">
                  <span className="text-white text-xs">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Personalized Support</h4>
                  <p className="text-gray-400">Dedicated team ensuring your success at every step.</p>
                </div>
              </div>
            </div>
            
            <a href="#" className="inline-flex items-center text-primary hover:text-primary-light transition-colors">
              <span>Learn more</span>
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
          
          {/* Right Column - Hexagon Image */}
          <div className={`flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="hexagon">
                <div className="hexagon-inner">
                  <img 
                    src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Woman using VR headset" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <style>{`
                .hexagon {
                  position: relative;
                  width: 300px;
                  height: 260px;
                  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                  background: linear-gradient(45deg, #FF3D3D 0%, #FF6B6B 100%);
                  padding: 5px;
                }
                .hexagon-inner {
                  width: 100%;
                  height: 100%;
                  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                  overflow: hidden;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;