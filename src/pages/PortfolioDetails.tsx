import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Play, Facebook, Twitter, Linkedin, MessageCircle, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { API_BASE_URL, UPLOADS_BASE_URL } from '../config/api';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  mediaURL?: string;
  image?: string; // Fallback for backward compatibility
  // Support multiple media (images/videos)
  media?: string[];
  client?: string;
  location?: string;
  date?: string;
  overview?: string;
  features?: string[];
  testimonial?: {
    quote: string;
    author: string;
    company: string;
    avatar?: string;
  };
  gallery?: string[];
}

interface SimilarProject {
  id: number;
  title: string;
  category: string;
  description: string;
  mediaURL?: string;
  image?: string;
}

const PortfolioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const capitalizeFirst = (value?: string) => {
    if (!value || value.length === 0) return value || '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    if (!id) return;
    
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio/${id}`);
        if (!response.ok) {
          throw new Error('Portfolio not found');
        }
        const data = await response.json();
        
        // Transform backend data to frontend format
        const absolutize = (url?: string) => {
          if (!url) return url;
          // Normalize Windows backslashes
          url = url.replace(/\\/g, '/');
          if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
          let clean = url.replace(/^\//, '');
          if (!clean.startsWith('uploads/')) clean = `uploads/${clean}`;
          return `${UPLOADS_BASE_URL}/${clean.replace(/^uploads\//, '')}`;
        };
        // Build and normalize media arrays
        const primaryMedia = absolutize(data.mediaURL) || absolutize(data.image);
        const galleryList: string[] = Array.isArray(data.gallery) ? data.gallery.map((g: string) => absolutize(g)!).filter(Boolean) as string[] : [];
        const combinedMedia = [primaryMedia, ...galleryList].filter((m): m is string => Boolean(m));
        const uniqueMedia = Array.from(new Set(combinedMedia));

        const transformedData: PortfolioItem = {
          id: data.id,
          title: data.title,
          category: data.category,
          description: data.description,
          mediaURL: primaryMedia,
          image: primaryMedia,
          media: uniqueMedia,
          client: data.client,
          location: data.location,
          date: data.date,
          overview: data.overview,
          features: Array.isArray(data.features) ? data.features : [],
          testimonial: data.testimonial,
          gallery: Array.from(new Set(galleryList))
        };
        
        setPortfolio(transformedData);
        setActiveMediaIndex(0);
        
        // Fetch similar projects based on category
        await fetchSimilarProjects(data.category, data.id);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio');
        // Load mock similar projects as fallback
        loadMockSimilarProjects();
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const fetchSimilarProjects = async (category: string, currentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio?category=${category}&limit=4&exclude=${currentId}`);
      if (response.ok) {
        const data = await response.json();
        setSimilarProjects(data.slice(0, 4));
      } else {
        // Fallback to mock data if API fails
        loadMockSimilarProjects();
      }
    } catch (err) {
      console.error('Error fetching similar projects:', err);
      // Fallback to mock data
      loadMockSimilarProjects();
    }
  };

  const loadMockSimilarProjects = () => {
    const mockProjects: SimilarProject[] = [
      { 
        id: 1, 
        title: "Pixel Pioneers", 
        category: "Web Development",
        description: "Pioneering health innovations",
        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
      },
      { 
        id: 2, 
        title: "FilmSphere", 
        category: "Mobile Development",
        description: "Redefining digital film platforms", 
        image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
      },
      { 
        id: 3, 
        title: "Quantum Quotient", 
        category: "AI & ML",
        description: "Leaping towards next-gen tech solutions", 
        image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
      },
      { 
        id: 4, 
        title: "Dynamic Odyssey", 
        category: "E-commerce",
        description: "The road to achieving success in eCommerce", 
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
      }
    ];
    setSimilarProjects(mockProjects);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <Link to="/portfolio" className="text-primary hover:text-primary-light">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Spacing for Header Separation */}
      <div className="pt-24"></div>

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-14 lg:pt-16 lg:pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Portfolio Media - Moved to LEFT */}
            <div className="relative order-1 lg:order-1">
              <div className="relative z-10">
                {(() => {
                  const mediaList = Array.isArray(portfolio.media) && portfolio.media.length > 0
                    ? Array.from(new Set(portfolio.media))
                    : (portfolio.mediaURL ? [portfolio.mediaURL] : []);
                  const current = mediaList[activeMediaIndex] || portfolio.mediaURL || portfolio.image;
                  return current && current.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                    <video src={current} controls className="w-full h-[28rem] md:h-[30rem] lg:h-[34rem] object-cover rounded-lg shadow-2xl" />
                  ) : (
                    <img src={current || ''} alt={portfolio.title} className="w-full h-[28rem] md:h-[30rem] lg:h-[34rem] object-cover rounded-lg shadow-2xl" />
                  );
                })()}
              </div>
              {/* Thumbnails */}
              {Array.isArray(portfolio.media) && portfolio.media.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {Array.from(new Set(portfolio.media)).map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`
                        relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                        border-2 ${idx === activeMediaIndex ? 'border-primary shadow-lg shadow-primary/40' : 'border-dark-700'}
                        hover:scale-105 hover:shadow-md hover:shadow-black/40
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                      {m.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                        <video
                          src={m}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={m}
                          alt={`${portfolio.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Portfolio Content - Moved to RIGHT */}
            <div className="order-2 lg:order-2 self-start">
              <div className="inline-block bg-primary text-white text-sm px-4 py-2 rounded-full mb-4 md:mb-5 font-medium capitalize">
                {portfolio.category}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 md:mb-8 leading-tight capitalize">
                {portfolio.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed capitalize ">
                {portfolio.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details & Testimonial */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project Info - Moved to RIGHT */}
            <div className="order-2 lg:order-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-700 p-6 rounded-lg text-center hover:bg-dark-600 transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div className="text-gray-400 text-sm mb-2 font-medium">CLIENT</div>
                  <div className="text-white font-semibold capitalize">{portfolio.client || 'Client Name'}</div>
                </div>
                
                <div className="bg-dark-700 p-6 rounded-lg text-center hover:bg-dark-600 transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div className="text-gray-400 text-sm mb-2 font-medium ">LOCATION</div>
                  <div className="text-white font-semibold capitalize">{portfolio.location || 'Location'}</div>
                </div>
                
                <div className="bg-dark-700 p-6 rounded-lg text-center hover:bg-dark-600 transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="text-gray-400 text-sm mb-2 font-medium">DATE</div>
                  <div className="text-white font-semibold">
                    {portfolio.date ? new Date(portfolio.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'Date not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial - Moved to RIGHT */}
            <div className="order-1 lg:order-1">
              <div className="bg-primary p-8 rounded-lg shadow-xl">
                <div className="text-6xl text-white/20 mb-6">"</div>
                <p className="text-white text-lg leading-relaxed mb-6">
                  {capitalizeFirst(portfolio.testimonial?.quote) || "This is a placeholder testimonial for the project."}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full mr-4 flex items-center justify-center">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {portfolio.testimonial?.author || "Client Name"}
                    </div>
                    <div className="text-white/80 text-sm">
                      {capitalizeFirst(portfolio.testimonial?.company) || "Company Name"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Team collaboration"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {portfolio.overview || "Our approach combined cutting-edge design with robust functionality. We delivered a high-performing website and a user-friendly mobile application that effectively positioned the project as a trailblazer in their field."}
              </p>
              <Link 
                to="/portfolio" 
                className="inline-flex items-center text-primary hover:text-primary-light transition-colors mb-8 font-medium"
              >
                VIEW PROJECT <ArrowRight size={16} className="ml-2" />
              </Link>
              
              {portfolio.features && Array.isArray(portfolio.features) && portfolio.features.length > 0 && (
                <div className="space-y-4">
                  {portfolio.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video/Call to Action Section */}
      <section className="py-20 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
            Pioneering fintech and establishing fintech frontier's digital leadership.
          </h2>
          <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors mx-auto shadow-xl">
            <Play size={32} className="text-white ml-1" />
          </button>
        </div>
      </section>

      {/* Image Gallery */}
      {portfolio.gallery && Array.isArray(portfolio.gallery) && portfolio.gallery.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {portfolio.gallery.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg group">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share Project */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-gray-400 text-sm mb-8 font-medium">SHARE THIS PROJECT</h3>
          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Facebook size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Linkedin size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
            <button className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Twitter size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
              <MessageCircle size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
              <Mail size={20} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Similar Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Similar Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProjects.map((project) => (
              <Link 
                key={project.id} 
                to={`/portfolio/${project.id}`}
                className="bg-dark-800 rounded-lg overflow-hidden group hover:bg-dark-700 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={project.image || project.mediaURL || "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  
                  <div className="mt-2">
                    <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full capitalize">
                      {project.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-gray-400 text-sm mb-12 font-medium">We are trusted by thousands of clients</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {['Blake Star', 'Nick & Joan', 'Dalton', 'Vurnis', 'Andreas Bike', 'Huston'].map((client, index) => (
              <div key={index} className="text-white font-semibold text-lg opacity-60 hover:opacity-100 transition-opacity">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-dark-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30 0 60 30 30 60 0 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Utilize our powerful digital <span className="text-primary">solutions to expand your company.</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We consistently exceed our clients' expectations by providing high quality digital solutions. Get in touch with us to get started!
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">+233 (243) 495-616</div>
                  <div className="text-gray-400 text-sm">Talk to an expert</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">info@afristream.com</div>
                  <div className="text-gray-400 text-sm">Email Us</div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center">
                GET STARTED <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default PortfolioDetails;
