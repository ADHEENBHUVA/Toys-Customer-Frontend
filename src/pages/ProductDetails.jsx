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
    Award,
    X,
    ArrowLeft,
    Copy
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

    // Amazon-Style Side-by-Side Hover Zoom state & refs for 0-latency tracking
    const [isHoverZoom, setIsHoverZoom] = useState(false);
    const lensRef = useRef(null);
    const zoomWindowRef = useRef(null);
    const zoomImgRef = useRef(null);
    const [lensDimensions, setLensDimensions] = useState({ width: 180, height: 180 });
    const [containerDimensions, setContainerDimensions] = useState({ width: 500, height: 500 });
    const [zoomBoxDimensions, setZoomBoxDimensions] = useState({ width: 600, height: 600, top: 85, left: 700 });

    // Amazon-Style Mobile & Fullscreen Modal Zoom & Pan States
    const [modalScale, setModalScale] = useState(1);
    const [modalPan, setModalPan] = useState({ x: 0, y: 0 });
    const [isModalPanning, setIsModalPanning] = useState(false);
    const modalViewportRef = useRef(null);
    const modalImgRef = useRef(null);
    const lastTapTimeRef = useRef(0);
    const modalTouchStartPos = useRef({ x: 0, y: 0 });
    const modalPanStart = useRef({ x: 0, y: 0 });
    const initialPinchDist = useRef(null);
    const initialPinchScale = useRef(1);
    const isPinching = useRef(false);
    const isMouseDragging = useRef(false);
    const mouseDragStart = useRef({ x: 0, y: 0 });
    const mousePanStart = useRef({ x: 0, y: 0 });

    // Handle Escape key and disable body scroll when fullscreen modal is open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isLightboxOpen) {
                setIsLightboxOpen(false);
                setModalScale(1);
                setModalPan({ x: 0, y: 0 });
            }
        };
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLightboxOpen]);

    // Reset zoom when mainImage changes
    useEffect(() => {
        setIsZoomed(false);
        setIsHoverZoom(false);
        setZoomPos({ x: 50, y: 50 });
    }, [mainImage]);

    const { addToCart, waitlistItems, toggleWaitlist, shippingSettings } = useCart();
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

    const [copiedLink, setCopiedLink] = useState(false);

    const handleCopyLink = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedLink(true);
            toast.success('Link copied to clipboard! 📋');
            setTimeout(() => setCopiedLink(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleWhatsAppShare = () => {
        const shareUrl = window.location.href;
        const text = encodeURIComponent(`Check out ${product?.name} at Little Joys! ✨\nPrice: ₹${product?.price}\n${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    const handleFacebookShare = () => {
        const shareUrl = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer,width=600,height=500');
    };

    const handleInstagramShare = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied! Open Instagram to share in Direct Message 📸');
            window.open('https://www.instagram.com/direct/inbox/', '_blank', 'noopener,noreferrer');
        } catch (err) {
            window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
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
                    handleCopyLink();
                }
            }
        } else {
            handleCopyLink();
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

    // Amazon-Style Side-by-Side Hover Zoom Handlers (Desktop / Laptop)
    // Amazon-Style Side-by-Side Hover Zoom Handlers (Desktop / Laptop)
    const updateZoomWindowDimensions = (rect) => {
        if (!rect) return;
        // Large Amazon-Style HD Zoom Window - never shrinks
        const largeSize = Math.max(560, Math.min(680, rect.width || 640));

        // Pinned Viewport Coordinates: Top is clamped below navbar so it NEVER scrolls off the top of screen!
        const NAVBAR_OFFSET = 85;
        const maxAllowedHeight = Math.max(520, window.innerHeight - NAVBAR_OFFSET - 20);
        const finalHeight = Math.min(largeSize, maxAllowedHeight);
        const finalWidth = largeSize;

        // Position to the right of the image
        let leftPos = rect.right + 20;
        if (leftPos + finalWidth > window.innerWidth - 16) {
            leftPos = Math.max(16, window.innerWidth - finalWidth - 16);
        }

        // Pinned Top: As long as the product image hasn't gone completely off top,
        // clamp top to NAVBAR_OFFSET so the Zoom Box stays stuck ("chotelu") in place!
        const maxTop = window.innerHeight - finalHeight - 16;
        const topPos = Math.max(NAVBAR_OFFSET, Math.min(maxTop, rect.top));

        setZoomBoxDimensions({
            width: Math.floor(finalWidth),
            height: Math.floor(finalHeight),
            top: Math.floor(topPos),
            left: Math.floor(leftPos)
        });
    };

    const handleImageLoad = () => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const zoomLevel = 2.5;
        setContainerDimensions({ width: rect.width, height: rect.height });
        setLensDimensions({ width: rect.width / zoomLevel, height: rect.height / zoomLevel });
        updateZoomWindowDimensions(rect);
    };

    const handleMainImageMouseEnter = (e) => {
        const isMobile = window.innerWidth < 1024 || ('ontouchstart' in window);
        if (isMobile) return;
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const zoomLevel = 2.5;
        const lensW = rect.width / zoomLevel;
        const lensH = rect.height / zoomLevel;
        setContainerDimensions({ width: rect.width, height: rect.height });
        setLensDimensions({ width: lensW, height: lensH });
        updateZoomWindowDimensions(rect);
        setIsHoverZoom(true);
        requestAnimationFrame(() => {
            handleMainImageMouseMove(e);
        });
    };

    const handleMainImageMouseLeave = () => {
        setIsHoverZoom(false);
    };

    const handleMainImageMouseMove = (e) => {
        const isMobile = window.innerWidth < 1024 || ('ontouchstart' in window);
        if (isMobile) return;
        if (!imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();

        // If product image has scrolled completely past the top of the viewport, close hover zoom
        if (rect.bottom < 85) {
            setIsHoverZoom(false);
            return;
        }

        // Keep pinned position updated on mouse move
        updateZoomWindowDimensions(rect);

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 2.5x Zoom Magnification Level
        const zoomLevel = 2.5;
        const lensW = rect.width / zoomLevel;
        const lensH = rect.height / zoomLevel;

        // Exactly center the lens on the mouse cursor
        let lensX = mouseX - lensW / 2;
        let lensY = mouseY - lensH / 2;

        // Clamp lens within main image bounds
        lensX = Math.max(0, Math.min(rect.width - lensW, lensX));
        lensY = Math.max(0, Math.min(rect.height - lensH, lensY));

        // Direct DOM update for 0ms latency - mouse pointer and zoom box move 100% in sync
        if (lensRef.current) {
            lensRef.current.style.transform = `translate3d(${lensX}px, ${lensY}px, 0)`;
        }

        // Direct DOM update for high-res zoom image in zoom preview window
        if (zoomImgRef.current && zoomWindowRef.current) {
            const zoomWindowW = zoomBoxDimensions.width || zoomWindowRef.current.clientWidth || rect.width;
            const zoomWindowH = zoomBoxDimensions.height || zoomWindowRef.current.clientHeight || rect.height;
            const ratioX = zoomWindowW / rect.width;
            const ratioY = zoomWindowH / rect.height;

            const imgX = -lensX * zoomLevel * ratioX;
            const imgY = -lensY * zoomLevel * ratioY;

            zoomImgRef.current.style.transform = `translate3d(${imgX}px, ${imgY}px, 0)`;
        }
    };

    // Keep Zoom Box pinned in viewport when user scrolls while hovering over image
    useEffect(() => {
        if (!isHoverZoom) return;

        const handleScrollOrResize = () => {
            if (!imageContainerRef.current) return;
            const rect = imageContainerRef.current.getBoundingClientRect();
            // Jya sudhi Product Nu image Upper Na jatu rahe Tya Sudhi pinned rahe:
            if (rect.bottom < 85) {
                setIsHoverZoom(false);
            } else {
                updateZoomWindowDimensions(rect);
            }
        };

        window.addEventListener('scroll', handleScrollOrResize, { passive: true });
        window.addEventListener('resize', handleScrollOrResize, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScrollOrResize);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isHoverZoom]);

    // Laptop / Desktop mouse move smooth pan when zoomed
    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setZoomPos({ x, y });
    };

    // Laptop: 2 Var Click (Double Click) to open Amazon Fullscreen Zoom Viewer
    const handleImageDoubleClick = (e) => {
        const isMobile = window.innerWidth < 1024 || ('ontouchstart' in window);
        if (isMobile) return;

        setIsLightboxOpen(true);
        setModalScale(2.5);
    };

    // Mobile & Desktop Click on Main Image: Opens Amazon-Style Fullscreen Zoom Viewer with Upper Image & Bottom Horizontal List
    const handleImageClick = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsLightboxOpen(true);
        setModalScale(1);
        setModalPan({ x: 0, y: 0 });
    };

    // Amazon Fullscreen Modal Handlers (Pinch Zoom, Double-Tap Zoom, Pan, Swipe)
    const handleModalTouchStart = (e) => {
        if (e.touches.length === 2) {
            isPinching.current = true;
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialPinchDist.current = dist;
            initialPinchScale.current = modalScale;
            return;
        }

        if (e.touches.length === 1) {
            isPinching.current = false;
            modalTouchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            modalPanStart.current = { ...modalPan };

            const now = Date.now();
            if (now - lastTapTimeRef.current < 300) {
                // Double-Tap to Zoom In / Zoom Out
                if (modalScale > 1) {
                    setModalScale(1);
                    setModalPan({ x: 0, y: 0 });
                } else {
                    setModalScale(2.5);
                    if (modalViewportRef.current) {
                        const rect = modalViewportRef.current.getBoundingClientRect();
                        const offsetX = e.touches[0].clientX - (rect.left + rect.width / 2);
                        const offsetY = e.touches[0].clientY - (rect.top + rect.height / 2);
                        setModalPan({ x: -offsetX * 0.75, y: -offsetY * 0.75 });
                    }
                }
                lastTapTimeRef.current = 0;
                return;
            }
            lastTapTimeRef.current = now;

            if (modalScale > 1) {
                setIsModalPanning(true);
            }
        }
    };

    const handleModalTouchMove = (e) => {
        if (isPinching.current && e.touches.length === 2 && initialPinchDist.current) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = dist / initialPinchDist.current;
            const newScale = Math.min(4, Math.max(1, initialPinchScale.current * factor));
            setModalScale(newScale);
            if (newScale <= 1) {
                setModalPan({ x: 0, y: 0 });
            }
            return;
        }

        if (modalScale > 1 && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - modalTouchStartPos.current.x;
            const deltaY = e.touches[0].clientY - modalTouchStartPos.current.y;
            const maxPanX = (window.innerWidth * (modalScale - 1)) / 1.5;
            const maxPanY = (window.innerHeight * (modalScale - 1)) / 1.5;
            setModalPan({
                x: Math.max(-maxPanX, Math.min(maxPanX, modalPanStart.current.x + deltaX)),
                y: Math.max(-maxPanY, Math.min(maxPanY, modalPanStart.current.y + deltaY))
            });
        }
    };

    const handleModalTouchEnd = (e) => {
        setIsModalPanning(false);
        if (isPinching.current) {
            if (e.touches.length < 2) {
                isPinching.current = false;
                initialPinchDist.current = null;
            }
            return;
        }

        // Horizontal swipe between images when scale is 1
        if (modalScale <= 1 && e.changedTouches && e.changedTouches[0]) {
            const diffX = modalTouchStartPos.current.x - e.changedTouches[0].clientX;
            if (Math.abs(diffX) > 40 && allImages.length > 1) {
                if (diffX > 0) {
                    handleNextImage();
                } else {
                    handlePrevImage();
                }
                setModalScale(1);
                setModalPan({ x: 0, y: 0 });
            }
        }
    };

    const handleModalMouseDown = (e) => {
        if (modalScale > 1) {
            isMouseDragging.current = true;
            mouseDragStart.current = { x: e.clientX, y: e.clientY };
            mousePanStart.current = { ...modalPan };
            setIsModalPanning(true);
        }
    };

    const handleModalMouseMove = (e) => {
        if (isMouseDragging.current && modalScale > 1) {
            const deltaX = e.clientX - mouseDragStart.current.x;
            const deltaY = e.clientY - mouseDragStart.current.y;
            const maxPanX = (window.innerWidth * (modalScale - 1)) / 1.5;
            const maxPanY = (window.innerHeight * (modalScale - 1)) / 1.5;
            setModalPan({
                x: Math.max(-maxPanX, Math.min(maxPanX, mousePanStart.current.x + deltaX)),
                y: Math.max(-maxPanY, Math.min(maxPanY, mousePanStart.current.y + deltaY))
            });
        }
    };

    const handleModalMouseUp = () => {
        isMouseDragging.current = false;
        setIsModalPanning(false);
    };

    const handleModalWheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.3 : -0.3;
        setModalScale(prev => {
            const next = Math.min(4, Math.max(1, prev + factor));
            if (next <= 1) setModalPan({ x: 0, y: 0 });
            return next;
        });
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
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        // If finger didn't move significantly, that's a 1-tap on mobile -> open Amazon viewer!
        if (!touchMoved.current && Math.abs(diff) <= 10) {
            handleImageClick(e);
        } else if (allImages.length > 1) {
            // Swipe carousel when not tapping
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

    const isFreeShippingActive = shippingSettings?.isFreeShippingActive ?? true;
    const freeShippingMinAmount = (typeof shippingSettings?.freeShippingMinAmount === 'number' && shippingSettings.freeShippingMinAmount > 0)
        ? shippingSettings.freeShippingMinAmount
        : 3000;
    const freeShippingMinItems = typeof shippingSettings?.freeShippingMinItems === 'number'
        ? shippingSettings.freeShippingMinItems
        : 0;

    let freeShippingConditionText = 'all orders';
    if (isFreeShippingActive) {
        if (freeShippingMinAmount > 0 && freeShippingMinItems > 0) {
            freeShippingConditionText = `orders over ₹${freeShippingMinAmount.toLocaleString('en-IN')} or ${freeShippingMinItems}+ items`;
        } else if (freeShippingMinAmount > 0) {
            freeShippingConditionText = `orders over ₹${freeShippingMinAmount.toLocaleString('en-IN')}`;
        } else if (freeShippingMinItems > 0) {
            freeShippingConditionText = `orders with ${freeShippingMinItems}+ items`;
        }
    }

    return (
        <div className="bg-white min-h-screen text-gray-900 pb-20 md:pb-0">
            {/* Clean, minimalist Breadcrumbs */}
            <Breadcrumb items={[
                { label: 'Shop', link: '/products' },
                ...(product.category ? [{ label: product.category, link: `/products?category=${encodeURIComponent(product.category)}` }] : []),
                { label: product.name, link: null }
            ]} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* 2-Column Product Layout - Balanced and tightly paired without dead gaps */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-start justify-center">
                    
                    {/* LEFT COLUMN: Gallery */}
                    <div className={`w-full lg:w-[600px] xl:w-[660px] 2xl:w-[700px] shrink-0 lg:sticky lg:top-24 transition-none ${isHoverZoom ? 'z-50' : 'z-20'}`}>
                        <div className="flex flex-col gap-4">
                            {/* Outer Relative Container for Main Viewport & Floating Amazon Zoom Panel */}
                            <div className={`relative w-full ${isHoverZoom ? 'z-50' : 'z-20'}`}>
                                {/* Main Image Viewport with Amazon Hover Zoom & Mobile Click Zoom */}
                                <div 
                                    ref={imageContainerRef}
                                    className={`relative w-full aspect-square bg-[#f8f8f9] rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200/80 select-none group touch-pan-y ${
                                        isHoverZoom ? 'cursor-crosshair' : isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                    }`}
                                    onMouseEnter={handleMainImageMouseEnter}
                                    onMouseLeave={handleMainImageMouseLeave}
                                    onMouseMove={isHoverZoom ? handleMainImageMouseMove : (isZoomed ? handleMouseMove : undefined)}
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

                                    {/* Top Right Actions (Lightbox & Wishlist - Zoom button removed as requested) */}
                                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                        {/* Fullscreen Lightbox Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsLightboxOpen(true);
                                                setModalScale(1);
                                                setModalPan({ x: 0, y: 0 });
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

                                    {/* 🔍 AMAZON-STYLE BLUE ZOOM LENS BOX (Follows Mouse Pointer 1:1 with 0ms Lag, No Size Text) */}
                                    {isHoverZoom && !isZoomed && (
                                        <div 
                                            ref={lensRef}
                                            style={{
                                                top: 0,
                                                left: 0,
                                                width: `${lensDimensions.width}px`,
                                                height: `${lensDimensions.height}px`,
                                            }}
                                            className="absolute pointer-events-none z-30 bg-blue-500/22 border-2 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4),inset_0_0_12px_rgba(59,130,246,0.25)] rounded-2xl backdrop-blur-[0.5px] will-change-transform transition-none"
                                        >
                                            {/* High-tech Viewfinder Brackets in Vivid Blue */}
                                            <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-600 rounded-tl-sm" />
                                            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-600 rounded-tr-sm" />
                                            <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-600 rounded-bl-sm" />
                                            <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-600 rounded-br-sm" />

                                            {/* Center Precision Target Crosshair Optics Reticle (Directly under the mouse pointer) */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white/90 shadow-sm" />
                                                <div className="absolute w-3.5 h-0.5 bg-blue-600/60" />
                                                <div className="absolute h-3.5 w-0.5 bg-blue-600/60" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Floating Hint Badge (Desktop & Mobile) */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-300">
                                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md transition-all ${
                                            isHoverZoom
                                                ? 'opacity-0'
                                                : isZoomed
                                                    ? 'bg-black/85 text-white border border-white/20'
                                                    : 'bg-white/90 text-gray-700 border border-gray-200/80 opacity-0 group-hover:opacity-100 hidden sm:inline-block'
                                        }`}>
                                            Hover image for zoom
                                        </span>
                                        {!isHoverZoom && (
                                            <span className="sm:hidden text-[10px] font-bold px-3 py-1 rounded-full bg-white/95 text-gray-800 border border-gray-200/80 shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
                                                <ZoomIn className="w-3 h-3 text-[#E51A22]" /> Tap image to zoom
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

                                    {/* Main Image - Shows Full View with High Clarity, Perfectly Uniform Size for All Products */}
                                    {mainImage ? (
                                        <img 
                                            src={mainImage} 
                                            alt={product.name} 
                                            onLoad={handleImageLoad}
                                            className="w-full h-full object-contain p-4 sm:p-6 md:p-8 block select-none pointer-events-none transition-transform duration-200 ease-out" 
                                            style={{
                                                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm font-medium">No image available</span>
                                    )}
                                </div>

                                {/* 🔍 AMAZON-STYLE HIGH-RES ZOOM WINDOW ON THE RIGHT (Viewport-Pinned, Stays 100% On-Screen While Page Scrolls) */}
                                {isHoverZoom && !isZoomed && mainImage && createPortal(
                                    <div 
                                        ref={zoomWindowRef}
                                        style={{
                                            width: `${zoomBoxDimensions.width}px`,
                                            height: `${zoomBoxDimensions.height}px`,
                                            top: `${zoomBoxDimensions.top}px`,
                                            left: `${zoomBoxDimensions.left}px`,
                                        }}
                                        className="hidden lg:block fixed bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] z-[100] pointer-events-none ring-1 ring-black/5"
                                    >
                                        <div className="relative w-full h-full overflow-hidden bg-white">
                                            <img 
                                                ref={zoomImgRef}
                                                src={mainImage} 
                                                alt={product.name} 
                                                className="absolute top-0 left-0 max-w-none max-h-none object-contain select-none will-change-transform transition-none p-4 sm:p-6 md:p-8"
                                                style={{
                                                    width: '250%',
                                                    height: '250%'
                                                }}
                                            />
                                        </div>
                                    </div>,
                                    document.body
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
                    <div className="w-full flex-1 min-w-0 max-w-xl xl:max-w-2xl flex flex-col">
                        
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
                                Inclusive of all taxes. {isFreeShippingActive ? (
                                    `Free shipping on ${freeShippingConditionText}.`
                                ) : 'Fast delivery across India.'}
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
                                <span>
                                    {isFreeShippingActive ? (
                                        `Free shipping on ${freeShippingConditionText} across India`
                                    ) : (
                                        'Fast and reliable shipping across India'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>100% Certified child-safe & non-toxic materials</span>
                            </div>
                            {/* Return Policy: Only show when item is returnable, otherwise completely hidden! */}
                            {Boolean(product.isReturnable) && (
                                <div className="flex items-center gap-2.5">
                                    <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="font-medium text-gray-700">
                                        Hassle-free {product.returnDays > 0 ? `${product.returnDays}-day` : '7-day'} return & replacement policy
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2.5">
                                <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>100% Secure checkout with UPI, Cards, Netbanking</span>
                            </div>
                        </div>

                        {/* Unique Social Share Strip with Icons (Copy, WhatsApp, Facebook, Instagram, Share) */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Share2 className="w-3.5 h-3.5 text-gray-600" /> Share:
                            </span>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Copy Link Button */}
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black border border-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs text-xs font-bold"
                                    title="Copy link to clipboard"
                                >
                                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                                </button>

                                {/* WhatsApp Official Brand Button */}
                                <button
                                    type="button"
                                    onClick={handleWhatsAppShare}
                                    className="group relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs hover:shadow-[0_4px_12px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                    title="Share on WhatsApp"
                                >
                                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"/>
                                    </svg>
                                    <span className="sr-only">WhatsApp</span>
                                </button>

                                {/* Facebook Official Brand Button */}
                                <button
                                    type="button"
                                    onClick={handleFacebookShare}
                                    className="group relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-xs hover:shadow-[0_4px_12px_rgba(24,119,242,0.4)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                    title="Share on Facebook"
                                >
                                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span className="sr-only">Facebook</span>
                                </button>

                                {/* Instagram Official Gradient Brand Button */}
                                <button
                                    type="button"
                                    onClick={handleInstagramShare}
                                    className="group relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xs hover:shadow-[0_4px_12px_rgba(220,39,67,0.4)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                    title="Share on Instagram Direct"
                                >
                                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span className="sr-only">Instagram</span>
                                </button>

                                {/* Native Share Sheet */}
                                <button
                                    type="button"
                                    onClick={handleNativeShare}
                                    className="group relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-[#1A1A24] hover:bg-[#E51A22] text-white shadow-xs hover:shadow-[0_4px_12px_rgba(229,26,34,0.4)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                    title="More Share Options"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span className="sr-only">Share</span>
                                </button>
                            </div>
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

            {/* ========================================================================= */}
            {/* AMAZON-STYLE MOBILE & DESKTOP FULLSCREEN ZOOM VIEWER WITH BOTTOM THUMBNAILS */}
            {/* ========================================================================= */}
            {isLightboxOpen && createPortal(
                <div 
                    className="fixed inset-0 w-screen h-screen z-[99999] bg-[#0c0d12] flex flex-col justify-between select-none animate-fadeIn overflow-hidden touch-none"
                    style={{ touchAction: 'none' }}
                >
                    {/* TOP HEADER: Back/Close Button, Image Counter, Zoom Controls */}
                    <div className="w-full flex items-center justify-between px-3 sm:px-5 py-3 bg-black/70 backdrop-blur-md border-b border-white/10 z-30 shrink-0">
                        {/* Left: Close / Back Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLightboxOpen(false);
                                setModalScale(1);
                                setModalPan({ x: 0, y: 0 });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
                            title="Close"
                        >
                            <ArrowLeft className="w-4 h-4 sm:hidden" />
                            <X className="w-4 h-4 hidden sm:inline" />
                            <span className="text-xs font-bold">Back</span>
                        </button>

                        {/* Center: Image Counter & Product Name */}
                        <div className="flex flex-col items-center max-w-[55%] truncate">
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-0.5 rounded-full border border-white/15">
                                <span className="text-[11px] sm:text-xs font-bold text-white tracking-widest">
                                    {allImages.indexOf(mainImage) >= 0 ? allImages.indexOf(mainImage) + 1 : 1} / {allImages.length}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-full mt-0.5">
                                {product?.name}
                            </span>
                        </div>

                        {/* Right: Zoom Toggle Button */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (modalScale > 1) {
                                        setModalScale(1);
                                        setModalPan({ x: 0, y: 0 });
                                    } else {
                                        setModalScale(2.5);
                                    }
                                }}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all cursor-pointer active:scale-95 text-xs font-bold ${
                                    modalScale > 1 
                                        ? 'bg-[#E51A22] text-white border-[#E51A22] shadow-md' 
                                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                }`}
                                title={modalScale > 1 ? "Reset Zoom (1x)" : "Zoom In (2.5x)"}
                            >
                                {modalScale > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                                <span className="hidden sm:inline">{modalScale > 1 ? 'Reset' : 'Zoom'}</span>
                            </button>
                        </div>
                    </div>

                    {/* UPPER IMAGE VIEWPORT (Flexible, Takes max screen space) */}
                    <div 
                        ref={modalViewportRef}
                        className="relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none"
                        onTouchStart={handleModalTouchStart}
                        onTouchMove={handleModalTouchMove}
                        onTouchEnd={handleModalTouchEnd}
                        onMouseDown={handleModalMouseDown}
                        onMouseMove={handleModalMouseMove}
                        onMouseUp={handleModalMouseUp}
                        onWheel={handleModalWheel}
                    >
                        {/* Left Chevron Button */}
                        {allImages.length > 1 && modalScale === 1 && (
                            <button
                                type="button"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handlePrevImage(); 
                                    setModalScale(1); 
                                    setModalPan({ x: 0, y: 0 }); 
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center border border-white/20 transition-all z-20 cursor-pointer shadow-lg"
                                title="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* The Big Upper Product Image */}
                        <div 
                            className="w-full h-full flex items-center justify-center p-3 sm:p-6"
                            style={{
                                cursor: modalScale > 1 ? (isModalPanning ? 'grabbing' : 'grab') : 'zoom-in'
                            }}
                        >
                            <img
                                ref={modalImgRef}
                                src={mainImage}
                                alt={product?.name || "Product Image"}
                                draggable={false}
                                className="max-w-full max-h-full object-contain select-none will-change-transform"
                                style={{
                                    transform: `translate3d(${modalPan.x}px, ${modalPan.y}px, 0) scale(${modalScale})`,
                                    transition: isModalPanning ? 'none' : 'transform 0.22s ease-out'
                                }}
                            />
                        </div>

                        {/* Right Chevron Button */}
                        {allImages.length > 1 && modalScale === 1 && (
                            <button
                                type="button"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleNextImage(); 
                                    setModalScale(1); 
                                    setModalPan({ x: 0, y: 0 }); 
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center border border-white/20 transition-all z-20 cursor-pointer shadow-lg"
                                title="Next image"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* Floating Mobile Tip */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                            <span className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white/85 border border-white/10 shadow-sm whitespace-nowrap">
                                {modalScale > 1 ? 'Drag to pan • Double-tap to reset' : 'Double-tap or pinch to zoom • Swipe to change'}
                            </span>
                        </div>
                    </div>

                    {/* BOTTOM SHELF: HORIZONTAL THUMBNAIL LIST ("Niche Tenu list dekhase aadi line ma") */}
                    <div className="w-full bg-black/85 backdrop-blur-md border-t border-white/10 px-3 py-3 z-30 shrink-0">
                        <div className="max-w-xl mx-auto flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 px-1 justify-start sm:justify-center">
                            {allImages.map((img, idx) => {
                                const isActive = mainImage === img;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setMainImage(img);
                                            setModalScale(1);
                                            setModalPan({ x: 0, y: 0 });
                                        }}
                                        className={`relative w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl overflow-hidden flex-shrink-0 transition-all cursor-pointer bg-white/10 border-2 ${
                                            isActive
                                                ? 'border-[#E51A22] ring-2 ring-[#E51A22]/50 scale-105 bg-white/20 shadow-[0_0_16px_rgba(229,26,34,0.4)]'
                                                : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E51A22]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProductDetails;
