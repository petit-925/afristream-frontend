import React from 'react';
import { Clock, MapPin, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';

const JobDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-6">Senior Web Developer</h1>
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center text-gray-400">
              <Clock size={20} className="mr-2" />
              Full Time
            </div>
            <div className="flex items-center text-gray-400">
              <MapPin size={20} className="mr-2" />
              New York, NY
            </div>
            <div className="flex items-center text-gray-400">
              <Briefcase size={20} className="mr-2" />
              5+ Years Experience
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-400 mb-6">
              We are looking for a Senior Web Developer to join our team. You will be responsible for developing and maintaining web applications, mentoring junior developers, and contributing to technical architecture decisions.
            </p>
            
            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc list-inside text-gray-400 mb-6">
              <li>5+ years of experience in web development</li>
              <li>Strong proficiency in React, TypeScript, and Node.js</li>
              <li>Experience with cloud platforms (AWS/GCP)</li>
              <li>Excellent problem-solving skills</li>
            </ul>

            <Button size="lg">Apply Now</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetails;