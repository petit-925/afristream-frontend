import React from 'react';

interface Story {
  id: number;
  title: string;
  company: string;
  description: string;
  image: string;
}

const SuccessStories: React.FC = () => {
  const stories: Story[] = [
    {
      id: 1,
      title: "Digital Transformation Success",
      company: "Tech Solutions Inc.",
      description: "How we helped a traditional business transform into a digital powerhouse.",
      image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    // Add more stories as needed
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-12">Success Stories</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-dark-800 rounded-lg overflow-hidden">
                <img src={story.image} alt={story.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                  <p className="text-primary mb-4">{story.company}</p>
                  <p className="text-gray-400">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;