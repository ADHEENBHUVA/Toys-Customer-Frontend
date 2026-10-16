import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Leaf, 
    Sparkles, 
    HeartHandshake, 
    MapPin, 
    Phone, 
    Clock, 
    ArrowRight,
    CheckCircle2,
    XCircle,
    Heart,
    Award,
    Smile,
    MessageCircle,
    ShoppingBag,
    Puzzle,
    Cpu,
    Boxes,
    Palette,
    ChevronDown,
    Truck,
    RefreshCw,
    Check
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
    // Interactive FAQ state
    const [openFaq, setOpenFaq] = useState(0);

    // Interactive Quality Steps
    const [activeQualityStep, setActiveQualityStep] = useState(0);

    const qualitySteps = [
        {
            num: "01",
            title: "Material Safety & BIS Screening",
            desc: "We only accept natural plantation timber and non-toxic ABS polymers. Every batch is certified free from lead, phthalates, and formaldehyde.",
            icon: ShieldCheck,
            tag: "Safe for Teething"
        },
        {
            num: "02",
            title: "100-Hour Playroom Testing",
            desc: "Before any toy reaches our shelves, it is tested by our own children and local playgroups. If it doesn't hold kids' interest for hours, it gets rejected.",
            icon: Sparkles,
            tag: "Screen-Free Tested"
        },
        {
            num: "03",
            title: "Drop & Durability Check",
            desc: "Toys must survive real life: accidental drops, throws, and daily rough-and-tumble. Magnetic joints, wooden seams, and gears are stress-tested.",
            icon: Award,
            tag: "Built to Last"
        },
        {
            num: "04",
            title: "Hand-Packed with Love in Surat",
            desc: "Every order is inspected by hand, securely bubble-wrapped, and dispatched with an easy guide so your family can start playing right out of the box.",
            icon: HeartHandshake,
            tag: "Direct From Surat"
        }
    ];

    const timeline = [
        {
            year: "Late 2022",
            badge: "The Living Room Spark",
            title: "Frustrated Parents in Surat",
            desc: "Our living room was flooded with noisy, fragile plastic gadgets that broke in 2 days while kids stayed hooked on smartphones. We knew Indian parents deserved better."
        },
        {
            year: "Early 2023",
            badge: "The First Batch",
            title: "25 Handcrafted Wooden Toys",
            desc: "We sourced smooth, splinter-free Montessori puzzles and sensory blocks. We shared them with friends and neighborhood families in Surat — the response was overwhelming!"
        },
        {
            year: "Late 2023",
            badge: "The Experience Store",
            title: "Doors Open in Mota Varachha",
            desc: "We launched our physical showroom at Tulsi Arcade, Sudama Chowk with an open play table where kids can touch, build, and test toys freely before parents purchase."
        },
        {
            year: "Today",
            badge: "Nationwide Community",
            title: "15,000+ Happy Families Across India",
            desc: "Now shipping to 19,000+ pin codes nationwide with over 1,000+ curated educational toys, STEM kits, and brain teasers that create lasting childhood memories."
        }
    ];


    const faqs = [
        {
            q: "Are your wooden toys safe if my toddler puts them in their mouth?",
            a: "Yes, 100%. All our wooden toys use water-based, food-grade, non-toxic organic paints and natural plantation wood with hand-sanded smooth edges compliant with Indian BIS (Bureau of Indian Standards) toy norms."
        },
        {
            q: "Can we visit your Surat showroom with our children?",
            a: "Absolutely! We love having children visit. We have dedicated open play tables where kids can sit, touch, build, and try different toys freely so you can see what truly sparks their interest."
        },
        {
            q: "Do you ship across India, and how fast is delivery?",
            a: "Yes, we deliver to over 19,000 pin codes across all states in India. Most orders within Gujarat arrive in 24-48 hours, and other metros within 3-4 working days with instant live parcel tracking."
        },
        {
            q: "What if a toy is damaged in transit or a piece is missing?",
            a: "We have an honest, hassle-free replacement promise. Just message or call us on WhatsApp (8347640423) with a quick photo, and we will dispatch a replacement immediately with zero argument."
        }
    ];

    const toyCategories = [
        {
            icon: Puzzle,
            title: "Wooden & Montessori",
            desc: "Tactile puzzles, geometric sorters, and stacking rings designed for natural sensory growth and screen-free discovery.",
            tag: "Ages 1 - 5",
            skill: "Motor & Sensory Skills",
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
            borderHover: "hover:border-amber-300",
            link: "/products?search=wooden"
        },
        {
            icon: Cpu,
            title: "STEM & Science Kits",
            desc: "DIY mechanical circuits, robotics, and physical experiments that turn bedtime curiosity into real engineering thinking.",
            tag: "Ages 6 - 12",
            skill: "Logic & Problem Solving",
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop",
            borderHover: "hover:border-blue-300",
            link: "/products?search=stem"
        },
        {
            icon: Boxes,
            title: "Magnetic & 3D Building",
            desc: "Heavy-duty magnetic tiles and architectural blocks that turn living room floors into majestic castles, bridges, and towers.",
            tag: "Ages 3 - 10",
            skill: "3D Spatial Imagination",
            image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=800&auto=format&fit=crop",
            borderHover: "hover:border-emerald-300",
            link: "/products?search=building"
        },
        {
            icon: Palette,
            title: "Pretend Play & Arts",
            desc: "Doctor sets, kitchen roleplay, and safe modeling clays that help children express big emotions, empathy, and storytelling.",
            tag: "Ages 2 - 8",
            skill: "Empathy & Creativity",
            image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop",
            borderHover: "hover:border-rose-300",
            link: "/products?search=play"
        }
    ];

    return (
        <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A24] font-sans selection:bg-red-100 selection:text-red-700">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={[{ label: 'About Us', link: null }]} />

            {/* 1. HERO SECTION - Vibrant, Warm, Emotional & Human */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] via-white to-[#FAF9F6] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-orange-100/70">
                {/* Floating soft blurred ambient spheres */}
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-200/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-5 right-10 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    {/* Handcrafted Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-red-200/80 shadow-xs px-4 py-1.5 rounded-full mb-6">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[#E51A22] animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold text-[#E51A22] tracking-wide">
                            Handcrafted in Surat · Cherished Across 15,000+ Indian Homes
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1A1A24] tracking-tight max-w-4xl mx-auto leading-[1.12]">
                        Childhood Is Short. <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E51A22] via-[#FF595E] to-[#FF924C]">
                            Make Their Play Count.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-5 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We started <strong className="text-gray-900 font-bold">Little Joys</strong> because our own children were lost in noisy plastic gadgets and endless phone reels. We decided to bring back the magic of natural, screen-free, wonder-filled playtime.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Link 
                            to="/products"
                            className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-sm sm:text-base font-bold py-3.5 px-8 rounded-full shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Explore Curated Toys
                        </Link>
                        <a 
                            href="https://wa.me/918347640423?text=Hello%20Little%20Joys,%20I%20am%20looking%20for%20toy%20recommendations%20for%20my%20child" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-gray-50 text-emerald-700 border border-emerald-300 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full shadow-xs transition-all hover:border-emerald-400 flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            Ask For Toy Advice
                        </a>
                    </div>

                    {/* Stats Strip */}
                    <div className="mt-12 sm:mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
                        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-red-200 transition-colors">
                            <span className="text-2xl sm:text-3xl font-black text-[#E51A22] block">15,000+</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Happy Kids in India</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-red-200 transition-colors">
                            <span className="text-2xl sm:text-3xl font-black text-gray-900 block">1,000+</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Screen-Free Toys</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-emerald-200 transition-colors">
                            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">100%</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">BIS Certified Non-Toxic</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-amber-200 transition-colors">
                            <span className="text-2xl sm:text-3xl font-black text-amber-500 block">4.9 ★</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Verified Parent Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. THE STORY BEHIND LITTLE JOYS - Grounded, Real Surat Roots */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    
                    {/* Left: 3-Image Photography Mosaic */}
                    <div className="lg:col-span-6 relative">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {/* Main Featured Photo */}
                            <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-md border border-gray-200 aspect-[16/10] bg-gray-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Children learning and having fun with wooden educational toys" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                                    <p className="text-[11px] font-bold text-orange-200 uppercase tracking-wider">Natural Learning</p>
                                    <p className="text-sm sm:text-base font-bold">Sparking imagination with smooth, chemical-free wooden play</p>
                                </div>
                            </div>

                            {/* Secondary Photo 1 */}
                            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-200 aspect-square bg-gray-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop" 
                                    alt="Kid solving STEM educational puzzle" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Secondary Photo 2 */}
                            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-200 aspect-square bg-gray-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop" 
                                    alt="Handcrafted colorful tactile wooden toys" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Floating Kid-Tested Seal */}
                        <div className="hidden sm:flex absolute -bottom-6 -right-3 bg-white p-4 rounded-2xl shadow-xl border border-orange-100 items-center gap-3.5 max-w-xs">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-900 leading-tight">Tested by Real Kids</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">Every toy must survive 100+ hours of playroom testing.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Narrative Story */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-red-50 text-[#E51A22] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                            <Smile className="w-3.5 h-3.5" />
                            Our Surat Story
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A24] tracking-tight leading-snug">
                            How a Messy Living Room in Mota Varachha Started a Revolution
                        </h2>

                        <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                            <p>
                                In 2022, our home looked like almost every modern household: dozens of blinking plastic toys lying cracked on the floor, batteries constantly running out, and children glued to smartphone screens during family meal times.
                            </p>
                            <p>
                                We asked ourselves a simple question: <strong className="text-gray-900">Why are Indian parents forced to choose between cheap, breakable plastic or astronomically expensive imported wooden toys?</strong>
                            </p>
                            <p>
                                We decided to build the bridge. Right here in <strong className="text-gray-900">Surat, Gujarat</strong>, we started curating toys crafted from sustainable wood, non-toxic water-based paints, and smart STEM engineering kits that children fall in love with.
                            </p>

                            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 text-gray-800 text-sm space-y-2">
                                <div className="flex items-center gap-2 font-bold text-[#E51A22]">
                                    <Heart className="w-4 h-4 fill-current" />
                                    The Little Joys Promise
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    If a toy doesn't inspire real problem solving, creative storytelling, or tactile motor skills, it doesn't enter our catalog. Period.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. OUR JOURNEY TIMELINE - Builds Massive Authenticity */}
            <section className="bg-white border-y border-gray-200 py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                            The Milestones
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            From Our Living Room to 15,000+ Homes
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-gray-600">
                            A timeline of passion, craftsmanship, and the trust of Indian parents.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {timeline.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-[#FAF9F6] p-6 rounded-3xl border border-gray-200/90 hover:border-red-200 hover:shadow-md transition-all flex flex-col justify-between relative group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-black text-[#E51A22]">{item.year}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#E51A22] px-2.5 py-1 rounded-full border border-red-100">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <h3 className="font-extrabold text-gray-900 text-base mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-[#E51A22] transition-colors">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Milestone Achieved
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. WHAT WE GUARANTEE VS WHAT WE SAY NO TO - The Honest Contrast */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                        Transparent Standards
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        What Goes Into Our Toys vs. What We Refuse
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-600">
                        Because as parents ourselves, we never sell anything we wouldn't hand to our own toddlers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* The Green Side: What We Put In */}
                    <div className="bg-emerald-50/50 border-2 border-emerald-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">What We Guarantee</h3>
                                <p className="text-xs text-emerald-700 font-semibold">In every toy box you receive</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Silky Smooth Hand-Sanded Finishes:</strong> Zero rough edges or wood splinters to protect tiny curious fingers.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>100% Food-Grade Non-Toxic Paints:</strong> Safe even if a teething toddler puts the toy in their mouth.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Child-Tested Durability:</strong> Engineered to withstand falls, energetic tosses, and years of rough play.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Open-Ended Skill Building:</strong> Puzzles, STEM concepts, and sensory textures that develop genuine focus.</span>
                            </li>
                        </ul>
                    </div>

                    {/* The Red Side: What We Strictly Reject */}
                    <div className="bg-red-50/40 border-2 border-red-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-[#E51A22] text-white flex items-center justify-center shadow-md shadow-red-500/20">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">What We Strictly Say NO To</h3>
                                <p className="text-xs text-red-600 font-semibold">Zero compromises, always</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <XCircle className="w-5 h-5 text-[#E51A22] shrink-0 mt-0.5" />
                                <span><strong>Brittle, Recycled Scrap Plastic:</strong> Cheap toys that snap in hours and leave sharp microscopic shards.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <XCircle className="w-5 h-5 text-[#E51A22] shrink-0 mt-0.5" />
                                <span><strong>Harsh Chemical Varnishes:</strong> Pungent chemical odors, heavy metals, or toxic phthalates.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <XCircle className="w-5 h-5 text-[#E51A22] shrink-0 mt-0.5" />
                                <span><strong>Senseless Loud Sirens & Noise:</strong> Repetitive mechanical noise machines that offer zero cognitive growth.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <XCircle className="w-5 h-5 text-[#E51A22] shrink-0 mt-0.5" />
                                <span><strong>Unreasonable Distributor Markups:</strong> We source directly to keep prices fair for hardworking families.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 5. INTERACTIVE 4-STEP SAFETY & QUALITY TESTING PIPELINE */}
            <section className="bg-white border-y border-gray-200 py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                            The Safety Protocol
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            How Every Toy Earns The Little Joys Seal
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-gray-600">
                            Click each step to see our 4-point inspection checklist before any toy is approved.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {qualitySteps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = activeQualityStep === idx;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveQualityStep(idx)}
                                    className={`p-6 rounded-3xl text-left transition-all duration-300 border cursor-pointer ${
                                        isActive 
                                            ? 'bg-red-50/70 border-red-300 shadow-md scale-102 ring-2 ring-red-400/30' 
                                            : 'bg-[#FAF9F6] border-gray-200/90 hover:border-gray-300 hover:bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-xl font-black ${isActive ? 'text-[#E51A22]' : 'text-gray-400'}`}>
                                            {step.num}
                                        </span>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                                            isActive ? 'bg-[#E51A22] text-white' : 'bg-white text-gray-600 shadow-2xs'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E51A22] block mb-1">
                                        {step.tag}
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-base mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. TOY CATEGORIES - Rich Visual Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-red-50 text-[#E51A22] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Curated Play Worlds
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Explore Toys by Development Stage
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 max-w-xl">
                            Each category is purposefully chosen to nurture specific cognitive and motor milestones without screens.
                        </p>
                    </div>
                    <Link 
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E51A22] hover:text-[#c9141b] transition-colors group shrink-0"
                    >
                        Browse all 1,000+ toys <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {toyCategories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <Link 
                                key={idx} 
                                to={cat.link}
                                className={`group bg-white rounded-3xl overflow-hidden border border-gray-200/90 ${cat.borderHover} shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
                            >
                                <div>
                                    {/* Image with Floating Badges */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                        <img 
                                            src={cat.image} 
                                            alt={cat.title}
                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                        
                                        {/* Top Left: Category Icon */}
                                        <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center text-gray-800">
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Top Right: Age Tag */}
                                        <span className="absolute top-3 right-3 text-[11px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full shadow-sm">
                                            {cat.tag}
                                        </span>

                                        {/* Bottom Left on Image: Skill Badge */}
                                        <div className="absolute bottom-2.5 left-3 right-3">
                                            <span className="inline-block text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                                                {cat.skill}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 sm:p-6">
                                        <h3 className="text-lg font-black text-gray-900 group-hover:text-[#E51A22] transition-colors mb-2 leading-snug">
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                                    <div className="w-full py-2.5 px-4 rounded-xl bg-gray-50 group-hover:bg-red-50 text-gray-800 group-hover:text-[#E51A22] text-xs font-bold flex items-center justify-between border border-gray-100 group-hover:border-red-100 transition-colors">
                                        <span>Shop Collection</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>


            {/* 8. VISIT OUR EXPERIENCE STORE IN SURAT */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="bg-gradient-to-br from-white via-orange-50/20 to-amber-50/40 rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-orange-100 shadow-sm relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Store Info Details */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 text-xs font-black text-[#E51A22] uppercase tracking-wider bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Walk-in Experience Store · Surat</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
                                Bring Your Kids to Touch, Build & Play Before You Buy!
                            </h3>

                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Shopping online is fast, but nothing matches seeing your child completely immersed in a magnetic castle or wooden labyrinth in person. Come visit our physical store in Mota Varachha, Surat — equipped with an open play table where kids can play freely!
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-gray-700">
                                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-[#E51A22]" /> Store Address
                                    </p>
                                    <p className="font-semibold text-gray-900 leading-snug">
                                        Tulsi Arcade, Sudama Chowk, Mota Varachha, Surat, Gujarat 394101
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                        <Clock className="w-3.5 h-3.5 text-[#E51A22]" /> Store Timings
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        Mon – Sat: 10:00 AM – 8:30 PM
                                    </p>
                                    <p className="text-xs text-gray-500">Sunday Closed</p>
                                </div>
                            </div>

                            {/* Direct Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a 
                                    href="https://maps.google.com/?q=Tulsi+Arcade,+Sudama+Chowk,+Mota+Varachha,+Surat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Get Directions on Google Maps
                                </a>
                                <a 
                                    href="tel:+918347640423"
                                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs sm:text-sm font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4 text-[#E51A22]" />
                                    Call Store: 8347640423
                                </a>
                            </div>
                        </div>

                        {/* Right: Friendly Delivery Card */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-4 text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#E51A22] flex items-center justify-center">
                                    <Truck className="w-7 h-7" />
                                </div>
                                <h4 className="font-extrabold text-gray-900 text-lg sm:text-xl">
                                    Not in Surat? We Deliver Pan-India!
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    Order online with safe, shock-proof packaging to 19,000+ pin codes across India. Free delivery on orders above ₹500 and instant live SMS tracking.
                                </p>
                                <div className="pt-2">
                                    <Link 
                                        to="/products"
                                        className="w-full bg-[#1A1A24] hover:bg-black text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        Order Online Now <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 9. PARENT FAQ ACCORDION - Honest, Reassuring Answers */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                        Common Questions
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        What Parents Ask Us Most
                    </h2>
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
                                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm sm:text-base cursor-pointer hover:text-[#E51A22] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180 text-[#E51A22]' : ''}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 10. SIGN-OFF / WARM FOUNDER PROMISE */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-center">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs space-y-3">
                    <Heart className="w-8 h-8 text-[#E51A22] mx-auto fill-current" />
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                        "Thank you for trusting us with your child's happiest playtimes."
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        With lots of love, gratitude, and playful dreams from the makers and parents at <strong>Little Joys</strong>, Surat.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
