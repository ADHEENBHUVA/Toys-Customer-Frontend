import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Shield, Leaf, Heart as HeartIcon, Bell, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Dashboard = () => {
    const { addToCart, waitlistItems, toggleWaitlist, shippingSettings, websiteSettings } = useCart();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);

    // Continuous Scroll & Drag states
    const categoryContainerRef = React.useRef(null);
    const animationRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [dynamicGap, setDynamicGap] = useState(32);
    // Banners
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeBanners = banners.filter(b => b.platform === (isMobile ? 'Mobile' : 'PC'));

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeBanners.length, isMobile]);

    const currentBanner = activeBanners.length > 0 ? activeBanners[currentBannerIndex] : null;

    const prevBanner = () => {
        if (activeBanners.length === 0) return;
        setCurrentBannerIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
    };

    const nextBanner = () => {
        if (activeBanners.length === 0) return;
        setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
    };


    // Brands
    const [brands, setBrands] = useState([]);

    // Testimonials
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const [isTestimonialTransitioning, setIsTestimonialTransitioning] = useState(true);

    // Promo Media
    const [promoMedia, setPromoMedia] = useState([]);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                if (res.ok) {
                    const data = await res.json();
                    setTrendingProducts(data);
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };
        const fetchBanners = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/active`);
                if (res.ok) {
                    const data = await res.json();
                    setBanners(data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
        const fetchAllProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products`);
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data);
                }
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        };
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/categories`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setDbCategories(json.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/testimonials`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setTestimonials(json.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/brands`);
                if (res.ok) {
                    const data = await res.json();
                    setBrands(data);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        const fetchPromoMedia = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/promomedia`);
                if (res.ok) {
                    const data = await res.json();
                    setPromoMedia(data);
                }
            } catch (error) {
                console.error('Error fetching promo media:', error);
            }
        };

        fetchTrendingProducts();
        fetchBanners();
        fetchAllProducts();
        fetchCategories();
        fetchTestimonials();
        fetchBrands();
        fetchPromoMedia();
    }, []);

    // Testimonials auto-slider
    useEffect(() => {
        if (testimonials.length <= 3 && window.innerWidth >= 768) return;
        if (testimonials.length <= 1 && window.innerWidth < 768) return;

        const interval = setInterval(() => {
            setIsTestimonialTransitioning(true);
            setTestimonialIdx(prev => prev + 1);
        }, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const handleTestimonialTransitionEnd = () => {
        if (testimonialIdx >= testimonials.length) {
            setIsTestimonialTransitioning(false);
            setTestimonialIdx(0);
        }
    };

    // Process categories dynamically based on DB categories
    const categoryMap = {};
    allProducts.forEach(product => {
        if (product.category) {
            let catKey = typeof product.category === 'object' ? (product.category._id || product.category.name) : product.category;
            if (catKey) {
                categoryMap[catKey] = (categoryMap[catKey] || 0) + 1;
            }
        }
    });

    // Default images mapping
    const catImages = [
        'https://images.unsplash.com/photo-1522771731472-31ebed253c82?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558066191-ffc45778a48b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522771930-78848d9287ec?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
    ];

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
        if (imagePath.startsWith('/gallery')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const dynamicCategories = dbCategories.map((dbCat, idx) => {
        const imageUrl = dbCat.image ? getImageUrl(dbCat.image) : catImages[idx % catImages.length];
        const count = (categoryMap[dbCat.name] || 0) + (categoryMap[dbCat._id] || 0);
        return {
            name: dbCat.name,
            count: count,
            img: imageUrl
        };
    });

    // If no categories from backend, use fallback
    const categories = dynamicCategories.length > 0 ? dynamicCategories : [
        { name: 'Nursery', count: 20, img: catImages[0] },
        { name: 'Toys & Games', count: 35, img: catImages[1] },
        { name: 'Feeding', count: 25, img: catImages[2] },
        { name: 'Baby Gear', count: 30, img: catImages[3] },
        { name: 'Clothing', count: 40, img: catImages[4] },
        { name: 'Bath & Care', count: 25, img: catImages[5] }
    ];

    // Calculate perfect dynamic gap to ensure exactly whole categories fit on screen
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const targetStride = 176; // 144px width + roughly 32px gap
            const count = Math.max(1, Math.floor(w / targetStride));
            const leftover = w - (count * 144);
            const gap = leftover / count;
            // Cap the gap on mobile so they aren't too far apart, 
            // and partial visibility helps indicate horizontal scrolling.
            setDynamicGap(w < 768 ? 20 : gap);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Continuous smooth auto-scroll (requestAnimationFrame)
    useEffect(() => {
        if (!dbCategories || dbCategories.length === 0) return;

        const animate = () => {
            const container = categoryContainerRef.current;
            if (container && !isHovered && !isDragging) {
                container.scrollLeft += 1; // Adjust speed here (1px per frame)

                // Seamless infinite loop: jump back when reaching the middle of duplicated content
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [dbCategories, isHovered, isDragging]);

    const handleManualScroll = (direction) => {
        const container = categoryContainerRef.current;
        if (!container) return;

        const stride = 144 + dynamicGap;
        const currentScroll = container.scrollLeft;

        // Find nearest snap point
        let currentIndex = Math.round(currentScroll / stride);
        const itemsToScroll = window.innerWidth < 768 ? 1 : 3;

        let targetIndex = direction === 'left' ? currentIndex - itemsToScroll : currentIndex + itemsToScroll;
        let targetScroll = targetIndex * stride;

        // Handle boundaries
        if (direction === 'left' && targetScroll < 0) {
            container.scrollLeft = container.scrollWidth / 2 + currentScroll;
            targetScroll = container.scrollWidth / 2 + (targetIndex * stride);
        } else if (direction === 'right' && targetScroll > container.scrollWidth / 2) {
            container.scrollLeft = currentScroll - (container.scrollWidth / 2);
            targetScroll = targetScroll - (container.scrollWidth / 2);
        }

        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragDistance(0);
        setStartX(e.pageX - categoryContainerRef.current.offsetLeft);
        setScrollLeftPos(categoryContainerRef.current.scrollLeft);
    };

    const handleMouseLeaveDrag = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - categoryContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        setDragDistance(Math.abs(walk));
        categoryContainerRef.current.scrollLeft = scrollLeftPos - walk;
    };
    const StarRating = ({ rating = 5, count }) => (
        <div className="flex items-center gap-1.5 mt-1">
            <div className="flex text-[#e8b960] text-[12px]">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= rating ? '★' : '☆'}</span>
                ))}
            </div>
            {count && <span className="text-[11px] text-[#9ca3af]">({count})</span>}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-[#fcfaf7] font-sans text-[#4a3e3d]">

            {/* Top Info Strip */}
            <div className="w-full bg-[#fdf2f2] border-b border-[#fce8e8] py-2 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:flex flex-row justify-between lg:justify-around items-center text-[13px] font-bold text-[#d13a3a] max-w-[1400px] mx-auto px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[16px]">🚚</span>
                        <span className="opacity-90">
                            {shippingSettings ? (
                                shippingSettings.isFreeShippingActive ? (
                                    `Free shipping on orders over ₹${shippingSettings.freeShippingMinAmount}${shippingSettings.freeShippingMinItems > 0 ? ` or ${shippingSettings.freeShippingMinItems}+ items` : ''}`
                                ) : (
                                    `Standard shipping applies`
                                )
                            ) : (
                                `Free shipping on orders over ₹999`
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-90">
                        <span className="text-[16px]">♥</span> Safe. Natural. Made for little ones.
                    </div>
                    <div className="flex items-center gap-2 opacity-90">
                        <span className="text-[16px]">⟲</span> Easy returns within 7 days
                    </div>
                </div>

                {/* Mobile Marquee View */}
                <div className="flex md:hidden whitespace-nowrap overflow-hidden relative w-full">
                    <style>
                        {`
                        @keyframes mobileMarquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-mobile-marquee {
                            animation: mobileMarquee 15s linear infinite;
                            display: flex;
                            width: max-content;
                        }
                        `}
                    </style>
                    <div className="animate-mobile-marquee text-[12px] font-bold text-[#d13a3a] items-center">
                        {/* First Set */}
                        <div className="flex items-center gap-8 px-4 opacity-90">
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">⟲</span> 7-day returns</div>
                        </div>
                        {/* Duplicate Set for continuous loop */}
                        <div className="flex items-center gap-8 px-4 opacity-90">
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">⟲</span> 7-day returns</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section - Multi-Banner Carousel */}
            <div className="w-full bg-[#FDFBF7] pt-4 md:pt-8 pb-2 overflow-hidden">
                <div className="w-full mx-auto px-4 relative group/hero">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        navigation={{
                            prevEl: '.hero-prev',
                            nextEl: '.hero-next',
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={activeBanners.length > 3}
                        className="!pb-6" // Space for pagination
                    >
                        {activeBanners.length > 0 ? activeBanners.map((banner, idx) => (
                            <SwiperSlide key={idx} className="h-full">
                                <Link to={banner.buttonLink || "/products"} className="block relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm group">
                                    <img
                                        src={banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : `http://localhost:5000${banner.image}`}
                                        alt={banner.title || "Hero"}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' }}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                </Link>
                            </SwiperSlide>
                        )) : (
                            // Fallback slides if no active banners
                            [1, 2, 3].map((_, idx) => (
                                <SwiperSlide key={idx} className="h-full">
                                    <div className="block relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm">
                                        <img
                                            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
                                            alt="Hero"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <button className="hero-prev absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-lg hidden md:flex cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/hero:opacity-100">
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    <button className="hero-next absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-lg hidden md:flex cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/hero:opacity-100">
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                </div>
            </div>



            {/* Categories */}
            <div className="w-full pt-16 pb-8 text-center bg-white">
                <div className="w-full mx-auto px-4 md:px-6">
                    <h2 className="text-[28px] md:text-[36px] font-black text-[#111] mb-2 tracking-tight uppercase">Toy Categories</h2>
                    <p className="text-[#555] text-[15px] mb-10 font-bold uppercase tracking-wider">Everything your little one needs</p>
                </div>

                <div
                    className="relative w-full py-4 group/slider bg-white"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Left Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('left')}
                        className="absolute left-4 top-[88px] -translate-y-1/2 z-20 text-white p-2 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-125 hidden md:flex items-center justify-center cursor-pointer drop-shadow-md"
                    >
                        <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
                    </button>

                    {/* Right Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('right')}
                        className="absolute right-4 top-[88px] -translate-y-1/2 z-20 text-white p-2 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-125 hidden md:flex items-center justify-center cursor-pointer drop-shadow-md"
                    >
                        <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
                    </button>


                    <style>
                        {`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                        `}
                    </style>
                    <div
                        ref={categoryContainerRef}
                        className={`flex overflow-x-auto hide-scrollbar pt-2 pb-6 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                        style={{ gap: `${dynamicGap}px` }}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveDrag}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Duplicate categories exactly twice for seamless loop math */}
                        {[...dbCategories, ...dbCategories, ...dbCategories, ...dbCategories].map((cat, idx) => {
                            const productCount = allProducts.filter(p => p.category === cat.name).length;
                            return (
                                <Link
                                    to={`/products?search=${encodeURIComponent(cat.name)}`}
                                    key={idx}
                                    onClick={(e) => { if (dragDistance > 5) e.preventDefault(); }}
                                    className="group flex flex-col items-center justify-start flex-shrink-0"
                                    style={{ width: '144px' }}
                                >
                                    <div className="w-36 h-36 mb-4 shadow-sm flex items-center justify-center overflow-hidden rounded-full border-[2px] border-transparent transition-all duration-300 group-hover:border-[#e6a27a] bg-gray-50">
                                        <img src={getImageUrl(cat.image)} alt={cat.name} draggable="false" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                                    </div>
                                    <span className="font-bold text-[#111] text-[15px] text-center uppercase tracking-wide group-hover:text-[#e6a27a] transition-colors">{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="w-full bg-[#FDFBF7] pt-8 pb-10">
                <div className="w-full mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center text-center mb-10">
                        <span className="text-[#E51A22] text-[13px] font-bold uppercase tracking-[0.2em] mb-2">EXPLORE</span>
                        <h2 className="text-[32px] md:text-[40px] font-black text-[#1A1A24] leading-tight mb-2">
                            Explore Popular Toy Set
                        </h2>
                        <p className="text-[#555] text-[15px] md:text-[18px]">Smart, Fun & Creative Toys for Every Little Adventure</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-2 md:px-0">
                        {[...allProducts]
                            .filter(product => product.status !== 'Out of Stock')
                            .sort((a, b) => {
                                if (a.bestSeller && !b.bestSeller) return -1;
                                if (!a.bestSeller && b.bestSeller) return 1;
                                return (b.reviewCount || 0) - (a.reviewCount || 0);
                            })
                            .slice(0, visibleCount)
                            .map((product, idx) => (
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-white rounded-3xl border-2 border-transparent hover:border-red-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden">
                                    <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-[#F8F9FA]">
                                        {/* Discount Badge */}
                                        {product.originalPrice > product.price && (
                                            <div className="absolute top-3 left-3 z-30 pointer-events-none">
                                                <span className="bg-[#E51A22] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-0.5">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                                    {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Soft dark overlay on hover to make icons pop */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                        
                                        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-400 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all border border-white/50"
                                                title="Wishlist"
                                            >
                                                <HeartIcon
                                                    className="w-5 h-5 transition-colors"
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"}
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#888"}
                                                    strokeWidth={2.2}
                                                />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-[#E51A22] hover:text-white text-[#333] hover:scale-110 transition-all border border-white/50"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                                            </button>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out p-4">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow text-left bg-white relative">
                                        <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                        
                                        {/* Ratings Display */}
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <div className="flex items-center gap-0.5 text-[#F5A623]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-gray-400 font-bold tracking-widest pt-0.5">({product.reviewCount || 0})</span>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="font-semibold text-[#1A1A24] text-[16px] md:text-[17px] mb-1.5 hover:text-[#E51A22] transition-colors leading-snug line-clamp-1">
                                            {product.name}
                                        </Link>
                                        
                                        <div className="text-[13px] text-gray-500/90 mb-4 flex flex-col">
                                            <div className="line-clamp-2 leading-relaxed">
                                                {product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.trim()) || "A wonderful toy designed for endless hours of fun and creativity for kids of all ages."}
                                            </div>
                                            <Link to={`/product/${product._id}`} className="inline-flex items-center gap-1.5 text-[#E51A22] font-black hover:gap-2.5 transition-all mt-2 self-start text-[11px] uppercase tracking-widest">
                                                View Details 
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                                            </Link>
                                        </div>

                                        <div className="flex flex-col mt-auto pt-1">
                                            <div className="flex items-center justify-between gap-2">
                                                {product.status === 'Out of Stock' ? (
                                                    <span className="font-semibold text-gray-500 text-[16px]">Out of Stock</span>
                                                ) : (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-semibold text-[#1A1A24] text-[18px] md:text-[20px]">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                        {product.originalPrice > (product.price || 0) && (
                                                            <span className="text-[13px] text-gray-400 line-through font-medium">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Action Buttons */}
                    {visibleCount < allProducts.length && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 px-4 md:px-0">
                            <button onClick={() => setVisibleCount(prev => prev + 10)} className="group bg-white text-[#3d3130] border border-[#e5d9cc] shadow-sm hover:shadow-md hover:border-[#e6a27a] px-10 py-3.5 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center">
                                Load More
                                <ChevronRight className="w-5 h-5 text-[#e6a27a] group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link to="/products" className="group bg-[#e6a27a] text-white shadow-sm hover:shadow-md hover:bg-[#d58f66] px-10 py-3.5 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center">
                                View All Products
                                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Shop By Age - Premium Circular 'Story' Style */}
            <div className="w-full bg-[#FDFBF7] pt-16 pb-24 border-y border-gray-100/50">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">

                    <div className="flex flex-col items-center justify-center text-center mb-16">
                        <span className="text-[#E51A22] text-[13px] font-bold uppercase tracking-[0.2em] mb-3">CURATED FOR GROWTH</span>
                        <h2 className="text-[32px] md:text-[44px] font-black text-[#1A1A24] leading-tight mb-4">
                            Shop By Age
                        </h2>
                        <div className="w-16 h-1 bg-[#1A1A24] rounded-full mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 md:gap-x-10 lg:gap-x-16 gap-y-12 justify-items-center max-w-[1400px] mx-auto">
                        {[
                            { age: '0-12', label: 'Months', title: 'Infants', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', color: '#FF6B6B' },
                            { age: '1-2', label: 'Years', title: 'Toddlers', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80', color: '#FFB84D' },
                            { age: '3-4', label: 'Years', title: 'Preschool', img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80', color: '#4ECDC4' },
                            { age: '5-7', label: 'Years', title: 'Little Kids', img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80', color: '#45B7D1' },
                            { age: '8+', label: 'Years', title: 'Big Kids', img: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=600&q=80', color: '#9B59B6' },
                        ].map((item, idx) => {
                            const shapes = [
                                {
                                    // 1. Scalloped Cloud / Flower (Beautiful & Fluffy)
                                    path: "M 50 5 A 16 16 0 0 1 72 12 A 16 16 0 0 1 90 32 A 16 16 0 0 1 95 56 A 16 16 0 0 1 83 78 A 16 16 0 0 1 61 93 A 16 16 0 0 1 39 93 A 16 16 0 0 1 17 78 A 16 16 0 0 1 5 56 A 16 16 0 0 1 10 32 A 16 16 0 0 1 28 12 A 16 16 0 0 1 50 5 Z",
                                    border: '#DFA32B', bg: '#FFFDF9', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '✨', decoLeft: '💧', decoRight: '🧡',
                                    posLeft: 'top-2 -left-4 md:top-2 md:-left-6',
                                    posRight: 'bottom-4 -right-4 md:bottom-6 md:-right-6'
                                },
                                {
                                    // 2. Bear Face (Maximized scale, reaching edges)
                                    path: "M 50 98 A 43 43 0 0 0 90 38 A 18 18 0 0 0 65 15 A 43 43 0 0 0 35 15 A 18 18 0 0 0 10 38 A 43 43 0 0 0 50 98 Z",
                                    border: '#C1888B', bg: '#FFFDF9', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🛁', decoLeft: '🧸', decoRight: '🧩',
                                    posLeft: 'bottom-12 -left-4 md:bottom-16 md:-left-8',
                                    posRight: '-top-2 -right-2 md:-top-4 md:-right-4'
                                },
                                {
                                    // 3. Perfect Circle (Classic, Maximum visibility)
                                    path: "M 50 5 A 45 45 0 1 1 49.99 5 Z",
                                    border: '#90B4EB', bg: '#FFFDF9', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '☁️', decoLeft: '☂️', decoRight: '🛡️',
                                    posLeft: '-top-4 -left-2 md:-top-6 md:-left-2',
                                    posRight: 'top-1/2 -right-4 md:top-1/2 md:-right-8 -translate-y-1/2'
                                },
                                {
                                    // 4. Rounded Square / iOS Squircle (Modern, Premium)
                                    path: "M 50 5 C 85 5 95 15 95 50 C 95 85 85 95 50 95 C 15 95 5 85 5 50 C 5 15 15 5 50 5 Z",
                                    border: '#8F5A40', bg: '#FFFDF9', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🌙', decoLeft: '🌙', decoRight: '✨',
                                    posLeft: 'top-1/2 -left-4 md:top-1/2 md:-left-6 -translate-y-1/2',
                                    posRight: 'bottom-0 -right-4 md:-bottom-2 md:-right-6'
                                },
                                {
                                    // 5. Window Arch (Scaled up to match other shapes)
                                    path: "M 5 50 A 45 45 0 0 1 95 50 L 95 85 Q 95 98 80 98 L 20 98 Q 5 98 5 85 Z",
                                    border: '#86EFAC', bg: '#F0FDF4', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🌿', decoLeft: '☀️', decoRight: '🐞',
                                    posLeft: '-top-4 left-6 md:-top-6 md:left-8',
                                    posRight: '-top-2 right-0 md:-top-2 md:-right-2'
                                }
                            ];
                            const style = shapes[idx % shapes.length];
                            const clipId = `age-clip-perfect-${idx}`;

                            return (
                                <Link
                                    to={`/products?age=${encodeURIComponent(item.age + ' ' + item.label)}`}
                                    key={idx}
                                    className="group flex flex-col items-center justify-start transition-transform duration-300 hover:-translate-y-2 mt-4 relative"
                                >
                                    {/* Image Container with SVG Clip Path & Decorations */}
                                    <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 mb-6 flex items-center justify-center">

                                        {/* Outer floating decorations - Continuous Bounce on hover */}
                                        {style.decoLeft && (
                                            <div className={`absolute ${style.posLeft || '-top-1 -left-4 md:top-1 md:-left-6'} opacity-100 transition-all z-30 group-hover:-translate-y-3 group-hover:scale-110`}>
                                                <div 
                                                    className="bg-white/90 backdrop-blur-md rounded-2xl p-2 md:p-2.5 flex items-center justify-center rotate-[-12deg] group-hover:animate-bounce transition-all duration-300 group-hover:rotate-0"
                                                    style={{ border: `2px solid ${style.border}50`, boxShadow: `0 8px 24px ${style.border}30` }}
                                                >
                                                    <span className="text-xl md:text-2xl drop-shadow-sm">{style.decoLeft}</span>
                                                </div>
                                            </div>
                                        )}
                                        {style.decoRight && (
                                            <div className={`absolute ${style.posRight || 'bottom-1 -right-4 md:bottom-2 md:-right-6'} opacity-100 transition-all z-30 group-hover:-translate-y-3 group-hover:scale-110`}>
                                                <div 
                                                    className="bg-white/90 backdrop-blur-md rounded-2xl p-2 md:p-2.5 flex items-center justify-center rotate-[12deg] group-hover:animate-bounce transition-all duration-300 group-hover:rotate-0" 
                                                    style={{ border: `2px solid ${style.border}50`, boxShadow: `0 8px 24px ${style.border}30`, animationDelay: '0.2s' }}
                                                >
                                                    <span className="text-xl md:text-2xl drop-shadow-sm">{style.decoRight}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Inner Wrapper for shape scaling */}
                                        <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                                            {/* The Thin Border SVG */}
                                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-md">
                                                <path d={style.path} fill="none" stroke={style.border} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                            {/* The SVG Mask for Image */}
                                            <svg width="0" height="0" className="absolute">
                                                <defs>
                                                    <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                                                        <path d={style.path} transform="scale(0.01)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                            {/* Pure image wrapped in clipPath - NO padding, NO inset */}
                                            <div
                                                className="absolute inset-0 w-full h-full bg-white z-10"
                                                style={{ clipPath: `url(#${clipId})` }}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <h3 className="font-bold text-[18px] md:text-[20px] mb-1 flex items-center gap-2 group-hover:text-[#E51A22] transition-colors" style={{ color: style.textPrimary }}>
                                        <span className="text-[20px] opacity-80">{style.icon}</span>
                                        {item.title}
                                    </h3>
                                    <p className="text-[14px] md:text-[15px] font-medium tracking-wide" style={{ color: style.textSecondary }}>
                                        {item.age} {item.label}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>



            {/* Promo Media (Videos & Images) - Limited Edition Style */}
            {promoMedia && promoMedia.length > 0 && (
                <div className="w-full bg-[#FDFBF7] pt-8 pb-8">
                    <div className="w-full mx-auto px-4 md:px-8">
                        <div className="mb-8 text-center md:text-left">
                            <span className="text-[#E51A22] text-[12px] font-bold uppercase tracking-widest mb-1 block">EXCLUSIVE COLLECTIONS</span>
                            <h2 className="text-[28px] md:text-[36px] font-black text-[#1A1A24] mb-2 font-['Outfit']">Limited-edition playtime drops</h2>
                            <p className="text-[#555] text-[15px] max-w-2xl font-medium">Explore our limited-edition toy drops, crafted for unforgettable playtime moments and available only while exclusive stocks last.</p>
                        </div>

                        <div className="w-full relative group/promo">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={16}
                                slidesPerView={2}
                                breakpoints={{
                                    640: { slidesPerView: 3 },
                                    768: { slidesPerView: 4 },
                                    1024: { slidesPerView: 5 },
                                    1280: { slidesPerView: 5 },
                                }}
                                navigation={{
                                    prevEl: '.promo-prev',
                                    nextEl: '.promo-next',
                                }}
                                autoplay={{ delay: 10000, disableOnInteraction: false }}
                                loop={promoMedia.length > 3}
                                className="w-full"
                            >
                                {promoMedia.map((media) => (
                                    <SwiperSlide key={media._id}>
                                        <div className="flex flex-col h-full bg-transparent group/card">
                                            <Link to={media.link || "/products"} className="relative w-full aspect-[4/5] rounded-t-[20px] overflow-hidden bg-[#F8F9FA] border-x border-t border-slate-200 block group-hover/card:border-red-100 transition-colors">
                                                {media.type === 'video' ? (
                                                    <video
                                                        src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `http://localhost:5000${media.mediaUrl || ''}`}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 pointer-events-none"
                                                    />
                                                ) : (
                                                    <img
                                                        src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `http://localhost:5000${media.mediaUrl || ''}`}
                                                        alt={media.title}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 pointer-events-none"
                                                    />
                                                )}
                                            </Link>
                                            <Link to={media.link || "/products"} className="bg-white p-3 rounded-b-[20px] border-x border-b border-slate-200 flex items-center gap-3 group-hover/card:border-red-100 group-hover/card:bg-red-50/30 transition-all h-[70px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] group-hover/card:shadow-[0_8px_30px_rgba(229,26,34,0.08)]">
                                                {media.type === 'image' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100">
                                                        <img src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `http://localhost:5000${media.mediaUrl || ''}`} alt="thumb" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {media.type === 'video' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100 flex items-center justify-center group-hover/card:border-red-200 transition-colors">
                                                        <span className="text-[#E51A22] text-[16px] translate-x-[1px]">▶</span>
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <span className="font-bold text-[#1A1A24] text-[13px] truncate w-full leading-tight">{media.title || 'Exclusive Toy'}</span>
                                                    <span className="font-bold text-[#E51A22] text-[11px] truncate w-full leading-tight mt-0.5">{media.subtitle || 'Explore Now'}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="promo-prev absolute left-2 top-[40%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-md opacity-0 group-hover/promo:opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <button className="promo-next absolute right-2 top-[40%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-md opacity-0 group-hover/promo:opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top 10 Trending Products */}
            <div className="w-full bg-white pt-8 pb-8">
                <div className="w-full mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center text-center mb-10">
                        <span className="text-[#E51A22] text-[13px] font-bold uppercase tracking-[0.2em] mb-2">CURATED</span>
                        <h2 className="text-[32px] md:text-[40px] font-black text-[#222E42] leading-tight mb-2">
                            Best Selling Picks
                        </h2>
                        <p className="text-[#555] text-[15px] md:text-[18px]">Top-rated toys loved by parents and kids alike</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-2 md:px-0">
                        {[...allProducts]
                            .filter(product => product.status !== 'Out of Stock')
                            .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
                            .slice(0, 10)
                            .map((product) => (
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-white rounded-3xl border-2 border-transparent hover:border-red-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden">
                                    <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-[#F8F9FA]">
                                        {/* Discount Badge */}
                                        {product.originalPrice > product.price && (
                                            <div className="absolute top-3 left-3 z-30 pointer-events-none">
                                                <span className="bg-[#E51A22] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-0.5">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                                    {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Soft dark overlay on hover to make icons pop */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                        
                                        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-400 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all border border-white/50"
                                                title="Wishlist"
                                            >
                                                <HeartIcon
                                                    className="w-5 h-5 transition-colors"
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"}
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#888"}
                                                    strokeWidth={2.2}
                                                />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-[#E51A22] hover:text-white text-[#333] hover:scale-110 transition-all border border-white/50"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
                                            </button>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out p-4">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow text-left bg-white relative">
                                        <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                        
                                        {/* Ratings Display */}
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <div className="flex items-center gap-0.5 text-[#F5A623]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-gray-400 font-bold tracking-widest pt-0.5">({product.reviewCount || 0})</span>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="font-semibold text-[#1A1A24] text-[16px] md:text-[17px] mb-1.5 hover:text-[#E51A22] transition-colors leading-snug line-clamp-1">
                                            {product.name}
                                        </Link>
                                        
                                        <div className="text-[13px] text-gray-500/90 mb-4 flex flex-col">
                                            <div className="line-clamp-2 leading-relaxed">
                                                {product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.trim()) || "A wonderful toy designed for endless hours of fun and creativity for kids of all ages."}
                                            </div>
                                            <Link to={`/product/${product._id}`} className="inline-flex items-center gap-1.5 text-[#E51A22] font-black hover:gap-2.5 transition-all mt-2 self-start text-[11px] uppercase tracking-widest">
                                                View Details 
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                                            </Link>
                                        </div>

                                        <div className="flex flex-col mt-auto pt-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-semibold text-[#1A1A24] text-[18px] md:text-[20px]">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[13px] text-gray-400 line-through font-medium">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex justify-center items-center mt-12 px-4 md:px-0">
                        <Link to="/products" className="group bg-white text-[#3d3130] border border-[#e5d9cc] shadow-sm hover:shadow-md hover:border-[#e6a27a] px-10 py-3.5 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center">
                            Load More
                            <ChevronRight className="w-5 h-5 text-[#e6a27a] group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Brands Marquee - Premium Continuous Ticker */}
            {brands.length > 0 && (
                <div className="w-full pt-12 pb-16 overflow-hidden bg-white font-['Outfit'] border-y border-slate-100/50">
                    <div className="text-center mb-12 px-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10"></div>
                        <span className="inline-block bg-white px-4 text-[#E51A22] text-[13px] font-black uppercase tracking-[0.25em] mb-2">TOP PARTNERS</span>
                        <h2 className="text-[32px] md:text-[40px] font-black text-[#1A1A24] bg-white px-4 inline-block">Brands We Trust</h2>
                    </div>

                    <style>
                        {`
                        @keyframes marquee-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee-scroll {
                            animation: marquee-scroll 25s linear infinite;
                        }
                        .animate-marquee-scroll:hover {
                            animation-play-state: paused;
                        }
                        
                        /* Mask for smooth fade at edges */
                        .marquee-container {
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                        `}
                    </style>

                    <div className="w-full relative overflow-hidden marquee-container max-w-[1600px] mx-auto py-10">
                        {/* 
                            We duplicate the brands array 4 times to ensure enough content 
                            for seamless infinite scroll across all screen sizes 
                        */}
                        <div className="flex animate-marquee-scroll w-max hover:pause items-center">
                            {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => {
                                const brandShapes = [
                                    { path: "M 20 6 L 80 6 C 92 6 95 12 95 24 L 95 76 C 95 88 92 94 80 94 L 20 94 C 8 94 5 88 5 76 L 5 24 C 5 12 8 6 20 6 Z", bg: '#FFF0F5', border: '#FFB6C1', emoji1: '🧸', emoji2: '🎈', pos1: '-top-3 -left-2', pos2: '-bottom-3 -right-2' }, // 1. Rounded Squircle
                                    { path: "M 50 6 A 44 44 0 1 1 49.99 6 Z", bg: '#F0FFFF', border: '#87CEFA', emoji1: '🚀', emoji2: '⭐', pos1: '-top-3 -right-2', pos2: '-bottom-3 -left-2' }, // 2. Soft Circle
                                    { path: "M 25 24 C 28 12 45 10 52 20 C 60 10 78 12 82 24 C 94 28 96 46 92 60 C 95 74 86 88 74 88 C 65 92 55 88 48 85 C 40 92 25 90 18 82 C 8 76 6 60 12 50 C 6 38 14 26 25 24 Z", bg: '#F5FFFA', border: '#98FB98', emoji1: '🚂', emoji2: '☁️', pos1: 'top-1/4 -left-4', pos2: 'bottom-1/4 -right-4' }, // 3. Fluffy Cloud
                                    { path: "M 28 10 L 72 10 C 90 10 95 26 95 50 C 95 74 90 90 72 90 L 28 90 C 10 90 5 74 5 50 C 5 26 10 10 28 10 Z", bg: '#FFFACD', border: '#F0E68C', emoji1: '🧩', emoji2: '🎲', pos1: '-top-4 left-1/3', pos2: '-bottom-3 right-1/4' }, // 4. Wide Stadium Pill
                                    { path: "M 50 6 C 60 6 88 20 92 28 C 96 36 96 64 92 72 C 88 80 60 94 50 94 C 40 94 12 80 8 72 C 4 64 4 36 8 28 C 12 20 40 6 50 6 Z", bg: '#F8F8FF', border: '#DDA0DD', emoji1: '🐣', emoji2: '🍼', pos1: 'top-8 -right-3', pos2: 'bottom-4 -left-3' }, // 5. Rounded Hexagon
                                    { path: "M 50 8 C 80 6 94 24 92 50 C 90 76 78 92 50 92 C 22 92 8 76 8 50 C 8 24 24 10 50 8 Z", bg: '#F0FFF0', border: '#90EE90', emoji1: '🦖', emoji2: '🌿', pos1: '-bottom-3 right-1/3', pos2: '-top-3 left-1/4' }, // 6. Bubbly Blob 1
                                    { path: "M 32 8 L 68 8 C 82 8 92 18 92 32 L 92 68 C 92 82 82 92 68 92 L 32 92 C 18 92 8 82 8 68 L 8 32 C 8 18 18 8 32 8 Z", bg: '#E6E6FA', border: '#BA55D3', emoji1: '🦄', emoji2: '✨', pos1: '-top-3 left-1/2', pos2: '-bottom-3 right-3' }, // 7. Soft Rounded Box
                                    { path: "M 50 8 C 60 8 68 4 76 10 C 84 16 90 14 94 22 C 98 30 94 40 96 50 C 98 60 94 70 90 78 C 86 86 78 84 72 90 C 66 96 56 94 50 94 C 44 94 34 96 28 90 C 22 84 14 86 10 78 C 6 70 2 60 4 50 C 6 40 2 30 6 22 C 10 14 16 16 24 10 C 32 4 40 8 50 8 Z", bg: '#FFE4E1', border: '#F08080', emoji1: '🎀', emoji2: '🌸', pos1: 'top-1/4 -right-3', pos2: 'bottom-1/4 -left-3' }, // 8. Scalloped Daisy
                                    { path: "M 20 12 C 40 8 60 8 80 12 C 92 28 94 62 82 80 C 68 92 50 94 50 94 C 50 94 32 92 18 80 C 6 62 8 28 20 12 Z", bg: '#E0FFFF', border: '#00CED1', emoji1: '🐬', emoji2: '🌊', pos1: '-bottom-3 -left-2', pos2: '-top-3 -right-2' }, // 9. Wide Crest
                                    { path: "M 50 14 C 55 6 68 6 74 14 C 84 14 92 24 90 34 C 96 42 96 56 88 64 C 88 74 78 82 68 80 C 60 88 44 88 36 80 C 26 82 14 74 14 64 C 6 56 6 42 12 34 C 10 24 18 14 28 14 C 34 6 46 6 50 14 Z", bg: '#FFDAB9', border: '#FF8C00', emoji1: '🐝', emoji2: '🍯', pos1: '-top-2 left-10', pos2: '-bottom-2 right-10' } // 10. Bubbly Clover
                                ];
                                const style = brandShapes[idx % brandShapes.length];

                                return (
                                <div key={`brand-${idx}-${brand._id}`} className="flex items-center justify-center px-4 md:px-6 py-6">
                                    <div className="relative w-[150px] h-[150px] md:w-[170px] md:h-[170px] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer group">
                                        {/* Floating Toy Emojis on hover */}
                                        <div className={`absolute ${style.pos1} z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:-rotate-12 pointer-events-none`}>
                                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-100 animate-bounce">
                                                <span className="text-xl drop-shadow-sm">{style.emoji1}</span>
                                            </div>
                                        </div>
                                        <div className={`absolute ${style.pos2} z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-2 group-hover:rotate-12 pointer-events-none`}>
                                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-100 animate-bounce" style={{ animationDelay: '0.2s' }}>
                                                <span className="text-xl drop-shadow-sm">{style.emoji2}</span>
                                            </div>
                                        </div>

                                        {/* Background Playful Shape */}
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-0 drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300 group-hover:rotate-1">
                                            <path 
                                                d={style.path} 
                                                fill={style.bg} 
                                                stroke={style.border} 
                                                strokeWidth="2.5" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                className="transition-all duration-300 group-hover:stroke-[3.5px]" 
                                            />
                                        </svg>

                                        {/* Brand Logo Container - Generous bounds with NO clipping mask so all logos (e.g. Mattel, Lego, Barbie) fit 100% completely */}
                                        <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-7">
                                            <div className="w-full h-full flex items-center justify-center max-w-[85%] max-h-[70%]">
                                                <img
                                                    src={brand.logo ? (brand.logo.startsWith('data:') ? brand.logo : (brand.logo.startsWith('/uploads/') ? 'http://localhost:5000' + brand.logo : brand.logo)) : 'https://via.placeholder.com/150'}
                                                    alt={brand.name}
                                                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Loved by Parents */}
            <div className="max-w-[1400px] mx-auto pt-8 pb-16 px-4 md:px-6 text-center font-['Outfit']">
                <div className="mb-2 text-[#E51A22]">✦</div>
                <h2 className="text-[32px] font-black text-[#1A1A24] mb-2">Loved by Parents</h2>
                <p className="text-[#555] font-medium text-[15px] mb-12">Real stories from our happy Little Joys family.</p>

                <div className="relative overflow-hidden w-full py-6">
                    <div
                        className={`flex gap-6 ${isTestimonialTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                        style={{ transform: `translateX(calc(-${testimonialIdx * (100 / (window.innerWidth < 768 ? 1 : 3))}% - ${testimonialIdx * (24 / (window.innerWidth < 768 ? 1 : 3))}px))` }}
                        onTransitionEnd={handleTestimonialTransitionEnd}
                    >
                        {[...testimonials, ...testimonials].map((test, index) => (
                            <div key={`${test._id || test.name}-${index}`} className="bg-white border border-slate-100 rounded-[2rem] p-8 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] min-w-[100%] md:min-w-[calc(33.333%-16px)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:border-red-50 cursor-default group">
                                <p className="text-[#555] font-medium text-[14px] leading-relaxed mb-6 min-h-[80px]">
                                    "{test.text}"
                                </p>
                                <div className="text-[#fbdf14]">
                                    <StarRating rating={test.rating || 5} />
                                </div>
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 group-hover:border-red-50 transition-colors">
                                    <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 group-hover:border-red-100 transition-colors" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#1A1A24] text-[14px]">{test.name}</span>
                                        <span className="text-[11px] font-bold text-[#E51A22] tracking-wider uppercase">{test.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
