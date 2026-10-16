import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Heart, 
    MapPin, 
    Phone, 
    Clock, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    Check, 
    ChevronDown, 
    MessageCircle, 
    ShoppingBag, 
    Truck, 
    RotateCcw,
    Compass,
    Eye,
    Target,
    Milestone,
    Calendar,
    Award
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
    const [openFaq, setOpenFaq] = useState(0);
    const [activeTab, setActiveTab] = useState('toddlers');

    const journeyMilestones = [
        {
            year: "Late 2022",
            badge: "The Living Room Spark",
            title: "Frustrated Parents in Mota Varachha, Surat",
            desc: "Like most parents, our living room floor was covered with noisy plastic battery gadgets that cracked in two days while our children stayed glued to smartphones. We knew Indian children deserved real, tactile wonder."
        },
        {
            year: "Early 2023",
            badge: "The First 25 Toys",
            title: "Montessori & Sensory Woodwork",
            desc: "We curated and tested 25 splinter-free, natural wooden puzzles with our own children, nieces, and neighborhood families in Surat. The genuine joy and hours of focused play convinced us to turn this passion into Little Joys."
        },
        {
            year: "Late 2023",
            badge: "The Physical Showroom",
            title: "Doors Open at Tulsi Arcade, Sudama Chowk",
            desc: "We opened our Surat experience store with dedicated open play tables. Parents and children could sit together, touch the wood, solve puzzles, and see what truly sparked their interest before buying."
        },
        {
            year: "Today & Beyond",
            badge: "Nationwide Community",
            title: "15,000+ Happy Homes Across India",
            desc: "Now shipping to over 19,000 pin codes across every Indian state, with over 1,000+ curated screen-free educational toys, STEM kits, and puzzles that create lifelong childhood memories."
        }
    ];

    const ageCategories = {
        toddlers: {
            title: "Toddlers & Preschoolers (Ages 1 - 4)",
            summary: "Gentle wooden stacking rings, sensory tactile blocks, and chunky animal puzzles designed for little hands still learning to grasp, balance, and explore without screens.",
            highlights: [
                "100% natural plantation wood with silky hand-sanded edges",
                "Food-grade, saliva-safe water-based organic colors",
                "Promotes fine motor dexterity and spatial discovery"
            ],
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000&auto=format&fit=crop",
            link: "/products?search=wooden"
        },
        explorers: {
            title: "Curious Builders (Ages 4 - 8)",
            summary: "Magnetic building tiles, architectural wooden planks, and memory-matching games that turn living room floors into majestic fortresses, bridges, and endless stories.",
            highlights: [
                "Heavy-duty encased magnets that will not come loose",
                "Open-ended play: build a castle today, a spaceship tomorrow",
                "Encourages collaborative play with siblings and parents"
            ],
            image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=1000&auto=format&fit=crop",
            link: "/products?search=building"
        },
        inventors: {
            title: "Young Thinkers & STEM (Ages 7 - 12+)",
            summary: "Mechanical gear assemblies, physics puzzle mazes, and brain-teasing strategy games that teach real scientific intuition while keeping kids completely engaged.",
            highlights: [
                "Step-by-step pictorial guides written for independent learning",
                "Hands-on physics and mechanical principles in action",
                "Proven to replace smartphone and tablet screen time"
            ],
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1000&auto=format&fit=crop",
            link: "/products?search=stem"
        }
    };

    const faqs = [
        {
            q: "Are your wooden toys really safe if my toddler puts them in their mouth?",
            a: "Yes, completely. Every wooden toy in our catalog uses natural plantation wood, hand-smoothed corners with zero splinters, and 100% food-grade, water-based non-toxic vegetable paints compliant with Bureau of Indian Standards (BIS) safety norms."
        },
        {
            q: "Can we visit your showroom in Surat with our children?",
            a: "We would love to host you! Our store at Tulsi Arcade, Sudama Chowk (Mota Varachha) has an open play table where children can sit, touch, build, and test toys freely before you decide to buy anything."
        },
        {
            q: "What if a toy arrives damaged or has a missing piece?",
            a: "We have an honest, zero-hassle replacement promise. Simply message us on WhatsApp (8347640423) with a quick photo of the parcel. We will dispatch a free replacement or the missing piece immediately, no arguments."
        },
        {
            q: "Do you deliver all over India, and how long does it take?",
            a: "We ship to over 19,000 pin codes across India. Orders within Gujarat usually arrive in 24 to 48 hours, and other major cities within 3 to 4 working days with live SMS and WhatsApp tracking."
        }
    ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1E2022] font-sans selection:bg-red-100 selection:text-red-700">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={[{ label: 'About Us', link: null }]} />

            {/* 1. EDITORIAL HERO SECTION - Warm, Human & Grounded */}
            <section className="relative pt-10 pb-14 md:pt-16 md:pb-20 border-b border-[#E8E2D9]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Column: Sincere Headline & Manifesto */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#E51A22] bg-[#FCE8E8] px-3.5 py-1.5 rounded-full">
                                <span>A Family Toy Studio · Surat, Gujarat</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A24] tracking-tight leading-[1.2]">
                                We believe childhood should be filled with wonder, <br className="hidden sm:inline" />
                                <span className="text-[#E51A22]">not glowing screens.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                                Little Joys started in our own living room in Surat. Like many parents, we were tired of noisy, breakable plastic toys that end up in the trash after three days while kids stay glued to mobile phones.
                            </p>

                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                We set out to find toys that do the opposite: natural wooden puzzles, durable magnetic builders, and thoughtful STEM sets that spark real curiosity and bring parents and kids back to the living room rug together.
                            </p>

                            {/* Human Touch Actions */}
                            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link 
                                    to="/products"
                                    className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-sm sm:text-base font-bold py-3 px-7 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Explore Our Toys
                                </Link>
                                <a 
                                    href="https://wa.me/918347640423?text=Hello%20Little%20Joys,%20can%20you%20help%20me%20pick%20the%20best%20toy%20for%20my%20child?" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-sm sm:text-base font-semibold py-3 px-6 rounded-xl transition-all shadow-xs flex items-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                    Ask a Parent on WhatsApp
                                </a>
                            </div>

                            {/* Honest Reassurances */}
                            <div className="pt-4 border-t border-[#E8E2D9] grid grid-cols-3 gap-4 text-left">
                                <div>
                                    <span className="block text-xl sm:text-2xl font-black text-[#1A1A24]">15,000+</span>
                                    <span className="text-xs text-gray-600 font-medium">Families Across India</span>
                                </div>
                                <div>
                                    <span className="block text-xl sm:text-2xl font-black text-emerald-700">100%</span>
                                    <span className="text-xs text-gray-600 font-medium">BIS Safe & Non-Toxic</span>
                                </div>
                                <div>
                                    <span className="block text-xl sm:text-2xl font-black text-[#E51A22]">Surat Store</span>
                                    <span className="text-xs text-gray-600 font-medium">Open Play Tables</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Warm Candid Photography Collage */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white">
                                <img 
                                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=900&auto=format&fit=crop" 
                                    alt="Child playing with wooden toys" 
                                    className="w-full aspect-[4/5] object-cover"
                                />
                                <div className="p-4 sm:p-5 bg-white border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-[#E51A22]" />
                                        <span>Photographed at our Surat studio</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 leading-snug">
                                        "A toy should be 10% toy and 90% child. That is where real imagination begins."
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. OUR FOUNDER'S NOTE - Authentic, Sincere Storytelling */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-18">
                <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E8E2D9] shadow-xs relative">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[#FCE8E8] text-[#E51A22] flex items-center justify-center font-bold text-lg">
                                ❤
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900">An Open Note from Our Family</h2>
                                <p className="text-xs text-gray-500">Why we started Little Joys in Mota Varachha, Surat</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                            <p>
                                <em>Dear Fellow Parent,</em>
                            </p>
                            <p>
                                If your home looks anything like ours did a couple of years ago, you know the feeling. The living room floor is scattered with battery-operated gadgets that blast loud sirens, repeat the same annoying songs, and break into pieces within a week.
                            </p>
                            <p>
                                Even worse, when children get bored of these noisy toys, the only thing that seems to hold their attention is a smartphone screen.
                            </p>
                            <p>
                                We wanted something better for our own kids. We wanted toys that children could hold, explore, build, toss, and imagine with for hours without needing a charger or a screen.
                            </p>
                            <p>
                                That is how <strong>Little Joys</strong> was born. We started with just 25 carefully selected wooden puzzles and STEM kits in Surat. We tested each one with our own children, nieces, and neighborhood friends. If a toy couldn't hold a child's interest for at least an hour of open play, we didn't offer it.
                            </p>
                            <p>
                                Today, we are humbled to ship to thousands of homes across India every month. But our rule hasn't changed: <strong>we only sell toys we are proud to place in our own children's hands.</strong>
                            </p>
                        </div>

                        {/* Founder Sign-off */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-gray-900 text-sm sm:text-base">Adheer & The Little Joys Team</p>
                                <p className="text-xs text-gray-500">Parents, Curators & Founders · Surat, Gujarat</p>
                            </div>
                            <div>
                                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    Parent Tested & Approved
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. OUR VISION & PURPOSE (Dedicated, Inspiring & Authentic) */}
            <section className="bg-white border-y border-[#E8E2D9] py-14 md:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51A22] bg-[#FCE8E8] px-3.5 py-1.5 rounded-full mb-3">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Our Guiding Compass</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Our Vision: Nurturing 100,000+ Screen-Free Childhoods
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                            We envision an India where children grow up with dirt on their hands, wonder in their eyes, and an insatiable curiosity to build, solve, and create in the real physical world.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Vision Card 1 */}
                        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D9] hover:border-red-200 transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#FCE8E8] text-[#E51A22] flex items-center justify-center font-bold">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 leading-snug">
                                    The Vision
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    To replace mindless scrolling and fragile plastic waste with heirloom-quality toys that awaken deep focus, cognitive problem-solving, and shared family playtime across homes in India.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-[#E51A22] flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Focus on Real Imagination
                            </div>
                        </div>

                        {/* Vision Card 2 - The Mission */}
                        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D9] hover:border-emerald-200 transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 leading-snug">
                                    Our Mission
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    To design, hand-inspect, and dispatch 100% BIS-certified, chemical-free wooden and STEM toys directly from Surat to every corner of India at honest, accessible family prices.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Honest Pricing & Safe Materials
                            </div>
                        </div>

                        {/* Vision Card 3 - The Core Commitment */}
                        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D9] hover:border-amber-200 transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 leading-snug">
                                    Our 100% Parent Promise
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    Every toy in our catalog must first pass our own children's 100-hour playroom test. If it doesn't inspire curiosity or can't survive real drops, we refuse to sell it.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-amber-800 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Tested by Real Children
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OUR JOURNEY (Authentic Timeline Storytelling) */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51A22] bg-[#FCE8E8] px-3.5 py-1.5 rounded-full mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>How We Got Here</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Our Journey: Step by Step
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        From a small living room in Surat to over 15,000 family playrooms across India.
                    </p>
                </div>

                <div className="space-y-6 sm:space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-1/2 before:w-0.5 before:bg-[#E8E2D9] before:-translate-x-1/2 before:hidden sm:before:block">
                    {journeyMilestones.map((item, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <div 
                                key={idx} 
                                className={`relative flex flex-col sm:flex-row items-center gap-6 ${
                                    isEven ? 'sm:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Content Card */}
                                <div className="w-full sm:w-[calc(50%-2.5rem)]">
                                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E2D9] shadow-xs hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-2xl font-black text-[#E51A22] tracking-tight">{item.year}</span>
                                            <span className="text-[11px] font-bold text-[#E51A22] bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Dot on Timeline */}
                                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#E51A22] items-center justify-center shadow-xs z-10">
                                    <div className="w-2 h-2 rounded-full bg-[#E51A22]" />
                                </div>

                                {/* Spacer for symmetrical balance */}
                                <div className="hidden sm:block w-[calc(50%-2.5rem)]" />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. OUR THREE SIMPLE PROMISES (Not a generic AI card grid) */}
            <section className="bg-white border-y border-[#E8E2D9] py-14 md:py-18">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            What Makes Our Toys Different
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Three simple rules we never compromise on, from our workshop to your home.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Rule 1 */}
                        <div className="space-y-3 bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200/80">
                            <div className="w-12 h-12 rounded-2xl bg-[#FCE8E8] text-[#E51A22] flex items-center justify-center font-bold text-lg mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">1. Screen-Free & Open-Ended</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Our toys do not play by themselves. There are no flashing lights that entertain passively. The child is the storyteller, builder, and problem solver.
                            </p>
                        </div>

                        {/* Rule 2 */}
                        <div className="space-y-3 bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200/80">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">2. Safe for Teething Toddlers</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Natural woods, food-grade non-toxic water stains, and silky hand-sanded edges. Zero chemical odors, heavy metals, or hazardous sharp edges.
                            </p>
                        </div>

                        {/* Rule 3 */}
                        <div className="space-y-3 bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200/80">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                                <RotateCcw className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">3. Built to Be Handed Down</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Toys should survive childhood. We build and source solid materials that withstand accidental drops, throws, and years of play so they can be passed to younger siblings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. EXPLORE BY AGE & STAGE - Interactive, Clean & Thoughtful */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-18">
                <div className="text-center max-w-xl mx-auto mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Thoughtful Toys for Every Milestone
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Pick your child's age group to see how our toys nurture natural curiosity.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setActiveTab('toddlers')}
                            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'toddlers' 
                                    ? 'bg-[#E51A22] text-white shadow-xs' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Ages 1 - 4
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('explorers')}
                            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'explorers' 
                                    ? 'bg-[#E51A22] text-white shadow-xs' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Ages 4 - 8
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('inventors')}
                            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'inventors' 
                                    ? 'bg-[#E51A22] text-white shadow-xs' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Ages 7 - 12+
                        </button>
                    </div>
                </div>

                {/* Tab Content Box */}
                <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-10 shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#E51A22]">
                                Developmental Milestone
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {ageCategories[activeTab].title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {ageCategories[activeTab].summary}
                            </p>

                            <ul className="space-y-2.5 pt-2">
                                {ageCategories[activeTab].highlights.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4">
                                <Link
                                    to={ageCategories[activeTab].link}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E51A22] hover:text-[#c9141b] group"
                                >
                                    Browse this age collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-5">
                            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-100 shadow-xs">
                                <img 
                                    src={ageCategories[activeTab].image} 
                                    alt={ageCategories[activeTab].title}
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. VISIT OUR SURAT STORE - Authentic Local Anchor */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 md:pb-18">
                <div className="bg-[#FAF4ED] border border-[#E8DEC8] rounded-3xl p-6 sm:p-10 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Our Physical Experience Store</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                Come Visit Our Play Tables in Surat
                            </h3>

                            <p className="text-sm text-gray-700 leading-relaxed">
                                We believe children should touch, build, and test toys before parents buy them. Our Surat store has an open play area where kids can sit, build, and play freely without any pressure to buy.
                            </p>

                            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-800">
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span><strong>Address:</strong> Tulsi Arcade, Sudama Chowk, Mota Varachha, Surat, Gujarat 394101</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Clock className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span><strong>Timings:</strong> Monday – Saturday: 10:00 AM – 8:30 PM (Sunday Closed)</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Phone className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span><strong>Helpline:</strong> +91 8347640423 (WhatsApp / Call)</span>
                                </div>
                            </div>

                            <div className="pt-3 flex flex-wrap gap-3">
                                <a 
                                    href="https://maps.google.com/?q=Tulsi+Arcade,+Sudama+Chowk,+Mota+Varachha,+Surat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#1A1A24] hover:bg-black text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Compass className="w-4 h-4" />
                                    Open in Google Maps
                                </a>
                                <a 
                                    href="tel:+918347640423"
                                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    Call Store
                                </a>
                            </div>
                        </div>

                        {/* Right: Pan-India Delivery Card */}
                        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-3 text-center sm:text-left">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E51A22] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-base">Not in Surat? We Ship Pan-India</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Every order is hand-checked and bubble-wrapped securely. Free delivery across India on orders above ₹500 with live parcel tracking.
                            </p>
                            <div className="pt-2">
                                <Link 
                                    to="/products"
                                    className="w-full bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
                                >
                                    Shop Online Catalog <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 8. HONEST PARENT FAQS - Direct, Helpful, Non-Gimmicky */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Honest answers to the things parents ask us most.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div 
                                key={idx}
                                className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden transition-all shadow-2xs"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm sm:text-base cursor-pointer hover:text-[#E51A22] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180 text-[#E51A22]' : ''}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Direct Personal Contact */}
                <div className="mt-8 text-center p-6 bg-white rounded-2xl border border-gray-200/70 shadow-2xs">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                        Have a specific question about a toy or need a recommendation?
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                        We are real parents and we are happy to help you choose the right toy for your child.
                    </p>
                    <a
                        href="https://wa.me/918347640423?text=Hi%20Little%20Joys,%20I%20have%20a%20question%20about%20your%20toys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-xs"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Chat Directly on WhatsApp (+91 8347640423)
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
