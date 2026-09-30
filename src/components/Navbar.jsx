import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { getCartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');

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
            <div className="bg-[#1282a2] text-white text-[13px] md:text-[14px] h-10 flex justify-between items-center px-4 md:px-16 relative z-10">
                <div className="flex items-center gap-2 font-medium tracking-wide">
                    {/* Custom SVG Truck matching the image */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="12" height="10" rx="1"></rect>
                        <path d="M14 6h3.5l3.5 4v6h-7"></path>
                        <circle cx="6.5" cy="17" r="2.5"></circle>
                        <circle cx="16.5" cy="17" r="2.5"></circle>
                        <text x="8" y="12.5" fontSize="4.5" fontWeight="bold" stroke="none" fill="currentColor" textAnchor="middle" style={{ fontFamily: 'sans-serif' }}>FREE</text>
                    </svg>
                    <span>Free  free shipping with over $150</span>
                </div>
                <div className="flex gap-6 font-medium">
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
                {/* Perfect Downward Scallop CSS - Exact Semi-circles */}
                <div
                    className="absolute left-0 right-0 top-full h-[12px] w-full z-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 0%, #1282a2 50%, transparent 50.5%)',
                        backgroundSize: '24px 12px',
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

                {/* Right Tools */}
                <div className="flex items-center gap-6">
                    <Link to="/cart" className="relative text-slate-700 hover:text-[#1282a2] transition-colors">
                        <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#fceb20] text-[#2e4053] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
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
                </div>
            </div>
        </header>
    );
};

export default Navbar;
