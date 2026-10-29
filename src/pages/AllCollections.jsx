import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCatalogSection from '../components/ProductCatalogSection';

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

            {/* 2. COLLECTION CARDS SECTION WITH ACTIVE SELECTION */}
            <div className="w-full bg-[#FFFBF7] pt-8 sm:pt-10 pb-8 sm:pb-10 border-b border-pink-200/60">
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                    
                    {/* Header with All Collections Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24]">
                                Select a Collection
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Click any collection card to instantly view its exclusive items below
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClearCollection}
                            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                                !selectedCollection
                                    ? 'bg-[#E51A22] text-white shadow-md scale-105'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E51A22] hover:text-[#E51A22]'
                            }`}
                        >
                            All Collections (Show All)
                        </button>
                    </div>

                    {/* Collections Cards Grid */}
                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <div className="w-10 h-10 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-bold">No active collections found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                            {collections.map((col) => {
                                const isSelected = selectedCollection === col._id;

                                return (
                                    <div
                                        key={col._id}
                                        onClick={() => handleCollectionClick(col)}
                                        className={`group relative h-48 sm:h-56 md:h-60 rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-300 border-3 ${
                                            isSelected
                                                ? 'border-[#E51A22] shadow-[0_16px_36px_rgba(229,26,34,0.3)] scale-105'
                                                : 'border-white/80 hover:border-[#E51A22]/50 shadow-md hover:shadow-xl hover:-translate-y-1.5'
                                        }`}
                                    >
                                        {/* Background Image */}
                                        <img
                                            src={getImageUrl(col.image)}
                                            alt={col.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                                        {/* Active Selected Badge */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 bg-[#E51A22] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-20">
                                                <span>✓ Selected</span>
                                            </div>
                                        )}

                                        {/* Floating Icon */}
                                        <div className="absolute top-3 left-3 w-9 h-9 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-white/50 flex items-center justify-center text-lg z-20 transition-transform group-hover:scale-115">
                                            {col.icon || '✨'}
                                        </div>

                                        {/* Content details at bottom */}
                                        <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full z-20">
                                            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1 group-hover:text-amber-200 transition-colors drop-shadow-sm">
                                                {col.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full">
                                                    {col.productCount > 0 ? `${col.productCount} Products` : 'Explore Collection'}
                                                </span>
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
