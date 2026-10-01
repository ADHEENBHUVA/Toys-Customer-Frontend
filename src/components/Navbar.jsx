import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { getCartCount, getWaitlistCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="w-full relative z-50 bg-white" style={{ fontFamily: '"Nunito", "Outfit", sans-serif' }}>
            {/* Top Bar - Solid Blue with Exact Downward Scallops */}
            <div className="bg-[#1782a4] text-white text-[12px] md:text-[14px] h-[42px] flex justify-center md:justify-between items-center px-4 md:px-16 relative z-10">
                <div className="flex items-center gap-2.5 font-medium tracking-wide">
                    {/* Custom SVG Truck matching the image */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="12" height="10" rx="1"></rect>
                        <path d="M14 6h3.5l3.5 4v6h-7"></path>
                        <circle cx="6.5" cy="17" r="2.5"></circle>
                        <circle cx="16.5" cy="17" r="2.5"></circle>
                        <text x="8" y="12.5" fontSize="4.5" fontWeight="bold" stroke="none" fill="currentColor" textAnchor="middle" style={{ fontFamily: 'sans-serif' }}>FREE</text>
                    </svg>
                    <span>Free free shipping with over ₹150</span>
                </div>
                <div className="hidden md:flex gap-8 font-medium">
                    {token ? (
                        <>
                            <Link to="/orders" className="hover:text-yellow-300 transition-colors">My Account</Link>
                            <button onClick={handleLogout} className="hover:text-yellow-300 transition-colors">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-yellow-300 transition-colors">Login</Link>
                            <Link to="/register" className="hover:text-yellow-300 transition-colors">Register</Link>
                        </>
                    )}
                </div>
                {/* Perfect Downward Scallop CSS - Exact Semi-circles without gaps */}
                <div
                    className="absolute left-0 right-0 top-full h-[12px] w-full z-10"
                    style={{
                        backgroundImage: 'radial-gradient(20px 12px at 50% 0%, #1782a4 98%, transparent 100%)',
                        backgroundSize: '40px 12px',
                        backgroundRepeat: 'repeat-x'
                    }}
                ></div>
            </div>

            {/* Main Navbar */}
            <div className="px-4 md:px-16 py-6 flex items-center justify-between mt-3">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    {/* Simulated R logo from figma */}
                    <div className="flex h-10 items-end">
                        <div className="w-2.5 h-full bg-[#82cfd7]"></div>
                        <div className="w-2.5 h-[80%] bg-[#fceb20]"></div>
                        <div className="w-2.5 h-[60%] bg-[#ff868e]"></div>
                        <span className="text-[38px] font-black text-[#2e4053] -ml-5 leading-none mb-[-2px]">R</span>
                    </div>
                    <div className="flex flex-col text-[16px] font-black leading-[1.1] tracking-tight text-[#2e4053]">
                        <span>rainboow</span>
                        <span>rattles</span>
                    </div>
                </Link>

                {/* Center Links */}
                <nav className="hidden lg:flex gap-10 font-bold text-[#2e4053] text-[15px]">
                    <Link to="/" className="hover:text-[#1282a2] transition-colors">Home</Link>
                    <Link to="/products" className="hover:text-[#1282a2] transition-colors">Shop</Link>
                    <Link to="/pages" className="hover:text-[#1282a2] transition-colors">Pages</Link>
                    <Link to="/blog" className="hover:text-[#1282a2] transition-colors">Blog</Link>
                    <Link to="/contact" className="hover:text-[#1282a2] transition-colors">Contact</Link>
                </nav>

                {/* Right Tools & Mobile Toggle */}
                <div className="flex items-center gap-4 md:gap-6">
                    <form onSubmit={handleSearch} className="relative hidden md:block w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-slate-300 rounded-full pl-5 pr-12 py-2.5 text-[14px] focus:outline-none focus:border-[#1282a2] transition-all text-[#2e4053] font-medium placeholder-slate-400"
                        />
                        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1282a2] hover:bg-[#0f6c87] text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                            <Search className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </form>
                    
                    <Link to="/waitlist" className="relative text-slate-700 hover:text-[#ff6b6b] transition-colors ml-2">
                        <Heart className="w-6 h-6" strokeWidth={1.5} />
                        {getWaitlistCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#ff6b6b] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                {getWaitlistCount()}
                            </span>
                        )}
                    </Link>

                    <Link to="/cart" className="relative text-slate-700 hover:text-[#1282a2] transition-colors">
                        <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#fceb20] text-[#2e4053] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <button 
                        className="lg:hidden text-slate-700 hover:text-[#1282a2] transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-7 h-7" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    {/* Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col p-6 animate-slide-in-right">
                        <div className="flex justify-end mb-8">
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                <X className="w-6 h-6" strokeWidth={2} />
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-8">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-slate-300 rounded-full pl-5 pr-12 py-3 text-[15px] focus:outline-none focus:border-[#1282a2] transition-all text-[#2e4053] font-medium placeholder-slate-400"
                            />
                            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1282a2] hover:bg-[#0f6c87] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                <Search className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </form>

                        <nav className="flex flex-col gap-6 text-[18px] font-bold text-[#2e4053] mb-8 border-b border-slate-100 pb-8">
                            <Link to="/" className="hover:text-[#1282a2]">Home</Link>
                            <Link to="/products" className="hover:text-[#1282a2]">Shop</Link>
                            <Link to="/pages" className="hover:text-[#1282a2]">Pages</Link>
                            <Link to="/blog" className="hover:text-[#1282a2]">Blog</Link>
                            <Link to="/contact" className="hover:text-[#1282a2]">Contact</Link>
                        </nav>

                        <div className="flex flex-col gap-4 text-[16px] font-bold text-slate-500">
                            {token ? (
                                <>
                                    <Link to="/orders" className="flex items-center gap-2 hover:text-[#1282a2]"><span className="w-2 h-2 rounded-full bg-[#fceb20]"></span> My Account</Link>
                                    <button onClick={handleLogout} className="text-left flex items-center gap-2 hover:text-red-500"><span className="w-2 h-2 rounded-full bg-red-400"></span> Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-2 hover:text-[#1282a2]"><span className="w-2 h-2 rounded-full bg-[#82cfd7]"></span> Login</Link>
                                    <Link to="/register" className="flex items-center gap-2 hover:text-[#1282a2]"><span className="w-2 h-2 rounded-full bg-[#ff868e]"></span> Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
