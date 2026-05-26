import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import logo from '../../assets/AfristreamWhite.png';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();

  // Refs for dropdowns and mobile menu
  const servicesRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns & mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Dropdown click detection
      if (
        servicesRef.current?.contains(target) ||
        pagesRef.current?.contains(target) ||
        authRef.current?.contains(target) ||
        userRef.current?.contains(target)
      ) {
        return;
      }
      setActiveDropdown(null);

      // Mobile menu click detection
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLinkClick = (path: string) => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    navigate(path);
  };

  const servicesDropdown = [
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/services/pricing' },
  ];

  const pagesDropdown = [
    { name: 'Shop', path: '/pages/shop' },
    //{ name: 'Job Details', path: '/pages/job-details' },
    //{ name: 'Success Stories', path: '/pages/success-stories' },
    //{ name: 'Careers', path: '/pages/careers' },
    { name: 'Work Process', path: '/pages/work-process' },
    //{ name: 'FAQs', path: '/pages/faqs' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-900/50 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-2'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AfriStream" className="h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary">Home</Link>
            <Link to="/portfolio" className="text-white hover:text-primary">Portfolio</Link>

            {/* Services Dropdown */}
            <div ref={servicesRef} className="relative">
              <button onClick={() => handleDropdownClick('services')} className="flex items-center text-white hover:text-primary">
                Services <ChevronDown size={16} className="ml-1" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg py-2">
                  {servicesDropdown.map((item) => (
                    <button key={item.path} onClick={() => handleLinkClick(item.path)} className="block w-full px-4 py-2 text-white hover:bg-dark-700 hover:text-primary">
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pages Dropdown */}
            <div ref={pagesRef} className="relative">
              <button onClick={() => handleDropdownClick('pages')} className="flex items-center text-white hover:text-primary">
                Pages <ChevronDown size={16} className="ml-1" />
              </button>
              {activeDropdown === 'pages' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg py-2">
                  {pagesDropdown.map((item) => (
                    <button key={item.path} onClick={() => handleLinkClick(item.path)} className="block w-full px-4 py-2 text-white hover:bg-dark-700 hover:text-primary">
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="text-white hover:text-primary">About</Link>
            <Link to="/contact" className="text-white hover:text-primary">Contact</Link>
          </nav>

          {/* Right-side Auth + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative text-white hover:text-primary">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 rounded-full">{cartItems.length}</span>
              )}
            </Link>

            {!user ? (
              <div ref={authRef} className="relative">
                <button onClick={() => handleDropdownClick('auth')} className="text-white hover:text-primary">
                  <User size={22} />
                </button>
                {activeDropdown === 'auth' && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg py-2">
                    <Link to="/login" className="block px-4 py-2 text-white hover:bg-dark-700">Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-white hover:bg-dark-700">Register</Link>
                  </div>
                )}
              </div>
            ) : (
              <div ref={userRef} className="relative">
                <button onClick={() => handleDropdownClick('user')} className="flex items-center text-white hover:text-primary">
                  {user.name} <ChevronDown size={16} className="ml-1" />
                </button>
                {activeDropdown === 'user' && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg py-2">
                    <button onClick={() => handleLinkClick('/profile')} className="block px-4 py-2 text-white hover:bg-dark-700">Profile</button>
                    <button onClick={() => handleLinkClick('/orders')} className="block px-4 py-2 text-white hover:bg-dark-700">My Orders</button>
                    <button onClick={() => { logout(); navigate('/'); }} className="block px-4 py-2 text-white hover:bg-dark-700">Logout</button>
                  </div>
                )}
              </div>
            )}
            <Button onClick={() => handleLinkClick('/contact')}>Contact Us</Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 right-0 bg-dark-800 shadow-lg py-4 px-4">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => handleLinkClick('/')} className="text-left text-white hover:text-primary py-2">Home</button>
              <button onClick={() => handleLinkClick('/portfolio')} className="text-left text-white hover:text-primary py-2">Portfolio</button>
              <button onClick={() => handleLinkClick('/services')} className="text-left text-white hover:text-primary py-2">Services</button>
              <button onClick={() => handleLinkClick('/pages/shop')} className="text-left text-white hover:text-primary py-2">Shop</button>
              <button onClick={() => handleLinkClick('/about')} className="text-left text-white hover:text-primary py-2">About</button>
              <button onClick={() => handleLinkClick('/contact')} className="text-left text-white hover:text-primary py-2">Contact</button>
              {!user ? (
                <>
                  <Link to="/login" className="text-white hover:text-primary py-2">Login</Link>
                  <Link to="/register" className="text-white hover:text-primary py-2">Register</Link>
                </>
              ) : (
                <>
                  <button onClick={() => handleLinkClick('/profile')} className="text-left text-white hover:text-primary py-2">Profile</button>
                  <button onClick={() => handleLinkClick('/orders')} className="text-left text-white hover:text-primary py-2">My Orders</button>
                  <button onClick={() => { logout(); navigate('/'); }} className="text-left text-white hover:text-primary py-2">Logout</button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
