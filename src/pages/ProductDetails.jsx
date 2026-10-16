import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
    Heart, 
    ShoppingCart, 
    Zap, 
    Share2, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Lock, 
    Check, 
    Star, 
    Maximize2, 
    ChevronLeft, 
    ChevronRight
} from 'lucide-react';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';
import Breadcrumb from '../components/Breadcrumb';
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
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    const navigate = useNavigate();
    const [expandedProductDescIds, setExpandedProductDescIds] = useState({});

    const toggleProductDesc = (productId) => {
        setExpandedProductDescIds(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getCleanCardDescription = (p) => {
        if (!p) return "A wonderful toy designed for fun and learning.";
        if (p.shortDescription) return p.shortDescription;
        if (!p.description) return "A wonderful toy designed for fun and learning.";
        let text = p.description;
        text = text.replace(/^\s*<b>.*?<\/b>\s*(<br\s*\/?>\s*)*/i, '');
        text = text.replace(/<br\s*\/?>\s*<i>Category:.*?<\/i>/i, '');
        text = text.replace(/Category:.*?Brand:.*$/i, '');
        text = text.replace(/<[^>]+>/g, ' ');
        if (p.name) {
            const escaped = p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(`^\\s*${escaped}\\s*`, 'i'), '');
        }
        text = text.replace(/\s+/g, ' ').trim();
        return text || "A wonderful toy designed for fun and learning.";
    };

    const token = localStorage.getItem('token');
    const user = token ? true : false;

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, hasPurchased: false, hasReviewed: false });
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);

    const cleanDescription = (rawHtml, productName) => {
        if (!rawHtml) return '<span class="text-gray-400 italic">No description available for this product.</span>';
        let cleaned = rawHtml.replace(/^\s*<b>.*?<\/b>\s*(<br\s*\/?>\s*)*/i, '');
        if (productName) {
            const escaped = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            cleaned = cleaned.replace(new RegExp(`^\\s*${escaped}\\s*(<br\\s*\\/?>\\s*)*`, 'i'), '');
        }
        return cleaned.trim() || rawHtml;
    };

    useEffect(() => {
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
                    setProduct(null);
                }

                try {
                    const relatedRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                    const relatedData = await relatedRes.json();
                    if (relatedRes.ok && Array.isArray(relatedData)) {
                        setRelatedProducts(relatedData.filter(p => p._id !== id).slice(0, 4));
                    }
                } catch (relatedErr) {
                    console.error('Error fetching related products:', relatedErr);
                }

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

        fetchProduct();
        if (window.location.hash === '#reviews') {
            setTimeout(() => {
                const element = document.getElementById('reviews-section');
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
            addToCart(product, quantity);
        }
    };

    const handleBuyNow = (e, p = product) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (p) {
            addToCart(p, quantity);
            navigate('/checkout');
        }
    };

    const handleNativeShare = async () => {
        const shareUrl = window.location.href;
        const shareTitle = product?.name || 'Little Joys';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: `Check out ${shareTitle} at Little Joys!`,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log('Error sharing:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied to clipboard');
            } catch (err) {
                toast.error('Failed to copy link');
            }
        }
    };

    const handleWhatsAppShare = () => {
        const shareUrl = window.location.href;
        const text = encodeURIComponent(`Check out ${product?.name} at Little Joys: ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
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

    const touchStartX = useRef(null);
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (!touchStartX.current || allImages.length <= 1) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (diff > 35) {
            handleNextImage();
        } else if (diff < -35) {
            handlePrevImage();
        }
        touchStartX.current = null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-sm font-medium">Loading details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">This product may no longer be available or was removed.</p>
                <Link to="/products" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const discountPercentage = product.originalPrice > (product.price || 0)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const savedAmount = product.originalPrice > (product.price || 0)
        ? (product.originalPrice - product.price)
        : 0;

    const brandName = typeof product.brand === 'object' ? product.brand?.name : product.brand;
    const isWishlisted = Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id);

    return (
        <div className="bg-white min-h-screen text-gray-900 pb-20 md:pb-0">
            {/* Clean, minimalist Breadcrumbs */}
            <Breadcrumb items={[
                { label: 'Shop', link: '/products' },
                ...(product.category ? [{ label: product.category, link: `/products?category=${encodeURIComponent(product.category)}` }] : []),
                { label: product.name, link: null }
            ]} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* 2-Column Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    
                    {/* LEFT COLUMN: Gallery */}
                    <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24">
                        <div className="flex flex-col gap-4">
                            {/* Main Image Viewport */}
                            <div 
                                className="relative aspect-square w-full bg-[#f8f8f9] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200/70 select-none group touch-pan-y"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Discount badge */}
                                {discountPercentage > 0 && (
                                    <span className="absolute top-4 left-4 z-10 bg-[#E51A22] text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase shadow-sm">
                                        {discountPercentage}% OFF
                                    </span>
                                )}

                                {/* Stock status overlay if out of stock */}
                                {product.status === 'Out of Stock' && (
                                    <span className="absolute top-4 left-4 z-10 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1 rounded-md tracking-wide uppercase">
                                        Sold Out
                                    </span>
                                )}

                                {/* Top Right Actions (Wishlist & Lightbox) */}
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsLightboxOpen(true)}
                                        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-black border border-gray-200/80 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                                        title="View Fullscreen"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 border border-gray-200/80 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                                        title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                                    >
                                        <Heart
                                            className="w-4 h-4 transition-colors"
                                            fill={isWishlisted ? "#E51A22" : "transparent"}
                                            stroke={isWishlisted ? "#E51A22" : "#374151"}
                                            strokeWidth={2}
                                        />
                                    </button>
                                </div>

                                {/* Previous / Next Buttons */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevImage}
                                            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full border border-gray-200 items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            title="Previous"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImage}
                                            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full border border-gray-200 items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            title="Next"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Main Image */}
                                {mainImage ? (
                                    <img 
                                        src={mainImage} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain p-6 transition-transform duration-300 pointer-events-none" 
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm font-medium">No image available</span>
                                )}
                            </div>

                            {/* Thumbnail Row */}
                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setMainImage(img)}
                                            className={`relative w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer bg-[#f8f8f9] border ${
                                                mainImage === img 
                                                    ? 'border-gray-900 ring-2 ring-gray-900/10' 
                                                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info & Commerce Actions */}
                    <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
                        
                        {/* Eyebrow: Category & Brand */}
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                            {product.category && (
                                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#E51A22] transition-colors">
                                    {product.category}
                                </Link>
                            )}
                            {product.category && brandName && <span>•</span>}
                            {brandName && (
                                <Link to={`/products?brand=${encodeURIComponent(brandName)}`} className="hover:text-[#E51A22] transition-colors">
                                    {brandName}
                                </Link>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug mb-3">
                            {product.name}
                        </h1>

                        {/* Rating Row */}
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 mb-5">
                            <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                                    />
                                ))}
                            </div>
                            <span className="font-semibold text-gray-900">
                                {(product.averageRating || product.rating || 4.8).toFixed(1)}
                            </span>
                            <span>•</span>
                            <a 
                                href="#reviews-section" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('reviews');
                                    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="underline hover:text-[#E51A22] transition-colors"
                            >
                                {product.reviewCount || (product.reviews ? product.reviews.length : 0)} reviews
                            </a>
                            <span>•</span>
                            {product.status === 'Out of Stock' ? (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            ) : (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> In Stock
                                </span>
                            )}
                        </div>

                        {/* Pricing Block */}
                        <div className="pb-5 mb-5 border-b border-gray-100">
                            <div className="flex items-baseline gap-3 mb-1">
                                {product.status === 'Out of Stock' ? (
                                    <span className="text-xl font-bold text-gray-400">Currently Unavailable</span>
                                ) : (
                                    <>
                                        <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                            ₹{(product.price || 0).toFixed(0)}
                                        </span>

                                        {product.originalPrice > (product.price || 0) && (
                                            <span className="text-lg text-gray-400 line-through">
                                                ₹{(product.originalPrice || 0).toFixed(0)}
                                            </span>
                                        )}

                                        {savedAmount > 0 && (
                                            <span className="text-xs font-bold text-[#E51A22] bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                                                Save ₹{savedAmount.toFixed(0)}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Inclusive of all taxes. Free shipping on orders over ₹500.
                            </p>
                        </div>

                        {/* Overview / Clean Short Description */}
                        <div className="mb-6">
                            <div 
                                className={`text-sm text-gray-600 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3 overflow-hidden' : ''}`}
                                dangerouslySetInnerHTML={{ __html: cleanDescription(product.description, product.name) }}
                            />
                            {product.description && (
                                <button
                                    type="button"
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="mt-1.5 text-xs font-semibold text-gray-900 hover:text-[#E51A22] underline cursor-pointer"
                                >
                                    {isDescriptionExpanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>

                        {/* Actions: Quantity + Add to Cart + Buy Now */}
                        <div className="flex flex-col gap-3 mb-6">
                            {/* Quantity row */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                                <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white h-10">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || product.status === 'Out of Stock'}
                                        className="w-9 h-full flex items-center justify-center text-gray-600 hover:text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={product.status === 'Out of Stock'}
                                        className="w-9 h-full flex items-center justify-center text-gray-600 hover:text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                                {product.age && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                                        Age: {product.age}
                                    </span>
                                )}
                            </div>

                            {/* Dual Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {product.status === 'Out of Stock' ? (
                                    <button
                                        disabled
                                        className="col-span-2 h-12 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                                    >
                                        Out of Stock
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="h-12 rounded-xl border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <ShoppingCart className="w-4 h-4 shrink-0" />
                                            <span>Add to Cart</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleBuyNow(e, product)}
                                            className="h-12 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                                        >
                                            <Zap className="w-4 h-4 shrink-0 fill-current" />
                                            <span>Buy Now</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Clean Value Props List (Refined, no rainbow boxes) */}
                        <div className="border-t border-b border-gray-100 py-4 mb-6 space-y-2.5 text-xs text-gray-600">
                            <div className="flex items-center gap-2.5">
                                <Truck className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>Free shipping on all orders over ₹500 across India</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>100% Certified child-safe & non-toxic materials</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <RotateCcw className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>Hassle-free 7-day return & replacement policy</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>100% Secure checkout with UPI, Cards, Netbanking</span>
                            </div>
                        </div>

                        {/* Minimalist Share */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="font-medium">Share:</span>
                            <button
                                type="button"
                                onClick={handleNativeShare}
                                className="hover:text-black transition-colors underline cursor-pointer"
                            >
                                Copy Link
                            </button>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={handleWhatsAppShare}
                                className="hover:text-emerald-600 transition-colors underline cursor-pointer"
                            >
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section: Description, Specifications, Reviews */}
                <section id="reviews-section" className="mt-16 pt-12 border-t border-gray-200">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                                activeTab === 'description'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Description
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('specifications')}
                            className={`pb-3 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                                activeTab === 'specifications'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Specifications
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-3 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                                activeTab === 'reviews'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Reviews ({product.reviewCount || (product.reviews ? product.reviews.length : 0)})
                        </button>
                    </div>

                    {/* Tab Content 1: Description */}
                    {activeTab === 'description' && (
                        <div className="max-w-3xl py-2">
                            <div 
                                className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-4"
                                dangerouslySetInnerHTML={{ __html: cleanDescription(product.description, product.name) }}
                            />
                        </div>
                    )}

                    {/* Tab Content 2: Specifications */}
                    {activeTab === 'specifications' && (
                        <div className="max-w-2xl py-2">
                            <dl className="divide-y divide-gray-100 text-sm">
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Product</dt>
                                    <dd className="col-span-2 text-gray-900 font-medium">{product.name}</dd>
                                </div>
                                {product.category && (
                                    <div className="py-3 grid grid-cols-3">
                                        <dt className="text-gray-500 font-medium">Category</dt>
                                        <dd className="col-span-2 text-gray-900 font-medium">{product.category}</dd>
                                    </div>
                                )}
                                {brandName && (
                                    <div className="py-3 grid grid-cols-3">
                                        <dt className="text-gray-500 font-medium">Brand</dt>
                                        <dd className="col-span-2 text-gray-900 font-medium">{brandName}</dd>
                                    </div>
                                )}
                                {product.age && (
                                    <div className="py-3 grid grid-cols-3">
                                        <dt className="text-gray-500 font-medium">Recommended Age</dt>
                                        <dd className="col-span-2 text-gray-900 font-medium">{product.age}</dd>
                                    </div>
                                )}
                                {product.gender && (
                                    <div className="py-3 grid grid-cols-3">
                                        <dt className="text-gray-500 font-medium">Ideal For</dt>
                                        <dd className="col-span-2 text-gray-900 font-medium">{product.gender}</dd>
                                    </div>
                                )}
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Safety Standard</dt>
                                    <dd className="col-span-2 text-gray-900 font-medium">100% Non-Toxic & Child-Safe Certified</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Tab Content 3: Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="max-w-3xl py-2">
                            {/* Reviews Summary */}
                            <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-extrabold text-gray-900">
                                            {(product.averageRating || product.rating || 4.8).toFixed(1)}
                                        </span>
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Based on {product.reviewCount || (product.reviews ? product.reviews.length : 0)} customer reviews
                                    </p>
                                </div>
                                <a
                                    href="#write-review"
                                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                                >
                                    Write a Review
                                </a>
                            </div>

                            {/* Reviews List */}
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-6 mb-10">
                                    {product.reviews.slice(0, visibleReviewsCount).map(review => (
                                        <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {review.customer?.firstName} {review.customer?.lastName}
                                                    </span>
                                                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                                                        Verified
                                                    </span>
                                                </div>
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {review.reviewText}
                                            </p>
                                        </div>
                                    ))}

                                    {product.reviews.length > visibleReviewsCount && (
                                        <div className="text-center pt-2">
                                            <button 
                                                type="button"
                                                onClick={() => setVisibleReviewsCount(prev => prev + 5)}
                                                className="border border-gray-300 text-gray-700 hover:border-gray-900 px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Show More Reviews
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mb-8">
                                    No reviews yet. Be the first to share your thoughts on this product.
                                </p>
                            )}

                            {/* Review Form */}
                            <div id="write-review" className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80">
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Write a Review</h3>
                                <p className="text-gray-500 text-xs mb-4">Share your feedback about this product.</p>

                                {reviewMessage && <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">{reviewMessage}</div>}
                                {reviewError && <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">{reviewError}</div>}

                                {(!reviewEligibility.canReview && reviewEligibility.hasReviewed) || reviewMessage === 'Review submitted successfully!' ? (
                                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                                        {reviewMessage || "You have already reviewed this product. Thank you!"}
                                    </div>
                                ) : (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setReviewError(''); setReviewMessage('');
                                        if (!user) return setReviewError('Please sign in to submit a review.');
                                        try {
                                            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/${product._id}/reviews`, {
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
                                            setReviewError('Error submitting review');
                                        }
                                    }} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                        type="button"
                                                        key={num}
                                                        onClick={() => setRating(num)}
                                                        className="cursor-pointer focus:outline-none"
                                                    >
                                                        <Star className={`w-5 h-5 transition-colors ${num <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Your review</label>
                                            <textarea 
                                                value={reviewText} 
                                                onChange={e => setReviewText(e.target.value)} 
                                                rows="3" 
                                                required
                                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900" 
                                                placeholder="Write your review here..."
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="bg-gray-900 hover:bg-black text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                You May Also Like
                            </h2>
                            <Link to="/products" className="text-xs font-semibold text-gray-600 hover:text-[#E51A22] transition-colors">
                                View all products →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map(rp => (
                                <div key={rp._id} className="flex flex-col group cursor-pointer relative bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                                    <div className="relative w-full aspect-square overflow-hidden bg-[#f8f8f9]">
                                        {/* Discount Badge */}
                                        {rp.originalPrice > (rp.price || 0) && (
                                            <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                                                <span className="bg-[#E51A22] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
                                                    {`${Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100)}% Off`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Waitlist Button */}
                                        <div className="absolute top-2.5 right-2.5 z-20 transition-all duration-200 opacity-100 scale-100">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(rp); }}
                                                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                                title="Wishlist"
                                            >
                                                <Heart
                                                    className="w-4 h-4 transition-colors"
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === rp._id) ? "#E51A22" : "transparent"}
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === rp._id) ? "#E51A22" : "#4b5563"}
                                                    strokeWidth={2}
                                                />
                                            </button>
                                        </div>

                                        <Link to={`/product/${rp._id}`} className="absolute inset-0 z-10 flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
                                            <ProductCardImageCarousel
                                                images={rp.images?.length > 0 ? rp.images : (rp.thumbnailImage ? [rp.thumbnailImage] : [])}
                                                productName={rp.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow text-left bg-white">
                                        {/* Star Rating */}
                                        <div className="flex items-center gap-1.5 mb-1 text-xs">
                                            <div className="flex items-center gap-0.5 text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`w-3 h-3 ${i < Math.round(rp.averageRating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-400 font-medium">({rp.reviewCount || 0})</span>
                                        </div>

                                        {/* Name */}
                                        <Link to={`/product/${rp._id}`} className="font-semibold text-gray-900 text-sm mb-1.5 hover:text-[#E51A22] transition-colors line-clamp-1">
                                            {rp.name}
                                        </Link>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-100">
                                            <span className="font-bold text-gray-900 text-base">
                                                ₹{(rp.price || 0).toFixed(0)}
                                            </span>
                                            {rp.originalPrice > (rp.price || 0) && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₹{(rp.originalPrice || 0).toFixed(0)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Dual Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
                                            {rp.status === 'Out of Stock' ? (
                                                <button
                                                    disabled
                                                    className="col-span-2 py-2 rounded-lg bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed"
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
                                                            addToCart(rp);
                                                        }}
                                                        className="py-2 px-2 rounded-lg border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">Add to Cart</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleBuyNow(e, rp)}
                                                        className="py-2 px-2 rounded-lg bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                    >
                                                        <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
                                                        <span className="truncate">Buy Now</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky Mobile Bottom CTA Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col min-w-[65px] sm:min-w-[75px]">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 tracking-wider">Price</span>
                    <span className="text-sm sm:text-base font-black text-gray-900 leading-tight">₹{((product.sellingPrice || product.price || 0) * quantity).toLocaleString('en-IN')}</span>
                </div>
                {product.status === 'Out of Stock' ? (
                    <button
                        disabled
                        className="flex-1 h-10 sm:h-11 rounded-xl bg-gray-200 text-gray-500 font-bold text-xs sm:text-sm cursor-not-allowed"
                    >
                        Out of Stock
                    </button>
                ) : (
                    <div className="flex-1 grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="h-10 sm:h-11 rounded-xl border border-gray-900 text-gray-900 active:bg-gray-100 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            <span>Cart</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            className="h-10 sm:h-11 rounded-xl bg-[#E51A22] active:bg-[#c9141b] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                        >
                            <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
                            <span>Buy Now</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && createPortal(
                <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/95 p-4">
                    <button
                        type="button"
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-[10000] cursor-pointer"
                    >
                        ✕
                    </button>

                    {allImages.length > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 z-[10000] cursor-pointer"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center">
                        <img
                            src={mainImage}
                            alt=""
                            className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
                        />
                    </div>

                    {allImages.length > 1 && (
                        <button
                            type="button"
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 z-[10000] cursor-pointer"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProductDetails;
