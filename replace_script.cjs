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
                                    <span className="font-bold text-[#3d3130] text-[15px]">${(product.price || 0).toFixed(2)}</span>
                                    {product.compareAtPrice > (product.price || 0) && (
                                        <span className="text-[13px] text-[#b3a8a6] line-through">${(product.compareAtPrice || 0).toFixed(2)}</span>
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

const navbarCode = `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, getWaitlistCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(\`/products?search=\${encodeURIComponent(searchQuery)}\`);
            setSearchQuery('');
        }
    };

    return (
        <header className="w-full bg-[#fcfaf7] sticky top-0 z-50 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a]">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[20px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                        <span className="text-[10px] text-[#8b7e7c] tracking-wider">KIDS & BABY STORE</span>
                    </div>
                </Link>

                {/* Center Links */}
                <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#5e504f]">
                    <Link to="/" className="text-[#e6a27a] border-b-2 border-[#e6a27a] pb-1">Home</Link>
                    <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1">Shop <span className="text-[10px]">▼</span></Link>
                    <Link to="/products" className="hover:text-[#e6a27a] transition-colors flex items-center gap-1">Categories <span className="text-[10px]">▼</span></Link>
                    <Link to="/about" className="hover:text-[#e6a27a] transition-colors">About Us</Link>
                    <Link to="/blog" className="hover:text-[#e6a27a] transition-colors">Blog</Link>
                    <Link to="/contact" className="hover:text-[#e6a27a] transition-colors">Contact</Link>
                </nav>

                {/* Right Tools */}
                <div className="flex items-center gap-5 text-[#5e504f]">
                    <button className="hidden md:block hover:text-[#e6a27a] transition-colors">
                        <Search className="w-5 h-5" strokeWidth={2} />
                    </button>
                    <Link to="/login" className="hidden md:block hover:text-[#e6a27a] transition-colors">
                        <User className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/waitlist" className="hover:text-[#e6a27a] transition-colors">
                        <Heart className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <Link to="/cart" className="relative hover:text-[#e6a27a] transition-colors">
                        <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#e6a27a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <button className="lg:hidden text-[#3d3130]" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-[100] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <span className="text-[24px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#3d3130]"><X className="w-8 h-8"/></button>
                    </div>
                    <nav className="flex flex-col gap-6 text-[18px] font-medium text-[#5e504f]">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
`;
fs.writeFileSync('d:/Toys Website/Customer Frontend/src/components/Navbar.jsx', navbarCode);

const footerCode = `import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-[#fcfaf7] pt-16 pb-8 border-t border-[#f3eee7] font-sans text-[#5e504f]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a]">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[18px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                                <span className="text-[9px] text-[#8b7e7c] tracking-wider">KIDS & BABY STORE</span>
                            </div>
                        </div>
                        <p className="text-[13px] leading-relaxed mb-6">
                            Thoughtfully chosen baby and kids products for every little adventure.
                        </p>
                        <div className="flex gap-4 text-[#3d3130]">
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
                        </div>
                    </div>

                    {/* Links Cols */}
                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Shop</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">All Products</Link></li>
                            <li><Link to="/products?search=new" className="hover:text-[#e6a27a] transition-colors">New Arrivals</Link></li>
                            <li><Link to="/products?search=best" className="hover:text-[#e6a27a] transition-colors">Best Sellers</Link></li>
                            <li><Link to="/products?search=sale" className="hover:text-[#e6a27a] transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Categories</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Nursery</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Toys & Games</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Feeding</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Clothing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Customer Care</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/shipping" className="hover:text-[#e6a27a] transition-colors">Shipping & Delivery</Link></li>
                            <li><Link to="/returns" className="hover:text-[#e6a27a] transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/faq" className="hover:text-[#e6a27a] transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-[#e6a27a] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Contact Us</h4>
                        <ul className="space-y-4 text-[13px]">
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <span>(512) 555-0198</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <span>hello@littlejoys.com</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span>123 Happy Lane,<br/>Austin, TX 78701</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-[#f3eee7] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px]">
                    <p>© 2026 Little Joys. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-[#e6a27a] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#e6a27a] transition-colors">Terms of Service</Link>
                        <Link to="/refund" className="hover:text-[#e6a27a] transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
`;
fs.writeFileSync('d:/Toys Website/Customer Frontend/src/components/Footer.jsx', footerCode);

const cssAddition = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap');
`;
let cssContent = fs.readFileSync('d:/Toys Website/Customer Frontend/src/index.css', 'utf8');
if (!cssContent.includes('Fraunces')) {
    fs.writeFileSync('d:/Toys Website/Customer Frontend/src/index.css', cssAddition + cssContent);
}

console.log('Done replacing components');
