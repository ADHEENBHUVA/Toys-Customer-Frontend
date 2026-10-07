import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(window.location.hash === '#reviews' ? 'reviews' : 'description');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const { addToCart, waitlistItems, toggleWaitlist } = useCart();

    const token = localStorage.getItem('token');
    const user = token ? true : false;

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, hasPurchased: false, hasReviewed: false });
    const [websiteSettings, setWebsiteSettings] = useState(null);
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setWebsiteSettings(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setProduct(data);
                    if (data.images && data.images.length > 0) {
                        setMainImage(data.images[0]);
                    } else if (data.thumbnailImage) {
                        setMainImage(data.thumbnailImage);
                    }
                } else {
                    setProduct(null); // Ensure product is null if not found
                }

                // Fetch related products (trending products as a fallback)
                try {
                    const relatedRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                    const relatedData = await relatedRes.json();
                    if (relatedRes.ok && Array.isArray(relatedData)) {
                        setRelatedProducts(relatedData.filter(p => p._id !== id).slice(0, 4));
                    }
                } catch (relatedErr) {
                    console.error('Error fetching related products:', relatedErr);
                }

                // Fetch review eligibility if logged in
                if (token) {
                    try {
                        const eligRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/${id}/review-eligibility`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const eligData = await eligRes.json();
                        if (eligRes.ok) {
                            setReviewEligibility(eligData);
                        }
                    } catch (eligErr) {
                        console.error('Error fetching review eligibility:', eligErr);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
        fetchProduct();
        if (window.location.hash === '#reviews') {
            setTimeout(() => {
                const element = document.getElementById('reviews');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            // Ideally addToCart supports quantity, but for now we call it once
            addToCart(product);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description || 'Check out this awesome toy!',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const allImages = [];
    if (product) {
        if (product.thumbnailImage) allImages.push(product.thumbnailImage);
        if (product.images) {
            product.images.forEach(img => {
                if (!allImages.includes(img)) allImages.push(img);
            });
        }
    }

    useEffect(() => {
        if (!product || allImages.length <= 1) return;
        const interval = setInterval(() => {
            setMainImage(prevImage => {
                const currentIndex = allImages.indexOf(prevImage);
                if (currentIndex === -1) return allImages[0];
                const nextIndex = (currentIndex + 1) % allImages.length;
                return allImages[nextIndex];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [product]);

    const handlePrevImage = () => {
        const currentIndex = allImages.indexOf(mainImage);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setMainImage(allImages[prevIndex]);
    };

    const handleNextImage = () => {
        const currentIndex = allImages.indexOf(mainImage);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % allImages.length;
        setMainImage(allImages[nextIndex]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#2eb3a6] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-4xl font-black text-slate-800 mb-4 font-['Nunito'] font-serif">Product Not Found</h1>
                <Link to="/products" className="text-[#2eb3a6] font-bold hover:underline">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-6 pb-20 font-['Nunito']">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="text-[13px] font-bold text-slate-800 mb-10 mt-4 flex items-center gap-2">
                    <Link to="/" className="hover:text-[#2eb3a6]">Home</Link>
                    <span className="text-slate-400">/</span>
                    <span className="text-[#2eb3a6]">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    {/* Left: Images */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative border border-slate-200 rounded-3xl p-4 md:p-6 flex items-center justify-center mb-4 h-[350px] md:h-[500px] group">
                            <button
                                onClick={() => setIsLightboxOpen(true)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#2eb3a6] transition-colors z-10"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                            </button>

                            {/* Left Arrow */}
                            {allImages.length > 1 && (
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#2eb3a6] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                            )}

                            {/* Right Arrow */}
                            {allImages.length > 1 && (
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#2eb3a6] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            )}

                            {mainImage && (
                                <img src={mainImage} alt={product.name} className="w-[85%] h-[85%] object-contain transition-transform duration-300" />
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 md:w-28 md:h-28 border ${mainImage === img ? 'border-[#2eb3a6]' : 'border-slate-200'} rounded-2xl p-2 flex-shrink-0 flex items-center justify-center`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        <h1 className="text-3xl font-black text-slate-800 mb-4 font-serif">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4 h-[32px]">
                            {product.status === 'Out of Stock' ? (
                                <span className="text-2xl font-black text-slate-400">Out of Stock</span>
                            ) : (
                                <>
                                    <span className="text-2xl font-black text-slate-800">₹{(product.price || 0).toFixed(2)}</span>
                                    {product.originalPrice > (product.price || 0) && (
                                        <span className="text-lg font-bold text-slate-400 line-through">₹{(product.originalPrice || 0).toFixed(2)}</span>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-[#fbdf14] text-[16px] tracking-widest">
                                {'★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5))}
                            </div>
                            <span className="text-[15px] font-black text-slate-700">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
                            <span className="text-[13px] font-bold text-slate-500">({product.reviewCount || 0} Reviews)</span>
                        </div>

                        <div 
                            className="text-[14px] font-semibold text-slate-500 mb-8 leading-relaxed max-w-lg"
                            dangerouslySetInnerHTML={{ __html: product.description || '<span class="text-slate-400 italic">No description available for this product.</span>' }}
                        />

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-[14px] font-bold text-slate-800">Share this:</span>
                            <div className="flex gap-3">
                                {/* Share Button */}
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center hover:bg-[#2eb3a6] transition-colors shadow-sm"
                                    title="Share"
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                </button>

                                {/* Dummy Social Icons */}
                                <button className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center hover:bg-[#2eb3a6] transition-colors shadow-sm">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center hover:bg-[#2eb3a6] transition-colors shadow-sm">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.902 4.902 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.557z" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center hover:bg-[#2eb3a6] transition-colors shadow-sm">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="fixed sm:relative bottom-0 left-0 w-full sm:w-auto bg-white sm:bg-transparent border-t border-[#f3eee7] sm:border-none p-4 sm:p-0 z-40 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 mb-0 sm:mb-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:shadow-none transition-all">
                            {/* Quantity */}
                            <div className="flex items-center border border-slate-300 rounded-full h-12 overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                >
                                    <span className="font-bold text-xl leading-none mb-1">-</span>
                                </button>
                                <span className="w-10 text-center font-bold text-slate-700">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                >
                                    <span className="font-bold text-xl leading-none mb-1">+</span>
                                </button>
                            </div>

                            {product.status === 'Out of Stock' ? (
                                <button
                                    disabled
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-500 h-12 px-6 rounded-full text-[15px] font-bold cursor-not-allowed"
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg>
                                    Out of Stock
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#2eb3a6] hover:bg-[#1d9c90] text-white h-12 px-6 rounded-full text-[15px] font-bold transition-colors shadow-md shadow-[#2eb3a6]/20"
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                    Add to cart
                                </button>
                            )}

                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                title="Add to Waitlist"
                                className={`w-12 h-12 flex-shrink-0 border rounded-full flex items-center justify-center transition-colors ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'bg-red-50 border-red-200 text-red-500 hover:border-red-300' : 'border-slate-300 text-slate-400 hover:border-[#ff6b6b] hover:text-[#ff6b6b] hover:bg-red-50'}`}
                            >
                                <svg width="20" height="20" fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>

                            <button
                                onClick={() => toast.success('Product added to Compare list!')}
                                title="Compare Product"
                                className="w-12 h-12 flex-shrink-0 border border-slate-300 rounded-full flex items-center justify-center text-slate-400 hover:border-[#2eb3a6] hover:text-[#2eb3a6] hover:bg-blue-50 transition-colors"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            </button>
                        </div>

                        {/* Additional Information box */}
                        {product.category && (
                            <div className="border border-slate-200 rounded-2xl p-6 mb-6 bg-slate-50/50">
                                <h4 className="font-black text-slate-800 mb-4 text-[15px]">Additional Information</h4>
                                <div className="grid grid-cols-1 gap-y-3 gap-x-4 text-[13px]">
                                    <div className="flex gap-2"><span className="font-bold text-slate-800">Category:</span><span className="text-slate-500 font-semibold">{product.category}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description & Reviews Tabs */}
                <div id="reviews" className="border border-slate-200 rounded-[2rem] p-6 lg:p-12 mb-16 scroll-mt-24">
                    <div className="flex justify-center gap-4 sm:gap-10 mb-8 border-b border-slate-100 pb-0">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`text-base sm:text-lg font-black pb-3 border-b-2 transition-colors ${activeTab === 'description' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`text-lg font-black pb-3 border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Reviews ({product.reviewCount || 0})
                        </button>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {activeTab === 'description' ? (
                            <div 
                                className="text-slate-500 font-semibold leading-relaxed space-y-6 text-left text-[15px]"
                                dangerouslySetInnerHTML={{ __html: product.description || '<span class="text-slate-400 italic">No description available for this product.</span>' }}
                            />
                        ) : (
                            <div className="text-left space-y-8">
                                {/* Reviews List */}
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {product.reviews.slice(0, visibleReviewsCount).map(review => (
                                            <div key={review._id} className="border-b border-slate-100 pb-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                                                        {review.customer?.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-800 text-[14px]">{review.customer?.firstName} {review.customer?.lastName}</h5>
                                                        <div className="text-[#fbdf14] text-[12px] tracking-widest">
                                                            {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 font-semibold text-[14px] leading-relaxed mt-3">
                                                    {review.reviewText}
                                                </p>
                                            </div>
                                        ))}
                                        {product.reviews.length > visibleReviewsCount && (
                                            <div className="text-center mt-6">
                                                <button 
                                                    onClick={() => setVisibleReviewsCount(prev => prev + 10)}
                                                    className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold py-2 px-6 rounded-full transition-colors text-sm"
                                                >
                                                    View More
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-slate-500 font-semibold text-center text-[15px] mb-8">
                                        No reviews yet. Be the first to review this product!
                                    </div>
                                )}

                                {/* Add Review Form */}
                                <div className="mt-10 bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-black text-slate-800 mb-4 text-[16px]">Write a Review</h4>
                                    {reviewMessage && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-xl text-sm font-bold">{reviewMessage}</div>}
                                    {reviewError && <div className="p-3 mb-4 bg-red-100 text-red-600 rounded-xl text-sm font-bold">{reviewError}</div>}

                                    {(!reviewEligibility.canReview && reviewEligibility.hasReviewed) || reviewMessage === 'Review submitted successfully!' ? (
                                        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center border border-green-200">
                                            {reviewMessage || "You have already reviewed this product for all your past orders. Thank you for your feedback!"}
                                        </div>
                                    ) : (
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            setReviewError(''); setReviewMessage('');
                                            if (!user) return setReviewError('Please login to submit a review.');
                                            try {
                                                const res = await fetch(`http://localhost:5001/api/products/${product._id}/reviews`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                                    body: JSON.stringify({ rating, reviewText })
                                                });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    setReviewMessage('Review submitted successfully!');
                                                    setReviewText('');
                                                    setRating(5);
                                                } else {
                                                    setReviewError(data.message || 'Failed to submit review');
                                                }
                                            } catch (err) {
                                                setReviewError('An error occurred.');
                                            }
                                        }} className="flex flex-col gap-4">
                                            <div>
                                                <label className="block text-[13px] font-bold text-slate-700 mb-2">Rating</label>
                                                <div className="flex gap-1.5 items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setRating(star)}
                                                            className={`text-2xl sm:text-3xl transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95 ${star <= rating ? 'text-[#fbdf14]' : 'text-slate-200 hover:text-[#fbdf14]/50'}`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                    <span className="ml-3 text-[13px] font-bold text-slate-500">{rating} out of 5</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-slate-700 mb-2">Review</label>
                                                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows="3" className="w-full border border-slate-200 rounded-xl p-3 bg-white text-sm focus:outline-none focus:border-[#2eb3a6]" placeholder="What do you think about this product?"></textarea>
                                            </div>
                                            <button type="submit" className="bg-[#2eb3a6] hover:bg-[#1d9c90] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm self-start">
                                                Submit Review
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-10 font-['Nunito'] font-serif">Related products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(rp => (
                            <div key={rp._id} className="flex flex-col group bg-white border border-slate-200 rounded-[1.25rem] p-3 hover:shadow-xl transition-all duration-300">
                                {/* Image Container */}
                                <div className="relative mb-3 bg-slate-50/70 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-4 group-hover:bg-slate-100/70 transition-colors">

                                    {/* Sale Badge */}
                                    {rp.originalPrice > (rp.price || 0) && (
                                        <span className="absolute top-3 left-3 bg-[#e8b960] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">
                                            {(rp.discountDisplayType || websiteSettings?.discountDisplayType) === 'percentage' 
                                                ? `${Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100)}% OFF`
                                                : `Save ₹${Math.round(rp.originalPrice - rp.price)}`}
                                        </span>
                                    )}

                                    {/* Product Image */}
                                    <Link to={`/product/${rp._id}`} className="absolute inset-0 z-10 flex items-center justify-center p-4">
                                        <img
                                            src={rp.thumbnailImage || (rp.images && rp.images[0])}
                                            alt={rp.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                                        />
                                    </Link>
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col flex-1 px-2 pb-1 text-center">
                                    <Link to={`/product/${rp._id}`} className="hover:text-[#2eb3a6] mb-1">
                                        <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2">
                                            {rp.name}
                                        </h3>
                                    </Link>

                                    <div className="flex justify-center text-[#fbdf14] text-[12px] tracking-widest my-1">
                                        ★★★★★
                                    </div>

                                    {/* Price and Action Buttons Row */}
                                    <div className="flex items-center justify-between mt-auto pt-3">
                                        <div className="flex flex-col text-left">
                                            {rp.status === 'Out of Stock' ? (
                                                <span className="font-black text-slate-400 text-[16px] leading-none">Out of Stock</span>
                                            ) : (
                                                <>
                                                    {rp.originalPrice > (rp.price || 0) && (
                                                        <span className="text-[12px] text-slate-400 font-bold line-through mb-[-4px]">₹{(rp.originalPrice || 0).toFixed(2)}</span>
                                                    )}
                                                    <span className="font-black text-[#22c55e] text-[20px] leading-none">₹{(rp.price || 0).toFixed(2)}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(rp); }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border hover:scale-110 ${(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === rp._id)) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                                            >
                                                <svg className="pointer-events-none" width="18" height="18" fill={(Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === rp._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            </button>
                                            {rp.status === 'Out of Stock' ? (
                                                <button
                                                    disabled
                                                    className="w-10 h-10 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center cursor-not-allowed shadow-sm"
                                                    title="Out of Stock"
                                                >
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"></path></svg>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(rp); }}
                                                    className="w-10 h-10 bg-[#2eb3a6] hover:bg-[#1d9c90] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#2eb3a6]/30 hover:shadow-lg hover:shadow-[#2eb3a6]/40 hover:scale-110"
                                                >
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && createPortal(
                <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/90 p-4">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 lg:top-8 lg:right-8 text-white hover:text-[#ff6b6b] transition-colors z-[10000] bg-white/10 hover:bg-white/20 p-2 rounded-full"
                    >
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    {allImages.length > 1 && (
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 text-white hover:text-[#2eb3a6] transition-colors bg-white/10 hover:bg-white/20 p-2 lg:p-3 rounded-full z-[10000]"
                        >
                            <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    )}

                    <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center">
                        <img
                            src={mainImage}
                            alt="Zoomed Product"
                            className="max-w-full max-h-[85vh] object-contain rounded-xl select-none"
                        />
                    </div>

                    {allImages.length > 1 && (
                        <button
                            onClick={handleNextImage}
                            className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 text-white hover:text-[#2eb3a6] transition-colors bg-white/10 hover:bg-white/20 p-2 lg:p-3 rounded-full z-[10000]"
                        >
                            <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProductDetails;
