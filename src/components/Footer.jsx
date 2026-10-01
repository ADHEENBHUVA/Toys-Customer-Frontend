import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [socialLinks, setSocialLinks] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSocialLinks(data.socialLinks);
                }
            } catch (err) {
                console.error('Failed to fetch settings', err);
            }
        };
        fetchSettings();
    }, []);

    const socialIcons = {
        twitter: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
        ),
        facebook: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
        ),
        instagram: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
        ),
        youtube: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" /></svg>
        ),
    };

    return (
        <footer 
            className="w-full text-slate-800 font-['Outfit'] relative pt-12 pb-6 overflow-hidden" 
            style={{ 
                background: 'linear-gradient(-45deg, #cde6de, #f6e9c4, #e8f3ef, #fbf5e1)',
                backgroundSize: '400% 400%',
                animation: 'gradientBg 12s ease infinite'
            }}
        >
            {/* Subtle floating circles for extra animation */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-[#1BA4D9]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Newsletter inside Footer */}
            <div className="pt-8 pb-8 relative z-10 mb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-left max-w-lg">
                        <h2 className="text-[34px] font-bold text-[#2c3e50] mb-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Nunito", sans-serif' }}>Newsletter</h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium" style={{ fontFamily: '"Nunito", sans-serif' }}>
                            Get 15% off your first order! Plus, be the first to know about new arrivals, sales & exclusive offers!
                        </p>
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto flex-1 max-w-[500px] relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <input 
                            type="email" 
                            placeholder="Enter your email address..." 
                            className="flex-1 pl-12 pr-5 py-3.5 rounded-full border-2 border-white bg-white/60 focus:bg-white focus:outline-none focus:border-[#1BA4D9] focus:ring-4 focus:ring-[#1BA4D9]/20 text-sm md:text-base text-slate-700 placeholder-slate-500 transition-all shadow-sm"
                        />
                        <button className="bg-[#1BA4D9] hover:bg-[#158ebf] hover:-translate-y-0.5 active:translate-y-0 text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base transition-all shadow-md whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                {/* Left Column - Brand & Social */}
                <div className="flex flex-col gap-5 max-w-sm">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 flex items-center justify-center font-black text-[#f57c00] border-l-4 border-[#f57c00] text-3xl">R</div>
                        <div className="flex flex-col text-sm md:text-base font-black leading-none tracking-tight">
                            <span className="text-[#1BA4D9]">rainbow</span>
                            <span className="text-slate-600">rattles</span>
                        </div>
                    </Link>
                    <p className="text-[14px] font-medium text-slate-600 leading-relaxed">
                        Free and standard shipping on all orders over ₹50. Discover the best toys for your little ones!
                    </p>
                    
                    <div className="flex gap-4 mt-2">
                        {socialLinks && Object.entries(socialLinks).map(([platform, url]) => {
                            if (!url) return null;
                            return (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-[#1BA4D9] text-[#1BA4D9] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                    {socialIcons[platform]}
                                </a>
                            );
                        })}
                        {/* Fallback icons if no DB links yet */}
                        {!socialLinks && (
                            <>
                                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-[#1BA4D9] text-[#1BA4D9] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"><span className="font-bold text-xs">FB</span></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-[#1BA4D9] text-[#1BA4D9] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"><span className="font-bold text-xs">IG</span></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-[#1BA4D9] text-[#1BA4D9] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"><span className="font-bold text-xs">TW</span></a>
                            </>
                        )}
                    </div>
                </div>

                {/* Center Columns - Links */}
                <div className="flex gap-16 md:gap-24 flex-wrap">
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[13px] mb-1 opacity-60">My account</h4>
                        <Link to="/orders" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Track my order</Link>
                        <Link to="/terms" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Terms of use</Link>
                        <Link to="/privacy" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Privacy</Link>
                        <Link to="/contact" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Submit feedback</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[13px] mb-1 opacity-60">Customer center</h4>
                        <Link to="/delivery" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Delivery & shipping</Link>
                        <Link to="/faq" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>FAQs & Returns</Link>
                        <Link to="/contact" className="text-[15px] font-semibold text-slate-700 hover:text-[#1BA4D9] flex items-center gap-2 group transition-colors"><span className="w-0 overflow-hidden group-hover:w-3 text-[#1BA4D9] transition-all">✦</span>Company details</Link>
                        <a href="mailto:hello@rainbowrattles.com" className="text-[15px] font-bold text-[#1BA4D9] hover:text-[#158ebf] mt-1 flex items-center gap-2 transition-colors">hello@rainbowrattles.com</a>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="relative z-10 mt-10 pt-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto opacity-70">
                <p className="text-[13px] font-semibold text-slate-700">© 2026 Rainbow Rattles. All rights reserved.</p>
                <div className="flex gap-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-70" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-70" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
