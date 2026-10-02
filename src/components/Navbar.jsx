import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/categories`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setCategories(data.data.map(c => c.name));
                }
            } catch (err) {
                console.error("Failed to fetch categories for navbar", err);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
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
                <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#5e504f] h-full">
                    <Link to="/" className="text-[#e6a27a] border-b-2 border-[#e6a27a] pb-1">Home</Link>
                    
                    <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1">Shop</Link>
                    
                    <div className="relative group h-full flex items-center">
                        <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1 cursor-pointer">Shop By Age <span className="text-[10px]">▼</span></Link>
                        
                        <div className="absolute top-[80%] left-0 w-44 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="py-3 flex flex-col">
                                <Link to="/products" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] font-bold text-slate-800 transition-colors">All Ages</Link>
                                <div className="h-px bg-slate-50 my-1 mx-3"></div>
                                <Link to="/products?age=0-6+Months" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">0-6 Months</Link>
                                <Link to="/products?age=6-12+Months" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">6-12 Months</Link>
                                <Link to="/products?age=1-2+Years" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">1-2 Years</Link>
                                <Link to="/products?age=3-5+Years" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">3-5 Years</Link>
                                <Link to="/products?age=6-8+Years" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">6-8 Years</Link>
                                <Link to="/products?age=9-12+Years" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">9-12 Years</Link>
                                <Link to="/products?age=12%2B+Years" className="px-5 py-2 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors">12+ Years</Link>
                            </div>
                        </div>
                    </div>

                    <div className="relative group h-full flex items-center">
                        <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1 cursor-pointer">Categories <span className="text-[10px]">▼</span></Link>
                        
                        <div className="absolute top-[80%] left-0 w-max bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <Link to="/products" className="inline-block px-3 py-1.5 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] font-bold text-slate-800 transition-colors rounded-lg">All Categories</Link>
                                <div className="h-px bg-slate-50 my-3"></div>
                                <div 
                                    className="grid gap-x-12 gap-y-1" 
                                    style={{ 
                                        gridTemplateRows: `repeat(${categories.length > 0 ? Math.ceil(categories.length / Math.ceil(categories.length / 10)) : 10}, minmax(0, 1fr))`,
                                        gridAutoFlow: 'column'
                                    }}
                                >
                                    {categories.map(cat => (
                                        <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="block px-3 py-1.5 hover:bg-[#fff9f5] hover:text-[#e6a27a] text-[13px] transition-colors rounded-lg whitespace-nowrap">{cat}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link to="/about" className="hover:text-[#e6a27a] transition-colors">About Us</Link>
                    <Link to="/contact" className="hover:text-[#e6a27a] transition-colors">Contact</Link>
                </nav>

                {/* Right Tools */}
                <div className="flex items-center gap-5 text-[#5e504f]">
                    {/* Search Field */}
                    <div className="relative hidden md:flex items-center">
                        <form onSubmit={handleSearch} className={`transition-all duration-300 ease-in-out flex items-center ${isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0 overflow-hidden'}`}>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..." 
                                className="w-full bg-white border border-[#f3eee7] rounded-full py-1.5 px-4 text-[13px] outline-none focus:border-[#e6a27a] text-[#3d3130]"
                            />
                        </form>
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-[#e6a27a] transition-colors">
                            <Search className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>
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
