import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) user = JSON.parse(userStr);
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }

    const { getCartCount, shippingSettings } = useCart();

    const [dbBrands, setDbBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}`}/brands`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDbBrands(data.filter(b => b.status === 'Active'));
                }
            } catch (error) {
                console.error('Error fetching brands for navbar:', error);
            } finally {
                setBrandsLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menus = [
        {
            title: 'Shop Toys',
            items: [
                { name: 'Action Figures', icon: '🦸‍♂️' },
                { name: 'Dolls & Playsets', icon: '👑' },
                { name: 'Educational Toys', icon: '📚' },
                { name: 'Puzzles', icon: '🧩' },
                { name: 'Board Games', icon: '🎲' },
                { name: 'Remote Control', icon: '🏎️' }
            ]
        },
        {
            title: 'Toys by Age',
            items: [
                { name: '0-2 Years', desc: 'Infant & Toddler', icon: '👶' },
                { name: '3-5 Years', desc: 'Pre-school', icon: '🧸' },
                { name: '6-8 Years', desc: 'Kids', icon: '🎨' },
                { name: '9-12 Years', desc: 'Pre-teens', icon: '🚀' },
                { name: '13+ Years', desc: 'Teens & Up', icon: '🎮' }
            ]
        },
        {
            title: 'Brands',
            items: brandsLoading ? [
                { name: 'Loading...', icon: '🔄' }
            ] : dbBrands.length > 0 ? dbBrands.map(b => ({ name: b.name, logo: b.logo })) : [
                { name: 'No Brands Found', icon: '🏷️' }
            ]
        },
        {
            title: 'Sale',
            items: [
                { name: 'Clearance', icon: '💥' },
                { name: 'Deals of the Day', icon: '🔥' },
                { name: 'Under ₹500', icon: '💸' },
                { name: 'Seasonal Offers', icon: '🍂' }
            ]
        },
        {
            title: 'Return Gifts',
            items: [
                { name: 'Birthday Packs', icon: '🎁' },
                { name: 'Bulk Orders', icon: '📦' },
                { name: 'Under ₹100', icon: '💯' },
                { name: 'Educational Gifts', icon: '🔬' }
            ]
        }
    ];

    return (
        <header className="w-full flex flex-col font-sans z-50 sticky top-0">
            {/* Top Announcement Banner - Playful gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 w-full py-1.5 px-4 flex justify-center items-center gap-3 relative overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping"></div>
                <p className="text-[11px] md:text-xs text-white font-bold text-center relative z-10 tracking-wide">
                    {shippingSettings?.isFreeShippingActive ? (
                        shippingSettings.freeShippingMinAmount > 0 && shippingSettings.freeShippingMinItems > 0
                            ? `Free Magic Shipping on orders over ₹${shippingSettings.freeShippingMinAmount} & ${shippingSettings.freeShippingMinItems} items! ✨`
                            : shippingSettings.freeShippingMinAmount > 0
                                ? `Free Magic Shipping on orders over ₹${shippingSettings.freeShippingMinAmount}! ✨`
                                : shippingSettings.freeShippingMinItems > 0
                                    ? `Free Magic Shipping on ${shippingSettings.freeShippingMinItems}+ items! ✨`
                                    : 'Free Magic Shipping on all orders! ✨'
                    ) : (
                        'Welcome to Magic Toys! 🚀'
                    )}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping delay-75"></div>
            </div>

            {/* Main Premium Navbar */}
            <nav className="w-full px-4 md:px-8 py-1.5 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-b border-white/50 transition-all duration-300">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group transform transition-transform hover:scale-105 active:scale-95">
                    <img src="/logo.png" alt="Appifly Logo" className="h-12 md:h-16 object-contain" />
                </Link>

                {/* Center Links (Hidden on small screens) */}
                <div className="hidden lg:flex items-center gap-8 z-50">
                    {menus.map((menu) => (
                        <div key={menu.title} className="flex items-center cursor-pointer group relative py-4">
                            <span className="text-slate-600 text-sm font-extrabold tracking-wider group-hover:text-indigo-600 transition-colors uppercase">
                                {menu.title}
                            </span>
                            <svg className="w-4 h-4 ml-1.5 text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>

                            {/* Animated Bottom Line */}
                            <div className="absolute bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 group-hover:w-full"></div>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 transform origin-top -translate-y-4 group-hover:translate-y-1 overflow-hidden p-3">
                                <div className="grid grid-cols-1 gap-1 relative z-10">
                                    {menu.items.map((item, index) => {
                                        let paramKey = 'category';
                                        if (menu.title === 'Brands') paramKey = 'brand';
                                        else if (menu.title === 'Sale' || menu.title === 'Return Gifts') paramKey = 'collection';

                                        return (
                                            <Link key={index} to={`/products?${paramKey}=${encodeURIComponent(item.name)}`} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-indigo-50/80 transition-colors group/item">
                                                {/* Icon/Logo Wrapper with bounce on hover */}
                                                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 group-hover/item:shadow-md transition-all duration-300 group-hover/item:-rotate-6">
                                                    {item.logo ? (
                                                        <img src={item.logo} alt={item.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                    ) : item.icon ? (
                                                        <span className="text-xl">{item.icon}</span>
                                                    ) : (
                                                        <span className="text-indigo-600 font-black">{item.name ? item.name.charAt(0) : ''}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-slate-700 font-bold group-hover/item:text-indigo-700 transition-colors">
                                                        {item.name}
                                                    </span>
                                                    {item.desc && (
                                                        <span className="text-xs text-slate-400 font-semibold">{item.desc}</span>
                                                    )}
                                                </div>
                                                <svg className="w-4 h-4 ml-auto text-indigo-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side: Search & Icons */}
                <div className="flex items-center gap-4 md:gap-6">

                    {/* Modern Search Bar */}
                    <div className="hidden md:flex relative items-center group/search">
                        <div className="absolute left-4 text-slate-400 group-focus-within/search:text-purple-600 transition-colors z-10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find magic toys..."
                            className="bg-slate-100/50 border border-transparent hover:border-slate-200 rounded-full py-2.5 pl-12 pr-4 w-48 focus:w-72 text-sm text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all duration-500 shadow-inner"
                        />
                    </div>

                    {/* Auth / Account */}
                    {token ? (
                        <div className="relative group/account cursor-pointer flex items-center">
                            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] rounded-full shadow-md group-hover/account:scale-105 transition-transform">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                                    {user?.picture ? (
                                        <img src={user.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <span className="text-indigo-600 font-black text-lg">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover/account:translate-y-0 overflow-hidden p-2">
                                {user && (
                                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                        <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                                    </div>
                                )}
                                <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-2xl text-sm font-bold text-slate-700 hover:text-indigo-700 transition-colors">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    My Orders
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 text-left px-4 py-2.5 mt-1 hover:bg-rose-50 rounded-2xl text-sm font-bold text-rose-600 transition-colors">
                                    <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-slate-200 hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Sign In
                        </Link>
                    )}

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative group flex items-center justify-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-purple-300 group-hover:shadow-md transition-all transform group-hover:-translate-y-1 group-active:scale-95">
                            <svg className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                            {getCartCount()}
                        </span>
                    </Link>

                    {/* Mobile Hamburger */}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden flex">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>

                    {/* Drawer */}
                    <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slide-in-right ml-auto rounded-l-3xl">
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <img src="/logo.png" alt="Appifly Logo" className="h-10 object-contain" />
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div className="p-5">
                            <div className="relative items-center flex">
                                <div className="absolute left-4 text-indigo-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input type="text" placeholder="Search toys..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-bold transition-all" />
                            </div>
                        </div>

                        {/* Navigation Accordion */}
                        <div className="flex-1 overflow-y-auto px-3 pb-6">
                            {menus.map((menu, idx) => (
                                <div key={idx} className="mb-2">
                                    <button onClick={() => setOpenMenu(openMenu === menu.title ? null : menu.title)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-colors ${openMenu === menu.title ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                                        {menu.title}
                                        <svg className={`w-5 h-5 transition-transform duration-300 ${openMenu === menu.title ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ${openMenu === menu.title ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                        <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-inner">
                                            {menu.items.map((item, itemIdx) => {
                                                let paramKey = 'category';
                                                if (menu.title === 'Brands') paramKey = 'brand';
                                                else if (menu.title === 'Sale' || menu.title === 'Return Gifts') paramKey = 'collection';

                                                return (
                                                    <Link
                                                        key={itemIdx}
                                                        to={`/products?${paramKey}=${encodeURIComponent(item.name)}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-indigo-50 transition-colors group"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                            {item.icon ? (
                                                                <span className="text-lg">{item.icon}</span>
                                                            ) : item.logo ? (
                                                                <img src={item.logo} alt={item.name} className="w-5 h-5 object-contain" />
                                                            ) : (
                                                                <span className="font-black text-xs">{item.name ? item.name.charAt(0) : ''}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">{item.name}</span>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Footer Login/Logout */}
                        {!token && (
                            <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 active:scale-95">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Sign In / Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
