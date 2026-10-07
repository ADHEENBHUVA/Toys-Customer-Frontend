import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, Heart, ShoppingBag, Menu, X, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

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
                <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a] shrink-0">
                        <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div className="flex flex-col leading-none justify-center">
                        <span className="text-[17px] md:text-[20px] font-serif font-bold text-[#3d3130] whitespace-nowrap leading-none mb-0.5">Little Joys</span>
                        <span className="text-[7.5px] md:text-[10px] text-[#8b7e7c] tracking-wider whitespace-nowrap leading-none">KIDS & BABY STORE</span>
                    </div>
                </Link>

                {/* Center Links */}
                <nav className="hidden lg:flex items-center gap-8 text-[15px] font-serif font-medium text-[#5e504f] h-full">
                    <Link to="/" className={`transition-colors pb-1 ${location.pathname === '/' ? 'text-[#e6a27a] border-b-2 border-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>Home</Link>
                    
                    <Link to="/products" className={`transition-colors flex items-center gap-1 pb-1 ${location.pathname === '/products' ? 'text-[#e6a27a] border-b-2 border-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>Shop</Link>
                    
                    <div className="relative group h-full flex items-center">
                        <Link to="/products" className={`transition-colors flex items-center gap-1 cursor-pointer pb-1 ${location.pathname === '/products' && (location.search.includes('age=') || location.search.includes('category=')) ? 'text-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>Shop By Age <span className="text-[10px] font-sans">▼</span></Link>
                        
                        <div className="absolute top-[80%] left-0 w-44 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="py-3 flex flex-col font-sans">
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
                        <Link to="/products" className={`transition-colors flex items-center gap-1 cursor-pointer pb-1 ${location.pathname === '/products' && location.search.includes('category=') ? 'text-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>Categories <span className="text-[10px] font-sans">▼</span></Link>
                        
                        <div className="absolute top-[80%] left-0 w-max bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar font-sans">
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
                    <Link to="/about" className={`transition-colors pb-1 ${location.pathname === '/about' ? 'text-[#e6a27a] border-b-2 border-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>About Us</Link>
                    <Link to="/contact" className={`transition-colors pb-1 ${location.pathname === '/contact' ? 'text-[#e6a27a] border-b-2 border-[#e6a27a]' : 'hover:text-[#e6a27a]'}`}>Contact</Link>
                </nav>

                {/* Right Tools */}
                <div className="flex items-center gap-3.5 sm:gap-4 md:gap-5 text-[#5e504f] shrink-0">
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

                    <Link to="/orders" className="hover:text-[#e6a27a] transition-colors" title="My Orders">
                        <Package className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/waitlist" className="hover:text-[#e6a27a] transition-colors" title="Waitlist">
                        <Heart className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/cart" className="relative hover:text-[#e6a27a] transition-colors" title="Cart">
                        <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#e6a27a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <div className="hidden md:block w-[1px] h-6 bg-slate-200 mx-2"></div>
                    <Link to="/login" className="hidden md:flex items-center gap-2 text-[#e6a27a] bg-[#e6a27a]/10 hover:bg-[#e6a27a] hover:text-white px-4 py-1.5 rounded-full transition-all duration-300">
                        <span className="text-[13px] font-bold">Logout</span>
                        <LogOut className="w-4 h-4" strokeWidth={2.5} />
                    </Link>
                    <button className="lg:hidden text-[#3d3130] transition-transform duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#fcfaf7] border-t border-[#f3eee7] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] z-40 flex flex-col py-6 px-6 lg:hidden origin-top animate-[fadeIn_0.2s_ease-out]">
                    <nav className="flex flex-col gap-5 text-[16px] font-serif font-medium text-[#5e504f]">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">Home</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">Shop</Link>
                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">My Orders</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">About Us</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">Contact</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#e6a27a] transition-colors">My Account</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
