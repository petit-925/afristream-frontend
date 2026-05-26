import React from 'react';
import { Phone, Mail, Clock, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Button from '../components/ui/Button';
import Testimonials from '../components/sections/Testimonials';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/80 to-dark-900"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Start Something Great Together</h1>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
            <div className="bg-dark-800 p-6 rounded-lg">
              <Phone className="text-primary mb-4" size={24} />
              <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
              <p className="text-gray-400">+233 (243) 495-616</p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg">
              <Mail className="text-primary mb-4" size={24} />
              <h3 className="text-lg font-semibold mb-2">Email Address</h3>
              <p className="text-gray-400">info@afristreamgh.com</p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg">
              <Clock className="text-primary mb-4" size={24} />
              <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
              <p className="text-gray-400">Mon - Fri: 9:00am - 7:00pm</p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg">
              <MapPin className="text-primary mb-4" size={24} />
              <h3 className="text-lg font-semibold mb-2">Office Address</h3>
              <p className="text-gray-400">Okyere Plaza, Koforidua, Ghana</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <textarea
                  placeholder="Details"
                  rows={6}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                ></textarea>
                <Button size="lg" fullWidth>Submit</Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-dark-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      Our Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      View Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      Read FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-primary p-6 rounded-lg">
                <blockquote className="text-white">
                  <p className="mb-4">
                    "We now have a fantastic website that perfectly encapsulates the essence of our
                    company. Thanks to them, their service has exceeded all of our expectations."
                  </p>
                  <footer className="flex items-center">
                    <img
                      src="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150"
                      alt="Samantha Miller"
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <cite className="not-italic font-semibold">Samantha Miller</cite>
                      <p className="text-sm">Miller LLC</p>
                    </div>
                  </footer>
                </blockquote>
              </div>

              <div className="bg-dark-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <Twitter size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <Linkedin size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.0!2d-0.2833!3d6.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDUnMDAuMCJOIDDCsDE3JzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1645564944227!5m2!1sen!2sgh"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Contact;