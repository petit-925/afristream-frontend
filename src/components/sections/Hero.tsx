import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';

interface Slide {
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    title: 'Re-imagine your digital experiences!',
    description:
      'We craft innovative digital solutions that transform businesses and create meaningful connections with your audience.',
  },
  {
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    title: 'Empowering ideas through technology',
    description:
      'From design to deployment, we deliver high-performance solutions that drive your vision forward.',
  },
  {
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    title: 'Building the future, one pixel at a time',
    description:
      'We combine creativity and innovation to build platforms that inspire engagement and growth.',
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 600);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    if (index !== currentSlide) {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide(index);
        setFade(true);
      }, 500);
    }
  };

  const { image, title, description } = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: 'blur(5px)',
            }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/80 to-dark-900"></div>
      </div>

      {/* Content */}
      <div
        className={`container mx-auto px-4 md:px-8 z-10 text-center transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div
          key={currentSlide}
          className={`transition-opacity duration-700 ease-in-out ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
            {title.split('digital').length > 1 ? (
              <>
                {title.split('digital')[0]}
                <span className="text-primary">digital</span>
                {title.split('digital')[1]}
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {description}
          </p>
        </div>

        {/* Buttons (static) */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? 'bg-primary shadow-[0_0_15px_rgba(255,0,0,0.8)] scale-125'
                  : 'bg-gray-500/60 hover:bg-primary/70'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
