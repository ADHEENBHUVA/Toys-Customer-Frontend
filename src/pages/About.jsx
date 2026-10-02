import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white min-h-screen pt-12 pb-24 font-['Nunito']">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-serif mb-4">About Little Joys</h1>
                    <p className="text-[#8b7e7c] text-lg max-w-2xl mx-auto">
                        We are passionate about bringing joy, creativity, and safe playtime to children everywhere.
                    </p>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="bg-[#fcfaf7] p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e6a27a]/10 rounded-bl-[100px] z-0"></div>
                        <h2 className="text-2xl font-black text-slate-800 font-serif mb-4 relative z-10">Our Story</h2>
                        <p className="text-slate-600 leading-relaxed mb-4 relative z-10">
                            Founded with a simple mission: to make learning fun and accessible. At Little Joys, we believe that toys are not just objects, but tools that spark imagination and foster development.
                        </p>
                        <p className="text-slate-600 leading-relaxed relative z-10">
                            Every toy in our collection is carefully curated with safety, durability, and educational value in mind. We work closely with trusted manufacturers to ensure your little ones get the best.
                        </p>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden shadow-lg h-full min-h-[300px]">
                        <img 
                            src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop" 
                            alt="Kids playing" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-800 font-serif mb-12">Why Choose Us?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-[#118AB2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🛡️</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Safe & Certified</h3>
                            <p className="text-slate-500">All our products go through rigorous quality checks and meet international safety standards.</p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-[#e6a27a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Eco-Friendly</h3>
                            <p className="text-slate-500">We prioritize sustainable materials and eco-friendly packaging for a better tomorrow.</p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-[#93b38c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">❤️</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Made with Love</h3>
                            <p className="text-slate-500">Every toy is selected with care to ensure it brings a smile to your child's face.</p>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-16 pt-10 border-t border-slate-100">
                    <p className="text-slate-600 mb-6 font-medium">Ready to explore our amazing collection?</p>
                    <Link to="/products" className="bg-[#118AB2] text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-[#0a5c78] transition-all duration-300">
                        Shop Now
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default About;
