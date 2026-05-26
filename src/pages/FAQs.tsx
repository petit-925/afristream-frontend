import React from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQs: React.FC = () => {
  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What services do you offer?",
      answer: "We offer a comprehensive range of digital services including web development, digital marketing, branding, and more."
    },
    // Add more FAQs as needed
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-12">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-dark-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;