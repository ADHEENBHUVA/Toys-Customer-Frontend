import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';
import Breadcrumb from '../components/Breadcrumb';

const ageList = ['0-6 Months', '6-12 Months', '1-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years'];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart, waitlistItems, toggleWaitlist, websiteSettings } = useCart();

    // Read from URL
    const selectedCategories = searchParams.getAll('category');
    const selectedGenders = searchParams.getAll('gender');
    const selectedAges = searchParams.getAll('age');
    const maxPriceStr = searchParams.get('maxPrice');
    const selectedMaxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : 5000;
    const sortOrder = searchParams.get('sort') || 'recommended';

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [visibleCount, setVisibleCount] = useState(8);
    const [expandedProductDescIds, setExpandedProductDescIds] = useState({});

    const toggleProductDesc = (productId) => {
        setExpandedProductDescIds(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getCleanCardDescription = (product) => {
        if (!product) return "A wonderful toy designed for endless hours of fun and creativity for kids of all ages.";
        if (product.shortDescription) return product.shortDescription;
        if (!product.description) return "A wonderful toy designed for endless hours of fun and creativity for kids of all ages.";
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
        return text || "A wonderful toy designed for endless hours of fun and creativity for kids of all ages.";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isNewArrivals = searchParams.get('filter') === 'new-arrivals';
                const isBestSellers = searchParams.get('filter') === 'best-sellers';
                let endpoint = '/products';
                if (isNewArrivals) endpoint = '/products/new-arrivals';
                if (isBestSellers) endpoint = '/products/best-sellers';

                const [prodRes, catRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}${endpoint}`),
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/categories`)
                ]);

                const prodData = await prodRes.json();
                if (Array.isArray(prodData)) {
                    setAllProducts(prodData);
                } else {
                    console.error('Products API did not return an array:', prodData);
                    setAllProducts([]);
                }

                const catData = await catRes.json();
                if (catData && catData.success && Array.isArray(catData.data)) {
                    setCategoriesList(catData.data.map(c => c.name));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams.get('filter')]);

    useEffect(() => {
        let result = [...allProducts];

        // Filter by specific product IDs (from Promo Media)
        const idsParam = searchParams.get('ids');
        if (idsParam) {
            const idsList = idsParam.split(',');
            result = result.filter(p => idsList.includes(p._id));
        }

        // Filter by search query
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => {
                const matchName = p.name && p.name.toLowerCase().includes(query);
                const matchCategory = p.category && p.category.toLowerCase().includes(query);
                const matchSubCategory = p.subCategory && p.subCategory.name && p.subCategory.name.toLowerCase().includes(query);
                const matchDescription = p.description && p.description.toLowerCase().includes(query);
                return matchName || matchCategory || matchSubCategory || matchDescription;
            });
        }

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        // Filter by gender
        if (selectedGenders.length > 0) {
            result = result.filter(p => selectedGenders.includes(p.gender) || p.gender === 'All');
        }

        // Filter by age group
        if (selectedAges.length > 0) {
            result = result.filter(p => {
                if (!p.ageGroup) return false;
                if (Array.isArray(p.ageGroup)) {
                    return p.ageGroup.some(age => selectedAges.includes(age));
                }
                return selectedAges.includes(p.ageGroup);
            });
        }

        // Filter by max price
        if (selectedMaxPrice < 5000) {
            result = result.filter(p => p.price <= selectedMaxPrice);
        }

        // Filter by special filters (e.g. sale)
        const filterParam = searchParams.get('filter');
        if (filterParam === 'sale') {
            result = result.filter(p => p.originalPrice > p.price && p.status !== 'Out of Stock');
        }

        // Apply Sorting
        result.sort((a, b) => {
            // Out of stock always at the end
            const aOut = a.status === 'Out of Stock';
            const bOut = b.status === 'Out of Stock';
            if (aOut && !bOut) return 1;
            if (!aOut && bOut) return -1;

            if (sortOrder === 'price-low') {
                return a.price - b.price;
            } else if (sortOrder === 'price-high') {
                return b.price - a.price;
            } else if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // Default sorting (recommended/best selling)
                // Assuming we want highest sold/orders first. We'll use rating or created date as fallback if no sales field exists
                const aSales = a.totalSales || a.salesCount || 0;
                const bSales = b.totalSales || b.salesCount || 0;
                if (aSales !== bSales) {
                    return bSales - aSales; // Highest sales first
                }
                return 0;
            }
        });

        setFilteredProducts(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString(), selectedMaxPrice, sortOrder, allProducts]);

    const handleCategoryClick = (cat) => {
        const newParams = new URLSearchParams(searchParams);
        const currentCats = newParams.getAll('category');
        newParams.delete('category'); // Clear all categories to rebuild

        if (currentCats.includes(cat)) {
            // Remove the unselected category
            currentCats.filter(c => c !== cat).forEach(c => newParams.append('category', c));
        } else {
            // Add the new category
            [...currentCats, cat].forEach(c => newParams.append('category', c));
        }
        setSearchParams(newParams);
        setVisibleCount(8);
    };

    const handleAgeClick = (age) => {
        const newParams = new URLSearchParams(searchParams);
        const currentAges = newParams.getAll('age');
        newParams.delete('age');

        if (currentAges.includes(age)) {
            currentAges.filter(a => a !== age).forEach(a => newParams.append('age', a));
        } else {
            [...currentAges, age].forEach(a => newParams.append('age', a));
        }
        setSearchParams(newParams);
        setVisibleCount(8);
    };

    const handlePriceChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('maxPrice', e.target.value);
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', e.target.value);
        setSearchParams(newParams);
        setVisibleCount(8);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    let displayTitle = 'All Products';
    const filterParamTitle = searchParams.get('filter');
    const idsParamTitle = searchParams.get('ids');
    
    if (idsParamTitle) {
        displayTitle = 'Selected Products';
    } else if (filterParamTitle === 'sale') {
        displayTitle = 'Sell';
    } else if (filterParamTitle === 'new-arrivals') {
        displayTitle = 'New Arrivals';
    } else if (filterParamTitle === 'best-sellers') {
        displayTitle = 'Best Sellers';
    } else if (selectedCategories.length === 1 && selectedAges.length === 0) {
        displayTitle = selectedCategories[0];
    } else if (selectedAges.length === 1 && selectedCategories.length === 0) {
        displayTitle = selectedAges[0];
    } else if (selectedCategories.length > 0 || selectedAges.length > 0) {
        displayTitle = 'Filtered Results';
    }

    const displayedProducts = filteredProducts;

    const getBreadcrumbItems = () => {
        const items = [{ label: 'Shop', link: '/products' }];
        const collectionId = searchParams.get('collection');
        const searchQuery = searchParams.get('search');
        
        if (selectedCategories.length === 1) {
            items.push({ label: 'Categories', link: '/categories' });
            items.push({ label: selectedCategories[0], link: null });
        } else if (collectionId) {
            items.push({ label: 'Collections', link: '/collections' });
            items.push({ label: 'Collection Items', link: null });
        } else if (selectedAges.length === 1) {
            items.push({ label: `Age: ${selectedAges[0]}`, link: null });
        } else if (searchQuery) {
            items.push({ label: `Search: ${searchQuery}`, link: null });
        } else {
            items[0].link = null; // Shop is current page
        }
        return items;
    };

    return (
        <div className="bg-[#fcfaf7] min-h-screen pt-2 pb-20">
            <Breadcrumb items={getBreadcrumbItems()} />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="hidden lg:flex flex-col w-[280px] flex-shrink-0 gap-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                        {/* Filters Header (Clear All) */}
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[20px] font-black text-slate-800">Filters</h2>
                            {(selectedCategories.length > 0 || selectedMaxPrice < 5000 || selectedAges.length > 0 || searchParams.get('search')) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-[14px] font-bold text-[#ff6b6b] hover:text-[#ff5252] hover:underline transition-all"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Box 1: Product categories */}
                        <div className="bg-white p-6 rounded-3xl border-2 border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-6">
                            <h3 className="text-[18px] font-black text-[#1A1A24] mb-5 flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#E51A22]"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                                Categories
                            </h3>
                            <ul className="space-y-3">
                                {categoriesList.map(cat => {
                                    const isSelected = selectedCategories.includes(cat);
                                    return (
                                        <li
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            className="flex items-center gap-3 group cursor-pointer"
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-[#E51A22] shadow-[0_2px_8px_rgba(229,26,34,0.3)] border-transparent' : 'bg-white border-2 border-gray-200 group-hover:border-[#E51A22]'}`}>
                                                {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                                            </div>
                                            <span className={`font-bold transition-colors text-[15px] ${isSelected ? 'text-[#1A1A24]' : 'text-gray-500 group-hover:text-[#1A1A24]'}`}>
                                                {cat}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Box 2: Filter by price */}
                        <div className="bg-white p-6 rounded-3xl border-2 border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                            <h3 className="text-[18px] font-black text-[#1A1A24] mb-8 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E51A22] shadow-[0_2px_8px_rgba(229,26,34,0.15)] text-[16px]">₹</div>
                                Price Range
                            </h3>
                            <div className="px-1">
                                <div className="relative w-full mb-8 pt-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="50"
                                        value={selectedMaxPrice}
                                        onChange={handlePriceChange}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
                                        style={{
                                            background: `linear-gradient(to right, #E51A22 0%, #E51A22 ${(selectedMaxPrice / 5000) * 100}%, #F3F4F6 ${(selectedMaxPrice / 5000) * 100}%, #F3F4F6 100%)`,
                                        }}
                                    />
                                    <style>{`
                                        input[type=range]::-webkit-slider-thumb {
                                            -webkit-appearance: none;
                                            appearance: none;
                                            width: 20px;
                                            height: 20px;
                                            border-radius: 50%;
                                            background: #E51A22;
                                            border: 3px solid white;
                                            box-shadow: 0 2px 5px rgba(229, 26, 34, 0.4);
                                            cursor: pointer;
                                        }
                                        input[type=range]::-moz-range-thumb {
                                            width: 20px;
                                            height: 20px;
                                            border-radius: 50%;
                                            background: #E51A22;
                                            border: 3px solid white;
                                            box-shadow: 0 2px 5px rgba(229, 26, 34, 0.4);
                                            cursor: pointer;
                                        }
                                    `}</style>
                                </div>

                                <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                                    <div className="flex flex-col px-3 py-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Min</span>
                                        <span className="text-[13px] font-black text-gray-700">₹0</span>
                                    </div>
                                    <div className="w-[1px] h-6 bg-gray-200"></div>
                                    <div className="flex flex-col px-3 py-1 items-end">
                                        <span className="text-[9px] font-bold text-[#E51A22] uppercase tracking-widest mb-0.5">Max</span>
                                        <span className="text-[13px] font-black text-[#E51A22]">₹{selectedMaxPrice === 5000 ? '5000+' : selectedMaxPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                {displayTitle}
                            </h1>
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden w-full md:w-auto bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                Filters
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`${viewMode === 'grid' ? 'text-[#118AB2]' : 'text-slate-300 hover:text-slate-500'} transition-colors`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`${viewMode === 'list' ? 'text-[#118AB2]' : 'text-slate-300 hover:text-slate-500'} transition-colors`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" /></svg>
                                    </button>
                                </div>
                                <select
                                    value={sortOrder}
                                    onChange={handleSortChange}
                                    className="bg-transparent text-slate-600 text-sm font-bold outline-none cursor-pointer"
                                >
                                    <option value="recommended">Default sorting</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                            <div className="text-[13px] font-bold text-slate-500 text-center w-full sm:w-auto">
                                Showing {filteredProducts.length} results
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div>
                            {loading ? (
                                <div className="flex items-center justify-center h-64 w-full">
                                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#118AB2] rounded-full animate-spin"></div>
                                </div>
                            ) : displayedProducts.length > 0 ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6" : "flex flex-col gap-6"}>
                                    {displayedProducts.map((product) => (
                                        viewMode === 'grid' ? (
                                            <div key={product._id} className="flex flex-col group cursor-pointer relative bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-red-50 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                                                {/* Image Container */}
                                                <div className="relative w-full aspect-square overflow-hidden bg-[#F8F9FA]">
                                                    {/* Discount Badge */}
                                                    {product.originalPrice > product.price && (
                                                        <div className="absolute top-2 left-2 z-30 pointer-events-none">
                                                            <span className="bg-[#E51A22] text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold tracking-wider shadow-xs flex items-center gap-0.5">
                                                                {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons in Image Footer - Wishlist & Add to Cart */}
                                                    <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1.5 opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                                        {/* Wishlist Button */}
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 active:scale-95 border border-slate-200/80 transition-all duration-200 cursor-pointer"
                                                            title="Wishlist"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"} stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#64748b"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                            </svg>
                                                        </button>

                                                        {/* Add to Cart Button (Turns Red on hover) */}
                                                        {product.status !== 'Out of Stock' && (
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 text-slate-700 hover:bg-[#E51A22] hover:text-white hover:border-[#E51A22] backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 active:scale-95 border border-slate-200/80 transition-all duration-200 cursor-pointer"
                                                                title="Add to Cart"
                                                            >
                                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                                                                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>

                                                    <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                                                        <ProductCardImageCarousel 
                                                            images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])} 
                                                            productName={product.name} 
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Content Section */}
                                                <div className="p-3 sm:p-5 flex flex-col flex-grow text-left bg-white relative">
                                                    {/* Ratings Display */}
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <div className="flex items-center gap-0.5 text-[#F5A623]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold tracking-wider">({product.reviewCount || 0})</span>
                                                    </div>

                                                    <Link to={`/product/${product._id}`} className="font-bold text-[#1A1A24] text-[13px] sm:text-[15px] md:text-[16px] mb-1 hover:text-[#E51A22] transition-colors leading-snug line-clamp-1">
                                                        {product.name}
                                                    </Link>

                                                    <div className="text-[12px] text-gray-500/90 mb-3 leading-relaxed">
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
                                                            className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#E51A22] hover:text-[#b81219] transition-colors cursor-pointer"
                                                        >
                                                            <span>{expandedProductDescIds[product._id] ? 'View Less' : 'View More'}</span>
                                                            <svg
                                                                className={`w-3 h-3 transition-transform duration-200 ${expandedProductDescIds[product._id] ? 'rotate-180' : ''}`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2.5}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-slate-50">
                                                        {product.status === 'Out of Stock' ? (
                                                            <span className="font-bold text-gray-400 text-[12px]">Out of Stock</span>
                                                        ) : (
                                                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                                                                <span className="font-extrabold text-[#1A1A24] text-[14.5px] sm:text-[17px] md:text-[19px]">
                                                                    ₹{`${(product.price || 0).toFixed(0)}`}
                                                                </span>
                                                                {product.originalPrice > (product.price || 0) && (
                                                                    <span className="text-[10.5px] sm:text-[12px] text-gray-400 line-through font-medium">
                                                                        ₹{`${(product.originalPrice || 0).toFixed(0)}`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // List View Card
                                            <div key={product._id} className="flex flex-col sm:flex-row gap-8 bg-transparent">
                                                {/* Image side */}
                                                <div className="relative w-full sm:w-[280px] h-[280px] border border-slate-200 rounded-3xl bg-white p-4 flex items-center justify-center flex-shrink-0 group">
                                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                                                        {product.originalPrice > product.price && (
                                                            <span className="bg-[#E51A22] text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider shadow-sm flex items-center gap-1 w-max">
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                                                {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                            </span>
                                                        )}
                                                        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                                                            <span className="bg-orange-100 border border-orange-200 text-orange-600 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max shadow-sm flex items-center gap-1 animate-pulse">
                                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                                                Only {product.stockQuantity} Left!
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Link to={`/product/${product._id}`} className="block w-full h-full flex items-center justify-center">
                                                        <ProductCardImageCarousel 
                                                            images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])} 
                                                            productName={product.name} 
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Content side */}
                                                <div className="flex-1 flex flex-col justify-center py-2">
                                                    <Link to={`/product/${product._id}`}>
                                                        <h3 className="font-semibold text-[#1A1A24] text-[18px] md:text-[19px] leading-tight mb-3 hover:text-[#E51A22] transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div className="text-[14px] text-slate-500 leading-relaxed mb-4 max-w-2xl font-semibold line-clamp-2">
                                                        <p>{product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.replace(product.name, '')?.trim()) || "No description available"}</p>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        {product.status === 'Out of Stock' ? (
                                                            <span className="text-[16px] font-semibold text-slate-400">Out of Stock</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-[18px] md:text-[20px] font-semibold text-[#1A1A24]">₹{product.price.toFixed(2)}</span>
                                                                {product.originalPrice > product.price && (
                                                                    <span className="text-[14px] font-medium text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-6">
                                                        <div className="flex text-[#fbdf14] text-[13px] tracking-widest">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <span key={s}>{s <= Math.round(product.rating || 5) ? '★' : '☆'}</span>
                                                            ))}
                                                        </div>
                                                        <span className="text-[13px] font-bold text-slate-500">{(product.rating || 5.0).toFixed(1)} ({product.reviewCount || 0})</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {product.status === 'Out of Stock' ? (
                                                            <button
                                                                disabled
                                                                className="flex items-center gap-2 bg-slate-300 text-white px-6 py-2.5 rounded-full text-[14px] font-bold cursor-not-allowed"
                                                            >
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg>
                                                                Out of Stock
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                                className="flex items-center gap-2 bg-[#118AB2] hover:bg-[#0b6b8a] text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-colors"
                                                            >
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                                                Add to cart
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                            className={`w-[42px] h-[42px] rounded-full border border-slate-200 flex items-center justify-center transition-colors cursor-pointer ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'bg-red-50 text-red-500 border-red-500' : 'bg-white text-slate-400 hover:border-red-500 hover:text-red-500'}`}
                                                        >
                                                            <svg className="pointer-events-none" width="18" height="18" fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                        </button>
                                                        <button className="w-[42px] h-[42px] rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#118AB2] hover:text-[#118AB2] transition-colors">
                                                            <svg className="pointer-events-none" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-8">
                                    <span className="text-6xl mb-4 grayscale opacity-50">😢</span>
                                    <h3 className="text-2xl font-black text-slate-700 mb-2 font-sans">No Toys Found</h3>
                                    <p className="text-slate-500 font-medium">Try adjusting your filters to find the perfect toy.</p>
                                    <button onClick={clearFilters} className="mt-6 text-[#118AB2] font-bold hover:underline">Clear all filters</button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden flex">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slide-in-right ml-auto">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <span className="text-xl font-black text-slate-800 font-sans">Filters</span>
                            <div className="flex items-center gap-4">
                                {(selectedCategories.length > 0 || selectedMaxPrice < 5000 || selectedAges.length > 0 || searchParams.get('search')) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-[14px] font-bold text-[#ff6b6b] hover:text-[#ff5252] hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto bg-[#F8F9FA]">
                            {/* Categories */}
                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                <h4 className="font-bold text-[#1A1A24] mb-4 uppercase tracking-wider text-xs">Categories</h4>
                                <ul className="space-y-3">
                                    {categoriesList.map(cat => {
                                        const isSelected = selectedCategories.includes(cat);
                                        return (
                                            <li
                                                key={cat}
                                                onClick={() => handleCategoryClick(cat)}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-[#E51A22] shadow-[0_2px_8px_rgba(229,26,34,0.3)] border-transparent' : 'bg-white border-2 border-gray-200 group-hover:border-[#E51A22]'}`}>
                                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={`font-semibold transition-colors text-sm ${isSelected ? 'text-[#1A1A24]' : 'text-gray-500 group-hover:text-[#1A1A24]'}`}>
                                                    {cat}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Age Groups */}
                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                <h4 className="font-bold text-[#1A1A24] mb-4 uppercase tracking-wider text-xs">Age Groups</h4>
                                <ul className="space-y-3">
                                    {ageList.map(age => {
                                        const isSelected = selectedAges.includes(age);
                                        return (
                                            <li
                                                key={age}
                                                onClick={() => handleAgeClick(age)}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-[#E51A22] shadow-[0_2px_8px_rgba(229,26,34,0.3)] border-transparent' : 'bg-white border-2 border-gray-200 group-hover:border-[#E51A22]'}`}>
                                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={`font-semibold transition-colors text-sm ${isSelected ? 'text-[#1A1A24]' : 'text-gray-500 group-hover:text-[#1A1A24]'}`}>
                                                    {age}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Price Range */}
                            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                <h4 className="font-bold text-[#1A1A24] mb-8 uppercase tracking-wider text-xs flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-[#E51A22] shadow-[0_2px_8px_rgba(229,26,34,0.15)] text-[12px]">₹</div>
                                    Price Range
                                </h4>
                                <div className="px-1">
                                    <div className="relative w-full mb-8 pt-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="50"
                                            value={selectedMaxPrice}
                                            onChange={handlePriceChange}
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
                                            style={{
                                                background: `linear-gradient(to right, #E51A22 0%, #E51A22 ${(selectedMaxPrice / 5000) * 100}%, #F3F4F6 ${(selectedMaxPrice / 5000) * 100}%, #F3F4F6 100%)`,
                                            }}
                                        />
                                        <style>{`
                                            input[type=range]::-webkit-slider-thumb {
                                                -webkit-appearance: none;
                                                appearance: none;
                                                width: 20px;
                                                height: 20px;
                                                border-radius: 50%;
                                                background: #E51A22;
                                                border: 3px solid white;
                                                box-shadow: 0 2px 5px rgba(229, 26, 34, 0.4);
                                                cursor: pointer;
                                            }
                                            input[type=range]::-moz-range-thumb {
                                                width: 20px;
                                                height: 20px;
                                                border-radius: 50%;
                                                background: #E51A22;
                                                border: 3px solid white;
                                                box-shadow: 0 2px 5px rgba(229, 26, 34, 0.4);
                                                cursor: pointer;
                                            }
                                        `}</style>
                                    </div>

                                    <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                                        <div className="flex flex-col px-3 py-1">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Min</span>
                                            <span className="text-[12px] font-black text-gray-700">₹0</span>
                                        </div>
                                        <div className="w-[1px] h-6 bg-gray-200"></div>
                                        <div className="flex flex-col px-3 py-1 items-end">
                                            <span className="text-[9px] font-bold text-[#E51A22] uppercase tracking-widest mb-0.5">Max</span>
                                            <span className="text-[12px] font-black text-[#E51A22]">₹{selectedMaxPrice === 5000 ? '5000+' : selectedMaxPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10 relative">
                            <button
                                onClick={clearFilters}
                                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="flex-1 bg-[#E51A22] text-white py-3.5 rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-[0_4px_15px_rgba(229,26,34,0.3)]"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;

