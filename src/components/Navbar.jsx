import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronLeft, ChevronRight, Phone, Mail, User, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const [catRes, colRes] = await Promise.all([
                    fetch(`${apiUrl}/categories`).then(r => r.json()),
                    fetch(`${apiUrl}/collections`).then(r => r.json())
                ]);
                if (catRes.success) setCategories(catRes.data);
                if (colRes.success) setCollections(colRes.data);
            } catch (error) {
                console.error("Error fetching nav data:", error);
            }
        };
        fetchNavData();
    }, []);

    const [announcementIndex, setAnnouncementIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const announcements = [
        "FREE Home Delivery on Orders Above ₹500",
        "New Educational Toys Added Every Week",
        "Get 10% Off on Your First Order"
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname, location.search]);

    const nextAnnouncement = () => {
        setAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    };

    const prevAnnouncement = () => {
        setAnnouncementIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
    };

    const getLinkClass = (path, paramValue = null, paramName = 'category') => {
        let isActive = false;
        if (paramValue) {
            isActive = location.pathname === '/products' && location.search.includes(`${paramName}=${paramValue}`);
        } else if (path === '/products') {
            isActive = location.pathname === '/products' && !location.search.includes('category=') && !location.search.includes('gender=');
        } else {
            isActive = location.pathname === path;
        }
        
        return `transition-colors font-semibold py-2 ${
            isActive 
                ? 'text-[#E51A22] border-b-2 border-[#E51A22]' 
                : 'text-[#111] border-b-2 border-transparent hover:text-[#E51A22]'
        }`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="w-full sticky top-0 z-50 font-sans shadow-md bg-[#E51A22] flex flex-col">
            
            {/* 1. Top Banner (Red) Slider */}
            <div className="w-full bg-[#cc141c] text-white text-[13px] flex justify-center items-center font-bold tracking-wide h-9 shrink-0">
                <div className="relative flex items-center justify-between w-full max-w-[450px] md:max-w-[650px] px-2">
                    <button onClick={prevAnnouncement} className="z-20 w-6 h-6 shrink-0 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 h-9 relative overflow-hidden flex items-center justify-center mx-2">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={announcementIndex}
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="absolute w-full flex items-center justify-center gap-2"
                            >
                                <span className="text-yellow-300 text-[11px]">✦</span> 
                                {announcements[announcementIndex]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button onClick={nextAnnouncement} className="z-20 w-6 h-6 shrink-0 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 2. Main Red Header */}
            <div className={`w-full bg-[#E51A22] px-3 sm:px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'py-2 sm:py-2.5 lg:py-2.5 shadow-sm' : 'py-2.5 sm:py-3 lg:py-4'}`}>
                <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
                    
                    {/* Logo */}
                    <Link to="/" className="shrink-0 flex items-center group">
                        <div className="flex items-center gap-1.5 sm:gap-2 transition-transform group-hover:scale-105">
                            <Smile className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white shrink-0" strokeWidth={2.5} />
                            <span className="text-white font-black text-lg sm:text-[22px] lg:text-[28px] tracking-tight leading-none whitespace-nowrap">
                                Little Joys
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-grow max-w-[500px] xl:max-w-[700px] mx-4 lg:mx-8">
                        <form onSubmit={handleSearch} className="w-full relative flex items-center bg-white rounded-xl px-4 py-2.5 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-white/30">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for toys, games, and more..." 
                                className="w-full bg-transparent text-[#333] text-[15px] outline-none placeholder-gray-400 font-medium"
                            />
                            <button type="submit" className="text-gray-400 hover:text-[#E51A22] transition-colors ml-2 p-1">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right Side Tools */}
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-5 shrink-0">
                        {/* Support Info */}
                        <a href="tel:+918347640423" className="hidden xl:flex items-center gap-3 py-1.5 px-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                            <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
                                <Phone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col text-white leading-tight">
                                <span className="text-[11px] font-medium opacity-80 uppercase tracking-wider">24/7 Support</span>
                                <span className="text-[14px] font-bold">+91 8347640423</span>
                            </div>
                        </a>

                        {/* Icons */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="relative group hidden sm:block">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full flex items-center justify-center text-white cursor-pointer" title="Account">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="w-44 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col py-2 overflow-hidden transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <Link to="/orders" className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#E51A22] text-[14px] font-bold transition-colors flex items-center gap-2.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            My Orders
                                        </Link>
                                        <button onClick={() => window.location.href = '/login'} className="px-5 py-2.5 text-left text-gray-700 hover:bg-gray-50 hover:text-[#E51A22] text-[14px] font-bold transition-colors w-full flex items-center gap-2.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Link to="/waitlist" className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full items-center justify-center text-white" title="Wishlist">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Link to="/cart" className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full flex items-center justify-center text-white relative" title="Cart">
                                <ShoppingBag className="w-5 h-5" />
                                {getCartCount() > 0 && (
                                    <span className="absolute top-1 right-1 bg-white text-[#E51A22] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                            
                            <button className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 rounded-full flex items-center justify-center text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Visible only on small screens) */}
            <div className={`lg:hidden w-full bg-[#cc141c] border-t border-white/10 transition-all duration-300 ${isScrolled ? 'p-2' : 'p-3'}`}>
                <form onSubmit={handleSearch} className="w-full relative flex items-center bg-white rounded-full p-1 overflow-hidden">
                    <button type="submit" className="bg-[#E51A22] text-white p-1.5 rounded-full flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4" />
                    </button>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Browse educational toys..." 
                        className="w-full bg-transparent py-1.5 sm:py-2 px-3 text-[#333] text-[14px] outline-none placeholder-gray-400 font-medium"
                    />
                </form>
            </div>

            {/* 3. Bottom White Navigation */}
            <div className={`hidden lg:block w-full bg-white border-b border-gray-100 shadow-sm relative z-40 transition-all duration-300 ${isScrolled ? 'h-11' : 'h-14'}`}>
                <div className={`max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between text-[14px] font-bold text-gray-700 transition-all duration-300 ${isScrolled ? 'h-11' : 'h-14'}`}>
                    
                    {/* Left: Quick Contact */}
                    <div className="flex-1 flex items-center gap-2 text-gray-500 hover:text-[#E51A22] transition-colors cursor-pointer">
                        <Mail className="w-4 h-4" />
                        <a href="mailto:support@littlejoys.com" className="tracking-wide text-[13px]">support@littlejoys.com</a>
                    </div>

                    {/* Center: Main Navigation */}
                    <nav className="flex items-center justify-center gap-8 shrink-0">
                        <Link to="/" className={getLinkClass('/')}>Home</Link>
                        
                        <div 
                            className="h-full flex items-center cursor-pointer py-4"
                            onMouseEnter={() => setIsShopMenuOpen(true)}
                            onMouseLeave={() => setIsShopMenuOpen(false)}
                        >
                            <Link to="/products" onClick={() => setIsShopMenuOpen(false)} className={`${getLinkClass('/products')} flex items-center gap-1.5`}>
                                Shop <span className={`text-[10px] transition-colors ${isShopMenuOpen ? 'text-[#E51A22]' : 'text-gray-400'}`}>▼</span>
                            </Link>
                            
                            {/* Mega Menu */}
                            <div className={`absolute top-full left-0 w-full flex justify-center transition-all duration-300 z-50 ${isShopMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-2'}`}>
                                <div className="w-full max-w-[1200px] bg-white shadow-2xl border border-gray-100 rounded-b-2xl overflow-hidden">
                                    <div className="grid grid-cols-4 divide-x divide-gray-100 p-8">
                                        {/* Col 1: Shop By Age */}
                                        <div className="px-6 flex flex-col items-center">
                                            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Shop By Age</h3>
                                            <div className="flex flex-col gap-4 text-center w-full">
                                                {['0-6 Months', '6-12 Months', '1-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years'].map(age => (
                                                    <Link key={age} to={`/products?age=${encodeURIComponent(age)}`} onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">{age}</Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Col 2: Categories */}
                                        <div className="px-6 flex flex-col items-center">
                                            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Toy Categories</h3>
                                            <div className="flex flex-col gap-4 text-center w-full">
                                                {categories.slice(0, 8).map(cat => (
                                                    <Link key={cat._id} to={`/products?category=${encodeURIComponent(cat.name)}`} onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors truncate">
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-auto pt-6 text-center">
                                                <Link to="/categories" onClick={() => setIsShopMenuOpen(false)} className="text-[13px] font-bold text-[#E51A22] hover:underline flex items-center justify-center gap-1">View All Categories <span className="text-lg">→</span></Link>
                                            </div>
                                        </div>

                                        {/* Col 3: Collections */}
                                        <div className="px-6 flex flex-col items-center">
                                            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Collections</h3>
                                            <div className="flex flex-col gap-4 text-center w-full">
                                                {collections.map(col => (
                                                    <Link key={col._id} to={`/products?collection=${col._id}`} onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors truncate">
                                                        {col.name}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-auto pt-6 text-center">
                                                <Link to="/collections" onClick={() => setIsShopMenuOpen(false)} className="text-[13px] font-bold text-[#E51A22] hover:underline flex items-center justify-center gap-1">View All Collections <span className="text-lg">→</span></Link>
                                            </div>
                                        </div>

                                        {/* Col 4: Shop By Price */}
                                        <div className="px-6 flex flex-col items-center">
                                            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Shop By Price</h3>
                                            <div className="flex flex-col gap-4 text-center w-full">
                                                <Link to="/products?maxPrice=299" onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">Under ₹299</Link>
                                                <Link to="/products?maxPrice=499" onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">Under ₹499</Link>
                                                <Link to="/products?maxPrice=699" onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">Under ₹699</Link>
                                                <Link to="/products?maxPrice=999" onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">Under ₹999</Link>
                                                <Link to="/products?minPrice=1000" onClick={() => setIsShopMenuOpen(false)} className="text-[14.5px] font-bold text-gray-700 hover:text-[#E51A22] transition-colors">Above ₹999</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/products?category=Educational" className={getLinkClass('/products', 'Educational', 'category')}>Educational</Link>
                        <Link to="/products?gender=Boys" className={getLinkClass('/products', 'Boys', 'gender')}>Boys</Link>
                        <Link to="/products?gender=Girls" className={getLinkClass('/products', 'Girls', 'gender')}>Girls</Link>
                        <Link to="/about" className={getLinkClass('/about')}>About Us</Link>
                        <Link to="/contact" className={getLinkClass('/contact')}>Contact Us</Link>
                    </nav>

                    {/* Right: Empty space to balance the nav */}
                    <div className="flex-1 flex justify-end">
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown & Backdrop */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="lg:hidden fixed inset-0 top-[108px] bg-black/40 backdrop-blur-xs z-30 transition-opacity" 
                    />
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl z-40 flex flex-col py-5 px-6 origin-top border-t border-slate-100 max-h-[calc(100vh-120px)] overflow-y-auto">
                        <nav className="flex flex-col gap-3 text-[15px] font-bold text-slate-800">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Home</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>All Products</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Categories</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Collections</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <div className="my-2 border-t border-slate-100" />
                            <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3">Shop By Gender</div>
                            <div className="grid grid-cols-2 gap-2 px-3">
                                <Link to="/products?gender=Boys" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                                    Boys
                                </Link>
                                <Link to="/products?gender=Girls" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center bg-pink-50 text-pink-700 rounded-xl font-bold text-sm hover:bg-pink-100 transition-colors">
                                    Girls
                                </Link>
                            </div>
                            <div className="my-2 border-t border-slate-100" />
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>My Orders</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>About Us</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Contact Us</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;
