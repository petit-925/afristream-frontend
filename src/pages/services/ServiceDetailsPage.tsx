import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Play, Users, TrendingUp, Shield, Zap, Phone, Mail
} from 'lucide-react';
import Testimonials from '../../components/sections/Testimonials';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: 'Live Streaming',
    description:
      'We enable institutions to expand their reach by broadcasting events live on virtual platforms. This service ensures a seamless connection with audiences, regardless of their location.',
    image: 'https://images.pexels.com/photos/6883807/pexels-photo-6883807.jpeg',
    features: ['Multi-Platform Streaming', 'High-Quality Video & Audio', 'Multi-Camera Setup', 'On-Site & Remote Streaming', 'Real-Time Audience Engagement Tools', 'Recording & Archiving', 'Private & Secure Streaming Options'],
  },
  {
    id: 2,
    title: 'Photography',
    description:
      'Our expert team uses a data-driven approach and cutting-edge marketing techniques to boost your online presence.',
    image: 'https://images.pexels.com/photos/403495/pexels-photo-403495.jpeg',
    features: ['Authentic African Storytelling', 'Event Photography', 'Brand & Commercial Photography', 'Portrait & Lifestyle Sessions', 'Product Photography', 'Photo Editing & Retouching'],
  },
  {
    id: 3,
    title: 'Videography',
    description:
      'We produce high-quality educational documentaries, promotional videos, and creative storytelling content tailored to the clients’ needs.',
    image:
      'https://images.pexels.com/photos/3062553/pexels-photo-3062553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Promotional Videos', 'Creative Storytelling Content', 'Professional Filming', 'Post-Production', 'Educational Documentaries', 'Delivery & Distribution'],
  },
  {
    id: 4,
    title: 'Graphic Design',
    description:
      'We offer professional branding services, helping businesses represent their identity uniquely and attractively through creative design.',
    image:
      'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Custom Brand Identity Design', 'Logo Design & Refresh', 'Packaging & Label Design', 'Infographics & Visual Storytelling', 'Print & Digital Ad Design', 'Revisions & Feedback Integration'],
  },
  {
    id: 5,
    title: 'Picture Framing',
    description:
      'Our picture framing services add a professional touch to photographs, artwork, and memorabilia, preserving them in style.',
    image:
      'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Custom Frame Design', 'High-Quality Materials', 'Ready-to-Hang Finishing', 'Pickup & Delivery Services', 'Digital Previews & Consultations', 'Rush & Standard Turnaround Options'],
  },
  {
    id: 6,
    title: 'Website Design',
    description:
      'We specialize in creating attractive, user-friendly websites that turn visitors into devoted customers.',
    image:
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Custom Website Design', 'User-friendly design', 'Integration with CMS', 'SEO best practices', 'Responsive Design (Mobile-Friendly)', 'Maintenance & Support Plans'],
  },
  {
    id: 7,
    title: 'Mentorship & Training',
    description:
      'We offer mentorship and hands-on training to help individuals and teams build media and design skills.',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    features: ['One-on-One Mentorship', 'Group Workshops', 'Industry Insights', 'Project-Based Learning', 'Certification Support', 'Ongoing Support'],
  },
];

const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export default function ServiceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => toSlug(s.title) === slug);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', website: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!service) {
  return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-white">
        <h1 className="text-3xl font-bold mb-4">Service not found</h1>
        <p className="text-gray-400 mb-6">The requested service could not be found.</p>
        <Link to="/services" className="text-primary">Back to Services</Link>
      </main>
    );
  }

  return (
    <main className="text-white">
      {/* Hero with background and quote form sidebar */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-dark-900">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/90 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Main title/content */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="text-primary font-semibold tracking-wide">Service</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{service.title}</h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
                {service.description}
              </p>
              <Link to="/contact" className="inline-flex items-center bg-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">
                GET FREE QUOTE
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

            {/* Quote form card */}
            <div className="bg-dark-800/80 backdrop-blur p-6 rounded-2xl border border-dark-600">
              <h3 className="text-lg font-bold mb-4 text-center">GET FREE QUOTE</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:border-primary" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:border-primary" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:border-primary" />
                <input name="website" value={formData.website} onChange={handleChange} placeholder="Project Details / Website" className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:border-primary" />
                <button type="submit" className="w-full bg-primary text-black py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">GET QUOTE</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About + Feature cards with icons and right column media/services list */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our {service.title.toLowerCase()} prioritizes user experience and lead conversion.</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">{service.description}</p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <TrendingUp size={22} />, title: 'Responsive Design', text: 'Looks great on all devices and screen sizes.' },
                  { icon: <Zap size={22} />, title: 'SEO-Optimized', text: 'Built with best practices for discoverability.' },
                  { icon: <Shield size={22} />, title: 'Fast Loading', text: 'Optimized assets and delivery for speed.' },
                  { icon: <Users size={22} />, title: 'Security Measures', text: 'Hardened configuration and regular updates.' },
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary">{item.icon}</div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.text}</p>
                  </div>
                ))}
                </div>
                  </div>

            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-dark-700">
                <img src={service.image} alt={service.title} className="w-full h-72 object-cover" />
                <button className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary/90 text-black flex items-center justify-center">
                  <Play size={22} />
                </button>
                </div>

              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
                <h4 className="text-sm font-bold tracking-wide text-gray-300 mb-4">OUR SERVICES</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {services.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-b-0">
                      <span>{s.title}</span>
                      <Link to={`/services/${toSlug(s.title)}`} className="text-primary text-xs">View</Link>
                    </li>
                  ))}
                </ul>
                  </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Phone size={18} />
                </div>
                    <div>
                      <p className="text-xs text-gray-400">PHONE NUMBER</p>
                      <p className="font-semibold">+233 456 7890</p>
                </div>
              </div>
            </div>
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Mail size={18} />
                  </div>
                    <div>
                      <p className="text-xs text-gray-400">EMAIL ADDRESS</p>
                      <p className="font-semibold">info@afristreamgh.com</p>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team image strip */}
      <section className="py-12 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden">
            {[service.image, service.image, service.image, service.image].map((src, i) => (
              <img key={i} src={src} alt={`${service.title}-${i}`} className="w-full h-40 object-cover" />
            ))}
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Service Benefits</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" size={18} />
              <div>
                <h4 className="font-semibold mb-1">A unique website that differentiates you from competitors.</h4>
                <p className="text-gray-400">Crafted visuals and focused messaging that amplify your brand story.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" size={18} />
              <div>
                <h4 className="font-semibold mb-1">Improved user experience leads to higher satisfaction.</h4>
                <p className="text-gray-400">Streamlined flows, fast interactions, and clear CTAs that convert.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" size={18} />
                <div>
                <h4 className="font-semibold mb-1">Stronger engagement across platforms.</h4>
                <p className="text-gray-400">Content and integrations that fit your audience and channels.</p>
                </div>
              </div>
            </div>
          <p className="text-gray-300">We provide ongoing maintenance and support after launch, ensuring your project continues to improve and deliver results.</p>
        </div>
      </section>

      {/* Partners logos */}
      <section className="py-16 bg-dark-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Partners in success, stronger together</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">We collaborate with forward-thinking organizations to deliver business impact.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
            {['DALTON','NICK & JOAN','GUESTS','DEVLISH','JACKSMITH','BLACK STAR','ALEX DESIGN STUDIO','BAHAMA MUSEUM'].map((name) => (
              <div key={name} className="text-xl font-bold text-gray-400">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials from existing component */}
      <Testimonials />
    </main>
  );
}