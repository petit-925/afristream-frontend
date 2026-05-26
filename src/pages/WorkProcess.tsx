import React from 'react';
import { Lightbulb, Code, CheckCircle, Rocket } from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WorkProcess: React.FC = () => {
  const steps: ProcessStep[] = [
    {
      id: 1,
      title: "Discovery",
      description: "We analyze your needs and create a comprehensive plan.",
      icon: <Lightbulb className="text-primary" size={32} />
    },
    {
      id: 2,
      title: "Development",
      description: "Our team brings your vision to life with precision.",
      icon: <Code className="text-primary" size={32} />
    },
    {
      id: 3,
      title: "Testing",
      description: "Rigorous testing ensures everything works perfectly.",
      icon: <CheckCircle className="text-primary" size={32} />
    },
    {
      id: 4,
      title: "Launch",
      description: "Your project goes live with our continued support.",
      icon: <Rocket className="text-primary" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-12">Our Work Process</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="bg-dark-800 p-6 rounded-lg text-center">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkProcess;