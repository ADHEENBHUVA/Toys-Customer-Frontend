import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Search, Heart, ShoppingBag, Menu, X,
    User, Smile, Package, LogOut, Sparkles, Tag,
    ArrowRight, Star, Flame, ChevronDown, MessageCircle, Truck,
    ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount, openCart, getCartTotal } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const deferredQuery = useDeferredValue(searchQuery);
    const [searchCategoryFilter, setSearchCategoryFilter] = useState('ALL');
    const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

    const searchContainerRef = useRef(null);
    const mobileSearchContainerRef = useRef(null);
    const categoryPickerRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const ageMilestones = [
        { label: '0-12 Months', sub: 'Infants', icon: '✨' },
        { label: '1-2 Years', sub: 'Toddlers', icon: '🛁' },
        { label: '3-4 Years', sub: 'Preschool', icon: '☁️' },
        { label: '5-7 Years', sub: 'Little Kids', icon: '🌙' },
        { label: '8+ Years', sub: 'Big Kids', icon: '🌿' }
    ];

    const priceRanges = [
        { label: 'Under ₹299', query: 'maxPrice=299', icon: '🪙' },
        { label: 'Under ₹499', query: 'maxPrice=499', icon: '🎁' },
        { label: 'Under ₹699', query: 'maxPrice=699', icon: '⭐' },
        { label: 'Under ₹999', query: 'maxPrice=999', icon: '🎯' },
        { label: 'Above ₹999', query: 'minPrice=1000', icon: '👑' }
    ];

    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchNavData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const [catRes, colRes, prodRes] = await Promise.all([
                    fetch(`${apiUrl}/categories`).then(r => r.json()).catch(() => ({ success: false })),
                    fetch(`${apiUrl}/collections`).then(r => r.json()).catch(() => ({ success: false })),
                    fetch(`${apiUrl}/products`).then(r => r.json()).catch(() => [])
                ]);
                if (!isMounted) return;
                if (catRes && catRes.success && Array.isArray(catRes.data)) setCategories(catRes.data);
                if (colRes && colRes.success && Array.isArray(colRes.data)) setCollections(colRes.data);
                if (Array.isArray(prodRes)) {
                    setAllProducts(prodRes);
                } else if (prodRes && Array.isArray(prodRes.products)) {
                    setAllProducts(prodRes.products);
                } else if (prodRes && Array.isArray(prodRes.data)) {
                    setAllProducts(prodRes.data);
                }
            } catch (error) {
                console.error("Error fetching nav data:", error);
            }
        };
        fetchNavData();
        return () => { isMounted = false; };
    }, []);

    // Close search & dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchFocused(false);
            }
            if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target)) {
                setIsMobileSearchFocused(false);
            }
            if (categoryPickerRef.current && !categoryPickerRef.current.contains(e.target)) {
                setIsCategoryPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside, { passive: true });
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close search & mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
        setIsCategoryPickerOpen(false);
    }, [location.pathname, location.search]);

    // PRECISE ACTIVE TAB DETECTION: Exactly ONE tab is active at any time
    const activeTab = useMemo(() => {
        const { pathname, search } = location;
        const searchLower = search.toLowerCase();

        if (pathname === '/products') {
            if (search.includes('gender=Boys')) return 'boys';
            if (search.includes('gender=Girls')) return 'girls';
            if (search.includes('filter=best-sellers')) return 'best-sellers';
            if (search.includes('category=') || search.includes('cat=')) return 'categories';
            if (search.includes('collection=')) return 'collections';
            if (searchLower.includes('price=') || searchLower.includes('maxprice=') || searchLower.includes('minprice=')) return 'price';
            if (search.includes('age=')) return 'age';
        }

        if (pathname === '/shop-by-age') return 'age';
        if (pathname === '/categories') return 'categories';
        if (pathname === '/collections') return 'collections';
        if (pathname === '/shop-by-price') return 'price';
        if (pathname === '/track-order') return 'track-order';

        if (pathname === '/') return 'home';

        return null;
    }, [location.pathname, location.search]);

    // Active pill styling: ONLY the currently open tab is RED with white text
    const getNavButtonClass = (tabKey) => {
        const isActive = activeTab === tabKey;
        if (isActive) {
            return 'bg-[#E51A22] text-white font-black shadow-sm ring-1 ring-[#E51A22]';
        }
        return 'text-slate-700 hover:text-[#E51A22] hover:bg-rose-50/80 font-bold';
    };

    // Helper to get image URL
    const getProductImage = (product) => {
        const img = (product?.images && product.images[0]) || product?.image;
        if (!img) return 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=200&q=80';
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/gallery')) return img;
        const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
        return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    // Helper to highlight matching text in search results
    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        const parts = String(text).split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-rose-100 text-[#E51A22] font-black rounded-sm px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    // Category styling & icons
    const getCategoryBadgeStyle = (catName) => {
        const lower = (catName || '').toLowerCase();
        if (lower.includes('board')) return { bg: 'bg-amber-50 text-amber-900 border-amber-200/90', icon: '🎲' };
        if (lower.includes('soft') || lower.includes('doll') || lower.includes('plush')) return { bg: 'bg-pink-50 text-pink-800 border-pink-200/90', icon: '🧸' };
        if (lower.includes('music')) return { bg: 'bg-purple-50 text-purple-800 border-purple-200/90', icon: '🎵' };
        if (lower.includes('edu') || lower.includes('learn') || lower.includes('stem')) return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90', icon: '🧠' };
        if (lower.includes('art') || lower.includes('craft')) return { bg: 'bg-orange-50 text-orange-800 border-orange-200/90', icon: '🎨' };
        if (lower.includes('car') || lower.includes('vehicle') || lower.includes('rc') || lower.includes('track')) return { bg: 'bg-sky-50 text-sky-800 border-sky-200/90', icon: '🏎️' };
        if (lower.includes('build') || lower.includes('block') || lower.includes('lego')) return { bg: 'bg-yellow-50 text-yellow-900 border-yellow-200/90', icon: '🧱' };
        if (lower.includes('action') || lower.includes('figure') || lower.includes('hero')) return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/90', icon: '🦸' };
        if (lower.includes('outdoor') || lower.includes('sport') || lower.includes('ride')) return { bg: 'bg-teal-50 text-teal-800 border-teal-200/90', icon: '⚽' };
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200/90', icon: '✨' };
    };

    // High performance search filter using deferredQuery to prevent UI freeze
    const searchResults = useMemo(() => {
        const query = deferredQuery.trim().toLowerCase();
        if (!query) return { matchingCategories: [], matchingProducts: [], relatedCategories: [] };

        const stem = (word) => {
            if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
            if (word.endsWith('es') && !word.endsWith('ses')) return word.slice(0, -2);
            if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
            return word;
        };

        const synonyms = {
            cars: ['car', 'vehicle', 'rc', 'track', 'train'],
            car: ['car', 'vehicle', 'rc', 'track', 'train'],
            vehicles: ['vehicle', 'car', 'rc'],
            lego: ['block', 'building', 'stem'],
            legos: ['block', 'building', 'stem'],
            blocks: ['block', 'building', 'lego'],
            teddy: ['teddy', 'plush', 'soft', 'bear'],
            teddies: ['teddy', 'plush', 'soft', 'bear'],
            plushies: ['plush', 'soft', 'teddy'],
            games: ['game', 'board'],
            dolls: ['doll', 'accessories', 'pretend'],
            toys: ['toy', 'deluxe', 'game', 'play'],
            science: ['science', 'educational', 'kit', 'stem']
        };

        const tokens = query.split(/[\s,+-]+/).filter(Boolean);

        const matchingCategories = categories.filter(c => {
            const catName = (c.name || '').toLowerCase();
            if (catName.includes(query)) return true;
            return tokens.some(t => {
                const stemmed = stem(t);
                const synList = synonyms[t] || synonyms[stemmed] || [];
                return catName.includes(t) || catName.includes(stemmed) || synList.some(s => catName.includes(s));
            });
        }).slice(0, 5);

        let matchingProducts = allProducts.filter(p => {
            const pName = (p.name || '').toLowerCase();
            const pCat = (typeof p.category === 'object' ? p.category?.name : p.category || '').toLowerCase();
            const pSubCat = (p.subCategory?.name || '').toLowerCase();
            const pBrand = (typeof p.brand === 'object' ? p.brand?.name : p.brand || '').toLowerCase();
            const pDesc = (p.description || '').toLowerCase();
            const combined = [pName, pCat, pSubCat, pBrand, pDesc].join(' ');

            if (combined.includes(query)) return true;

            const allTokensMatch = tokens.every(t => {
                if (combined.includes(t)) return true;
                const stemmed = stem(t);
                if (stemmed.length >= 3 && combined.includes(stemmed)) return true;
                const synList = synonyms[t] || synonyms[stemmed] || [];
                return synList.some(s => combined.includes(s));
            });
            if (allTokensMatch) return true;

            if (tokens.length > 1) {
                return tokens.some(t => {
                    if (t.length > 2 && combined.includes(t)) return true;
                    const stemmed = stem(t);
                    if (stemmed.length >= 3 && combined.includes(stemmed)) return true;
                    const synList = synonyms[t] || synonyms[stemmed] || [];
                    return synList.some(s => combined.includes(s));
                });
            }

            return false;
        });

        if (searchCategoryFilter !== 'ALL') {
            matchingProducts = matchingProducts.filter(p => {
                const cat = typeof p.category === 'object' ? (p.category?.name || '') : (p.category || '');
                return cat.toLowerCase() === searchCategoryFilter.toLowerCase();
            });
        }

        matchingProducts = matchingProducts.slice(0, 8);

        const catMap = {};
        matchingProducts.forEach(p => {
            const cat = typeof p.category === 'object' ? (p.category?.name || '') : (p.category || '');
            if (cat) catMap[cat] = (catMap[cat] || 0) + 1;
        });
        const relatedCategories = Object.entries(catMap).map(([name, count]) => ({ name, count }));

        return { matchingCategories, matchingProducts, relatedCategories };
    }, [deferredQuery, searchCategoryFilter, categories, allProducts]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();
        let targetUrl = '/products';
        const params = new URLSearchParams();
        if (trimmed) params.set('search', trimmed);
        if (searchCategoryFilter !== 'ALL') params.set('category', searchCategoryFilter);

        const qs = params.toString();
        if (qs) targetUrl += `?${qs}`;

        navigate(targetUrl);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
    };

    const handleSelectProduct = (productId) => {
        navigate(`/product/${productId}`);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
        setSearchQuery('');
    };

    const handleSelectCategory = (categoryName) => {
        navigate(`/categories?category=${encodeURIComponent(categoryName)}`);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
        setSearchQuery('');
    };

    // Reusable search dropdown panel (GPU accelerated, pure CSS transitions)
    const renderSearchDropdown = () => {
        const query = searchQuery.trim();
        if (!query) return null;

        const { matchingCategories, matchingProducts, relatedCategories } = searchResults;
        const hasResults = matchingCategories.length > 0 || matchingProducts.length > 0;

        return (
            <div
                onWheel={(e) => e.stopPropagation()}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-800 max-h-[min(530px,82vh)] flex flex-col overscroll-contain transition-all duration-150 transform-gpu"
            >
                {/* 1. Header Status Strip */}
                <div className="px-4 py-3 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#E51A22] text-white flex items-center justify-center text-xs shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                        </span>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 leading-none">
                                Instant Results for <span className="text-[#E51A22]">"{query}"</span>
                            </h4>
                            <p className="text-[10.5px] font-bold text-slate-400 mt-0.5 leading-none">
                                Live Search Preview
                            </p>
                        </div>
                    </div>
                    {matchingProducts.length > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-white text-[#E51A22] border border-rose-200 text-[11px] font-black shadow-2xs">
                            🎯 {matchingProducts.length} Found
                        </span>
                    )}
                </div>

                {/* 2. Interactive Category Filter Chips */}
                {relatedCategories.length > 1 && (
                    <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#E51A22]" /> Filter:
                        </span>
                        <button
                            type="button"
                            onClick={() => setSearchCategoryFilter('ALL')}
                            className={`px-2.5 py-1 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${searchCategoryFilter === 'ALL'
                                    ? 'bg-[#E51A22] text-white shadow-xs scale-102'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            All ({matchingProducts.length})
                        </button>
                        {relatedCategories.map(({ name, count }) => {
                            const badge = getCategoryBadgeStyle(name);
                            const isSelected = searchCategoryFilter.toLowerCase() === name.toLowerCase();
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setSearchCategoryFilter(isSelected ? 'ALL' : name)}
                                    className={`px-2.5 py-1 rounded-full text-xs font-black transition-all shrink-0 flex items-center gap-1 cursor-pointer border ${isSelected
                                            ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-xs scale-102'
                                            : `${badge.bg}`
                                        }`}
                                >
                                    <span>{badge.icon}</span>
                                    <span>{name}</span>
                                    <span className="opacity-70 text-[10px]">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 3. Scrollable Results List */}
                <div className="overflow-y-auto max-h-[380px] p-2 divide-y divide-slate-100 search-dropdown-scrollable overscroll-contain">
                    {!hasResults ? (
                        <div className="py-8 px-4 text-center">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-[#E51A22] flex items-center justify-center mb-2.5 text-xl shadow-xs">
                                🧸
                            </div>
                            <p className="text-sm font-black text-slate-800">No toys matched "{query}"</p>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                                Try searching for <span className="font-bold text-[#E51A22]">Car, Doll, Lego, Board Game</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            {matchingCategories.length > 0 && (
                                <div className="py-2 px-2">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                                        Suggested Categories
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {matchingCategories.map(cat => {
                                            const badge = getCategoryBadgeStyle(cat.name);
                                            return (
                                                <button
                                                    key={cat._id || cat.name}
                                                    type="button"
                                                    onClick={() => handleSelectCategory(cat.name)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border hover:scale-103 ${badge.bg}`}
                                                >
                                                    <span>{badge.icon}</span>
                                                    <span>{cat.name}</span>
                                                    <ArrowRight className="w-3 h-3 opacity-60" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {matchingProducts.map(product => {
                                const catName = typeof product.category === 'object' ? (product.category?.name || '') : (product.category || '');
                                const badge = getCategoryBadgeStyle(catName);
                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => handleSelectProduct(product._id)}
                                        className="p-2 sm:p-2.5 hover:bg-rose-50/60 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group relative select-none"
                                    >
                                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-[13px] sm:text-[13.5px] font-extrabold text-slate-800 group-hover:text-[#E51A22] transition-colors truncate leading-snug">
                                                {highlightMatch(product.name, query)}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                {catName && (
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                                                        <span>{badge.icon}</span>
                                                        <span className="uppercase tracking-wider">{catName}</span>
                                                    </span>
                                                )}
                                                <span className="text-xs font-black text-[#E51A22]">
                                                    ₹{product.price}
                                                </span>
                                                <span className="text-[10.5px] font-bold text-amber-500 flex items-center gap-0.5">
                                                    ★ 4.9
                                                </span>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-[#E51A22] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-[#E51A22] text-xs font-black transition-all flex items-center gap-1 shadow-2xs">
                                                View Toy <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* 4. Footer See All CTA Button */}
                {query && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 shrink-0">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="w-full py-2.5 px-4 bg-[#E51A22] hover:bg-[#c91219] text-white font-black text-xs sm:text-[13px] rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                        >
                            <span>Explore All Results for "{query}"</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* DOCKED STICKY HEADER - GPU ACCELERATED LAYER (ZERO LAG) */}
            <header className="w-full sticky top-0 z-50 shadow-md transform-gpu will-change-transform">

                {/* 1. HERO BRAND & SEARCH ROW (ICONIC LITTLE JOYS RUBY RED) */}
                <div className="w-full bg-[#E51A22] border-b border-rose-500/30">
                    <div className="w-full max-w-[1450px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">

                        {/* DISTINCTIVE BRAND LOGO */}
                        <Link to="/" className="shrink-0 flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-0.5 shadow-md transition-transform duration-200 group-hover:scale-105">
                                    <div className="w-full h-full bg-[#E51A22] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                                        <Smile className="w-6 h-6 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <span className="absolute -top-1 -right-1 text-xs select-none">
                                    👑
                                </span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-black text-xl sm:text-[23px] tracking-tight">
                                        Little Joys
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[9px] font-black uppercase tracking-wider">
                                        TOYS
                                    </span>
                                </div>
                                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-rose-200 mt-1 flex items-center gap-1">
                                    <span>✦</span> WONDER TOY KINGDOM <span>✦</span>
                                </span>
                            </div>
                        </Link>

                        {/* BESPOKE SEARCH POD WITH INTEGRATED CATEGORY DROPDOWN */}
                        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
                            <form
                                onSubmit={handleSearch}
                                className="w-full flex items-center bg-white rounded-2xl border-2 border-white/90 shadow-md p-1 relative"
                            >
                                {/* Embedded Category Scope Selector */}
                                <div ref={categoryPickerRef} className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
                                        className="h-9 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-[#E51A22] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <span className="text-sm">
                                            {searchCategoryFilter === 'ALL' ? '🧸' : getCategoryBadgeStyle(searchCategoryFilter).icon}
                                        </span>
                                        <span className="max-w-[90px] truncate">
                                            {searchCategoryFilter === 'ALL' ? 'All Toys' : searchCategoryFilter}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isCategoryPickerOpen ? 'rotate-180 text-[#E51A22]' : ''}`} />
                                    </button>

                                    {/* Category Selector Dropdown Popover */}
                                    {isCategoryPickerOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 max-h-72 overflow-y-auto custom-scrollbar transition-all duration-150">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchCategoryFilter('ALL');
                                                    setIsCategoryPickerOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${searchCategoryFilter === 'ALL'
                                                        ? 'bg-rose-50 text-[#E51A22] font-black'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>🧸</span>
                                                <span>All Categories</span>
                                            </button>
                                            <div className="my-1 border-t border-slate-100" />
                                            {categories.map(cat => {
                                                const badge = getCategoryBadgeStyle(cat.name);
                                                return (
                                                    <button
                                                        key={cat._id || cat.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchCategoryFilter(cat.name);
                                                            setIsCategoryPickerOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${searchCategoryFilter === cat.name
                                                                ? 'bg-rose-50 text-[#E51A22] font-black'
                                                                : 'text-slate-700 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span>{badge.icon}</span>
                                                        <span className="truncate">{cat.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div className="flex-1 flex items-center px-2.5">
                                    <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        placeholder="Search for toys, games, categories (e.g. Remote Car, Lego, Dolls)..."
                                        className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-xs sm:text-[13px] font-bold"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="w-5 h-5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors mr-1 cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Ruby Search Submit Button */}
                                <button
                                    type="submit"
                                    className="h-9 px-4 rounded-xl bg-[#E51A22] hover:bg-[#c91219] text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-96 transition-all cursor-pointer uppercase tracking-wider shrink-0"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Search</span>
                                </button>
                            </form>

                            {/* Dropdown for Desktop */}
                            {isSearchFocused && searchQuery.trim() && renderSearchDropdown()}
                        </div>

                        {/* RIGHT ACTION HUB */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                            {/* User Account Capsule / Popover - Matching White Icon Button */}
                            <div className="relative group hidden sm:block">
                                <Link
                                    to={localStorage.getItem('token') ? "/profile" : "/login"}
                                    className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-2xl bg-white hover:bg-amber-50 border border-white text-[#E51A22] transition-transform duration-150 flex items-center justify-center cursor-pointer shadow-md active:scale-97 select-none group"
                                    title={localStorage.getItem('token') ? "My Account" : "Sign In"}
                                >
                                    <User className="w-5 h-5 text-[#E51A22]" strokeWidth={2.4} />
                                </Link>

                                {/* Dropdown Menu on Hover */}
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                    {localStorage.getItem('token') ? (
                                        <div className="w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 overflow-hidden text-slate-800">
                                            <div className="px-4 py-2 border-b border-slate-100 bg-rose-50/50">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in</p>
                                                <p className="text-xs font-black text-slate-800 truncate">
                                                    {(() => {
                                                        try {
                                                            const u = JSON.parse(localStorage.getItem('user'));
                                                            return u?.name || 'Customer';
                                                        } catch {
                                                            return 'Customer';
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                            <Link to="/profile" className="px-4 py-2 text-slate-700 hover:bg-rose-50 hover:text-[#E51A22] text-xs font-bold flex items-center gap-2 transition-colors">
                                                <User className="w-4 h-4 text-[#E51A22]" /> My Profile
                                            </Link>
                                            <Link to="/orders" className="px-4 py-2 text-slate-700 hover:bg-rose-50 hover:text-[#E51A22] text-xs font-bold flex items-center gap-2 transition-colors">
                                                <Package className="w-4 h-4 text-slate-500" /> My Orders
                                            </Link>
                                            <div className="border-t border-slate-100 my-1" />
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                }}
                                                className="px-4 py-2 text-left text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors w-full flex items-center gap-2 cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 text-slate-800">
                                            <p className="text-xs font-bold text-slate-600 mb-2">Welcome to Little Joys!</p>
                                            <Link to="/login" className="w-full py-2 bg-[#E51A22] hover:bg-[#c9141b] text-white text-center font-black text-xs rounded-xl shadow-xs transition-colors block uppercase tracking-wider">
                                                Sign In / Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Wishlist Capsule - Matching White Icon Button */}
                            <Link
                                to="/waitlist"
                                className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-2xl bg-white hover:bg-amber-50 border border-white text-[#E51A22] transition-transform duration-150 hidden sm:flex items-center justify-center cursor-pointer shadow-md active:scale-97 select-none group relative"
                                title="Wishlist"
                            >
                                <Heart className="w-5 h-5 text-[#E51A22]" strokeWidth={2.4} />
                                {getWaitlistCount && getWaitlistCount() > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#FFD200] text-slate-950 text-[11px] font-black min-w-[20px] h-[20px] px-1 rounded-full border-2 border-white shadow-md flex items-center justify-center leading-none text-center">
                                        {getWaitlistCount()}
                                    </span>
                                )}
                            </Link>

                            {/* SIGNATURE 3D FLOATING WHITE CART CAPSULE - Matching White Icon Button */}
                            <button
                                type="button"
                                onClick={openCart}
                                className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-2xl bg-white hover:bg-amber-50 text-[#E51A22] transition-transform duration-150 flex items-center justify-center cursor-pointer shadow-md active:scale-97 select-none border border-white relative"
                                title="Open Shopping Cart"
                            >
                                <ShoppingBag className="w-5 h-5 text-[#E51A22]" strokeWidth={2.4} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#FFD200] text-slate-950 text-[11px] font-black min-w-[20px] h-[20px] px-1 rounded-full border-2 border-white shadow-md flex items-center justify-center leading-none text-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                className="lg:hidden w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer ml-1"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                title="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* MOBILE SEARCH BAR WITH AUTOCOMPLETE */}
                    <div ref={mobileSearchContainerRef} className="md:hidden w-full px-3 pb-3 relative z-40">
                        <form onSubmit={handleSearch} className="w-full relative flex items-center bg-white rounded-2xl p-1 shadow-inner">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsMobileSearchFocused(true)}
                                placeholder="Search toys..."
                                className="w-full bg-transparent px-3 py-1.5 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button type="submit" className="bg-[#E51A22] text-white p-2 rounded-xl shrink-0 cursor-pointer">
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {/* Mobile Search Dropdown */}
                        {isMobileSearchFocused && searchQuery.trim() && renderSearchDropdown()}
                    </div>
                </div>

                {/* 2. DISTINCTIVE LUXURY WHITE NAVIGATION STRIP (PURE GPU ACCELERATED, ZERO BACKDROP-BLUR) */}
                <div className="hidden lg:block w-full bg-white border-b border-slate-200 px-4 md:px-8 py-1.5">
                    <div className="max-w-[1450px] mx-auto flex items-center justify-between">

                        {/* Navigation Pill Links */}
                        <nav className="flex items-center gap-1 xl:gap-2">

                            {/* Home */}
                            <Link
                                to="/"
                                className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('home')}`}
                            >
                                <span>🏠</span>
                                <span>Home</span>
                            </Link>

                            {/* 1. Shop By Age Dropdown - Pure CSS Hover */}
                            <div className="relative group py-1 flex items-center">
                                <Link
                                    to="/shop-by-age"
                                    className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('age')}`}
                                >
                                    <span>🎈</span>
                                    <span>Shop By Age</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${activeTab === 'age' ? 'text-white' : 'text-slate-400 group-hover:text-[#E51A22]'}`} />
                                </Link>
                                <div className="absolute top-full left-0 pt-1.5 w-60 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden text-slate-800">
                                        <div className="h-0.5 bg-[#E51A22] w-full rounded-full mb-1.5" />
                                        <div className="flex flex-col gap-0.5">
                                            {ageMilestones.map(age => (
                                                <Link
                                                    key={age.label}
                                                    to={`/shop-by-age?age=${encodeURIComponent(age.label)}`}
                                                    className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold text-slate-700 hover:text-[#E51A22] hover:bg-rose-50 transition-colors"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-base">{age.icon}</span>
                                                        <span>{age.label}</span>
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">{age.sub}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Toy Categories Dropdown - Pure CSS Hover */}
                            <div className="relative group py-1 flex items-center">
                                <Link
                                    to="/categories"
                                    className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('categories')}`}
                                >
                                    <span>🧸</span>
                                    <span>Toy Categories</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${activeTab === 'categories' ? 'text-white' : 'text-slate-400 group-hover:text-[#E51A22]'}`} />
                                </Link>
                                <div className="absolute top-full left-0 pt-1.5 w-64 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden text-slate-800">
                                        <div className="h-0.5 bg-[#E51A22] w-full rounded-full mb-1.5" />
                                        <div className="flex flex-col gap-0.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                                            {categories.map(cat => {
                                                const badge = getCategoryBadgeStyle(cat.name);
                                                return (
                                                    <Link
                                                        key={cat._id || cat.name}
                                                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                        className="flex items-center px-3 py-2 rounded-xl text-[13px] font-bold text-slate-700 hover:text-[#E51A22] hover:bg-rose-50 transition-colors"
                                                    >
                                                        <span className="truncate flex items-center gap-2.5">
                                                            <span className="text-base">{badge.icon}</span>
                                                            <span>{cat.name}</span>
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                            <div className="border-t border-slate-100 my-1" />
                                            <Link
                                                to="/categories"
                                                className="px-3 py-2 text-center text-xs font-black text-[#E51A22] hover:bg-rose-50 rounded-xl transition-colors block"
                                            >
                                                View All Categories →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Collections Dropdown - Pure CSS Hover */}
                            <div className="relative group py-1 flex items-center">
                                <Link
                                    to="/collections"
                                    className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('collections')}`}
                                >
                                    <span>✨</span>
                                    <span>Collections</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${activeTab === 'collections' ? 'text-white' : 'text-slate-400 group-hover:text-[#E51A22]'}`} />
                                </Link>
                                <div className="absolute top-full left-0 pt-1.5 w-60 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden text-slate-800">
                                        <div className="h-0.5 bg-[#E51A22] w-full rounded-full mb-1.5" />
                                        <div className="flex flex-col gap-0.5">
                                            {collections.map(col => (
                                                <Link
                                                    key={col._id || col.name}
                                                    to={`/products?collection=${encodeURIComponent(col.name)}`}
                                                    className="flex items-center px-3 py-2 rounded-xl text-[13px] font-bold text-slate-700 hover:text-[#E51A22] hover:bg-rose-50 transition-colors"
                                                >
                                                    <span className="truncate flex items-center gap-2">
                                                        <span>✨</span>
                                                        <span>{col.name}</span>
                                                    </span>
                                                </Link>
                                            ))}
                                            <div className="border-t border-slate-100 my-1" />
                                            <Link
                                                to="/collections"
                                                className="px-3 py-2 text-center text-xs font-black text-[#E51A22] hover:bg-rose-50 rounded-xl transition-colors block"
                                            >
                                                View All Collections →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Shop By Price Dropdown - Pure CSS Hover */}
                            <div className="relative group py-1 flex items-center">
                                <Link
                                    to="/shop-by-price"
                                    className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('price')}`}
                                >
                                    <span>🏷️</span>
                                    <span>Shop By Price</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${activeTab === 'price' ? 'text-white' : 'text-slate-400 group-hover:text-[#E51A22]'}`} />
                                </Link>
                                <div className="absolute top-full left-0 pt-1.5 w-56 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden text-slate-800">
                                        <div className="h-0.5 bg-[#E51A22] w-full rounded-full mb-1.5" />
                                        <div className="flex flex-col gap-0.5">
                                            {priceRanges.map(pr => (
                                                <Link
                                                    key={pr.label}
                                                    to={`/products?${pr.query}`}
                                                    className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold text-slate-700 hover:text-[#E51A22] hover:bg-rose-50 transition-colors"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span>{pr.icon}</span>
                                                        <span>{pr.label}</span>
                                                    </span>
                                                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#E51A22]" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boys */}
                            <Link
                                to="/products?gender=Boys"
                                className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('boys')}`}
                            >
                                <span>🏎️</span>
                                <span>Boys</span>
                            </Link>

                            {/* Girls */}
                            <Link
                                to="/products?gender=Girls"
                                className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('girls')}`}
                            >
                                <span>🎀</span>
                                <span>Girls</span>
                            </Link>

                            {/* Best Sellers */}
                            <Link
                                to="/products?filter=best-sellers"
                                className={`relative transition-colors duration-150 text-[13px] xl:text-[13.5px] px-3.5 py-1.5 rounded-full outline-none flex items-center gap-1.5 select-none ${getNavButtonClass('best-sellers')}`}
                            >
                                <Flame className={`w-3.5 h-3.5 ${activeTab === 'best-sellers' ? 'text-white fill-white' : 'text-amber-500 fill-amber-500'}`} />
                                <span>Best Sellers</span>
                            </Link>
                        </nav>

                        {/* Right quick badge: Track Order (Free shipping removed as requested) */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/track-order"
                                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border select-none ${activeTab === 'track-order'
                                        ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-sm'
                                        : 'bg-slate-50 hover:bg-rose-50 hover:text-[#E51A22] hover:border-rose-200 text-slate-700 border-slate-200/90'
                                    }`}
                            >
                                <Package className={`w-3.5 h-3.5 ${activeTab === 'track-order' ? 'text-white' : 'text-[#E51A22]'}`} />
                                <span>Track Order</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* MOBILE NAVIGATION DRAWER */}
                {isMobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 w-80 max-w-[85%] bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-y-auto">

                            {/* Drawer Header */}
                            <div className="p-4 bg-[#E51A22] text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#E51A22]">
                                        <Smile className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-white text-lg">Little Joys</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <nav className="p-4 flex flex-col gap-2 text-slate-800 font-bold text-sm">
                                <Link
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`py-2 px-3 rounded-xl transition-colors flex items-center gap-2 ${activeTab === 'home' ? 'bg-[#E51A22] text-white font-black' : 'hover:bg-rose-50 hover:text-[#E51A22]'
                                        }`}
                                >
                                    <span>🏠</span> <span>Home</span>
                                </Link>

                                <div className="my-1 border-t border-slate-100" />
                                <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3">Shop By Age</div>
                                <div className="grid grid-cols-2 gap-1.5 px-3">
                                    {ageMilestones.map(age => (
                                        <Link
                                            key={age.label}
                                            to={`/shop-by-age?age=${encodeURIComponent(age.label)}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="py-1.5 px-2 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-1.5 truncate"
                                        >
                                            <span>{age.icon}</span>
                                            <span className="truncate">{age.label}</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="my-1 border-t border-slate-100" />
                                <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3">Categories</div>
                                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto px-1 custom-scrollbar">
                                    {categories.map(cat => {
                                        const badge = getCategoryBadgeStyle(cat.name);
                                        return (
                                            <Link
                                                key={cat._id || cat.name}
                                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="py-1.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-2 text-xs"
                                            >
                                                <span>{badge.icon}</span>
                                                <span>{cat.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="my-1 border-t border-slate-100" />
                                <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3">Shop By Gender</div>
                                <div className="grid grid-cols-2 gap-2 px-3">
                                    <Link
                                        to="/products?gender=Boys"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`py-2 text-center rounded-xl font-bold text-xs transition-colors ${activeTab === 'boys' ? 'bg-[#E51A22] text-white font-black' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            }`}
                                    >
                                        🏎️ Boys
                                    </Link>
                                    <Link
                                        to="/products?gender=Girls"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`py-2 text-center rounded-xl font-bold text-xs transition-colors ${activeTab === 'girls' ? 'bg-[#E51A22] text-white font-black' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                                            }`}
                                    >
                                        🎀 Girls
                                    </Link>
                                </div>

                                <div className="my-1 border-t border-slate-100" />
                                <Link
                                    to="/products?filter=best-sellers"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`py-2 px-3 rounded-xl transition-colors flex items-center gap-2 ${activeTab === 'best-sellers' ? 'bg-[#E51A22] text-white font-black' : 'hover:bg-rose-50 hover:text-[#E51A22]'
                                        }`}
                                >
                                    <Flame className={`w-4 h-4 ${activeTab === 'best-sellers' ? 'text-white fill-white' : 'text-amber-500 fill-amber-500'}`} />
                                    <span>Best Sellers</span>
                                </Link>
                                <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-2">
                                    <Package className="w-4 h-4 text-slate-500" /> <span>Track Order</span>
                                </Link>
                                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-rose-50 hover:text-[#E51A22] transition-colors flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-slate-500" /> <span>Help & Support</span>
                                </Link>
                            </nav>
                        </div>
                    </>
                )}
            </header>
        </>
    );
};

export default Navbar;
