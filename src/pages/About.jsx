import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    MapPin, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    MessageCircle, 
    ShoppingBag, 
    Compass, 
    CheckCircle2, 
    Smile, 
    Check, 
    Target, 
    Eye, 
    HeartHandshake, 
    Leaf, 
    Milestone, 
    Clock, 
    Phone 
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
    // Interactive tab for Our Vision pillars
    const [activeVisionTab, setActiveVisionTab] = useState(0);

    // Interactive milestone selection for Our Journey
    const [activeMilestone, setActiveMilestone] = useState(0);

    // Scroll-driven Toy Car position and direction state
    const journeySectionRef = useRef(null);
    const roadPathRef = useRef(null);
    const [carScrollProgress, setCarScrollProgress] = useState(0);
    const [carDirection, setCarDirection] = useState('down'); // 'down' (moving down towards 2026+) | 'up' (moving up towards 2022)
    const drivingDirectionRef = useRef('down');
    const prevProgressRef = useRef(0);
    const [carPos, setCarPos] = useState({ x: 60, y: 40, angle: 25 });

    // Track scroll down the Journey Section to drive the Toy Car forward/backward along vertical zigzag road
    useEffect(() => {
        const handleScroll = () => {
            if (!journeySectionRef.current) return;
            const rect = journeySectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalDistance = rect.height - windowHeight;
            
            if (totalDistance <= 0) return;
            
            // Calculate scroll progress from 0 (entry) to 1 (exit)
            const rawProgress = -rect.top / totalDistance;
            const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
            setCarScrollProgress(clampedProgress);
            
            // Detect driving direction:
            // When moving top to bottom -> 'down' (Modhu faces downwards in direction of movement)
            // When moving bottom to top -> 'up' (Modhu faces upwards in direction of movement)
            const scrollDelta = clampedProgress - prevProgressRef.current;
            if (scrollDelta > 0.001) {
                drivingDirectionRef.current = 'down';
                setCarDirection('down');
            } else if (scrollDelta < -0.001) {
                drivingDirectionRef.current = 'up';
                setCarDirection('up');
            }
            prevProgressRef.current = clampedProgress;

            // Map progress to milestone 0..4 (2022 -> 2023 -> 2024 -> 2025 -> 2026+)
            const milestoneIndex = Math.min(Math.floor(clampedProgress * 5), 4);
            setActiveMilestone(milestoneIndex);

            // Calculate precise position and steering angle along the vertical zigzag SVG road
            if (roadPathRef.current) {
                try {
                    const path = roadPathRef.current;
                    const totalLength = path.getTotalLength();
                    if (totalLength > 0) {
                        const currentLen = clampedProgress * totalLength;
                        const pt = path.getPointAtLength(currentLen);
                        const delta = 4;
                        const nextPt = path.getPointAtLength(Math.min(currentLen + delta, totalLength));
                        const prevPt = path.getPointAtLength(Math.max(currentLen - delta, 0));
                        const angleRad = Math.atan2(nextPt.y - prevPt.y, nextPt.x - prevPt.x);
                        let angleDeg = angleRad * (180 / Math.PI);

                        // Jayre Car Upper Thi Niche Ni taraf jaay tyare Modhu Niche,
                        // and Jyare Niche Thi Upper taraf aave tyare Modhu Upper:
                        if (drivingDirectionRef.current === 'up') {
                            angleDeg = angleDeg + 180;
                        }

                        setCarPos({ x: pt.x, y: pt.y, angle: angleDeg });
                    }
                } catch {
                    // Fallback if SVG path methods are pending
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smoothly scroll to milestone when user clicks any year button
    const jumpToMilestone = (idx) => {
        if (idx > activeMilestone) {
            drivingDirectionRef.current = 'down';
            setCarDirection('down');
        } else if (idx < activeMilestone) {
            drivingDirectionRef.current = 'up';
            setCarDirection('up');
        }
        setActiveMilestone(idx);
        if (!journeySectionRef.current) return;
        const rect = journeySectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalDistance = rect.height - windowHeight;
        if (totalDistance > 0) {
            const targetScrollTop = window.scrollY + rect.top + (idx / 4) * totalDistance + 10;
            window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        }
    };

    // 3 Deep Pillars of Our Vision
    const visionPillars = [
        {
            id: "screen-free",
            badge: "Pillar 01",
            icon: Eye,
            title: "Reclaiming Wonder from Screens",
            shortDesc: "Replacing 2+ hours of daily smartphone trance with tactile living-room wonder.",
            quote: "A screen tells a child what to think. A wooden block asks a child what can be built.",
            points: [
                "Open-ended Montessori designs that don't beep or blink",
                "Proven to improve fine motor grip, spatial logic & focus span",
                "Empowers self-directed play where the child is the creator"
            ],
            stat: "84% Less Screen Time",
            statDesc: "Reported by parents after block play"
        },
        {
            id: "heirloom-craft",
            badge: "Pillar 02",
            icon: ShieldCheck,
            title: "Heirloom Purity & Natural Safety",
            shortDesc: "100% solid timber, organic vegetable dyes, and zero toxic plasticizers.",
            quote: "Babies explore with their mouths first. If a toy isn't safe enough to teethe on, it has no place in a home.",
            points: [
                "Zero toxic MDF, formaldehyde glues, or cheap PVC plastics",
                "Certified saliva-safe food-grade vegetable dyes and beeswax polish",
                "Triple drop-tested on tile floors to outlive rough toddlerhood"
            ],
            stat: "100% BIS Certified",
            statDesc: "Tested under Indian Toy Safety IS 9873"
        },
        {
            id: "artisan-heritage",
            badge: "Pillar 03",
            icon: HeartHandshake,
            title: "Dignity for Traditional Artisans",
            shortDesc: "Marrying Gujarat's centuries-old woodturning heritage with child neuroscience.",
            quote: "Every toy carries the gentle touch of seasoned artisans who have shaped timber for three generations.",
            points: [
                "Supporting local woodturners and craft communities in Gujarat",
                "Ethically sourced, sustainably harvested native neem and beechwood",
                "Fair living wages, safe workshops, and zero assembly-line sweatshops"
            ],
            stat: "50+ Artisan Families",
            statDesc: "Sustained with pride and fair wages"
        }
    ];

    // Comprehensive Journey Milestones with Real Human Details
    const journeyMilestones = [
        {
            year: "2022",
            season: "Winter 2022",
            stage: "The Living Room Spark",
            location: "Surat, Gujarat",
            icon: "🪵",
            title: "Heartbroken by Broken Plastic & Phone Trances",
            story: "It started in our own home in Surat. Every festive season, well-meaning relatives gifted flashy plastic toys that broke within 48 hours, littered the floor with sharp plastic shards, and gave off a foul chemical smell. Worst of all, our toddlers would quickly abandon them and reach for smartphones.",
            turningPoint: "Our founder, Adheen Bhuva, bought seasoned beechwood blocks from local artisans, hand-beveled the edges at the kitchen table, and gave them to his daughter. She built, stacked, and giggled for 45 minutes straight — without once asking for a screen.",
            highlight: "10 Hand-Carved Puzzles",
            highlightSub: "Built for family and neighborhood toddlers",
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
            tag: "Ground Zero"
        },
        {
            year: "2023",
            season: "Monsoon 2023",
            stage: "The Flagship Experience Studio",
            location: "Mota Varachha, Surat",
            icon: "🏪",
            title: "The Open-Play Philosophy: 'Test Before You Buy'",
            story: "Parents in Surat kept asking where they could buy these handmade sets. Instead of opening a conventional packed retail store, we designed an open-play studio at Tulsi Arcade, Sudama Chowk. We placed low wooden play tables where children could sit on the floor, drop, bang, and test every single toy freely.",
            turningPoint: "Surat mothers fell in love with the honesty. If a child didn't naturally connect with a toy after 15 minutes of play, we advised parents not to buy it.",
            highlight: "First 1,000 Happy Families",
            highlightSub: "Pure organic word-of-mouth in Surat",
            image: "/gallery/img2.jpg",
            tag: "Community Roots"
        },
        {
            year: "2024",
            season: "Spring 2024",
            stage: "Pan-India Expansion & BIS Standard",
            location: "19,000+ Pincodes",
            icon: "📦",
            title: "Strict Indian Safety Certification & Zero-Plastic Packaging",
            story: "As recommendations spread across parent WhatsApp groups and pediatric clinics, orders poured in from Mumbai, Bengaluru, Delhi, Ahmedabad, and small tier-2 towns. We refused to cut corners: every design was sent for rigorous laboratory testing under IS 9873 to achieve 100% BIS certification.",
            turningPoint: "We designed custom shockproof honeycomb paper packaging — eliminating single-use bubble wrap and plastic tape completely.",
            highlight: "10,000+ Parcels Shipped",
            highlightSub: "Zero plastic transit packaging",
            image: "/gallery/img1.jpg",
            tag: "Pan-India Trust"
        },
        {
            year: "2025",
            season: "Current Phase",
            stage: "15,000+ Screen-Free Homes",
            location: "All Over India",
            icon: "🌟",
            title: "Recommended by Pediatricians & Montessori Educators",
            story: "Today, Little Joys is trusted in over 15,000 homes across India. More than 40 Montessori preschools and developmental pediatricians use our stacking arches, sensory rattle pegs, and tactile counting boards in their classrooms and therapy sessions.",
            turningPoint: "Over 1,200 verified five-star parent reviews, with 94% of parents reporting noticeable improvements in child focus and independent play time.",
            highlight: "15,000+ Active Homes",
            highlightSub: "1,200+ Verified 5-Star Reviews",
            image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
            tag: "Movement of Trust"
        },
        {
            year: "2026+",
            season: "The Horizon",
            stage: "The 100,000 Wonder Mission",
            location: "Bharat & Beyond",
            icon: "🚀",
            title: "Bringing Real Play Back to 100,000 Indian Children",
            story: "Our dream is ambitious yet simple: to help 100,000 Indian families experience the irreplaceable joy of tactile childhood memories. We are expanding into bilingual Indian story-toys, sustainable sensory toys, and free open-play toy libraries in rural schools.",
            turningPoint: "Because childhood only happens once — and it deserves to be remembered by the smell of natural wood and joyful giggles, not blue screen light.",
            highlight: "100K Wonder Goal",
            highlightSub: "Screen-Free Play for Every Child",
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
            tag: "The Future"
        }
    ];

    // Real Store & Workshop Gallery
    const storeGallery = [
        {
            image: "/gallery/img2.jpg",
            title: "Low Play Tables",
            subtitle: "Kids sit & test freely",
            badge: "Surat Studio"
        },
        {
            image: "/gallery/img1.jpg",
            title: "Honeycomb Packaging",
            subtitle: "Zero plastic transit wrap",
            badge: "Logistics"
        },
        {
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80",
            title: "Artisan Hand-Sanding",
            subtitle: "320-grit silk finish",
            badge: "Carpentry"
        },
        {
            image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
            title: "Saliva-Safe Finishing",
            subtitle: "Plant extract colors",
            badge: "Non-Toxic"
        }
    ];

    return (
        <div className="bg-[#FAF7F2] min-h-screen text-[#1A1A24] font-sans selection:bg-rose-100 selection:text-rose-700 w-full relative overflow-clip">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={[{ label: 'About Us', link: null }]} />

            {/* ======================================================== */}
            {/* 1. HERO: FULL-WIDTH BALANCED & FLUID (NO EMPTY SIDES)    */}
            {/* ======================================================== */}
            <section className="relative overflow-hidden pt-5 pb-8 sm:pt-8 sm:pb-12 border-b border-amber-200/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE6] w-full">
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        
                        {/* Left Column */}
                        <div className="lg:col-span-7 space-y-4">
                            
                            {/* Artisan Stamp Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-amber-200/90 shadow-2xs text-amber-900 text-xs font-black uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[#E51A22] animate-pulse"></span>
                                <span>A Family Toy Workshop · Surat, Gujarat</span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl md:text-[44px] font-black text-[#1A1A24] tracking-tight leading-[1.15]">
                                Childhood was meant to be{' '}
                                <span className="relative inline-block text-[#E51A22]">
                                    felt, stacked & dropped,
                                    <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#E51A22]/25 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 15 Q 50 2 100 15" stroke="currentColor" strokeWidth="6" fill="transparent"/>
                                    </svg>
                                </span>
                                <br />not swiped on glass.
                            </h1>

                            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-2xl">
                                We are parents from Surat who got tired of noisy plastic gadgets that break in two days. 
                                We hand-finish heirloom wooden toys and Montessori sets that spark real, quiet curiosity and survive generations.
                            </p>

                            {/* Compact Founder Reassurance Strip */}
                            <div className="p-3 sm:p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs flex items-center gap-3.5 max-w-2xl">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0 text-xs border border-amber-300">
                                    LJ
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-black text-slate-900">Founder Note</h4>
                                        <span className="text-[10px] font-bold text-[#E51A22] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Adheen Bhuva</span>
                                    </div>
                                    <p className="text-xs text-slate-600 italic leading-relaxed mt-0.5">
                                        "If it's not 100% safe, durable, and inspiring for my own daughter, it will never leave our Surat workshop."
                                    </p>
                                </div>
                            </div>

                            {/* Compact Action Buttons */}
                            <div className="pt-1 flex flex-wrap items-center gap-3">
                                <Link 
                                    to="/products"
                                    className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs sm:text-sm font-black py-2.5 px-6 rounded-xl shadow-xs hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Explore Handcrafted Toys
                                </Link>
                                <a 
                                    href="https://wa.me/918347640423?text=Hi%20Little%20Joys,%20I%20want%20to%20learn%20more%20about%20your%20wooden%20toys!" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    WhatsApp Helpline
                                </a>
                            </div>

                            {/* Trust Stats Bar */}
                            <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                                <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center sm:text-left">
                                    <span className="block text-xl font-black text-[#1A1A24]">15,000+</span>
                                    <span className="text-[11px] text-slate-500 font-semibold">Indian Homes</span>
                                </div>
                                <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center sm:text-left">
                                    <span className="block text-xl font-black text-emerald-600">100%</span>
                                    <span className="text-[11px] text-slate-500 font-semibold">BIS Certified</span>
                                </div>
                                <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center sm:text-left">
                                    <span className="block text-xl font-black text-amber-600">4.9 ★</span>
                                    <span className="text-[11px] text-slate-500 font-semibold">1,200+ Reviews</span>
                                </div>
                                <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center sm:text-left">
                                    <span className="block text-xl font-black text-[#E51A22]">Surat</span>
                                    <span className="text-[11px] text-slate-500 font-semibold">Store Studio</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Wide Balanced Photo Display) */}
                        <div className="lg:col-span-5">
                            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-md space-y-2.5">
                                <div className="relative rounded-xl overflow-hidden aspect-[16/11] max-h-[310px] w-full bg-slate-100 group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop" 
                                        alt="Child playing with wooden toys in living room" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs font-black text-slate-900">
                                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Solid Natural Beechwood</span>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                                        Surat Experience Studio
                                    </div>
                                </div>

                                {/* Mini Highlights */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-left">
                                        <span className="text-[10px] font-extrabold uppercase text-amber-900 block">Open Play Tables</span>
                                        <span className="text-xs text-slate-600">Test before you buy</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-left">
                                        <span className="text-[10px] font-extrabold uppercase text-[#E51A22] block">Zero Sharp Burrs</span>
                                        <span className="text-xs text-slate-600">Hand-sanded 320 grit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ======================================================== */}
            {/* 2. OUR VISION: FLUID FULL-WIDTH ARCHITECTURE             */}
            {/* ======================================================== */}
            <section className="py-8 sm:py-12 bg-white border-b border-amber-100/80 w-full">
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
                        <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 shadow-2xs">
                            <Eye className="w-3.5 h-3.5 text-[#E51A22]" />
                            Our Vision For Indian Childhood
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A24] tracking-tight">
                            Building a Generation of Thinkers, Not Swipers.
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                            Giving children back the tactile, screen-free wonder that builds deep minds and peaceful living rooms.
                        </p>
                    </div>

                    {/* Interactive 3-Pillar Vision Architecture */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
                        
                        {/* Left: Pillar Selectors */}
                        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
                            {visionPillars.map((pillar, idx) => {
                                const IconComp = pillar.icon;
                                const isSelected = activeVisionTab === idx;
                                return (
                                    <button
                                        key={pillar.id}
                                        onClick={() => setActiveVisionTab(idx)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                                            isSelected 
                                                ? 'bg-white border-[#E51A22] shadow-sm scale-[1.01]' 
                                                : 'bg-[#FAF7F2] border-slate-200/80 hover:bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E51A22]"></div>
                                        )}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            isSelected ? 'bg-rose-50 text-[#E51A22]' : 'bg-slate-200/70 text-slate-600'
                                        }`}>
                                            <IconComp className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${
                                                    isSelected ? 'text-[#E51A22]' : 'text-slate-400'
                                                }`}>
                                                    {pillar.badge}
                                                </span>
                                                {isSelected && (
                                                    <span className="text-[10px] bg-rose-100 text-[#E51A22] font-extrabold px-2 py-0.5 rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 leading-snug">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-normal">
                                                {pillar.shortDesc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: Expanded Active Pillar Showcase Card */}
                        <div className="lg:col-span-8 bg-[#FFFDF9] rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900">
                                            {visionPillars[activeVisionTab].badge}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900">
                                            {visionPillars[activeVisionTab].title}
                                        </h3>
                                    </div>
                                    <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
                                        <span className="text-sm font-black text-[#E51A22] block leading-none">
                                            {visionPillars[activeVisionTab].stat}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-semibold">
                                            {visionPillars[activeVisionTab].statDesc}
                                        </span>
                                    </div>
                                </div>

                                {/* Deep Philosophical Quote */}
                                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                                    <p className="text-xs sm:text-sm font-bold text-amber-950 italic">
                                        "{visionPillars[activeVisionTab].quote}"
                                    </p>
                                </div>

                                {/* Core Commitments List */}
                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                        Concrete Commitments
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {visionPillars[activeVisionTab].points.map((pt, i) => (
                                            <div key={i} className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-200/90">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                <span className="text-xs text-slate-700 font-medium leading-relaxed">
                                                    {pt}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer with Direct Call to Action */}
                            <div className="mt-5 pt-3.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium text-xs">
                                    Explore developmental toys built under this pillar
                                </span>
                                <Link
                                    to="/products"
                                    className="bg-slate-900 hover:bg-black text-white text-xs font-black py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    Explore Toys
                                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ======================================================== */}
            {/* 3. SCROLL-DRIVEN VERTICAL ZIGZAG ROAD & ONLY ACTIVE YEAR */}
            {/*    ઊભો ઝિગઝૅગ રોડ અને જ્યાં કાર પહોંચે ફક્ત તે જ વર્ષ!   */}
            {/* ======================================================== */}
            <section 
                ref={journeySectionRef} 
                className="relative w-full h-[280vh] bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-y border-amber-200/60"
            >
                {/* STICKY FULL SCREEN SHOWCASE: Perfectly fits inside viewport without being cut off */}
                <div className="sticky top-[138px] md:top-[142px] w-full flex flex-col justify-center pt-1 pb-3 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
                    
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[#E51A22] text-[11px] font-black uppercase tracking-wider mb-0.5 shadow-2xs">
                            <Milestone className="w-3 h-3 text-[#E51A22]" />
                            <span>Our Journey · Winding Zigzag Road</span>
                            <span className="bg-[#E51A22] text-white text-[9px] px-2 py-0.2 rounded-full font-bold ml-1 animate-pulse">
                                🚗 Scroll Driven Moter
                            </span>
                        </div>
                        <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1A1A24] tracking-tight">
                            From 10 Handmade Blocks in Surat to 15,000+ Homes.
                        </h2>
                        <p className="text-[11px] text-slate-600 font-semibold flex items-center justify-center gap-1">
                            <span className="inline-block animate-bounce text-amber-700">👇</span> 
                            <span>જેમ નીચે સ્ક્રોલ કરશો તેમ મોટર ઊભા ઝિગઝૅગ રોડ પર આગળ વધશે અને જ્યાં કાર પહોંચશે ફક્ત તે જ વર્ષ દેખાશે!</span>
                        </p>
                    </div>

                    {/* MAIN 2-COLUMN SHOWCASE: Left = Vertical Zigzag Road | Right = Complete Active Year */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
                        
                        {/* LEFT COLUMN: THE VERTICAL ZIGZAG ROAD (UBHO ZIGZAG ROAD) */}
                        <div className="lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/90 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-300/80 shadow-md flex flex-col justify-between relative overflow-hidden">
                            
                            {/* Top Strip */}
                            <div className="flex items-center justify-between text-[11px] font-black text-slate-600 mb-1 border-b border-amber-200/80 pb-1">
                                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                                    🏁 2022 Start · Surat
                                </span>
                                <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                                    {Math.round(carScrollProgress * 100)}% Driven
                                </span>
                            </div>

                            {/* SVG Vertical Zigzag Road Canvas */}
                            <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] flex items-center justify-center">
                                <svg viewBox="0 0 320 540" className="w-full h-full overflow-visible">
                                    <defs>
                                        {/* Road Progress Glow Gradient */}
                                        <linearGradient id="roadProgressGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#F59E0B" />
                                            <stop offset="50%" stopColor="#FB923C" />
                                            <stop offset="100%" stopColor="#E11D48" />
                                        </linearGradient>

                                        {/* Moter Rich Wooden Car Gradient */}
                                        <linearGradient id="zzMoterRed" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#991B1B" />
                                            <stop offset="35%" stopColor="#DC2626" />
                                            <stop offset="70%" stopColor="#EF4444" />
                                            <stop offset="100%" stopColor="#B91C1C" />
                                        </linearGradient>

                                        {/* Golden Headlight Projected Beam Gradient */}
                                        <linearGradient id="carHeadlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                                            <stop offset="50%" stopColor="#FDE047" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* 1. Outer Racing Curbs (Red and White striped border around curves) */}
                                    <path 
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="#BE123C" 
                                        strokeWidth="56" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="filter drop-shadow-md"
                                    />
                                    <path 
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="#FFFFFF" 
                                        strokeWidth="52" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        strokeDasharray="14 14"
                                    />

                                    {/* 2. Dark Asphalt Highway Road Bed */}
                                    <path 
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="#0F172A" 
                                        strokeWidth="42" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />

                                    {/* 3. The Reference Path for Car Steering & Position */}
                                    <path 
                                        ref={roadPathRef}
                                        id="verticalZigzagRoadPath"
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="none" 
                                    />

                                    {/* 4. Golden Progress Trace (Illuminates the road path behind the car) */}
                                    <path 
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="url(#roadProgressGlow)" 
                                        strokeWidth="42" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        strokeDasharray="1600"
                                        strokeDashoffset={`${1600 * (1 - carScrollProgress)}`}
                                        opacity="0.3"
                                    />

                                    {/* 5. White Dashed Center Line */}
                                    <path 
                                        d="M 60 40 C 240 40, 260 100, 260 160 C 260 220, 60 220, 60 280 C 60 340, 260 340, 260 400 C 260 465, 160 465, 160 505" 
                                        fill="none" 
                                        stroke="#FFFFFF" 
                                        strokeWidth="2.5" 
                                        strokeDasharray="12 12" 
                                        opacity="0.9"
                                    />

                                    {/* 6. Waypoint Stations along the Zigzag Curves */}
                                    {[
                                        { x: 60, y: 40, year: "2022", icon: "🪵" },
                                        { x: 260, y: 160, year: "2023", icon: "🏪" },
                                        { x: 60, y: 280, year: "2024", icon: "📦" },
                                        { x: 260, y: 400, year: "2025", icon: "🌟" },
                                        { x: 160, y: 505, year: "2026+", icon: "🚀" },
                                    ].map((pt, idx) => {
                                        const isCurrent = activeMilestone === idx;
                                        return (
                                            <g key={idx} onClick={() => jumpToMilestone(idx)} className="cursor-pointer">
                                                {isCurrent && (
                                                    <circle cx={pt.x} cy={pt.y} r="24" fill="#E51A22" opacity="0.3" className="animate-ping" />
                                                )}
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r={isCurrent ? "16" : "11"} 
                                                    fill={isCurrent ? "#E51A22" : "#1E293B"} 
                                                    stroke="#FFFFFF" 
                                                    strokeWidth={isCurrent ? "3" : "2"}
                                                    className="transition-all duration-300"
                                                />
                                                <text 
                                                    x={pt.x} 
                                                    y={pt.y + 4} 
                                                    textAnchor="middle" 
                                                    fontSize={isCurrent ? "12" : "9"} 
                                                    fontWeight="900" 
                                                    fill="#FFFFFF"
                                                >
                                                    {pt.icon}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* 7. LIVE STEERING RED WOODEN TOY CAR (MODHU FACES MOVEMENT DIRECTION) */}
                                    <g 
                                        style={{ 
                                             transform: `translate(${carPos.x}px, ${carPos.y}px) rotate(${carPos.angle}deg)`,
                                             transition: 'transform 0.12s linear'
                                        }}
                                        className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] cursor-pointer"
                                    >
                                        {/* Soft Under-chassis Ambient Shadow */}
                                        <ellipse cx="0" cy="0" rx="26" ry="14" fill="#000000" opacity="0.25" />

                                        {/* 4 Chunky Toy Tires with Beechwood Hubcaps */}
                                        <rect x="7" y="-16" width="12" height="5" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
                                        <circle cx="13" cy="-13.5" r="1.5" fill="#F59E0B" />
                                        <rect x="-19" y="-16" width="12" height="5" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
                                        <circle cx="-13" cy="-13.5" r="1.5" fill="#F59E0B" />
                                        <rect x="7" y="11" width="12" height="5" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
                                        <circle cx="13" cy="13.5" r="1.5" fill="#F59E0B" />
                                        <rect x="-19" y="11" width="12" height="5" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
                                        <circle cx="-13" cy="13.5" r="1.5" fill="#F59E0B" />

                                        {/* Golden Headlight Glow Cone (Shines forward from car's front!) */}
                                        <polygon points="24,-9 65,-20 65,20 24,9" fill="url(#carHeadlightBeam)" opacity="0.55" />

                                        {/* Wooden Toy Roadster Body (Front tapered at +X) */}
                                        <path 
                                            d="M -24 -11 C -26 -11, -26 11, -24 11 L 12 12 C 22 12, 25 7, 25 0 C 25 -7, 22 -12, 12 -12 Z" 
                                            fill="url(#zzMoterRed)" 
                                            stroke="#5B0F15" 
                                            strokeWidth="1.6" 
                                        />

                                        {/* Sporty Racing Stripes on Hood */}
                                        <path d="M 6 -3 L 22 -2.5 L 22 -1 L 6 -1.2 Z" fill="#FEF08A" opacity="0.9" />
                                        <path d="M 6 1.2 L 22 1 L 22 2.5 L 6 3 Z" fill="#FEF08A" opacity="0.9" />

                                        {/* Front Chrome/Brass Grille at Modhu */}
                                        <rect x="23.5" y="-5.5" width="2" height="11" rx="1" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />

                                        {/* Curved Glass Windshield */}
                                        <path d="M -1 -9 C 3 -9, 5 -6, 5 0 C 5 6, 3 9, -1 9 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.9" opacity="0.9" />

                                        {/* Wooden Cockpit Rim */}
                                        <ellipse cx="-7" cy="0" rx="8" ry="7" fill="#7F1D1D" stroke="#450A0A" strokeWidth="0.8" />

                                        {/* Little Joys Peg Doll Driver (Pilot) */}
                                        <circle cx="-7" cy="0" r="4.8" fill="#FED7AA" stroke="#9A3412" strokeWidth="0.8" />
                                        <circle cx="-7" cy="-1.5" r="4" fill="#0284C7" />
                                        {/* Aviator Goggles */}
                                        <rect x="-6" y="-3.5" width="4.5" height="2.5" rx="1" fill="#FEF08A" stroke="#B45309" strokeWidth="0.6" />

                                        {/* Dual Front Headlights (Modhu) */}
                                        <circle cx="23" cy="-7" r="2.8" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />
                                        <circle cx="23" cy="7" r="2.8" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />
                                        <circle cx="23.5" cy="-7" r="1.2" fill="#FFFFFF" />
                                        <circle cx="23.5" cy="7" r="1.2" fill="#FFFFFF" />

                                        {/* Dual Rear Ruby Tail Lights (Brake lights at back) */}
                                        <circle cx="-24.5" cy="-6" r="2" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.6" />
                                        <circle cx="-24.5" cy="6" r="2" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.6" />

                                        {/* Rear Toy Spoiler */}
                                        <rect x="-26" y="-9" width="3" height="18" rx="1.5" fill="#7F1D1D" stroke="#450A0A" strokeWidth="0.7" />
                                    </g>
                                </svg>

                                {/* Floating Live Indicator: Year where the car is! */}
                                <div 
                                    className="absolute z-30 pointer-events-none transition-all duration-150"
                                    style={{
                                        left: `${(carPos.x / 320) * 100}%`,
                                        top: `${(carPos.y / 540) * 100}%`,
                                        transform: 'translate(-50%, -170%)'
                                    }}
                                >
                                    <div className="bg-slate-900/95 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xl border border-amber-400 whitespace-nowrap flex items-center gap-1 backdrop-blur-xs">
                                        <span>🚗</span>
                                        <span>{journeyMilestones[activeMilestone].year} Moter</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Strip */}
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-600 mt-1 border-t border-amber-200/80 pt-1">
                                <span className="flex items-center gap-1 text-[#E51A22] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                    🏁 2026+ 100K Homes Goal
                                </span>
                                <span className="text-slate-500 font-bold">
                                    Stop 0{activeMilestone + 1} of 05
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ONLY ACTIVE YEAR STORY SHOWCASE (100% VISIBLE WITHIN VIEWPORT) */}
                        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border-2 border-amber-200/90 shadow-xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4">
                            
                            {/* Top Bar: Active Year, Season, Location, Prev/Next Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl font-black text-[#E51A22] bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-xl shadow-2xs">
                                        {journeyMilestones[activeMilestone].year}
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                        {journeyMilestones[activeMilestone].season}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                        <MapPin className="w-3 h-3 text-[#E51A22]" />
                                        <span>{journeyMilestones[activeMilestone].location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => jumpToMilestone(activeMilestone > 0 ? activeMilestone - 1 : 0)}
                                            disabled={activeMilestone === 0}
                                            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
                                        >
                                            ← Prev
                                        </button>
                                        <button
                                            onClick={() => jumpToMilestone(activeMilestone < journeyMilestones.length - 1 ? activeMilestone + 1 : 4)}
                                            disabled={activeMilestone === journeyMilestones.length - 1}
                                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-black disabled:opacity-40 cursor-pointer shadow-2xs"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Balanced 2-Column Content: Left Story | Right Media & Milestone */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 my-auto py-2 items-center">
                                
                                {/* Left Story Column */}
                                <div className="md:col-span-7 space-y-2">
                                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                                        {journeyMilestones[activeMilestone].title}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                        {journeyMilestones[activeMilestone].story}
                                    </p>

                                    <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-slate-800 leading-relaxed">
                                        <strong className="text-amber-950 font-bold block text-[11px] mb-0.5">The Turning Point:</strong>
                                        <span className="text-slate-700 text-[11px] sm:text-xs">{journeyMilestones[activeMilestone].turningPoint}</span>
                                    </div>
                                </div>

                                {/* Right Media & Key Milestone Column */}
                                <div className="md:col-span-5 space-y-2">
                                    <div className="rounded-xl overflow-hidden relative h-[125px] sm:h-[135px] border border-slate-200 shadow-2xs">
                                        <img 
                                            src={journeyMilestones[activeMilestone].image} 
                                            alt={journeyMilestones[activeMilestone].title}
                                            className="w-full h-full object-cover transition-opacity duration-300"
                                        />
                                        <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-900">
                                            {journeyMilestones[activeMilestone].tag}
                                        </div>
                                        <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-xs px-2 py-1 rounded-lg text-white text-[10px] flex items-center justify-between">
                                            <span className="truncate pr-1"><strong>Station:</strong> {journeyMilestones[activeMilestone].stage}</span>
                                            <span className="text-amber-300 font-bold shrink-0">0{activeMilestone + 1}/05</span>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 block">
                                                Key Milestone
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-emerald-950 block leading-tight">
                                                {journeyMilestones[activeMilestone].highlight}
                                            </span>
                                            <span className="text-[10px] text-emerald-700 font-medium block">
                                                {journeyMilestones[activeMilestone].highlightSub}
                                            </span>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                                    </div>
                                </div>

                            </div>

                            {/* Compact Status Bar at Bottom */}
                            <div className="bg-[#FAF7F2] border-t border-amber-200/70 py-1.5 px-3 rounded-xl flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-500">
                                    📍 Currently Displaying: <strong className="text-[#E51A22]">{journeyMilestones[activeMilestone].year}</strong> ({journeyMilestones[activeMilestone].stage})
                                </span>
                                <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                    Active Milestone
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ======================================================== */}
            {/* 4. SURAT FLAGSHIP STUDIO: FULL WIDTH & COMPACT           */}
            {/* ======================================================== */}
            <section className="py-8 sm:py-12 bg-white border-t border-amber-100/80 w-full relative z-20">
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    
                    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                        <span className="text-xs font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-1.5 shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-[#E51A22]" />
                            Our Surat Flagship Studio
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A24] tracking-tight">
                            Come Sit, Touch & Play at Our Store
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600">
                            Bring your little ones to test our open play tables before making any decision.
                        </p>
                    </div>

                    {/* 4 Gallery Photos (Full Width) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6 w-full">
                        {storeGallery.map((item, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[16/10] max-h-[160px] bg-slate-100 border border-slate-200/80 shadow-2xs">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">{item.badge}</span>
                                    <h4 className="text-xs sm:text-sm font-extrabold leading-tight mt-0.5 truncate">{item.title}</h4>
                                    <p className="text-[10px] text-slate-300 truncate">{item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Store Card & Direct Founder Helpline (Full Width) */}
                    <div className="bg-[#FAF7F2] border border-amber-200/90 rounded-2xl p-5 sm:p-7 shadow-2xs w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            
                            <div className="lg:col-span-8 space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-black">
                                    <Smile className="w-3.5 h-3.5 text-[#E51A22]" />
                                    <span>Experience Studio · Surat</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                                    Little Joys Experience Store · Mota Varachha, Surat
                                </h3>
                                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <p className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                        <span><strong>Address:</strong> Tulsi Arcade, Sudama Chowk, Mota Varachha, Surat, Gujarat 394101</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <span><strong>Hours:</strong> Mon - Sat: 10:00 AM – 8:30 PM (Sunday by appointment)</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Helpline / WhatsApp:</strong> +91 8347640423 (Direct to Founder Team)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col gap-2.5">
                                <a 
                                    href="https://maps.google.com/?q=Tulsi+Arcade,+Sudama+Chowk,+Mota+Varachha,+Surat"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#1A1A24] hover:bg-black text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                                >
                                    <Compass className="w-4 h-4" />
                                    Google Maps Directions
                                </a>
                                <a 
                                    href="https://wa.me/918347640423?text=Hi%20Little%20Joys,%20I%20would%20like%20to%20visit%20your%20Surat%20store!" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
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
