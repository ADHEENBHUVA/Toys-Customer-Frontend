import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [brandCategories, setBrandCategories] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (location.state?.showConfetti) {
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 },
                    colors: ['#3B82F6', '#FF4B2B', '#FFD700', '#00C9FF', '#92FE9D'],
                    zIndex: 9999
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 },
                    colors: ['#3B82F6', '#FF4B2B', '#FFD700', '#00C9FF', '#92FE9D'],
                    zIndex: 9999
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());

            // Clean up state so it doesn't trigger again on refresh
            navigate('/', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const fetchBannersData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/active`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBanners(data);
                    if (data.length <= 1) setCurrentSlide(0);
                } else {
                    setBanners([]);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
                setBanners([]);
            } finally {
                setLoadingBanners(false);
            }
        };

        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) setTrendingProducts(data);
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/brands`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) setBrandCategories(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBannersData();
        fetchBrands();
        fetchTrendingProducts();
    }, []);

    const displayBanners = banners.filter(b => b.platform === (isMobile ? 'Mobile' : 'PC') || (!b.platform && !isMobile));

    // Auto-slide logic
    useEffect(() => {
        if (displayBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [displayBanners.length]);

    const nextSlide = () => {
        if (displayBanners.length <= 1) return;
        setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (displayBanners.length <= 1) return;
        setCurrentSlide((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
    };

    // Age Categories Definition
    const ageCategories = [
        { name: '0-18 months', icon: '👶', bg: 'bg-gradient-to-br from-[#FFE9D6] to-[#FFD8B5]' },
        { name: '18-36 months', icon: '🧸', bg: 'bg-gradient-to-br from-[#FFD6E8] to-[#FFBBD7]' },
        { name: '3-5 years', icon: '🎨', bg: 'bg-gradient-to-br from-[#FFF3C7] to-[#FFE68C]' },
        { name: '5-7 years', icon: '🚀', bg: 'bg-gradient-to-br from-[#D6FFF3] to-[#B3FFE6]' },
        { name: '7-9 years', icon: '🎮', bg: 'bg-gradient-to-br from-[#D6E8FF] to-[#A3CCFF]' },
        { name: '9-12 years', icon: '🎯', bg: 'bg-gradient-to-br from-[#E8D6FF] to-[#D1B3FF]' },
        { name: '12+ years', icon: '🎧', bg: 'bg-gradient-to-br from-[#FFD6E8] to-[#FFBDE3]' }
    ];

    // Features Section
    const features = [
        { title: 'Free & Fast Shipping', desc: 'On orders over ₹500', icon: '🚚', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: '100% Safe Materials', desc: 'Certified non-toxic toys', icon: '🛡️', color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Easy 30-Day Returns', desc: 'No questions asked', icon: '↩️', color: 'text-blue-600', bg: 'bg-rose-50' },
        { title: '24/7 Support', desc: 'Always here to help', icon: '💬', color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            {/* 1. Enhanced Hero Slider */}
            <div className="w-full pt-4 pb-8 px-4 md:px-8 lg:px-12 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50 to-slate-50 -z-10"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-100 rounded-full opacity-40"></div>
                <div className="absolute top-20 -left-20 w-96 h-96 bg-yellow-100 rounded-full opacity-40"></div>
                
                <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative border border-white/60 bg-white group/slider">
                    {loadingBanners ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 animate-pulse">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-medium text-lg tracking-wide">Loading amazing toys...</p>
                        </div>
                    ) : displayBanners.length > 0 ? (
                        <>
                            <div className="relative w-full h-full">
                                {displayBanners.map((banner, index) => (
                                    <div 
                                        key={index} 
                                        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
                                        onClick={() => banner.buttonLink && (window.location.href = banner.buttonLink)}
                                    >
                                        <img
                                            src={banner.image}
                                            alt={banner.title || `Banner ${index + 1}`}
                                            className="w-full h-full object-cover object-center transform group-hover/slider:scale-105 transition-transform duration-[2000ms] ease-out"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/default-banner.jpg'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-center px-8 md:px-20 text-white">
                                            {banner.title && (
                                                <div className="p-8 md:p-12 lg:p-14 rounded-[2rem] max-w-2xl transform translate-y-4 hover:translate-y-0 transition-all duration-700 border border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-black/30 hover:bg-black/40">
                                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)] text-white tracking-tight mb-4 font-['Nunito'] leading-tight">{banner.title}</h2>
                                                    {banner.subtitle && <p className="text-white/95 text-lg md:text-xl lg:text-2xl font-bold mb-8 drop-shadow-md">{banner.subtitle}</p>}
                                                    <button className="bg-white text-blue-700 hover:bg-blue-600 hover:text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 active:scale-95 text-lg md:text-xl tracking-wide uppercase">
                                                        Explore Now
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Slider Controls */}
                            {displayBanners.length > 1 && (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-slate-900 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg opacity-0 group-hover/slider:opacity-100 hover:scale-110 border border-white/20">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-slate-900 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg opacity-0 group-hover/slider:opacity-100 hover:scale-110 border border-white/20">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    

                                </>
                            )}
                        </>
                    ) : (
                        // Fallback Default Banner
                        <div className="w-full h-full relative group/fallback">
                            <img
                                src="/default-banner.jpg"
                                alt="Welcome to Appifly Toys"
                                className="w-full h-full object-cover object-center transform group-hover/fallback:scale-105 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-center px-10 md:px-24 text-white">
                                <div className="max-w-2xl">
                                    <span className="inline-block px-5 py-2 mb-4 rounded-full bg-white/20 border border-white/40 backdrop-blur-md text-white font-black text-sm md:text-base tracking-widest uppercase shadow-sm">Premium Collection</span>
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] font-['Nunito'] leading-[1.1]">
                                        MAGIC<br />OF PLAY
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold text-slate-100 mb-10 drop-shadow-lg leading-relaxed">
                                        Explore the extraordinary with our premium collection of toys and educational adventures.
                                    </p>
                                    <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-white text-blue-700 hover:bg-blue-600 hover:text-white w-max px-10 py-4 rounded-full font-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] active:scale-95 text-lg uppercase tracking-wide">
                                        Shop the Magic
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. New Section: "Why Choose Appifly Toys?" */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-20 -mt-6 md:-mt-6 relative z-10">
                <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-4 md:p-8 border border-slate-100 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 md:gap-6">
                    {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-4 flex-1 min-w-[200px] group cursor-default">
                            <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-50`}>
                                {feat.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm lg:text-base group-hover:text-blue-600 transition-colors">{feat.title}</h4>
                                <p className="text-slate-500 text-xs lg:text-sm font-medium">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
                
                {/* 3. Upgraded Category Cards (Shop by Age) */}
                <div className="mb-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Curated For Every Stage</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito']">Shop by Age</h2>
                        </div>
                        <Link to="/products" className="hidden sm:flex text-slate-500 font-bold hover:text-blue-600 items-center gap-2 group transition-colors">
                            Explore All Ages <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors"><svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
                        {ageCategories.map((age, idx) => (
                            <Link
                                to={`/products?age=${encodeURIComponent(age.name)}`}
                                key={age.name}
                                className={`relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 transform hover:-translate-y-3 ${age.bg} group border border-white/50 backdrop-blur-sm`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/30 rounded-full mix-blend-overlay group-hover:scale-150 transition-transform duration-700"></div>
                                <span className="text-4xl md:text-6xl mb-3 md:mb-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-xl relative z-10">
                                    {age.icon}
                                </span>
                                <span className="font-black text-slate-800/90 text-sm md:text-base text-center relative z-10 tracking-wide">
                                    {age.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 4. Special Promotional Banner (Deal of the Day) */}
                <div className="w-full mb-20 rounded-3xl overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow duration-300 group border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 z-0 opacity-95 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/30 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl opacity-60"></div>
                    
                    <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                        <div className="max-w-2xl text-center md:text-left flex-1">
                            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-black text-xs tracking-widest uppercase border border-white/40 shadow-sm">Limited Time Offer</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight font-['Nunito'] drop-shadow-md">The Great Winter Toy Sale!</h2>
                            <p className="text-white/95 text-base md:text-lg font-bold mb-6 drop-shadow-sm max-w-xl">Get up to 40% off on premium educational sets and action figures.</p>
                            <Link to="/products" className="inline-block bg-white text-rose-600 hover:bg-rose-50 px-8 py-3 rounded-full font-black shadow-lg transition-transform hover:scale-105 active:scale-95 text-base uppercase tracking-wide">
                                Shop The Sale
                            </Link>
                        </div>
                        <div className="w-full md:w-auto flex justify-center relative md:pr-10">
                            <div className="w-40 h-40 md:w-48 md:h-48 bg-white/20 rounded-full absolute mix-blend-overlay animate-pulse -z-10"></div>
                            {/* Placeholder for a hero toy image, using emoji for now */}
                            <span className="text-[80px] md:text-[120px] drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 transform group-hover:rotate-12 relative z-10">🚀</span>
                        </div>
                    </div>
                </div>

                {/* 5. Enhanced Trending Toys Grid */}
                <div className="mb-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Most Loved</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito']">Trending Toys</h2>
                        </div>
                        <Link to="/products" className="hidden sm:flex text-slate-500 font-bold hover:text-blue-600 items-center gap-2 group transition-colors">
                            View All Toys <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors"><svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trendingProducts.length > 0 ? trendingProducts.map((product) => (
                            <div key={product._id} className="bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-2 relative">
                                <Link to={`/product/${product._id}`} className="block relative h-64 bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden">
                                    {product.newArrival && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-lg tracking-widest">
                                            NEW
                                        </div>
                                    )}
                                    {product.featuredProduct && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-lg tracking-widest">
                                            HOT
                                        </div>
                                    )}
                                    {product.thumbnailImage || (product.images && product.images.length > 0) ? (
                                        <img src={product.thumbnailImage || product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    ) : (
                                        <span className="text-6xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md">
                                            🧸
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                
                                <div className="px-2 flex-1 flex flex-col">
                                    <div className="mb-2 text-xs font-extrabold text-blue-400 uppercase tracking-widest truncate">
                                        {product.category || 'General'}
                                    </div>
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-black text-xl text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 font-['Nunito']">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="mt-auto flex items-end justify-between mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
                                            {product.compareAtPrice > product.price && (
                                                <span className="text-sm font-bold text-slate-400 line-through">
                                                    ₹{product.compareAtPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="w-full bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center gap-2 group/btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}>
                                        <svg className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 col-span-full font-medium p-10 text-center bg-white rounded-3xl border border-dashed border-slate-300">No trending products available right now. Check back later!</p>
                        )}
                    </div>
                </div>

                {/* Upgraded Category Cards (Shop by Brand) */}
                <div className="mb-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Top Quality</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito']">Shop by Brand</h2>
                        </div>
                        <Link to="/products" className="hidden sm:flex text-slate-500 font-bold hover:text-blue-600 items-center gap-2 group transition-colors">
                            All Brands <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors"><svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {brandCategories.map((brand, idx) => (
                            <Link
                                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                                key={brand.name}
                                className="relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-center justify-center hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="h-20 w-20 mb-4 flex items-center justify-center relative z-10">
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-blue-200/50 shadow-inner" style={{ display: brand.logo ? 'none' : 'flex' }}>
                                        <span className="text-4xl font-black text-blue-400 font-['Nunito']">{brand.name.charAt(0)}</span>
                                    </div>
                                </div>
                                <span className="font-black text-slate-700 text-sm md:text-base text-center relative z-10 group-hover:text-blue-600 transition-colors">
                                    {brand.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>



            </div>
        </div>
    );
};

export default Dashboard;
