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
import Profile from './pages/Profile';
import Waitlist from './pages/Waitlist';
import Blog from './pages/Blog';
import AllCategories from './pages/AllCategories';
import AllCollections from './pages/AllCollections';
import ShopByAge from './pages/ShopByAge';
import ShopByPrice from './pages/ShopByPrice';
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

import MobileBottomNav from './components/MobileBottomNav';
import CartDrawer from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { PopupProvider } from './context/PopupContext';

const Layout = () => {
    const { pathname } = useLocation();
    const { isCartOpen } = useCart();
    const hideBottomNav = pathname.startsWith('/product/') || pathname === '/cart' || pathname === '/checkout';

    useEffect(() => {
        if (isCartOpen) {
            document.documentElement.classList.add('cart-open');
            document.body.classList.add('cart-open');
        } else {
            document.documentElement.classList.remove('cart-open');
            document.body.classList.remove('cart-open');
        }
        return () => {
            document.documentElement.classList.remove('cart-open');
            document.body.classList.remove('cart-open');
        };
    }, [isCartOpen]);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex relative overflow-x-clip">
            {/* The Dashboard / Main Page Canvas */}
            <div 
                className={`min-h-screen w-full flex flex-col relative transition-all duration-300 ease-in-out ${
                    hideBottomNav ? 'pb-0' : 'pb-16 md:pb-0'
                } ${
                    isCartOpen 
                        ? 'lg:w-[calc(100%-460px)] xl:w-[calc(100%-480px)]' 
                        : 'w-full'
                }`}
            >
                <ScrollToTop />
                <Navbar />
                <main className="flex-1 relative z-10">
                    <Outlet />
                </main>
                <Footer />
                <MobileBottomNav />
            </div>

            {/* Cart Drawer - Docked on the right */}
            <CartDrawer />
        </div>
    );
};

function App() {
  return (
    <PopupProvider>
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
                  <Route path="/categories" element={<AllCategories />} />
                  <Route path="/collections" element={<AllCollections />} />
                  <Route path="/shop-by-age" element={<ShopByAge />} />
                  <Route path="/shop-by-price" element={<ShopByPrice />} />
                  <Route path="/blog" element={<Blog />} />
                  {/* Footer Links */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/refund" element={<Returns />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/profile" element={<Profile />} />
                  </Route>
                  
                  {/* Full-screen Routes without Navbar */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Login />} />
              </Route>
          </Routes>
        
        </BrowserRouter>
      </CartProvider>
    </PopupProvider>
  );
}

export default App;
