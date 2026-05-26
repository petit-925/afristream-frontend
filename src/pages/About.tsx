import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Testimonials from '../components/sections/Testimonials';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
}

const About: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock data
    const mockTeamMembers: TeamMember[] = [
      {
        id: 1,
        name: "Stephen Adu-Twum",
        position: "CEO/ Senior Graphics Designer",
        image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 2,
        name: "Michael Chen",
        position: "Technical Lead",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 3,
        name: "David Wilson",
        position: "Marketing Strategist",
        image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 4,
        name: "Emma Davis",
        position: "UX Designer",
        image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 5,
        name: "James Taylor",
        position: "Project Manager",
        image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 6,
        name: "Lisa Anderson",
        position: "Content Strategist",
        image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 7,
        name: "Robert Martinez",
        position: "Development Lead",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 8,
        name: "Emily Wang",
        position: "Digital Strategist",
        image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ];

    setTeamMembers(mockTeamMembers);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about-page');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="about-page" className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/80 to-dark-900"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Team meeting"
                className="rounded-lg shadow-lg"
              />
            </div>
            {/* About Us */}
            <div>
              <h2 className="text-8xl font-bold mb-7">
              <span className="text-primary">Afri</span>stream
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <p className="text-gray-400 text-lg"> Positioned as a leader in providing innovative media services in Ghana. Since its inception, the company has built a reputation for excellence and reliability, working with diverse clients across multiple sectors. We prioritize quality, collaboration, innovation, and sustainability in all aspects of our operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-dark-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-400">
                  To build a vibrant and inclusive media ecosystem that highlights African talent, trains tertiary students in media skills, and fosters global appreciation for African culture.
                </p>
              </div>
              <div className="bg-dark-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-400">
                 To become the premier platform for African entertainment, empowering creators and youth while contributing to the global recognition of African creativity.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg"
                alt="Team collaboration"
                className="rounded-lg"
              />
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Office environment"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-dark-800 rounded-lg overflow-hidden group hover:bg-dark-700 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-gray-400">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <Testimonials />
    </div>
  );
};

export default About;