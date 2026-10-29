import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingCart, 
    Zap, 
    Heart, 
    Filter, 
    SlidersHorizontal, 
    Grid, 
    List, 
    Search, 
    ChevronDown, 
    X, 
    Sparkles,
    Check,
    RotateCcw
} from 'lucide-react';
import ProductCardImageCarousel from './ProductCardImageCarousel';

export const standardAgeList = [
    { label: '0-12 Months', title: 'Infants', icon: '✨', deco: '💧' },
    { label: '1-2 Years', title: 'Toddlers', icon: '🛁', deco: '🧸' },
    { label: '3-4 Years', title: 'Preschool', icon: '☁️', deco: '☂️' },
    { label: '5-7 Years', title: 'Little Kids', icon: '🌙', deco: '✨' },
    { label: '8+ Years', title: 'Big Kids', icon: '🌿', deco: '☀️' }
];

export const matchesMilestoneAge = (productAgeGroup, milestoneOrAge) => {
    if (!milestoneOrAge || milestoneOrAge === 'all' || milestoneOrAge === 'All') return true;
    if (!productAgeGroup) return false;

    const ages = Array.isArray(productAgeGroup) ? productAgeGroup : [productAgeGroup];
    const targetStr = (typeof milestoneOrAge === 'object' && milestoneOrAge !== null)
        ? (milestoneOrAge.title || milestoneOrAge.fullLabel || '').toLowerCase()
        : String(milestoneOrAge).toLowerCase();

    // Mapping of milestone keywords to accepted age tags in database (e.g., '0-2', '3-5', '6-8')
    let accepted = [];
    if (targetStr.includes('infant') || targetStr.includes('0-12') || targetStr.includes('0-6') || targetStr.includes('6-12')) {
        accepted = ['0-2', '0-12', '0-6', '6-12', 'infant', 'months'];
    } else if (targetStr.includes('toddler') || targetStr.includes('1-2')) {
        accepted = ['0-2', '1-2', '1-3', 'toddler'];
    } else if (targetStr.includes('preschool') || targetStr.includes('3-4')) {
        accepted = ['3-5', '3-4', 'preschool'];
    } else if (targetStr.includes('little') || targetStr.includes('5-7')) {
        accepted = ['3-5', '6-8', '5-7', 'little'];
    } else if (targetStr.includes('big') || targetStr.includes('8+')) {
        accepted = ['6-8', '8+', '8-12', '9-12', '12+', 'big'];
    } else {
        accepted = [targetStr];
    }

    return ages.some(prodAge => {
        const pLower = String(prodAge).toLowerCase().trim();
        if (pLower === targetStr) return true;
        return accepted.some(acc => pLower.includes(acc) || acc.includes(pLower));
    });
};

const ProductCatalogSection = ({
    activeMilestone = null,
    onSelectMilestone = null,
    selectedCategory = null,
    onSelectCategory = null,
    selectedCollection = null,
    onSelectCollection = null,
    activeAge = null,
    onSelectAge = null,
    categoryName = null,
    collectionId = null,
    activeMinPrice = null,
    activeMaxPrice = null,
    onSelectPriceRange = null,
    badgeText = '',
    catalogTitle = 'All Products',
    catalogSubtitle = ''
}) => {
    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [collectionsList, setCollectionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [selectedCategories, setSelectedCategories] = useState(categoryName ? [categoryName] : []);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedAges, setSelectedAges] = useState(activeAge ? [activeAge] : []);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('recommended');
    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [expandedProductDescIds, setExpandedProductDescIds] = useState({});

    // Fetch initial catalog data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const [prodRes, catRes, brandRes, colRes] = await Promise.all([
                    fetch(`${apiUrl}/products`),
                    fetch(`${apiUrl}/categories`),
                    fetch(`${apiUrl}/brands`),
                    fetch(`${apiUrl}/collections`)
                ]);

                const [prodData, catData, brandData, colData] = await Promise.all([
                    prodRes.json(),
                    catRes.json(),
                    brandRes.json(),
                    colRes.json()
                ]);

                if (Array.isArray(prodData)) {
                    setAllProducts(prodData.filter(p => p.status !== 'Draft' && p.status !== 'Inactive'));
                }
                if (catData && catData.success && Array.isArray(catData.data)) {
                    setCategoriesList(catData.data.filter(c => c.status === 'Active'));
                }
                if (Array.isArray(brandData)) {
                    setBrandsList(brandData);
                }
                if (colData && colData.success && Array.isArray(colData.data)) {
                    setCollectionsList(colData.data.filter(c => c.status === 'Active'));
                }
            } catch (error) {
                console.error("Error fetching catalog data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Synchronize parent filter changes
    useEffect(() => {
        if (categoryName) {
            setSelectedCategories([categoryName]);
        }
    }, [categoryName]);

    useEffect(() => {
        if (activeAge) {
            setSelectedAges([activeAge]);
        }
    }, [activeAge]);

    const toggleProductDesc = (productId) => {
        setExpandedProductDescIds(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getCleanCardDescription = (product) => {
        if (!product) return "A wonderful toy designed for endless hours of fun and learning.";
        if (product.shortDescription) return product.shortDescription;
        if (!product.description) return "A wonderful toy designed for endless hours of fun and learning.";
        let text = product.description;
        text = text.replace(/^\s*<b>.*?<\/b>\s*(<br\s*\/?>\s*)*/i, '');
        text = text.replace(/<br\s*\/?>\s*<i>Category:.*?<\/i>/i, '');
        text = text.replace(/Category:.*?Brand:.*$/i, '');
        text = text.replace(/<[^>]+>/g, ' ');
        if (product.name) {
            const escaped = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(`^\\s*${escaped}\\s*`, 'i'), '');
        }
        text = text.replace(/\s+/g, ' ').trim();
        return text || "A wonderful toy designed for endless hours of fun and learning.";
    };

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product) {
            const buyNowItem = { ...product, quantity: 1 };
            sessionStorage.setItem('magic_toys_buynow', JSON.stringify(buyNowItem));
            navigate('/checkout', { state: { buyNowItem } });
        }
    };

    // Filter computation
    const filteredProducts = allProducts.filter(product => {
        // 1. Age Milestone matching
        if (selectedAges.length > 0) {
            const matchesSelectedAge = selectedAges.some(age => matchesMilestoneAge(product.ageGroup, age));
            if (!matchesSelectedAge) return false;
        } else if (activeMilestone) {
            if (!matchesMilestoneAge(product.ageGroup, activeMilestone)) {
                return false;
            }
        }

        // 2. Collection matching
        const effectiveCollection = selectedCollection || collectionId;
        if (effectiveCollection && effectiveCollection !== 'All') {
            if (!Array.isArray(product.collections)) return false;
            const matchesCol = product.collections.some(c => {
                const cId = (typeof c === 'object' && c !== null) ? c._id?.toString() : String(c);
                const cName = (typeof c === 'object' && c !== null) ? c.name : null;
                return cId === effectiveCollection || (cName && cName.toLowerCase() === String(effectiveCollection).toLowerCase());
            });
            if (!matchesCol) return false;
        }

        // 3. Category matching
        const effectiveCategory = selectedCategory || (selectedCategories.length > 0 ? selectedCategories : null);
        if (effectiveCategory && effectiveCategory !== 'All') {
            const targetCategories = Array.isArray(effectiveCategory) ? effectiveCategory : [effectiveCategory];
            if (targetCategories.length > 0) {
                const matchesCat = targetCategories.some(catName => {
                    const cLower = String(catName).toLowerCase().trim();
                    if (product.category && product.category.toLowerCase().trim() === cLower) return true;
                    if (Array.isArray(product.categories)) {
                        return product.categories.some(c => {
                            const name = typeof c === 'object' && c !== null ? c.name : c;
                            return name && String(name).toLowerCase().trim() === cLower;
                        });
                    }
                    return false;
                });
                if (!matchesCat) return false;
            }
        }

        // 4. Brand matching
        if (selectedBrands.length > 0) {
            const pBrandName = (typeof product.brand === 'object' && product.brand !== null) ? product.brand.name : (product.brand || '');
            const pBrandId = (typeof product.brand === 'object' && product.brand !== null) ? product.brand._id?.toString() : (product.brand?.toString() || '');
            const matchesBrand = selectedBrands.some(b => {
                const bLower = b.toLowerCase();
                return (
                    (pBrandName && pBrandName.toLowerCase() === bLower) ||
                    pBrandId === b ||
                    (product.name && product.name.toLowerCase().includes(bLower))
                );
            });
            if (!matchesBrand) return false;
        }

        // 5. Gender matching
        if (selectedGenders.length > 0) {
            if (!selectedGenders.includes(product.gender) && product.gender !== 'Unisex' && product.gender !== 'All') {
                return false;
            }
        }

        // 6. Max / Min Price
        if (activeMinPrice != null && (product.price || 0) < activeMinPrice) {
            return false;
        }
        if (activeMaxPrice != null && (product.price || 0) > activeMaxPrice) {
            return false;
        }
        if (activeMinPrice == null && activeMaxPrice == null && maxPrice < 5000 && product.price > maxPrice) {
            return false;
        }

        // 7. In stock only
        if (inStockOnly && product.status === 'Out of Stock') {
            return false;
        }

        // 8. Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const mName = product.name && product.name.toLowerCase().includes(q);
            const mCat = product.category && product.category.toLowerCase().includes(q);
            const mDesc = product.description && product.description.toLowerCase().includes(q);
            if (!mName && !mCat && !mDesc) return false;
        }

        return true;
    }).sort((a, b) => {
        // Out of stock items always go to the end
        const aOut = a.status === 'Out of Stock';
        const bOut = b.status === 'Out of Stock';
        if (aOut && !bOut) return 1;
        if (!aOut && bOut) return -1;

        if (sortOrder === 'price-low') {
            return (a.price || 0) - (b.price || 0);
        } else if (sortOrder === 'price-high') {
            return (b.price || 0) - (a.price || 0);
        } else if (sortOrder === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOrder === 'bestseller') {
            return (b.totalSales || b.salesCount || 0) - (a.totalSales || a.salesCount || 0);
        }
        // Recommended default
        return 0;
    });

    const resetAllFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedGenders([]);
        setSelectedAges([]);
        setMaxPrice(5000);
        setInStockOnly(false);
        setSearchQuery('');
        if (onSelectMilestone) onSelectMilestone(null);
        if (onSelectCategory) onSelectCategory(null);
        if (onSelectCollection) onSelectCollection(null);
        if (onSelectAge) onSelectAge(null);
        if (onSelectPriceRange) onSelectPriceRange(null, null);
    };

    const hasActiveFilters = Boolean(
        activeMilestone ||
        (selectedCategory && selectedCategory !== 'All') ||
        (selectedCollection && selectedCollection !== 'All') ||
        activeMinPrice != null ||
        activeMaxPrice != null ||
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        selectedGenders.length > 0 ||
        selectedAges.length > 0 ||
        maxPrice < 5000 ||
        inStockOnly ||
        searchQuery.trim()
    );

    return (
        <section id="catalog-products-section" className="w-full bg-[#FCFCFD] pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-20 border-t border-slate-100">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                
                {/* Section Header Toolbar */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100/90 mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Title and Active Status Badge */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-black text-[#1A1A24] tracking-tight">
                                    {catalogTitle}
                                </h2>
                                <span className="bg-rose-50 text-[#E51A22] text-xs font-bold px-3 py-1 rounded-full border border-rose-100 shadow-2xs">
                                    {loading ? 'Finding toys...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Product' : 'Products'} Found`}
                                </span>
                                {activeMilestone && (
                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                                        <span>{activeMilestone.icon || '🌱'}</span>
                                        <span>Age: {activeMilestone.title} ({activeMilestone.age} {activeMilestone.label})</span>
                                        <button 
                                            type="button" 
                                            onClick={() => onSelectMilestone && onSelectMilestone(null)}
                                            className="ml-1 text-amber-600 hover:text-amber-900 cursor-pointer font-black"
                                            title="Clear age filter"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && selectedCategory !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                                        <span>Category: {selectedCategory}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => onSelectCategory && onSelectCategory(null)}
                                            className="ml-1 text-indigo-600 hover:text-indigo-900 cursor-pointer font-black"
                                            title="Clear category filter"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {selectedCollection && selectedCollection !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                                        <span>Collection Active</span>
                                        <button 
                                            type="button" 
                                            onClick={() => onSelectCollection && onSelectCollection(null)}
                                            className="ml-1 text-purple-600 hover:text-purple-900 cursor-pointer font-black"
                                            title="Clear collection filter"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {(activeMinPrice != null || activeMaxPrice != null) && (
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                                        <span>🏷️</span>
                                        <span>
                                            Price: {activeMinPrice != null && activeMaxPrice != null 
                                                ? `₹${activeMinPrice} - ₹${activeMaxPrice}` 
                                                : activeMaxPrice != null 
                                                    ? `Under ₹${activeMaxPrice}` 
                                                    : `Above ₹${activeMinPrice}`}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => onSelectPriceRange && onSelectPriceRange(null, null)}
                                            className="ml-1 text-emerald-600 hover:text-emerald-900 cursor-pointer font-black"
                                            title="Clear price filter"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                                {catalogSubtitle || "Discover top-rated educational, safe, and entertaining toys."}
                            </p>
                        </div>

                        {/* Search, Sort, View Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                            
                            {/* Inline Search */}
                            <div className="relative flex-1 sm:w-56 md:w-64">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search in these toys..."
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] transition-all"
                                />
                                {searchQuery && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative shrink-0">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-[#E51A22] transition-colors"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="bestseller">Best Selling</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* Grid / List Switcher */}
                            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#E51A22] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Grid View"
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#E51A22] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#E51A22] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-[#c9141b] transition-colors shrink-0"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout: Left Filter Sidebar + Right Products Grid */}
                <div className="flex items-start gap-6 lg:gap-8">
                    
                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/90 sticky top-24">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#E51A22]" />
                                <h3 className="font-extrabold text-[16px] text-slate-900 tracking-tight">Filters</h3>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset All</span>
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-6 text-sm">
                            
                            {/* In-Stock Only Toggle */}
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <label htmlFor="inStockToggle" className="font-bold text-slate-700 cursor-pointer select-none text-xs uppercase tracking-wider">
                                    In-Stock Only
                                </label>
                                <input
                                    id="inStockToggle"
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 text-[#E51A22] rounded-md border-slate-300 focus:ring-[#E51A22] cursor-pointer"
                                />
                            </div>

                            {/* Price Range Slider */}
                            <div className="flex flex-col gap-2 pb-4 border-b border-slate-100">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="uppercase tracking-wider text-slate-400">Max Price</span>
                                    <span className="text-[#E51A22] font-black text-sm">₹{maxPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min="200"
                                    max="5000"
                                    step="100"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-[#E51A22] cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 font-semibold select-none">
                                    <span>₹200</span>
                                    <span>₹5,000+</span>
                                </div>
                            </div>

                            {/* Categories Filter */}
                            {categoriesList.length > 0 && (
                                <div className="flex flex-col gap-2.5 pb-4 border-b border-slate-100">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 select-none">Categories</span>
                                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                                        {categoriesList.map(cat => {
                                            const isChecked = selectedCategories.includes(cat.name) || selectedCategory === cat.name;
                                            return (
                                                <label 
                                                    key={cat._id} 
                                                    className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-[#E51A22] cursor-pointer select-none py-1"
                                                >
                                                    <span className="flex items-center gap-2 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                if (isChecked) {
                                                                    setSelectedCategories(prev => prev.filter(c => c !== cat.name));
                                                                    if (selectedCategory === cat.name && onSelectCategory) onSelectCategory(null);
                                                                } else {
                                                                    setSelectedCategories(prev => [...prev, cat.name]);
                                                                    if (onSelectCategory) onSelectCategory(cat.name);
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-[#E51A22] rounded-md border-slate-300 focus:ring-[#E51A22] cursor-pointer"
                                                        />
                                                        <span className="cursor-pointer select-none">{cat.name}</span>
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 cursor-pointer select-none">{cat.icon || '🧸'}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Gender Filter */}
                            <div className="flex flex-col gap-2.5 pb-4 border-b border-slate-100">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 select-none">Gender</span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {['Boys', 'Girls', 'Unisex'].map(gender => {
                                        const isSelected = selectedGenders.includes(gender);
                                        return (
                                            <button
                                                key={gender}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedGenders(prev => 
                                                        isSelected ? prev.filter(g => g !== gender) : [...prev, gender]
                                                    );
                                                }}
                                                className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none ${
                                                    isSelected 
                                                        ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-xs' 
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                {gender}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Age Groups Filter */}
                            <div className="flex flex-col gap-2.5">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 select-none">Age Groups</span>
                                <div className="flex flex-col gap-1.5">
                                    {standardAgeList.map(ageItem => {
                                        const ageVal = ageItem.label;
                                        const isChecked = selectedAges.includes(ageVal) || (activeMilestone && (activeMilestone.fullLabel === ageVal || activeMilestone.title === ageItem.title));
                                        return (
                                            <label 
                                                key={ageVal} 
                                                className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-[#E51A22] cursor-pointer select-none py-1 group/ageItem transition-colors"
                                            >
                                                <span className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            if (isChecked) {
                                                                setSelectedAges(prev => prev.filter(a => a !== ageVal));
                                                                if (onSelectMilestone) onSelectMilestone(null);
                                                            } else {
                                                                setSelectedAges(prev => [...prev, ageVal]);
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-[#E51A22] rounded-md border-slate-300 focus:ring-[#E51A22] cursor-pointer"
                                                    />
                                                    <span className="text-base leading-none shrink-0 cursor-pointer select-none">{ageItem.icon}</span>
                                                    <span className="cursor-pointer select-none">{ageVal}</span>
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-400 group-hover/ageItem:text-[#E51A22]/70 cursor-pointer select-none">{ageItem.title}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Right Products Catalog Grid / List */}
                    <div className="flex-1 w-full min-w-0">
                        {loading ? (
                            <div className="min-h-[400px] flex items-center justify-center bg-white rounded-3xl border border-slate-100 p-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-bold text-slate-500">Loading amazing toys...</span>
                                </div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm">
                                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-3xl mb-4">
                                    🧸
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">No Matching Toys Found</h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                                    We couldn't find any products matching your selected criteria. Try adjusting the filters or resetting to see all toys.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="inline-flex items-center gap-2 bg-[#E51A22] hover:bg-[#c9141b] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Reset All Filters</span>
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            /* Grid Layout */
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100/90 hover:border-[#E51A22]/30 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                                    >
                                        {/* Wishlist Heart */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWaitlist(product);
                                            }}
                                            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#E51A22] hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                            title="Add to Wishlist"
                                        >
                                            <Heart
                                                className={`w-4 h-4 transition-colors ${
                                                    waitlistItems.some(item => (item._id || item.id) === product._id)
                                                        ? 'text-[#E51A22] fill-[#E51A22]'
                                                        : ''
                                                }`}
                                            />
                                        </button>

                                        {/* Top Badges */}
                                        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
                                            {product.originalPrice > product.price && (
                                                <span className="bg-[#E51A22] text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                </span>
                                            )}
                                            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                                                <span className="bg-amber-100 text-amber-800 text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs">
                                                    Only {product.stockQuantity} Left!
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Image Link with Carousel */}
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="block aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-2"
                                        >
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                                            {/* Category / Age Pill */}
                                            <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold text-slate-400 truncate">
                                                <span className="truncate">{product.category || 'Toy'}</span>
                                                {product.ageGroup && product.ageGroup.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-[#E51A22]">{Array.isArray(product.ageGroup) ? product.ageGroup[0] : product.ageGroup}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Product Title */}
                                            <Link to={`/product/${product._id}`} className="block mb-1.5">
                                                <h4 className="font-extrabold text-[#1A1A24] text-[13px] sm:text-[14.5px] leading-snug line-clamp-2 group-hover:text-[#E51A22] transition-colors">
                                                    {product.name}
                                                </h4>
                                            </Link>

                                            {/* Description view more */}
                                            <div className="text-[11.5px] text-slate-500 mb-2 leading-relaxed">
                                                <p className={expandedProductDescIds[product._id] ? "" : "line-clamp-2 overflow-hidden"}>
                                                    {getCleanCardDescription(product)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleProductDesc(product._id);
                                                    }}
                                                    className="mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-bold text-[#E51A22] hover:text-[#b81219] transition-colors cursor-pointer"
                                                >
                                                    <span>{expandedProductDescIds[product._id] ? 'Less' : 'More'}</span>
                                                </button>
                                            </div>

                                            {/* Price block */}
                                            <div className="flex items-baseline gap-1.5 mt-auto pt-2 border-t border-slate-100">
                                                <span className="font-black text-[#1A1A24] text-[15px] sm:text-[17px]">
                                                    ₹{product.price ? product.price.toFixed(0) : '0'}
                                                </span>
                                                {product.originalPrice > (product.price || 0) && (
                                                    <span className="text-[11px] text-slate-400 line-through font-semibold">
                                                        ₹{product.originalPrice.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add to Cart & Buy Now Buttons */}
                                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                                                {product.status === 'Out of Stock' ? (
                                                    <button
                                                        disabled
                                                        className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 text-[11px] font-bold cursor-not-allowed text-center"
                                                    >
                                                        Out of Stock
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl border border-slate-200 hover:border-[#E51A22] bg-white hover:bg-rose-50/50 text-[#1A1A24] hover:text-[#E51A22] text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                                                            title="Add to Cart"
                                                        >
                                                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">Cart</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleBuyNow(e, product)}
                                                            className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                                                            title="Buy Now"
                                                        >
                                                            <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
                                                            <span className="truncate">Buy</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List Layout */
                            <div className="flex flex-col gap-4">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-3xl border border-slate-100 hover:border-[#E51A22]/30 shadow-xs hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row items-center gap-5"
                                    >
                                        <div className="relative w-full sm:w-48 h-48 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </div>

                                        <div className="flex-1 w-full min-w-0">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                                                <span>{product.category}</span>
                                                {product.ageGroup && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-[#E51A22]">{Array.isArray(product.ageGroup) ? product.ageGroup.join(', ') : product.ageGroup}</span>
                                                    </>
                                                )}
                                            </div>
                                            <Link to={`/product/${product._id}`}>
                                                <h4 className="font-extrabold text-[#1A1A24] text-[16px] sm:text-[18px] hover:text-[#E51A22] transition-colors leading-snug mb-2">
                                                    {product.name}
                                                </h4>
                                            </Link>
                                            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-3">
                                                {getCleanCardDescription(product)}
                                            </p>
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-xl font-black text-[#1A1A24]">
                                                    ₹{product.price.toFixed(0)}
                                                </span>
                                                {product.originalPrice > product.price && (
                                                    <span className="text-xs text-slate-400 line-through font-semibold">
                                                        ₹{product.originalPrice.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => addToCart(product)}
                                                    className="px-5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#E51A22] text-slate-800 hover:text-[#E51A22] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span>Add to Cart</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleBuyNow(e, product)}
                                                    className="px-6 py-2 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                                >
                                                    <Zap className="w-4 h-4 fill-current" />
                                                    <span>Buy Now</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* Mobile Filter Slide-out Drawer */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
                        >
                            <div>
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                                    <h3 className="font-extrabold text-lg text-slate-900">Filter Toys</h3>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="p-1 rounded-full text-slate-400 hover:text-slate-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-5 pb-4 border-b border-slate-100">
                                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                                        <span className="text-slate-500">Max Price</span>
                                        <span className="text-[#E51A22] font-black">₹{maxPrice}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="200"
                                        max="5000"
                                        step="100"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full accent-[#E51A22]"
                                    />
                                </div>

                                {/* Age Filter */}
                                <div className="mb-5 pb-4 border-b border-slate-100">
                                    <span className="text-xs font-black uppercase text-slate-400 block mb-2">Age</span>
                                    <div className="flex flex-col gap-1.5">
                                        {standardAgeList.map(ageItem => {
                                            const ageVal = ageItem.label;
                                            const isChecked = selectedAges.includes(ageVal) || (activeMilestone && (activeMilestone.fullLabel === ageVal || activeMilestone.title === ageItem.title));
                                            return (
                                                <label key={ageVal} className="flex items-center justify-between text-xs font-bold text-slate-700 py-1 cursor-pointer select-none">
                                                    <span className="flex items-center gap-2 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                if (isChecked) {
                                                                    setSelectedAges(prev => prev.filter(a => a !== ageVal));
                                                                    if (onSelectMilestone) onSelectMilestone(null);
                                                                } else {
                                                                    setSelectedAges(prev => [...prev, ageVal]);
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-[#E51A22] rounded-md cursor-pointer"
                                                        />
                                                        <span className="text-base leading-none shrink-0 cursor-pointer select-none">{ageItem.icon}</span>
                                                        <span className="cursor-pointer select-none">{ageVal}</span>
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400 cursor-pointer select-none">{ageItem.title}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Categories Filter */}
                                {categoriesList.length > 0 && (
                                    <div className="mb-5 pb-4 border-b border-slate-100">
                                        <span className="text-xs font-black uppercase text-slate-400 block mb-2 select-none">Categories</span>
                                        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                                            {categoriesList.map(cat => (
                                                <label key={cat._id} className="flex items-center gap-2 text-xs font-bold text-slate-700 py-1 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(cat.name)}
                                                        onChange={() => {
                                                            setSelectedCategories(prev => 
                                                                prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name]
                                                            );
                                                        }}
                                                        className="w-4 h-4 text-[#E51A22] rounded-md cursor-pointer"
                                                    />
                                                    <span className="cursor-pointer select-none">{cat.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-2">
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-[#E51A22] text-white font-bold text-xs shadow-md"
                                >
                                    Apply ({filteredProducts.length})
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProductCatalogSection;
