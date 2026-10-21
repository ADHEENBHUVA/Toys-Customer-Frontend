import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topCategories, setTopCategories] = useState([]);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchTopCategories = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const response = await fetch(`${apiUrl}/categories/top`);
                const result = await response.json();
                if (result.success && result.data) {
                    setTopCategories(result.data);
                }
            } catch (error) {
                console.error('Error fetching top categories:', error);
            }
        };

        const fetchSettings = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const response = await fetch(`${apiUrl}/settings`);
                const result = await response.json();
                setSettings(result);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchTopCategories();
        fetchSettings();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            const response = await fetch(`${apiUrl}/subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Successfully subscribed to newsletter!');
                setEmail('');
            } else {
                toast.error(data.message || 'Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="w-full relative font-sans text-slate-800 bg-[#FFFDF9] overflow-hidden flex flex-col border-t-2 border-amber-200/60 shadow-inner">
            {/* Background 3D Pixar Toyland Panorama - Ultra HD & Rich Colors (NO ZAKHU) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <img
                    src="/images/toys_footer_panoramic.jpg"
                    alt="Toyland panoramic background"
                    className="w-full h-full object-cover object-bottom"
                    style={{ opacity: 0.95 }}
                />
            </div>
            {/* Subtle soft daylight wash in upper center so text stays crisp and readable without being faded/washed out */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white/75 pointer-events-none z-0"></div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-10 flex flex-col gap-8">
                {/* 1. Newsletter Row */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-md border border-white/80 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center lg:text-left justify-center lg:justify-start">
                        <div className="w-13 h-13 sm:w-15 sm:h-15 bg-[#FFF2F2] rounded-2xl shadow-xs flex items-center justify-center text-[#E51A22] shrink-0 border border-red-100">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </div>
                        <div>
                            <h3 className="text-[22px] sm:text-[26px] font-sans font-black text-[#1c274c] leading-tight">
                                Join Our Little Joys Family
                            </h3>
                            <p className="text-[14px] sm:text-[15px] text-slate-600 font-semibold mt-1">
                                Subscribe for exclusive discounts, new toy drops &amp; parenting tips.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto">
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full sm:w-[480px]">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-11 sm:pl-13 pr-4 py-3 sm:py-3.5 bg-white border-2 border-slate-200 rounded-full text-[#1c274c] text-[15px] sm:text-[15.5px] font-medium placeholder-slate-400 focus:outline-none focus:border-[#E51A22] focus:ring-4 focus:ring-red-500/10 transition-all shadow-xs"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                    title="Please enter a valid email address with @ and ."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-[#E51A22] hover:bg-red-600 text-white font-bold tracking-wide text-[15px] sm:text-[15.5px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(229,26,34,0.3)] hover:shadow-[0_6px_22px_rgba(229,26,34,0.4)] cursor-pointer"
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. Main Links Grid */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-9 shadow-md border border-white/80">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-8 gap-y-8 lg:gap-10">
                        {/* Brand Col */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full border-[3px] border-[#E51A22] flex items-center justify-center text-[#E51A22] bg-white shadow-xs">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[25px] sm:text-[27px] font-black text-[#1c274c]">Little Joys</span>
                                    <span className="text-[11.5px] font-extrabold text-[#E51A22] tracking-widest mt-1">KIDS &amp; BABY STORE</span>
                                </div>
                            </div>
                            <p className="text-[14.5px] sm:text-[15px] text-slate-600 font-medium leading-relaxed mb-6 pr-4">
                                Thoughtfully chosen baby and kids products for every little adventure.
                            </p>
                            <div className="flex gap-3 text-[#1c274c]">
                                {settings?.socialLinks?.facebook && (
                                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-0.5 transition-all inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-red-50 rounded-full shadow-xs border border-slate-200"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                                )}
                                {settings?.socialLinks?.instagram && (
                                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-0.5 transition-all inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-red-50 rounded-full shadow-xs border border-slate-200"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
                                )}
                                {settings?.socialLinks?.twitter && (
                                    <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-0.5 transition-all inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-red-50 rounded-full shadow-xs border border-slate-200"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
                                )}
                                {settings?.socialLinks?.youtube && (
                                    <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-0.5 transition-all inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-red-50 rounded-full shadow-xs border border-slate-200"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg></a>
                                )}
                            </div>
                        </div>

                        {/* Shop */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <h4 className="font-extrabold text-[#1c274c] text-[17px] sm:text-[18px] mb-5 tracking-wide">Shop</h4>
                            <ul className="space-y-3.5 text-[15px] sm:text-[15.5px] text-slate-700 font-bold">
                                <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">All Products</Link></li>
                                <li><Link to="/products?filter=new-arrivals" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">New Arrivals</Link></li>
                                <li><Link to="/products?filter=best-sellers" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Best Sellers</Link></li>
                                <li><Link to="/products?filter=sale" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Sale</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <h4 className="font-extrabold text-[#1c274c] text-[17px] sm:text-[18px] mb-5 tracking-wide">Categories</h4>
                            <ul className="space-y-3.5 text-[15px] sm:text-[15.5px] text-slate-700 font-bold">
                                {topCategories.length > 0 ? (
                                    topCategories.map((category) => (
                                        <li key={category._id}>
                                            <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Nursery</Link></li>
                                        <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Toys &amp; Games</Link></li>
                                        <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Feeding</Link></li>
                                        <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Clothing</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Customer Care */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <h4 className="font-extrabold text-[#1c274c] text-[17px] sm:text-[18px] mb-5 tracking-wide">Customer Care</h4>
                            <ul className="space-y-3.5 text-[15px] sm:text-[15.5px] text-slate-700 font-bold">
                                <li><Link to="/shipping" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Shipping &amp; Delivery</Link></li>
                                <li><Link to="/returns" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Returns &amp; Exchanges</Link></li>
                                <li><Link to="/faq" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
                                <li><Link to="/contact" className="hover:text-[#E51A22] hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="col-span-2 md:col-span-2 lg:col-span-3">
                            <h4 className="font-extrabold text-[#1c274c] text-[17px] sm:text-[18px] mb-5 tracking-wide">Contact Us</h4>
                            <ul className="space-y-4 text-[14.5px] sm:text-[15px] text-slate-700 font-bold">
                                <li className="flex gap-3 items-center">
                                    <svg className="w-5 h-5 text-[#E51A22] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    <a href="tel:+918347640423" className="hover:text-[#E51A22] transition-colors whitespace-nowrap text-[15px] font-bold">+91 8347640423</a>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <svg className="w-5 h-5 text-[#E51A22] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=adheenbhuva0007@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] transition-colors whitespace-nowrap text-[14.5px] font-bold">
                                        adheenbhuva0007@gmail.com
                                    </a>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 mt-0.5 text-[#E51A22] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <a href="https://www.google.com/maps/place/Tulsi+Arcade/@21.2395209,72.8755431,812m/data=!3m1!1e3!4m10!1m2!2m1!1sTulsi+Arcade,+Mota+Varachha,+Surat!3m6!1s0x3be04f705dffe915:0x1fc83e2ebcf890f5!8m2!3d21.2389143!4d72.8801442!15sCiJUdWxzaSBBcmNhZGUsIE1vdGEgVmFyYWNoaGEsIFN1cmF0WiIiIHR1bHNpIGFyY2FkZSBtb3RhIHZhcmFjaGhhIHN1cmF0kgEPc2hvcHBpbmdfY2VudGVy4AEA!16s%2Fg%2F11rjyphkmm?entry=ttu&amp;g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] transition-colors leading-relaxed text-[14.5px] font-bold">
                                        Tulsi Arcade, Mota Varachha, Surat
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Row - Clean Soft Translucent Bar */}
            <div className="relative z-10 w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-xs">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[14px] text-slate-700 font-bold">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                        <p>© 2026 Little Joys. All rights reserved.</p>
                        <span className="hidden sm:inline text-slate-400 font-normal">|</span>
                        <p className="text-slate-600 font-semibold">
                            Developed by{' '}
                            <a
                                href="https://appiflyinfotech.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-black text-[#1877F2] hover:text-[#0b5ed7] hover:underline transition-colors"
                            >
                                Appifly Infotech
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[14px]">
                        <Link to="/privacy" className="hover:text-[#E51A22] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#E51A22] transition-colors">Terms of Service</Link>
                        <Link to="/refund" className="hover:text-[#E51A22] transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
