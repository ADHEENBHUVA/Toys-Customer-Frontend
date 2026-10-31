import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Check, ArrowRight, Star, Flame, Zap, Compass, X } from 'lucide-react';
import ProductCatalogSection from '../components/ProductCatalogSection';

// Bespoke 3D category world presets with customized personalities, gradients & subtitles
const CATEGORY_PRESETS = {
    'soft toys': {
        emoji: '🧸',
        sub: 'Cuddly & Huggable',
        badge: 'Huggable Plush',
        border: '#F43F5E',
        candyBg: 'bg-rose-50/70',
        pillBg: 'bg-rose-100 text-rose-800 border-rose-200',
        gradient: 'from-pink-500 via-rose-400 to-amber-300',
        decoRight: '💖',
        tag: 'Most Loved'
    },
    'musical instruments': {
        emoji: '🎵',
        sub: 'Rhythm & Melodies',
        badge: 'Sound & Joy',
        border: '#0EA5E9',
        candyBg: 'bg-sky-50/70',
        pillBg: 'bg-sky-100 text-sky-800 border-sky-200',
        gradient: 'from-sky-400 via-indigo-500 to-purple-500',
        decoRight: '🎶',
        tag: 'Popular'
    },
    'outdoor play': {
        emoji: '⚽',
        sub: 'Active Garden Fun',
        badge: 'Run & Explore',
        border: '#10B981',
        candyBg: 'bg-emerald-50/70',
        pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
        decoRight: '⚡',
        tag: 'Active Joy'
    },
    'art & craft': {
        emoji: '🎨',
        sub: 'Color, Paint & DIY',
        badge: 'Creative Mind',
        border: '#8B5CF6',
        candyBg: 'bg-purple-50/70',
        pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
        gradient: 'from-violet-500 via-fuchsia-500 to-rose-400',
        decoRight: '✨',
        tag: 'Best Seller'
    },
    'building & blocks': {
        emoji: '🧱',
        sub: 'STEM & Architecture',
        badge: 'Master Builder',
        border: '#F59E0B',
        candyBg: 'bg-amber-50/70',
        pillBg: 'bg-amber-100 text-amber-800 border-amber-200',
        gradient: 'from-amber-400 via-orange-500 to-red-500',
        decoRight: '⭐',
        tag: 'Brain Boost'
    },
    'vehicles & rc': {
        emoji: '🏎️',
        sub: 'Speed, Tracks & RC',
        badge: 'Turbo Speed',
        border: '#EF4444',
        candyBg: 'bg-red-50/70',
        pillBg: 'bg-red-100 text-red-800 border-red-200',
        gradient: 'from-red-500 via-rose-500 to-orange-400',
        decoRight: '🚀',
        tag: 'Top Rated'
    },
    'dolls & accessories': {
        emoji: '👑',
        sub: 'Pretend Play & Care',
        badge: 'Dream Wardrobe',
        border: '#EC4899',
        candyBg: 'bg-pink-50/70',
        pillBg: 'bg-pink-100 text-pink-800 border-pink-200',
        gradient: 'from-pink-400 via-purple-400 to-indigo-400',
        decoRight: '👗',
        tag: 'Trending'
    },
    'action figures': {
        emoji: '🦸',
        sub: 'Heroes & Legends',
        badge: 'Epic Battles',
        border: '#2563EB',
        candyBg: 'bg-blue-50/70',
        pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        decoRight: '💥',
        tag: 'Adventure'
    },
    'board games': {
        emoji: '🎲',
        sub: 'Family Game Nights',
        badge: 'Mind & Strategy',
        border: '#0D9488',
        candyBg: 'bg-teal-50/70',
        pillBg: 'bg-teal-100 text-teal-800 border-teal-200',
        gradient: 'from-teal-400 via-cyan-500 to-blue-500',
        decoRight: '🏆',
        tag: 'Family Fun'
    },
    'educational': {
        emoji: '🧠',
        sub: 'Smart Early Learning',
        badge: 'Montessori & STEM',
        border: '#059669',
        candyBg: 'bg-emerald-50/70',
        pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        gradient: 'from-emerald-400 via-yellow-400 to-orange-400',
        decoRight: '🔬',
        tag: 'Recommended'
    }
};

// Fallback pool for any unexpected custom category names
const FALLBACK_THEMES = [
    {
        emoji: '🧸',
        sub: 'Fun & Playtime',
        badge: 'Popular Toy',
        border: '#F59E0B',
        candyBg: 'bg-amber-50/70',
        pillBg: 'bg-amber-100 text-amber-800 border-amber-200',
        gradient: 'from-amber-400 via-orange-400 to-rose-400',
        decoRight: '⭐',
        tag: 'Top Rated'
    },
    {
        emoji: '✨',
        sub: 'Creative & Bright',
        badge: 'Trending Pick',
        border: '#F43F5E',
        candyBg: 'bg-rose-50/70',
        pillBg: 'bg-rose-100 text-rose-800 border-rose-200',
        gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
        decoRight: '💖',
        tag: 'Trending'
    },
    {
        emoji: '🚀',
        sub: 'Explore & Learn',
        badge: 'Kids Choice',
        border: '#0EA5E9',
        candyBg: 'bg-sky-50/70',
        pillBg: 'bg-sky-100 text-sky-800 border-sky-200',
        gradient: 'from-cyan-400 via-sky-400 to-blue-500',
        decoRight: '⚡',
        tag: 'Popular'
    }
];

const getCategoryTheme = (name, index = 0) => {
    if (!name) return FALLBACK_THEMES[index % FALLBACK_THEMES.length];
    const key = name.toLowerCase().trim();
    if (CATEGORY_PRESETS[key]) return CATEGORY_PRESETS[key];

    for (const [presetKey, theme] of Object.entries(CATEGORY_PRESETS)) {
        if (key.includes(presetKey) || presetKey.includes(key)) {
            return theme;
        }
    }
    return FALLBACK_THEMES[index % FALLBACK_THEMES.length];
};

const AllCategories = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const catQuery = searchParams.get('category') || '';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(catQuery || null);

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

    const CARD_WIDTH = 240;
    const WAVELENGTH = 400; // Exact wavelength of the stationary snake wave rope
    const AMPLITUDE = 20; // Exact vertical amplitude (crest at y=22, trough at y=62)
    const SPEED = 65; // Glides smoothly from Right to Left at 65px/sec

    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const offsetRef = useRef(0);
    const isHoveredRef = useRef(false);
    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartOffsetRef = useRef(0);

    // Ensure item count M satisfies:
    // 1. M is a multiple of 5 (so M * 240 is an exact integer multiple of the 400px wave period)
    // 2. M is a multiple of categories.length (so categories repeat cleanly in order)
    // 3. M >= 25 (so totalWidth >= 6000px, ensuring card wrapping occurs far off-screen)
    const streamItems = useMemo(() => {
        if (!categories || categories.length === 0) return [];
        const k = categories.length;
        let m = 5;
        while (m % k !== 0 || m < 25) {
            m += 5;
        }
        if (m > 60) m = 30; // safety ceiling
        const items = [];
        for (let i = 0; i < m; i++) {
            items.push(categories[i % k]);
        }
        return items;
    }, [categories]);

    // Update every card's transform so the brass carabiner ring is 100% locked to the stationary snake wave rope
    const updateCardPositions = () => {
        if (!streamItems || streamItems.length === 0) return;
        const totalWidth = streamItems.length * CARD_WIDTH;
        const offset = offsetRef.current;
        for (let i = 0; i < streamItems.length; i++) {
            const el = cardRefs.current[i];
            if (!el) continue;
            const rawX = offset + i * CARD_WIDTH;
            let x = ((rawX % totalWidth) + totalWidth) % totalWidth;
            if (x > totalWidth - CARD_WIDTH) {
                x -= totalWidth;
            }
            // waveX is the exact horizontal center of the brass carabiner ring
            const waveX = x + 120;
            // Exact cosine curve formula matching the stationary snake rope SVG:
            // y_rope = 42 - 20 * cos(2*PI/400 * waveX) -> delta y = 20 - 20 * cos(2*PI/400 * waveX)
            const y = AMPLITUDE - AMPLITUDE * Math.cos((2 * Math.PI / WAVELENGTH) * waveX);
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
    };

    // 60FPS continuous Right-to-Left loop
    useEffect(() => {
        if (streamItems.length === 0) return;
        const totalWidth = streamItems.length * CARD_WIDTH;
        let animId;
        let lastTime = performance.now();

        updateCardPositions();

        const loop = (time) => {
            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            if (!isHoveredRef.current && !isDraggingRef.current) {
                // Glide from Right to Left (offset decreases)
                offsetRef.current = ((offsetRef.current - SPEED * dt) % totalWidth + totalWidth) % totalWidth;
                updateCardPositions();
            }
            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [streamItems]);

    // Interactive Drag & Hover Handlers (Pause on hover, smooth drag left/right)
    const handleMouseEnter = () => {
        isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
    };

    const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        dragStartXRef.current = e.clientX;
        dragStartOffsetRef.current = offsetRef.current;
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - dragStartXRef.current;
        if (Math.abs(dx) > 4) {
            hasDraggedRef.current = true;
        }
        const totalWidth = streamItems.length * CARD_WIDTH;
        offsetRef.current = ((dragStartOffsetRef.current + dx) % totalWidth + totalWidth) % totalWidth;
        updateCardPositions();
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        dragStartXRef.current = e.touches[0].clientX;
        dragStartOffsetRef.current = offsetRef.current;
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current) return;
        const dx = e.touches[0].clientX - dragStartXRef.current;
        if (Math.abs(dx) > 4) {
            hasDraggedRef.current = true;
        }
        const totalWidth = streamItems.length * CARD_WIDTH;
        offsetRef.current = ((dragStartOffsetRef.current + dx) % totalWidth + totalWidth) % totalWidth;
        updateCardPositions();
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
    };

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

            {/* 2. FIXED SNAKE (NAG) WAVE ROPE & SLIDING GOL ROUND (SWING / HICHKO) CATEGORY SHOWCASE */}
            <div className="w-full bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-[#FAF8F5] pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-200/70 relative overflow-hidden group/section">
                
                {/* CSS KEYFRAMES FOR HICHKO PENDULUM SWING */}
                <style>{`
                    /* 🎠 Gentle Pendulum Swing (Hichko) pivoting from the Carabiner Ring Center (120, 21.5) */
                    @keyframes hichkoSwing {
                        0%, 100% {
                            transform: rotate(-2.6deg);
                        }
                        50% {
                            transform: rotate(2.6deg);
                        }
                    }

                    .hichko-swing-disc {
                        transform-origin: 120px 21.5px;
                        animation: hichkoSwing 3.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                        will-change: transform;
                    }
                `}</style>

                {/* SHARED SVG DEFINITIONS FOR 3D JUTE ROPE, FIXED SNAKE WAVE PATTERN & POLISHED BRASS CARABINERS */}
                <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <defs>
                        {/* 3D Braided Jute Rope Cylinder Gradient */}
                        <linearGradient id="snakeRopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#78350F" />
                            <stop offset="25%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="75%" stopColor="#B45309" />
                            <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>

                        {/* Solid Polished Brass Carabiner Ring Gradient */}
                        <linearGradient id="snakeBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FEF3C7" />
                            <stop offset="35%" stopColor="#F59E0B" />
                            <stop offset="70%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                        </linearGradient>

                        {/* Stationary Snake Wave Rope Pattern - Wavelength 400px, Amplitude 20px, Centerline 42px */}
                        <pattern id="fixedSnakeRopePattern" width="400" height="90" patternUnits="userSpaceOnUse">
                            {/* Rope Drop Shadow */}
                            <path
                                d="M 0,25 C 72.8,25 127.2,65 200,65 C 272.8,65 327.2,25 400,25"
                                fill="none"
                                stroke="rgba(0,0,0,0.16)"
                                strokeWidth="7"
                                strokeLinecap="round"
                            />
                            {/* 3D Braided Jute Cable Base */}
                            <path
                                d="M 0,22 C 72.8,22 127.2,62 200,62 C 272.8,62 327.2,22 400,22"
                                fill="none"
                                stroke="url(#snakeRopeGrad)"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                            {/* Golden Braided Weave Texture */}
                            <path
                                d="M 0,22 C 72.8,22 127.2,62 200,62 C 272.8,62 327.2,22 400,22"
                                fill="none"
                                stroke="#FDE68A"
                                strokeWidth="3.4"
                                strokeDasharray="9 4.5"
                                strokeLinecap="round"
                            />
                            {/* Golden Silk Sheen Highlight */}
                            <path
                                d="M 0,21 C 72.8,21 127.2,61 200,61 C 272.8,61 327.2,21 400,21"
                                fill="none"
                                stroke="#FFFBEB"
                                strokeWidth="1.2"
                                strokeDasharray="3 9"
                                strokeLinecap="round"
                            />
                        </pattern>
                    </defs>
                </svg>

                {/* Header Bar: Title + Controls */}
                <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-5 sm:mb-7">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 text-[#E51A22] text-[11px] font-black uppercase tracking-wider border border-rose-200/80 shadow-2xs">
                                    <Sparkles className="w-3.5 h-3.5 text-[#E51A22] animate-pulse" /> Curated Play Worlds ({categories.length || '10+'})
                                </span>
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A24] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                        Filtering: {selectedCategory}
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleClearCategory(); }}
                                            className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            title="Clear filter"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-[#1A1A24] tracking-tight leading-tight">
                                Select a Toy Category
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                Tap any swinging toy world to instantly explore hand-picked toys, games & playsets below
                            </p>
                        </div>

                        {/* Header Action Controls */}
                        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
                            {/* Reset / All Categories Button */}
                            <button
                                type="button"
                                onClick={handleClearCategory}
                                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                                    !selectedCategory
                                        ? 'bg-[#E51A22] text-white shadow-md shadow-rose-500/25 scale-102 ring-2 ring-rose-400/30'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22] hover:bg-rose-50/40'
                                }`}
                            >
                                <Compass className="w-3.5 h-3.5" />
                                All Toys (Show All)
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTINUOUS 60FPS INFINITE STREAM TRACK */}
                {loading ? (
                    <div className="py-14 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Play Worlds...</span>
                    </div>
                ) : (
                    /* 100% Edge-to-Edge Container with Fixed Snake Rope & Gliding Category Rounds (દોરી સાપ જેવી - પોતાની જગ્યાએ ફિક્સ રહે - બંને બાજુ સ્ક્રીનને અડેલી) */
                    <div
                        ref={containerRef}
                        className="w-full relative h-[360px] sm:h-[385px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* 1. STATIONARY 3D SNAKE WAVE ROPE - TOUCHES BOTH SCREEN EDGES DIRECTLY (દોરી સાપ જેવા આકારમાં - પોતાની જગ્યાએ ફિક્સ રહે - બંને બાજુ સ્ક્રીનને અડેલી - નો આઇકોન) */}
                        <div className="w-full absolute top-0 left-0 right-0 h-[90px] pointer-events-none z-10 overflow-hidden">
                            <svg className="w-full h-[90px] block" preserveAspectRatio="none">
                                <rect x="0" y="0" width="100%" height="90" fill="url(#fixedSnakeRopePattern)" />
                            </svg>
                        </div>

                        {/* 2. GLIDING CATEGORY ROUNDS - EACH BRASS CARABINER GLIDES DIRECTLY ON THE SNAKE WAVE ROPE */}
                        <div className="w-full h-full relative z-20 pointer-events-auto">
                            {streamItems.map((cat, idx) => {
                                const theme = getCategoryTheme(cat.name, idx);
                                const isSelected = selectedCategory === cat.name;
                                const emoji = (cat.icon && cat.icon.trim()) ? cat.icon : theme.emoji;

                                return (
                                    <div
                                        key={`${cat._id || cat.name}-${idx}`}
                                        ref={(el) => (cardRefs.current[idx] = el)}
                                        className="absolute top-0 left-0 w-[240px] flex flex-col items-center group/card cursor-pointer select-none will-change-transform"
                                        onClick={() => {
                                            if (hasDraggedRef.current) return;
                                            handleCategoryClick(cat.name);
                                        }}
                                        title={`Explore ${cat.name} Toys`}
                                    >
                                        {/* 🪢 COMPACT 3D CARABINER RING (REAL THREADING: BACK BEHIND ROPE, FRONT OVER ROPE) & HOOK */}
                                        <div className="w-full h-[85px] relative shrink-0">
                                            <svg
                                                viewBox="0 0 240 85"
                                                className="w-full h-[85px] block overflow-visible pointer-events-none"
                                            >
                                                {/* 1. BACK ARCH OF THE CARABINER RING (PASSES COMPLETELY BEHIND THE ROPE) */}
                                                <path
                                                    d="M 128.5,21.5 A 8.5 8.5 0 0 0 111.5,21.5"
                                                    fill="none"
                                                    stroke="#451A03"
                                                    strokeWidth="3.4"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d="M 128.5,21.5 A 8.5 8.5 0 0 0 111.5,21.5"
                                                    fill="none"
                                                    stroke="url(#snakeBrassGrad)"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                />
                                                {/* Back Top Specular Sheen */}
                                                <path
                                                    d="M 124,14.5 C 122,13.5 118,13.5 116,14.5"
                                                    fill="none"
                                                    stroke="#FFFFFF"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    opacity="0.8"
                                                />

                                                {/* 2. THE LOCAL ROPE SEGMENT (CROSSES IN FRONT OF THE BACK ARCH OF THE RING) */}
                                                {/* Ambient Cable Drop Shadow */}
                                                <line x1="106" y1="23.5" x2="134" y2="23.5" stroke="rgba(0,0,0,0.18)" strokeWidth="6" strokeLinecap="round" />
                                                {/* Main 3D Braided Jute Cable Base */}
                                                <line x1="106" y1="21.5" x2="134" y2="21.5" stroke="url(#snakeRopeGrad)" strokeWidth="5.5" strokeLinecap="round" />
                                                {/* Golden Braided Weave */}
                                                <line x1="106" y1="21.5" x2="134" y2="21.5" stroke="#FDE68A" strokeWidth="3" strokeDasharray="6 3" strokeLinecap="round" />
                                                {/* Silk Sheen Highlight */}
                                                <line x1="106" y1="20.8" x2="134" y2="20.8" stroke="#FFFBEB" strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" />

                                                {/* 3. FRONT ARCH OF THE CARABINER RING (HOOKS COMPLETELY IN FRONT OF THE ROPE) */}
                                                {/* Shadow cast by front clamp onto the rope */}
                                                <path
                                                    d="M 111.5,21.5 A 8.5 8.5 0 0 0 128.5,21.5"
                                                    fill="none"
                                                    stroke="rgba(0,0,0,0.25)"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                                {/* Front Dark Outline */}
                                                <path
                                                    d="M 111.5,21.5 A 8.5 8.5 0 0 0 128.5,21.5"
                                                    fill="none"
                                                    stroke="#451A03"
                                                    strokeWidth="3.4"
                                                    strokeLinecap="round"
                                                />
                                                {/* Front Polished Brass Core */}
                                                <path
                                                    d="M 111.5,21.5 A 8.5 8.5 0 0 0 128.5,21.5"
                                                    fill="none"
                                                    stroke="url(#snakeBrassGrad)"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                />

                                                {/* 🌟 UNIQUE MINI CARABINER DETAILS: */}
                                                {/* Knurled Brass Screw-Lock Barrel on right side */}
                                                <rect x="126.2" y="19" width="3.6" height="7" rx="1.2" fill="url(#snakeBrassGrad)" stroke="#451A03" strokeWidth="0.8" />
                                                <line x1="126.5" y1="21.2" x2="129.5" y2="21.2" stroke="#78350F" strokeWidth="0.6" />
                                                <line x1="126.5" y1="23.5" x2="129.5" y2="23.5" stroke="#78350F" strokeWidth="0.6" />
                                                <line x1="127" y1="19.5" x2="127" y2="25.5" stroke="#FFFBEB" strokeWidth="0.5" opacity="0.8" />

                                                {/* Carabiner Hinge Rivet on left side */}
                                                <circle cx="111.5" cy="21.5" r="1.4" fill="url(#snakeBrassGrad)" stroke="#451A03" strokeWidth="0.7" />
                                                <circle cx="111.2" cy="21.2" r="0.5" fill="#FFFFFF" />

                                                {/* Bottom Swivel Collar (where cord joins ring) */}
                                                <circle cx="120" cy="30.5" r="2.5" fill="url(#snakeBrassGrad)" stroke="#451A03" strokeWidth="0.9" />
                                                <circle cx="119.3" cy="29.8" r="0.6" fill="#FFFFFF" />

                                                {/* Vertical Hanging Rope - Braided Jute Cord (From y=32.5 down to y=69) */}
                                                <line x1="120.5" y1="32.5" x2="120.5" y2="69" stroke="rgba(0,0,0,0.18)" strokeWidth="3.8" strokeLinecap="round" />
                                                <line x1="120" y1="32.5" x2="120" y2="69" stroke="url(#snakeRopeGrad)" strokeWidth="3" strokeLinecap="round" />
                                                <line x1="120" y1="32.5" x2="120" y2="69" stroke="#FDE68A" strokeWidth="1.6" strokeDasharray="4 3" strokeLinecap="round" />
                                                <line x1="119.5" y1="32.5" x2="119.5" y2="69" stroke="#FFFBEB" strokeWidth="0.8" strokeLinecap="round" />

                                                {/* 🪝 PREMIUM 3D POLISHED BRASS HOOK FIXTURE ("Huk" - Exact Match to User's Uploaded Image) */}
                                                {/* Hook Eyelet Loop */}
                                                <circle cx="120" cy="69" r="4.2" fill="none" stroke="url(#snakeBrassGrad)" strokeWidth="2.2" />
                                                <circle cx="120" cy="69" r="5.2" fill="none" stroke="#451A03" strokeWidth="1" />
                                                <circle cx="120" cy="69" r="3.2" fill="none" stroke="#451A03" strokeWidth="0.8" />

                                                {/* Hook Saddle Bracket Base (Anchors onto the category round disc) */}
                                                <path d="M 111,76 C 111,69 129,69 129,76 C 132,80 132,84 132,84 L 108,84 C 108,84 108,80 111,76 Z" fill="rgba(0,0,0,0.22)" />
                                                <path d="M 112,75 C 112,68.5 128,68.5 128,75 C 131,78.5 131,83 131,83 L 109,83 C 109,83 109,78.5 112,75 Z" fill="url(#snakeBrassGrad)" stroke="#451A03" strokeWidth="1.5" strokeLinejoin="round" />
                                                <path d="M 114,73 C 116,70.5 124,70.5 126,73" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

                                                {/* Central Hook Rivet Bead / Bolt Head with 3D Specular Highlight */}
                                                <circle cx="120" cy="76" r="4.2" fill="url(#snakeBrassGrad)" stroke="#451A03" strokeWidth="1.2" />
                                                <circle cx="120" cy="76" r="2.2" fill="#78350F" opacity="0.6" />
                                                <circle cx="118.8" cy="74.5" r="1.4" fill="#FFFFFF" />
                                            </svg>
                                        </div>

                                        {/* 🎯 GOL ROUND (HICHKO SWING) CATEGORY CARD - MOUNTED DIRECTLY BENEATH THE HOOK */}
                                        <div
                                            className="hichko-swing-disc -mt-[14px] flex flex-col items-center w-full"
                                            style={{
                                                animationDelay: `${-(idx * 0.45) % 3.6}s`
                                            }}
                                        >
                                            {/* Circular Disc */}
                                            <div 
                                                className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1.5 transition-all duration-300 shadow-[0_12px_28px_rgba(0,0,0,0.12)] group-hover/card:shadow-[0_20px_38px_rgba(0,0,0,0.22)] group-hover/card:scale-106 shrink-0 ${
                                                    isSelected
                                                        ? 'ring-4 ring-rose-500/30 scale-106 shadow-[0_14px_34px_rgba(229,26,34,0.38)]'
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor: isSelected ? '#E51A22' : (theme.border || '#FDA4AF'),
                                                }}
                                            >
                                                {/* Top-Left Floating Deco Emoji Badge */}
                                                <div className="absolute -top-1 -left-1 z-30 pointer-events-none transition-transform duration-300 group-hover/card:scale-125 group-hover/card:-rotate-12">
                                                    <div 
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border flex items-center justify-center"
                                                        style={{ borderColor: `${theme.border}50` }}
                                                    >
                                                        <span className="text-sm sm:text-base select-none leading-none">{emoji}</span>
                                                    </div>
                                                </div>

                                                {/* Top-Right Sparkle or Active Tag */}
                                                {isSelected && (
                                                    <div className="absolute -top-1 -right-1 z-30 pointer-events-none animate-bounce">
                                                        <div className="w-6 h-6 rounded-full bg-[#E51A22] text-white shadow-md border border-white flex items-center justify-center">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Inner White Circle with Category Photo */}
                                                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center relative">
                                                    <img
                                                        src={getImageUrl(cat.image)}
                                                        alt={cat.name}
                                                        draggable="false"
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-115 pointer-events-none"
                                                    />

                                                    {/* Glossy 3D Glass Sphere Reflection */}
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Category Name & Badge beneath the circle */}
                                            <div className="text-center flex flex-col items-center justify-center mt-2.5 px-1 shrink-0 w-full">
                                                <h3 className={`font-black text-[12px] sm:text-[13px] uppercase tracking-wide leading-tight line-clamp-1 transition-colors duration-200 ${
                                                    isSelected ? 'text-[#E51A22]' : 'text-slate-900 group-hover/card:text-[#E51A22]'
                                                }`}>
                                                    {cat.name}
                                                </h3>
                                                <p className="text-[10px] font-bold text-slate-400 group-hover/card:text-slate-600 line-clamp-1 mt-0.5 tracking-tight transition-colors">
                                                    {theme.sub || 'Curated Toys'}
                                                </p>

                                                <div className="mt-1.5">
                                                    <span className={`inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-200 ${
                                                        isSelected
                                                            ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-xs'
                                                            : `${theme.pillBg || 'bg-slate-100 text-slate-700 border-slate-200'} group-hover/card:border-[#E51A22]`
                                                    }`}>
                                                        {isSelected ? (
                                                            <>
                                                                <Sparkles className="w-2.5 h-2.5" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            theme.tag || 'Explore'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
