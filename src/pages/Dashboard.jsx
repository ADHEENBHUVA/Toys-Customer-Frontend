import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Shield, Leaf, Heart as HeartIcon, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';

const Dashboard = () => {
    const { addToCart, waitlistItems, toggleWaitlist, shippingSettings, websiteSettings } = useCart();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
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

        fetchTrendingProducts();
        fetchBanners();
        fetchAllProducts();
        fetchCategories();
        fetchTestimonials();
        fetchBrands();
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
            <div className="w-full bg-[#fcfaf7] border-b border-[#f3eee7] py-2.5 px-4 flex flex-col md:flex-row justify-between items-center text-[12px] font-medium text-[#8b7e7c] gap-2 md:gap-0 max-w-[1400px] mx-auto">
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

            {/* Hero Section */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6 group/hero">
                <div className="w-full bg-gradient-to-br from-[#fcf3ea] via-[#f7e6d8] to-[#f0ccb6] rounded-3xl md:rounded-[2.5rem] relative overflow-hidden flex flex-col items-center p-5 sm:p-8 md:p-16 min-h-[380px] md:min-h-[600px]">

                    {/* Navigation Arrows */}
                    <button onClick={prevBanner} className="absolute left-2 md:left-4 top-[40%] md:top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white rounded-full flex items-center justify-center text-[#3d3130] shadow-md backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100">
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </button>
                    <button onClick={nextBanner} className="absolute right-2 md:right-4 top-[40%] md:top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white rounded-full flex items-center justify-center text-[#3d3130] shadow-md backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 md:top-10 md:left-10 text-[#e9b896] opacity-50 text-2xl md:text-4xl">✦</div>
                    <div className="absolute top-12 left-[45%] text-[#e9b896] opacity-50 text-xl md:text-2xl">✦</div>

                    <div className="flex flex-row w-full items-center justify-between z-10 flex-1">
                        {/* Left Content */}
                        <div className="w-[52%] md:w-1/2 pr-2 md:pr-4">
                            <h1 className="text-[26px] sm:text-4xl md:text-[50px] lg:text-[70px] leading-[1.15] font-serif text-[#3d3130] mb-3 md:mb-6 tracking-tight transition-opacity duration-500">
                                {currentBanner ? currentBanner.title : 'Little Things, Big Joys'}
                                <span className="inline-block ml-1 sm:ml-2 md:ml-4 text-[#e6a27a]">♡</span>
                            </h1>
                            <p className="text-[12px] sm:text-[14px] md:text-[20px] text-[#5e504f] mb-5 md:mb-10 max-w-[400px] leading-relaxed transition-opacity duration-500 line-clamp-2 md:line-clamp-none">
                                {currentBanner ? currentBanner.subtitle : 'Thoughtfully chosen essentials for every precious moment.'}
                            </p>

                            <div className="flex mb-2 sm:mb-6 md:mb-12">
                                <Link to={currentBanner?.buttonLink || "/products"} className="w-auto">
                                    <button className="bg-[#e6a27a] hover:bg-[#d99268] text-white font-medium text-[12px] md:text-[15px] px-5 md:px-8 py-2 md:py-3.5 rounded-full flex items-center justify-center gap-2 md:gap-3 transition-colors shadow-sm">
                                        {currentBanner?.buttonText || "Shop Now"} <span className="bg-white text-[#e6a27a] rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center text-[9px] sm:text-[10px] md:text-sm">→</span>
                                    </button>
                                </Link>
                            </div>

                            {/* Badges row - Desktop */}
                            <div className="hidden sm:flex flex-row flex-nowrap items-center justify-start gap-3 md:gap-10 text-[12px] font-medium text-[#5e504f] mt-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/50 flex items-center justify-center text-[#93b38c]">
                                        <Leaf className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#3d3130] text-[10px] md:text-[12px]">Safe Materials</span>
                                        <span className="text-[9px] md:text-[11px] text-[#8b7e7c] whitespace-nowrap">Non-toxic & baby-safe</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e6a27a]">
                                        <Shield className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#3d3130] text-[10px] md:text-[12px]">Trusted Quality</span>
                                        <span className="text-[9px] md:text-[11px] text-[#8b7e7c] whitespace-nowrap">Tested & certified</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e8b960]">
                                        <HeartIcon className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#3d3130] text-[10px] md:text-[12px]">Made with Love</span>
                                        <span className="text-[9px] md:text-[11px] text-[#8b7e7c] whitespace-nowrap">For happy ones</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="w-[45%] md:w-1/2 relative flex justify-end items-center">
                            <div className="absolute -top-2 right-1 sm:top-2 sm:right-2 md:top-10 md:right-10 bg-[#fdfaf7] rounded-full w-[65px] h-[65px] sm:w-[90px] sm:h-[90px] md:w-[130px] md:h-[130px] flex flex-col items-center justify-center shadow-md z-20 transition-opacity duration-500">
                                <span className="text-[6.5px] sm:text-[9px] md:text-[12px] font-medium text-[#8b7e7c]">For Every</span>
                                <span className="text-[8.5px] sm:text-[13px] md:text-[18px] font-serif text-[#3d3130] leading-tight text-center">Little<br />Adventure</span>
                                <span className="text-[#e6a27a] text-[6px] md:text-[10px] mt-0.5 md:mt-1">♡</span>
                            </div>
                            <div className="w-full relative z-10 rounded-2xl md:rounded-3xl overflow-hidden group/hero-image cursor-pointer shadow-lg">
                                <img key={currentBanner?._id} src={currentBanner ? (currentBanner.image.startsWith('http') || currentBanner.image.startsWith('data:') ? currentBanner.image : `http://localhost:5000${currentBanner.image}`) : "/baby-hero-new.png"} alt={currentBanner?.title || "Hero"} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' }} className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-in-out] transition-transform duration-700 ease-out group-hover/hero-image:scale-105 aspect-[4/5] sm:aspect-square md:aspect-[3/2]" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Badges Row - Bottom */}
                    <div className="sm:hidden w-full flex flex-row items-center justify-between gap-1 mt-6 pt-5 border-t border-[#3d3130]/10 text-[#5e504f] z-10 relative">
                        <div className="flex flex-col items-center gap-1.5 text-center flex-1">
                            <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#93b38c] shadow-sm">
                                <Leaf className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#3d3130] text-[10.5px] leading-tight mb-0.5">Safe Materials</span>
                                <span className="text-[8.5px] text-[#8b7e7c] leading-tight">Non-toxic</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 text-center flex-1">
                            <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#e6a27a] shadow-sm">
                                <Shield className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#3d3130] text-[10.5px] leading-tight mb-0.5">Trusted Quality</span>
                                <span className="text-[8.5px] text-[#8b7e7c] leading-tight">Certified</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 text-center flex-1">
                            <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#e8b960] shadow-sm">
                                <HeartIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#3d3130] text-[10.5px] leading-tight mb-0.5">Made with Love</span>
                                <span className="text-[8.5px] text-[#8b7e7c] leading-tight">For happy ones</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Categories */}
            <div className="w-full pt-16 pb-8 text-center">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <div className="mb-2 text-[#e6a27a]">♡</div>
                    <h2 className="text-[32px] font-serif text-[#3d3130] mb-2">Shop by Categories</h2>
                    <p className="text-[#8b7e7c] text-[15px] mb-12">Everything your little one needs, all in one place.</p>
                </div>

                <div
                    className="relative w-full py-4 group/slider"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Left Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('left')}
                        className="absolute left-4 top-[88px] -translate-y-1/2 z-20 bg-white/95 text-[#3d3130] p-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.15)] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#fcfaf7] hidden md:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('right')}
                        className="absolute right-4 top-[88px] -translate-y-1/2 z-20 bg-white/95 text-[#3d3130] p-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.15)] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#fcfaf7] hidden md:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6" />
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
                        className={`flex overflow-x-auto hide-scrollbar pt-6 pb-6 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
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
                                    <div className="w-36 h-36 mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center overflow-hidden rounded-full border-[6px] border-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_12px_40px_rgb(230,162,122,0.2)] bg-gray-50">
                                        <img src={cat.image?.startsWith('http') || cat.image?.startsWith('data:') ? cat.image : `http://localhost:5000${cat.image}`} alt={cat.name} draggable="false" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                                    </div>
                                    <span className="font-bold text-[#3d3130] text-[16px] text-center font-serif group-hover:text-[#e6a27a] transition-colors">{cat.name}</span>
                                    <span className="text-[13px] text-[#8b7e7c] text-center mt-0.5">{productCount} products</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-[1400px] mx-auto pt-8 pb-8 px-4 md:px-6">
                <div className="text-center mb-14">
                    <div className="mb-2 text-[#e6a27a] text-lg">♡</div>
                    <h2 className="text-[36px] font-serif text-[#3d3130] mb-2">Featured Products</h2>
                    <p className="text-[#8b7e7c] text-[16px]">Carefully selected favorites for your little ones.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-2 md:px-0">
                    {[...allProducts]
                        .filter(product => product.status !== 'Out of Stock')
                        .sort((a, b) => {
                            if (a.bestSeller && !b.bestSeller) return -1;
                            if (!a.bestSeller && b.bestSeller) return 1;
                            return (b.reviewCount || 0) - (a.reviewCount || 0);
                        })
                        .slice(0, visibleCount)
                        .map((product, idx) => (
                            <div key={product._id} className="flex flex-col bg-white rounded-3xl overflow-hidden border border-[#f3eee7] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(230,162,122,0.15)] group cursor-pointer">

                                {/* Image Container - Premium gradient background */}
                                <div className="relative w-full aspect-[5/4] overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-[#fdfaf7] p-4">
                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1.5 md:gap-2 items-start">
                                        {idx === 0 && <span className="bg-[#e6a27a] text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">Best Seller</span>}
                                        {idx === 1 && <span className="bg-[#93b38c] text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">New</span>}

                                        {product.originalPrice > product.price && (
                                            <span className="bg-[#e8b960] text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                {(product.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage'
                                                    ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                                                    : `Save ₹${Math.round(product.originalPrice - product.price)}`}
                                            </span>
                                        )}
                                    </div>

                                    {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                                        <span className="absolute bottom-4 left-4 z-20 bg-orange-100 border border-orange-200 text-orange-600 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1 animate-pulse">
                                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                            Only {product.stockQuantity} Left!
                                        </span>
                                    )}

                                    {/* Waitlist Heart (Top Right inside Square Box) */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-white/95 p-1.5 md:p-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110"
                                        title="Join Waitlist"
                                    >
                                        <Heart
                                            className={`w-4 h-4 md:w-5 md:h-5 text-red-500 transition-colors ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'fill-red-500' : 'hover:fill-red-500/30'}`}
                                        />
                                    </button>

                                    <Link to={`/product/${product._id}`} className="absolute inset-4 z-10 flex items-center justify-center">
                                        <ProductCardImageCarousel
                                            images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                            productName={product.name}
                                        />
                                    </Link>
                                </div>

                                {/* Content Section */}
                                <div className="p-3 md:p-5 flex flex-col flex-grow">
                                    <Link to={`/product/${product._id}`} className="font-medium font-serif text-[#3d3130] text-[13px] md:text-[17px] mb-1 hover:text-[#e6a27a] transition-colors truncate">
                                        {product.name}
                                    </Link>

                                    <div className="scale-90 origin-left md:scale-100">
                                        <StarRating rating={Math.round(product.rating || 5)} count={product.reviewCount || 0} />
                                    </div>

                                    <div className="hidden md:block text-[12px] text-[#8b7e7c] mt-1 mb-2 leading-relaxed">
                                        <p className="line-clamp-1">
                                            {product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.replace(product.name, '')?.trim()) || "A wonderful and safe toy for your little ones to play, learn, and grow."}
                                        </p>
                                        <Link to={`/product/${product._id}`} className="text-[#e6a27a] hover:text-[#d38b60] font-bold text-[11px] mt-1 inline-block">
                                            View more
                                        </Link>
                                    </div>

                                    <div className="mt-auto pt-2 md:pt-3 border-t border-[#f3eee7] flex flex-col gap-2">
                                        <div className="flex items-end gap-1 md:gap-2 h-[20px] md:h-[24px]">
                                            {product.status === 'Out of Stock' ? (
                                                <span className="font-bold text-slate-400 text-[14px] md:text-[18px] leading-none">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-[#e6a27a] text-[16px] md:text-[20px] leading-none">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[11px] md:text-[13px] text-[#b3a8a6] line-through font-medium leading-none">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {product.status === 'Out of Stock' ? (
                                            <button disabled className="w-full bg-slate-50 text-slate-400 border border-slate-200 py-2 md:py-3 rounded-full cursor-not-allowed font-bold text-[12px] md:text-[14px] flex items-center justify-center gap-1 md:gap-2" title="Out of Stock">
                                                <svg width="14" height="14" className="md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg> Out of Stock
                                            </button>
                                        ) : (
                                            <button onClick={() => addToCart(product, 1)} className="w-full bg-white text-[#3d3130] border border-[#ebe5df] py-2 md:py-3 rounded-full shadow-sm hover:shadow-md hover:bg-[#e6a27a] hover:text-white hover:border-[#e6a27a] transition-all duration-300 font-bold text-[12px] md:text-[14px] flex items-center justify-center gap-1 md:gap-2 group/btn" title="Add to Cart">
                                                <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:scale-110 transition-transform" /> Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                </div>

                {/* View More Products Button */}
                {visibleCount < allProducts.length && (
                    <div className="flex justify-center mt-12">
                        <button onClick={() => setVisibleCount(prev => prev + 8)} className="bg-[#118AB2] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-[#0a5c78] transition-all duration-300">
                            View More
                        </button>
                    </div>
                )}
            </div>

            {/* Why Parents Choose */}
            <div className="max-w-[1400px] mx-auto py-10 md:py-16 px-4 md:px-6 font-['Outfit']">
                <div className="bg-[#1282a2]/5 rounded-3xl md:rounded-[3rem] flex flex-col lg:flex-row overflow-hidden border border-[#1282a2]/10 relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#1282a2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-[#e6a27a]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="w-full lg:w-1/2 p-6 md:p-14 lg:p-20 flex flex-col justify-center relative z-10">
                        <h2 className="text-[28px] md:text-[46px] font-black text-[#2e4053] mb-3 md:mb-4 leading-tight font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
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

            {/* Brands Marquee */}
            {brands.length > 0 && (
                <div className="w-full pt-12 md:pt-16 pb-8 overflow-hidden bg-slate-50/50">
                    <div className="text-center mb-8 md:mb-10 px-4">
                        <div className="mb-2 text-[#e6a27a]">✦</div>
                        <h2 className="text-[28px] md:text-[32px] font-serif text-[#3d3130] mb-2">Our Premium Brands</h2>
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
