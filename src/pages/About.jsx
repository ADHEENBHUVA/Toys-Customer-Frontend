import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MapPin, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    MessageCircle, 
    ShoppingBag, 
    Truck, 
    RotateCcw,
    Compass,
    CheckCircle2,
    Smile,
    Check,
    Target,
    Eye,
    HeartHandshake,
    Leaf,
    Milestone
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
    // 4 Visual Feature Cards with Real Photos
    const features = [
        {
            title: "100% Solid Natural Wood",
            subtitle: "Neem & Beechwood",
            desc: "Zero MDF, zero toxic glues, and zero plastic odor. Silky hand-sanded edges safe for curious hands.",
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
            badge: "Natural Timber",
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
        },
        {
            title: "Saliva-Safe Food Grade Dyes",
            subtitle: "100% BIS Certified",
            desc: "Babies explore with their mouths first. Organic water-based vegetable colors that never peel or chip.",
            image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
            badge: "Teething Safe",
            badgeColor: "bg-rose-50 text-[#E51A22] border-rose-200"
        },
        {
            title: "Screen-Free Brain Building",
            subtitle: "Open-Ended Montessori",
            desc: "No loud flashing lights or dead-end electronics. The child imagines, balances, builds, and solves.",
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
            badge: "Active Play",
            badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
        },
        {
            title: "Built to Survive Childhood",
            subtitle: "Heirloom Durability",
            desc: "Drop-tested for hard floor crashes and rough toddler play. Made to be proudly passed down to siblings.",
            image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
            badge: "Drop Tested",
            badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
        }
    ];

    // Journey Milestones Data
    const journeyMilestones = [
        {
            year: "2022",
            badge: "The Living Room Spark",
            location: "Surat, Gujarat",
            title: "Frustrated by Screen Time & Fragile Plastic",
            desc: "Tired of noisy plastic toys that broke within days, our founders hand-sanded 10 wooden puzzle sets for their own toddlers at home.",
            highlight: "10 Wooden Prototypes"
        },
        {
            year: "2023",
            badge: "The First Toy Studio",
            location: "Mota Varachha, Surat",
            title: "Open Play Tables & Community Testing",
            desc: "We opened our Surat experience store with a simple premise: children can sit, drop, stack, and test toys freely before parents purchase.",
            highlight: "Surat Flagship Studio"
        },
        {
            year: "2024",
            badge: "Pan-India Reach",
            location: "19,000+ Pin Codes",
            title: "Safe Express Delivery Across India",
            desc: "Word of mouth among conscious mothers grew our community. We instituted shock-proof eco packaging and quick doorstep shipping.",
            highlight: "10,000+ Parcels Shipped"
        },
        {
            year: "Today",
            badge: "A Trusted Movement",
            location: "All Over India",
            title: "15,000+ Happy Homes & Growing",
            desc: "Over 50+ BIS-certified designs, 1,200+ five-star parent reviews, and a steadfast promise to keep childhood active, tactile, and pure.",
            highlight: "15,000+ Screen-Free Homes"
        }
    ];

    // Store & Studio Gallery Photos
    const studioGallery = [
        {
            title: "Open Play Tables",
            tag: "Test Before You Buy",
            image: "/gallery/img2.jpg"
        },
        {
            title: "Curated Toy Displays",
            tag: "Handcrafted in Gujarat",
            image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Carefully Packaged",
            tag: "Shockproof Pan-India Shipping",
            image: "/gallery/img1.jpg"
        },
        {
            title: "Real Child Smiles",
            tag: "15,000+ Happy Families",
            image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1A1A24] font-sans selection:bg-rose-100 selection:text-rose-700">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={[{ label: 'About Us', link: null }]} />

            {/* 1. VISUAL HERO SECTION (Hamleys / Modern E-Commerce Style) */}
            <section className="relative overflow-hidden pt-6 pb-10 sm:pt-8 sm:pb-14 border-b border-orange-100/70 bg-gradient-to-b from-[#FFFDF9] to-[#FAF8F5]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left: Punchy Headline & Visual Stats */}
                        <div className="lg:col-span-6 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-200/90 shadow-2xs text-[#E51A22] text-xs font-black uppercase tracking-wider">
                                <Smile className="w-3.5 h-3.5 fill-[#E51A22]" />
                                <span>A Family Toy Workshop · Surat, Gujarat</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1A1A24] tracking-tight leading-[1.12]">
                                Screen-Free Wonder for Curious <br className="hidden sm:inline" />
                                <span className="text-[#E51A22] relative inline-block">
                                    Little Minds.
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#E51A22]/25 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" fill="transparent"/>
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-xl">
                                We make heirloom wooden toys, Montessori activity sets, and tactile STEM games that replace mindless smartphone scrolling with real living-room curiosity.
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link 
                                    to="/products"
                                    className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-sm sm:text-base font-black py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Explore Handcrafted Toys
                                </Link>
                                <a 
                                    href="https://wa.me/918347640423?text=Hi%20Little%20Joys,%20can%20you%20help%20me%20choose%20a%20toy%20for%20my%20child?" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 text-sm sm:text-base font-bold py-3.5 px-6 rounded-2xl transition-all shadow-2xs hover:shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                    WhatsApp Helpline
                                </a>
                            </div>

                            {/* Trust Stats Bar */}
                            <div className="pt-5 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                                    <span className="block text-2xl font-black text-[#1A1A24]">15,000+</span>
                                    <span className="text-[11.5px] text-slate-500 font-semibold">Indian Homes</span>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                                    <span className="block text-2xl font-black text-emerald-600">100%</span>
                                    <span className="text-[11.5px] text-slate-500 font-semibold">BIS Non-Toxic</span>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                                    <span className="block text-2xl font-black text-amber-500">4.9 ★</span>
                                    <span className="text-[11.5px] text-slate-500 font-semibold">1,200+ Reviews</span>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                                    <span className="block text-2xl font-black text-[#E51A22]">Surat</span>
                                    <span className="text-[11.5px] text-slate-500 font-semibold">Flagship Store</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Dynamic Visual Collage (Hamleys Style) */}
                        <div className="lg:col-span-6 grid grid-cols-12 gap-3 sm:gap-4 relative">
                            {/* Main Large Image */}
                            <div className="col-span-8 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
                                <img 
                                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=900&auto=format&fit=crop" 
                                    alt="Kids playing with wooden train" 
                                    className="w-full aspect-[4/4.5] object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="p-3 bg-white text-xs font-bold text-slate-800 flex items-center justify-between">
                                    <span>🧸 Tested at our Surat Play Tables</span>
                                    <span className="text-[#E51A22]">100% Solid Wood</span>
                                </div>
                            </div>

                            {/* Stacked Small Images */}
                            <div className="col-span-4 space-y-3 sm:space-y-4 flex flex-col justify-between">
                                <div className="rounded-2xl overflow-hidden shadow-md border-3 border-white bg-white group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop" 
                                        alt="Toddler stacking wooden rings" 
                                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="rounded-2xl overflow-hidden shadow-md border-3 border-white bg-white group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop" 
                                        alt="Child building blocks tower" 
                                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* Floating Reassurance Badge */}
                            <div className="absolute -bottom-3 left-6 sm:left-10 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl py-2 px-4 shadow-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-black text-slate-900">Saliva-Safe & Non-Toxic</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. OUR VISION & OUR MISSION (Handcrafted, Human-Centered, NOT Generic AI) */}
            <section className="pt-8 pb-5 md:pt-10 md:pb-6 max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
                    <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                        <Compass className="w-3.5 h-3.5 text-[#E51A22]" />
                        Our Purpose & Guiding Principles
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight">
                        Built for Wonder. Crafted for Real Childhoods.
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        We don't manufacture disposable plastic knick-knacks. We build sensory childhood memories that nurture genuine creativity and survive generations.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                    {/* Vision Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 md:p-8 border-2 border-rose-100 shadow-2xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group">
                        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-rose-50 rounded-full blur-2xl pointer-events-none -z-0"></div>
                        
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E51A22] border border-rose-200 text-xs font-black uppercase tracking-wider">
                                    <Eye className="w-3.5 h-3.5" />
                                    Our Vision
                                </span>
                                <span className="text-xs font-bold text-slate-400">Where We Are Going</span>
                            </div>

                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#1A1A24] leading-snug">
                                Nurturing 100,000+ screen-free, wonder-filled childhoods across Indian homes.
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                In a world where toddlers are handed touchscreens before they can walk, we envision living rooms filled once again with the clatter of wooden blocks, curious giggles, and focused hands-on problem solving.
                            </p>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 md:p-8 border-2 border-emerald-100 shadow-2xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group">
                        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-50 rounded-full blur-2xl pointer-events-none -z-0"></div>

                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                                    <Target className="w-3.5 h-3.5" />
                                    Our Mission
                                </span>
                                <span className="text-xs font-bold text-slate-400">What We Build Every Day</span>
                            </div>

                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#1A1A24] leading-snug">
                                Crafting safe, heirloom-quality developmental toys that parents trust unconditionally.
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                We combine age-old Gujarat carpentry with modern child development research. Every edge is hand-beveled, every coat is tested against saliva, and every design sparks open-ended thinking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Parent Promise Strip */}
                <div className="mt-5 bg-gradient-to-r from-amber-50/70 via-orange-50/70 to-rose-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block">The Little Joys Family Pledge</span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                "If a toy is not 100% safe, durable, and inspiring enough for our own children in Surat, it will never enter our shelves."
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/products"
                        className="shrink-0 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                    >
                        See the Collection
                        <ArrowRight className="w-3.5 h-3.5 text-[#E51A22]" />
                    </Link>
                </div>
            </section>

            {/* 3. THE 4 REASONS PARENTS CHOOSE US (Visual Photo Cards - Clickable Links) */}
            <section className="py-7 md:py-9 bg-white border-y border-orange-100/80">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-7 gap-3">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block mb-1.5">
                                The Little Joys Standard
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight">
                                Why Indian Parents Trust Us
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
                            Every single toy is designed for real play, drop durability, and zero screens.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((item, idx) => (
                            <Link 
                                to="/products"
                                key={idx}
                                className="bg-[#FAF8F5] border-2 border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E51A22] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer block text-inherit no-underline"
                            >
                                {/* Card Photo Header */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className={`absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-xs ${item.badgeColor}`}>
                                        {item.badge}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                            {item.subtitle}
                                        </span>
                                        <h3 className="font-black text-base sm:text-lg text-[#1A1A24] group-hover:text-[#E51A22] transition-colors leading-snug mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#E51A22]">
                                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> BIS Compliant
                                        </span>
                                        <span className="flex items-center gap-1 text-[#E51A22] group-hover:underline">
                                            Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. OUR JOURNEY (Milestone Cards - Real, Grounded & Human) */}
            <section className="py-7 md:py-9 max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                    <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                        <Milestone className="w-3.5 h-3.5 text-[#E51A22]" />
                        Our Journey & Milestones
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight">
                        From a Living Room in Surat to 15,000+ Homes
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">
                        How a simple parenting problem grew into one of Gujarat's most loved wooden toy brands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {journeyMilestones.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#E51A22] transition-all flex flex-col justify-between group relative"
                        >
                            <div>
                                {/* Year Header with pill badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-black text-[#E51A22] tracking-tight">
                                        {step.year}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {step.badge}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                                    <MapPin className="w-3 h-3 text-[#E51A22]" />
                                    <span>{step.location}</span>
                                </div>

                                <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#E51A22] transition-colors leading-snug mb-2.5">
                                    {step.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                    {step.desc}
                                </p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                    {step.highlight}
                                </span>
                                <span className="text-slate-400 font-black">
                                    0{idx + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. VISUAL PHOTO GALLERY & SURAT FLAGSHIP STORE */}
            <section className="py-7 md:py-9 bg-white border-t border-orange-100/80">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="text-center max-w-xl mx-auto mb-6 sm:mb-7">
                        <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block mb-1.5">
                            Surat Flagship Studio
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight">
                            Come Sit, Touch & Play with Us
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600">
                            We have dedicated open play tables where kids can build and test toys freely.
                        </p>
                    </div>

                    {/* 4-Image Grid Showcase */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-8">
                        {studioGallery.map((item, idx) => (
                            <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4 text-white">
                                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{item.tag}</span>
                                    <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Store Address & Contact Card */}
                    <div className="bg-[#FAF8F5] border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8 space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E51A22] text-xs font-bold">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Physical Experience Store</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                                    Little Joys Experience Store · Mota Varachha, Surat
                                </h3>
                                <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                                    <p><strong>Address:</strong> Tulsi Arcade, Sudama Chowk, Mota Varachha, Surat, Gujarat 394101</p>
                                    <p><strong>Timings:</strong> Monday to Saturday: 10:00 AM – 8:30 PM (Sunday by appointment)</p>
                                    <p><strong>Direct Helpline / WhatsApp:</strong> +91 8347640423</p>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <a 
                                    href="https://maps.google.com/?q=Tulsi+Arcade,+Sudama+Chowk,+Mota+Varachha,+Surat"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#1A1A24] hover:bg-black text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Compass className="w-4 h-4" />
                                    Get Directions on Google Maps
                                </a>
                                <a 
                                    href="https://wa.me/918347640423?text=Hello%20Little%20Joys%20Store"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp Store Team
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
