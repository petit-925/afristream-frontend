import React, { useState, useEffect } from 'react';

const ExperienceSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    years: 0,
    clients: 0,
  });

  useEffect(() => {
    // Set up intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          
          // Animate the numbers
          let years = 0;
          let clients = 0;
          const targetYears = 12;
          const targetClients = 500;
          const duration = 2000; // 2 seconds
          const interval = 20; // 20ms
          const stepsYears = Math.ceil((targetYears * interval) / duration);
          const stepsClients = Math.ceil((targetClients * interval) / duration);
          
          const timer = setInterval(() => {
            years = Math.min(years + stepsYears, targetYears);
            clients = Math.min(clients + stepsClients, targetClients);
            
            setStats({ years, clients });
            
            if (years >= targetYears && clients >= targetClients) {
              clearInterval(timer);
            }
          }, interval);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('experience-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience-section" className="py-20 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/90 to-dark-900/80"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Red Box */}
          <div className={`bg-primary p-8 md:p-12 rounded-lg transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Your partner in digital transformation
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <span>Strategic digital planning and execution</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <span>Ongoing support and maintenance</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <span>Customized solutions for unique challenges</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <span>Industry-leading expertise and innovation</span>
              </li>
            </ul>
          </div>
          
          {/* Right Column - Stats */}
          <div className={`flex items-center justify-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="text-center md:text-left">
              <div className="mb-8">
                <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                  {stats.years}+
                </div>
                <p className="text-gray-400">Years of Experience</p>
              </div>
              
              <div>
                <div className="text-5xl md:text-7xl font-bold text-primary mb-2">
                  {stats.clients}+
                </div>
                <p className="text-gray-400">Satisfied Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;