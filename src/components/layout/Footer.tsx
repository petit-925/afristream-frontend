import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">
              <span className="text-primary">Afri</span>stream
            </Link>
            <p className="text-light-gray mb-6">
              Empowering businesses with innovative digital solutions that drive growth and create meaningful experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-light-gray hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-light-gray hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-light-gray hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-light-gray hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light-gray hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

         {/* Contact Info */}
<div>
  <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
  <ul className="space-y-4">
    <li className="flex items-start">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors mt-1 mr-3">
        <Phone size={18} className="text-white" />
      </div>
      <span className="text-light-gray mt-1">+233 (243) 495-616</span>
    </li>
    <li className="flex items-start">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors mt-1 mr-3">
        <Mail size={18} className="text-white" />
      </div>
      <span className="text-light-gray mt-1">info@afristreamagh.com</span>
    </li>
    <li className="flex items-start">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors mt-1 mr-3">
        <MapPin size={18} className="text-white" />
      </div>
      <span className="text-light-gray mt-1">
        Okyere Plaza-Block B
        <br />
        Koforidua, Business Street
      </span>
    </li>
  </ul>
</div>


          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-light-gray mb-4">
              Stay updated with our latest news and offers.
            </p>
            <div className="flex">
              <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-dark-800 border border-dark-700 rounded-l-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              <button className="bg-primary hover:bg-primary-dark p-2 rounded-r-md transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-dark-600 my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-light-gray text-sm">
            © {new Date().getFullYear()} Afristream Ghana. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy" className="text-light-gray text-sm hover:text-primary mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-light-gray text-sm hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;