import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  position: string;
  company: string;
  avatarUrl: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // Set to true by default

  useEffect(() => {
    // Mock data with real testimonials
    const mockTestimonials: Testimonial[] = [
      {
        id: 1,
        content: 
          "AfriStream transformed our digital presence completely. Their strategic approach and technical expertise have driven significant growth for our business. The team's attention to detail and commitment to excellence is truly remarkable.",
        author: "Alexandra Wilson",
        position: "Marketing Director",
        company: "Eastrin Industries",
        avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 2,
        content: 
          "Working with AfriStream was a game-changer for our company. They delivered beyond our expectations with innovative solutions that perfectly matched our vision. Their professionalism and expertise are unmatched in the industry.",
        author: "Michael Chen",
        position: "CEO",
        company: "Tech Innovations",
        avatarUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 3,
        content: 
          "The results speak for themselves. AfriStream helped us achieve a 300% increase in online engagement and significantly improved our brand presence. Their data-driven approach and creative solutions are exactly what we needed.",
        author: "Sarah Johnson",
        position: "Product Manager",
        company: "Global Solutions",
        avatarUrl: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 4,
        content: 
          "From concept to execution, AfriStream exceeded every expectation. Their team understood our unique challenges and delivered solutions that not only met our needs but positioned us for future growth.",
        author: "David Rodriguez",
        position: "Operations Director",
        company: "Meridian Services",
        avatarUrl: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      {
        id: 5,
        content: 
          "The level of service and expertise provided by AfriStream is outstanding. They took the time to understand our business goals and delivered a solution that has transformed how we operate digitally.",
        author: "Emma Davis",
        position: "Digital Strategy Lead",
        company: "Aspect Solutions",
        avatarUrl: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
    ];

    setTestimonials(mockTestimonials);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-20 bg-dark-800 relative">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-800 to-dark-900 opacity-70"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <Quote size={48} className="text-primary mx-auto opacity-30" />
          </div>
          
          <blockquote className="text-center mb-8">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6">
              "{currentTestimonial.content}"
            </p>
            
            <footer className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-primary">
                <img 
                  src={currentTestimonial.avatarUrl} 
                  alt={currentTestimonial.author} 
                  className="w-full h-full object-cover"
                />
              </div>
              <cite className="not-italic">
                <span className="block text-lg font-semibold">{currentTestimonial.author}</span>
                <span className="block text-sm text-gray-400">
                  {currentTestimonial.position}, {currentTestimonial.company}
                </span>
              </cite>
            </footer>
          </blockquote>
          
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-dark-800 hover:bg-primary transition-colors duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                      index === activeIndex ? 'bg-primary' : 'bg-gray-600'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-dark-800 hover:bg-primary transition-colors duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;