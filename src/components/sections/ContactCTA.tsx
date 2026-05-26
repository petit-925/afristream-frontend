import React from 'react';
import { Phone, Mail, ArrowRight } from 'lucide-react';

const ContactCTA: React.FC = () => {
  return (
    <section className="py-20 bg-dark-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30 0 60 30 30 60 0 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Utilize our powerful digital <span className="text-primary">solutions to expand your company.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We consistently exceed our clients' expectations by providing high quality digital solutions. Get in touch with us to get started!
            </p>
          </div>

          {/* Contact Info and Button */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">+233 (243) 495-616</div>
                <div className="text-gray-400 text-sm">Talk to an expert</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">info@afristreamgh.com</div>
                <div className="text-gray-400 text-sm">Email Us</div>
              </div>
            </div>

            {/* Call to Action Button */}
            <button className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center">
              GET STARTED <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
