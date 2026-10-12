import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Heart, Users, Target, Sparkles } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-[#FDFBF7] min-h-screen pt-12 pb-24 font-['Outfit']">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-4">
                        <span className="bg-[#E51A22]/10 text-[#E51A22] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
                            Our Story
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1A24] mb-6 leading-tight">
                        About <span className="text-[#E51A22]">Little Joys</span>
                    </h1>
                    <p className="text-[#555] text-lg max-w-2xl mx-auto leading-relaxed">
                        We are passionate about bringing joy, creativity, and safe playtime to children everywhere. Discover the magic behind every toy we offer.
                    </p>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-full min-h-[400px] group">
                        <img 
                            src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop" 
                            alt="Kids playing" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A24]/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">Creating Memories</h3>
                            <p className="text-white/80">One toy at a time</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-[#E51A22]/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E51A22]/5 rounded-bl-[100px] z-0 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="w-12 h-12 bg-[#E51A22]/10 rounded-2xl flex items-center justify-center text-[#E51A22] mb-6 relative z-10">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-[#1A1A24] mb-4 relative z-10">Our Mission</h2>
                            <p className="text-[#555] leading-relaxed relative z-10">
                                Founded with a simple mission: to make learning fun and accessible. At Little Joys, we believe that toys are not just objects, but tools that spark imagination and foster development.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-[#E51A22]/20">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-50 rounded-tl-[100px] z-0 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#1A1A24] mb-6 relative z-10">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-[#1A1A24] mb-4 relative z-10">Our Quality Promise</h2>
                            <p className="text-[#555] leading-relaxed relative z-10">
                                Every toy in our collection is carefully curated with safety, durability, and educational value in mind. We work closely with trusted manufacturers to ensure your little ones get the best.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="text-center mb-12">
                    <span className="text-[#E51A22] text-sm font-bold tracking-widest uppercase mb-2 block">Our Core Values</span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-12">Why Choose Us?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                                <ShieldCheck className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Safe & Certified</h3>
                            <p className="text-[#555] leading-relaxed">All our products go through rigorous quality checks and meet international safety standards.</p>
                        </div>
                        
                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-green-500 transition-all duration-300">
                                <Leaf className="w-8 h-8 text-green-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Eco-Friendly</h3>
                            <p className="text-[#555] leading-relaxed">We prioritize sustainable materials and eco-friendly packaging for a better tomorrow.</p>
                        </div>
                        
                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-[#E51A22]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#E51A22] transition-all duration-300">
                                <Heart className="w-8 h-8 text-[#E51A22] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Made with Love</h3>
                            <p className="text-[#555] leading-relaxed">Every toy is selected with care to ensure it brings a smile to your child's face.</p>
                        </div>
                    </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-20 relative rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-xl text-center px-6 py-16 md:py-24">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E51A22]/5 rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-tr-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-[#1A1A24] mb-6">Ready to explore our amazing collection?</h2>
                        <p className="text-[#555] mb-10 max-w-2xl mx-auto text-lg leading-relaxed">Give your kids the best tools to learn, play, and grow.</p>
                        <Link to="/products" className="inline-flex items-center justify-center bg-[#E51A22] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#c9161d] hover:shadow-lg hover:shadow-[#E51A22]/30 transition-all duration-300 hover:-translate-y-1">
                            Start Shopping Now
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
