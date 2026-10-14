import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Target, 
    Eye, 
    Sparkles, 
    ShieldCheck, 
    Leaf, 
    Heart, 
    Rocket, 
    CheckCircle2, 
    Award, 
    Clock, 
    ArrowRight,
    Smile,
    PackageCheck
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
    const milestones = [
        {
            year: "2023",
            title: "The Spark of an Idea",
            description: "Little Joys was born from a simple parent dilemma: finding high-quality, screen-free, safe toys that truly engage a child's curious mind. We started with just 25 carefully crafted educational puzzles."
        },
        {
            year: "2024",
            title: "Reaching 10,000+ Homes",
            description: "Parents across India embraced our mission. We expanded into STEM kits, sensory wooden toys, and creative pretend-play, partnering directly with certified, ethical manufacturers."
        },
        {
            year: "2025",
            title: "Certified Safe & Sustainable",
            description: "We upgraded all packaging to 100% recyclable materials and achieved strict BIS child-safety standards. Every toy underwent non-toxic and impact testing."
        },
        {
            year: "2026",
            title: "Little Joys Everyday",
            description: "Today, we are honored to have brought smiles to over 50,000+ children across 500+ Indian cities, continuing to curate tools for meaningful play and joyful childhoods."
        }
    ];

    const coreValues = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-[#E51A22]" />,
            title: "100% Child-Safe",
            description: "Zero harmful chemicals or sharp edges. Every toy is BIS certified and rigorously tested for toddler and child safety."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-amber-500" />,
            title: "Play with Purpose",
            description: "Designed to ignite cognitive skills, hand-eye coordination, and unbounded creative storytelling without screen dependency."
        },
        {
            icon: <Leaf className="w-6 h-6 text-emerald-600" />,
            title: "Sustainable & Kind",
            description: "We consciously choose renewable woods, safe water-based paints, and biodegradable packaging for a healthier planet."
        },
        {
            icon: <Heart className="w-6 h-6 text-rose-500" />,
            title: "Parent-First Support",
            description: "Easy 7-day replacements, transparent tracking, and genuine human support for any question you or your little one has."
        }
    ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'About Us', link: null }]} />

            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-[#E51A22] text-xs font-bold uppercase tracking-wider mb-4 border border-red-100">
                        <Smile className="w-3.5 h-3.5" />
                        Our Story & Passion
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                        Bringing Meaningful Play to Every <span className="text-[#E51A22]">Child's World</span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        At Little Joys, we believe toys are not just objects to pass time. They are the magical tools that spark curiosity, foster resilience, and create treasured childhood memories.
                    </p>
                </div>

                {/* Impact / Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 max-w-4xl mx-auto">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                        <div className="text-2xl sm:text-3xl font-black text-[#E51A22]">50,000+</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Happy Smiles</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                        <div className="text-2xl sm:text-3xl font-black text-gray-900">1,200+</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Handpicked Toys</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Non-Toxic & Safe</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                        <div className="text-2xl sm:text-3xl font-black text-amber-500">4.9 ★</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Parent Rating</div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION SECTION */}
            <section className="bg-white py-16 md:py-24 border-y border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                            What Drives Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Our Mission & Our Vision
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base mt-3">
                            The compass that guides every single toy we select, test, and deliver to your doorstep.
                        </p>
                    </div>

                    {/* Mission & Vision Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Our Mission */}
                        <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-gray-200/90 relative overflow-hidden flex flex-col justify-between hover:border-red-200 transition-colors">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-red-100/70 text-[#E51A22] flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                                    Our Mission
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                                    To empower every child's innate potential by providing thoughtfully designed, safe, and screen-free toys that turn everyday play into joyful learning and discovery.
                                </p>
                            </div>

                            <ul className="space-y-3 pt-6 border-t border-gray-200/70 text-sm text-gray-700">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span>Nurture creativity, problem-solving, and sensory motor skills.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span>Provide parents with peace of mind through strict safety certifications.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#E51A22] shrink-0 mt-0.5" />
                                    <span>Encourage memorable family bonding away from screens.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Our Vision */}
                        <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-gray-200/90 relative overflow-hidden flex flex-col justify-between hover:border-amber-200 transition-colors">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-6">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                                    Our Vision
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                                    To be India's most cherished and dependable destination for mindful play—where every home has access to wholesome, durable toys that build tomorrow's thinkers, creators, and leaders.
                                </p>
                            </div>

                            <ul className="space-y-3 pt-6 border-t border-gray-200/70 text-sm text-gray-700">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span>Make premium, international-quality educational toys accessible to all.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span>Lead the movement towards eco-friendly and sustainable toys.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span>Inspire generations of curious, confident, and empathetic children.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR JOURNEY / TIMELINE SECTION */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                        How We Grew
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Our Journey So Far
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-3">
                        From a small table with 25 puzzles to a home name trusted by thousands of parents across the country.
                    </p>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {milestones.map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
                        >
                            <div>
                                <div className="inline-block bg-red-50 text-[#E51A22] font-black text-sm px-3.5 py-1 rounded-full mb-4 border border-red-100">
                                    {item.year}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2.5">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-400">
                                <span>Milestone #{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CORE VALUES SECTION */}
            <section className="bg-white py-16 md:py-24 border-t border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E51A22] block mb-2">
                            Our Standards
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            The Values We Stand By
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base mt-3">
                            Why conscious parents across India choose Little Joys for their children's play and growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((val, idx) => (
                            <div 
                                key={idx}
                                className="p-6 rounded-2xl bg-[#FAF8F5] border border-gray-200/70 hover:border-gray-300 transition-colors flex flex-col text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center mb-5 shadow-2xs">
                                    {val.icon}
                                </div>
                                <h4 className="text-base font-bold text-gray-900 mb-2">
                                    {val.title}
                                </h4>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {val.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOUNDER'S NOTE */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="bg-[#FAF8F5] border border-gray-200/90 rounded-3xl p-8 sm:p-12 relative">
                    <div className="text-4xl mb-4 text-[#E51A22]">“</div>
                    <blockquote className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed mb-6 italic">
                        We don't just sell toys; we curate moments of wonder, discovery, and warmth that children remember for a lifetime. Every box opened is the start of a new adventure.
                    </blockquote>
                    <div className="text-sm font-bold text-gray-900">The Little Joys Team</div>
                    <div className="text-xs text-gray-500 font-medium">Crafted with love for little dreamers</div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-gradient-to-br from-red-50 via-orange-50/40 to-white text-gray-900 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden border border-red-100 shadow-sm">
                    <div className="max-w-2xl mx-auto relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#E51A22] text-xs font-bold uppercase tracking-wider mb-4 border border-red-200/60 shadow-2xs">
                            Start Exploring
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900">
                            Ready to Spark Your Child's Imagination?
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                            Explore our handpicked collection of educational toys, creative building blocks, and sensory learning games.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                to="/products" 
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E51A22] hover:bg-[#c9141b] text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <span>Explore Toys</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link 
                                to="/contact" 
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-8 rounded-full text-sm transition-all border border-gray-200 shadow-2xs cursor-pointer"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
