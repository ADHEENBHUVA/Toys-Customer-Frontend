import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categoriesList = ['Action Figures', 'Dolls & Playsets', 'Educational', 'Puzzles', 'Board Games'];
const ageList = ['0-18 months', '18-36 months', '3-5 years', '5-7 years', '7-9 years', '9-12 years', '12+ years'];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    
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
        <div className="bg-slate-50/50 min-h-screen pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] mb-2 md:mb-3">
                            {displayTitle}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm md:text-lg">
                            Explore our magical collection of premium toys.
                        </p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12v2m0 4v2m0 4v2m-6-8v2m0 4v2m12-8v2m0 4v2M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            Filters
                        </button>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="hidden md:inline text-sm font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
                            <select 
                                value={sortOrder}
                                onChange={handleSortChange}
                                className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 md:px-4 py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all shadow-sm"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Filters Sidebar (Desktop) */}
                    <div className="hidden lg:block w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.03)] border border-slate-100 sticky top-28">
                            <h3 className="text-xl font-black text-slate-800 font-['Nunito'] mb-6">Filters</h3>
                            
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
                            
                            <button 
                                onClick={clearFilters}
                                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64 w-full">
                                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1D4ED8] rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <div key={product._id} className="relative bg-white border border-slate-100/50 p-5 rounded-[2.5rem] shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-2 cursor-pointer">
                                        <Link to={`/product/${product._id}`} className="block h-56 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem] mb-5 flex items-center justify-center relative overflow-hidden">
                                            {product.newArrival && (
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-[10px] font-black px-3 py-1.5 rounded-full z-10 shadow-lg tracking-widest">
                                                    NEW
                                                </div>
                                            )}
                                            {product.thumbnailImage || (product.images && product.images.length > 0) ? (
                                                <img src={product.thumbnailImage || product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                            ) : (
                                                <span className="text-6xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md">
                                                    🧸
                                                </span>
                                            )}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                        <div className="px-2 flex-1 flex flex-col">
                                            <div className="mb-2 text-xs font-extrabold text-blue-400 uppercase tracking-widest truncate">
                                                {product.category}
                                            </div>
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="font-extrabold text-xl text-slate-800 leading-tight mb-3 group-hover:text-[#1D4ED8] transition-colors line-clamp-2 font-['Nunito']">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="mt-auto flex items-end justify-between mb-4">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
                                                    {product.compareAtPrice > product.price && (
                                                        <span className="text-sm font-bold text-slate-400 line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                                className="w-full bg-[#118AB2] text-white py-3 rounded-xl font-bold hover:bg-[#0b6b8a] transition-colors shadow-sm active:translate-y-1"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-white rounded-[2.5rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-8">
                                <span className="text-6xl mb-4 grayscale opacity-50">😢</span>
                                <h3 className="text-2xl font-black text-slate-700 mb-2 font-['Nunito']">No Toys Found</h3>
                                <p className="text-slate-500 font-medium">Try adjusting your filters to find the perfect toy.</p>
                                <button onClick={clearFilters} className="mt-6 text-[#1D4ED8] font-bold hover:underline">Clear all filters</button>
                            </div>
                        )}
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
