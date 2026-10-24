import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, CheckCircle2, Shield, Leaf, Heart as HeartIcon, Bell, Sparkles, Zap, Star, Quote, MapPin, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCardImageCarousel from '../components/ProductCardImageCarousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const getInitials = (name) => {
    if (!name) return 'LP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

const avatarColors = [
    'bg-[#FEF2F2] text-[#E51A22] border-rose-200',
    'bg-[#FFFBEB] text-[#B45309] border-amber-200',
    'bg-[#ECFDF5] text-[#047857] border-emerald-200',
    'bg-[#EFF6FF] text-[#1D4ED8] border-blue-200',
    'bg-[#FAF5FF] text-[#7E22CE] border-purple-200',
    'bg-[#FFF7ED] text-[#C2410C] border-orange-200',
];

const Dashboard = () => {
    const { addToCart, waitlistItems, toggleWaitlist, shippingSettings, websiteSettings } = useCart();
    const navigate = useNavigate();

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product) {
            const buyNowItem = {
                ...product,
                quantity: 1
            };
            sessionStorage.setItem('magic_toys_buynow', JSON.stringify(buyNowItem));
            navigate('/checkout', { state: { buyNowItem } });
        }
    };
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);

    // Continuous Scroll & Drag states
    const categoryContainerRef = React.useRef(null);
    const animationRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [dynamicGap, setDynamicGap] = useState(32);

    // Shop By Age Continuous Scroll & Drag states ("aekdhari line")
    const ageContainerRef = React.useRef(null);
    const ageAnimationRef = React.useRef(null);
    const [isAgeDragging, setIsAgeDragging] = useState(false);
    const [isAgeHovered, setIsAgeHovered] = useState(false);
    const [ageStartX, setAgeStartX] = useState(0);
    const [ageScrollLeftPos, setAgeScrollLeftPos] = useState(0);
    const [ageDragDistance, setAgeDragDistance] = useState(0);
    // Banners
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedProductDescIds, setExpandedProductDescIds] = useState({});

    const toggleProductDesc = (productId) => {
        setExpandedProductDescIds(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getCleanCardDescription = (product) => {
        if (!product) return "A wonderful toy designed for fun and learning.";
        if (product.shortDescription) return product.shortDescription;
        if (!product.description) return "A wonderful toy designed for fun and learning.";
        let text = product.description;
        text = text.replace(/^\s*<b>.*?<\/b>\s*(<br\s*\/?>\s*)*/i, '');
        text = text.replace(/<br\s*\/?>\s*<i>Category:.*?<\/i>/i, '');
        text = text.replace(/Category:.*?Brand:.*$/i, '');
        text = text.replace(/<[^>]+>/g, ' ');
        if (product.name) {
            const escaped = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(`^\\s*${escaped}\\s*`, 'i'), '');
        }
        text = text.replace(/\s+/g, ' ').trim();
        return text || "A wonderful toy designed for fun and learning.";
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const platformBanners = banners.filter(b => b.platform === (isMobile ? 'Mobile' : 'PC'));
    const activeBanners = platformBanners.length > 0
        ? platformBanners
        : (banners.filter(b => b.platform === 'All' || !b.platform).length > 0
            ? banners.filter(b => b.platform === 'All' || !b.platform)
            : banners);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeBanners.length, isMobile]);

    const currentBanner = activeBanners.length > 0 ? activeBanners[currentBannerIndex] : null;

    const prevBanner = () => {
        if (activeBanners.length === 0) return;
        setCurrentBannerIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
    };

    const nextBanner = () => {
        if (activeBanners.length === 0) return;
        setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
    };


    // Brands
    const [brands, setBrands] = useState([]);

    // Testimonials
    const [testimonials, setTestimonials] = useState([]);
    const testimonialSwiperRef = useRef(null);

    // Promo Media
    const [promoMedia, setPromoMedia] = useState([]);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/trending`);
                if (res.ok) {
                    const data = await res.json();
                    setTrendingProducts(data);
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            }
        };
        const fetchBanners = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/active`);
                if (res.ok) {
                    const data = await res.json();
                    setBanners(data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
        const fetchAllProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products`);
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data);
                }
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        };
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/categories`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setDbCategories(json.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const defaultStories = [
            {
                name: 'Pooja Patel',
                location: 'Surat, Gujarat',
                headline: 'Zero splinters & completely toddler-safe wood',
                product: 'Montessori Wooden Animal Puzzle',
                rating: 5,
                date: '3 days ago',
                text: 'We visited their Surat showroom at Sudama Chowk with our 3-year-old son. The staff was incredibly welcoming and let him explore at the open play table. The puzzle has silky-smooth hand-sanded edges and zero chemical smell. Exceptional craftsmanship!',
                badge: 'Verified Buyer'
            },
            {
                name: 'Rahul Shah',
                location: 'Ahmedabad, Gujarat',
                headline: 'Replaced mobile screen time with creative building',
                product: '120-Piece STEM Building Set',
                rating: 5,
                date: '5 days ago',
                text: 'Delivered to Ahmedabad in just 2 days. The plastic blocks are thick, durable, and snap together with a solid grip. Both my kids now spend evenings building towers and bridges instead of asking for smartphones.',
                badge: 'Verified Buyer'
            },
            {
                name: 'Bhavik Vaghani',
                location: 'Surat, Gujarat',
                headline: 'Survives heavy drops and tile crashes without a scratch',
                product: '360° Double-Sided RC Stunt Car',
                rating: 5,
                date: '1 week ago',
                text: 'Bought as a birthday gift for my nephew. It flips, tumbles over tile floors, and takes heavy impact easily. Battery life is a solid 40 minutes of non-stop fun. Honest pricing and fantastic build quality.',
                badge: 'Verified Buyer'
            },
            {
                name: 'Sneha Joshi',
                location: 'Mumbai, Maharashtra',
                headline: '100% peace of mind for teething babies',
                product: 'Pastel Wooden Sensory Rattle Set',
                rating: 5,
                date: '2 weeks ago',
                text: 'My 9-month-old puts every toy straight into her mouth. The food-grade non-toxic water colors and smooth wood gave me complete peace of mind. Very lightweight, easy to grip, and sounds gentle.',
                badge: 'Verified Buyer'
            },
            {
                name: 'Dhaval Mehta',
                location: 'Vadodara, Gujarat',
                headline: 'Thick, waterproof cards that toddlers cannot tear',
                product: 'Early Learning Smart Flashcards',
                rating: 5,
                date: '2 weeks ago',
                text: 'Asked for age suggestions on WhatsApp before ordering and received immediate, helpful recommendations with clear photos. The flashcards are thick, laminated, and wipe clean easily. Best customer support!',
                badge: 'Verified Buyer'
            },
            {
                name: 'Meera Desai',
                location: 'Rajkot, Gujarat',
                headline: 'Heirloom quality wood — beats flimsy plastic toys',
                product: 'Multi-Color Wooden Abacus & Beads',
                rating: 5,
                date: '3 weeks ago',
                text: 'So much better than cheap noisy battery toys that break within two days. This abacus is solid plantation wood with smooth sliding beads. True tactile learning that keeps children focused.',
                badge: 'Verified Buyer'
            }
        ];

        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/testimonials`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data && json.data.length > 0) {
                        setTestimonials(json.data);
                        return;
                    }
                }
                setTestimonials(defaultStories);
            } catch (error) {
                console.error('Error fetching testimonials, using default stories:', error);
                setTestimonials(defaultStories);
            }
        };
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/brands`);
                if (res.ok) {
                    const data = await res.json();
                    setBrands(data);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        const fetchPromoMedia = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/promomedia`);
                if (res.ok) {
                    const data = await res.json();
                    setPromoMedia(data);
                }
            } catch (error) {
                console.error('Error fetching promo media:', error);
            }
        };

        fetchTrendingProducts();
        fetchBanners();
        fetchAllProducts();
        fetchCategories();
        fetchTestimonials();
        fetchBrands();
        fetchPromoMedia();
    }, []);

    const handlePrevTestimonial = () => {
        if (testimonialSwiperRef.current) {
            testimonialSwiperRef.current.slidePrev();
        }
    };

    const handleNextTestimonial = () => {
        if (testimonialSwiperRef.current) {
            testimonialSwiperRef.current.slideNext();
        }
    };

    // Process categories dynamically based on DB categories
    const categoryMap = {};
    allProducts.forEach(product => {
        if (product.category) {
            let catKey = typeof product.category === 'object' ? (product.category._id || product.category.name) : product.category;
            if (catKey) {
                categoryMap[catKey] = (categoryMap[catKey] || 0) + 1;
            }
        }
    });

    // Default images mapping
    const catImages = [
        'https://images.unsplash.com/photo-1522771731472-31ebed253c82?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558066191-ffc45778a48b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522771930-78848d9287ec?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
    ];

    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
        if (imagePath.startsWith('/gallery')) return imagePath;
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const dynamicCategories = dbCategories.map((dbCat, idx) => {
        const imageUrl = dbCat.image ? getImageUrl(dbCat.image) : catImages[idx % catImages.length];
        const count = (categoryMap[dbCat.name] || 0) + (categoryMap[dbCat._id] || 0);
        return {
            name: dbCat.name,
            count: count,
            img: imageUrl
        };
    });

    // If no categories from backend, use fallback
    const categories = dynamicCategories.length > 0 ? dynamicCategories : [
        { name: 'Nursery', count: 20, img: catImages[0] },
        { name: 'Toys & Games', count: 35, img: catImages[1] },
        { name: 'Feeding', count: 25, img: catImages[2] },
        { name: 'Baby Gear', count: 30, img: catImages[3] },
        { name: 'Clothing', count: 40, img: catImages[4] },
        { name: 'Bath & Care', count: 25, img: catImages[5] }
    ];

    // Shop By Age Milestones Data (2 small icons per card: decoLeft and decoRight)
    const ageMilestones = [
        {
            age: '0-12', label: 'Months', title: 'Infants',
            img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
            path: "M 50 5 A 16 16 0 0 1 72 12 A 16 16 0 0 1 90 32 A 16 16 0 0 1 95 56 A 16 16 0 0 1 83 78 A 16 16 0 0 1 61 93 A 16 16 0 0 1 39 93 A 16 16 0 0 1 17 78 A 16 16 0 0 1 5 56 A 16 16 0 0 1 10 32 A 16 16 0 0 1 28 12 A 16 16 0 0 1 50 5 Z",
            border: '#DFA32B', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '✨',
            decoLeft: '💧', decoRight: '🧡',
            posLeft: 'top-1 -left-2 md:top-2 md:-left-4',
            posRight: 'bottom-4 -right-2 md:bottom-6 md:-right-4'
        },
        {
            age: '1-2', label: 'Years', title: 'Toddlers',
            img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
            path: "M 50 98 A 43 43 0 0 0 90 38 A 18 18 0 0 0 65 15 A 43 43 0 0 0 35 15 A 18 18 0 0 0 10 38 A 43 43 0 0 0 50 98 Z",
            border: '#C1888B', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🛁',
            decoLeft: '🧸', decoRight: '🧩',
            posLeft: 'bottom-8 -left-2 md:bottom-12 md:-left-4',
            posRight: '-top-1 -right-2 md:-top-2 md:-right-3'
        },
        {
            age: '3-4', label: 'Years', title: 'Preschool',
            img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80',
            path: "M 50 5 A 45 45 0 1 1 49.99 5 Z",
            border: '#90B4EB', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '☁️',
            decoLeft: '☂️', decoRight: '🛡️',
            posLeft: '-top-2 -left-1 md:-top-3 md:-left-2',
            posRight: 'top-1/2 -right-2 md:top-1/2 md:-right-4 -translate-y-1/2'
        },
        {
            age: '5-7', label: 'Years', title: 'Little Kids',
            img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80',
            path: "M 50 5 C 85 5 95 15 95 50 C 95 85 85 95 50 95 C 15 95 5 85 5 50 C 5 15 15 5 50 5 Z",
            border: '#8F5A40', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🌙',
            decoLeft: '🌙', decoRight: '✨',
            posLeft: 'top-1/2 -left-2 md:top-1/2 md:-left-4 -translate-y-1/2',
            posRight: 'bottom-1 -right-2 md:bottom-1 md:-right-3'
        },
        {
            age: '8+', label: 'Years', title: 'Big Kids',
            img: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=600&q=80',
            path: "M 5 50 A 45 45 0 0 1 95 50 L 95 85 Q 95 98 80 98 L 20 98 Q 5 98 5 85 Z",
            border: '#86EFAC', textPrimary: '#224B9C', textSecondary: '#6B87B6', icon: '🌿',
            decoLeft: '☀️', decoRight: '🐞',
            posLeft: '-top-2 left-4 md:-top-3 md:left-6',
            posRight: '-top-1 right-0 md:-top-2 md:right-0'
        }
    ];

    // Calculate perfect dynamic gap to ensure exactly whole categories fit on screen
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const targetStride = 176; // 144px width + roughly 32px gap
            const count = Math.max(1, Math.floor(w / targetStride));
            const leftover = w - (count * 144);
            const gap = leftover / count;
            // Cap the gap on mobile so they aren't too far apart, 
            // and partial visibility helps indicate horizontal scrolling.
            setDynamicGap(w < 768 ? 20 : gap);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Continuous smooth auto-scroll (requestAnimationFrame)
    useEffect(() => {
        if (!dbCategories || dbCategories.length === 0) return;

        const animate = () => {
            const container = categoryContainerRef.current;
            if (container && !isHovered && !isDragging) {
                container.scrollLeft += 1; // Adjust speed here (1px per frame)

                // Seamless infinite loop: jump back when reaching the middle of duplicated content
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [dbCategories, isHovered, isDragging]);

    const handleManualScroll = (direction) => {
        const container = categoryContainerRef.current;
        if (!container) return;

        const stride = 144 + dynamicGap;
        const currentScroll = container.scrollLeft;

        // Find nearest snap point
        let currentIndex = Math.round(currentScroll / stride);
        const itemsToScroll = window.innerWidth < 768 ? 1 : 3;

        let targetIndex = direction === 'left' ? currentIndex - itemsToScroll : currentIndex + itemsToScroll;
        let targetScroll = targetIndex * stride;

        // Handle boundaries
        if (direction === 'left' && targetScroll < 0) {
            container.scrollLeft = container.scrollWidth / 2 + currentScroll;
            targetScroll = container.scrollWidth / 2 + (targetIndex * stride);
        } else if (direction === 'right' && targetScroll > container.scrollWidth / 2) {
            container.scrollLeft = currentScroll - (container.scrollWidth / 2);
            targetScroll = targetScroll - (container.scrollWidth / 2);
        }

        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragDistance(0);
        setStartX(e.pageX - categoryContainerRef.current.offsetLeft);
        setScrollLeftPos(categoryContainerRef.current.scrollLeft);
    };

    const handleMouseLeaveDrag = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - categoryContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        setDragDistance(Math.abs(walk));
        categoryContainerRef.current.scrollLeft = scrollLeftPos - walk;
    };

    // Shop By Age Continuous smooth auto-scroll ("aekdhari line") - Mobile Only
    useEffect(() => {
        const animate = () => {
            const container = ageContainerRef.current;
            if (container && container.offsetParent !== null && !isAgeHovered && !isAgeDragging) {
                container.scrollLeft += 0.8; // Smooth 60fps continuous line

                // Seamless infinite loop: reset when halfway through duplicated content
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            ageAnimationRef.current = requestAnimationFrame(animate);
        };

        ageAnimationRef.current = requestAnimationFrame(animate);

        return () => {
            if (ageAnimationRef.current) cancelAnimationFrame(ageAnimationRef.current);
        };
    }, [isAgeHovered, isAgeDragging]);

    const handleAgeManualScroll = (direction) => {
        const container = ageContainerRef.current;
        if (!container) return;
        const stride = window.innerWidth < 768 ? 200 : 260;
        const currentScroll = container.scrollLeft;
        const targetScroll = direction === 'left' ? currentScroll - stride : currentScroll + stride;
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    const handleAgeMouseDown = (e) => {
        setIsAgeDragging(true);
        setAgeDragDistance(0);
        setAgeStartX(e.pageX - ageContainerRef.current.offsetLeft);
        setAgeScrollLeftPos(ageContainerRef.current.scrollLeft);
    };

    const handleAgeMouseLeave = () => {
        setIsAgeDragging(false);
    };

    const handleAgeMouseUp = () => {
        setIsAgeDragging(false);
    };

    const handleAgeMouseMove = (e) => {
        if (!isAgeDragging) return;
        e.preventDefault();
        const x = e.pageX - ageContainerRef.current.offsetLeft;
        const walk = (x - ageStartX) * 1.5;
        setAgeDragDistance(Math.abs(walk));
        ageContainerRef.current.scrollLeft = ageScrollLeftPos - walk;
    };

    // Mobile Touch Handlers
    const handleAgeTouchStart = (e) => {
        setIsAgeDragging(true);
        setAgeDragDistance(0);
        setAgeStartX(e.touches[0].pageX - ageContainerRef.current.offsetLeft);
        setAgeScrollLeftPos(ageContainerRef.current.scrollLeft);
    };

    const handleAgeTouchMove = (e) => {
        if (!isAgeDragging) return;
        const x = e.touches[0].pageX - ageContainerRef.current.offsetLeft;
        const walk = (x - ageStartX) * 1.3;
        setAgeDragDistance(Math.abs(walk));
        ageContainerRef.current.scrollLeft = ageScrollLeftPos - walk;
    };

    const handleAgeTouchEnd = () => {
        setIsAgeDragging(false);
    };

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

            {/* Top Info Strip */}
            <div className="w-full bg-[#fdf2f2] border-b border-[#fce8e8] py-2 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:flex flex-row justify-between lg:justify-around items-center text-[13px] font-bold text-[#d13a3a] max-w-[1400px] mx-auto px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[16px]">🚚</span>
                        <span className="opacity-90">
                            {shippingSettings ? (
                                shippingSettings.isFreeShippingActive ? (
                                    `Free shipping on orders over ₹${shippingSettings.freeShippingMinAmount}${shippingSettings.freeShippingMinItems > 0 ? ` or ${shippingSettings.freeShippingMinItems}+ items` : ''}`
                                ) : (
                                    `Standard shipping applies`
                                )
                            ) : (
                                `Free shipping on orders over ₹999`
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-90">
                        <span className="text-[16px]">♥</span> Safe. Natural. Made for little ones.
                    </div>
                    <div className="flex items-center gap-2 opacity-90">
                        <span className="text-[16px]">⟲</span> Easy returns within 7 days
                    </div>
                </div>

                {/* Mobile Marquee View */}
                <div className="flex md:hidden whitespace-nowrap overflow-hidden relative w-full">
                    <style>
                        {`
                        @keyframes mobileMarquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-mobile-marquee {
                            animation: mobileMarquee 15s linear infinite;
                            display: flex;
                            width: max-content;
                        }
                        `}
                    </style>
                    <div className="animate-mobile-marquee text-[12px] font-bold text-[#d13a3a] items-center">
                        {/* First Set */}
                        <div className="flex items-center gap-8 px-4 opacity-90">
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">⟲</span> 7-day returns</div>
                        </div>
                        {/* Duplicate Set for continuous loop */}
                        <div className="flex items-center gap-8 px-4 opacity-90">
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">🚚</span> {shippingSettings ? (shippingSettings.isFreeShippingActive ? `Free shipping over ₹${shippingSettings.freeShippingMinAmount}` : 'Standard shipping applies') : 'Free shipping over ₹999'}</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">♥</span> Safe & Natural</div>
                            <div className="flex items-center gap-1.5"><span className="text-[14px]">⟲</span> 7-day returns</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section - Multi-Banner Carousel */}
            <div className="w-full bg-[#FFFDF9] pt-3 md:pt-5 pb-4 md:pb-6 overflow-hidden border-b border-slate-200/90 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.03)]">
                <div className="w-full mx-auto px-4 relative group/hero">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        navigation={{
                            prevEl: '.hero-prev',
                            nextEl: '.hero-next',
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={activeBanners.length > 3}
                        className="!pb-6" // Space for pagination
                    >
                        {activeBanners.length > 0 ? activeBanners.map((banner, idx) => (
                            <SwiperSlide key={idx} className="h-full">
                                <Link to={banner.buttonLink || "/products"} className="block relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm group">
                                    <img
                                        src={banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : `${baseUrl}${banner.image.startsWith('/') ? '' : '/'}${banner.image}`}
                                        alt={banner.title || "Hero"}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' }}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                </Link>
                            </SwiperSlide>
                        )) : (
                            // Fallback slides if no active banners
                            [1, 2, 3].map((_, idx) => (
                                <SwiperSlide key={idx} className="h-full">
                                    <div className="block relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm">
                                        <img
                                            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
                                            alt="Hero"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <button className="hero-prev absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-lg hidden md:flex cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/hero:opacity-100">
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    <button className="hero-next absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-lg hidden md:flex cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/hero:opacity-100">
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                </div>
            </div>



            {/* Categories */}
            <div className="w-full pt-6 sm:pt-7 md:pt-8 pb-5 sm:pb-6 md:pb-7 text-center bg-white border-b border-slate-200/90 relative">
                <div className="w-full mx-auto px-4 md:px-6">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-[#E51A22] text-[12px] font-black uppercase tracking-[0.2em] mb-2.5 border border-red-100 shadow-2xs">
                        🎯 EXPLORE BY INTEREST
                    </span>
                    <h2 className="text-[26px] md:text-[36px] font-black text-[#111] mb-1.5 tracking-tight uppercase">Toy Categories</h2>
                    <p className="text-[#666] text-[13.5px] md:text-[14.5px] mb-3 sm:mb-4 font-semibold uppercase tracking-wider">Everything your little one needs to learn, imagine & play</p>
                </div>

                <div
                    className="relative w-full py-1 group/slider bg-white"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Left Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('left')}
                        className="absolute left-3 top-[92px] -translate-y-1/2 z-30 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-800 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white hover:border-[#E51A22] hidden md:flex items-center justify-center cursor-pointer"
                        title="Scroll Left"
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                    {/* Right Arrow - Centered on Image */}
                    <button
                        onClick={() => handleManualScroll('right')}
                        className="absolute right-3 top-[92px] -translate-y-1/2 z-30 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-800 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white hover:border-[#E51A22] hidden md:flex items-center justify-center cursor-pointer"
                        title="Scroll Right"
                    >
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                    </button>


                    <style>
                        {`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                        `}
                    </style>
                    <div
                        ref={categoryContainerRef}
                        className={`flex overflow-x-auto hide-scrollbar pt-3 pb-3 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                        style={{ gap: `${dynamicGap}px` }}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveDrag}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Duplicate categories exactly twice for seamless loop math */}
                        {[...dbCategories, ...dbCategories, ...dbCategories, ...dbCategories].map((cat, idx) => {
                            const productCount = allProducts.filter(p => p.category === cat.name).length;
                            return (
                                <Link
                                    to={`/products?search=${encodeURIComponent(cat.name)}`}
                                    key={idx}
                                    onClick={(e) => { if (dragDistance > 5) e.preventDefault(); }}
                                    className="group flex flex-col items-center justify-start flex-shrink-0 transition-transform duration-500 ease-out hover:-translate-y-2 cursor-pointer select-none"
                                    style={{ width: '150px' }}
                                >
                                    {/* Circular Image Container with Multi-layer Glow & Border */}
                                    <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                                        {/* Outer Soft Ring on Hover */}
                                        <div className="absolute inset-0 rounded-full transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-[0_12px_28px_-6px_rgba(229,26,34,0.22)] group-hover:ring-4 group-hover:ring-[#E51A22]/20"></div>

                                        {/* Main Circular Mask */}
                                        <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-slate-100 group-hover:border-[#E51A22] bg-gray-50 shadow-sm transition-all duration-500 relative z-10 flex items-center justify-center">
                                            <img
                                                src={getImageUrl(cat.image)}
                                                alt={cat.name}
                                                draggable="false"
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-112 pointer-events-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Label */}
                                    <span className="font-extrabold text-[#1A1A24] text-[14px] md:text-[15px] text-center uppercase tracking-wider group-hover:text-[#E51A22] transition-colors duration-300 px-1 leading-snug">
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Best Selling Picks - Ranked with Most Selling First */}
            <div className="w-full bg-[#F8FAFC] pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 border-b border-slate-200/90 relative">
                <div className="w-full mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[12px] font-black uppercase tracking-[0.2em] mb-2.5 border border-amber-200/80 shadow-2xs">
                            🏆 TOP-RANKED FAVORITES
                        </span>
                        <h2 className="text-[28px] md:text-[38px] font-black text-[#1A1A24] leading-tight mb-1.5">
                            Best Selling Picks
                        </h2>
                        <p className="text-[#666] text-[14.5px] md:text-[16px] font-medium">Top-rated toys loved by parents and kids alike</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 md:px-0">
                        {((trendingProducts && trendingProducts.length > 0)
                            ? [...trendingProducts]
                            : [...allProducts].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0) || (b.reviewCount || 0) - (a.reviewCount || 0))
                        )
                            .filter(product => product.status !== 'Out of Stock')
                            .slice(0, 8)
                            .map((product, idx) => (
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-red-50 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                                    <div className="relative w-full aspect-square overflow-hidden bg-[#F8F9FA]">
                                        {/* Discount Badge */}
                                        <div className="absolute top-2 left-2 z-30 pointer-events-none flex flex-col gap-1 items-start">
                                            {product.originalPrice > product.price && (
                                                <span className="bg-[#E51A22] text-white px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold tracking-wider shadow-xs flex items-center">
                                                    {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                </span>
                                            )}
                                        </div>

                                        {/* Waitlist Button - Top Right Header */}
                                        <div className="absolute top-2.5 right-2.5 z-30 transition-all duration-200 opacity-100 scale-100">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 active:scale-95 border border-slate-200/80 transition-all duration-200 cursor-pointer"
                                                title="Wishlist"
                                            >
                                                <HeartIcon
                                                    className="w-4 h-4 transition-colors"
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"}
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#64748b"}
                                                    strokeWidth={2.2}
                                                />
                                            </button>
                                        </div>



                                        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-3 sm:p-5 flex flex-col flex-grow text-left bg-white relative">
                                        {/* Ratings Display */}
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="flex items-center gap-0.5 text-[#F5A623]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold tracking-wider">({product.reviewCount || 0})</span>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="font-bold text-[#1A1A24] text-[13px] sm:text-[15px] md:text-[16px] mb-1 hover:text-[#E51A22] transition-colors leading-snug line-clamp-1">
                                            {product.name}
                                        </Link>

                                        <div className="text-[12px] text-gray-500/90 mb-3 leading-relaxed">
                                            <p className={expandedProductDescIds[product._id] ? "" : "line-clamp-2 overflow-hidden"}>
                                                {getCleanCardDescription(product)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleProductDesc(product._id);
                                                }}
                                                className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#E51A22] hover:text-[#b81219] transition-colors cursor-pointer"
                                            >
                                                <span>{expandedProductDescIds[product._id] ? 'View Less' : 'View More'}</span>
                                                <svg
                                                    className={`w-3 h-3 transition-transform duration-200 ${expandedProductDescIds[product._id] ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-slate-50">
                                            {product.status === 'Out of Stock' ? (
                                                <span className="font-bold text-gray-400 text-[12px]">Out of Stock</span>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                                                    <span className="font-extrabold text-[#1A1A24] text-[14.5px] sm:text-[17px] md:text-[19px]">
                                                        ₹{`${(product.price || 0).toFixed(0)}`}
                                                    </span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[10.5px] sm:text-[12px] text-gray-400 line-through font-medium">
                                                            ₹{`${(product.originalPrice || 0).toFixed(0)}`}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Dual Action Buttons: Add to Cart & Buy Now */}
                                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2">
                                            {product.status === 'Out of Stock' ? (
                                                <button
                                                    disabled
                                                    className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-[11px] sm:text-[12px] font-bold cursor-not-allowed text-center"
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
                                                            addToCart(product);
                                                        }}
                                                        className="flex-1 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl border border-slate-200 hover:border-[#E51A22] bg-white hover:bg-red-50/50 text-[#1A1A24] hover:text-[#E51A22] text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">Add to Cart</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleBuyNow(e, product)}
                                                        className="flex-1 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-500/25 active:scale-95"
                                                        title="Buy Now"
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

                    <div className="flex justify-center items-center mt-5 sm:mt-6 px-4 md:px-0">
                        <Link to="/products?sort=bestseller" className="group bg-[#e6a27a] text-white shadow-sm hover:shadow-md hover:bg-[#d58f66] px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center text-sm">
                            View All Best Sellers
                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Shop By Age - Continuous Running Line ("Aekdhari Line") */}
            <div className="w-full bg-[#FFFBF5] pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 border-b border-amber-200/70 relative overflow-hidden">
                {/* Global SVG Clip Definitions (Defined once to eliminate duplicate ID bugs) */}
                <svg width="0" height="0" className="absolute pointer-events-none">
                    <defs>
                        {[
                            "M 50 5 A 16 16 0 0 1 72 12 A 16 16 0 0 1 90 32 A 16 16 0 0 1 95 56 A 16 16 0 0 1 83 78 A 16 16 0 0 1 61 93 A 16 16 0 0 1 39 93 A 16 16 0 0 1 17 78 A 16 16 0 0 1 5 56 A 16 16 0 0 1 10 32 A 16 16 0 0 1 28 12 A 16 16 0 0 1 50 5 Z",
                            "M 50 98 A 43 43 0 0 0 90 38 A 18 18 0 0 0 65 15 A 43 43 0 0 0 35 15 A 18 18 0 0 0 10 38 A 43 43 0 0 0 50 98 Z",
                            "M 50 5 A 45 45 0 1 1 49.99 5 Z",
                            "M 50 5 C 85 5 95 15 95 50 C 95 85 85 95 50 95 C 15 95 5 85 5 50 C 5 15 15 5 50 5 Z",
                            "M 5 50 A 45 45 0 0 1 95 50 L 95 85 Q 95 98 80 98 L 20 98 Q 5 98 5 85 Z"
                        ].map((pathStr, sIdx) => (
                            <clipPath key={`global-age-clip-${sIdx}`} id={`global-age-clip-${sIdx}`} clipPathUnits="objectBoundingBox">
                                <path d={pathStr} transform="scale(0.01)" />
                            </clipPath>
                        ))}
                    </defs>
                </svg>

                {/* 2 Small Icons per card:
                    Stationary by default on PC.
                    ONLY when the card is hovered on PC, its 2 small icons bounce/wiggle playfully! */}
                <style>{`
                    @keyframes decoBounceLeft {
                        0%, 100% {
                            transform: translateY(0px) rotate(-10deg) scale(1);
                        }
                        50% {
                            transform: translateY(-6px) rotate(-14deg) scale(1.1);
                        }
                    }
                    @keyframes decoBounceRight {
                        0%, 100% {
                            transform: translateY(0px) rotate(10deg) scale(1);
                        }
                        50% {
                            transform: translateY(-6px) rotate(14deg) scale(1.1);
                        }
                    }
                    /* On PC: Icons sit completely still by default */
                    .age-deco-left {
                        transform: translateY(0px) rotate(-10deg) scale(1);
                        transition: transform 0.3s ease;
                    }
                    .age-deco-right {
                        transform: translateY(0px) rotate(10deg) scale(1);
                        transition: transform 0.3s ease;
                    }
                    /* ONLY when this specific card is hovered by mouse */
                    .group\\/ageCard:hover .age-deco-left {
                        animation: decoBounceLeft 1.2s ease-in-out infinite;
                    }
                    .group\\/ageCard:hover .age-deco-right {
                        animation: decoBounceRight 1.2s ease-in-out infinite 0.2s;
                    }
                `}</style>

                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center text-center mb-3 md:mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-orange-700 text-[12px] font-black uppercase tracking-[0.2em] mb-2.5 border border-orange-200/80 shadow-2xs">
                            🌱 DEVELOPMENT MILESTONES
                        </span>
                        <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-black text-[#1A1A24] leading-tight mb-1.5 md:mb-2">
                            Shop By Age
                        </h2>
                        <p className="text-[#666] text-[14px] md:text-[16px] font-medium max-w-xl">
                            Curated developmental toys tailored precisely to your child's age group
                        </p>
                        <div className="w-16 h-1 bg-amber-400/80 rounded-full mx-auto mt-2.5 md:mt-3"></div>
                    </div>

                    {/* Quick Milestone Tap Pills */}
                    <div className="flex items-center justify-start sm:justify-center overflow-x-auto hide-scrollbar gap-2 mb-3 md:mb-4 px-1 w-full">
                        {[
                            { age: '0-12', label: 'Months', emoji: '🍼' },
                            { age: '1-2', label: 'Years', emoji: '🧸' },
                            { age: '3-4', label: 'Years', emoji: '🎨' },
                            { age: '5-7', label: 'Years', emoji: '🚀' },
                            { age: '8+', label: 'Years', emoji: '🧩' },
                        ].map((item, idx) => (
                            <Link
                                key={`pill-${idx}`}
                                to={`/products?age=${encodeURIComponent(item.age + ' ' + item.label)}`}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-amber-200/80 shadow-2xs text-[12px] font-bold text-slate-700 hover:border-[#E51A22] hover:text-[#E51A22] hover:bg-red-50/50 transition-all active:scale-95 cursor-pointer"
                            >
                                <span>{item.emoji}</span>
                                <span>{item.age} {item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop View: Clean Static 5-Column Grid (No moving line on PC) */}
                    <div className="hidden md:grid md:grid-cols-5 gap-6 lg:gap-8 justify-items-center max-w-[1300px] mx-auto pt-1 pb-2">
                        {ageMilestones.map((item, idx) => (
                            <Link
                                to={`/products?age=${encodeURIComponent(item.age + ' ' + item.label)}`}
                                key={`age-desktop-${idx}`}
                                className="group/ageCard flex flex-col items-center justify-start w-full transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer select-none"
                            >
                                {/* Organic Shape Container */}
                                <div className="relative w-40 h-40 lg:w-44 lg:h-44 mb-4 flex items-center justify-center">
                                    {/* 1st Small Icon (decoLeft) */}
                                    {item.decoLeft && (
                                        <div className={`absolute ${item.posLeft} pointer-events-none transition-transform duration-500 z-30`}>
                                            <div
                                                className="age-deco-left bg-white/95 backdrop-blur-md rounded-2xl w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-md border"
                                                style={{ borderColor: `${item.border}50` }}
                                            >
                                                <span className="text-[17px] lg:text-[19px] select-none leading-none">{item.decoLeft}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2nd Small Icon (decoRight) */}
                                    {item.decoRight && (
                                        <div className={`absolute ${item.posRight} pointer-events-none transition-transform duration-500 z-30`}>
                                            <div
                                                className="age-deco-right bg-white/95 backdrop-blur-md rounded-2xl w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-md border"
                                                style={{ borderColor: `${item.border}50` }}
                                            >
                                                <span className="text-[17px] lg:text-[19px] select-none leading-none">{item.decoRight}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inner Shape with border and clipPath */}
                                    <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover/ageCard:scale-105">
                                        {/* Border Outline SVG */}
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-md">
                                            <path d={item.path} fill="none" stroke={item.border} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        {/* Masked Image */}
                                        <div
                                            className="absolute inset-0 w-full h-full bg-white z-10"
                                            style={{ clipPath: `url(#global-age-clip-${idx})` }}
                                        >
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                draggable="false"
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/ageCard:scale-110 pointer-events-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Details */}
                                <h3 className="font-extrabold text-[18px] lg:text-[20px] mb-1 flex items-center gap-1.5 text-center group-hover/ageCard:text-[#E51A22] transition-colors" style={{ color: item.textPrimary }}>
                                    <span className="text-[19px] lg:text-[21px] transition-transform duration-300 group-hover/ageCard:scale-125 inline-block">{item.icon}</span>
                                    {item.title}
                                </h3>
                                <p className="text-[13px] lg:text-[14px] font-bold tracking-wide text-amber-800 bg-amber-100/70 px-3 py-0.5 rounded-full">
                                    {item.age} {item.label}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile View: Continuous Running Line ("Aekdhari Line" - Only on Mobile) */}
                    <div
                        className="block md:hidden relative w-full py-2 group/ageSlider"
                        onMouseEnter={() => setIsAgeHovered(true)}
                        onMouseLeave={() => setIsAgeHovered(false)}
                    >
                        {/* Left Navigation Chevron */}
                        <button
                            onClick={() => handleAgeManualScroll('left')}
                            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-amber-200/80 text-slate-800 opacity-90 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white flex items-center justify-center cursor-pointer"
                            title="Scroll Left"
                        >
                            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>

                        {/* Right Navigation Chevron */}
                        <button
                            onClick={() => handleAgeManualScroll('right')}
                            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-amber-200/80 text-slate-800 opacity-90 transition-all duration-300 hover:scale-110 hover:bg-[#E51A22] hover:text-white flex items-center justify-center cursor-pointer"
                            title="Scroll Right"
                        >
                            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>

                        <div
                            ref={ageContainerRef}
                            className={`flex overflow-x-auto hide-scrollbar pt-4 pb-4 px-3 gap-5 ${isAgeDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                            onMouseDown={handleAgeMouseDown}
                            onMouseLeave={handleAgeMouseLeave}
                            onMouseUp={handleAgeMouseUp}
                            onMouseMove={handleAgeMouseMove}
                            onTouchStart={handleAgeTouchStart}
                            onTouchMove={handleAgeTouchMove}
                            onTouchEnd={handleAgeTouchEnd}
                        >
                            {[...ageMilestones, ...ageMilestones, ...ageMilestones, ...ageMilestones].map((item, idx) => {
                                const clipIndex = idx % 5;
                                return (
                                    <Link
                                        to={`/products?age=${encodeURIComponent(item.age + ' ' + item.label)}`}
                                        key={`age-mobile-${idx}`}
                                        onClick={(e) => { if (ageDragDistance > 6) e.preventDefault(); }}
                                        className="group flex flex-col items-center justify-start shrink-0 transition-transform duration-500 ease-out active:scale-95 cursor-pointer select-none"
                                        style={{ width: '165px' }}
                                    >
                                        {/* Organic Shape Container */}
                                        <div className="relative w-36 h-36 mb-3 flex items-center justify-center">
                                            {/* 1st Small Icon (decoLeft) */}
                                            {item.decoLeft && (
                                                <div className={`absolute ${item.posLeft} pointer-events-none transition-transform duration-500 z-30`}>
                                                    <div
                                                        className="bg-white/95 backdrop-blur-md rounded-xl w-8 h-8 flex items-center justify-center rotate-[-10deg] shadow-md border"
                                                        style={{ borderColor: `${item.border}50` }}
                                                    >
                                                        <span className="text-[14px] select-none leading-none">{item.decoLeft}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2nd Small Icon (decoRight) */}
                                            {item.decoRight && (
                                                <div className={`absolute ${item.posRight} pointer-events-none transition-transform duration-500 z-30`}>
                                                    <div
                                                        className="bg-white/95 backdrop-blur-md rounded-xl w-8 h-8 flex items-center justify-center rotate-[10deg] shadow-md border"
                                                        style={{ borderColor: `${item.border}50` }}
                                                    >
                                                        <span className="text-[14px] select-none leading-none">{item.decoRight}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Inner Shape with border and clipPath */}
                                            <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                                                {/* Border Outline SVG */}
                                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-md">
                                                    <path d={item.path} fill="none" stroke={item.border} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                {/* Masked Image */}
                                                <div
                                                    className="absolute inset-0 w-full h-full bg-white z-10"
                                                    style={{ clipPath: `url(#global-age-clip-${clipIndex})` }}
                                                >
                                                    <img
                                                        src={item.img}
                                                        alt={item.title}
                                                        draggable="false"
                                                        className="w-full h-full object-cover pointer-events-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Details */}
                                        <h3 className="font-extrabold text-[16px] mb-0.5 flex items-center gap-1.5 text-center text-[#224B9C]">
                                            <span className="text-[17px]">{item.icon}</span>
                                            {item.title}
                                        </h3>
                                        <p className="text-[12px] font-bold tracking-wide text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                                            {item.age} {item.label}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>



            {/* Promo Media (Videos & Images) - Limited Edition Style */}
            {promoMedia && promoMedia.length > 0 && (
                <div className="w-full bg-[#F4F7FC] pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 border-b border-indigo-200/70 relative">
                    <div className="w-full mx-auto px-4 md:px-8">
                        <div className="mb-4 sm:mb-5 text-center md:text-left">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[12px] font-black uppercase tracking-[0.2em] mb-2.5 border border-blue-200/80 shadow-2xs">
                                ✨ EXCLUSIVE DROPS
                            </span>
                            <h2 className="text-[26px] md:text-[34px] font-black text-[#1A1A24] mb-1.5 font-sans">Limited-edition playtime drops</h2>
                            <p className="text-[#555] text-[14px] md:text-[15px] max-w-2xl font-medium">Explore our limited-edition toy drops, crafted for unforgettable playtime moments and available only while exclusive stocks last.</p>
                        </div>

                        <div className="w-full relative group/promo">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={16}
                                slidesPerView={2}
                                breakpoints={{
                                    640: { slidesPerView: 3 },
                                    768: { slidesPerView: 4 },
                                    1024: { slidesPerView: 5 },
                                    1280: { slidesPerView: 5 },
                                }}
                                navigation={{
                                    prevEl: '.promo-prev',
                                    nextEl: '.promo-next',
                                }}
                                autoplay={{ delay: 10000, disableOnInteraction: false }}
                                loop={promoMedia.length > 3}
                                className="w-full"
                            >
                                {promoMedia.map((media) => (
                                    <SwiperSlide key={media._id}>
                                        <div className="flex flex-col h-full bg-transparent group/card">
                                            <Link to={media.link || "/products"} className="relative w-full aspect-[4/5] rounded-t-[20px] overflow-hidden bg-[#F8F9FA] border-x border-t border-slate-200 block group-hover/card:border-red-100 transition-colors">
                                                {media.type === 'video' ? (
                                                    <video
                                                        src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `${baseUrl}${media.mediaUrl?.startsWith('/') ? '' : '/'}${media.mediaUrl || ''}`}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 pointer-events-none"
                                                    />
                                                ) : (
                                                    <img
                                                        src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `${baseUrl}${media.mediaUrl?.startsWith('/') ? '' : '/'}${media.mediaUrl || ''}`}
                                                        alt={media.title}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 pointer-events-none"
                                                    />
                                                )}
                                            </Link>
                                            <Link to={media.link || "/products"} className="bg-white p-3 rounded-b-[20px] border-x border-b border-slate-200 flex items-center gap-3 group-hover/card:border-red-100 group-hover/card:bg-red-50/30 transition-all h-[70px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] group-hover/card:shadow-[0_8px_30px_rgba(229,26,34,0.08)]">
                                                {media.type === 'image' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100">
                                                        <img src={media.mediaUrl?.startsWith('http') ? media.mediaUrl : `${baseUrl}${media.mediaUrl?.startsWith('/') ? '' : '/'}${media.mediaUrl || ''}`} alt="thumb" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {media.type === 'video' && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100 flex items-center justify-center group-hover/card:border-red-200 transition-colors">
                                                        <span className="text-[#E51A22] text-[16px] translate-x-[1px]">▶</span>
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <span className="font-bold text-[#1A1A24] text-[13px] truncate w-full leading-tight">{media.title || 'Exclusive Toy'}</span>
                                                    {media.subtitle && !media.subtitle.toLowerCase().includes('club') && (
                                                        <span className="font-bold text-[#E51A22] text-[11px] truncate w-full leading-tight mt-0.5">{media.subtitle}</span>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="promo-prev absolute left-2 top-[40%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-md opacity-0 group-hover/promo:opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <button className="promo-next absolute right-2 top-[40%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#111] transition-all hover:scale-105 shadow-md opacity-0 group-hover/promo:opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Explore Popular Toy Set */}
            <div className="w-full bg-white pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 border-b border-slate-200/90 relative">
                <div className="w-full mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E51A22] text-[12px] font-black uppercase tracking-[0.2em] mb-2.5 border border-rose-200/80 shadow-2xs">
                            🧸 FEATURED PLAYSETS
                        </span>
                        <h2 className="text-[28px] md:text-[38px] font-black text-[#1A1A24] leading-tight mb-1.5">
                            Explore Popular Toy Set
                        </h2>
                        <p className="text-[#666] text-[14.5px] md:text-[16px] font-medium">Smart, Fun & Creative Toys for Every Little Adventure</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 md:px-0">
                        {[...allProducts]
                            .filter(product => product.status !== 'Out of Stock')
                            .sort((a, b) => {
                                if (a.bestSeller && !b.bestSeller) return -1;
                                if (!a.bestSeller && b.bestSeller) return 1;
                                return (b.reviewCount || 0) - (a.reviewCount || 0);
                            })
                            .slice(0, visibleCount)
                            .map((product) => (
                                <div key={product._id} className="flex flex-col group cursor-pointer relative bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-red-50 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(229,26,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                                    <div className="relative w-full aspect-square overflow-hidden bg-[#F8F9FA]">
                                        {/* Discount Badge */}
                                        {product.originalPrice > product.price && (
                                            <div className="absolute top-2 left-2 z-30 pointer-events-none">
                                                <span className="bg-[#E51A22] text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold tracking-wider shadow-xs flex items-center gap-0.5">
                                                    {`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Waitlist Button - Top Right Header */}
                                        <div className="absolute top-2.5 right-2.5 z-30 transition-all duration-200 opacity-100 scale-100">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWaitlist(product); }}
                                                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 active:scale-95 border border-slate-200/80 transition-all duration-200 cursor-pointer"
                                                title="Wishlist"
                                            >
                                                <HeartIcon
                                                    className="w-4 h-4 transition-colors"
                                                    fill={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "transparent"}
                                                    stroke={Array.isArray(waitlistItems) && waitlistItems.some(item => item._id === product._id) ? "#E51A22" : "#64748b"}
                                                    strokeWidth={2.2}
                                                />
                                            </button>
                                        </div>



                                        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                                            <ProductCardImageCarousel
                                                images={product.images?.length > 0 ? product.images : (product.thumbnailImage ? [product.thumbnailImage] : [])}
                                                productName={product.name}
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-3 sm:p-5 flex flex-col flex-grow text-left bg-white relative">
                                        {/* Ratings Display */}
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="flex items-center gap-0.5 text-[#F5A623]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold tracking-wider">({product.reviewCount || 0})</span>
                                        </div>

                                        <Link to={`/product/${product._id}`} className="font-bold text-[#1A1A24] text-[13px] sm:text-[15px] md:text-[16px] mb-1 hover:text-[#E51A22] transition-colors leading-snug line-clamp-1">
                                            {product.name}
                                        </Link>

                                        <div className="text-[12px] text-gray-500/90 mb-3 leading-relaxed">
                                            <p className={expandedProductDescIds[product._id] ? "" : "line-clamp-2 overflow-hidden"}>
                                                {getCleanCardDescription(product)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleProductDesc(product._id);
                                                }}
                                                className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#E51A22] hover:text-[#b81219] transition-colors cursor-pointer"
                                            >
                                                <span>{expandedProductDescIds[product._id] ? 'View Less' : 'View More'}</span>
                                                <svg
                                                    className={`w-3 h-3 transition-transform duration-200 ${expandedProductDescIds[product._id] ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-slate-50">
                                            {product.status === 'Out of Stock' ? (
                                                <span className="font-bold text-gray-400 text-[12px]">Out of Stock</span>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                                                    <span className="font-extrabold text-[#1A1A24] text-[14.5px] sm:text-[17px] md:text-[19px]">
                                                        ₹{`${(product.price || 0).toFixed(0)}`}
                                                    </span>
                                                    {product.originalPrice > (product.price || 0) && (
                                                        <span className="text-[10.5px] sm:text-[12px] text-gray-400 line-through font-medium">
                                                            ₹{`${(product.originalPrice || 0).toFixed(0)}`}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Dual Action Buttons: Add to Cart & Buy Now */}
                                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2">
                                            {product.status === 'Out of Stock' ? (
                                                <button
                                                    disabled
                                                    className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-[11px] sm:text-[12px] font-bold cursor-not-allowed text-center"
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
                                                            addToCart(product);
                                                        }}
                                                        className="flex-1 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl border border-slate-200 hover:border-[#E51A22] bg-white hover:bg-red-50/50 text-[#1A1A24] hover:text-[#E51A22] text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">Add to Cart</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleBuyNow(e, product)}
                                                        className="flex-1 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-500/25 active:scale-95"
                                                        title="Buy Now"
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

                    {/* View All Products Button (Load More removed) */}
                    <div className="flex justify-center items-center mt-5 sm:mt-6 px-4 md:px-0">
                        <Link to="/products" className="group bg-[#e6a27a] text-white shadow-sm hover:shadow-md hover:bg-[#d58f66] px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center text-sm">
                            View All Products
                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Brands Marquee - Premium Continuous Ticker */}
            {brands.length > 0 && (
                <div className="w-full pt-6 sm:pt-7 md:pt-8 pb-6 sm:pb-7 md:pb-8 overflow-hidden bg-[#FFFDF9] font-sans border-b border-slate-200/90 relative">
                    <div className="text-center mb-3 sm:mb-4 px-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent -z-10"></div>
                        <div className="inline-block bg-[#FFFDF9] px-6">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[12px] font-black uppercase tracking-[0.2em] mb-2 border border-purple-200/80 shadow-2xs">
                                ⭐ OFFICIAL PARTNERS
                            </span>
                            <h2 className="text-[28px] md:text-[36px] font-black text-[#1A1A24] block mt-1">Brands We Trust</h2>
                        </div>
                    </div>

                    <style>
                        {`
                        @keyframes marquee-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee-scroll {
                            animation: marquee-scroll 25s linear infinite;
                        }
                        .animate-marquee-scroll:hover {
                            animation-play-state: paused;
                        }
                        
                        /* Mask for smooth fade at edges */
                        .marquee-container {
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                        `}
                    </style>

                    <div className="w-full relative overflow-hidden marquee-container max-w-[1600px] mx-auto py-10">
                        {/* 
                            We duplicate the brands array 4 times to ensure enough content 
                            for seamless infinite scroll across all screen sizes 
                        */}
                        <div className="flex animate-marquee-scroll w-max hover:pause items-center">
                            {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => {
                                const brandShapesMap = {
                                    squircle: { path: "M 20 6 L 80 6 C 92 6 95 12 95 24 L 95 76 C 95 88 92 94 80 94 L 20 94 C 8 94 5 88 5 76 L 5 24 C 5 12 8 6 20 6 Z", bg: '#FFF0F5', border: '#FFB6C1', emoji1: '🧸', emoji2: '🎈', pos1: '-top-3 -left-2', pos2: '-bottom-3 -right-2' },
                                    circle: { path: "M 50 6 A 44 44 0 1 1 49.99 6 Z", bg: '#F0FFFF', border: '#87CEFA', emoji1: '🚀', emoji2: '⭐', pos1: '-top-3 -right-2', pos2: '-bottom-3 -left-2' },
                                    cloud: { path: "M 25 24 C 28 12 45 10 52 20 C 60 10 78 12 82 24 C 94 28 96 46 92 60 C 95 74 86 88 74 88 C 65 92 55 88 48 85 C 40 92 25 90 18 82 C 8 76 6 60 12 50 C 6 38 14 26 25 24 Z", bg: '#F5FFFA', border: '#98FB98', emoji1: '🚂', emoji2: '☁️', pos1: 'top-1/4 -left-4', pos2: 'bottom-1/4 -right-4' },
                                    pill: { path: "M 28 10 L 72 10 C 90 10 95 26 95 50 C 95 74 90 90 72 90 L 28 90 C 10 90 5 74 5 50 C 5 26 10 10 28 10 Z", bg: '#FFFACD', border: '#F0E68C', emoji1: '🧩', emoji2: '🎲', pos1: '-top-4 left-1/3', pos2: '-bottom-3 right-1/4' },
                                    hexagon: { path: "M 50 6 C 60 6 88 20 92 28 C 96 36 96 64 92 72 C 88 80 60 94 50 94 C 40 94 12 80 8 72 C 4 64 4 36 8 28 C 12 20 40 6 50 6 Z", bg: '#F8F8FF', border: '#DDA0DD', emoji1: '🐣', emoji2: '🍼', pos1: 'top-8 -right-3', pos2: 'bottom-4 -left-3' },
                                    blob: { path: "M 50 8 C 80 6 94 24 92 50 C 90 76 78 92 50 92 C 22 92 8 76 8 50 C 8 24 24 10 50 8 Z", bg: '#F0FFF0', border: '#90EE90', emoji1: '🦖', emoji2: '🌿', pos1: '-bottom-3 right-1/3', pos2: '-top-3 left-1/4' },
                                    box: { path: "M 32 8 L 68 8 C 82 8 92 18 92 32 L 92 68 C 92 82 82 92 68 92 L 32 92 C 18 92 8 82 8 68 L 8 32 C 8 18 18 8 32 8 Z", bg: '#E6E6FA', border: '#BA55D3', emoji1: '🦄', emoji2: '✨', pos1: '-top-3 left-1/2', pos2: '-bottom-3 right-3' },
                                    daisy: { path: "M 50 8 C 60 8 68 4 76 10 C 84 16 90 14 94 22 C 98 30 94 40 96 50 C 98 60 94 70 90 78 C 86 86 78 84 72 90 C 66 96 56 94 50 94 C 44 94 34 96 28 90 C 22 84 14 86 10 78 C 6 70 2 60 4 50 C 6 40 2 30 6 22 C 10 14 16 16 24 10 C 32 4 40 8 50 8 Z", bg: '#FFE4E1', border: '#F08080', emoji1: '🎀', emoji2: '🌸', pos1: 'top-1/4 -right-3', pos2: 'bottom-1/4 -left-3' },
                                    crest: { path: "M 20 12 C 40 8 60 8 80 12 C 92 28 94 62 82 80 C 68 92 50 94 50 94 C 50 94 32 92 18 80 C 6 62 8 28 20 12 Z", bg: '#E0FFFF', border: '#00CED1', emoji1: '🐬', emoji2: '🌊', pos1: '-bottom-3 -left-2', pos2: '-top-3 -right-2' },
                                    clover: { path: "M 50 14 C 55 6 68 6 74 14 C 84 14 92 24 90 34 C 96 42 96 56 88 64 C 88 74 78 82 68 80 C 60 88 44 88 36 80 C 26 82 14 74 14 64 C 6 56 6 42 12 34 C 10 24 18 14 28 14 C 34 6 46 6 50 14 Z", bg: '#FFDAB9', border: '#FF8C00', emoji1: '🐝', emoji2: '🍯', pos1: '-top-2 left-10', pos2: '-bottom-2 right-10' }
                                };
                                const shapeKeys = ['squircle', 'circle', 'cloud', 'pill', 'hexagon', 'blob', 'box', 'daisy', 'crest', 'clover'];
                                const fallbackKey = shapeKeys[idx % shapeKeys.length];
                                const activeShapeKey = (brand.shape && brandShapesMap[brand.shape]) ? brand.shape : fallbackKey;
                                const style = brandShapesMap[activeShapeKey];
                                const finalBg = brand.bgColor || style.bg;
                                const finalBorder = brand.borderColor || style.border;

                                return (
                                    <div key={`brand-${idx}-${brand._id}`} className="flex items-center justify-center px-4 md:px-6 py-6">
                                        <Link
                                            to={`/products?brand=${encodeURIComponent(brand.name)}`}
                                            title={`Shop ${brand.name} toys`}
                                            className="relative w-[150px] h-[150px] md:w-[170px] md:h-[170px] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer group select-none block"
                                        >
                                            {/* Floating Toy Emojis on hover */}
                                            <div className={`absolute ${style.pos1} z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:-rotate-12 pointer-events-none`}>
                                                <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-100 animate-bounce">
                                                    <span className="text-xl drop-shadow-sm">{style.emoji1}</span>
                                                </div>
                                            </div>
                                            <div className={`absolute ${style.pos2} z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-2 group-hover:rotate-12 pointer-events-none`}>
                                                <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-100 animate-bounce" style={{ animationDelay: '0.2s' }}>
                                                    <span className="text-xl drop-shadow-sm">{style.emoji2}</span>
                                                </div>
                                            </div>

                                            {/* Background Playful Shape */}
                                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-0 drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300 group-hover:rotate-1">
                                                <path
                                                    d={style.path}
                                                    fill={finalBg}
                                                    stroke={finalBorder}
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="transition-all duration-300 group-hover:stroke-[3.5px]"
                                                />
                                            </svg>

                                            {/* Brand Logo Container - Generous bounds with NO clipping mask so all logos (e.g. Mattel, Lego, Barbie) fit 100% completely */}
                                            <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-7">
                                                <div className="w-full h-full flex items-center justify-center max-w-[85%] max-h-[70%]">
                                                    <img
                                                        src={brand.logo ? (brand.logo.startsWith('data:') ? brand.logo : (brand.logo.startsWith('/uploads/') ? `${baseUrl}${brand.logo}` : brand.logo)) : 'https://via.placeholder.com/150'}
                                                        alt={brand.name}
                                                        className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Real Customer Stories - Modern, Premium & English */}
            <div className="w-full bg-[#FAF8F5] pt-7 sm:pt-8 md:pt-10 pb-8 sm:pb-9 md:pb-11 border-b border-orange-100/80 relative font-sans">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 relative">

                    {/* Header: Clean, Trustworthy & Beautiful */}
                    <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#E51A22] text-[11.5px] font-black uppercase tracking-wider mb-2.5 border border-rose-200/80 shadow-2xs">
                            <Heart className="w-3.5 h-3.5 fill-[#E51A22]" />
                            Real Parent Experiences
                        </span>
                        <h2 className="text-[26px] sm:text-[34px] md:text-[38px] font-black text-[#1A1A24] leading-tight mb-2 tracking-tight">
                            Loved by Families Across India
                        </h2>
                        <p className="text-slate-600 text-[14px] sm:text-[15.5px] leading-relaxed max-w-xl mx-auto">
                            Honest feedback from parents who trust Little Joys for safe, screen-free, and heirloom-quality toys.
                        </p>

                        {/* Unified Modern Trust Bar */}
                        <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 px-5 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs sm:text-sm font-semibold text-slate-700">
                            <div className="flex items-center gap-1.5">
                                <span className="text-amber-500 font-bold">★★★★★</span>
                                <span className="font-extrabold text-[#1A1A24]">4.9 / 5</span>
                                <span className="text-slate-400 font-normal hidden sm:inline">(1,200+ Reviews)</span>
                            </div>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>100% Verified Buyers</span>
                            </div>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1.5 text-[#E51A22]">
                                <Shield className="w-4 h-4 text-[#E51A22]" />
                                <span>BIS Safe & Non-Toxic</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Slider with Hover-Only Navigation Arrows */}
                    <div className="relative w-full py-2 px-1 sm:px-4 md:px-6 group/reviewSlider">

                        {/* Left Side Arrow Button - Only visible on hover over review slider */}
                        <button
                            onClick={handlePrevTestimonial}
                            className="absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md text-slate-800 hover:bg-[#E51A22] hover:text-white border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 opacity-0 pointer-events-none group-hover/reviewSlider:opacity-100 group-hover/reviewSlider:pointer-events-auto transition-all duration-300 ease-out flex items-center justify-center cursor-pointer -translate-x-3 group-hover/reviewSlider:translate-x-0"
                            title="Previous Review"
                            aria-label="Previous Review"
                        >
                            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                        </button>

                        {/* Right Side Arrow Button - Only visible on hover over review slider */}
                        <button
                            onClick={handleNextTestimonial}
                            className="absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md text-slate-800 hover:bg-[#E51A22] hover:text-white border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 opacity-0 pointer-events-none group-hover/reviewSlider:opacity-100 group-hover/reviewSlider:pointer-events-auto transition-all duration-300 ease-out flex items-center justify-center cursor-pointer translate-x-3 group-hover/reviewSlider:translate-x-0"
                            title="Next Review"
                            aria-label="Next Review"
                        >
                            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                        </button>

                        {testimonials.length > 0 && (
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                onSwiper={(swiper) => {
                                    testimonialSwiperRef.current = swiper;
                                }}
                                spaceBetween={24}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 1.2, spaceBetween: 18 },
                                    768: { slidesPerView: 2, spaceBetween: 20 },
                                    1024: { slidesPerView: 3, spaceBetween: 24 },
                                }}
                                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                loop={testimonials.length >= 3}
                                className="w-full !overflow-hidden pt-3 sm:pt-4 pb-5 px-1 sm:px-2"
                            >
                                {testimonials.map((test, index) => {
                                    const initials = getInitials(test.name);
                                    const avatarColor = avatarColors[index % avatarColors.length];
                                    const hasRealAvatar = test.avatar && !test.avatar.includes('unsplash');
                                    const headlineClean = (test.headline || test.title || 'Wonderful Quality & Safe for Kids!').replace(/^["']|["']$/g, '');

                                    return (
                                        <SwiperSlide key={`${test._id || test.name}-${index}`} className="!h-auto flex py-3.5 px-1">
                                            <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 sm:p-7 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-8px_rgba(229,26,34,0.18)] hover:border-[#E51A22] transition-all duration-300 w-full flex flex-col justify-between h-full relative overflow-hidden group/card cursor-pointer">

                                                {/* Decorative Subtle Quote Watermark */}
                                                <Quote className="absolute right-5 top-5 w-10 h-10 text-slate-100 group-hover/card:text-rose-100/70 transition-colors pointer-events-none opacity-80" />

                                                <div className="relative z-10">
                                                    {/* Top Row: Stars + Rating Number & Verified Badge */}
                                                    <div className="flex items-center justify-between mb-3.5">
                                                        <div className="flex items-center gap-1 text-amber-400">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= (test.rating || 5)
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'fill-slate-200 text-slate-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className="ml-1 text-xs font-bold text-slate-800">5.0</span>
                                                        </div>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                            {test.badge || 'Verified Buyer'}
                                                        </span>
                                                    </div>

                                                    {/* Clean Review Headline */}
                                                    <h3 className="font-extrabold text-[#1A1A24] text-[16px] sm:text-[17px] leading-snug mb-2.5 group-hover/card:text-[#E51A22] transition-colors">
                                                        "{headlineClean}"
                                                    </h3>

                                                    {/* Review Body */}
                                                    <p className="text-slate-600 font-normal text-[13.5px] sm:text-[14px] leading-relaxed line-clamp-4 min-h-[64px]">
                                                        {test.text}
                                                    </p>

                                                </div>

                                                {/* Bottom Footer: Author Profile & Date */}
                                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {hasRealAvatar ? (
                                                            <img
                                                                src={test.avatar}
                                                                alt={test.name}
                                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100 shadow-2xs shrink-0"
                                                            />
                                                        ) : (
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border shadow-2xs shrink-0 ${avatarColor}`}>
                                                                {initials}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <span className="font-extrabold text-[#1A1A24] text-[14.5px] block truncate">
                                                                {test.name}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {test.date && (
                                                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                                                            {test.date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        )}
                    </div>

                    {/* Bottom Action Strip: Real Feedback & Shop Callout */}
                    <div className="mt-6 pt-5 border-t border-orange-100/90 max-w-2xl mx-auto text-center px-4">
                        <p className="text-xs sm:text-sm font-bold text-[#1A1A24] mb-1">
                            Have you shopped with Little Joys? We value your real experience!
                        </p>
                        <p className="text-xs text-slate-500 mb-3.5">
                            Share your feedback with our family team on WhatsApp or explore our most loved toys.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="https://wa.me/918347640423?text=Hello%20Little%20Joys,%20I%20would%20like%20to%20share%20my%20review/feedback!"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-xs transition-all cursor-pointer hover:scale-105"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Share Feedback on WhatsApp
                            </a>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-full shadow-2xs transition-all hover:scale-105"
                            >
                                Explore Best Sellers →
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
