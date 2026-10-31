import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Compass, X, Check } from 'lucide-react';
import ProductCatalogSection from '../components/ProductCatalogSection';

// ==========================================
// 🏷️ 5 CURATED PRICE TIERS (1 BOX PER VALAK / CURVE)
// ==========================================
const priceRangeCards = [
    {
        id: 'under-299',
        label: 'Under ₹299',
        sub: 'Pocket Treats',
        badgeText: 'Pocket Fun',
        amount: '₹299',
        emoji: '⭐',
        minPrice: null,
        maxPrice: 299,
        borderColor: '#0284C7',
        borderSoft: '#38BDF8',
        tag: 'Pocket Fun'
    },
    {
        id: 'under-499',
        label: 'Under ₹499',
        sub: 'Sweet Value',
        badgeText: 'Sweet Value',
        amount: '₹499',
        emoji: '🎁',
        minPrice: null,
        maxPrice: 499,
        borderColor: '#059669',
        borderSoft: '#34D399',
        tag: 'Sweet Value'
    },
    {
        id: 'under-699',
        label: 'Under ₹699',
        sub: 'Most Popular',
        badgeText: 'Popular',
        amount: '₹699',
        emoji: '🔥',
        minPrice: null,
        maxPrice: 699,
        borderColor: '#D97706',
        borderSoft: '#FBBF24',
        tag: 'Popular'
    },
    {
        id: 'under-999',
        label: 'Under ₹999',
        sub: 'Action & Tech',
        badgeText: 'Action Pick',
        amount: '₹999',
        emoji: '⚡',
        minPrice: null,
        maxPrice: 999,
        borderColor: '#7C3AED',
        borderSoft: '#A78BFA',
        tag: 'Top Rated'
    },
    {
        id: 'above-999',
        label: 'Above ₹1,000',
        sub: 'Deluxe Gifts',
        badgeText: 'Deluxe',
        amount: '₹1,000+',
        emoji: '👑',
        minPrice: 1000,
        maxPrice: null,
        borderColor: '#E11D48',
        borderSoft: '#FB7185',
        tag: 'Deluxe'
    }
];

// ==========================================
// 🌊 EXACT 5 VALAK (CURVES) IN THE SNAKE WAVE ROPE
// 1st Valak: Down (68px) at 10%
// 2nd Valak: Up (18px) at 30%
// 3rd Valak: Down (68px) at 50%
// 4th Valak: Up (18px) at 70%
// 5th Valak: Down (68px) at 90%
// ==========================================
const CARD_POSITIONS = [
    { leftPercent: '10%', topPx: 68, delay: '0s', valakType: 'Down' },
    { leftPercent: '30%', topPx: 18, delay: '-0.7s', valakType: 'Up' },
    { leftPercent: '50%', topPx: 68, delay: '-1.4s', valakType: 'Down' },
    { leftPercent: '70%', topPx: 18, delay: '-2.1s', valakType: 'Up' },
    { leftPercent: '90%', topPx: 68, delay: '-2.8s', valakType: 'Down' }
];

const ShopByPrice = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const minParam = searchParams.get('minPrice');
    const maxParam = searchParams.get('maxPrice');

    const [selectedRange, setSelectedRange] = useState(() => {
        if (!minParam && !maxParam) return null;
        const minNum = minParam ? Number(minParam) : null;
        const maxNum = maxParam ? Number(maxParam) : null;
        return priceRangeCards.find(r => r.minPrice === minNum && r.maxPrice === maxNum) || null;
    });

    useEffect(() => {
        if (!minParam && !maxParam) {
            setSelectedRange(null);
        } else {
            const minNum = minParam ? Number(minParam) : null;
            const maxNum = maxParam ? Number(maxParam) : null;
            const match = priceRangeCards.find(r => r.minPrice === minNum && r.maxPrice === maxNum);
            setSelectedRange(match || null);
        }
    }, [minParam, maxParam]);

    const handleRangeClick = (range) => {
        if (selectedRange?.id === range.id) {
            setSelectedRange(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('minPrice');
            newParams.delete('maxPrice');
            setSearchParams(newParams);
        } else {
            setSelectedRange(range);
            const newParams = new URLSearchParams(searchParams);
            if (range.minPrice != null) {
                newParams.set('minPrice', range.minPrice);
            } else {
                newParams.delete('minPrice');
            }
            if (range.maxPrice != null) {
                newParams.set('maxPrice', range.maxPrice);
            } else {
                newParams.delete('maxPrice');
            }
            setSearchParams(newParams);
        }

        setTimeout(() => {
            const target = document.getElementById('catalog-products-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 120);
    };

    const handleClearRange = () => {
        setSelectedRange(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('minPrice');
        newParams.delete('maxPrice');
        setSearchParams(newParams);
    };

    return (
        <div className="w-full min-h-screen bg-[#FFFDF9] font-sans">
            
            {/* 1. COMPACT STYLISH HEADER BANNER STRIP - WARM GOLDEN BUDGET THEME */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FED7AA] text-slate-800 pt-5 sm:pt-6 pb-9 sm:pb-10">
                <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#D97706_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-200/35 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                    <div>
                        {/* Left-Aligned Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 flex-wrap">
                            <Link to="/" className="text-slate-600 hover:text-[#D97706] transition-colors underline-offset-2 hover:underline">Home</Link>
                            <span className="opacity-40">/</span>
                            <span className="text-[#B45309] font-extrabold">Shop By Price</span>
                        </div>

                        {/* Bold Left-Aligned Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight leading-tight mb-1">
                            Shop By Price
                        </h1>

                        {/* Left-Aligned Tagline */}
                        <p className="text-slate-600 text-xs sm:text-[13.5px] max-w-xl font-medium leading-relaxed">
                            Find delightful toys and learning games perfectly tailored to match your gifting budget.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                        {/* Right-Side Milestone / Budget Guide Badge */}
                        <div className="hidden sm:flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-200/80 shadow-xs shrink-0">
                            <span className="text-2xl">🏷️</span>
                            <div>
                                <span className="block text-[10.5px] font-black uppercase tracking-wider text-amber-700">Smart Budget Guide</span>
                                <span className="block text-xs text-slate-900 font-black">5 Curated Price Tiers</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClearRange}
                            className={`px-4 py-2 rounded-full text-xs font-black tracking-wide transition-all cursor-pointer shadow-xs ${
                                !selectedRange
                                    ? 'bg-[#E51A22] text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22]'
                            }`}
                        >
                            All Toys
                        </button>
                    </div>
                </div>

                {/* Nag Aakar (Snake Wave) Line at bottom of banner */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
                    <svg 
                        viewBox="0 0 1200 60" 
                        preserveAspectRatio="none" 
                        className="w-full h-5 sm:h-7 md:h-8 block"
                    >
                        <path 
                            d="M0,25 C150,60 300,-10 450,25 C600,60 750,-10 900,25 C1050,60 1150,-5 1200,22 L1200,60 L0,60 Z" 
                            fill="#FFFDF9" 
                            opacity="1"
                        />
                        <path 
                            d="M0,25 C150,60 300,-10 450,25 C600,60 750,-10 900,25 C1050,60 1150,-5 1200,22" 
                            fill="none" 
                            stroke="#F59E0B" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                        />
                    </svg>
                </div>
            </div>

            {/* 2. FULL SCREEN EDGE-TO-EDGE 3D SNAKE WAVE ROPE WITH EXACTLY 5 VALAK & 5 SWINGING BOXES */}
            <div className="w-full bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-[#FAF8F5] pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-200/70 relative overflow-hidden group/section">
                
                {/* CSS KEYFRAMES FOR GENTLE SWINGING MOTION (Halta dekhava joiae) */}
                <style>{`
                    @keyframes hichkoPendantSwing {
                        0% {
                            transform: rotate(-3deg);
                        }
                        50% {
                            transform: rotate(3deg);
                        }
                        100% {
                            transform: rotate(-3deg);
                        }
                    }

                    .hichko-pendant-card {
                        transform-origin: 50% 0px;
                        animation: hichkoPendantSwing 3.4s ease-in-out infinite;
                        will-change: transform;
                    }

                    .hichko-pendant-card:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                {/* SVG GRADIENT DEFINITIONS */}
                <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <defs>
                        {/* 3D Braided Jute Rope Cylinder Gradient */}
                        <linearGradient id="priceSnakeRopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#78350F" />
                            <stop offset="25%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="75%" stopColor="#B45309" />
                            <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>

                        {/* Polished Brass Ring Gradient */}
                        <linearGradient id="priceSnakeBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FEF3C7" />
                            <stop offset="35%" stopColor="#F59E0B" />
                            <stop offset="70%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Header Title & Info Bar */}
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-5 sm:mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-[#B45309] text-[11px] font-black uppercase tracking-wider border border-amber-200/80 shadow-2xs">
                                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-pulse" /> 5 Curated Budget Tiers
                                </span>
                                {selectedRange && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A24] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                        Filtering: {selectedRange.label} ({selectedRange.sub})
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleClearRange(); }}
                                            className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            title="Clear filter"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-[#1A1A24] tracking-tight leading-tight">
                                Select a Toy Budget
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                Tap any budget card below to instantly explore toys and games matching that price range
                            </p>
                        </div>

                        {/* Reset / All Toys Button */}
                        <div className="flex items-center flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleClearRange}
                                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                                    !selectedRange
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

                {/* Mobile scroll hint */}
                <div className="block lg:hidden px-4 text-center mb-1">
                    <span className="text-[11px] font-bold text-amber-800/70 bg-amber-100/60 px-3 py-0.5 rounded-full inline-block">
                        ← Swipe horizontally to see all 5 budget boxes →
                    </span>
                </div>

                {/* 3. 100% EDGE-TO-EDGE SCREEN CONTAINER (Screen ma bane baju adeli dori) */}
                <div className="w-full relative overflow-x-auto overflow-y-hidden pb-8 pt-2 scrollbar-none">
                    <div className="w-full min-w-[1050px] relative h-[410px]">
                        
                        {/* A. 3D SNAKE WAVE ROPE (સાપ આકારની દોરી) - 100% EDGE-TO-EDGE WITH EXACTLY 5 VALAK */}
                        <div className="w-full absolute top-0 left-0 right-0 h-[105px] pointer-events-none z-10">
                            <svg 
                                viewBox="0 0 1000 105" 
                                preserveAspectRatio="none" 
                                className="w-full h-[105px] block overflow-visible"
                            >
                                {/* 1. Rope Drop Shadow */}
                                <path
                                    d="M 0,45 
                                       C 40,45  60,70  100,70 
                                       C 180,70 220,20 300,20 
                                       C 380,20 420,70 500,70 
                                       C 580,70 620,20 700,20 
                                       C 780,20 820,70 900,70 
                                       C 940,70 960,45 1000,45"
                                    fill="none"
                                    stroke="rgba(0,0,0,0.18)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />

                                {/* 2. Main 3D Braided Jute Cable Base */}
                                <path
                                    d="M 0,43 
                                       C 40,43  60,68  100,68 
                                       C 180,68 220,18 300,18 
                                       C 380,18 420,68 500,68 
                                       C 580,68 620,18 700,18 
                                       C 780,18 820,68 900,68 
                                       C 940,68 960,43 1000,43"
                                    fill="none"
                                    stroke="url(#priceSnakeRopeGrad)"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                />

                                {/* 3. Golden Braided Texture Pattern */}
                                <path
                                    d="M 0,43 
                                       C 40,43  60,68  100,68 
                                       C 180,68 220,18 300,18 
                                       C 380,18 420,68 500,68 
                                       C 580,68 620,18 700,18 
                                       C 780,18 820,68 900,68 
                                       C 940,68 960,43 1000,43"
                                    fill="none"
                                    stroke="#FDE68A"
                                    strokeWidth="3.6"
                                    strokeDasharray="9 4.5"
                                    strokeLinecap="round"
                                />

                                {/* 4. Golden Silk Sheen Specular Highlight */}
                                <path
                                    d="M 0,41.8 
                                       C 40,41.8  60,66.8  100,66.8 
                                       C 180,66.8 220,16.8 300,16.8 
                                       C 380,16.8 420,66.8 500,66.8 
                                       C 580,66.8 620,16.8 700,16.8 
                                       C 780,16.8 820,66.8 900,66.8 
                                       C 940,66.8 960,41.8 1000,41.8"
                                    fill="none"
                                    stroke="#FFFBEB"
                                    strokeWidth="1.2"
                                    strokeDasharray="3 9"
                                    strokeLinecap="round"
                                />

                                {/* 5. Golden Brass Rivets at the 5 Contact Points of the 5 Valak */}
                                {[
                                    { cx: 100, cy: 68 },
                                    { cx: 300, cy: 18 },
                                    { cx: 500, cy: 68 },
                                    { cx: 700, cy: 18 },
                                    { cx: 900, cy: 68 }
                                ].map((pt, i) => (
                                    <g key={`rope-peg-${i}`}>
                                        <circle cx={pt.cx} cy={pt.cy} r="5.5" fill="url(#priceSnakeBrassGrad)" stroke="#451A03" strokeWidth="1.2" />
                                        <circle cx={pt.cx} cy={pt.cy} r="2.2" fill="#78350F" opacity="0.6" />
                                        <circle cx={pt.cx - 1} cy={pt.cy - 1.5} r="1.2" fill="#FFFFFF" />
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* B. THE 5 BOXES - 1 BOX IN EACH VALAK (bhale valak Upper Hoy ke Niche) */}
                        {priceRangeCards.map((range, idx) => {
                            const pos = CARD_POSITIONS[idx];
                            const isSelected = selectedRange?.id === range.id;

                            return (
                                <div
                                    key={range.id}
                                    style={{
                                        left: pos.leftPercent,
                                        top: `${pos.topPx}px` // Exactly touches the rope whether Valak is Upper (18px) or Down (68px)!
                                    }}
                                    className="absolute -translate-x-1/2 z-20 w-[190px] sm:w-[204px] flex flex-col items-center select-none transition-all duration-300"
                                >
                                    {/* HICHKO SWINGING CONTAINER (Halta dekhava joiae - pivoting from the apex on the rope) */}
                                    <div
                                        className="hichko-pendant-card w-full flex flex-col items-center cursor-pointer group/box transition-transform duration-300"
                                        style={{
                                            animationDelay: pos.delay
                                        }}
                                        onClick={() => handleRangeClick(range)}
                                        title={`Select ${range.label}`}
                                    >
                                        {/* 1. TOP APEX BRASS CARABINER RING (Dorine adelo - hooked right around the rope) */}
                                        <div className="w-full flex justify-center -mb-[2px] relative z-30">
                                            <svg width="22" height="18" viewBox="0 0 22 18" className="overflow-visible block">
                                                <path d="M 17,9 A 6 6 0 0 0 5,9" fill="none" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" />
                                                <path d="M 17,9 A 6 6 0 0 0 5,9" fill="none" stroke="url(#priceSnakeBrassGrad)" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M 5,9 A 6 6 0 0 0 17,9" fill="none" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" />
                                                <path d="M 5,9 A 6 6 0 0 0 17,9" fill="none" stroke="url(#priceSnakeBrassGrad)" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="11" cy="15" r="2.2" fill="url(#priceSnakeBrassGrad)" stroke="#451A03" strokeWidth="0.8" />
                                                <circle cx="10.5" cy="14.3" r="0.7" fill="#FFFFFF" />
                                            </svg>
                                        </div>

                                        {/* 2. THE COMBINED TRIANGLE (UPPER) + SQUARE (LOWER) SHAPE WITH SHARED DIVIDER LINE */}
                                        <div 
                                            className={`w-full relative transition-all duration-300 ${
                                                isSelected 
                                                    ? 'scale-104 shadow-[0_20px_42px_rgba(229,26,34,0.28)] ring-4 ring-rose-500/30 rounded-b-3xl' 
                                                    : 'group-hover/box:scale-103 group-hover/box:shadow-[0_16px_34px_rgba(0,0,0,0.12)]'
                                            }`}
                                            style={{
                                                filter: isSelected ? 'drop-shadow(0 14px 28px rgba(229,26,34,0.22))' : 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))'
                                            }}
                                        >
                                            {/* Vector Background: Apex Triangle + Square Box + Shared Line (PURE WHITE, NO CLIPPING/IMAGE EFFECT) */}
                                            <svg 
                                                viewBox="0 0 204 262" 
                                                className="w-full h-[262px] block overflow-visible pointer-events-none"
                                            >
                                                {/* Unified Crisp White Card Background */}
                                                <path
                                                    d="M 102,3 
                                                       L 202,52 
                                                       L 202,246 
                                                       A 16 16 0 0 1 186,262 
                                                       L 18,262 
                                                       A 16 16 0 0 1 2,246 
                                                       L 2,52 
                                                       Z"
                                                    fill={isSelected ? '#FFF8F8' : '#FFFFFF'}
                                                    stroke={isSelected ? '#E51A22' : range.borderColor}
                                                    strokeWidth={isSelected ? '2.8' : '2.2'}
                                                    strokeLinejoin="round"
                                                />

                                                {/* ------------------------------------------------------------------- */}
                                                {/* ⭐️ THE SHARED LINE (Trikon ni Niche ni line & Square ni Upper ni line) */}
                                                {/* ------------------------------------------------------------------- */}
                                                <line
                                                    x1="2"
                                                    y1="52"
                                                    x2="202"
                                                    y2="52"
                                                    stroke={isSelected ? '#E51A22' : range.borderColor}
                                                    strokeWidth={isSelected ? '2.4' : '1.8'}
                                                    strokeDasharray="none"
                                                />

                                                {/* Top Apex Contact Rivet Bead touching the rope */}
                                                <circle 
                                                    cx="102" 
                                                    cy="3.5" 
                                                    r="5.5" 
                                                    fill="url(#priceSnakeBrassGrad)" 
                                                    stroke="#451A03" 
                                                    strokeWidth="1.2" 
                                                />
                                                <circle cx="100.5" cy="2.3" r="1.2" fill="#FFFFFF" />
                                            </svg>

                                            {/* HTML CONTENT LAYER - 100% DISPLAYED INSIDE THE COMBINED SHAPE */}
                                            <div className="absolute inset-0 flex flex-col pointer-events-auto">
                                                
                                                {/* A. CONTENT INSIDE THE UPPER TRIANGLE (Height: 52px) */}
                                                {/* FIT PROPERLY INSIDE TRIANGLE - BACKGROUND REMOVED, NO OVERFLOW */}
                                                <div className="w-full h-[52px] flex flex-col items-center justify-end pb-2 px-3 relative">
                                                    
                                                    {/* Clean Badge: Background removed, only 1 emoji + crisp text, 100% fits inside triangle */}
                                                    <div className="inline-flex items-center justify-center gap-1.5 px-2 py-0.5 max-w-[140px] truncate">
                                                        <span className="text-xs sm:text-[13px] leading-none select-none">{range.emoji}</span>
                                                        <span 
                                                            className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider leading-none"
                                                            style={{ color: isSelected ? '#E51A22' : range.borderColor }}
                                                        >
                                                            {range.badgeText}
                                                        </span>
                                                    </div>

                                                    {/* Selected Active Sparkle Ping on top right inside triangle */}
                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-3 w-5 h-5 rounded-full bg-[#E51A22] text-white flex items-center justify-center shadow-xs animate-bounce">
                                                            <Sparkles className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* B. CONTENT INSIDE THE SQUARE BOX (Height: 210px) */}
                                                <div className="w-full flex-1 flex flex-col items-center justify-between p-3.5 text-center">
                                                    
                                                    {/* Top Micro Label */}
                                                    <div>
                                                        <span className="inline-block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                                            {range.minPrice ? 'Gifts Above' : 'Budget Under'}
                                                        </span>
                                                        <h3 className={`text-[13px] sm:text-[14px] font-black uppercase tracking-tight leading-tight ${
                                                            isSelected ? 'text-[#E51A22]' : 'text-slate-900 group-hover/box:text-[#E51A22]'
                                                        } transition-colors`}>
                                                            {range.label}
                                                        </h3>
                                                    </div>

                                                    {/* Massive Bold 3D Price Amount in Fredoka Font */}
                                                    <div className="my-1">
                                                        <span 
                                                            className="text-3xl sm:text-[34px] font-black tracking-tight leading-none block drop-shadow-xs transition-transform duration-300 group-hover/box:scale-106"
                                                            style={{ 
                                                                fontFamily: "'Fredoka', cursive, sans-serif",
                                                                color: isSelected ? '#E51A22' : range.borderColor
                                                            }}
                                                        >
                                                            {range.amount}
                                                        </span>
                                                        <p className="text-[11px] font-bold text-slate-500 mt-1 line-clamp-1">
                                                            {range.sub}
                                                        </p>
                                                    </div>

                                                    {/* Interactive Action Pill Button (Inside the Square Box) */}
                                                    <div className="w-full pt-1">
                                                        <button
                                                            type="button"
                                                            className={`w-full py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-[#E51A22] text-white shadow-rose-500/30 shadow-md ring-2 ring-rose-400/40'
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-[#E51A22] hover:text-white border border-slate-200 hover:border-[#E51A22]'
                                                            }`}
                                                        >
                                                            {isSelected ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                                    Active Filter
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Select Range
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

            </div>

            {/* 4. PRODUCTS & FILTER CATALOG SECTION BELOW */}
            <ProductCatalogSection
                activeMinPrice={selectedRange?.minPrice ?? (minParam ? Number(minParam) : null)}
                activeMaxPrice={selectedRange?.maxPrice ?? (maxParam ? Number(maxParam) : null)}
                onSelectPriceRange={(min, max) => {
                    const match = priceRangeCards.find(r => r.minPrice === min && r.maxPrice === max);
                    setSelectedRange(match || null);
                }}
                catalogTitle={selectedRange ? `Toys ${selectedRange.label}` : 'All Toys by Price'}
                catalogSubtitle={selectedRange ? `Showing toys in the ${selectedRange.label} range (${selectedRange.sub})` : 'Browse all products or tap any budget card above to filter'}
            />

        </div>
    );
};

export default ShopByPrice;
