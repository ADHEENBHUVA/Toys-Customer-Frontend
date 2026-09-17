import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-8 px-6 md:px-12 lg:px-24 mt-20 relative z-40">
            <div className="max-w-7xl mx-auto">
                {/* Premium Newsletter Section (Moved from Dashboard) */}
                <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 mb-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/30 to-sky-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 md:w-1/2 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-['Nunito']">Join the Magic! ✉️</h2>
                        <p className="text-slate-300 text-lg">Subscribe to our newsletter for exclusive deals, new arrivals, and secret toy drops.</p>
                    </div>
                    
                    <div className="relative z-10 w-full md:w-1/2 max-w-md mx-auto md:mx-0">
                        <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="w-full bg-white/10 text-white placeholder-slate-400 border border-white/20 px-4 md:px-6 py-4 md:py-5 rounded-full outline-none focus:border-blue-500 focus:bg-white/20 transition-all backdrop-blur-sm text-sm md:text-base pr-28 md:pr-36"
                                required
                            />
                            <button type="submit" className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-blue-500 hover:bg-blue-400 text-white px-4 md:px-6 rounded-full font-bold shadow-lg transition-colors text-sm md:text-base">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-slate-400 text-[10px] md:text-xs mt-4 text-center md:text-left">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand & Intro */}
                    <div>
                        <Link to="/" className="flex flex-col relative group mb-6 w-max">
                            <img src="/logo.png" alt="Appifly Logo" className="h-16 md:h-20 lg:h-24 object-contain" />
                        </Link>
                        <p className="text-slate-500 font-medium leading-relaxed mb-6">
                            Sparking joy, creativity, and endless adventures with the finest collection of premium toys for all ages.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons */}
                            {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1D4ED8] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-6 font-['Nunito']">Shop Categories</h3>
                        <ul className="space-y-3 font-medium text-slate-500">
                            <li><Link to="/products?category=Action+Figures" className="hover:text-[#1D4ED8] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1D4ED8] transition-colors"></span> Action Figures</Link></li>
                            <li><Link to="/products?category=Educational+Toys" className="hover:text-[#1D4ED8] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1D4ED8] transition-colors"></span> Educational Toys</Link></li>
                            <li><Link to="/products?category=Board+Games" className="hover:text-[#1D4ED8] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1D4ED8] transition-colors"></span> Board Games</Link></li>
                            <li><Link to="/products?category=Dolls+%26+Playsets" className="hover:text-[#1D4ED8] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1D4ED8] transition-colors"></span> Dolls & Playsets</Link></li>
                            <li><Link to="/products?category=Puzzles" className="hover:text-[#1D4ED8] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1D4ED8] transition-colors"></span> Puzzles</Link></li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-6 font-['Nunito']">Customer Support</h3>
                        <ul className="space-y-3 font-medium text-slate-500">
                            <li><Link to="/contact" className="hover:text-[#1D4ED8] transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-[#1D4ED8] transition-colors">FAQs & Help Center</Link></li>
                            <li><Link to="/shipping" className="hover:text-[#1D4ED8] transition-colors">Shipping & Delivery</Link></li>
                            <li><Link to="/returns" className="hover:text-[#1D4ED8] transition-colors">Returns & Refunds</Link></li>
                            <li><Link to="/track-order" className="hover:text-[#1D4ED8] transition-colors">Track Your Order</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Appifly Toys. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
