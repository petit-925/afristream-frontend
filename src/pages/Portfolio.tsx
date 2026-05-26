import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Testimonials from '../components/sections/Testimonials';
import { API_BASE_URL } from '../config/api';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  // Updated categories
  const predefinedCategories: Category[] = [
      { id: 'all', name: 'All' },
    { id: 'branding', name: 'Branding' },
      { id: 'web-design', name: 'Web Design' },
      { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'print-design', name: 'Print Design' },
    { id: 'app-design', name: 'App Design' },
    { id: 'videos-pictures', name: 'Videos & Pictures' }
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/portfolio`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.portfolio || []);
        
        // Map backend categories to predefined categories
        const mappedItems = items.map((p: any) => {
          let category = p.category || 'branding';
          
          // Map backend categories to our predefined ones
          if (category.toLowerCase().includes('web') || category.toLowerCase().includes('website') || category.toLowerCase().includes('app')) {
            category = 'web-design';
          } else if (category.toLowerCase().includes('graphic') || category.toLowerCase().includes('design') || category.toLowerCase().includes('ui')) {
            category = 'graphic-design';
          } else if (category.toLowerCase().includes('brand') || category.toLowerCase().includes('logo') || category.toLowerCase().includes('identity')) {
            category = 'branding';
          } else if (category.toLowerCase().includes('video') || category.toLowerCase().includes('picture') || category.toLowerCase().includes('photo') || category.toLowerCase().includes('media')) {
            category = 'videos-pictures';
          }
          
          const absolutize = (url?: string) => {
            if (!url) return '';
            url = url.replace(/\\/g, '/');
            if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
            const host = API_BASE_URL.replace(/\/api.*$/, '');
            let clean = url.startsWith('/') ? url : `/${url}`;
            if (!clean.startsWith('/uploads/')) clean = `/uploads${clean}`;
            return `${host}${clean}`;
          };
          return {
            id: Number(p.id),
            title: p.title || 'Untitled',
            category: category,
            description: p.description || '',
            image: absolutize(p.image || p.mediaURL) || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          };
        });
        
        setProjects(mappedItems);
        setCategories(predefinedCategories);
      } catch {
        setCategories(predefinedCategories);
        setProjects([]);
      }
    })();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('portfolio-page');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <div id="portfolio-page" className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center ">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/80 to-dark-900"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            A showcase of our commitment to delivering high-impact digital solutions. We transform ideas into reality. Our commitment to quality and excellence is unparalleled.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group relative overflow-hidden rounded-xl transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-dark-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-90"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-dark-800/80 text-white text-xs px-3 py-1 rounded font-medium">
                    {categories.find(c => c.id === project.category)?.name}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <div className="flex space-x-3">
                    <Link 
                      to={`/portfolio/${project.id}`}
                      className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Link>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Portfolio;