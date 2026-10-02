import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';

const Waitlist = () => {
    const { waitlistItems, toggleWaitlist, addToCart } = useCart();

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-12">
            <h1 className="text-3xl font-black text-[#2e4053] mb-8 font-['Outfit'] font-serif">My Waitlist</h1>

            {(!waitlistItems || waitlistItems.length === 0) ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl">
                    <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-6">
                        <svg width="40" height="40" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4 font-serif">Your waitlist is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your waitlist yet.</p>
                    <Link to="/products" className="inline-block bg-[#1282a2] hover:bg-[#0f6c87] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-[#1282a2]/30">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {waitlistItems.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group relative">
                            {/* Product Image */}
                            <Link to={`/product/${product._id}`} className="block h-64 overflow-hidden bg-slate-50 relative p-6">
                                <img 
                                    src={product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || '/placeholder.png')} 
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                />
                            </Link>

                            {/* Remove from Waitlist Button */}
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-red-50 transition-colors z-[9999] pointer-events-auto"
                                title="Remove from Waitlist"
                            >
                                <svg className="pointer-events-none" width="20" height="20" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </button>

                            {/* Product Info */}
                            <div className="p-5">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="font-bold text-[16px] text-slate-800 leading-tight mb-2 hover:text-[#1282a2] transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl font-black text-[#22c55e]">₹{product.price.toFixed(2)}</span>
                                    {product.compareAtPrice > product.price && (
                                        <span className="text-sm font-bold text-slate-400 line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                                    className="w-full py-3 bg-[#1282a2] hover:bg-[#0f6c87] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#1282a2]/20 pointer-events-auto"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Waitlist;
