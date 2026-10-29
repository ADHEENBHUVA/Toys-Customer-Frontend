import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronLeft, ChevronRight, Phone, Mail, User, Smile, Package, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount, openCart, isCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownTimeoutRef = React.useRef(null);

    const handleMouseEnter = (name) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
            dropdownTimeoutRef.current = null;
        }
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 180);
    };

    const ageMilestones = [
        { label: '0-12 Months', sub: 'Infants', icon: '✨' },
        { label: '1-2 Years', sub: 'Toddlers', icon: '🛁' },
        { label: '3-4 Years', sub: 'Preschool', icon: '☁️' },
        { label: '5-7 Years', sub: 'Little Kids', icon: '🌙' },
        { label: '8+ Years', sub: 'Big Kids', icon: '🌿' }
    ];

    const priceRanges = [
        { label: 'Under ₹299', query: 'maxPrice=299', icon: '🪙' },
        { label: 'Under ₹499', query: 'maxPrice=499', icon: '🎁' },
        { label: 'Under ₹699', query: 'maxPrice=699', icon: '⭐' },
        { label: 'Under ₹999', query: 'maxPrice=999', icon: '🎯' },
        { label: 'Above ₹999', query: 'minPrice=1000', icon: '👑' }
    ];

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

        return `transition-colors font-semibold py-2 outline-none focus:outline-none focus:ring-0 active:outline-none focus-visible:outline-none ${isActive
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
                                <Link to={localStorage.getItem('token') ? "/profile" : "/login"} className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full flex items-center justify-center text-white cursor-pointer" title="Account">
                                    <User className="w-5 h-5" />
                                </Link>
                                <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    {localStorage.getItem('token') ? (
                                        <div className="w-48 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col py-1.5 overflow-hidden transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="px-4 py-2 border-b border-gray-100 bg-rose-50/50">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                                <p className="text-xs font-black text-slate-800 truncate">
                                                    {(() => {
                                                        try {
                                                            const u = JSON.parse(localStorage.getItem('user'));
                                                            return u?.name || 'My Account';
                                                        } catch {
                                                            return 'My Account';
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                            <Link to="/profile" className="px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#E51A22] text-[13px] font-bold transition-colors flex items-center gap-2.5">
                                                <User className="w-4 h-4 text-[#E51A22]" />
                                                My Profile
                                            </Link>
                                            <Link to="/orders" className="px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#E51A22] text-[13px] font-bold transition-colors flex items-center gap-2.5">
                                                <Package className="w-4 h-4" />
                                                My Orders
                                            </Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button 
                                                onClick={() => {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                }} 
                                                className="px-4 py-2 text-left text-rose-600 hover:bg-rose-50 text-[13px] font-bold transition-colors w-full flex items-center gap-2.5 cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-44 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Link to="/login" className="w-full py-2.5 px-3 bg-[#E51A22] hover:bg-[#c9141b] text-white text-center font-bold text-xs rounded-xl shadow-xs transition-colors block">
                                                Sign In / Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Link to="/waitlist" className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full items-center justify-center text-white" title="Wishlist">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <button
                                type="button"
                                onClick={openCart}
                                className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/15 transition-colors rounded-full flex items-center justify-center text-white relative cursor-pointer"
                                title="Cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {getCartCount() > 0 && (
                                    <span className="absolute top-1 right-1 bg-white text-[#E51A22] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>

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
            <div className={`hidden lg:block w-full bg-white border-b border-gray-100 shadow-xs relative z-40 transition-all duration-300 ${isScrolled ? 'h-11' : 'h-13'}`}>
                <div className={`max-w-[1450px] mx-auto px-4 md:px-6 flex items-center ${isCartOpen ? 'justify-center' : 'justify-between'} text-[13.5px] xl:text-[14px] font-bold text-gray-700 transition-all duration-300 ${isScrolled ? 'h-11' : 'h-13'}`}>

                    {/* Left: Quick Contact (hidden when cart is open or screen < 1680px so it never overlaps with menu) */}
                    {!isCartOpen && (
                        <div className="hidden min-[1680px]:flex items-center gap-1.5 text-gray-500 hover:text-[#E51A22] transition-colors cursor-pointer shrink-0 mr-4">
                            <Mail className="w-3.5 h-3.5" />
                            <a href="mailto:support@littlejoys.com" className="tracking-wide text-[12.5px]">support@littlejoys.com</a>
                        </div>
                    )}

                    {/* Center: Main Navigation with SEPARATE Shop By Age, Categories, Collections & Price */}
                    <nav className={`flex items-center justify-center ${isCartOpen ? 'gap-2.5 lg:gap-3 xl:gap-4 text-[12.5px] xl:text-[13px]' : 'gap-4 xl:gap-6 2xl:gap-7 text-[13.5px] xl:text-[14px]'} flex-1 min-w-0 transition-all`}>
                        <Link to="/" className={getLinkClass('/')}>Home</Link>

                        {/* 1. SEPARATE: Shop By Age Dropdown */}
                        <div
                            className="relative h-full flex items-center cursor-pointer py-3"
                            onMouseEnter={() => handleMouseEnter('age')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/shop-by-age" className={`flex items-center gap-1 font-semibold py-1 transition-colors ${activeDropdown === 'age' || location.pathname === '/shop-by-age' || location.search.includes('age=') ? 'text-[#E51A22]' : 'text-gray-700 hover:text-[#E51A22]'}`}>
                                <span>Shop By Age</span>
                                <span className={`text-[8.5px] transition-transform duration-200 ${activeDropdown === 'age' ? 'rotate-180 text-[#E51A22]' : 'text-gray-400'}`}>▼</span>
                            </Link>
                            <AnimatePresence>
                                {activeDropdown === 'age' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute top-full left-0 w-56 bg-white/98 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-2 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            {ageMilestones.map(age => (
                                                <Link
                                                    key={age.label}
                                                    to={`/shop-by-age?age=${encodeURIComponent(age.label)}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center px-3 py-2 rounded-xl text-[13.5px] font-bold text-gray-700 hover:text-[#E51A22] hover:bg-rose-50/80 transition-all"
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <span className="text-base">{age.icon}</span>
                                                        <span>{age.label}</span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. SEPARATE: Toy Categories Dropdown */}
                        <div
                            className="relative h-full flex items-center cursor-pointer py-3"
                            onMouseEnter={() => handleMouseEnter('categories')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/categories" className={`flex items-center gap-1 font-semibold py-1 transition-colors ${activeDropdown === 'categories' || location.pathname === '/categories' ? 'text-[#E51A22]' : 'text-gray-700 hover:text-[#E51A22]'}`}>
                                <span>Toy Categories</span>
                                <span className={`text-[8.5px] transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180 text-[#E51A22]' : 'text-gray-400'}`}>▼</span>
                            </Link>
                            <AnimatePresence>
                                {activeDropdown === 'categories' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute top-full left-0 w-64 bg-white/98 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-2 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-0.5 max-h-[380px] overflow-y-auto pr-1">
                                            {categories.map(cat => (
                                                <Link
                                                    key={cat._id}
                                                    to={`/categories?category=${encodeURIComponent(cat.name)}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center px-3 py-2 rounded-xl text-[13.5px] font-bold text-gray-700 hover:text-[#E51A22] hover:bg-rose-50/80 transition-all"
                                                >
                                                    <span className="truncate flex items-center gap-2.5">
                                                        <span className="text-[17px] leading-none shrink-0">{cat.icon || '✨'}</span>
                                                        <span>{cat.name}</span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. SEPARATE: Collections Dropdown */}
                        <div
                            className="relative h-full flex items-center cursor-pointer py-3"
                            onMouseEnter={() => handleMouseEnter('collections')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/collections" className={`flex items-center gap-1 font-semibold py-1 transition-colors ${activeDropdown === 'collections' || location.pathname === '/collections' ? 'text-[#E51A22]' : 'text-gray-700 hover:text-[#E51A22]'}`}>
                                <span>Collections</span>
                                <span className={`text-[8.5px] transition-transform duration-200 ${activeDropdown === 'collections' ? 'rotate-180 text-[#E51A22]' : 'text-gray-400'}`}>▼</span>
                            </Link>
                            <AnimatePresence>
                                {activeDropdown === 'collections' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute top-full left-0 w-60 bg-white/98 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-2 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-0.5 max-h-[380px] overflow-y-auto pr-1">
                                            {collections.length > 0 ? (
                                                collections.map(col => (
                                                    <Link
                                                        key={col._id}
                                                        to={`/collections?collection=${col._id}`}
                                                        onClick={() => setActiveDropdown(null)}
                                                        className="flex items-center px-3 py-2 rounded-xl text-[13.5px] font-bold text-gray-700 hover:text-[#E51A22] hover:bg-rose-50/80 transition-all"
                                                    >
                                                        <span className="truncate flex items-center gap-2.5">
                                                            <span className="text-[17px] leading-none shrink-0">{col.icon || '✨'}</span>
                                                            <span>{col.name}</span>
                                                        </span>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-xs text-gray-400 italic">No collections yet</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 4. SEPARATE: Shop By Price Dropdown */}
                        <div
                            className="relative h-full flex items-center cursor-pointer py-3"
                            onMouseEnter={() => handleMouseEnter('price')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/shop-by-price" className={`flex items-center gap-1 font-semibold py-1 transition-colors ${activeDropdown === 'price' || location.pathname === '/shop-by-price' || location.search.includes('Price=') ? 'text-[#E51A22]' : 'text-gray-700 hover:text-[#E51A22]'}`}>
                                <span>Shop By Price</span>
                                <span className={`text-[8.5px] transition-transform duration-200 ${activeDropdown === 'price' ? 'rotate-180 text-[#E51A22]' : 'text-gray-400'}`}>▼</span>
                            </Link>
                            <AnimatePresence>
                                {activeDropdown === 'price' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute top-full left-0 w-52 bg-white/98 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-2 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            {priceRanges.map(price => (
                                                <Link
                                                    key={price.label}
                                                    to={`/shop-by-price?${price.query}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-bold text-gray-700 hover:text-[#E51A22] hover:bg-rose-50/80 transition-all"
                                                >
                                                    <span className="text-[17px] leading-none shrink-0">{price.icon}</span>
                                                    <span>{price.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/products?gender=Boys" className={getLinkClass('/products', 'Boys', 'gender')}>Boys</Link>
                        <Link to="/products?gender=Girls" className={getLinkClass('/products', 'Girls', 'gender')}>Girls</Link>
                        <Link to="/contact" className={getLinkClass('/contact')}>Contact Us</Link>
                    </nav>

                    {/* Right: Empty space to balance */}
                    {!isCartOpen && (
                        <div className="hidden min-[1680px]:flex items-center justify-end shrink-0 w-36 ml-4">
                        </div>
                    )}

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

                            {/* Mobile: Shop By Age */}
                            <div className="my-1 border-t border-slate-100" />
                            <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 hover:text-[#E51A22] flex items-center justify-between">
                                <span>Shop By Age</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <div className="grid grid-cols-2 gap-1.5 px-3">
                                {ageMilestones.map(age => (
                                    <Link key={age.label} to={`/shop-by-age?age=${encodeURIComponent(age.label)}`} onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 bg-slate-50 text-slate-700 rounded-lg font-bold text-xs hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-1.5 truncate">
                                        <span>{age.icon}</span>
                                        <span className="truncate">{age.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile: Categories & Collections */}
                            <div className="my-1 border-t border-slate-100" />
                            <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Toy Categories</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>Collections</span>
                                <span className="text-slate-400">›</span>
                            </Link>

                            {/* Mobile: Shop By Price */}
                            <div className="my-1 border-t border-slate-100" />
                            <Link to="/shop-by-price" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 hover:text-[#E51A22] flex items-center justify-between">
                                <span>Shop By Price</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <div className="grid grid-cols-2 gap-1.5 px-3">
                                {priceRanges.map(price => (
                                    <Link key={price.label} to={`/shop-by-price?${price.query}`} onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 bg-slate-50 text-slate-700 rounded-lg font-bold text-xs hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-2 truncate">
                                        <span className="text-sm">{price.icon}</span>
                                        <span className="truncate">{price.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile: Gender */}
                            <div className="my-1 border-t border-slate-100" />
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
                            <button
                                type="button"
                                onClick={() => { setIsMobileMenuOpen(false); openCart(); }}
                                className="w-full text-left py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-slate-500" />
                                    <span>My Cart</span>
                                    {getCartCount() > 0 && (
                                        <span className="bg-[#E51A22] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                            {getCartCount()}
                                        </span>
                                    )}
                                </div>
                                <span className="text-slate-400">›</span>
                            </button>
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between font-bold text-slate-800">
                                <span className="flex items-center gap-2"><User className="w-4 h-4 text-[#E51A22]" /> My Profile</span>
                                <span className="text-slate-400">›</span>
                            </Link>
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[#E51A22] transition-colors flex items-center justify-between">
                                <span>My Orders</span>
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
