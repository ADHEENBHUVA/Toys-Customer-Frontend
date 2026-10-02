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
        fetchTrendingProducts();
        fetchAllProducts();
        fetchCategories();
        fetchTestimonials();
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
            setDynamicGap(gap);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Continuous smooth auto-scroll (requestAnimationFrame)
    useEffect(() => {
        if (!categories || categories.length === 0) return;

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
    }, [categories, isHovered, isDragging]);

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
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                <div className="w-full bg-gradient-to-br from-[#fcf3ea] via-[#f7e6d8] to-[#f0ccb6] rounded-[2.5rem] relative overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row items-center p-8 md:p-16">

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 text-[#e9b896] opacity-50 text-4xl">✦</div>
                    <div className="absolute top-20 left-[40%] text-[#e9b896] opacity-50 text-2xl">✦</div>

                    {/* Left Content */}
                    <div className="w-full md:w-1/2 relative z-10 pt-10 md:pt-0">
                        <h1 className="text-5xl md:text-[70px] leading-[1.1] font-serif text-[#3d3130] mb-6 tracking-tight">
                            Little Things, <br /> Big Joys
                            <span className="inline-block ml-4 text-[#e6a27a]">♡</span>
                        </h1>
                        <p className="text-[18px] md:text-[20px] text-[#5e504f] mb-10 max-w-[400px] leading-relaxed">
                            Thoughtfully chosen essentials for every precious moment.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link to="/products">
                                <button className="bg-[#e6a27a] hover:bg-[#d99268] text-white font-medium text-[15px] px-8 py-3.5 rounded-full flex items-center gap-3 transition-colors shadow-sm">
                                    Shop Now <span className="bg-white text-[#e6a27a] rounded-full w-6 h-6 flex items-center justify-center text-sm">→</span>
                                </button>
                            </Link>
                            <Link to="/products">
                                <button className="bg-transparent border border-[#3d3130] hover:bg-[#3d3130] hover:text-white text-[#3d3130] font-medium text-[15px] px-8 py-3.5 rounded-full transition-colors">
                                    Explore Collection
                                </button>
                            </Link>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-6 md:gap-10 text-[12px] font-medium text-[#5e504f]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#93b38c]">
                                    <Leaf className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Safe Materials</span>
                                    <span className="text-[11px] text-[#8b7e7c]">Non-toxic & baby-safe</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e6a27a]">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Trusted Quality</span>
                                    <span className="text-[11px] text-[#8b7e7c]">Tested & certified</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e8b960]">
                                    <HeartIcon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Made with Love</span>
                                    <span className="text-[11px] text-[#8b7e7c]">For happy little ones</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-1/2 relative h-full flex justify-end items-end mt-12 md:mt-0 z-0">
                        <div className="absolute top-10 right-10 bg-[#fdfaf7] rounded-full w-[130px] h-[130px] flex flex-col items-center justify-center shadow-sm z-20">
                            <span className="text-[12px] font-medium text-[#8b7e7c]">For Every</span>
                            <span className="text-[18px] font-serif text-[#3d3130] leading-tight text-center">Little<br />Adventure</span>
                            <span className="text-[#e6a27a] text-[10px] mt-1">♡</span>
                        </div>
                        {/* Replace with actual baby image in final */}
                        <div className="w-[90%] md:w-[120%] h-auto -mb-8 -mr-8 relative z-10">
                            <img src="/baby-hero-new.png" alt="Baby" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' }} className="w-full h-full object-cover rounded-3xl" />
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
                    className="relative w-full py-4 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Left Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('left')}
                        className="absolute left-4 top-[88px] -translate-y-1/2 z-20 bg-white/95 text-[#3d3130] p-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.15)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#fcfaf7] hidden md:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('right')}
                        className="absolute right-4 top-[88px] -translate-y-1/2 z-20 bg-white/95 text-[#3d3130] p-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.15)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#fcfaf7] hidden md:flex items-center justify-center cursor-pointer"
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
                        className={`flex overflow-x-auto hide-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                        style={{ gap: `${dynamicGap}px` }}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveDrag}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Duplicate categories exactly twice for seamless 50% loop math */}
                        {[...categories, ...categories, ...categories, ...categories, ...categories, ...categories, ...categories, ...categories].map((cat, idx) => (
                            <Link
                                to={`/products?search=${encodeURIComponent(cat.name)}`}
                                key={idx}
                                onClick={(e) => { if (dragDistance > 5) e.preventDefault(); }}
                                className="group flex flex-col items-center justify-start flex-shrink-0"
                                style={{ width: '144px' }}
                            >
                                <div className="w-36 h-36 mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center overflow-hidden rounded-full border-[6px] border-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_12px_40px_rgb(230,162,122,0.2)]">
                                    <img src={cat.img} alt={cat.name} draggable="false" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                                </div>
                                <span className="font-bold text-[#3d3130] text-[16px] text-center font-serif group-hover:text-[#e6a27a] transition-colors">{cat.name}</span>
                                <span className="text-[13px] text-[#8b7e7c] text-center mt-0.5">{cat.count} products</span>
                            </Link>
                        ))}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[...allProducts]
                        .sort((a, b) => {
                            if (a.bestSeller && !b.bestSeller) return -1;
                            if (!a.bestSeller && b.bestSeller) return 1;
                            return (b.ratingCount || 0) - (a.ratingCount || 0);
                        })
                        .slice(0, visibleCount)
                        .map((product, idx) => (
                            <div key={product._id} className="flex flex-col bg-white rounded-3xl overflow-hidden border border-[#f3eee7] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(230,162,122,0.15)] group cursor-pointer">

                                {/* Image Container - Premium gradient background */}
                                <div className="relative w-full aspect-[5/4] overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-[#fdfaf7] p-4">
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                                        {idx === 0 && <span className="bg-[#e6a27a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Best Seller</span>}
                                        {idx === 1 && <span className="bg-[#93b38c] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">New</span>}
                                        
                                        {product.originalPrice > product.price && (
                                            <span className="bg-[#e8b960] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                {websiteSettings?.discountDisplayType === 'percentage' 
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
                                        className="absolute top-4 right-4 z-20 bg-white/95 p-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110"
                                        title="Join Waitlist"
                                    >
                                        <Heart
                                            className={`w-5 h-5 text-red-500 transition-colors ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'fill-red-500' : 'hover:fill-red-500/30'}`}
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
                                <div className="p-5 flex flex-col flex-grow">
                                    <Link to={`/product/${product._id}`} className="font-bold font-serif text-[#3d3130] text-[17px] mb-1 hover:text-[#e6a27a] transition-colors truncate">
                                        {product.name}
                                    </Link>

                                    <StarRating rating={Math.round(product.rating || 5)} count={product.ratingCount || 0} />

                                    <div className="text-[12px] text-[#8b7e7c] mt-1 mb-2 leading-relaxed">
                                        <p className="line-clamp-1">
                                            {product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.replace(product.name, '')?.trim()) || "A wonderful and safe toy for your little ones to play, learn, and grow."}
                                        </p>
                                        <Link to={`/product/${product._id}`} className="text-[#e6a27a] hover:text-[#d38b60] font-bold text-[11px] mt-1 inline-block">
                                            View more
                                        </Link>
                                    </div>

                                    <div className="mt-2 pt-3 border-t border-[#f3eee7] flex flex-col gap-2">
                                        <div className="flex items-end gap-2 h-[24px]">
                                            {product.status === 'Out of Stock' ? (
                                                <span className="font-bold text-slate-400 text-[18px] leading-none">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-[#e6a27a] text-[20px] leading-none">₹{`${(product.price || 0).toFixed(2)}`}</span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[13px] text-[#b3a8a6] line-through font-medium leading-none">₹{`${(product.originalPrice || 0).toFixed(2)}`}</span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {product.status === 'Out of Stock' ? (
                                            <button disabled className="w-full bg-slate-50 text-slate-400 border border-slate-200 py-3 rounded-full cursor-not-allowed font-bold text-[14px] flex items-center justify-center gap-2" title="Out of Stock">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg> Out of Stock
                                            </button>
                                        ) : (
                                            <button onClick={() => addToCart(product, 1)} className="w-full bg-white text-[#3d3130] border border-[#ebe5df] py-3 rounded-full shadow-sm hover:shadow-md hover:bg-[#e6a27a] hover:text-white hover:border-[#e6a27a] transition-all duration-300 font-bold text-[14px] flex items-center justify-center gap-2 group/btn" title="Add to Cart">
                                                <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Add to Cart
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
            <div className="max-w-[1400px] mx-auto pt-8 pb-8 px-4 md:px-6">
                <div className="bg-[#f4f6f1] rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden">
                    <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <h2 className="text-[32px] md:text-[40px] font-serif text-[#3d3130] mb-2 leading-tight">Why Parents Choose Little Joys</h2>
                        <p className="text-[#8b7e7c] text-[15px] mb-10">Because your baby deserves the very best.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Safe & Non-Toxic</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">We use only non-toxic, BPA-free, and baby-safe materials.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Premium Quality</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Durable, long-lasting products tested to the highest standards.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#e6a27a]">
                                    <HeartIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Gentle on Baby</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Designed with care for your baby's sensitive skin and comfort.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M12 16V12" /><path d="M12 8H12.01" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Sustainable Choice</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Eco-friendly materials and packaging for a better tomorrow.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative min-h-[300px]">
                        <div className="absolute top-8 right-8 bg-[#fdfaf7] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] w-[120px] h-[110px] flex flex-col items-center justify-center shadow-sm z-20 transform rotate-12">
                            <span className="text-[14px] font-serif text-[#3d3130] leading-tight text-center">Quality<br />You Can<br />Trust</span>
                            <span className="text-[#e6a27a] text-[10px] mt-1">♡</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80" alt="Baby Basket" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Loved by Parents */}
            <div className="max-w-[1400px] mx-auto pt-8 pb-16 px-4 md:px-6 text-center">
                <div className="mb-2 text-[#e6a27a]">♡</div>
                <h2 className="text-[32px] font-serif text-[#3d3130] mb-2">Loved by Parents</h2>
                <p className="text-[#8b7e7c] text-[15px] mb-12">Real stories from our happy Little Joys family.</p>

                <div className="relative overflow-hidden w-full py-2">
                    <div
                        className={`flex gap-6 ${isTestimonialTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                        style={{ transform: `translateX(calc(-${testimonialIdx * (100 / (window.innerWidth < 768 ? 1 : 3))}% - ${testimonialIdx * (24 / (window.innerWidth < 768 ? 1 : 3))}px))` }}
                        onTransitionEnd={handleTestimonialTransitionEnd}
                    >
                        {[...testimonials, ...testimonials].map((test, index) => (
                            <div key={`${test._id || test.name}-${index}`} className="bg-white border border-[#f3eee7] rounded-[2rem] p-8 text-left shadow-sm min-w-[100%] md:min-w-[calc(33.333%-16px)]">
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