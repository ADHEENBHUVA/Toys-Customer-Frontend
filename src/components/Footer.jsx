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
        <footer className="w-full relative font-['Outfit'] text-slate-800 bg-[#FDFBF7] overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <img 
                    src="/images/footer_bg_new.png" 
                    alt="Kids playing with toys" 
                    className="w-full h-full object-cover object-[center_bottom]" 
                />
            </div>

            {/* Footer Content Wrapper */}
            <div className="relative z-10 w-full">
                {/* Gradient overlay for bottom links readability */}
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/95 via-white/70 to-transparent pointer-events-none z-[-1]"></div>
                
                {/* Normal top padding (pt-16) to make it look like a regular footer */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-16 pb-8">
                    <div className="p-4 sm:p-8 lg:p-12 relative flex flex-col lg:flex-row items-center justify-between">
                    
                    <div className="relative z-10 w-full lg:w-[55%] mb-10 lg:mb-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl shadow-[0_8px_20px_rgba(229,26,34,0.15)] flex items-center justify-center text-[#E51A22] shrink-0 border border-red-50">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <h3 className="text-[28px] sm:text-[34px] md:text-[40px] font-sans font-extrabold text-[#1c274c] leading-tight tracking-tight drop-shadow-sm">
                                Join Our Little Joys Family
                            </h3>
                        </div>
                        <p className="font-sans text-slate-700 font-medium text-[16px] md:text-[18px] leading-relaxed max-w-[90%] pl-[72px] drop-shadow-sm">
                            Get special offers, new toy arrivals, and magical parenting tips delivered straight to your inbox.
                        </p>
                    </div>

                    {/* Right Side: Unified Pill Form */}
                    <div className="relative z-10 w-full lg:w-[45%] flex lg:justify-end pl-0 lg:pl-10">
                        <form onSubmit={handleSubscribe} className="flex w-full max-w-[500px] bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white focus-within:border-red-200 focus-within:shadow-[0_8px_30px_rgba(229,26,34,0.15)] transition-all duration-300 relative">
                            <div className="flex items-center pl-4 text-slate-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-transparent px-4 py-3.5 text-[16px] text-[#1c274c] font-semibold outline-none border-none focus:ring-0 placeholder:text-slate-400 w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                title="Please enter a valid email address with @ and ."
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#E51A22] hover:bg-red-600 text-white font-bold tracking-wide text-[16px] px-10 py-3.5 rounded-full transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(229,26,34,0.3)] hover:shadow-[0_8px_25px_rgba(229,26,34,0.4)] hover:-translate-y-1"
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12 lg:gap-12 mb-12 pt-10 border-t border-slate-200/60">

                    {/* Brand Col */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full border-[3px] border-[#E51A22] flex items-center justify-center text-[#E51A22] bg-white/50 backdrop-blur-sm">
                                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[24px] font-black text-[#1c274c]">Little Joys</span>
                                <span className="text-[10px] font-extrabold text-[#E51A22] tracking-widest mt-1">KIDS & BABY STORE</span>
                            </div>
                        </div>
                        <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-8 pr-4 sm:pr-0">
                            Thoughtfully chosen baby and kids products for every little adventure.
                        </p>
                        <div className="flex gap-5 text-[#1c274c]">
                            {settings?.socialLinks?.facebook && (
                                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-1.5 transition-all duration-300 inline-block bg-white/60 p-2 rounded-full shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-1.5 transition-all duration-300 inline-block bg-white/60 p-2 rounded-full shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
                            )}
                            {settings?.socialLinks?.twitter && (
                                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-1.5 transition-all duration-300 inline-block bg-white/60 p-2 rounded-full shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
                            )}
                            {settings?.socialLinks?.youtube && (
                                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:-translate-y-1.5 transition-all duration-300 inline-block bg-white/60 p-2 rounded-full shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg></a>
                            )}
                        </div>
                    </div>

                    {/* Links Cols */}
                    <div className="col-span-1 lg:col-span-1">
                        <h4 className="font-extrabold text-[#1c274c] text-[18px] mb-6 tracking-wide drop-shadow-sm">Shop</h4>
                        <ul className="space-y-4 text-[16px] text-slate-700 font-semibold">
                            <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">All Products</Link></li>
                            <li><Link to="/products?filter=new-arrivals" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">New Arrivals</Link></li>
                            <li><Link to="/products?filter=best-sellers" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Best Sellers</Link></li>
                            <li><Link to="/products?filter=sale" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Sale</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h4 className="font-extrabold text-[#1c274c] text-[18px] mb-6 tracking-wide drop-shadow-sm">Categories</h4>
                        <ul className="space-y-4 text-[16px] text-slate-700 font-semibold">
                            {topCategories.length > 0 ? (
                                topCategories.map((category) => (
                                    <li key={category._id}>
                                        <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Nursery</Link></li>
                                    <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Toys & Games</Link></li>
                                    <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Feeding</Link></li>
                                    <li><Link to="/products" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Clothing</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h4 className="font-extrabold text-[#1c274c] text-[18px] mb-6 tracking-wide drop-shadow-sm">Customer Care</h4>
                        <ul className="space-y-4 text-[16px] text-slate-700 font-semibold">
                            <li><Link to="/shipping" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Shipping & Delivery</Link></li>
                            <li><Link to="/returns" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Returns & Exchanges</Link></li>
                            <li><Link to="/faq" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-[#E51A22] hover:translate-x-1.5 transition-all duration-300 inline-block">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h4 className="font-extrabold text-[#1c274c] text-[18px] mb-6 tracking-wide drop-shadow-sm">Contact Us</h4>
                        <ul className="space-y-5 text-[16px] text-slate-700 font-semibold break-words">
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-1 text-[#E51A22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                <a href="tel:+918347640423" className="hover:text-[#E51A22] hover:translate-x-1 transition-all duration-300 inline-block font-medium">+91 8347640423</a>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-1 text-[#E51A22] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=adheenbhuva0007@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:translate-x-1 transition-all duration-300 inline-block break-all font-medium">adheenbhuva0007@gmail.com</a>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-1 text-[#E51A22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <a href="https://www.google.com/maps/place/Tulsi+Arcade/@21.2395209,72.8755431,812m/data=!3m1!1e3!4m10!1m2!2m1!1sTulsi+Arcade,+Mota+Varachha,+Surat!3m6!1s0x3be04f705dffe915:0x1fc83e2ebcf890f5!8m2!3d21.2389143!4d72.8801442!15sCiJUdWxzaSBBcmNhZGUsIE1vdGEgVmFyYWNoaGEsIFN1cmF0WiIiIHR1bHNpIGFyY2FkZSBtb3RhIHZhcmFjaGhhIHN1cmF0kgEPc2hvcHBpbmdfY2VudGVy4AEA!16s%2Fg%2F11rjyphkmm?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-[#E51A22] hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                                    Tulsi Arcade, Mota Varachha,<br />Surat
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[15px] text-slate-700 font-bold">
                    <p className="drop-shadow-sm">© 2026 Little Joys. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                        <Link to="/privacy" className="hover:text-[#E51A22] transition-colors duration-300 inline-block drop-shadow-sm">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#E51A22] transition-colors duration-300 inline-block drop-shadow-sm">Terms of Service</Link>
                        <Link to="/refund" className="hover:text-[#E51A22] transition-colors duration-300 inline-block drop-shadow-sm">Refund Policy</Link>
                    </div>
                </div>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
