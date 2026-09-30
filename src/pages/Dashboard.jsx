import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
    const { addToCart } = useCart();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Featured');
    
    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Limit to 8 products for the exact grid look
                    setTrendingProducts(data.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };
        fetchTrendingProducts();
    }, []);

    const categories = [
        { name: 'Playmats', icon: '👶', color: 'bg-[#b6e4f4]' },
        { name: 'Wooden Toys', icon: '🚂', color: 'bg-[#b6e4f4]' },
        { name: 'Educational Toys', icon: '🧩', color: 'bg-[#b6e4f4]' },
        { name: 'Eco-friendly Toys', icon: '🐎', color: 'bg-[#b6e4f4]' },
        { name: 'Stuffed Toys', icon: '🧸', color: 'bg-[#b6e4f4]' }
    ];

    const CloudShape = ({ children }) => (
        <div className="relative w-24 h-24 md:w-32 md:h-24 flex items-center justify-center">
            {/* Simple cloud approximation using CSS */}
            <div className="absolute inset-0 bg-[#b6e4f4] rounded-[50px] z-0"></div>
            <div className="absolute top-[-10px] left-[15%] w-12 h-12 md:w-16 md:h-16 bg-[#b6e4f4] rounded-full z-0"></div>
            <div className="absolute top-[-20px] right-[20%] w-16 h-16 md:w-20 md:h-20 bg-[#b6e4f4] rounded-full z-0"></div>
            <div className="relative z-10 text-4xl">{children}</div>
        </div>
    );

    const StarRating = () => (
        <div className="flex text-[#ffdb2a] text-sm">
            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
        </div>
    );

    const ProductCard = ({ product }) => (
        <div className="flex flex-col group relative">
            <div className="relative mb-3 bg-[#f8fafc] rounded-2xl p-4 overflow-hidden aspect-square flex items-center justify-center">
                <span className="absolute top-3 left-3 bg-[#ff5e5e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    SALE
                </span>
                <button className="absolute top-3 right-3 text-slate-300 hover:text-[#ff5e5e] transition-colors z-10">
                    <Heart className="w-5 h-5" />
                </button>
                {product.thumbnailImage || (product.images && product.images.length > 0) ? (
                    <img 
                        src={product.thumbnailImage || product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <div className="text-6xl">🧸</div>
                )}
            </div>
            <Link to={`/product/${product._id}`} className="hover:text-blue-500">
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight line-clamp-2 font-['Nunito']">
                    {product.name}
                </h3>
            </Link>
            <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-[#2e7d32] text-sm">₹{product.price.toFixed(2)}</span>
                {product.compareAtPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                )}
            </div>
            <StarRating />
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-white font-['Outfit'] pb-20">
            {/* Hero Section */}
            <div className="w-full bg-[#ced4d8] pt-12 md:pt-20 px-4 md:px-16 lg:px-32 flex flex-col-reverse md:flex-row items-center justify-between min-h-[550px] relative overflow-hidden" style={{ fontFamily: '"Nunito", sans-serif' }}>
                <div className="flex-1 w-full flex justify-center md:justify-start items-end mt-8 md:mt-0 relative z-10 h-full">
                    {/* Placeholder for the Baby image exported from Figma */}
                    <div className="relative w-full max-w-[600px] h-[400px] md:h-[500px] flex items-end justify-center">
                        <img 
                            src="/baby-hero.png" 
                            alt="Baby playing with toy" 
                            className="object-contain object-bottom w-full h-full max-h-[500px]"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"; // Fallback image
                                e.target.className = "object-cover rounded-[3rem] w-[80%] h-[80%] shadow-2xl mb-10";
                            }}
                        />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left z-20 md:pl-10">
                    <h1 
                        className="text-[48px] md:text-[64px] lg:text-[76px] font-black text-[#1282a2] leading-[1.1] mb-6 tracking-tight"
                        style={{ textShadow: '4px 4px 0 #ffffff' }}
                    >
                        Play, learn, & grow!
                    </h1>
                    <p className="text-[#3b4e5f] text-[18px] md:text-[22px] font-medium mb-10 max-w-[450px] mx-auto md:mx-0 leading-relaxed font-['Outfit']">
                        Crafting smiles with every toy, made for learning, fun, and growth
                    </p>
                    <button className="bg-[#fceb20] hover:bg-[#ebd915] text-[#2e4053] font-bold text-[18px] px-10 py-3.5 rounded-full transition-colors">
                        Shop now
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Find the Perfect Toy */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Find the Perfect Toy</h2>
                    <p className="text-slate-500 text-sm">Your dream toy is here</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="flex flex-col items-center cursor-pointer group">
                            <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">
                                <CloudShape>{cat.icon}</CloudShape>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                        </div>
                    ))}
                </div>

                {/* Top Picks */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-6">Top picks for your little ones</h2>
                    <div className="flex justify-center gap-4">
                        {['Featured', 'Best sellers', 'New arrivals'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === tab ? 'bg-[#f8d5e0] text-[#c2185b]' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20">
                    {trendingProducts.slice(0, 8).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* Banners */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    <div className="bg-[#dcf4fa] rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[250px]">
                        <div className="absolute top-4 left-4 text-4xl opacity-50">🦆</div>
                        <div className="absolute bottom-4 right-4 text-4xl opacity-50">🪁</div>
                        <div className="bg-white rounded-[40px] px-8 py-6 z-10 shadow-sm border border-white/50 relative">
                            <h3 className="text-2xl font-black text-[#1BA4D9] font-['Nunito']">Discover the<br/>Joy of Play</h3>
                        </div>
                    </div>
                    <div className="bg-[#e4f6eb] rounded-3xl p-8 md:p-12 flex flex-row items-center relative overflow-hidden min-h-[250px]">
                        <div className="flex-1 z-10 pl-4">
                            <h3 className="text-2xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Eco - friendly Toys</h3>
                            <p className="text-slate-600 text-sm font-medium mb-6">Made with safe materials for continuous playtime.</p>
                            <button className="bg-[#ffdb2a] hover:bg-[#e6c627] text-slate-900 text-sm font-bold px-6 py-2 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5">
                                Shop Now
                            </button>
                        </div>
                        <div className="flex-1 flex justify-end items-end relative h-full">
                           <div className="text-[120px] absolute -bottom-10 right-0">👶🏽</div>
                        </div>
                    </div>
                </div>

                {/* Customer Loves */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Customer Loves</h2>
                    <p className="text-slate-500 text-sm">Popular product</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-24">
                    {trendingProducts.slice(0, 4).map(product => (
                        <ProductCard key={`love-${product._id}`} product={product} />
                    ))}
                </div>

                {/* Testimonials */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Hear from Other Happy Parents</h2>
                    <p className="text-slate-500 text-sm">Trusted by 10k+ parents worldwide</p>
                </div>
                
                <div className="relative mb-24 flex items-center">
                    <button className="absolute -left-4 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 border border-slate-100">
                        <ChevronLeft />
                    </button>
                    <div className="grid md:grid-cols-3 gap-6 w-full">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-[#fff1f2] p-8 rounded-3xl relative">
                                <div className="absolute top-4 right-4 text-[#ffccd5] text-4xl font-serif">"</div>
                                <StarRating />
                                <p className="text-slate-600 text-sm my-6 font-medium leading-relaxed">
                                    "Appifly Toys has absolutely the best quality toys! My kids love them, and I feel safe knowing they are non-toxic."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xl">👩</div>
                                    <span className="font-bold text-slate-800 text-sm">Sarah {i}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="absolute -right-4 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 border border-slate-100">
                        <ChevronRight />
                    </button>
                </div>

                {/* Recent Photoshoots */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#2c3e50] font-['Nunito'] mb-2">Recent photoshoots</h2>
                    <p className="text-slate-500 text-sm">Check gallery</p>
                </div>
            </div>

            {/* Edge to Edge Gallery */}
            <div className="w-full flex overflow-hidden h-[250px] md:h-[350px] mb-20 bg-slate-100">
                <div className="flex-1 flex items-center justify-center text-6xl bg-blue-50 border-r border-white">👶🧸</div>
                <div className="flex-1 flex items-center justify-center text-6xl bg-pink-50 border-r border-white">👧🧩</div>
                <div className="flex-1 flex items-center justify-center text-6xl bg-orange-50 border-r border-white">👦🚂</div>
                <div className="flex-1 flex items-center justify-center text-6xl bg-green-50">🧒🎨</div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border-2 border-[#1BA4D9] rounded-2xl p-6 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-[#1BA4D9] rounded-full flex items-center justify-center text-white mb-4">
                            <span className="text-2xl font-bold">24</span>
                        </div>
                        <h4 className="font-bold text-[#1BA4D9] mb-1">Customer care</h4>
                        <p className="text-slate-500 text-xs font-medium">We're here to help.</p>
                    </div>
                    <div className="border-2 border-[#f57c00] rounded-2xl p-6 flex flex-col items-center text-center bg-[#fff8f3]">
                        <div className="w-14 h-14 border-2 border-[#f57c00] rounded-full flex items-center justify-center text-[#f57c00] mb-4">
                            <span className="text-2xl">🚚</span>
                        </div>
                        <h4 className="font-bold text-[#f57c00] mb-1">Free shipping</h4>
                        <p className="text-slate-500 text-xs font-medium">For all orders over ₹500.</p>
                    </div>
                    <div className="border-2 border-[#4CAF50] rounded-2xl p-6 flex flex-col items-center text-center bg-[#f2fcf3]">
                        <div className="w-14 h-14 border-2 border-[#4CAF50] rounded-full flex items-center justify-center text-[#4CAF50] mb-4">
                            <span className="text-2xl">♻️</span>
                        </div>
                        <h4 className="font-bold text-[#4CAF50] mb-1">Return</h4>
                        <p className="text-slate-500 text-xs font-medium">Within 30 days.</p>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="text-center max-w-xl mx-auto mb-24 px-4">
                <h2 className="text-2xl font-black text-[#2c3e50] font-['Nunito'] mb-3">Newsletter</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Get 15% off your first order! Plus, be the first to know about new arrivals, sales & exclusive offers!
                </p>
                <div className="flex gap-2 justify-center max-w-md mx-auto">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:border-[#1BA4D9] text-sm"
                    />
                    <button className="bg-[#1BA4D9] hover:bg-[#158ebf] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors">
                        Join
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;
