import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';

const ageList = ['0-6 Months', '6-12 Months', '1-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years'];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart, waitlistItems, toggleWaitlist, websiteSettings } = useCart();

    // Read from URL
    const selectedCategories = searchParams.getAll('category');
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
    if (filterParamTitle === 'sale') {
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

    return (
        <div className="bg-white min-h-screen pt-6 pb-20 font-['Nunito']">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="text-sm font-bold text-slate-800 mb-8 mt-4 flex items-center gap-2">
                    <Link to="/" className="hover:text-[#118AB2]">Home</Link>
                    <span className="text-slate-400">/</span>
                    <span className="text-[#118AB2]">Products</span>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="hidden lg:flex flex-col w-[280px] flex-shrink-0 gap-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                        {/* Filters Header (Clear All) */}
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[20px] font-black text-slate-800 font-['Nunito'] font-serif">Filters</h2>
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
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[18px] font-black text-slate-800 font-['Nunito'] mb-5 flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#118AB2]"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
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
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-[#118AB2] border-transparent' : 'bg-white border-2 border-slate-200 group-hover:border-[#118AB2]'}`}>
                                                {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                                            </div>
                                            <span className={`font-bold transition-colors text-[15px] ${isSelected ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                                {cat}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Box 2: Filter by price */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[18px] font-black text-slate-800 font-['Nunito'] mb-6 flex items-center gap-2">
                                <span className="text-[#118AB2] text-[20px] font-extrabold flex items-center mt-[-2px]">₹</span>
                                Price Range
                            </h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="50"
                                    value={selectedMaxPrice}
                                    onChange={handlePriceChange}
                                    className="w-full h-2 bg-slate-100 rounded-[2rem] appearance-none cursor-pointer accent-[#118AB2]"
                                />
                                <div className="flex justify-between mt-4">
                                    <span className="text-[13px] font-extrabold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">₹0</span>
                                    <span className="text-[13px] font-extrabold text-[#118AB2] bg-[#118AB2]/10 px-3 py-1 rounded-full">Up to ₹{selectedMaxPrice === 5000 ? '5000+' : selectedMaxPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Box 3: Popular products */}
                        <div className="bg-gradient-to-br from-[#fcfaf7] to-white p-6 rounded-[2rem] border border-[#f3eee7] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f7e6d8] to-transparent opacity-30 rounded-bl-full pointer-events-none"></div>
                            
                            <h3 className="text-[18px] font-bold text-[#3d3130] font-serif mb-6 relative z-10 flex items-center gap-2">
                                <span className="text-[#e6a27a] text-[16px]">★</span> Top Picks
                            </h3>
                            
                            <div className="space-y-3 relative z-10">
                                {[...allProducts]
                                    .sort((a, b) => {
                                        if (a.bestSeller && !b.bestSeller) return -1;
                                        if (!a.bestSeller && b.bestSeller) return 1;
                                        return (b.reviewCount || 0) - (a.reviewCount || 0);
                                    })
                                    .slice(0, 3)
                                    .map((prod) => (
                                        <Link to={`/product/${prod._id}`} key={prod._id} className="flex gap-4 group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(230,162,122,0.15)] hover:-translate-y-1">
                                            <div className="w-[72px] h-[72px] bg-[#fcfaf7] rounded-[1.25rem] overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group-hover:bg-white transition-colors border border-[#f3eee7]">
                                                <img src={prod.thumbnailImage || (prod.images && prod.images[0])} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1">
                                                <h4 className="text-[14px] font-bold text-[#3d3130] leading-[1.3] mb-1 line-clamp-2 font-['Nunito'] tracking-tight group-hover:text-[#e6a27a] transition-colors">{prod.name}</h4>
                                                
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[15px] font-black text-[#e6a27a]">₹{prod.price.toFixed(2)}</span>
                                                    {prod.originalPrice > prod.price && (
                                                        <span className="text-[11px] text-[#b3a8a6] line-through font-medium">₹{prod.originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="flex text-[#e8b960] text-[10px]">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <span key={s}>{s <= Math.round(prod.rating || 5) ? '★' : '☆'}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight font-['Nunito'] font-serif">
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
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-6"}>
                                    {displayedProducts.map((product) => (
                                        viewMode === 'grid' ? (
                                            // Grid View Card
                                            <div key={product._id} className="flex flex-col group bg-white border-2 border-slate-200 shadow-sm rounded-3xl p-4 hover:shadow-[0_20px_50px_-12px_rgba(17,138,178,0.2)] hover:border-[#118AB2]/40 transition-all duration-500 hover:-translate-y-1">
                                                {/* Image Container */}
                                                <div className="relative mb-4 bg-slate-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-slate-100">
                                                    {/* Sale Badge */}
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="absolute top-4 left-4 bg-[#e8b960] text-white text-[10px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider z-20 shadow-sm">
                                                            {(product.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage' 
                                                                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                                                                : `Save ₹${Math.round(product.originalPrice - product.price)}`}
                                                        </span>
                                                    )}

                                                    {/* Product Image */}
                                                    <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center">
                                                        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                                                            <div className="absolute top-4 right-4 bg-orange-100 border border-orange-200 text-orange-600 px-3 py-1 rounded-full text-[11px] font-black tracking-widest shadow-sm z-20 uppercase flex items-center gap-1 animate-pulse">
                                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                                                Only {product.stockQuantity} Left!
                                                            </div>
                                                        )}
                                                        <ProductCardImageCarousel 
                                                            images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])} 
                                                            productName={product.name} 
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex flex-col flex-1 px-1">
                                                    <Link to={`/product/${product._id}`} className="hover:text-[#118AB2] mb-1.5 transition-colors">
                                                        <h3 className="font-bold text-[#3d3130] text-[17.5px] leading-tight line-clamp-2 font-['Nunito'] tracking-tight">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex text-[#fbdf14] text-[12px] tracking-widest">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <span key={s}>{s <= Math.round(product.rating || 5) ? '★' : '☆'}</span>
                                                            ))}
                                                        </div>
                                                        <span className="text-[12px] font-bold text-slate-500">{(product.rating || 5.0).toFixed(1)} ({product.reviewCount || 0})</span>
                                                    </div>

                                                    {/* Price and Action Buttons Row */}
                                                    <div className="flex items-center justify-between mt-auto pt-3">
                                                        <div className="flex flex-col">
                                                            {product.status === 'Out of Stock' ? (
                                                                <span className="font-black text-slate-400 text-[16px] leading-none">Out of Stock</span>
                                                            ) : (
                                                                <>
                                                                    {product.originalPrice > (product.price || 0) && (
                                                                        <span className="text-[12px] text-slate-400 font-bold line-through mb-[-4px]">₹{(product.originalPrice || 0).toFixed(2)}</span>
                                                                    )}
                                                                    <span className="font-black text-[#22c55e] text-[20px] leading-none">₹{(product.price || 0).toFixed(2)}</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2.5">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border hover:scale-110 ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                                                            >
                                                                <svg width="18" height="18" fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                            </button>
                                                            {product.status === 'Out of Stock' ? (
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="w-10 h-10 bg-slate-300 text-white rounded-full flex items-center justify-center cursor-not-allowed shadow-sm"
                                                                    title="Out of Stock"
                                                                >
                                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                                    className="w-10 h-10 bg-[#118AB2] hover:bg-[#0f7a9e] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#118AB2]/30 hover:shadow-lg hover:shadow-[#118AB2]/40 hover:scale-110"
                                                                >
                                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // List View Card
                                            <div key={product._id} className="flex flex-col sm:flex-row gap-8 bg-transparent">
                                                {/* Image side */}
                                                <div className="relative w-full sm:w-[280px] h-[280px] border border-slate-200 rounded-3xl bg-white p-4 flex items-center justify-center flex-shrink-0 group">
                                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                        {product.originalPrice > product.price && (
                                                            <span className="bg-[#e8b960] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider w-max shadow-sm">
                                                                {(product.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage' 
                                                                    ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                                                                    : `Save ₹${Math.round(product.originalPrice - product.price)}`}
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
                                                        <h3 className="font-black text-[18px] text-slate-800 leading-tight mb-3 hover:text-[#118AB2] transition-colors font-['Nunito']">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div className="text-[14px] text-slate-500 leading-relaxed mb-4 max-w-2xl font-semibold line-clamp-2">
                                                        <p>{product.shortDescription || (product.description?.replace(/<[^>]+>/g, ' ')?.replace(product.name, '')?.trim()) || "No description available"}</p>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        {product.status === 'Out of Stock' ? (
                                                            <span className="text-[16px] font-black text-slate-400">Out of Stock</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-[16px] font-black text-[#22c55e]">₹{product.price.toFixed(2)}</span>
                                                                {product.originalPrice > product.price && (
                                                                    <span className="text-[14px] font-bold text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
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
                                    <h3 className="text-2xl font-black text-slate-700 mb-2 font-['Nunito']">No Toys Found</h3>
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
                            <span className="text-xl font-black text-slate-800 font-['Nunito']">Filters</span>
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

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="mb-8">
                                <h4 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Categories</h4>
                                <ul className="space-y-3">
                                    {categoriesList.map(cat => {
                                        const isSelected = selectedCategories.includes(cat);
                                        return (
                                            <li
                                                key={cat}
                                                onClick={() => handleCategoryClick(cat)}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#1D4ED8] bg-[#1D4ED8]' : 'border-slate-200 group-hover:border-[#1D4ED8]'}`}>
                                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={`font-semibold transition-colors text-sm ${isSelected ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                                    {cat}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="mb-8">
                                <h4 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Age Groups</h4>
                                <ul className="space-y-3">
                                    {ageList.map(age => {
                                        const isSelected = selectedAges.includes(age);
                                        return (
                                            <li
                                                key={age}
                                                onClick={() => handleAgeClick(age)}
                                                className="flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#1D4ED8] bg-[#1D4ED8]' : 'border-slate-200 group-hover:border-[#1D4ED8]'}`}>
                                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={`font-semibold transition-colors text-sm ${isSelected ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                                    {age}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="mb-8">
                                <h4 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Price Range</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={selectedMaxPrice}
                                    onChange={handlePriceChange}
                                    className="w-full accent-[#1D4ED8]"
                                />
                                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                                    <span>₹0</span>
                                    <span className="text-[#1D4ED8]">Up to ₹{selectedMaxPrice === 5000 ? '5000+' : selectedMaxPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button
                                onClick={clearFilters}
                                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
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

