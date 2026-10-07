import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronLeft, ChevronRight, Phone, Mail, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="w-full sticky top-0 z-50 font-sans shadow-sm flex flex-col">
            
            {/* 1. Top Banner (Red) */}
            <div className="w-full bg-[#cc141c] text-white text-[12px] py-1.5 flex justify-center items-center font-medium gap-4">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white/70" />
                <span>FREE Home Delivery on Orders Above ₹500</span>
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white/70" />
            </div>

            {/* 2. Main Red Header */}
            <div className="w-full bg-[#E51A22] py-3 lg:py-4 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
                    
                    {/* Logo */}
                    <Link to="/" className="shrink-0 flex items-center">
                        <div className="bg-white border-2 border-white rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 flex items-center justify-center">
                            <span className="text-[#E51A22] font-black text-[18px] lg:text-[24px] tracking-tight leading-none flex items-center gap-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-7 lg:h-7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                                toycker<span className="text-[12px] lg:text-[14px]">.com</span>
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-grow max-w-[600px]">
                        <form onSubmit={handleSearch} className="w-full relative flex items-center bg-white rounded-full p-1 overflow-hidden">
                            <button type="submit" className="bg-[#E51A22] text-white p-2 rounded-full flex items-center justify-center min-w-[40px] min-h-[40px] shrink-0 hover:bg-[#cc141c] transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Browse educational toys..." 
                                className="w-full bg-transparent py-2.5 px-4 text-[#333] text-[15px] outline-none placeholder-gray-400 font-medium"
                            />
                        </form>
                    </div>

                    {/* Right Side Tools */}
                    <div className="flex items-center gap-3 lg:gap-6 shrink-0">
                        {/* Support Info */}
                        <div className="hidden xl:flex items-center gap-3 border border-white/30 rounded-full py-1.5 px-4">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Phone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col text-white leading-tight">
                                <span className="text-[11px] font-medium opacity-90">24/7 Support:</span>
                                <span className="text-[13px] font-bold">+91 9925819692</span>
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            <Link to="/orders" className="w-10 h-10 bg-black/15 hover:bg-black/25 transition-colors rounded-full flex items-center justify-center text-white" title="Account">
                                <User className="w-5 h-5" />
                            </Link>
                            <Link to="/waitlist" className="w-10 h-10 bg-black/15 hover:bg-black/25 transition-colors rounded-full flex items-center justify-center text-white" title="Wishlist">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Link to="/cart" className="w-10 h-10 bg-black/15 hover:bg-black/25 transition-colors rounded-full flex items-center justify-center text-white relative" title="Cart">
                                <ShoppingBag className="w-5 h-5" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-[#E51A22] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E51A22]">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                            
                            <button className="lg:hidden w-10 h-10 bg-black/15 rounded-full flex items-center justify-center text-white ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Visible only on small screens) */}
            <div className="lg:hidden w-full bg-[#cc141c] p-3 border-t border-white/10">
                <form onSubmit={handleSearch} className="w-full relative flex items-center bg-white rounded-full p-1 overflow-hidden">
                    <button type="submit" className="bg-[#E51A22] text-white p-1.5 rounded-full flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4" />
                    </button>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Browse educational toys..." 
                        className="w-full bg-transparent py-2 px-3 text-[#333] text-[14px] outline-none placeholder-gray-400 font-medium"
                    />
                </form>
            </div>

            {/* 3. Bottom White Navigation */}
            <div className="hidden lg:block w-full bg-white border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-8 h-12 flex items-center justify-between text-[15px] font-medium text-[#111]">
                    <nav className="flex items-center gap-8 h-full">
                        <Link to="/" className="text-[#E51A22] font-semibold">Home</Link>
                        
                        <div className="relative group h-full flex items-center cursor-pointer">
                            <Link to="/products" className="hover:text-[#E51A22] transition-colors flex items-center gap-1">Shop <span className="text-[10px] text-gray-400">▼</span></Link>
                        </div>

                        <Link to="/products?category=Metal+Car" className="hover:text-[#E51A22] transition-colors">Metal Car</Link>
                        <Link to="/products?category=Boys" className="hover:text-[#E51A22] transition-colors">Boys</Link>
                        <Link to="/products?category=Girls" className="text-[#E51A22] hover:text-[#cc141c] transition-colors font-medium">Girls</Link>
                        <Link to="/about" className="hover:text-[#E51A22] transition-colors">About Us</Link>
                        <Link to="/contact" className="hover:text-[#E51A22] transition-colors">Contact Us</Link>
                        
                        <Link to="/club" className="ml-2 bg-gradient-to-r from-purple-400 to-[#F25A5A] text-white px-5 py-1.5 rounded-full font-bold flex items-center gap-2 hover:shadow-md transition-shadow">
                            <span className="text-white">✨</span> Club
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 text-gray-500 hover:text-[#E51A22] transition-colors cursor-pointer">
                        <Mail className="w-4 h-4" />
                        <span>support@toycker.com</span>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-40 flex flex-col py-4 px-6 origin-top">
                    <nav className="flex flex-col gap-4 text-[16px] font-semibold text-[#111]">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#E51A22]">Home</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E51A22]">Shop</Link>
                        <Link to="/products?category=Metal+Car" onClick={() => setIsMobileMenuOpen(false)}>Metal Car</Link>
                        <Link to="/products?category=Boys" onClick={() => setIsMobileMenuOpen(false)}>Boys</Link>
                        <Link to="/products?category=Girls" onClick={() => setIsMobileMenuOpen(false)} className="text-[#E51A22]">Girls</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                        <Link to="/club" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-purple-400 to-[#F25A5A] text-white px-5 py-2 rounded-full text-center mt-2">✨ Club</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
