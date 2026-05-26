import React, { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import PortfolioDetails from './pages/PortfolioDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/services/Pricing';
import ServiceDetailsPage from './pages/services/ServiceDetailsPage';
import Shop from './pages/Shop';
import JobDetails from './pages/JobDetails';
import SuccessStories from './pages/SuccessStories';
import Careers from './pages/Careers';
import WorkProcess from './pages/WorkProcess';
import FAQs from './pages/FAQs';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/routing/ProtectedRoute';

// ✅ Layout wrapper so Header/Footer appear on all pages
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function ScrollToTopWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  });
  return <>{children}</>;
}

const router = createBrowserRouter(
  [
    { path: '/', element: <ScrollToTopWrapper><Layout><Home /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/services', element: <ScrollToTopWrapper><Layout><Services /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/services/pricing', element: <ScrollToTopWrapper><Layout><Pricing /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/services/:slug', element: <ScrollToTopWrapper><Layout><ServiceDetailsPage /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/portfolio', element: <ScrollToTopWrapper><Layout><Portfolio /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/portfolio/:id', element: <ScrollToTopWrapper><Layout><PortfolioDetails /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/shop', element: <ScrollToTopWrapper><Layout><Shop /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/shop', element: <ScrollToTopWrapper><Layout><Shop /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/job-details', element: <ScrollToTopWrapper><Layout><JobDetails /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/success-stories', element: <ScrollToTopWrapper><Layout><SuccessStories /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/careers', element: <ScrollToTopWrapper><Layout><Careers /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/work-process', element: <ScrollToTopWrapper><Layout><WorkProcess /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/pages/faqs', element: <ScrollToTopWrapper><Layout><FAQs /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/about', element: <ScrollToTopWrapper><Layout><About /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/contact', element: <ScrollToTopWrapper><Layout><Contact /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/product/:id', element: <ScrollToTopWrapper><Layout><ProductDetails /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/login', element: <ScrollToTopWrapper><Layout><Login /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/register', element: <ScrollToTopWrapper><Layout><Register /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/cart', element: <ScrollToTopWrapper><Layout><Cart /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/checkout', element: <ScrollToTopWrapper><Layout><Checkout /></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/profile', element: <ScrollToTopWrapper><Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/orders', element: <ScrollToTopWrapper><Layout><ProtectedRoute><Orders /></ProtectedRoute></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/order/:id', element: <ScrollToTopWrapper><Layout><ProtectedRoute><OrderDetails /></ProtectedRoute></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
    { path: '/orders/:id', element: <ScrollToTopWrapper><Layout><ProtectedRoute><OrderDetails /></ProtectedRoute></Layout></ScrollToTopWrapper>, errorElement: <RootErrorBoundary /> },
  ],
  {
    // ✅ Enables the future flags to remove warnings
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

function RootErrorBoundary() {
  const error = useRouteError() as any;
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-2 text-white">Something went wrong</h1>
      <p className="text-gray-400 mb-4">{error?.statusText || error?.message || 'An unexpected error occurred.'}</p>
      <a href="/" className="px-4 py-2 bg-primary text-white rounded">Go Home</a>
    </div>
  );
}
