const fs = require('fs');

const navbarCode = `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(\`/products?search=\${encodeURIComponent(searchQuery)}\`);
            setSearchQuery('');
        }
    };

    return (
        <header className="w-full bg-[#fcfaf7] sticky top-0 z-50 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a]">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[20px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                        <span className="text-[10px] text-[#8b7e7c] tracking-wider">KIDS & BABY STORE</span>
                    </div>
                </Link>

                {/* Center Links */}
                <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#5e504f]">
                    <Link to="/" className="text-[#e6a27a] border-b-2 border-[#e6a27a] pb-1">Home</Link>
                    <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1">Shop <span className="text-[10px]">▼</span></Link>
                    <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1">Categories <span className="text-[10px]">▼</span></Link>
                    <Link to="/about" className="hover:text-[#e6a27a] transition-colors">About Us</Link>
                    <Link to="/blog" className="hover:text-[#e6a27a] transition-colors">Blog</Link>
                    <Link to="/contact" className="hover:text-[#e6a27a] transition-colors">Contact</Link>
                </nav>

                {/* Right Tools */}
                <div className="flex items-center gap-5 text-[#5e504f]">
                    <button className="hidden md:block hover:text-[#e6a27a] transition-colors">
                        <Search className="w-5 h-5" strokeWidth={2} />
                    </button>
                    <Link to="/login" className="hidden md:block hover:text-[#e6a27a] transition-colors">
                        <User className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/waitlist" className="hover:text-[#e6a27a] transition-colors">
                        <Heart className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/cart" className="relative hover:text-[#e6a27a] transition-colors">
                        <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#e6a27a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <button className="lg:hidden text-[#3d3130]" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-[100] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <span className="text-[24px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#3d3130]"><X className="w-8 h-8"/></button>
                    </div>
                    <nav className="flex flex-col gap-6 text-[18px] font-medium text-[#5e504f]">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
`;

fs.writeFileSync('d:/Toys Website/Customer Frontend/src/components/Navbar.jsx', navbarCode);
console.log('Navbar Replaced');
