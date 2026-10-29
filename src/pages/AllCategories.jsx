import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Check, ArrowRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCatalogSection from '../components/ProductCatalogSection';

const getCategoryEmoji = (name) => {
    if (!name) return '🧸';
    const n = name.toLowerCase();
    if (n.includes('soft') || n.includes('plush') || n.includes('teddy')) return '🧸';
    if (n.includes('lego') || n.includes('block') || n.includes('build')) return '🧱';
    if (n.includes('board') || n.includes('game') || n.includes('puzzle')) return '🎲';
    if (n.includes('action') || n.includes('figure') || n.includes('hero')) return '🦸';
    if (n.includes('doll') || n.includes('barbie')) return '🎀';
    if (n.includes('vehicle') || n.includes('car') || n.includes('train') || n.includes('track')) return '🚗';
    if (n.includes('art') || n.includes('craft') || n.includes('color') || n.includes('paint')) return '🎨';
    if (n.includes('edu') || n.includes('learn') || n.includes('stem') || n.includes('science')) return '🔬';
    if (n.includes('outdoor') || n.includes('sport') || n.includes('ride')) return '⚽';
    if (n.includes('music') || n.includes('instrument') || n.includes('sound')) return '🎵';
    if (n.includes('infant') || n.includes('baby') || n.includes('toddler')) return '🍼';
    return '🧸';
};

// 6 Unique Luxury Toy Themes with Vibrant Gradients & Ambient Auras
const CATEGORY_THEMES = [
    {
        name: 'Sunny Mango',
        gradient: 'from-amber-400 via-orange-400 to-rose-400',
        badgeBg: 'bg-amber-500 text-white',
        cardBg: 'from-amber-500/10 via-orange-50/50 to-white',
        borderIdle: 'border-amber-200/90',
        borderHover: 'hover:border-amber-400',
        tagText: 'text-amber-800 bg-amber-50 border-amber-200/90',
        aura: 'bg-amber-400/25',
        btnText: 'group-hover:bg-amber-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(245,158,11,0.35)]',
        rating: '4.9',
        tag: 'Top Rated'
    },
    {
        name: 'Bubblegum Pink',
        gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
        badgeBg: 'bg-rose-500 text-white',
        cardBg: 'from-rose-500/10 via-pink-50/50 to-white',
        borderIdle: 'border-rose-200/90',
        borderHover: 'hover:border-rose-400',
        tagText: 'text-rose-800 bg-rose-50 border-rose-200/90',
        aura: 'bg-rose-400/25',
        btnText: 'group-hover:bg-rose-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(244,63,94,0.35)]',
        rating: '5.0',
        tag: 'Trending'
    },
    {
        name: 'Electric Cyan',
        gradient: 'from-cyan-400 via-sky-400 to-blue-500',
        badgeBg: 'bg-sky-500 text-white',
        cardBg: 'from-sky-500/10 via-cyan-50/50 to-white',
        borderIdle: 'border-sky-200/90',
        borderHover: 'hover:border-sky-400',
        tagText: 'text-sky-800 bg-sky-50 border-sky-200/90',
        aura: 'bg-sky-400/25',
        btnText: 'group-hover:bg-sky-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(14,165,233,0.35)]',
        rating: '4.8',
        tag: 'Popular'
    },
    {
        name: 'Lime Meadow',
        gradient: 'from-emerald-400 via-teal-400 to-green-500',
        badgeBg: 'bg-emerald-500 text-white',
        cardBg: 'from-emerald-500/10 via-teal-50/50 to-white',
        borderIdle: 'border-emerald-200/90',
        borderHover: 'hover:border-emerald-400',
        tagText: 'text-emerald-800 bg-emerald-50 border-emerald-200/90',
        aura: 'bg-emerald-400/25',
        btnText: 'group-hover:bg-emerald-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(16,185,129,0.35)]',
        rating: '4.9',
        tag: 'Kids Favorite'
    },
    {
        name: 'Cosmic Violet',
        gradient: 'from-purple-400 via-violet-400 to-indigo-500',
        badgeBg: 'bg-purple-500 text-white',
        cardBg: 'from-purple-500/10 via-violet-50/50 to-white',
        borderIdle: 'border-purple-200/90',
        borderHover: 'hover:border-purple-400',
        tagText: 'text-purple-800 bg-purple-50 border-purple-200/90',
        aura: 'bg-purple-400/25',
        btnText: 'group-hover:bg-purple-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]',
        rating: '5.0',
        tag: 'Best Seller'
    },
    {
        name: 'Sunset Orange',
        gradient: 'from-red-400 via-amber-400 to-yellow-400',
        badgeBg: 'bg-red-500 text-white',
        cardBg: 'from-red-500/10 via-orange-50/50 to-white',
        borderIdle: 'border-red-200/90',
        borderHover: 'hover:border-red-400',
        tagText: 'text-red-800 bg-red-50 border-red-200/90',
        aura: 'bg-red-400/25',
        btnText: 'group-hover:bg-red-500 group-hover:text-white',
        ringGlow: 'group-hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]',
        rating: '4.8',
        tag: 'Must Have'
    }
];

const AllCategories = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const catQuery = searchParams.get('category') || '';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(catQuery || null);

    const swiperInstanceRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/categories`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setCategories(data.data.filter(c => c.status === 'Active'));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (catQuery) {
            setSelectedCategory(catQuery);
        } else {
            setSelectedCategory(null);
        }
    }, [catQuery]);

    // Ensure plenty of slides for seamless loop without boundary jump
    const categorySlides = useMemo(() => {
        if (!categories || categories.length === 0) return [];
        let items = [...categories];
        while (items.length < 18) {
            items = [...items, ...categories];
        }
        return items;
    }, [categories]);

    const handleCategoryClick = (catName) => {
        if (selectedCategory === catName) {
            setSelectedCategory(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('category');
            setSearchParams(newParams);
        } else {
            setSelectedCategory(catName);
            const newParams = new URLSearchParams(searchParams);
            newParams.set('category', catName);
            setSearchParams(newParams);
        }

        // Smooth scroll to catalog products section below
        setTimeout(() => {
            const target = document.getElementById('catalog-products-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 120);
    };

    const handleClearCategory = () => {
        setSelectedCategory(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('category');
        setSearchParams(newParams);
    };

    const getImageUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=400&q=80';
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/gallery')) return img;
        const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    return (
        <div className="w-full min-h-screen bg-[#FFFDF9] font-sans">
            
            {/* 1. HEADER BANNER STRIP */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#E0F2FE] text-slate-800 pt-5 sm:pt-6 pb-9 sm:pb-10">
                <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#2563EB_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-200/35 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                    <div>
                        {/* Left-Aligned Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 flex-wrap">
                            <Link to="/" className="text-slate-600 hover:text-[#2563EB] transition-colors underline-offset-2 hover:underline">Home</Link>
                            <span className="opacity-40">/</span>
                            <span className="text-[#1D4ED8] font-extrabold">Toy Categories</span>
                        </div>

                        {/* Bold Left-Aligned Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight leading-tight mb-1">
                            Toy Categories
                        </h1>

                        <p className="text-slate-600 text-xs sm:text-[13.5px] max-w-xl font-medium leading-relaxed">
                            Browse our thoughtfully categorized toys, games, learning kits, and creative playsets designed to spark joy and imagination.
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-blue-200/80 shadow-xs shrink-0 self-start md:self-center">
                        <span className="text-2xl">🎲</span>
                        <div>
                            <span className="block text-[10.5px] font-black uppercase tracking-wider text-blue-600">Toy Finder</span>
                            <span className="block text-xs text-slate-900 font-black">Explore By Interest</span>
                        </div>
                    </div>
                </div>

                {/* Wave Line at the bottom of banner */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-5 sm:h-7 md:h-8 block">
                        <path d="M0,22 C250,56 450,-4 700,28 C920,56 1080,4 1200,22 L1200,60 L0,60 Z" fill="#FAF8F5" />
                        <path d="M0,22 C250,56 450,-4 700,28 C920,56 1080,4 1200,22" fill="none" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* 2. 1-BY-1 RIGHT-TO-LEFT SLIDING SHOWCASE WITH UNIQUE 3D TOY BENTO PODS - FULL SCREEN EDGE-TO-EDGE */}
            <div className="w-full bg-[#FAF8F5] pt-7 sm:pt-9 pb-8 sm:pb-10 border-b border-slate-200/70 relative overflow-hidden group/section">
                
                {/* Header Bar: Title + Controls (Contained for crisp readability) */}
                <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-5 sm:mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E51A22] text-[11px] font-black uppercase tracking-wider border border-rose-200/80 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E51A22]" /> Official Collections
                                </span>
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A24] text-white text-[11px] font-black uppercase tracking-wider">
                                        Filtering: {selectedCategory}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1A24] tracking-tight">
                                Select a Toy Category
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                Browse curated categories • Click any card to filter products below
                            </p>
                        </div>

                        {/* Header Action Controls */}
                        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
                            {/* Reset / All Categories Button */}
                            <button
                                type="button"
                                onClick={handleClearCategory}
                                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                                    !selectedCategory
                                        ? 'bg-[#E51A22] text-white shadow-md scale-102'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22]'
                                }`}
                            >
                                All (Show All)
                            </button>
                        </div>
                    </div>
                </div>

                {/* SWIPER CAROUSEL WITH ALL FULL BOXES (NO HALF BOXES) AND UNIFORM IDENTICAL SIZES */}
                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Categories...</span>
                    </div>
                ) : (
                    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 relative group/slider">
                        {/* Floating Navigation Arrows - ONLY VISIBLE ON HOVER */}
                        <button
                            type="button"
                            className="cat-prev-arrow absolute -left-2 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-200 text-slate-800 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white hover:border-[#E51A22] flex items-center justify-center cursor-pointer opacity-0 pointer-events-none group-hover/slider:opacity-100 group-hover/slider:pointer-events-auto"
                            title="Previous Category"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" strokeWidth={2.5} />
                        </button>
                        <button
                            type="button"
                            className="cat-next-arrow absolute -right-2 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-200 text-slate-800 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white hover:border-[#E51A22] flex items-center justify-center cursor-pointer opacity-0 pointer-events-none group-hover/slider:opacity-100 group-hover/slider:pointer-events-auto"
                            title="Next Category"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" strokeWidth={2.5} />
                        </button>

                        <Swiper
                            modules={[Navigation, Autoplay]}
                            onSwiper={(swiper) => {
                                swiperInstanceRef.current = swiper;
                            }}
                            loop={true}
                            centeredSlides={false}
                            speed={650}
                            slidesPerGroup={1}
                            autoplay={{
                                delay: 2600,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            navigation={{
                                prevEl: '.cat-prev-arrow',
                                nextEl: '.cat-next-arrow'
                            }}
                            slidesPerView={2}
                            spaceBetween={16}
                            breakpoints={{
                                480: { slidesPerView: 2, spaceBetween: 14 },
                                640: { slidesPerView: 3, spaceBetween: 16 },
                                768: { slidesPerView: 4, spaceBetween: 18 },
                                1024: { slidesPerView: 5, spaceBetween: 20 },
                                1280: { slidesPerView: 6, spaceBetween: 20 },
                                1536: { slidesPerView: 7, spaceBetween: 22 }
                            }}
                            className="!py-4 !px-0 select-none w-full"
                        >
                            {categorySlides.map((cat, idx) => {
                                const theme = CATEGORY_THEMES[idx % CATEGORY_THEMES.length];
                                const isSelected = selectedCategory === cat.name;
                                const emoji = (cat.icon && cat.icon.trim()) ? cat.icon : getCategoryEmoji(cat.name);

                                return (
                                    <SwiperSlide key={`${cat._id || cat.name}-${idx}`} className="h-full flex items-stretch">
                                        {/* UNIQUE HUMAN-CRAFTED TOY POD CARD - EXACT UNIFORM SIZE */}
                                        <div
                                            onClick={() => handleCategoryClick(cat.name)}
                                            className={`group flex flex-col items-center justify-between w-full h-[305px] sm:h-[315px] rounded-[30px] p-4 sm:p-5 transition-all duration-300 relative select-none cursor-pointer overflow-hidden ${
                                                isSelected
                                                    ? 'bg-gradient-to-b from-white via-rose-50/60 to-white border-2 border-[#E51A22] ring-4 ring-rose-500/20 shadow-[0_20px_40px_rgba(229,26,34,0.24)] -translate-y-2'
                                                    : `bg-white/95 backdrop-blur-md border-2 border-slate-200/80 ${theme.borderHover} shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.12)] hover:-translate-y-2`
                                            }`}
                                            title={`Filter toys by ${cat.name}`}
                                        >
                                            {/* Ambient Colored Aura Blob */}
                                            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${theme.aura} blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                                            {/* Top Row: Active Status & Category Emoji Orb (Numbers Removed) */}
                                            <div className="w-full flex items-center justify-between min-h-[32px] mb-1 z-10">
                                                <div>
                                                    {isSelected && (
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E51A22] animate-pulse" />
                                                            Active
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Floating 3D Emoji Orb */}
                                                <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center text-[15px] transition-transform duration-300 group-hover:scale-115">
                                                    {emoji}
                                                </div>
                                            </div>

                                            {/* 3D Floating Toy Stage with Gradient Rim */}
                                            <div className="relative w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 my-auto flex items-center justify-center shrink-0">
                                                <div className={`w-full h-full rounded-[24px] sm:rounded-[26px] p-[3px] bg-gradient-to-tr ${
                                                    isSelected ? 'from-[#E51A22] via-amber-400 to-rose-500' : theme.gradient
                                                } shadow-md ${theme.ringGlow} transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1 flex items-center justify-center`}>
                                                    <div className="w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden bg-white border-2 border-white shadow-inner flex items-center justify-center relative">
                                                        <img
                                                            src={getImageUrl(cat.image)}
                                                            alt={cat.name}
                                                            draggable="false"
                                                            loading="lazy"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115 pointer-events-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Category Title - EXACT UNIFORM 44px 2-LINE HEIGHT FOR ALL CARDS */}
                                            <div className="w-full h-11 flex items-center justify-center text-center mt-auto z-10 px-1">
                                                <span className={`font-black text-[13px] sm:text-[14px] uppercase tracking-wide leading-snug line-clamp-2 transition-colors duration-300 ${
                                                    isSelected ? 'text-[#E51A22]' : 'text-[#1A1A24] group-hover:text-[#E51A22]'
                                                }`}>
                                                    {cat.name}
                                                </span>
                                            </div>

                                            {/* Bottom Bespoke Interaction Bar: Star Rating & Dynamic Theme Tag + Action Arrow */}
                                            <div className="w-full pt-2.5 mt-1 border-t border-slate-100 group-hover:border-slate-200/90 flex items-center justify-between z-10 px-0.5 transition-colors">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-black">
                                                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                        <span>{theme.rating || '4.9'}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black tracking-tight text-slate-500 group-hover:text-slate-800 transition-colors">
                                                        {isSelected ? '✓ Filter Active' : (theme.tag || 'Popular')}
                                                    </span>
                                                </div>

                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    isSelected
                                                        ? 'bg-[#E51A22] text-white shadow-xs scale-105'
                                                        : 'bg-slate-100 text-slate-500 group-hover:bg-[#E51A22] group-hover:text-white group-hover:scale-110 group-hover:translate-x-0.5'
                                                }`}>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* 3. PRODUCTS & FILTER SECTION BELOW */}
            <ProductCatalogSection
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                catalogTitle={selectedCategory ? `${selectedCategory} Toys` : 'All Toy Categories & Products'}
                catalogSubtitle={selectedCategory ? `Showing all top-rated toys and playsets under ${selectedCategory}` : 'Browse all products or select a specific category above to filter'}
            />

        </div>
    );
};

export default AllCategories;
