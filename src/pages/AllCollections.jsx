import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, X, Star, Package, Check, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import ProductCatalogSection from '../components/ProductCatalogSection';

// 1. Snowman Graphic (Winter Wonderland Bottom Left)
const SnowmanGraphic = () => (
    <svg viewBox="0 0 100 115" className="w-22 sm:w-26 h-auto overflow-visible select-none drop-shadow-lg">
        {/* Soft shadow */}
        <ellipse cx="50" cy="108" rx="34" ry="7" fill="#000000" opacity="0.12" />

        {/* Snowman Body (Bottom snowball) */}
        <circle cx="50" cy="80" r="28" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
        <path d="M28,87 Q50,108 72,87 Q50,104 28,87 Z" fill="#E0F2FE" />

        {/* 3 Coal Buttons */}
        <circle cx="50" cy="71" r="2.8" fill="#1E293B" />
        <circle cx="50" cy="81" r="2.8" fill="#1E293B" />
        <circle cx="50" cy="91" r="2.8" fill="#1E293B" />

        {/* Snowman Head (Top snowball) */}
        <circle cx="50" cy="42" r="20" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
        <path d="M35,46 Q50,60 65,46 Q50,56 35,46 Z" fill="#E0F2FE" />

        {/* Eyes */}
        <circle cx="43" cy="37" r="2.2" fill="#0F172A" />
        <circle cx="57" cy="37" r="2.2" fill="#0F172A" />
        <circle cx="44" cy="36" r="0.8" fill="#FFFFFF" />
        <circle cx="58" cy="36" r="0.8" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="37" cy="43" rx="3.5" ry="2.2" fill="#F472B6" opacity="0.65" />
        <ellipse cx="63" cy="43" rx="3.5" ry="2.2" fill="#F472B6" opacity="0.65" />

        {/* Carrot Nose */}
        <polygon points="49,39 49,45 34,44" fill="#F97316" stroke="#EA580C" strokeWidth="1" strokeLinejoin="round" />

        {/* Coal Smile */}
        <circle cx="43" cy="48" r="1.3" fill="#1E293B" />
        <circle cx="47" cy="50.5" r="1.3" fill="#1E293B" />
        <circle cx="50" cy="51" r="1.3" fill="#1E293B" />
        <circle cx="53" cy="50.5" r="1.3" fill="#1E293B" />
        <circle cx="57" cy="48" r="1.3" fill="#1E293B" />

        {/* Scarf wrapped around neck */}
        <path d="M33,53 Q50,61 67,53 Q70,59 66,64 Q50,70 34,64 Z" fill="#2563EB" />
        <path d="M39,55 L40,64 M47,57 L48,66 M54,56 L55,65 M61,54 L62,63" stroke="#93C5FD" strokeWidth="2.5" />
        {/* Hanging scarf tail */}
        <path d="M54,60 L51,85 Q56,87 61,85 L63,60 Z" fill="#2563EB" />
        <path d="M52.5,68 L61.5,68 M52,76 L61,76" stroke="#93C5FD" strokeWidth="2.5" />

        {/* Beanie Hat */}
        <path d="M32,32 Q50,15 68,32 Z" fill="#0284C7" />
        {/* Folded rim of hat */}
        <rect x="30" y="29" width="40" height="7" rx="3.5" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="1" />
        {/* Fluffy Pom-Pom */}
        <circle cx="50" cy="14" r="6.5" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
    </svg>
);

// 2. Winter Snowy Mountains Graphic (Winter Wonderland Background - next to title)
const WinterMountainsGraphic = () => (
    <svg viewBox="0 0 170 130" className="w-28 sm:w-36 h-auto opacity-95 pointer-events-none select-none">
        {/* Floating delicate snowflakes */}
        <text x="12" y="30" fill="#93C5FD" fontSize="14" fontWeight="bold">❄</text>
        <text x="145" y="48" fill="#BAE6FD" fontSize="16" fontWeight="bold">❄</text>
        <text x="60" y="14" fill="#93C5FD" fontSize="12" fontWeight="bold">❄</text>
        <text x="110" y="24" fill="#BAE6FD" fontSize="11" fontWeight="bold">❄</text>

        {/* Back mountain peak */}
        <polygon points="70,35 25,125 115,125" fill="#93C5FD" opacity="0.65" />
        <polygon points="70,35 52,65 62,60 70,72 78,60 88,65" fill="#FFFFFF" />

        {/* Left mountain peak */}
        <polygon points="42,50 5,125 80,125" fill="#60A5FA" opacity="0.8" />
        <polygon points="42,50 26,78 35,74 42,82 48,74 58,78" fill="#FFFFFF" />

        {/* Main front mountain peak */}
        <polygon points="115,22 60,125 168,125" fill="#3B82F6" opacity="0.9" />
        <polygon points="115,22 92,60 104,54 115,68 126,54 138,60" fill="#FFFFFF" />

        {/* Base snowdrifts */}
        <path d="M0,115 Q45,100 90,115 T170,115 L170,130 L0,130 Z" fill="#DBEAFE" opacity="0.8" />
    </svg>
);

// 2b. Winter Snow Dunes Graphic (Bottom-Right of the card)
const WinterSnowDunesGraphic = () => (
    <svg viewBox="0 0 180 80" className="w-36 sm:w-48 h-auto pointer-events-none select-none">
        <path d="M0,50 Q45,20 90,40 Q135,60 180,30 L180,80 L0,80 Z" fill="#E0F2FE" opacity="0.6" />
        <path d="M20,60 Q70,35 120,55 Q150,65 180,45 L180,80 L20,80 Z" fill="#BAE6FD" opacity="0.5" />
    </svg>
);

// 3. Summer Cheerful Sun Graphic (Summer Bonanza Top Right)
const SummerSunGraphic = () => (
    <svg viewBox="-15 -15 150 150" className="w-20 sm:w-24 h-auto pointer-events-none select-none drop-shadow-sm">
        {/* Golden Sunshine Rays */}
        <g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round">
            <line x1="60" y1="16" x2="60" y2="4" />
            <line x1="60" y1="104" x2="60" y2="116" />
            <line x1="16" y1="60" x2="4" y2="60" />
            <line x1="104" y1="60" x2="116" y2="60" />
            <line x1="28" y1="28" x2="20" y2="20" />
            <line x1="92" y1="92" x2="100" y2="100" />
            <line x1="28" y1="92" x2="20" y2="100" />
            <line x1="92" y1="28" x2="100" y2="20" />
        </g>
        {/* Outer Sun Glow */}
        <circle cx="60" cy="60" r="32" fill="#FBBF24" />
        {/* Inner Sun Face */}
        <circle cx="60" cy="60" r="28" fill="#FDE047" />
        {/* Smiling Eyes */}
        <circle cx="51" cy="55" r="3" fill="#78350F" />
        <circle cx="69" cy="55" r="3" fill="#78350F" />
        {/* Rosy Pink Cheeks */}
        <ellipse cx="45" cy="63" rx="4" ry="2.5" fill="#F87171" opacity="0.65" />
        <ellipse cx="75" cy="63" rx="4" ry="2.5" fill="#F87171" opacity="0.65" />
        {/* Happy Smile */}
        <path d="M53,62 Q60,71 67,62" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// 4. Summer Beach & Palm Graphic (Summer Bonanza Bottom Right)
const SummerBeachGraphic = () => (
    <svg viewBox="0 0 180 150" className="w-36 sm:w-44 h-auto overflow-visible pointer-events-none select-none">
        {/* Ocean Waves */}
        <path d="M0,110 Q45,95 100,110 Q145,120 180,105 L180,150 L0,150 Z" fill="#38BDF8" opacity="0.6" />
        <path d="M20,120 Q65,105 120,120 Q155,128 180,118 L180,150 L0,150 Z" fill="#0EA5E9" opacity="0.45" />

        {/* Golden Sand Beach */}
        <path d="M40,125 Q95,110 150,123 Q165,127 180,125 L180,150 L40,150 Z" fill="#FDE047" />
        <path d="M65,133 Q120,120 180,130 L180,150 L65,150 Z" fill="#FCD34D" />

        {/* Palm Tree Trunk */}
        <path d="M145,140 Q138,100 142,62" fill="none" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
        <path d="M143,122 L147,125 M141,105 L145,108 M140,88 L144,91 M140,72 L144,75" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

        {/* Palm Tree Leaves */}
        <path d="M142,62 Q115,50 98,68 Q120,65 142,62 Z" fill="#16A34A" />
        <path d="M142,62 Q128,36 110,40 Q130,46 142,62 Z" fill="#22C55E" />
        <path d="M142,62 Q145,28 158,34 Q152,48 142,62 Z" fill="#4ADE80" />
        <path d="M142,62 Q170,42 180,56 Q162,58 142,62 Z" fill="#16A34A" />
        <path d="M142,62 Q162,72 172,86 Q156,79 142,62 Z" fill="#15803D" />

        {/* Coconuts */}
        <circle cx="140" cy="65" r="3.5" fill="#78350F" />
        <circle cx="145" cy="66" r="3.5" fill="#5F2808" />
    </svg>
);

// 5. Starfish Graphic (Summer Bonanza Bottom Left)
const StarfishGraphic = () => (
    <svg viewBox="0 0 70 70" className="w-14 sm:w-16 h-auto drop-shadow-md pointer-events-none select-none">
        <ellipse cx="35" cy="64" rx="22" ry="5" fill="#000000" opacity="0.12" />
        <path
            d="M35,6 Q39,22 47,24 Q63,24 59,36 Q50,42 50,51 Q55,66 42,60 Q34,54 27,60 Q15,66 20,51 Q19,42 10,36 Q6,24 22,24 Q30,22 35,6 Z"
            fill="#FBBF24"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* Cute Face */}
        <circle cx="31" cy="33" r="2.2" fill="#78350F" />
        <circle cx="39" cy="33" r="2.2" fill="#78350F" />
        <circle cx="32" cy="32" r="0.8" fill="#FFFFFF" />
        <circle cx="40" cy="32" r="0.8" fill="#FFFFFF" />
        <path d="M32,38 Q35,42 38,38" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="27" cy="36" rx="2" ry="1.5" fill="#F87171" opacity="0.7" />
        <ellipse cx="43" cy="36" rx="2" ry="1.5" fill="#F87171" opacity="0.7" />
        {/* Orange arm speckles */}
        <circle cx="35" cy="16" r="1.8" fill="#EA580C" opacity="0.7" />
        <circle cx="52" cy="31" r="1.8" fill="#EA580C" opacity="0.7" />
        <circle cx="45" cy="53" r="1.8" fill="#EA580C" opacity="0.7" />
        <circle cx="25" cy="53" r="1.8" fill="#EA580C" opacity="0.7" />
        <circle cx="17" cy="31" r="1.8" fill="#EA580C" opacity="0.7" />
    </svg>
);

// Bespoke Collection Themes matching exactly the requested custom designs
const COLLECTION_THEMES = {
    'winter wonderland': {
        seriesNumber: '01 / CURATED SERIES',
        seriesColor: 'text-[#0284C7]',
        cardBg: 'bg-gradient-to-br from-white via-sky-50/40 to-blue-50/20',
        cardBorder: 'border-2 border-[#BAE6FD] hover:border-sky-400',
        activeRing: 'ring-4 ring-sky-500/40 border-sky-600',
        artworkImage: '/images/collections/winter_artwork_exact.png?v=4',
        badgeBg: 'bg-[#0284C7]',
        badgeText: 'WINTER SPECIAL',
        badgeIcon: '❄️',
        titlePart1: 'Winter',
        titlePart1Color: 'text-[#0F2C59]',
        titlePart2: 'Wonderland',
        titlePart2Color: 'text-[#0284C7]',
        titleDeco: 'heart',
        pills: [
            { icon: '🐻', label: 'Cozy Plush', bg: 'bg-[#EFF6FF]', text: 'text-[#0369A1]', border: 'border-[#BFDBFE]' },
            { icon: '🧩', label: 'Holiday Puzzles', bg: 'bg-[#EFF6FF]', text: 'text-[#0369A1]', border: 'border-[#BFDBFE]' },
            { icon: '🎲', label: 'Building Sets', bg: 'bg-[#EFF6FF]', text: 'text-[#0369A1]', border: 'border-[#BFDBFE]' }
        ],
        btnBg: 'bg-[#0A357E] hover:bg-[#072559]',
        cornerGraphic: 'snowman',
        bgGraphic: 'mountains'
    },
    'summer bonanza': {
        seriesNumber: '02 / CURATED SERIES',
        seriesColor: 'text-[#D97706]',
        cardBg: 'bg-gradient-to-br from-white via-amber-50/40 to-orange-50/20',
        cardBorder: 'border-2 border-[#FDE68A] hover:border-amber-400',
        activeRing: 'ring-4 ring-amber-500/40 border-amber-600',
        artworkImage: '/images/collections/summer_artwork_exact.png?v=4',
        badgeBg: 'bg-[#F59E0B]',
        badgeText: 'SUMMER FEST',
        badgeIcon: '☀️',
        titlePart1: 'Summer',
        titlePart1Color: 'text-[#3E2312]',
        titlePart2: 'Bonanza',
        titlePart2Color: 'text-[#EA580C]',
        titleDeco: 'sunbeams',
        pills: [
            { icon: '☀️', label: 'Outdoor & Splash', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
            { icon: '🍃', label: 'Active Garden', bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]' },
            { icon: '🏖️', label: 'Beach Toys', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' }
        ],
        btnBg: 'bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#EA580C] hover:from-[#D97706] hover:to-[#C2410C]',
        cornerGraphic: 'starfish',
        bgGraphic: 'beach_sun'
    },
    'baby': {
        seriesNumber: '03 / CURATED SERIES',
        seriesColor: 'text-[#E11D48]',
        cardBorder: 'border-2 border-[#FECDD3] hover:border-rose-400',
        activeRing: 'ring-4 ring-rose-500/40 border-rose-600',
        badgeBg: 'bg-[#E11D48]',
        badgeText: 'BABY SPECIAL',
        badgeIcon: '🍼',
        titlePart1: 'Baby',
        titlePart1Color: 'text-[#4C0519]',
        titlePart2: 'Care',
        titlePart2Color: 'text-[#E11D48]',
        titleDeco: 'heart',
        pills: [
            { icon: '🍼', label: 'Sensory Rattles', bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' },
            { icon: '🧸', label: 'Soft Teethers', bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' },
            { icon: '⭐', label: 'Milestone Toys', bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' }
        ],
        btnBg: 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239]',
        cornerGraphic: null,
        bgGraphic: null
    }
};

const FALLBACK_COLLECTION_THEMES = [
    COLLECTION_THEMES['winter wonderland'],
    COLLECTION_THEMES['summer bonanza']
];

const getCollectionTheme = (name, index = 0) => {
    if (!name) return FALLBACK_COLLECTION_THEMES[0];
    const key = name.toLowerCase().trim();
    if (COLLECTION_THEMES[key]) return COLLECTION_THEMES[key];

    for (const [presetKey, theme] of Object.entries(COLLECTION_THEMES)) {
        if (key.includes(presetKey) || presetKey.includes(key)) {
            return theme;
        }
    }
    return FALLBACK_COLLECTION_THEMES[index % FALLBACK_COLLECTION_THEMES.length];
};

const AllCollections = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const colQuery = searchParams.get('collection') || '';

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState(colQuery || null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/collections`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setCollections(data.data.filter(c => c.status === 'Active'));
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    useEffect(() => {
        if (colQuery) {
            setSelectedCollection(colQuery);
        } else {
            setSelectedCollection(null);
        }
    }, [colQuery]);

    const handleCollectionClick = (col) => {
        const id = col._id;
        if (selectedCollection === id) {
            setSelectedCollection(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('collection');
            setSearchParams(newParams);
        } else {
            setSelectedCollection(id);
            const newParams = new URLSearchParams(searchParams);
            newParams.set('collection', id);
            setSearchParams(newParams);
        }

        // Smooth scroll to products
        setTimeout(() => {
            const target = document.getElementById('catalog-products-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleClearCollection = () => {
        setSelectedCollection(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('collection');
        setSearchParams(newParams);
    };

    const getImageUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80';
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/gallery')) return img;
        const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    const activeCollectionObj = collections.find(c => c._id === selectedCollection);

    return (
        <div className="w-full min-h-screen bg-[#FFFDF9] font-sans">

            {/* 1. COMPACT STYLISH HEADER BANNER STRIP ("patto") - THEME-BLENDED LIGHT BLOSSOM ROSE */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#FDF2F8] via-[#FCE7F3] to-[#F3E8FF] text-slate-800 pt-5 sm:pt-6 pb-9 sm:pb-10">
                {/* Decorative background playful patterns & soft pastel glow */}
                <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#DB2777_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-300/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-200/35 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                    <div>
                        {/* Left-Aligned Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 flex-wrap">
                            <Link to="/" className="text-slate-600 hover:text-[#DB2777] transition-colors underline-offset-2 hover:underline">Home</Link>
                            <span className="opacity-40">/</span>
                            <span className="text-[#9D174D] font-extrabold">Toy Collections</span>
                        </div>

                        {/* Bold Left-Aligned Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight leading-tight mb-1">
                            Toy Collections
                        </h1>

                        {/* Left-Aligned Tagline */}
                        <p className="text-slate-600 text-xs sm:text-[13.5px] max-w-xl font-medium leading-relaxed">
                            Discover specially assembled collections designed around themes, milestones, gifting occasions, and play experiences.
                        </p>
                    </div>

                    {/* Right-Side Collections Badge */}
                    <div className="hidden sm:flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-200/80 shadow-xs shrink-0 self-start md:self-center">
                        <span className="text-2xl">✨</span>
                        <div>
                            <span className="block text-[10.5px] font-black uppercase tracking-wider text-pink-600">Exclusive Sets</span>
                            <span className="block text-xs text-slate-900 font-black">Curated Themes</span>
                        </div>
                    </div>
                </div>

                {/* Unique Quad-Arch Scallop Cloud Wave Line & Curve at the bottom of the banner */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
                    <svg
                        viewBox="0 0 1200 60"
                        preserveAspectRatio="none"
                        className="w-full h-5 sm:h-7 md:h-8 block"
                    >
                        {/* Fill to section background */}
                        <path
                            d="M0,26 Q150,8 300,26 T600,26 T900,26 T1200,26 L1200,60 L0,60 Z"
                            fill="#FFFBF7"
                        />
                        {/* Wave accent stroke */}
                        <path
                            d="M0,26 Q150,8 300,26 T600,26 T900,26 T1200,26"
                            fill="none"
                            stroke="#F472B6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            {/* 2. HANDCRAFTED CURATED COLLECTIONS SHOWCASE */}
            <div className="w-full bg-[#FFFDF9] pt-8 sm:pt-10 pb-12 sm:pb-16 border-b border-pink-200/60 relative overflow-hidden">
                {/* Subtle soft warm background ambient aura */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">

                    {/* Header Bar: Clean & Human-Designed */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 sm:mb-9">
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E51A22] text-[11px] font-black uppercase tracking-wider border border-rose-200/70">
                                    <Sparkles className="w-3.5 h-3.5 text-[#E51A22]" /> Curated Series ({collections.length} Collections)
                                </span>
                                {selectedCollection && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A24] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                        Viewing: {activeCollectionObj?.name || 'Selected'}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleClearCollection(); }}
                                            className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            title="Clear filter"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A24] tracking-tight leading-tight">
                                Curated Toy Collections
                            </h2>
                            <p className="text-xs sm:text-[14px] text-slate-500 font-medium mt-1">
                                Handpicked toy editions thoughtfully assembled by season, play style, and family moments
                            </p>
                        </div>

                        {/* Header Action Controls */}
                        <div className="flex items-center flex-wrap gap-2.5">
                            <button
                                type="button"
                                onClick={handleClearCollection}
                                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2 ${!selectedCollection
                                        ? 'bg-[#E51A22] text-white shadow-md shadow-rose-500/25 scale-102 ring-2 ring-rose-400/30'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22] hover:bg-rose-50/40'
                                    }`}
                            >
                                <Compass className="w-3.5 h-3.5" />
                                All Collections (Show All)
                            </button>
                        </div>
                    </div>

                    {/* Collections Cards Grid - Boutique Toy Shopfronts */}
                    {loading ? (
                        <div className="py-14 flex flex-col items-center justify-center gap-3">
                            <div className="w-10 h-10 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Curated Sets...</span>
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                            <span className="text-4xl block mb-2">🎁</span>
                            <h3 className="text-base font-black text-slate-700">No active collections found</h3>
                            <p className="text-xs text-slate-400 mt-1">Check back soon for new seasonal sets!</p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 sm:gap-7 ${collections.length === 1
                                ? 'max-w-2xl mx-auto'
                                : collections.length === 2
                                    ? 'grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto'
                                    : collections.length === 3
                                        ? 'grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto'
                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            }`}>
                            {collections.map((col, idx) => {
                                const isSelected = selectedCollection === col._id;
                                const theme = getCollectionTheme(col.name, idx);

                                return (
                                    <div
                                        key={col._id}
                                        onClick={() => handleCollectionClick(col)}
                                        className={`group/card relative rounded-[32px] sm:rounded-[36px] overflow-hidden ${theme.cardBg || 'bg-white'} ${theme.cardBorder} p-4 sm:p-5 md:p-6 transition-all duration-300 cursor-pointer select-none flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${isSelected ? `${theme.activeRing} scale-[1.01] shadow-xl` : ''
                                            }`}
                                    >
                                        {/* BACKGROUND SCENE GRAPHICS (Clipped cleanly to rounded card corners - no bleeding) */}
                                        <div className="absolute inset-0 rounded-[32px] sm:rounded-[36px] overflow-hidden pointer-events-none z-0">
                                            {theme.bgGraphic === 'mountains' && (
                                                <>
                                                    {/* Mountain trio floating beside title */}
                                                    <div className="absolute top-14 sm:top-16 right-3 sm:right-5">
                                                        <WinterMountainsGraphic />
                                                    </div>
                                                    {/* Snow dunes at bottom right */}
                                                    <div className="absolute bottom-0 right-0">
                                                        <WinterSnowDunesGraphic />
                                                    </div>
                                                    {/* Floating delicate snowflakes */}
                                                    <span className="text-sky-300 text-sm absolute top-3 left-4 select-none opacity-60">❄</span>
                                                    <span className="text-sky-200 text-base absolute top-2 right-28 select-none opacity-50">❄</span>
                                                    <span className="text-sky-300 text-xs absolute bottom-16 right-36 select-none opacity-50">❄</span>
                                                </>
                                            )}
                                            {theme.bgGraphic === 'beach_sun' && (
                                                <>
                                                    {/* Cheerful Sun at top right - positioned with full headroom so it never cuts */}
                                                    <div className="absolute top-11 sm:top-13 right-4 sm:right-6">
                                                        <SummerSunGraphic />
                                                    </div>
                                                    {/* Beach shore and Palm tree at bottom right */}
                                                    <div className="absolute bottom-0 right-0">
                                                        <SummerBeachGraphic />
                                                    </div>
                                                    {/* Warm subtle sunbeams at top left */}
                                                    <span className="text-amber-300 text-sm absolute top-3 left-4 select-none opacity-60">✨</span>
                                                </>
                                            )}
                                        </div>

                                                {/* LEFT SIDE: ORGANIC ARTWORK DIRECTLY INTEGRATED (FULL & UNCLIPPED) */}
                                                <div className="relative w-full sm:w-[260px] md:w-[280px] shrink-0 z-10 flex items-center justify-center">
                                                    <div className="relative w-full h-[250px] sm:h-[275px] md:h-[295px] flex items-center justify-center p-1">
                                                        {theme.artworkImage ? (
                                                            <img
                                                                src={theme.artworkImage}
                                                                alt={col.name}
                                                                loading="lazy"
                                                                className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 ease-out group-hover/card:scale-105 select-none pointer-events-none"
                                                            />
                                                        ) : (
                                                            <div className="relative w-full h-full overflow-hidden rounded-3xl border border-slate-100">
                                                                <img
                                                                    src={getImageUrl(col.image)}
                                                                    alt={col.name}
                                                                    loading="lazy"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                {/* Fallback Badge */}
                                                                <div className="absolute top-2 left-2 z-20">
                                                                    <div className={`${theme.badgeBg} text-white px-3 py-1 rounded-full font-black text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-white`}>
                                                                        <span className="text-xs">{theme.badgeIcon}</span>
                                                                        <span>{theme.badgeText}</span>
                                                                    </div>
                                                                </div>
                                                                {/* Fallback Mascot */}
                                                                {theme.cornerGraphic === 'snowman' && (
                                                                    <div className="absolute -bottom-3 -left-3 z-30 pointer-events-none drop-shadow-xl">
                                                                        <SnowmanGraphic />
                                                                    </div>
                                                                )}
                                                                {theme.cornerGraphic === 'starfish' && (
                                                                    <div className="absolute -bottom-2 -left-2 z-30 pointer-events-none drop-shadow-md">
                                                                        <StarfishGraphic />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* RIGHT SIDE: CURATED CONTENT */}
                                                <div className="flex-1 flex flex-col justify-between h-full py-1 z-10 w-full text-left">
                                                    <div>
                                                        {/* Top Row: Series Number & Crown Badge */}
                                                        <div className="flex items-center justify-between gap-3 mb-2 w-full">
                                                            <span className={`text-xs font-black uppercase tracking-wider whitespace-nowrap ${theme.seriesColor}`}>
                                                                {theme.seriesNumber}
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 whitespace-nowrap">
                                                                <span className="text-amber-400 text-xs">👑</span> Little Joys Exclusive
                                                            </span>
                                                        </div>

                                                        {/* Split Playful Title - Stacked exactly as in the reference mockup */}
                                                        <div className="mb-2">
                                                            <h3
                                                                className={`text-2xl sm:text-[32px] font-black ${theme.titlePart1Color} tracking-normal leading-tight mb-0.5`}
                                                                style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
                                                            >
                                                                {theme.titlePart1}
                                                            </h3>
                                                            <div className="flex items-center gap-2">
                                                                <h3
                                                                    className={`text-2xl sm:text-[32px] font-black ${theme.titlePart2Color} tracking-normal leading-tight`}
                                                                    style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
                                                                >
                                                                    {theme.titlePart2}
                                                                </h3>
                                                                {theme.titleDeco === 'heart' && (
                                                                    <span className="text-amber-400 text-2xl leading-none select-none inline-block transform hover:scale-125 transition-transform">💛</span>
                                                                )}
                                                                {theme.titleDeco === 'sunbeams' && (
                                                                    <span className="text-amber-400 text-xl font-black leading-none select-none inline-block">彡</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed mb-3 line-clamp-2 max-w-[270px] sm:max-w-[300px]">
                                                            {col.description || `${col.name} description`}
                                                        </p>

                                                        {/* The 3 Pills */}
                                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                                            {theme.pills.map((pill, pIdx) => (
                                                                <span
                                                                    key={pIdx}
                                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${pill.bg} ${pill.text} border ${pill.border} text-[11px] sm:text-xs font-bold shadow-2xs`}
                                                                >
                                                                    <span>{pill.icon}</span>
                                                                    <span>{pill.label}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            className={`w-full py-3 sm:py-3.5 px-6 rounded-full ${theme.btnBg} text-white font-black text-xs sm:text-[12.5px] uppercase tracking-wider flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.99] cursor-pointer`}
                                                        >
                                                            <span>{isSelected ? `VIEWING ${col.name.toUpperCase()} TOYS` : 'EXPLORE COLLECTION'}</span>
                                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/card:translate-x-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            );
                            })}
                                        </div>
                    )}

                                    </div>
            </div>

            {/* 3. PRODUCTS & FILTER SECTION BELOW */}
                    <ProductCatalogSection
                        selectedCollection={selectedCollection}
                        onSelectCollection={setSelectedCollection}
                        catalogTitle={activeCollectionObj ? `${activeCollectionObj.name} Collection` : 'All Collections & Products'}
                        catalogSubtitle={activeCollectionObj ? `Showing handpicked toys curated under the ${activeCollectionObj.name} collection` : 'Browse all products or select a specific collection above to filter'}
                    />

                </div>
                );
};

                export default AllCollections;
