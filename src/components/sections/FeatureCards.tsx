import React, { useState, useEffect } from 'react';
import { Lightbulb, Users, CheckCircle } from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted: boolean;
}

const FeatureCards: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mock data loading
    const mockFeatures: Feature[] = [
      {
        id: 1,
        icon: <Lightbulb size={32} className="text-primary" />,
        title: "Tailor-made Strategies",
        description: "Customized digital solutions designed to meet your specific business requirements and objectives.",
        highlighted: false,
      },
      {
        id: 2,
        icon: <Users size={32} className="text-primary" />,
        title: "Experienced Team",
        description: "Industry experts with proven track record of delivering exceptional digital experiences.",
        highlighted: true,
      },
      {
        id: 3,
        icon: <CheckCircle size={32} className="text-primary" />,
        title: "Quality Assurance",
        description: "Rigorous testing and quality control to ensure flawless implementation of every project.",
        highlighted: false,
      },
    ];

    setFeatures(mockFeatures);
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-20 bg-dark-900 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-700 to-dark-900 opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`relative bg-dark-800 p-8 rounded-lg transform transition-all duration-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${
                feature.highlighted
                  ? 'border-primary border-2 shadow-glow'
                  : 'border-dark-600 border'
              }`}
              style={{ 
                transitionDelay: `${feature.id * 150}ms`,
                boxShadow: feature.highlighted ? '0 0 15px rgba(255, 61, 61, 0.3)' : 'none'
              }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;