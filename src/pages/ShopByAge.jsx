import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCatalogSection from '../components/ProductCatalogSection';

const ageMilestonesData = [
    {
        id: 'infants',
        title: 'Infants',
        age: '0-12',
        label: 'Months',
        fullLabel: '0-12 Months',
        img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
        path: "M 50 5 A 16 16 0 0 1 72 12 A 16 16 0 0 1 90 32 A 16 16 0 0 1 95 56 A 16 16 0 0 1 83 78 A 16 16 0 0 1 61 93 A 16 16 0 0 1 39 93 A 16 16 0 0 1 17 78 A 16 16 0 0 1 5 56 A 16 16 0 0 1 10 32 A 16 16 0 0 1 28 12 A 16 16 0 0 1 50 5 Z",
        border: '#DFA32B',
        textPrimary: '#224B9C',
        textSecondary: '#6B87B6',
        icon: '✨',
        decoLeft: '💧',
        decoRight: '🧡',
        posLeft: 'top-1 -left-2 md:top-2 md:-left-4',
        posRight: 'bottom-4 -right-2 md:bottom-6 md:-right-4',
        matchAges: ['0-12', '0-6', '6-12', '0-2', 'infant', 'months']
    },
    {
        id: 'toddlers',
        title: 'Toddlers',
        age: '1-2',
        label: 'Years',
        fullLabel: '1-2 Years',
        img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
        path: "M 50 98 A 43 43 0 0 0 90 38 A 18 18 0 0 0 65 15 A 43 43 0 0 0 35 15 A 18 18 0 0 0 10 38 A 43 43 0 0 0 50 98 Z",
        border: '#C1888B',
        textPrimary: '#224B9C',
        textSecondary: '#6B87B6',
        icon: '🛁',
        decoLeft: '🧸',
        decoRight: '🧩',
        posLeft: 'bottom-8 -left-2 md:bottom-12 md:-left-4',
        posRight: '-top-1 -right-2 md:-top-2 md:-right-3',
        matchAges: ['1-2', '0-2', 'toddler', '1-3', '2-3']
    },
    {
        id: 'preschool',
        title: 'Preschool',
        age: '3-4',
        label: 'Years',
        fullLabel: '3-4 Years',
        img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80',
        path: "M 50 5 A 45 45 0 1 1 49.99 5 Z",
        border: '#90B4EB',
        textPrimary: '#224B9C',
        textSecondary: '#6B87B6',
        icon: '☁️',
        decoLeft: '☂️',
        decoRight: '🛡️',
        posLeft: '-top-2 -left-1 md:-top-3 md:-left-2',
        posRight: 'top-1/2 -right-2 md:top-1/2 md:-right-4 -translate-y-1/2',
        matchAges: ['3-4', '3-5', 'preschool', '4-5']
    },
    {
        id: 'little-kids',
        title: 'Little Kids',
        age: '5-7',
        label: 'Years',
        fullLabel: '5-7 Years',
        img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80',
        path: "M 50 5 C 85 5 95 15 95 50 C 95 85 85 95 50 95 C 15 95 5 85 5 50 C 5 15 15 5 50 5 Z",
        border: '#8F5A40',
        textPrimary: '#224B9C',
        textSecondary: '#6B87B6',
        icon: '🌙',
        decoLeft: '🌙',
        decoRight: '✨',
        posLeft: 'top-1/2 -left-2 md:top-1/2 md:-left-4 -translate-y-1/2',
        posRight: 'bottom-1 -right-2 md:bottom-1 md:-right-3',
        matchAges: ['5-7', '6-8', '3-5', '5-6', 'little kids']
    },
    {
        id: 'big-kids',
        title: 'Big Kids',
        age: '8+',
        label: 'Years',
        fullLabel: '8+ Years',
        img: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=600&q=80',
        path: "M 5 50 A 45 45 0 0 1 95 50 L 95 85 Q 95 98 80 98 L 20 98 Q 5 98 5 85 Z",
        border: '#86EFAC',
        textPrimary: '#224B9C',
        textSecondary: '#6B87B6',
        icon: '🌿',
        decoLeft: '☀️',
        decoRight: '🐞',
        posLeft: '-top-2 left-4 md:-top-3 md:left-6',
        posRight: '-top-1 right-0 md:-top-2 md:right-0',
        matchAges: ['8+', '6-8', '8-12', '9-12', '12+', 'big kids']
    }
];

const ShopByAge = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ageParam = searchParams.get('age') || '';

    // Find milestone matching URL param or default null
    const [selectedMilestone, setSelectedMilestone] = useState(() => {
        if (!ageParam) return null;
        const paramLower = ageParam.toLowerCase();
        return ageMilestonesData.find(m => 
            m.fullLabel.toLowerCase() === paramLower ||
            m.title.toLowerCase() === paramLower ||
            m.id === paramLower ||
            m.matchAges.some(a => paramLower.includes(a.toLowerCase()))
        ) || null;
    });

    // Sync state with URL params
    useEffect(() => {
        if (ageParam) {
            const paramLower = ageParam.toLowerCase();
            const found = ageMilestonesData.find(m => 
                m.fullLabel.toLowerCase() === paramLower ||
                m.title.toLowerCase() === paramLower ||
                m.id === paramLower ||
                m.matchAges.some(a => paramLower.includes(a.toLowerCase()))
            );
            setSelectedMilestone(found || null);
        } else {
            setSelectedMilestone(null);
        }
    }, [ageParam]);

    const handleMilestoneClick = (item) => {
        if (selectedMilestone?.id === item.id) {
            // Deselect and show all
            setSelectedMilestone(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('age');
            setSearchParams(newParams);
        } else {
            setSelectedMilestone(item);
            const newParams = new URLSearchParams(searchParams);
            newParams.set('age', `${item.age} ${item.label}`);
            setSearchParams(newParams);
        }

        // Smooth scroll to products catalog
        setTimeout(() => {
            const target = document.getElementById('catalog-products-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleClearMilestone = () => {
        setSelectedMilestone(null);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('age');
        setSearchParams(newParams);
    };

    return (
        <div className="w-full min-h-screen bg-[#FFFDF9] font-sans">
            
            {/* Global SVG Definitions for organic shapes */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    {ageMilestonesData.map((item, idx) => (
                        <clipPath key={`shop-age-clip-${idx}`} id={`shop-age-clip-${idx}`} clipPathUnits="objectBoundingBox">
                            <path d={item.path} transform="scale(0.01)" />
                        </clipPath>
                    ))}
                </defs>
            </svg>

            {/* Animation styles for the floating decorative mini-icons */}
            <style>{`
                @keyframes ageDecoBounceLeft {
                    0%, 100% { transform: translateY(0px) rotate(-10deg) scale(1); }
                    50% { transform: translateY(-6px) rotate(-14deg) scale(1.12); }
                }
                @keyframes ageDecoBounceRight {
                    0%, 100% { transform: translateY(0px) rotate(10deg) scale(1); }
                    50% { transform: translateY(-6px) rotate(14deg) scale(1.12); }
                }
                .group\\/ageCard:hover .shop-age-deco-left {
                    animation: ageDecoBounceLeft 1.2s ease-in-out infinite;
                }
                .group\\/ageCard:hover .shop-age-deco-right {
                    animation: ageDecoBounceRight 1.2s ease-in-out infinite 0.2s;
                }
            `}</style>

            {/* 1. COMPACT STYLISH HEADER BANNER STRIP ("patto") - THEME-BLENDED LIGHT CORAL PEACH */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#FFF1F2] via-[#FFE4E6] to-[#FEF3C7] text-slate-800 pt-5 sm:pt-6 pb-9 sm:pb-10">
                {/* Decorative background playful patterns & soft pastel glow */}
                <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#E11D48_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-rose-300/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                    <div>
                        {/* Left-Aligned Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 flex-wrap">
                            <Link to="/" className="text-slate-600 hover:text-[#E51A22] transition-colors underline-offset-2 hover:underline">Home</Link>
                            <span className="opacity-40">/</span>
                            <span className="text-[#9F1239] font-extrabold">Shop By Age</span>
                        </div>

                        {/* Bold Left-Aligned Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight leading-tight mb-1">
                            Shop By Age
                        </h1>

                        {/* Left-Aligned Tagline */}
                        <p className="text-slate-600 text-xs sm:text-[13.5px] max-w-xl font-medium leading-relaxed">
                            Find the perfect educational and developmental toys tailored specifically to your child's age group.
                        </p>
                    </div>

                    {/* Right-Side Milestone Badge */}
                    <div className="hidden sm:flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-200/80 shadow-xs shrink-0 self-start md:self-center">
                        <span className="text-2xl">🌱</span>
                        <div>
                            <span className="block text-[10.5px] font-black uppercase tracking-wider text-rose-600">Milestone Guide</span>
                            <span className="block text-xs text-slate-900 font-black">5 Growth Stages</span>
                        </div>
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
                            fill="#FFFBF5" 
                        />
                        {/* Nag aakar accent stroke */}
                        <path 
                            d="M0,25 C150,60 300,-10 450,25 C600,60 750,-10 900,25 C1050,60 1150,-5 1200,22" 
                            fill="none" 
                            stroke="#FDA4AF" 
                            strokeWidth="2.5"
                            strokeLinecap="round" 
                        />
                    </svg>
                </div>
            </div>

            {/* 2. THE 5 MILESTONE CARDS (Exact match to provided user image) */}
            <div className="w-full bg-[#FFFBF5] pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 border-b border-amber-200/60 relative">
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                    
                    {/* Milestone selection prompt */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 sm:mb-10 text-center sm:text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24]">
                                Select a Child Age Stage
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Click any age milestone to instantly see toys curated for that stage
                            </p>
                        </div>

                        {/* All Ages Pill Button */}
                        <button
                            type="button"
                            onClick={handleClearMilestone}
                            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                                !selectedMilestone 
                                    ? 'bg-[#E51A22] text-white shadow-md scale-105' 
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22]'
                            }`}
                        >
                            All Age Groups (Show All)
                        </button>
                    </div>

                    {/* 5 Milestone Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-7 lg:gap-8 justify-items-center">
                        {ageMilestonesData.map((item, idx) => {
                            const isSelected = selectedMilestone?.id === item.id;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleMilestoneClick(item)}
                                    className={`group/ageCard flex flex-col items-center justify-start w-full cursor-pointer select-none transition-all duration-300 ${
                                        isSelected ? 'scale-105 -translate-y-2' : 'hover:-translate-y-1.5'
                                    }`}
                                    title={`Click to view toys for ${item.title} (${item.age} ${item.label})`}
                                >
                                    {/* Organic Shape Container */}
                                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 mb-4 flex items-center justify-center">
                                        
                                        {/* 1st Small Icon (decoLeft) */}
                                        {item.decoLeft && (
                                            <div className={`absolute ${item.posLeft} pointer-events-none transition-transform duration-500 z-30`}>
                                                <div
                                                    className="shop-age-deco-left bg-white/95 backdrop-blur-md rounded-2xl w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-md border"
                                                    style={{ borderColor: `${item.border}50` }}
                                                >
                                                    <span className="text-[17px] lg:text-[19px] select-none leading-none">{item.decoLeft}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2nd Small Icon (decoRight) */}
                                        {item.decoRight && (
                                            <div className={`absolute ${item.posRight} pointer-events-none transition-transform duration-500 z-30`}>
                                                <div
                                                    className="shop-age-deco-right bg-white/95 backdrop-blur-md rounded-2xl w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-md border"
                                                    style={{ borderColor: `${item.border}50` }}
                                                >
                                                    <span className="text-[17px] lg:text-[19px] select-none leading-none">{item.decoRight}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Active Selection Glow Ring */}
                                        {isSelected && (
                                            <div 
                                                className="absolute -inset-2.5 rounded-full blur-md opacity-80 animate-pulse pointer-events-none" 
                                                style={{ backgroundColor: `${item.border}80` }}
                                            />
                                        )}

                                        {/* Inner Shape with border and clipPath */}
                                        <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover/ageCard:scale-105">
                                            {/* Border Outline SVG */}
                                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-md">
                                                <path
                                                    d={item.path}
                                                    fill="none"
                                                    stroke={isSelected ? '#E51A22' : item.border}
                                                    strokeWidth={isSelected ? "4.5" : "3.2"}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                            {/* Masked Image */}
                                            <div
                                                className="absolute inset-0 w-full h-full bg-white z-10"
                                                style={{ clipPath: `url(#shop-age-clip-${idx})` }}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    draggable="false"
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/ageCard:scale-110 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Details */}
                                    <h3
                                        className={`font-black text-[17px] sm:text-[18px] lg:text-[20px] mb-1.5 flex items-center justify-center gap-2 text-center transition-colors leading-normal ${
                                            isSelected ? 'text-[#E51A22]' : 'group-hover/ageCard:text-[#E51A22]'
                                        }`}
                                        style={{ color: isSelected ? '#E51A22' : item.textPrimary }}
                                    >
                                        <span className="text-[18px] lg:text-[20px] inline-block shrink-0">{item.icon}</span>
                                        <span>{item.title}</span>
                                    </h3>

                                    {/* Age Pill */}
                                    <p
                                        className={`text-[12px] lg:text-[13px] font-bold tracking-wide px-3.5 py-1 rounded-full shadow-2xs whitespace-nowrap transition-all ${
                                            isSelected
                                                ? 'bg-[#E51A22] text-white shadow-md scale-105'
                                                : 'text-amber-900 bg-amber-100/90 group-hover/ageCard:bg-amber-200'
                                        }`}
                                    >
                                        {item.age} {item.label}
                                    </p>

                                    {/* Active Filter Checkmark */}
                                    {isSelected && (
                                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#E51A22] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                            ✓ Active Filter
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* 3. PRODUCTS & FILTER SECTION BELOW */}
            <ProductCatalogSection
                activeMilestone={selectedMilestone}
                onSelectMilestone={setSelectedMilestone}
                catalogTitle={selectedMilestone ? `${selectedMilestone.title} Toys (${selectedMilestone.age} ${selectedMilestone.label})` : 'All Age Toys & Products'}
                catalogSubtitle={selectedMilestone ? `Showing all educational and fun toys specifically designed for ${selectedMilestone.title.toLowerCase()} aged ${selectedMilestone.age} ${selectedMilestone.label.toLowerCase()}` : 'Browse our entire developmental toys catalog or choose an age stage above'}
            />

        </div>
    );
};

export default ShopByAge;
