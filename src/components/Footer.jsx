import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const socialIcons = {
        twitter: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
        ),
        facebook: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
        ),
        instagram: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
        ),
        youtube: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
            </svg>
        )
    };

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
                                    {socialIcons[social]}
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
