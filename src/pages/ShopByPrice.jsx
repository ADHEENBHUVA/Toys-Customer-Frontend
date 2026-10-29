import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCatalogSection from '../components/ProductCatalogSection';

// ==========================================
// MODERN SOFT 3D TOY PODS (TACTILE PASTEL CAPSULES)
// ==========================================
const priceRangeCards = [
    {
        id: 'under-299',
        label: 'Under ₹299',
        sub: 'Pocket Treats',
        badge: '★ Pocket Fun',
        amount: '₹299',
        minPrice: null,
        maxPrice: 299,
        bgGradient: 'from-[#F0F9FF] to-[#E0F2FE]',
        borderColor: 'border-sky-200/80',
        badgeClass: 'bg-sky-100/90 text-sky-800',
        textColor: 'text-sky-950',
        activeGlow: 'shadow-[0_16px_32px_-4px_rgba(2,132,199,0.28)] border-sky-500 ring-4 ring-sky-500/15',
        activeBtnBg: 'bg-sky-600 text-white'
    },
    {
        id: 'under-499',
        label: 'Under ₹499',
        sub: 'Sweet Value',
        badge: '♥ Sweet Value',
        amount: '₹499',
        minPrice: null,
        maxPrice: 499,
        bgGradient: 'from-[#ECFDF5] to-[#D1FAE5]',
        borderColor: 'border-emerald-200/80',
        badgeClass: 'bg-emerald-100/90 text-emerald-800',
        textColor: 'text-emerald-950',
        activeGlow: 'shadow-[0_16px_32px_-4px_rgba(5,150,105,0.28)] border-emerald-500 ring-4 ring-emerald-500/15',
        activeBtnBg: 'bg-emerald-600 text-white'
    },
    {
        id: 'under-699',
        label: 'Under ₹699',
        sub: 'Most Popular',
        badge: '🔥 Popular',
        amount: '₹699',
        minPrice: null,
        maxPrice: 699,
        bgGradient: 'from-[#FFFBEB] to-[#FEF3C7]',
        borderColor: 'border-amber-200/80',
        badgeClass: 'bg-amber-100/90 text-amber-800',
        textColor: 'text-amber-950',
        activeGlow: 'shadow-[0_16px_32px_-4px_rgba(217,119,6,0.28)] border-amber-500 ring-4 ring-amber-500/15',
        activeBtnBg: 'bg-amber-600 text-white'
    },
    {
        id: 'under-999',
        label: 'Under ₹999',
        sub: 'Action & Tech',
        badge: '⚡ Action Pick',
        amount: '₹999',
        minPrice: null,
        maxPrice: 999,
        bgGradient: 'from-[#F5F3FF] to-[#EDE9FE]',
        borderColor: 'border-purple-200/80',
        badgeClass: 'bg-purple-100/90 text-purple-800',
        textColor: 'text-purple-950',
        activeGlow: 'shadow-[0_16px_32px_-4px_rgba(124,58,237,0.28)] border-purple-500 ring-4 ring-purple-500/15',
        activeBtnBg: 'bg-purple-600 text-white'
    },
    {
        id: 'above-999',
        label: 'Above ₹1,000',
        sub: 'Deluxe Gifts',
        badge: '👑 Deluxe',
        amount: '₹1,000+',
        minPrice: 1000,
        maxPrice: null,
        bgGradient: 'from-[#FFF1F2] to-[#FFE4E6]',
        borderColor: 'border-rose-200/80',
        badgeClass: 'bg-rose-100/90 text-rose-800',
        textColor: 'text-rose-950',
        activeGlow: 'shadow-[0_16px_32px_-4px_rgba(229,26,34,0.28)] border-rose-500 ring-4 ring-rose-500/15',
        activeBtnBg: 'bg-[#E51A22] text-white'
    }
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
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            
            {/* 1. COMPACT STYLISH HEADER BANNER STRIP - WARM GOLDEN VALUE THEME */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FED7AA] text-slate-800 pt-5 sm:pt-6 pb-9 sm:pb-10">
                {/* Decorative background playful patterns & soft pastel glow */}
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

                {/* Nag Aakar (Snake Wave) Line & Curve at the bottom of the banner */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
                    <svg 
                        viewBox="0 0 1200 60" 
                        preserveAspectRatio="none" 
                        className="w-full h-5 sm:h-7 md:h-8 block"
                    >
                        {/* Fill to section background */}
                        <path 
                            d="M0,25 C150,60 300,-10 450,25 C600,60 750,-10 900,25 C1050,60 1150,-5 1200,22 L1200,60 L0,60 Z" 
                            fill="#FFFDF9" 
                            opacity="1"
                        />
                        {/* Refined medium-thin continuous solid wave line */}
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

            {/* 2. MODERN SOFT 3D TOY PODS SECTION */}
            <div className="w-full bg-[#FFFDF9] py-8 sm:py-10 border-b border-slate-200/60 overflow-hidden">
                <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
                    
                    {/* Header with Title and Clear Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 text-center sm:text-left">
                        <div className="flex items-center gap-2.5">
                            <span className="text-2xl">🧸</span>
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-[#1A1A24] tracking-tight flex items-center justify-center sm:justify-start gap-2">
                                    <span>Curated Budget Pods</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                                        Quick Filter
                                    </span>
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Select any budget pod to explore handpicked toys in that range
                                </p>
                            </div>
                        </div>

                        {selectedRange ? (
                            <button
                                type="button"
                                onClick={handleClearRange}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E51A22] bg-red-50 hover:bg-red-100/80 px-4 py-1.5 rounded-full transition-colors cursor-pointer border border-red-200 shadow-xs"
                            >
                                <span>✕</span> Clear Filter: {selectedRange.label}
                            </button>
                        ) : (
                            <div className="text-xs font-bold text-slate-400 hidden sm:block">
                                Tap any pod to filter instantly
                            </div>
                        )}
                    </div>

                    {/* 5 Modern Soft Pods */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
                        {priceRangeCards.map((range, index) => {
                            const isSelected = selectedRange?.id === range.id;
                            const isLastOnMobile = index === priceRangeCards.length - 1;

                            return (
                                <div
                                    key={range.id}
                                    onClick={() => handleRangeClick(range)}
                                    className={`group cursor-pointer select-none rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 border-2 bg-gradient-to-b ${range.bgGradient} ${
                                        isLastOnMobile ? 'col-span-2 sm:col-span-1 max-w-[200px] sm:max-w-none w-full mx-auto' : ''
                                    } ${
                                        isSelected 
                                            ? `${range.activeGlow} -translate-y-2` 
                                            : `${range.borderColor} hover:-translate-y-1.5 hover:shadow-lg shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]`
                                    }`}
                                >
                                    {/* Top Micro-Pill Tag */}
                                    <span className={`text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-2 ${range.badgeClass}`}>
                                        {range.badge}
                                    </span>

                                    {/* Big Bold Price Amount */}
                                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight my-1">
                                        {range.amount}
                                    </span>

                                    {/* Range Label & Subtitle */}
                                    <span className={`text-xs font-bold ${range.textColor} mb-3.5`}>
                                        {range.label}
                                    </span>

                                    {/* Action Button / Pill */}
                                    <div className={`w-full py-1.5 rounded-xl text-[11px] font-extrabold tracking-wide uppercase transition-all duration-200 ${
                                        isSelected
                                            ? `${range.activeBtnBg} shadow-xs`
                                            : 'bg-white/90 text-slate-700 border border-slate-200/80 group-hover:bg-white group-hover:text-black shadow-xs'
                                    }`}>
                                        {isSelected ? '✓ Active' : 'Select'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* 3. PRODUCTS & FILTER SECTION BELOW */}
            <ProductCatalogSection
                activeMinPrice={selectedRange?.minPrice ?? (minParam ? Number(minParam) : null)}
                activeMaxPrice={selectedRange?.maxPrice ?? (maxParam ? Number(maxParam) : null)}
                onSelectPriceRange={(min, max) => {
                    const match = priceRangeCards.find(r => r.minPrice === min && r.maxPrice === max);
                    setSelectedRange(match || null);
                }}
                catalogTitle={selectedRange ? `Toys ${selectedRange.label}` : 'All Toys by Price'}
                catalogSubtitle={selectedRange ? `Showing toys in the ${selectedRange.label} range (${selectedRange.sub})` : 'Browse all products or tap any budget pod above to filter'}
            />

        </div>
    );
};

export default ShopByPrice;
