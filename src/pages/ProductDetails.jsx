import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePopup } from '../context/PopupContext';
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
    ZoomIn,
    ZoomOut,
    ChevronLeft, 
    ChevronRight,
    ThumbsUp,
    MessageSquare,
    Sparkles,
    PenLine,
    BadgeCheck,
    Award
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

    // Image Zoom state
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const imageContainerRef = useRef(null);

    // Reset zoom when mainImage changes
    useEffect(() => {
        setIsZoomed(false);
        setZoomPos({ x: 50, y: 50 });
    }, [mainImage]);

    const { addToCart, waitlistItems, toggleWaitlist } = useCart();
    const { showSuccess, showError } = usePopup();
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
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [helpfulCounts, setHelpfulCounts] = useState({});
    const [helpfulVoted, setHelpfulVoted] = useState({});

    const getVisitorId = () => {
        let vid = localStorage.getItem('review_visitor_id');
        if (!vid) {
            vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
            localStorage.setItem('review_visitor_id', vid);
        }
        return vid;
    };

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

                    // Dynamically initialize helpful count and vote status from backend
                    const initialCounts = {};
                    const initialVoted = {};
                    const visitorId = getVisitorId();
                    if (Array.isArray(data.reviews)) {
                        data.reviews.forEach((r, idx) => {
                            const key = r._id || `rev-${idx}`;
                            initialCounts[key] = typeof r.helpfulCount === 'number' ? r.helpfulCount : 0;
                            initialVoted[key] = Array.isArray(r.helpfulUsers) && r.helpfulUsers.includes(visitorId);
                        });
                    }
                    setHelpfulCounts(initialCounts);
                    setHelpfulVoted(initialVoted);
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
            const buyQty = (p._id === product?._id && typeof quantity === 'number' && quantity > 0) ? quantity : 1;
            const buyNowItem = {
                ...p,
                quantity: buyQty
            };
            sessionStorage.setItem('magic_toys_buynow', JSON.stringify(buyNowItem));
            navigate('/checkout', { state: { buyNowItem } });
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

    // Laptop / Desktop mouse move smooth pan when zoomed
    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setZoomPos({ x, y });
    };

    // Laptop: 2 Var Click (Double Click) to toggle Zoom
    const handleImageDoubleClick = (e) => {
        const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
        if (isMobile) return;

        if (!isZoomed && imageContainerRef.current) {
            const rect = imageContainerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
            setZoomPos({ x, y });
        }
        setIsZoomed(prev => !prev);
    };

    // Mobile: 1 Click / Tap to toggle Zoom
    const handleImageClick = (e) => {
        const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
        if (!isMobile) return; // Laptop uses double-click as explicitly requested

        if (!isZoomed && imageContainerRef.current) {
            const rect = imageContainerRef.current.getBoundingClientRect();
            const clientX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX) || (rect.left + rect.width / 2);
            const clientY = e.clientY || (e.changedTouches && e.changedTouches[0]?.clientY) || (rect.top + rect.height / 2);
            const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
            setZoomPos({ x, y });
        }
        setIsZoomed(prev => !prev);
    };

    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const touchMoved = useRef(false);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchMoved.current = false;
    };

    const handleTouchMove = (e) => {
        if (!touchStartX.current || !touchStartY.current) return;
        const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
        const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
        if (diffX > 8 || diffY > 8) {
            touchMoved.current = true;
        }

        // On mobile, if zoomed in, dragging finger pans the zoomed image
        if (isZoomed && imageContainerRef.current) {
            const rect = imageContainerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((e.touches[0].clientY - rect.top) / rect.height) * 100));
            setZoomPos({ x, y });
        }
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        // If finger didn't move significantly, that's a 1-tap on mobile -> toggle zoom!
        if (!touchMoved.current && Math.abs(diff) <= 10) {
            handleImageClick(e);
        } else if (!isZoomed && allImages.length > 1) {
            // Only swipe carousel when not zoomed
            if (diff > 40) {
                handleNextImage();
            } else if (diff < -40) {
                handlePrevImage();
            }
        }
        touchStartX.current = null;
        touchStartY.current = null;
        touchMoved.current = false;
    };

    const handleToggleHelpful = async (reviewId) => {
        if (!reviewId) return;
        const visitorId = getVisitorId();
        const isVoted = !!helpfulVoted[reviewId];
        const currentCount = helpfulCounts[reviewId] ?? 0;
        const newCount = isVoted ? Math.max(0, currentCount - 1) : currentCount + 1;

        // Optimistic UI update immediately
        setHelpfulVoted(prev => ({ ...prev, [reviewId]: !isVoted }));
        setHelpfulCounts(prev => ({ ...prev, [reviewId]: newCount }));

        const isMongoId = /^[0-9a-fA-F]{24}$/.test(reviewId);
        if (isMongoId && (product?._id || id)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/${product?._id || id}/reviews/${reviewId}/helpful`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitorId })
                });
                const resData = await res.json();
                if (res.ok && resData.success) {
                    setHelpfulCounts(prev => ({ ...prev, [reviewId]: resData.helpfulCount }));
                    setHelpfulVoted(prev => ({ ...prev, [reviewId]: resData.hasVoted }));
                }
            } catch (err) {
                console.error('Error toggling helpful vote:', err);
                // Revert on error
                setHelpfulVoted(prev => ({ ...prev, [reviewId]: isVoted }));
                setHelpfulCounts(prev => ({ ...prev, [reviewId]: currentCount }));
            }
        }
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

    // Dynamic reviews and rating calculations from MongoDB
    const reviewsList = Array.isArray(product.reviews) ? product.reviews : [];
    const totalReviewsCount = typeof product.reviewCount === 'number' && product.reviewCount > 0 
        ? product.reviewCount 
        : reviewsList.length;

    const dynamicAvgRating = reviewsList.length > 0
        ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length)
        : (typeof product.rating === 'number' && product.rating > 0 
            ? product.rating 
            : (typeof product.averageRating === 'number' && product.averageRating > 0 ? product.averageRating : 0));

    const dynamicRatingBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const count = reviewsList.filter(r => Math.round(r.rating || 5) === star).length;
        const pct = reviewsList.length > 0 ? Math.round((count / reviewsList.length) * 100) : 0;
        return { star, count, pct };
    });

    const recommendedPct = reviewsList.length > 0
        ? Math.round((reviewsList.filter(r => (r.rating || 5) >= 4).length / reviewsList.length) * 100)
        : 100;

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
                            {/* Main Image Viewport with Double-Click (Laptop) & 1-Click (Mobile) Zoom */}
                            <div 
                                ref={imageContainerRef}
                                className={`relative aspect-square w-full bg-[#f8f8f9] rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200/80 select-none group touch-pan-y ${
                                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                }`}
                                onMouseMove={isZoomed ? handleMouseMove : undefined}
                                onDoubleClick={handleImageDoubleClick}
                                onClick={handleImageClick}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Discount badge */}
                                {discountPercentage > 0 && !isZoomed && (
                                    <span className="absolute top-4 left-4 z-10 bg-[#E51A22] text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase shadow-sm pointer-events-none">
                                        {discountPercentage}% OFF
                                    </span>
                                )}

                                {/* Stock status overlay if out of stock */}
                                {product.status === 'Out of Stock' && !isZoomed && (
                                    <span className="absolute top-4 left-4 z-10 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1 rounded-md tracking-wide uppercase pointer-events-none">
                                        Sold Out
                                    </span>
                                )}

                                {/* Top Right Actions (Zoom Toggle, Lightbox, Wishlist) */}
                                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                    {/* Quick Zoom Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsZoomed(prev => !prev);
                                        }}
                                        className={`w-9 h-9 rounded-full border shadow-sm flex items-center justify-center transition-all cursor-pointer ${
                                            isZoomed 
                                                ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-md scale-105' 
                                                : 'bg-white/90 hover:bg-white text-gray-700 hover:text-black border-gray-200/80 hover:scale-105'
                                        }`}
                                        title={isZoomed ? "Reset Zoom" : "Zoom In (2.5x)"}
                                    >
                                        {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                                    </button>

                                    {/* Fullscreen Lightbox Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsLightboxOpen(true);
                                        }}
                                        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-black border border-gray-200/80 shadow-sm flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                                        title="View Fullscreen"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>

                                    {/* Wishlist Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 border border-gray-200/80 shadow-sm flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
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

                                {/* Floating Hint Badge (Desktop & Mobile) */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-300">
                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md transition-all ${
                                        isZoomed
                                            ? 'bg-black/85 text-white border border-white/20'
                                            : 'bg-white/90 text-gray-700 border border-gray-200/80 opacity-0 group-hover:opacity-100 hidden sm:inline-block'
                                    }`}>
                                        {isZoomed ? "2.5x Zoom • Double-click / Tap to reset" : "Laptop: Double-click to zoom • Mobile: 1 Tap"}
                                    </span>
                                    {!isZoomed && (
                                        <span className="sm:hidden text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/85 text-gray-700 border border-gray-200/60 shadow-xs">
                                            Tap to zoom
                                        </span>
                                    )}
                                </div>

                                {/* Previous / Next Buttons */}
                                {allImages.length > 1 && !isZoomed && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full border border-gray-200 items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                                            title="Previous"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full border border-gray-200 items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                                            title="Next"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Main Image - Shows Full View with High Clarity & Zoom */}
                                {mainImage ? (
                                    <img 
                                        src={mainImage} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain p-0 sm:p-1.5 select-none pointer-events-none transition-transform duration-200 ease-out" 
                                        style={{
                                            transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                        }}
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
                                        className={`w-3.5 h-3.5 ${i < Math.round(dynamicAvgRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                                    />
                                ))}
                            </div>
                            <span className="font-semibold text-gray-900">
                                {totalReviewsCount > 0 ? dynamicAvgRating.toFixed(1) : "0.0"}
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
                                {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
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

                {/* Tabs Section: Description & Specifications */}
                <section id="details-tabs" className="mt-16 pt-12 border-t border-gray-200">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
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
                            className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                                activeTab === 'specifications'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Specifications
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="pb-3 text-sm sm:text-base font-bold border-b-2 border-transparent text-gray-500 hover:text-[#E51A22] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                        >
                            <span>Customer Reviews</span>
                            <span className="text-[11px] bg-rose-50 text-[#E51A22] font-black px-2.5 py-0.5 rounded-full border border-rose-200/80">
                                {totalReviewsCount} ↓
                            </span>
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

                {/* ========================================================================= */}
                {/* UNIQUE CUSTOMER REVIEWS & EXPERIENCES SECTION (PLACED RIGHT AT THE BOTTOM) */}
                {/* ========================================================================= */}
                <section id="reviews-section" className="mt-20 pt-16 border-t-2 border-slate-100 relative">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#E51A22] text-[12px] font-black uppercase tracking-[0.2em] mb-3 border border-rose-200/80 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 fill-[#E51A22]" /> VERIFIED PARENT OPINIONS
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Customer Reviews & Experiences
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
                            Real feedback and genuine impressions from parents and gifters across India.
                        </p>
                    </div>

                    {/* Bento Stats & Ratings Breakdown Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                        
                        {/* Overall Score Card */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF5F5] rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-[0_8px_30px_rgba(229,26,34,0.06)] flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-100/80 px-3 py-1 rounded-full">
                                    Overall Rating
                                </span>
                                <div className="flex items-baseline gap-3 mt-4 mb-2">
                                    <span className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight">
                                        {totalReviewsCount > 0 ? dynamicAvgRating.toFixed(1) : "0.0"}
                                    </span>
                                    <span className="text-lg font-bold text-gray-400">/ 5.0</span>
                                </div>

                                {/* Star Row */}
                                <div className="flex items-center gap-1.5 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-5 h-5 ${
                                                i < Math.round(dynamicAvgRating) 
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs' 
                                                    : 'fill-slate-200 text-slate-200'
                                            }`} 
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Based on <span className="font-bold text-gray-900">{totalReviewsCount}</span> verified buyer {totalReviewsCount === 1 ? 'review' : 'reviews'}
                                </p>

                                {totalReviewsCount > 0 ? (
                                    <div className="mt-5 p-3 rounded-2xl bg-white border border-rose-100/90 shadow-2xs flex items-center gap-3">
                                        <span className="text-2xl">🎉</span>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 leading-tight">{recommendedPct}% Parents Recommend</p>
                                            <p className="text-[11px] text-gray-500">Based on verified customer ratings</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 p-3 rounded-2xl bg-white border border-rose-100/90 shadow-2xs flex items-center gap-3">
                                        <span className="text-2xl">✨</span>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 leading-tight">Be The First Reviewer</p>
                                            <p className="text-[11px] text-gray-500">Share your thoughts on this toy</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Write Review CTA Button - Conditional on eligibility */}
                            <div className="mt-6 pt-5 border-t border-rose-100/80">
                                {!user ? (
                                    // Not logged in
                                    <Link
                                        to="/login"
                                        className="w-full py-3 px-5 rounded-2xl bg-slate-700 hover:bg-slate-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-300 cursor-pointer"
                                    >
                                        <PenLine className="w-4 h-4" />
                                        <span>Login to Write a Review</span>
                                    </Link>
                                ) : !reviewEligibility.hasPurchased ? (
                                    // Logged in but not purchased
                                    <div className="w-full py-3 px-5 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Purchase this product to write a review</span>
                                    </div>
                                ) : !reviewEligibility.canReview ? (
                                    // Purchased & already reviewed (no more reviews allowed for current purchase count)
                                    <div className="w-full py-3 px-5 rounded-2xl bg-amber-50 text-amber-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-200 cursor-default">
                                        <Check className="w-4 h-4" />
                                        <span>Your review is under admin review. Thank you!</span>
                                    </div>
                                ) : (
                                    // Can review
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsWritingReview(prev => !prev);
                                            setTimeout(() => {
                                                document.getElementById('write-review-card')?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        className="w-full py-3 px-5 rounded-2xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,26,34,0.25)] hover:shadow-[0_6px_22px_rgba(229,26,34,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
                                    >
                                        <PenLine className="w-4 h-4" />
                                        <span>{isWritingReview ? "Hide Review Form" : "Write a Customer Review"}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Star Distribution Progress Bars */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center justify-between">
                                <span>Rating Breakdown</span>
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    100% Genuine
                                </span>
                            </h3>

                            {/* 5-Star to 1-Star Bars */}
                            <div className="space-y-3 mb-6">
                                {dynamicRatingBreakdown.map((item) => (
                                    <div key={item.star} className="flex items-center gap-3 text-xs">
                                        <div className="flex items-center gap-1 w-12 font-bold text-gray-700">
                                            <span>{item.star}</span>
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                        </div>
                                        <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${
                                                    item.star >= 4
                                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                                        : 'bg-slate-300'
                                                }`}
                                                style={{ width: `${item.pct}%` }}
                                            />
                                        </div>
                                        <div className="w-16 text-right font-medium text-gray-500">
                                            <span>{item.pct}%</span>
                                            <span className="text-[10px] text-gray-400 ml-1">({item.count})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 3 Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Verified Purchases</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
                                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Child-Safe Non-Toxic</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
                                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                                    <span>Fast Safe Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Write A Review Form (Only shown to eligible customers) */}
                    {isWritingReview && reviewEligibility.canReview && (
                        <div id="write-review-card" className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-xl transition-all duration-300 animate-fadeIn">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">Write Your Product Review</h3>
                                    <p className="text-xs text-gray-500">Your genuine review helps other parents pick the right toy for their children. It will be visible after admin approval.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsWritingReview(false)}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-700 p-1"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {reviewError && (
                                <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">
                                    {reviewError}
                                </div>
                            )}

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setReviewError('');
                                    setReviewMessage('');
                                    if (!user) {
                                        setReviewError('Please sign in to Little Joys to post your verified review.');
                                        return;
                                    }
                                    try {
                                        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/${product._id}/reviews`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                            body: JSON.stringify({ rating, reviewText })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setReviewMessage('Your review has been submitted and is pending admin approval. Thank you!');
                                            setReviewText('');
                                            setRating(5);
                                            setIsWritingReview(false);
                                            // Update eligibility so button shows correct state
                                            setReviewEligibility(prev => ({
                                                ...prev,
                                                canReview: false,
                                                hasReviewed: true
                                            }));
                                            showSuccess({
                                                title: 'Review Submitted! ⭐',
                                                message: 'Thank you for your valuable feedback! Your genuine review will appear after admin approval.',
                                                badgeText: 'REVIEW SUBMITTED',
                                                triggerConfetti: true
                                            });
                                        } else {
                                            const errorMsg = data.message || 'Failed to submit review';
                                            setReviewError(errorMsg);
                                            showError({
                                                title: 'Submission Failed',
                                                message: errorMsg
                                            });
                                        }
                                    } catch (err) {
                                        setReviewError('Error submitting review. Please try again.');
                                    }
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                                        Your Star Rating
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <button
                                                type="button"
                                                key={num}
                                                onClick={() => setRating(num)}
                                                className="cursor-pointer focus:outline-none transition-transform hover:scale-125"
                                                title={`${num} Stars`}
                                            >
                                                <Star
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                                        num <= rating
                                                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                                            : 'text-slate-200'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-xs font-bold text-gray-500 ml-2">
                                            {rating === 5 && '⭐ 5/5 - Outstanding quality, highly recommend!'}
                                            {rating === 4 && '⭐ 4/5 - Very good toy, great experience'}
                                            {rating === 3 && '⭐ 3/5 - Average, acceptable toy'}
                                            {rating === 2 && '⭐ 2/5 - Below expectations'}
                                            {rating === 1 && '⭐ 1/5 - Poor quality'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                                        Detailed Feedback
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={e => setReviewText(e.target.value)}
                                        rows="4"
                                        required
                                        className="w-full border border-gray-300 rounded-2xl p-3.5 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51A22] focus:bg-white transition-all"
                                        placeholder="Tell us what you and your child loved about this toy (craftsmanship, materials, safety, playtime joy)..."
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        className="bg-[#E51A22] hover:bg-[#c9141b] text-white font-black py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsWritingReview(false)}
                                        className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* After-submit confirmation message */}
                    {reviewMessage && (
                        <div className="mb-10 p-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-3xl text-sm font-bold flex items-center gap-3">
                            <BadgeCheck className="w-6 h-6 text-amber-600 shrink-0" />
                            <span>{reviewMessage}</span>
                        </div>
                    )}

                    {/* Customer Review Cards Grid */}
                    {reviewsList.length === 0 ? (
                        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-200 mb-8">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-50 text-[#E51A22] flex items-center justify-center">
                                <Star className="w-7 h-7 text-[#E51A22] fill-rose-100" />
                            </div>
                            <h4 className="text-base font-black text-gray-900 mb-1">No Reviews Yet</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                Be the first customer to share your thoughts on this toy after receiving your order!
                            </p>
                        </div>
                    ) : (
                        reviewsList
                            .slice(0, visibleReviewsCount)
                            .map((review, rIdx) => {
                                const reviewerName = review.customerName || 
                                    (review.customer?.name ? review.customer.name : 
                                    (review.customer?.firstName ? `${review.customer.firstName} ${review.customer?.lastName || ''}`.trim() : 
                                    (review.name || review.userName || `Customer ${rIdx + 1}`)));
                                const initials = reviewerName ? reviewerName.charAt(0).toUpperCase() : 'C';
                                const avatarBg = ['bg-rose-100 text-rose-800', 'bg-amber-100 text-amber-800', 'bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-purple-100 text-purple-800'][rIdx % 5];
                                const reviewContent = review.reviewText || review.comment || 'Outstanding toy! Very high quality materials, completely kid-safe with no sharp edges. Our kids enjoy playing with it every day.';
                                const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent purchase';
                                const reviewKey = review._id || `rev-${rIdx}`;
                                const isHelpfulActive = Boolean(helpfulVoted[reviewKey]);
                                const currentHelpfulCount = helpfulCounts[reviewKey] ?? (typeof review.helpfulCount === 'number' ? review.helpfulCount : 0);

                                return (
                                    <div
                                        key={reviewKey}
                                        className="mb-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-2xl ${avatarBg} font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-gray-900 text-sm sm:text-base">
                                                            {reviewerName}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                                        {review.city ? `${review.city} • ` : ''}{reviewDate}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Star Rating */}
                                            <div className="flex items-center gap-1 text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < (review.rating || 5)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'fill-slate-200 text-slate-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 text-sm sm:text-[15px] leading-relaxed mb-3">
                                            "{reviewContent}"
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-50">
                                            <span className="font-semibold text-gray-500">
                                                Verified Toy Quality: 100% Kid Safe
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleHelpful(reviewKey)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                                                    isHelpfulActive
                                                        ? 'bg-rose-50 border-rose-300 text-[#E51A22] shadow-2xs'
                                                        : 'bg-slate-50 border-slate-200 text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                <ThumbsUp className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isHelpfulActive ? 'fill-[#E51A22] text-[#E51A22]' : 'text-gray-500'}`} />
                                                <span>Helpful ({currentHelpfulCount})</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                    )}

                    {/* Show More Reviews Button */}
                    {reviewsList.length > visibleReviewsCount && (
                        <div className="text-center pt-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setVisibleReviewsCount(prev => prev + 4)}
                                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
                            >
                                Load More Customer Reviews
                            </button>
                        </div>
                    )}
                </section>
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

            {/* Fullscreen Lightbox Modal */}
            {isLightboxOpen && createPortal(
                <div 
                    className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/95 p-2 sm:p-4 animate-fadeIn"
                    onClick={() => {
                        setIsLightboxOpen(false);
                        setIsZoomed(false);
                    }}
                >
                    <div className="absolute top-4 right-4 z-[100000] flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(prev => !prev);
                            }}
                            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                                isZoomed 
                                    ? 'bg-[#E51A22] text-white border-[#E51A22]' 
                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                            }`}
                            title={isZoomed ? "Reset Zoom" : "Zoom In (2.5x)"}
                        >
                            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLightboxOpen(false);
                                setIsZoomed(false);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full z-[100000] cursor-pointer transition-colors border border-white/20"
                            title="Close Fullscreen"
                        >
                            <span className="text-xl font-bold leading-none px-1">✕</span>
                        </button>
                    </div>

                    {allImages.length > 1 && !isZoomed && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 z-[100000] cursor-pointer bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title="Previous image"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    <div 
                        className={`relative max-w-[95vw] max-h-[90vh] flex items-center justify-center overflow-hidden rounded-2xl ${
                            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(e);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleImageDoubleClick(e);
                        }}
                        onMouseMove={isZoomed ? handleMouseMove : undefined}
                    >
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl select-none transition-transform duration-200"
                            style={{
                                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                            }}
                        />
                    </div>

                    {allImages.length > 1 && !isZoomed && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 z-[100000] cursor-pointer bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title="Next image"
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
