import React from 'react';
import Hero from '../components/sections/Hero';
import FeatureCards from '../components/sections/FeatureCards';
import ServicesHighlight from '../components/sections/ServicesHighlight';
import ServicesGrid from '../components/sections/ServicesGrid';
import ContactCTA from '../components/sections/ContactCTA';
import Testimonials from '../components/sections/Testimonials';
import ProductShowcase from '../components/sections/ProductShowcase';
import ClientLogos from '../components/sections/ClientLogos';
import ExperienceSection from '../components/sections/ExperienceSection';
import ProcessSteps from '../components/sections/ProcessSteps';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <FeatureCards />
      <ServicesHighlight />
      <ServicesGrid />
      <ContactCTA />
      <Testimonials />
      <ProductShowcase />
      <ClientLogos />
      <ExperienceSection />
      <ProcessSteps />
    </>
  );
};

export default Home;