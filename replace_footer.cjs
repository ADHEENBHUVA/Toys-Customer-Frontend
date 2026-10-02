const fs = require('fs');
const footerCode = `import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-[#fcfaf7] pt-16 pb-8 border-t border-[#f3eee7] font-sans text-[#5e504f]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a]">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
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
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                            <a href="#" className="hover:text-[#e6a27a] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
                        </div>
                    </div>

                    {/* Links Cols */}
                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Shop</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">All Products</Link></li>
                            <li><Link to="/products?search=new" className="hover:text-[#e6a27a] transition-colors">New Arrivals</Link></li>
                            <li><Link to="/products?search=best" className="hover:text-[#e6a27a] transition-colors">Best Sellers</Link></li>
                            <li><Link to="/products?search=sale" className="hover:text-[#e6a27a] transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#3d3130] text-[15px] mb-5">Categories</h4>
                        <ul className="space-y-3 text-[13px]">
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Nursery</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Toys & Games</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Feeding</Link></li>
                            <li><Link to="/products" className="hover:text-[#e6a27a] transition-colors">Clothing</Link></li>
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
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <span>(512) 555-0198</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <span>hello@littlejoys.com</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <svg className="w-4 h-4 mt-0.5 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span>123 Happy Lane,<br/>Austin, TX 78701</span>
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
`;
fs.writeFileSync('d:/Toys Website/Customer Frontend/src/components/Footer.jsx', footerCode);

const cssAddition = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap');
`;
let cssContent = fs.readFileSync('d:/Toys Website/Customer Frontend/src/index.css', 'utf8');
if (!cssContent.includes('Fraunces')) {
    fs.writeFileSync('d:/Toys Website/Customer Frontend/src/index.css', cssAddition + cssContent);
}

console.log('Footer and CSS Replaced');
