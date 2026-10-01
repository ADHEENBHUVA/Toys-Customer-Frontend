import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Featured');
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [heroBanners, setHeroBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const testimonialsData = [
        { id: 1, name: "Jessica", avatar: "https://i.pravatar.cc/150?u=jessica_toys", text: "Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam", variant: 1 },
        { id: 2, name: "John Smith", avatar: "https://i.pravatar.cc/150?u=john_smith", text: "Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam vestibulum", variant: 2 },
        { id: 3, name: "Andrea", avatar: "https://i.pravatar.cc/150?u=andrea_toys", text: "Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque", variant: 3 },
        { id: 4, name: "Michael", avatar: "https://i.pravatar.cc/150?u=michael_toys", text: "Quisque egestas diam in arcu cursus euismod quis viverra. Purus in massa tempor nec.", variant: 1 },
        { id: 5, name: "Emily", avatar: "https://i.pravatar.cc/150?u=emily_toys", text: "Tincidunt eget nullam non nisi est sit amet. Egestas purus viverra accumsan in nisl nisi.", variant: 2 }
    ];

    const nextTestimonial = () => setTestimonialIndex(prev => (prev + 1) % testimonialsData.length);
    const prevTestimonial = () => setTestimonialIndex(prev => (prev - 1 + testimonialsData.length) % testimonialsData.length);

    useEffect(() => {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 10000);
        return () => clearInterval(interval);
    }, [testimonialIndex]);

    const [galleryIndex, setGalleryIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setGalleryIndex(prev => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Auto rotate hero banners
    useEffect(() => {
        if (heroBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % heroBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroBanners.length]);

    const visibleTestimonials = [
        testimonialsData[(testimonialIndex) % testimonialsData.length],
        testimonialsData[(testimonialIndex + 1) % testimonialsData.length],
        testimonialsData[(testimonialIndex + 2) % testimonialsData.length]
    ];

    const galleryImages = Array.from({ length: 20 }, (_, i) => `/gallery/img${i + 1}.jpg?v=2`);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Limit to 8 products for the exact grid look
                    setTrendingProducts(data.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };
        fetchTrendingProducts();

        const fetchHeroBanners = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/active`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setHeroBanners(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching hero banners:', error);
            }
        };
        fetchHeroBanners();
    }, []);

    const categories = [
        { name: 'Playsets', searchQuery: 'Playset', icon: '🪀', color: 'bg-[#bde8f5]' },
        { name: 'Control Toys', searchQuery: 'Control', icon: '🚙', color: 'bg-[#bde8f5]' },
        { name: 'Educational Toys', searchQuery: 'Educat', icon: '🔠', color: 'bg-[#bde8f5]' },
        { name: 'Eco- Friendly Toys', searchQuery: 'Eco', icon: '🎠', color: 'bg-[#bde8f5]' },
        { name: 'Stuffed Toys', searchQuery: 'Stuffed', icon: '🧸', color: 'bg-[#bde8f5]' }
    ];

    const CloudShape = ({ children }) => (
        <div className="relative w-28 h-20 md:w-36 md:h-28 flex items-center justify-center mt-4">
            {/* Fluffy cloud approximation matching Image 2 */}
            <div className="absolute bottom-2 left-2 right-2 h-10 md:h-12 bg-[#bde8f5] rounded-full z-0"></div>
            <div className="absolute bottom-4 left-0 w-12 h-12 md:w-16 md:h-16 bg-[#bde8f5] rounded-full z-0"></div>
            <div className="absolute bottom-6 left-6 w-14 h-14 md:w-20 md:h-20 bg-[#bde8f5] rounded-full z-0"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 md:w-24 md:h-24 bg-[#bde8f5] rounded-full z-0"></div>
            <div className="absolute bottom-4 right-0 w-14 h-14 md:w-20 md:h-20 bg-[#bde8f5] rounded-full z-0"></div>
            <div className="relative z-10 text-4xl md:text-5xl mb-2">{children}</div>
        </div>
    );

    const StarRating = ({ rating = 5 }) => {
        return (
            <div className="flex text-[#facc15] text-[15px] mt-1 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= rating ? '★' : '☆'}</span>
                ))}
            </div>
        );
    };

    const ProductCard = ({ product, badge }) => (
        <div className="flex flex-col group bg-white border-2 border-slate-200 shadow-sm rounded-3xl p-4 hover:shadow-[0_20px_50px_-12px_rgba(17,138,178,0.2)] hover:border-[#118AB2]/40 transition-all duration-500 hover:-translate-y-1 relative">
            {/* Image Container with Soft Background */}
            <div className="relative bg-slate-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-slate-100">
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {product.compareAtPrice > (product.price || 0) && (
                        <span className="bg-[#ff6b6b] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            SALE
                        </span>
                    )}
                    {badge && (
                        <span className="bg-gradient-to-r from-[#FF9800] to-[#F44336] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            {badge}
                        </span>
                    )}
                </div>

                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center">
                    {product.thumbnailImage || (product.images && product.images.length > 0) ? (
                        <img
                            src={product.thumbnailImage || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    ) : (
                        <div className="text-6xl drop-shadow-sm opacity-50">🧸</div>
                    )}
                </Link>
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-1 px-1 pt-4 pb-1">
                <Link to={`/product/${product._id}`} className="hover:text-[#118AB2] mb-1">
                    <h3 className="font-extrabold text-[#2c3e50] text-[17px] leading-snug line-clamp-2" style={{ fontFamily: '"Nunito", sans-serif' }}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2 mt-1">
                    <StarRating rating={product.rating || 5} />
                    <span className="text-[12px] font-bold text-slate-500">{(product.rating || 5.0).toFixed(1)}</span>
                </div>

                {/* Price and Action Buttons Row */}
                <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex flex-col">
                        {product.compareAtPrice > (product.price || 0) && (
                            <span className="text-[12px] text-slate-400 font-bold line-through mb-[-4px]">₹{(product.compareAtPrice || 0).toFixed(2)}</span>
                        )}
                        <span className="font-black text-[#22c55e] text-[20px] leading-none">₹{(product.price || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border hover:scale-110 ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                        >
                            <Heart className="w-[18px] h-[18px]" strokeWidth={2.5} fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); }}
                            className="w-10 h-10 bg-[#118AB2] hover:bg-[#0f7a9e] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#118AB2]/30 hover:shadow-lg hover:shadow-[#118AB2]/40 hover:scale-110"
                        >
                            <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const activeBanner = heroBanners.length > 0 ? heroBanners[currentBannerIndex] : null;

    return (
        <div className="w-full min-h-screen bg-white font-['Outfit'] pb-20">
            {/* Hero Section */}
            <div className="w-full bg-[#dbe2e6] min-h-[550px] md:min-h-[600px] relative overflow-hidden" style={{ fontFamily: '"Nunito", sans-serif' }}>
                {heroBanners.length > 0 ? heroBanners.map((banner, index) => (
                    <div
                        key={banner._id || index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
                    >
                        {/* Full Width Background Image */}
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url('${banner.image || "/baby-hero.png"}')`
                            }}
                        />
                        {/* Gradient overlay to ensure text is always readable */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent md:w-2/3"></div>

                        {/* Content Overlay */}
                        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-16 lg:px-32">
                            <div className="max-w-xl text-center md:text-left transform transition-all duration-1000 translate-y-0">
                                <h1
                                    className="text-[44px] md:text-[56px] lg:text-[72px] font-black text-[#1282a2] leading-[1.15] mb-6 tracking-tight drop-shadow-sm"
                                    style={{ textShadow: '4px 4px 0 #ffffff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
                                >
                                    {banner.title || "Play, learn, & grow!"}
                                </h1>
                                <div className="inline-block bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-[#3a4d5c] text-[18px] md:text-[20px] font-bold leading-relaxed font-['Outfit']">
                                        {banner.subtitle || "Crafting smiles with every toy, made for learning, fun, and growth"}
                                    </p>
                                </div>
                                <div>
                                    <Link to={banner.buttonLink || "/shop"}>
                                        <button className="bg-[#fbdf14] hover:bg-[#ebd013] text-[#2e4053] font-bold text-[18px] px-10 py-3.5 rounded-full transition-transform hover:-translate-y-1 shadow-lg">
                                            {banner.buttonText || "Shop now"}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    // Fallback static hero if no banners from API
                    <div className="absolute inset-0 w-full h-full opacity-100 z-20">
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url('/baby-hero.png')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent md:w-2/3"></div>

                        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-16 lg:px-32">
                            <div className="max-w-xl text-center md:text-left">
                                <h1
                                    className="text-[44px] md:text-[56px] lg:text-[72px] font-black text-[#1282a2] leading-[1.15] mb-6 tracking-tight drop-shadow-sm"
                                    style={{ textShadow: '4px 4px 0 #ffffff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
                                >
                                    Play, learn, & grow!
                                </h1>
                                <div className="inline-block bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-[#3a4d5c] text-[18px] md:text-[20px] font-bold leading-relaxed font-['Outfit']">
                                        Crafting smiles with every toy, made for learning, fun, and growth
                                    </p>
                                </div>
                                <div>
                                    <Link to="/shop">
                                        <button className="bg-[#fbdf14] hover:bg-[#ebd013] text-[#2e4053] font-bold text-[18px] px-10 py-3.5 rounded-full transition-transform hover:-translate-y-1 shadow-lg">
                                            Shop now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Find the Perfect Toy */}
                <div className="text-center mb-12 mt-8">
                    <h2 className="text-4xl font-bold text-[#2e2b2a] mb-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive', letterSpacing: '0.5px', wordSpacing: '4px' }}>
                        Find the Perfect Toy
                    </h2>
                    <p className="text-slate-500 text-[15px] font-medium">Our Collections</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
                    {categories.map((cat, idx) => (
                        <Link to={`/products?search=${encodeURIComponent(cat.searchQuery)}`} key={idx} className="flex flex-col items-center cursor-pointer group">
                            <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">
                                <CloudShape>{cat.icon}</CloudShape>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Top Picks */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-[#2e2b2a] mb-6" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive', letterSpacing: '0.5px' }}>
                        Top picks for your little ones
                    </h2>
                    <div className="flex justify-center gap-2 md:gap-4">
                        {['Featured', 'Best seller', 'New arrivals'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-[15px] font-medium transition-colors ${activeTab === tab ? 'bg-[#f4ebf9] text-[#4b5563]' : 'bg-transparent text-[#4b5563] hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20">
                    {trendingProducts.slice(0, 8).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* Banners */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-20">
                    {/* Left Banner - Discover the Joy of Play */}
                    <div className="bg-[#fff1f2] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[340px] shadow-sm hover:shadow-md transition-shadow group">
                        {/* Decorative Shapes */}
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#fef08a] rounded-full mix-blend-multiply opacity-70 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#bfdbfe] rounded-[40px] rotate-12 mix-blend-multiply opacity-70 group-hover:-rotate-12 transition-transform duration-500"></div>

                        <div className="relative z-10 max-w-[80%]">
                            <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-600 font-bold text-xs uppercase tracking-wider mb-4">New Arrivals</span>
                            <h3 className="text-4xl md:text-5xl font-black text-[#831843] mb-4 leading-tight font-['Nunito']">
                                Discover the <br /> Joy of Play
                            </h3>
                            <p className="text-pink-900/70 font-medium mb-8 text-[15px] max-w-[280px]">
                                Explore our premium collection of interactive toys for kids of all ages.
                            </p>
                            <button className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-200 transition-transform hover:-translate-y-1">
                                Explore Collection
                            </button>
                        </div>
                    </div>

                    {/* Right Banner - Eco-Friendly Toys */}
                    <div className="bg-[#f0fdfa] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[340px] shadow-sm hover:shadow-md transition-shadow group">
                        {/* Decorative Shapes */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#ccfbf1] to-transparent opacity-50 z-0"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                            <div className="flex-1 text-center md:text-left order-2 md:order-1">
                                <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-700 font-bold text-xs uppercase tracking-wider mb-4">Save 30% Today</span>
                                <h3 className="text-4xl md:text-5xl font-black text-[#134e4a] mb-4 leading-tight font-['Nunito']">
                                    Eco-Friendly <br /> Toys
                                </h3>
                                <p className="text-teal-900/60 font-medium mb-8 text-[15px]">
                                    Safe, sustainable, and super fun! Extra discount for loyal customers.
                                </p>
                                <button className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-teal-200 transition-transform hover:-translate-y-1">
                                    Shop Now
                                </button>
                            </div>

                            <div className="order-1 md:order-2 relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] shrink-0">
                                <div className="absolute inset-0 bg-[#99f6e4] rounded-full scale-105 group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="absolute inset-0 bg-white rounded-full p-2 shadow-xl">
                                    <img
                                        src="/baby-hero.png"
                                        alt="Baby playing"
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80";
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Loves */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Customer Loves</h2>
                    <p className="text-slate-500 text-sm">Popular product</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-24">
                    {trendingProducts.slice(0, 8).map((product, idx) => (
                        <ProductCard key={`love-${product._id}`} product={product} badge={idx < 4 ? "Best Seller" : "Trending"} />
                    ))}
                </div>

                {/* Testimonials */}
                <div className="text-center mb-10">
                    <h2 className="text-[34px] font-bold text-[#333333] mb-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Nunito", sans-serif' }}>
                        Hear from Other Happy Parents
                    </h2>
                    <p className="text-[#666666] text-[17px] font-medium" style={{ fontFamily: '"Nunito", sans-serif' }}>
                        Customer testimonials
                    </p>
                </div>

                <div className="relative mb-24 flex items-center px-6">
                    <button onClick={prevTestimonial} className="absolute left-0 z-10 bg-white shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[#999999] hover:text-slate-800 border-[2px] border-[#e5e5e5] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    <div className="grid md:grid-cols-3 gap-6 w-full">
                        {visibleTestimonials.map((testimonial, idx) => (
                            <div key={`${testimonial.id}-${idx}`} className="bg-[#fcf5f5] p-8 rounded-2xl relative overflow-hidden text-left border border-transparent animate-slide-left">
                                <div className="absolute top-6 right-6 text-[#d1d5db] text-[54px] font-serif leading-none rotate-180" style={{ transform: 'rotateY(180deg)' }}>"</div>

                                {/* Decorations */}
                                {testimonial.variant === 1 && (
                                    <>
                                        <div className="absolute top-10 right-14 text-[#ffc1cc] text-lg flex gap-1 -rotate-12">
                                            <span className="translate-y-2 text-sm">❤</span>
                                            <span className="-translate-y-1 text-xs">❤</span>
                                            <span className="translate-y-4 text-[10px]">❤</span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 text-[#ffc1cc]">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                <path d="M6 22L12 10M2 18L7 12M12 24L16 16" />
                                            </svg>
                                        </div>
                                        <div className="absolute bottom-10 right-4 text-[#a3d9a5] opacity-80">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute -bottom-4 right-4"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                        </div>
                                    </>
                                )}
                                {testimonial.variant === 2 && (
                                    <>
                                        <div className="absolute top-10 right-16 text-[#a3d9a5] opacity-80">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute top-2 -right-6"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                        </div>
                                        <div className="absolute bottom-6 left-6 text-[#ffc1cc]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                <path d="M6 22L12 10M2 18L7 12M12 24L16 16" />
                                            </svg>
                                        </div>
                                        <div className="absolute bottom-6 right-6 text-[#ffc1cc] text-lg flex gap-2 rotate-12">
                                            <span className="-translate-y-3 text-[10px]">❤</span>
                                            <span className="translate-y-1 text-sm">❤</span>
                                            <span className="-translate-y-1 text-xs">❤</span>
                                        </div>
                                    </>
                                )}
                                {testimonial.variant === 3 && (
                                    <>
                                        <div className="absolute top-8 right-14 text-[#ffc1cc] text-lg flex gap-2 rotate-[25deg]">
                                            <span className="-translate-y-2 text-[10px]">❤</span>
                                            <span className="translate-y-1 text-sm">❤</span>
                                            <span className="translate-y-3 text-xs">❤</span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 text-[#ffc1cc]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                <path d="M6 22L12 10M2 18L7 12M12 24L16 16" />
                                            </svg>
                                        </div>
                                        <div className="absolute bottom-10 right-4 text-[#a3d9a5] opacity-80">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute -bottom-4 right-6"><path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" /></svg>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-[2px] mb-5 text-[#ffd700] text-xl">
                                    ★★★★★
                                </div>

                                <p className="text-[#7a7a7a] text-[15px] font-medium leading-relaxed mb-8 z-10 relative pr-4">
                                    {testimonial.text}
                                </p>

                                <div className="flex items-center gap-3">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                    <span className="font-semibold text-[#4a4a4a] text-[15px]">{testimonial.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={nextTestimonial} className="absolute right-0 z-10 bg-white shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[#999999] hover:text-slate-800 border-[2px] border-[#e5e5e5] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>

            </div>

            {/* Edge to Edge Gallery */}
            <div className="text-center mb-8">
                <h2 className="text-[34px] font-bold text-[#333333] mb-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Nunito", sans-serif' }}>
                    Recent photoshoots
                </h2>
                <p className="text-[#666666] text-[17px] font-medium" style={{ fontFamily: '"Nunito", sans-serif' }}>
                    Check gallery
                </p>
            </div>

            <div className="w-full overflow-hidden mb-24 max-w-[1600px] mx-auto px-4">
                <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${galleryIndex * (window.innerWidth < 768 ? 50 : 25)}%)` }}
                >
                    {Array(100).fill(galleryImages).flat().map((src, idx) => (
                        <div key={`gallery-item-${idx}`} className="w-1/2 md:w-1/4 shrink-0 px-2 aspect-square">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <img src={src} className="w-full h-full object-cover" alt={`Photoshoot ${idx + 1}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Customer Care */}
                    <div className="rounded-[24px] bg-[#f4f9fd] py-8 px-4 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="mb-4">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2bb0e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <circle cx="12" cy="12" r="6" stroke="none" fill="#f4f9fd" />
                                <text x="12" y="14.5" fontSize="6.5" fontWeight="bold" textAnchor="middle" stroke="none" fill="#2bb0e3">24</text>
                            </svg>
                        </div>
                        <h4 className="font-semibold text-[#2bb0e3] text-[18px] mb-1">Customer care</h4>
                        <p className="text-[#666666] text-[14px]">24h hour follow up</p>
                    </div>

                    {/* Free Ship */}
                    <div className="rounded-[24px] bg-[#fffaf5] py-8 px-4 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="mb-4 relative">
                            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#f48624" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                                <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
                                <circle cx="7" cy="18" r="2" />
                                <circle cx="17" cy="18" r="2" />
                                <text x="8.5" y="12" fontSize="3.5" fontWeight="bold" textAnchor="middle" stroke="none" fill="#f48624">FREE</text>
                            </svg>
                        </div>
                        <h4 className="font-semibold text-[#f48624] text-[18px] mb-1">Free ship</h4>
                        <p className="text-[#666666] text-[14px]">Free shipping for ₹150 and up</p>
                    </div>

                    {/* Return */}
                    <div className="rounded-[24px] bg-[#f4fcf6] py-8 px-4 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="mb-4">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#1abf52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="7" r="4" />
                                <path d="M12 4.5v5" />
                                <path d="M10.5 5.5c0-1 3-1 3 0s-3 1-3 0" />
                                <path d="M10.5 7.5c0 1 3 1 3 0" />
                                <path d="M4 14c2-1 4-1 6 0l2 1c2 1 4 1 6 0l2-1" />
                                <path d="M4 17c2-1 4-1 6 0l2 1c2 1 4 1 6 0l2-1" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-[#1abf52] text-[18px] mb-1">Return</h4>
                        <p className="text-[#666666] text-[14px]">Within 7 days</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
