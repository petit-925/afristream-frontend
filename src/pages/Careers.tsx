import React from 'react';
import { ArrowRight } from 'lucide-react';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
}

const Careers: React.FC = () => {
  const jobs: JobPosting[] = [
    {
      id: 1,
      title: "Senior Web Developer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time"
    },
    // Add more job postings as needed
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-12">Careers</h1>
          
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-dark-800 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <p className="text-gray-400">{job.department} · {job.location} · {job.type}</p>
                </div>
                <a href="#" className="text-primary hover:text-primary-light flex items-center">
                  View Details
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;