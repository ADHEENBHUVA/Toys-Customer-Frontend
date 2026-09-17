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
import Orders from './pages/Orders';

// Footer Pages
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import TrackOrder from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
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
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#073B4C',
            fontWeight: 'bold',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            padding: '16px 24px',
          },
          success: {
            iconTheme: {
              primary: '#06D6A0',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF476F',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
          {/* Routes with Navbar */}
          <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Products />} />
              
              {/* Footer Links */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
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
