import React from 'react';
import { Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Testimonials from '../../components/sections/Testimonials';

interface PricingFeature {
  text: string;
}

interface PricingPackage {
  name: string;
  price: number;
  features: PricingFeature[];
}

interface AddOn {
  name: string;
  price: number;
  unit: string;
  icon: React.ReactNode;
}

interface FAQ {
  question: string;
  answer: string;
}

const Pricing: React.FC = () => {
  const packages: PricingPackage[] = [
    {
      name: 'Startup Package',
      price: 450,
      features: [
        { text: 'Custom Website Design' },
        { text: 'Social Media Integration' },
        { text: 'SEO Optimized Content' },
        { text: 'Responsive Design' },
      ],
    },
    {
      name: 'Pro Package',
      price: 950,
      features: [
        { text: 'Advanced SEO Optimization' },
        { text: 'CMS Integration' },
        { text: 'SEO Marketing Setup' },
        { text: 'Email Marketing Setup' },
      ],
    },
    {
      name: 'Elite Package',
      price: 1650,
      features: [
        { text: 'Pro Package +' },
        { text: 'Dedicated Project Manager' },
        { text: 'E-commerce Integration' },
        { text: 'Custom API Integration' },
      ],
    },
  ];

  const addOns: AddOn[] = [
    { name: 'Content Creation', price: 50, unit: 'page', icon: <Check /> },
    { name: 'Local Listing', price: 40, unit: 'item', icon: <Check /> },
    { name: 'Social Media Setup', price: 90, unit: 'platform', icon: <Check /> },
    { name: 'Website Maintenance', price: 250, unit: 'month', icon: <Check /> },
    { name: 'Graphic Design', price: 120, unit: 'item', icon: <Check /> },
    { name: 'Priority Support', price: 180, unit: 'month', icon: <Check /> },
  ];

  const faqs: FAQ[] = [
    {
      question: 'What does your web design service include?',
      answer: 'Our web design service includes custom design, responsive development, basic SEO optimization, and user-friendly experience that helps drive engagement and conversions.',
    },
    {
      question: 'Do you ensure my website is mobile-friendly?',
      answer: 'Yes! All our websites are built with a mobile-first approach and are fully responsive across all devices. They are tested on all major browsers, tablets, and smartphones.',
    },
    {
      question: 'Can you redesign my existing website?',
      answer: 'Absolutely! We offer website redesign services to help modernize your online presence, improve functionality, and overall user experience.',
    },
    {
      question: 'How long does it take to design a website?',
      answer: 'The timeline varies depending on the project\'s complexity and requirements. However, we always strive to deliver within the agreed upon deadlines.',
    },
    {
      question: 'Do you offer custom website design?',
      answer: 'Absolutely! We pride ourselves on creating custom websites that are specifically tailored to your brand and business needs.',
    },
    {
      question: 'Can I update the website myself after it is built?',
      answer: 'Yes! We build our websites with user-friendly content management systems that make it easy for you to update your content.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
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
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We believe in complete transparency about our pricing. Check out our pricing options designed to deliver maximum value for your investment.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 mt-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Check className="text-primary mr-2" />
                Value for Money
              </h3>
              <p className="text-gray-400">
                We understand that every dollar counts in your business. Our packages ensure that your money gives you the best value possible.
              </p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Check className="text-primary mr-2" />
                Competitive Pricing
              </h3>
              <p className="text-gray-400">
                Our rates are designed to be highly competitive within the industry, providing you with great value for your investment.
              </p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Check className="text-primary mr-2" />
                Transparent Pricing
              </h3>
              <p className="text-gray-400">
                No hidden fees or surprise charges. Our pricing is simple and all-inclusive, with no hidden costs.
              </p>
            </div>
          </div>

          {/* Pricing Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`bg-dark-800 p-8 rounded-lg ${
                  index === 1 ? 'border-2 border-primary' : 'border border-dark-600'
                }`}
              >
                <h3 className="text-xl font-bold mb-6 text-center">{pkg.name}</h3>
                <div className="text-3xl font-bold text-center mb-8">GH₵{pkg.price}</div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="text-primary mr-2" size={16} />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Button fullWidth variant={index === 1 ? 'primary' : 'outline'}>
                  Choose Plan
                </Button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-4">Add-ons</h2>
            <p className="text-center text-gray-400 mb-12">
              Need more tools to reach your goals? Purchase additional services individually to ensure the best result aligns flawlessly with your vision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {addOns.map((addon) => (
                <div key={addon.name} className="flex items-center justify-between bg-dark-800 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-4 text-primary">{addon.icon}</div>
                    <div>
                      <h4 className="font-semibold">{addon.name}</h4>
                      <p className="text-sm text-gray-400">Custom content for your website</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">GH₵{addon.price}</div>
                    <div className="text-sm text-gray-400">per {addon.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-12">Pricing FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-dark-800 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-start">
                    <span className="text-primary mr-2">Q:</span>
                    {faq.question}
                  </h4>
                  <p className="text-gray-400 pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Pricing;