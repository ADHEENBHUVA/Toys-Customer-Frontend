const fs = require('fs');

const dashboardCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Shield, Leaf, Heart as HeartIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    const [trendingProducts, setTrendingProducts] = useState([]);
    
    // Testimonials
    const testimonials = [
        { name: 'Emily R.', location: 'Austin, TX', text: 'The quality is amazing! Everything feels so safe and thoughtfully made. My baby absolutely loves the toys.', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Sophia M.', location: 'Denver, CO', text: 'Fast shipping, beautiful packaging, and excellent customer service. This is my go-to store for all baby essentials!', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Jessica L.', location: 'Portland, OR', text: 'I love that the products are eco-friendly and non-toxic. It gives me peace of mind as a mom.', avatar: 'https://i.pravatar.cc/150?img=9' }
    ];

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending\`);
                if (res.ok) {
                    const data = await res.json();
                    setTrendingProducts(data.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };
        fetchTrendingProducts();
    }, []);

    const categories = [
        { name: 'Nursery', count: '20+', img: '/cat-nursery.jpg', bg: 'bg-[#fef4ea]' },
        { name: 'Toys & Games', count: '35+', img: '/cat-toys.jpg', bg: 'bg-[#fff5e1]' },
        { name: 'Feeding', count: '25+', img: '/cat-feeding.jpg', bg: 'bg-[#edf5ec]' },
        { name: 'Baby Gear', count: '30+', img: '/cat-gear.jpg', bg: 'bg-[#f5efeb]' },
        { name: 'Clothing', count: '40+', img: '/cat-clothing.jpg', bg: 'bg-[#fcedeb]' },
        { name: 'Bath & Care', count: '25+', img: '/cat-bath.jpg', bg: 'bg-[#edf5f0]' }
    ];

    const StarRating = ({ rating = 5, count }) => (
        <div className="flex items-center gap-1.5 mt-1">
            <div className="flex text-[#e8b960] text-[12px]">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= rating ? '★' : '☆'}</span>
                ))}
            </div>
            {count && <span className="text-[11px] text-[#9ca3af]">({count})</span>}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-[#fcfaf7] font-sans text-[#4a3e3d]">
            
            {/* Top Bar */}
            <div className="w-full bg-[#fcfaf7] border-b border-[#f3eee7] py-2.5 px-4 flex flex-col md:flex-row justify-between items-center text-[12px] font-medium text-[#8b7e7c] gap-2 md:gap-0 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-[#d69f7e]">🚚</span> Free shipping on orders over $75
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#d69f7e]">♥</span> Safe. Natural. Made for little ones.
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#d69f7e]">⟲</span> Easy returns within 30 days
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                <div className="w-full bg-gradient-to-br from-[#fcf3ea] via-[#f7e6d8] to-[#f0ccb6] rounded-[2.5rem] relative overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row items-center p-8 md:p-16">
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 text-[#e9b896] opacity-50 text-4xl">✦</div>
                    <div className="absolute top-20 left-[40%] text-[#e9b896] opacity-50 text-2xl">✦</div>
                    
                    {/* Left Content */}
                    <div className="w-full md:w-1/2 relative z-10 pt-10 md:pt-0">
                        <h1 className="text-5xl md:text-[70px] leading-[1.1] font-serif text-[#3d3130] mb-6 tracking-tight">
                            Little Things, <br/> Big Joys
                            <span className="inline-block ml-4 text-[#e6a27a]">♡</span>
                        </h1>
                        <p className="text-[18px] md:text-[20px] text-[#5e504f] mb-10 max-w-[400px] leading-relaxed">
                            Thoughtfully chosen essentials for every precious moment.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link to="/products">
                                <button className="bg-[#e6a27a] hover:bg-[#d99268] text-white font-medium text-[15px] px-8 py-3.5 rounded-full flex items-center gap-3 transition-colors shadow-sm">
                                    Shop Now <span className="bg-white text-[#e6a27a] rounded-full w-6 h-6 flex items-center justify-center text-sm">→</span>
                                </button>
                            </Link>
                            <Link to="/products">
                                <button className="bg-transparent border border-[#3d3130] hover:bg-[#3d3130] hover:text-white text-[#3d3130] font-medium text-[15px] px-8 py-3.5 rounded-full transition-colors">
                                    Explore Collection
                                </button>
                            </Link>
                        </div>
                        
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-6 md:gap-10 text-[12px] font-medium text-[#5e504f]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#93b38c]">
                                    <Leaf className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Safe Materials</span>
                                    <span className="text-[11px] text-[#8b7e7c]">Non-toxic & baby-safe</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e6a27a]">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Trusted Quality</span>
                                    <span className="text-[11px] text-[#8b7e7c]">Tested & certified</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#e8b960]">
                                    <HeartIcon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130]">Made with Love</span>
                                    <span className="text-[11px] text-[#8b7e7c]">For happy little ones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Image */}
                    <div className="w-full md:w-1/2 relative h-full flex justify-end items-end mt-12 md:mt-0 z-0">
                        <div className="absolute top-10 right-10 bg-[#fdfaf7] rounded-full w-[130px] h-[130px] flex flex-col items-center justify-center shadow-sm z-20">
                            <span className="text-[12px] font-medium text-[#8b7e7c]">For Every</span>
                            <span className="text-[18px] font-serif text-[#3d3130] leading-tight text-center">Little<br/>Adventure</span>
                            <span className="text-[#e6a27a] text-[10px] mt-1">♡</span>
                        </div>
                        {/* Replace with actual baby image in final */}
                        <div className="w-[90%] md:w-[120%] h-auto -mb-8 -mr-8 relative z-10">
                            <img src="/baby-hero-new.png" alt="Baby" onError={(e)=>{e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'}} className="w-full h-full object-cover rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-[1400px] mx-auto py-16 px-4 md:px-6 text-center">
                <div className="mb-2 text-[#e6a27a]">♡</div>
                <h2 className="text-[32px] font-serif text-[#3d3130] mb-2">Shop by Categories</h2>
                <p className="text-[#8b7e7c] text-[15px] mb-12">Everything your little one needs, all in one place.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <Link to={\`/products?search=\${encodeURIComponent(cat.name)}\`} key={idx} className="group flex flex-col">
                            <div className={\`\${cat.bg} rounded-[2rem] aspect-square mb-4 p-6 flex items-center justify-center transition-transform group-hover:-translate-y-2\`}>
                                {/* Placeholder for category image */}
                                <div className="w-24 h-24 bg-white/50 rounded-full shadow-sm flex items-center justify-center text-3xl">
                                    {idx===0?'🛏️':idx===1?'🧸':idx===2?'🍼':idx===3?'🚼':idx===4?'👕':'🛁'}
                                </div>
                            </div>
                            <div className="flex justify-between items-end px-2">
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-[#3d3130] text-[15px]">{cat.name}</span>
                                    <span className="text-[12px] text-[#8b7e7c]">{cat.count} products</span>
                                </div>
                                <span className="w-6 h-6 rounded-full border border-[#e5dfd9] flex items-center justify-center text-[#8b7e7c] text-xs group-hover:bg-[#e6a27a] group-hover:text-white group-hover:border-transparent transition-colors">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-[1400px] mx-auto py-16 px-4 md:px-6 text-center">
                <div className="mb-2 text-[#e6a27a]">♡</div>
                <h2 className="text-[32px] font-serif text-[#3d3130] mb-12">Featured Products</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trendingProducts.map((product, idx) => (
                        <div key={product._id} className="flex flex-col text-left group">
                            <div className="bg-[#fdf8f4] rounded-[2rem] aspect-square mb-5 relative p-6 flex items-center justify-center transition-all group-hover:shadow-md">
                                {idx === 0 && <span className="absolute top-4 left-4 bg-[#e6a27a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Best Seller</span>}
                                {idx === 1 && <span className="absolute top-4 left-4 bg-[#93b38c] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">New</span>}
                                {idx === 3 && <span className="absolute top-4 left-4 bg-[#e6a27a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">-15%</span>}
                                
                                <Link to={\`/product/\${product._id}\`} className="absolute inset-0 z-10 flex items-center justify-center p-8">
                                    {product.thumbnailImage || product.images?.length > 0 ? (
                                        <img src={product.thumbnailImage || product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <div className="text-5xl opacity-50">🧸</div>
                                    )}
                                </Link>
                            </div>
                            
                            <Link to={\`/product/\${product._id}\`} className="font-bold text-[#3d3130] text-[16px] mb-1 hover:text-[#e6a27a] transition-colors">{product.name}</Link>
                            
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#3d3130] text-[15px]">\${\`\${(product.price || 0).toFixed(2)}\`}</span>
                                    {product.compareAtPrice > (product.price || 0) && (
                                        <span className="text-[13px] text-[#b3a8a6] line-through">\${\`\${(product.compareAtPrice || 0).toFixed(2)}\`}</span>
                                    )}
                                </div>
                                <button onClick={() => addToCart(product, 1)} className="text-[#8b7e7c] hover:text-[#e6a27a] transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <StarRating rating={product.rating || 5} count={Math.floor(Math.random() * 100) + 10} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Parents Choose */}
            <div className="max-w-[1400px] mx-auto py-16 px-4 md:px-6">
                <div className="bg-[#f4f6f1] rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden">
                    <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <h2 className="text-[32px] md:text-[40px] font-serif text-[#3d3130] mb-2 leading-tight">Why Parents Choose Little Joys</h2>
                        <p className="text-[#8b7e7c] text-[15px] mb-10">Because your baby deserves the very best.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Safe & Non-Toxic</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">We use only non-toxic, BPA-free, and baby-safe materials.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Premium Quality</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Durable, long-lasting products tested to the highest standards.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#e6a27a]">
                                    <HeartIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Gentle on Baby</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Designed with care for your baby's sensitive skin and comfort.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-[#93b38c]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 16V12"/><path d="M12 8H12.01"/></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#3d3130] text-[15px] mb-1">Sustainable Choice</h4>
                                    <p className="text-[#8b7e7c] text-[13px] leading-relaxed">Eco-friendly materials and packaging for a better tomorrow.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 relative min-h-[300px]">
                        <div className="absolute top-8 right-8 bg-[#fdfaf7] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] w-[120px] h-[110px] flex flex-col items-center justify-center shadow-sm z-20 transform rotate-12">
                            <span className="text-[14px] font-serif text-[#3d3130] leading-tight text-center">Quality<br/>You Can<br/>Trust</span>
                            <span className="text-[#e6a27a] text-[10px] mt-1">♡</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80" alt="Baby Basket" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Loved by Parents */}
            <div className="max-w-[1400px] mx-auto py-16 px-4 md:px-6 text-center">
                <div className="mb-2 text-[#e6a27a]">♡</div>
                <h2 className="text-[32px] font-serif text-[#3d3130] mb-2">Loved by Parents</h2>
                <p className="text-[#8b7e7c] text-[15px] mb-12">Real stories from our happy Little Joys family.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((test, idx) => (
                        <div key={idx} className="bg-white border border-[#f3eee7] rounded-[2rem] p-8 text-left shadow-sm">
                            <span className="text-[40px] font-serif text-[#e6a27a] leading-none block mb-2">""</span>
                            <p className="text-[#5e504f] text-[14px] leading-relaxed mb-6 min-h-[80px]">
                                {test.text}
                            </p>
                            <StarRating rating={5} />
                            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f3eee7]">
                                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#3d3130] text-[14px]">{test.name}</span>
                                    <span className="text-[11px] text-[#8b7e7c]">{test.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter */}
            <div className="max-w-[1400px] mx-auto py-16 px-4 md:px-6">
                <div className="bg-[#fef4ea] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                    <div className="w-full md:w-1/2 relative z-10 mb-8 md:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#e6a27a]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </div>
                            <h3 className="text-[24px] font-serif text-[#3d3130]">Join Our Little Joys Family</h3>
                        </div>
                        <p className="text-[#8b7e7c] text-[14px] mb-8 max-w-[350px]">
                            Get special offers, new arrivals, and parenting tips straight to your inbox.
                        </p>
                        
                        <div className="flex w-full max-w-[400px] bg-white rounded-full p-1.5 shadow-sm">
                            <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-4 py-2 text-[14px] text-[#3d3130] outline-none" />
                            <button className="bg-[#93b38c] hover:bg-[#7a9a73] text-white font-medium text-[14px] px-6 py-2.5 rounded-full transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    
                    {/* Decorative Clouds/Sun */}
                    <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-50 pointer-events-none">
                        {/* CSS drawn sun/clouds to match aesthetic */}
                        <div className="absolute right-10 bottom-10 w-24 h-24 bg-[#f8d070] rounded-full z-10"></div>
                        <div className="absolute right-4 bottom-8 w-32 h-16 bg-[#eaf2e8] rounded-full z-20"></div>
                        <div className="absolute right-24 bottom-12 w-20 h-20 bg-[#eaf2e8] rounded-full z-20"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
`;

fs.writeFileSync('d:/Toys Website/Customer Frontend/src/pages/Dashboard.jsx', dashboardCode);

console.log('Dashboard Replaced');
