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
    const [brandSlideIndex, setBrandSlideIndex] = useState(0);
    const [isBrandTransitioning, setIsBrandTransitioning] = useState(true);

    useEffect(() => {
        if (brands.length === 0) return;
        const interval = setInterval(() => {
            setBrandSlideIndex(prev => prev + 1);
            setIsBrandTransitioning(true);
        }, 5000);
        return () => clearInterval(interval);
    }, [brands.length]);

    useEffect(() => {
        if (brands.length > 0 && brandSlideIndex >= brands.length) {
            const timeout = setTimeout(() => {
                setIsBrandTransitioning(false);
                setBrandSlideIndex(0);
            }, 1000); // 1s matches duration-1000
            return () => clearTimeout(timeout);
        }
    }, [brandSlideIndex, brands.length]);

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

    const dynamicCategories = dbCategories.map((dbCat, idx) => {
        const imageUrl = dbCat.image ? dbCat.image : catImages[idx % catImages.length];
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

            {/* Top Bar */}
            <div className="w-full bg-[#fcfaf7] border-b border-[#f3eee7] py-2.5 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:flex flex-row justify-between items-center text-[12px] font-medium text-[#8b7e7c] max-w-[1400px] mx-auto px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[#d69f7e]">🚚</span>
                        {shippingSettings ? (
                            shippingSettings.isFreeShippingActive ? (
                                `Free shipping on orders over ₹${shippingSettings.freeShippingMinAmount}${shippingSettings.freeShippingMinItems > 0 ? ` or ${shippingSettings.freeShippingMinItems}+ items` : ''}`
                            ) : (
                                `Standard shipping applies`
                            )
                        ) : (
                            `Free shipping on orders over ₹999`
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#d69f7e]">♥</span> Safe. Natural. Made for little ones.
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#d69f7e]">⟲</span> Easy returns within 7 days
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
                    <div className="animate-mobile-marquee text-[12px] font-medium text-[#8b7e7c] items-center">
                        {/* First Set */}
                        <div className="flex items-center gap-8 px-4">
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">⟲</span> 7-day returns</div>
                        </div>
                        {/* Duplicate Set for continuous loop */}
                        <div className="flex items-center gap-8 px-4">
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[#d69f7e]">⟲</span> 7-day returns</div>
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
                                        <img src={cat.image?.startsWith('http') || cat.image?.startsWith('data:') ? cat.image : `http://localhost:5000${cat.image}`} alt={cat.name} draggable="false" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
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
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-transparent">

                                    {/* Image Container */}
                                <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-[#e0efdf] rounded-[24px] md:rounded-[32px]">
                                    
                                    {/* Action Buttons (Visible on mobile, Hover on Desktop) */}
                                    <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0">
                                        {/* Waitlist Heart */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all border border-gray-100"
                                            title="Wishlist"
                                        >
                                            <HeartIcon 
                                                className="w-5 h-5 transition-colors" 
                                                fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"} 
                                                stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#666"} 
                                                strokeWidth={2}
                                            />
                                        </button>

                                        {/* Add to Cart */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 hover:scale-110 transition-all border border-gray-100"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="w-5 h-5 text-[#333]" strokeWidth={2.2} />
                                        </button>
                                    </div>

                                    <Link to={`/product/${product._id}`} className="absolute inset-2 z-10 flex items-center justify-center mix-blend-multiply">
                                        <ProductCardImageCarousel
                                            images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                            productName={product.name}
                                        />
                                    </Link>
                                </div>

                                {/* Content Section */}
                                <div className="pt-3 pb-1 flex flex-col flex-grow text-left">
                                    <Link to={`/product/${product._id}`} className="font-bold text-[#111] text-[15px] md:text-[17px] mb-1 hover:text-[#E51A22] transition-colors truncate">
                                        {product.name}
                                    </Link>

                                    <div className="flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            {product.status === 'Out of Stock' ? (
                                                <span className="font-bold text-gray-500 text-[16px]">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-[#E51A22] text-[16px] md:text-[18px]">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[12px] md:text-[13px] text-gray-400 line-through font-medium">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                    )}
                                                    {product.originalPrice > product.price && (
                                                        <span className="text-[#0E9050] text-[12px] font-bold">
                                                            [{(product.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage'
                                                                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                                                                : `Save ₹${Math.round(product.originalPrice - product.price)}`}]
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[#0E9050] font-bold text-[14px]">
                                            Club Price: ₹{`${Math.round((product.price || 0) * 0.95).toFixed(2)}`}
                                        </span>
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

                    <div className="flex flex-row flex-wrap justify-center gap-8 md:gap-12 lg:gap-20 px-2">
                        {[
                            { age: '0-12', label: 'Months', title: 'Infants', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', color: '#FF6B6B' },
                            { age: '1-2', label: 'Years', title: 'Toddlers', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80', color: '#FFB84D' },
                            { age: '3-4', label: 'Years', title: 'Preschool', img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80', color: '#4ECDC4' },
                            { age: '5-7', label: 'Years', title: 'Little Kids', img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80', color: '#45B7D1' },
                            { age: '8+', label: 'Years', title: 'Big Kids', img: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=600&q=80', color: '#9B59B6' },
                        ].map((item, idx) => (
                            <Link 
                                to={`/products?age=${encodeURIComponent(item.age + ' ' + item.label)}`} 
                                key={idx} 
                                className="group flex flex-col items-center outline-none w-[140px] md:w-[180px]"
                            >
                                {/* Gradient Ring & Image */}
                                <div className="relative w-32 h-32 md:w-44 md:h-44 mb-6 rounded-full p-[3px] transition-transform duration-500 group-hover:-translate-y-3" style={{ background: `linear-gradient(135deg, ${item.color}, transparent, ${item.color})` }}>
                                    <div className="w-full h-full bg-white rounded-full p-1.5 shadow-lg relative z-10">
                                        <div className="w-full h-full rounded-full overflow-hidden relative">
                                            <img 
                                                src={item.img} 
                                                alt={`${item.age} ${item.label}`}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            {/* Subtle overlay on hover */}
                                            <div className="absolute inset-0 bg-[#1A1A24]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Color Shadow */}
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 -z-10" style={{ backgroundColor: item.color }}></div>
                                </div>
                                
                                {/* Text Content */}
                                <div className="text-center transform transition-transform duration-500 group-hover:-translate-y-1">
                                    <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase mb-2 block" style={{ color: item.color }}>{item.title}</span>
                                    <h3 className="text-[#1A1A24] text-[24px] md:text-[32px] font-black leading-none tracking-tight mb-1">
                                        {item.age}
                                    </h3>
                                    <p className="text-gray-500 uppercase tracking-widest font-bold text-[10px] md:text-[12px]">
                                        {item.label}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Parents Choose */}
            <div className="w-full mx-auto py-10 md:py-16 px-4 md:px-6 font-['Outfit']">
                <div className="bg-[#1282a2]/5 rounded-3xl md:rounded-[3rem] flex flex-col lg:flex-row overflow-hidden border border-[#1282a2]/10 relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#1282a2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-[#e6a27a]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="w-full lg:w-1/2 p-6 md:p-14 lg:p-20 flex flex-col justify-center relative z-10">
                        <h2 className="text-[28px] md:text-[46px] font-black text-[#2e4053] mb-3 md:mb-4 leading-tight font-serif">
                            Why Parents Choose Little Joys
                        </h2>
                        <p className="text-[#666666] text-[15px] md:text-[18px] mb-8 md:mb-12 font-medium">Because your baby deserves the very best.</p>

                        <div className="grid grid-cols-2 gap-3 sm:gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 group flex flex-col">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#1282a2]/10 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform shrink-0">
                                    <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-[#1282a2]" />
                                </div>
                                <h4 className="font-bold text-[#2e4053] text-[14px] sm:text-[17px] mb-1 sm:mb-2">Safe & Non-Toxic</h4>
                                <p className="text-[#666666] text-[11px] sm:text-[14px] leading-relaxed line-clamp-3 sm:line-clamp-none">We use only non-toxic, BPA-free, and baby-safe materials.</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 group flex flex-col">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#e6a27a]/10 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform shrink-0">
                                    <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-[#e6a27a]" />
                                </div>
                                <h4 className="font-bold text-[#2e4053] text-[14px] sm:text-[17px] mb-1 sm:mb-2">Premium Quality</h4>
                                <p className="text-[#666666] text-[11px] sm:text-[14px] leading-relaxed line-clamp-3 sm:line-clamp-none">Durable, long-lasting products tested to the highest standards.</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 group flex flex-col">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#f4a261]/10 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform shrink-0">
                                    <HeartIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#f4a261]" />
                                </div>
                                <h4 className="font-bold text-[#2e4053] text-[14px] sm:text-[17px] mb-1 sm:mb-2">Gentle on Baby</h4>
                                <p className="text-[#666666] text-[11px] sm:text-[14px] leading-relaxed line-clamp-3 sm:line-clamp-none">Designed with care for your baby's sensitive skin and comfort.</p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 group flex flex-col">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#2a9d8f]/10 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform shrink-0">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M12 16V12" /><path d="M12 8H12.01" /></svg>
                                </div>
                                <h4 className="font-bold text-[#2e4053] text-[14px] sm:text-[17px] mb-1 sm:mb-2">Sustainable Choice</h4>
                                <p className="text-[#666666] text-[11px] sm:text-[14px] leading-relaxed line-clamp-3 sm:line-clamp-none">Eco-friendly materials and packaging for a better tomorrow.</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[500px] flex items-center justify-center p-4 sm:p-8 lg:p-12 z-10 bg-white lg:bg-transparent">
                        {/* Spinning Badge */}
                        <div className="absolute top-2 right-2 sm:top-12 sm:right-12 bg-white rounded-full w-20 h-20 sm:w-32 sm:h-32 flex flex-col items-center justify-center shadow-xl z-20 animate-[bounce_4s_ease-in-out_infinite]">
                            <div className="absolute inset-1 sm:inset-2 border-[1.5px] sm:border-2 border-dashed border-[#e6a27a] rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <span className="text-[9px] sm:text-[14px] font-black text-[#2e4053] leading-tight text-center uppercase tracking-wider relative z-10 mt-1">Quality<br /><span className="text-[#1282a2]">You Can</span><br />Trust</span>
                            <span className="text-[#e6a27a] text-[9px] sm:text-[12px] mt-0.5 sm:mt-1 relative z-10">⭐</span>
                        </div>

                        {/* Main Image */}
                        <div className="w-full h-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 sm:border-8 border-white group lg:-ml-12 mt-4 sm:mt-12 lg:mt-0">
                            <div className="absolute inset-0 bg-[#2e4053]/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                            <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80" alt="Quality Products" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
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
                                        <div className="flex flex-col h-full bg-transparent">
                                            <Link to={media.link || "/products"} className="relative w-full aspect-[4/5] rounded-t-[20px] overflow-hidden bg-gray-100 shadow-sm border-x border-t border-[#e2eccc] block">
                                                {media.type === 'video' ? (
                                                    <video 
                                                        src={media.mediaUrl.startsWith('http') ? media.mediaUrl : `http://localhost:5001${media.mediaUrl}`} 
                                                        autoPlay 
                                                        muted 
                                                        loop 
                                                        playsInline
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={media.mediaUrl.startsWith('http') ? media.mediaUrl : `http://localhost:5001${media.mediaUrl}`} 
                                                        alt={media.title} 
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                )}
                                            </Link>
                                            <Link to={media.link || "/products"} className="bg-[#e4f5cc] p-3 rounded-b-[20px] border border-[#d2e8b6] shadow-sm flex items-center gap-3 hover:bg-[#d8f0b3] transition-colors h-[70px]">
                                                {media.type === 'image' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-[#c4e09f]">
                                                        <img src={media.mediaUrl.startsWith('http') ? media.mediaUrl : `http://localhost:5001${media.mediaUrl}`} alt="thumb" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {media.type === 'video' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-[#c4e09f] flex items-center justify-center">
                                                        <span className="text-[#8bb553] text-xl">▶</span>
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <span className="font-bold text-[#2e4053] text-[13px] truncate w-full leading-tight">{media.title || 'Exclusive Toy'}</span>
                                                    <span className="font-bold text-[#0E9050] text-[11px] truncate w-full leading-tight mt-0.5">{media.subtitle || 'Explore Now'}</span>
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
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-transparent">
                                    <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-[#e0efdf] rounded-[24px] md:rounded-[32px]">
                                        <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all border border-gray-100"
                                                title="Wishlist"
                                            >
                                                <HeartIcon 
                                                    className="w-5 h-5 transition-colors" 
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"} 
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#666"} 
                                                    strokeWidth={2}
                                                />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 hover:scale-110 transition-all border border-gray-100"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart className="w-5 h-5 text-[#333]" strokeWidth={2.2} />
                                            </button>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="absolute inset-2 z-10 flex items-center justify-center mix-blend-multiply">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="pt-3 pb-1 flex flex-col flex-grow text-left">
                                        <Link to={`/product/${product._id}`} className="font-bold text-[#111] text-[15px] md:text-[17px] mb-1 hover:text-[#E51A22] transition-colors truncate">
                                            {product.name}
                                        </Link>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#E51A22] text-[16px] md:text-[18px]">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                {product.originalPrice > (product.price || 0) && (
                                                    <span className="text-[12px] md:text-[13px] text-gray-400 line-through font-medium">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                )}
                                                {product.originalPrice > product.price && (
                                                    <span className="text-[#0E9050] text-[12px] font-bold">
                                                        [{(product.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage'
                                                            ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                                                            : `Save ₹${Math.round(product.originalPrice - product.price)}`}]
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[#0E9050] font-bold text-[14px]">
                                                Club Price: ₹{`${Math.round((product.price || 0) * 0.95).toFixed(2)}`}
                                            </span>
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

            {/* Brands Marquee */}
            {brands.length > 0 && (
                <div className="w-full pt-4 md:pt-6 pb-6 overflow-hidden bg-[#FDFBF7]">
                    <div className="text-center mb-8 md:mb-10 px-4">
                        <div className="mb-2 text-[#E51A22]">✦</div>
                        <h2 className="text-[28px] md:text-[32px] font-black text-[#1A1A24] mb-2">Our Premium Brands</h2>
                    </div>

                    <style>
                        {`
                        .brand-track {
                            --slide-distance: 33.333333%;
                        }
                        @media (min-width: 640px) {
                            .brand-track {
                                --slide-distance: 25%;
                            }
                        }
                        @media (min-width: 768px) {
                            .brand-track {
                                --slide-distance: 20%;
                            }
                        }
                        @media (min-width: 1024px) {
                            .brand-track {
                                --slide-distance: 16.666667%;
                            }
                        }
                        `}
                    </style>

                    <div className="w-full relative overflow-hidden py-6">
                        <div
                            className={`brand-track flex items-center w-full ${isBrandTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                            style={{ transform: `translateX(calc(-${brandSlideIndex} * var(--slide-distance)))` }}
                        >
                            {[...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands].map((brand, idx) => {
                                return (
                                    <div key={`brand-${idx}-${brand._id}`} className="w-[33.333333%] sm:w-[25%] md:w-[20%] lg:w-[16.666667%] shrink-0 flex items-center justify-center">
                                        <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 flex shrink-0 items-center justify-center bg-white rounded-full border-[4px] md:border-[8px] border-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] relative overflow-hidden group p-3 md:p-5`}>
                                            <img
                                                src={brand.logo ? (brand.logo.startsWith('data:') ? brand.logo : (brand.logo.startsWith('/uploads/') ? `http://localhost:5000${brand.logo}` : brand.logo)) : 'https://via.placeholder.com/150'}
                                                alt={brand.name}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Loved by Parents */}
            <div className="max-w-[1400px] mx-auto pt-8 pb-16 px-4 md:px-6 text-center">
                <div className="mb-2 text-[#e6a27a]">♡</div>
                <h2 className="text-[32px] font-serif text-[#3d3130] mb-2">Loved by Parents</h2>
                <p className="text-[#8b7e7c] text-[15px] mb-12">Real stories from our happy Little Joys family.</p>

                <div className="relative overflow-hidden w-full py-6">
                    <div
                        className={`flex gap-6 ${isTestimonialTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                        style={{ transform: `translateX(calc(-${testimonialIdx * (100 / (window.innerWidth < 768 ? 1 : 3))}% - ${testimonialIdx * (24 / (window.innerWidth < 768 ? 1 : 3))}px))` }}
                        onTransitionEnd={handleTestimonialTransitionEnd}
                    >
                        {[...testimonials, ...testimonials].map((test, index) => (
                            <div key={`${test._id || test.name}-${index}`} className="bg-white border border-[#f3eee7] rounded-[2rem] p-8 text-left shadow-sm min-w-[100%] md:min-w-[calc(33.333%-16px)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(230,162,122,0.2)] hover:border-[#e6a27a]/40 cursor-default">
                                <p className="text-[#5e504f] text-[14px] leading-relaxed mb-6 min-h-[80px]">
                                    {test.text}
                                </p>
                                <StarRating rating={test.rating || 5} />
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f3eee7]">
                                    <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#3d3130] text-[14px]">{test.name}</span>
                                        <span className="text-[11px] text-[#8b7e7c]">{test.location}</span>
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
