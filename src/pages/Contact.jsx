import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <Link to="/" className="text-[#2e4053] font-bold hover:text-[#1282a2] transition-colors">Home</Link>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Contact</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2e4053] mb-8 font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                Contact
            </h1>

            {/* Three Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[160px]">
                    <Phone className="w-6 h-6 text-[#1282a2] mb-4" strokeWidth={1.5} />
                    <h3 className="font-bold text-[#2e4053] text-[15px] mb-1">Phone number</h3>
                    <p className="text-slate-600 text-[14px]">123-456-7868</p>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[160px]">
                    <Mail className="w-6 h-6 text-[#1282a2] mb-4" strokeWidth={1.5} />
                    <h3 className="font-bold text-[#2e4053] text-[15px] mb-1">Email</h3>
                    <p className="text-slate-600 text-[14px]">info@example.com</p>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[160px]">
                    <MapPin className="w-6 h-6 text-[#1282a2] mb-4" strokeWidth={1.5} />
                    <h3 className="font-bold text-[#2e4053] text-[15px] mb-1">Address place</h3>
                    <p className="text-slate-600 text-[14px]">1930 marigold lane, way<br/>Miami, Florida USA</p>
                </div>
            </div>

            {/* Bottom Section: Map and Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                
                {/* Left: Map */}
                <div className="h-[450px] rounded-[2rem] overflow-hidden border border-slate-200 relative bg-slate-100">
                    <iframe 
                        title="Miami Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925916665!2d-80.2994992026862!3d25.782390733064336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Right: Contact Form */}
                <div className="pt-4 lg:pt-0">
                    <h2 className="text-2xl font-bold text-[#2e4053] mb-8 font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                        Contact Us
                    </h2>
                    
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Your name" 
                                className="w-full border border-slate-300 rounded-xl px-5 py-3 text-[14px] text-[#2e4053] focus:outline-none focus:border-[#1282a2] placeholder-slate-400"
                            />
                        </div>
                        
                        <div>
                            <input 
                                type="text" 
                                placeholder="Phone number" 
                                className="w-full border border-slate-300 rounded-xl px-5 py-3 text-[14px] text-[#2e4053] focus:outline-none focus:border-[#1282a2] placeholder-slate-400"
                            />
                        </div>
                        
                        <div>
                            <input type="email" placeholder="Email address" className="w-full border border-slate-300 rounded-xl px-5 py-3 text-[14px] text-[#2e4053] focus:outline-none focus:border-[#1282a2] placeholder-slate-400" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Please enter a valid email address with @ and ." />
                        </div>
                        
                        <div>
                            <textarea 
                                placeholder="Write your comment here..." 
                                rows="5"
                                className="w-full border border-slate-300 rounded-xl px-5 py-3 text-[14px] text-[#2e4053] focus:outline-none focus:border-[#1282a2] placeholder-slate-400 resize-none"
                            ></textarea>
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                className="bg-[#1282a2] hover:bg-[#0f6c87] text-white font-medium text-[15px] px-8 py-2.5 rounded-xl transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;
