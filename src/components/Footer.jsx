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
        <footer className="w-full bg-[#fcfaf7] border-t border-[#f3eee7] font-sans text-[#5e504f]">
            {/* Integrated Full-Width Newsletter Section */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-12 pb-8">
                <div className="bg-[#fef4ea] rounded-[2rem] p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-[#fae5d3] shadow-sm">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-40 blur-2xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#e6a27a] rounded-full opacity-10 blur-3xl"></div>

                        {/* Cute aesthetic clouds positioned dynamically */}
                        <div className="absolute top-10 right-20 w-16 h-8 bg-white/60 rounded-full hidden md:block"></div>
                        <div className="absolute top-6 right-28 w-10 h-10 bg-white/60 rounded-full hidden md:block"></div>

                        <div className="absolute bottom-10 right-40 w-24 h-10 bg-white/60 rounded-full hidden md:block"></div>
                        <div className="absolute bottom-6 right-48 w-12 h-12 bg-white/60 rounded-full hidden md:block"></div>
                        <div className="absolute bottom-12 right-36 w-12 h-12 bg-[#f8d070]/40 rounded-full hidden md:block"></div>
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 mb-8 md:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#e6a27a] shadow-sm">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <h3 className="text-[26px] md:text-[30px] font-serif text-[#3d3130]">Join Our Little Joys Family</h3>
                        </div>
                        <p className="text-[#8b7e7c] text-[15px] max-w-[400px]">
                            Get special offers, new arrivals, and parenting tips straight to your inbox.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 flex md:justify-end">
                        <form onSubmit={handleSubscribe} className="flex w-full max-w-[450px] bg-white rounded-full p-1.5 shadow-sm border border-[#f3eee7] focus-within:border-[#e6a27a] focus-within:ring-2 focus-within:ring-[#e6a27a]/20 transition-all overflow-hidden">
                            <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-5 py-3 text-[15px] text-[#3d3130] outline-none rounded-l-full" style={{ WebkitBoxShadow: '0 0 0 50px white inset' }} value={email} onChange={(e) => setEmail(e.target.value)} pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Please enter a valid email address with @ and ." required />
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-[#93b38c] hover:bg-[#7a9a73] text-white font-semibold text-[15px] px-8 py-3 rounded-full transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 pt-8 border-t border-[#f3eee7]">

                    {/* Brand Col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a]">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[18px] font-serif font-bold text-[#3d3130]">Little Joys</span>
                                <span className="text-[9px] text-[#8b7e7c] tracking-wider">KIDS & BABY STORE</span>
                            </div>
                        </div>
                        <p className="text-[13px] leading-relaxed mb-6">
                            Thoughtfully chosen baby and kids products for every little adventure.
                        </p>
                        <div className="flex gap-4 text-[#3d3130]">
                            {settings?.socialLinks?.facebook && (
                                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
                            )}
                            {settings?.socialLinks?.twitter && (
                                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
                            )}
                            {settings?.socialLinks?.youtube && (
                                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg></a>
                            )}
                        </div>
                    </div>

                    {/* Links Cols */}
                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Shop</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">All Products</Link></li>
                            <li><Link to="/products?filter=new-arrivals" className="hover:text-[#e6a27a] transition-colors">New Arrivals</Link></li>
                            <li><Link to="/products?filter=best-sellers" className="hover:text-[#e6a27a] transition-colors">Best Sellers</Link></li>
                            <li><Link to="/products?filter=sale" className="hover:text-[#e6a27a] transition-colors">Sell</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Categories</h4>
                        <ul className="space-y-3 text-[13px]">
                            {topCategories.length > 0 ? (
                                topCategories.map((category) => (
                                    <li key={category._id}>
                                        <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="hover:text-[#e6a27a] transition-colors">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Nursery</Link></li>
                                    <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Toys & Games</Link></li>
                                    <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Feeding</Link></li>
                                    <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Clothing</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Customer Care</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/shipping" className="hover:text-[#e6a27a] transition-colors">Shipping & Delivery</Link></li>
                            <li><Link to="/returns" className="hover:text-[#e6a27a] transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/faq" className="hover:text-[#e6a27a] transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-[#e6a27a] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Contact Us</h4>
                        <ul className="space-y-4 text-[13px]">
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                <a href="tel:+15125550198" className="hover:text-[#e6a27a] transition-colors">(512) 555-0198</a>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@littlejoys.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors">hello@littlejoys.com</a>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <a href="https://maps.google.com/?q=123+Happy+Lane,+Austin,+TX+78701" target="_blank" rel="noopener noreferrer" className="hover:text-[#e6a27a] transition-colors">
                                    123 Happy Lane,<br />Austin, TX 78701
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-[#f3eee7] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px]">
                    <p>© 2026 Little Joys. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-[#e6a27a] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#e6a27a] transition-colors">Terms of Service</Link>
                        <Link to="/refund" className="hover:text-[#e6a27a] transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
