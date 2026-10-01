import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const categoriesList = ['Action Figures', 'Dolls & Playsets', 'Educational', 'Puzzles', 'Board Games'];
const ageList = ['0-18 months', '18-36 months', '3-5 years', '5-7 years', '7-9 years', '9-12 years', '12+ years'];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    
    // Read from URL
    const selectedCategories = searchParams.getAll('category');
    const selectedAges = searchParams.getAll('age');
    const maxPriceStr = searchParams.get('maxPrice');
    const selectedMaxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : 5000;
    const sortOrder = searchParams.get('sort') || 'recommended';

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products`);
                const data = await res.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = [...allProducts];

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

        // Apply Sorting
        if (sortOrder === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

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
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    let displayTitle = 'All Products';
    if (selectedCategories.length === 1 && selectedAges.length === 0) {
        displayTitle = selectedCategories[0];
    } else if (selectedAges.length === 1 && selectedCategories.length === 0) {
        displayTitle = selectedAges[0];
    } else if (selectedCategories.length > 0 || selectedAges.length > 0) {
        displayTitle = 'Filtered Results';
    }

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
                    <div className="hidden lg:flex flex-col w-[280px] flex-shrink-0 gap-6">
                        
                        {/* Box 1: Product categories */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-[17px] font-black text-slate-800 font-['Nunito'] mb-4">Product categories</h3>
                            <ul className="space-y-3">
                                {categoriesList.map(cat => {
                                    const isSelected = selectedCategories.includes(cat);
                                    return (
                                        <li 
                                            key={cat} 
                                            onClick={() => handleCategoryClick(cat)}
                                            className="flex items-center gap-2 group cursor-pointer"
                                        >
                                            <span className={`text-slate-400 font-bold transition-colors ${isSelected ? 'text-[#118AB2]' : 'group-hover:text-[#118AB2]'}`}>+</span>
                                            <span className={`font-bold transition-colors text-[14px] ${isSelected ? 'text-[#118AB2]' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                                {cat}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Box 2: Filter by price */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-[17px] font-black text-slate-800 font-['Nunito'] mb-6">Filter by price</h3>
                            <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="100"
                                value={selectedMaxPrice}
                                onChange={handlePriceChange}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#118AB2]" 
                            />
                            <div className="flex justify-between mt-4 text-[13px] font-bold text-slate-500">
                                <span>₹0</span>
                                <span>₹{selectedMaxPrice === 5000 ? '5000+' : selectedMaxPrice}</span>
                            </div>
                            <button 
                                className="mt-6 bg-[#118AB2] hover:bg-[#0b6b8a] text-white px-6 py-2 rounded-xl text-[14px] font-bold w-full transition-colors"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Box 3: Popular products */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-[17px] font-black text-slate-800 font-['Nunito'] mb-5">Popular products</h3>
                            <div className="space-y-5">
                                {allProducts.slice(0, 3).map((prod) => (
                                    <div key={prod._id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                                            <img src={prod.thumbnailImage || (prod.images && prod.images[0])} alt={prod.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="text-[14px] font-bold text-slate-700 leading-tight mb-1 line-clamp-2">{prod.name}</h4>
                                            <span className="text-[14px] font-black text-slate-900">₹{prod.price.toFixed(2)}</span>
                                            <div className="flex text-[#fbdf14] text-[10px] mt-0.5">
                                                ★★★★★
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        
                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight font-['Nunito']">
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
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`${viewMode === 'list' ? 'text-[#118AB2]' : 'text-slate-300 hover:text-slate-500'} transition-colors`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
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
                        ) : filteredProducts.length > 0 ? (
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                                {filteredProducts.map((product) => (
                                    viewMode === 'grid' ? (
                                        // Grid View Card
                                        <div key={product._id} className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl transition-all duration-300 group flex flex-col relative">
                                            <div className="absolute top-5 left-5 z-10">
                                                {product.compareAtPrice > product.price && (
                                                    <span className="bg-[#ff6b6b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        SALE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute top-5 right-2 md:right-5 z-[9999] flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-auto">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                    className={`w-9 h-9 shadow-md rounded-full flex items-center justify-center transition-colors border border-slate-100 cursor-pointer pointer-events-auto ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 hover:text-red-500'}`}
                                                >
                                                    <svg className="pointer-events-none" width="18" height="18" fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                    className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-[#118AB2] transition-colors border border-slate-100 cursor-pointer pointer-events-auto"
                                                >
                                                    <svg className="pointer-events-none" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                                </button>
                                            </div>
                                            
                                            <Link to={`/product/${product._id}`} className="block h-52 mb-4 flex items-center justify-center relative z-0">
                                                <img src={product.thumbnailImage || (product.images && product.images[0])} alt={product.name} className="w-[90%] h-[90%] object-contain group-hover:scale-110 transition-transform duration-500" />
                                            </Link>
                                            
                                            <div className="flex-1 flex flex-col">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-bold text-[15px] text-slate-700 leading-tight mb-2 group-hover:text-[#118AB2] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                
                                                <div className="mt-auto flex items-baseline gap-2 mb-2">
                                                    <span className="text-[15px] font-black text-[#22c55e]">₹{product.price.toFixed(2)}</span>
                                                    {product.compareAtPrice > product.price && (
                                                        <span className="text-[13px] font-bold text-slate-400 line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex text-[#fbdf14] text-[12px] tracking-widest">
                                                    ★★★★★
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // List View Card
                                        <div key={product._id} className="flex flex-col sm:flex-row gap-8 bg-transparent">
                                            {/* Image side */}
                                            <div className="relative w-full sm:w-[280px] h-[280px] border border-slate-200 rounded-3xl bg-white p-4 flex items-center justify-center flex-shrink-0 group">
                                                <div className="absolute top-4 left-4 z-10">
                                                    {product.compareAtPrice > product.price && (
                                                        <span className="bg-[#ff6b6b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            SALE
                                                        </span>
                                                    )}
                                                </div>
                                                <Link to={`/product/${product._id}`} className="block w-full h-full flex items-center justify-center">
                                                    <img src={product.thumbnailImage || (product.images && product.images[0])} alt={product.name} className="w-[90%] h-[90%] object-contain group-hover:scale-105 transition-transform duration-500" />
                                                </Link>
                                            </div>
                                            
                                            {/* Content side */}
                                            <div className="flex-1 flex flex-col justify-center py-2">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-black text-[18px] text-slate-800 leading-tight mb-3 hover:text-[#118AB2] transition-colors font-['Nunito']">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                
                                                <p className="text-[14px] text-slate-500 leading-relaxed mb-4 max-w-2xl font-semibold">
                                                    {product.description ? (product.description.length > 150 ? product.description.substring(0, 150) + '...' : product.description) : "Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus"}
                                                </p>
                                                
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <span className="text-[16px] font-black text-[#22c55e]">₹{product.price.toFixed(2)}</span>
                                                    {product.compareAtPrice > product.price && (
                                                        <span className="text-[14px] font-bold text-slate-400 line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex text-[#fbdf14] text-[13px] tracking-widest mb-6">
                                                    ★★★★★
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                        className="flex items-center gap-2 bg-[#118AB2] hover:bg-[#0b6b8a] text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-colors"
                                                    >
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                                        Add to cart
                                                    </button>
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
                        {/* Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#118AB2] transition-colors">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-[#118AB2] text-white font-bold flex items-center justify-center">1</button>
                                <button className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">2</button>
                                <button className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">3</button>
                                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#118AB2] transition-colors">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
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
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
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
