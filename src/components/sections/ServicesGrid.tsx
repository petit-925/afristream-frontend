import React, { useState, useEffect } from 'react';
import { MousePointer, TrendingUp, Image, Share2, Video, Smartphone } from 'lucide-react';

interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServicesGrid: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock data loading
    const mockServices: Service[] = [
      {
        id: 1,
        icon: <MousePointer size={28} className="text-primary" />,
        title: "Website Design",
        description: "Modern, responsive websites that convert visitors into customers and elevate your brand.",
      },
      {
        id: 2,
        icon: <Video size={28} className="text-primary" />,
        title: "Streaming",
        description: "Showcase your creative process and present projects live with clarity and seamless delivery.",
      },
      {
        id: 3,
        icon: <Smartphone size={28} className="text-primary" />,
        title: "Mobile App's",
        description: "Custom mobile apps built for performance, usability, and impact.",
      },
      {
        id: 4,
        icon: <Image size={28} className="text-primary" />,
        title: "Graphic Design",
        description: "Visual assets that tell your brand's story and make a lasting impression.",
      },
    ];

    setServices(mockServices);

    // Set up intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('services-grid');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services-grid" className="py-20 bg-dark-900 relative">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2">
            ELEVATE YOUR DIGITAL GAME
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Crafting digital solutions tailored to your unique business needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`bg-dark-800 border border-dark-600 hover:border-primary rounded-lg p-6 transition-all duration-500 group hover:-translate-y-2 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-dark-700 rounded-full h-16 w-16 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <a href="#" className="inline-block text-primary hover:text-primary-light font-medium transition-colors duration-200">
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;