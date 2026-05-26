import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Testimonials from '../components/sections/Testimonials';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface Benefit {
  id: number;
  text: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock data
    const mockServices: Service[] = [
      {
        id: 1,
        title: 'Live Streaming',
        description: 'We enable institutions to expand their reach by broadcasting events live on virtual platforms. This service ensures a seamless connection with audiences, regardless of their location.',
        image: 'https://images.pexels.com/photos/6883807/pexels-photo-6883807.jpeg',
        features: ['Multi-Platform Streaming', 'High-Quality Video & Audio', 'Multi-Camera Setup', 'On-Site & Remote Streaming', 'Real-Time Audience Engagement Tools', 'Recording & Archiving', 'Private & Secure Streaming Options'],
      },
      {
        id: 2,
        title: 'Photography',
        description: 'Our expert team uses a data-driven approach and cutting-edge marketing techniques to boost your online presence.',
        image: 'https://images.pexels.com/photos/403495/pexels-photo-403495.jpeg',
        features: ['Authentic African Storytelling', 'Event Photography', 'Brand & Commercial Photography', 'Portrait & Lifestyle Sessions', 'Product Photography', 'Photo Editing & Retouching'],
      },
      {
        id: 3,
        title: 'Videography',
        description: 'We produce high-quality educational documentaries, promotional videos, and creative storytelling content tailored to the clients’ needs.',
        image: 'https://images.pexels.com/photos/3062553/pexels-photo-3062553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        features: ['Promotional Videos', 'Creative Storytelling Content', 'Professional Filming', 'Post-Production', 'Educational Documentaries', 'Delivery & Distribution'],
      },
      {
        id: 4,
        title: 'Graphic Design',
        description: 'We offer professional branding services, helping businesses represent their identity uniquely and attractively through creative design.',
        image: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        features: ['Custom Brand Identity Design', 'Logo Design & Refresh', 'Packaging & Label Design', 'Infographics & Visual Storytelling', 'Print & Digital Ad Design', 'Revisions & Feedback Integration'],
      },
      {
        id: 5,
        title: 'Picture Framing',
        description: 'Our picture framing services add a professional touch to photographs, artwork, and memorabilia, preserving them in style.',
        image: 'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        features: ['Custom Frame Design', 'High-Quality Materials', 'Ready-to-Hang Finishing', 'Pickup & Delivery Services', 'Digital Previews & Consultations', 'Rush & Standard Turnaround Options'],
      },
      {
        id: 6,
        title: 'Website Design',
        description: 'We specialize in creating attractive, user-friendly websites that turn visitors into devoted customers.',
        image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        features: ['Custom Website Design', 'User-friendly design', 'Integration with CMS', 'SEO best practices', 'Responsive Design (Mobile-Friendly)', 'Maintenance & Support Plans'],
      },
        {
        id: 7,
        title: 'Mentorship & Training',
        description: 'Our mentorship initiative is tailored for tertiary students, offering them hands-on media training. This program helps students develop employable skills and creates part-time job opportunities while they study.',
        image: 'https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        features: ['Hands-On Media Training', 'Industry-Relevant Skills Development', 'Part-Time Job Opportunities', 'Mentor-Led Learning', 'Networking Opportunities', 'Access to Equipment & Software'],
      },
      {
        id: 8,
        title: 'Drone Piloting Program',
        description: 'Our mentorship initiative is tailored for tertiary students, offering them hands-on media training. This program helps students develop employable skills and creates part-time job opportunities while they study.',
        image: 'https://images.pexels.com/photos/18660499/pexels-photo-18660499.jpeg',
        features: ['Hands-On Media Training', 'Industry-Relevant Skills Development', 'Part-Time Job Opportunities', 'Mentor-Led Learning', 'Networking Opportunities', 'Access to Equipment & Software'],
      },
    ];

    const mockBenefits: Benefit[] = [
      { id: 1, text: 'Our solutions are designed to streamline your operations, leading to higher productivity and lower costs.' },
      { id: 2, text: 'By delivering a sleek and modern digital presence, we help elevate your brand\'s image and reputation.' },
      { id: 3, text: 'Our services are tailored to your unique needs, ensuring you get the perfect fit for your business.' },
    ];

    setServices(mockServices);
    setBenefits(mockBenefits);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('services-page');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="services-page" className="min-h-screen bg-dark-900">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Services</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Intro Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Empower your business with innovative digital solutions.
              </h2>
              <p className="text-gray-400">
                Our commitment to quality and excellence is unparalleled. We work closely with our clients to understand their requirements and deliver solutions that exceed expectations. From the first brainstorming session to the final delivery, we ensure that every step of the process is executed perfectly.
              </p>
            </div>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-1 mt-1">
                    <Check size={16} className="text-white" />
                  </div>
                  <p className="text-gray-400">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden group hover:border-primary transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link 
                    to={`/services/${service.title.toLowerCase().replace(/\s+/g,'-')}`} 
                    className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
                  >
                    <span>Service Details</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                Let's turn your vision into a masterpiece.
              </h3>
              <p className="text-gray-100 mb-6">
                We understand that in the fast-paced world we're in, staying ahead of the curve is crucial. That's why we constantly reinvent how we work with innovative solutions that give them a competitive advantage.
              </p>
            </div>
            <div className="bg-dark-800 p-8 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2">
                    <Check size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Competitive Pricing</h4>
                    <p className="text-gray-400">Our high-quality services are affordable, giving you great value for money.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2">
                    <Check size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tailor-made Strategies</h4>
                    <p className="text-gray-400">We do not believe in one-size-fits-all. Our solutions are customized to your business needs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2">
                    <Check size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer-centric Focus</h4>
                    <p className="text-gray-400">We focus on client needs and create strategies that will help achieve their goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Utilize our powerful digital solutions to expand your company.
              </h2>
              <p className="text-gray-400 mb-8">
                We consistently exceed our clients' expectations by providing high quality digital solutions. Get in touch with us right now!
              </p>
              <div className="flex items-center gap-4 bg-dark-900 p-4 rounded-lg">
                <img
                  src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Contact"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <p className="text-gray-400">Talk to our experts</p>
                  <p className="text-xl font-semibold">+233 (243) 495-616</p>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Name"
                    className="bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <select className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  <option value="">Required Service</option>
                  <option value="web-design">Website Design</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="social-media">Social Media</option>
                  <option value="graphic-design">Graphic Design</option>
                </select>
                <textarea
                  placeholder="Project Details"
                  rows={4}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                ></textarea>
                <Button size="lg" fullWidth>Get Free Quote</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Services;