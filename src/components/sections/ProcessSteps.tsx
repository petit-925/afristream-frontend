import React, { useState, useEffect } from 'react';
import { Search, LightbulbIcon, Cog, Rocket } from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessSteps: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock data
    const mockSteps: ProcessStep[] = [
      {
        id: 1,
        title: 'Discovery',
        description: 'We learn about your business goals and challenges.',
        icon: <Search className="text-primary\" size={28} />,
      },
      {
        id: 2,
        title: 'Strategy',
        description: 'We develop a roadmap for your digital transformation.',
        icon: <LightbulbIcon className="text-primary" size={28} />,
      },
      {
        id: 3,
        title: 'Execution',
        description: 'Our team brings the strategy to life with precision.',
        icon: <Cog className="text-primary\" size={28} />,
      },
      {
        id: 4,
        title: 'Launch',
        description: 'We deploy your solution and ensure smooth operation.',
        icon: <Rocket className="text-primary" size={28} />,
      },
    ];

    setSteps(mockSteps);

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

    const section = document.getElementById('process-steps');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="process-steps" className="py-20 bg-dark-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3629227/pexels-photo-3629227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-dark-800 to-dark-800"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Method to the creativity
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Our proven process ensures we deliver exceptional results every time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-dark-700 border border-dark-600 p-8 rounded-lg relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="absolute -top-4 -right-4 bg-dark-800 rounded-full w-12 h-12 flex items-center justify-center border-2 border-primary">
                <span className="text-lg font-bold">{step.id}</span>
              </div>
              
              <div className="mb-6">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;