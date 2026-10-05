import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import Waitlist from './pages/Waitlist';
import Blog from './pages/Blog';

// Footer Pages
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import TrackOrder from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import About from './pages/About';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const Layout = () => {
    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-800 flex flex-col relative">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1 relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'backdrop-blur-xl bg-white/90 border border-slate-100 shadow-2xl',
            style: {
              padding: '16px 24px',
              color: '#1e293b',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '15px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      
      <Routes>
          {/* Routes with Navbar */}
          <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/blog" element={<Blog />} />
              
              {/* Footer Links */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/orders" element={<Orders />} />
              </Route>
          </Route>
          
          {/* Full-screen Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} /> {/* Placeholder pointing to login */}
      </Routes>
      
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
