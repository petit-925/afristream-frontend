import React, { useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  logoUrl: string;
}

const ClientLogos: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock client data
    const mockClients: Client[] = [
      {
        id: 1,
        name: "Eastin",
        logoUrl: "https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 2,
        name: "Richy Group",
        logoUrl: "https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 3,
        name: "Nera Technologies",
        logoUrl: "https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 4,
        name: "Meridian Services",
        logoUrl: "https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 5,
        name: "Aspect Solutions",
        logoUrl: "https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
    ];

    setClients(mockClients);

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

    const section = document.getElementById('client-logos');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="client-logos" className="py-16 bg-dark-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-400 uppercase tracking-wider text-sm font-medium">
            Trusted by Industry Leaders
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center">
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`px-8 py-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-white text-xl font-bold opacity-70 hover:opacity-100 transition-opacity duration-300">
                {client.name === 'Eastin' && (
                  <span className="text-white opacity-70 tracking-wide">
                    <span className="text-primary">E</span>ASTIN
                  </span>
                )}
                {client.name === 'Richy Group' && (
                  <span className="text-white opacity-70 tracking-wide">
                    RICHY <span className="text-primary">GROUP</span>
                  </span>
                )}
                {client.name === 'Nera Technologies' && (
                  <span className="text-white opacity-70 tracking-wide">
                    <span className="text-primary">NERA</span> TECH
                  </span>
                )}
                {client.name === 'Meridian Services' && (
                  <span className="text-white opacity-70 tracking-wide">
                    MERIDIAN
                  </span>
                )}
                {client.name === 'Aspect Solutions' && (
                  <span className="text-white opacity-70 tracking-wide">
                    ASPECT <span className="text-primary">•</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;