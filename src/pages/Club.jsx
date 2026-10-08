import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Gift, Crown, ChevronRight, Check, Trophy, Heart, Truck, PartyPopper } from 'lucide-react';

const Club = () => {
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        { q: "How do I join the Little Joys Club?", a: "It's completely free! Just create an account on our website and you're automatically enrolled as a Member." },
        { q: "How do I earn points?", a: "You earn 1 point for every ₹10 spent. You also get bonus points for writing reviews, following us on social media, and on your child's birthday!" },
        { q: "Do my points expire?", a: "Points are valid for 12 months from the date they were earned. We'll always notify you before they expire." }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans overflow-hidden">
            {/* Hero Section - Premium & Magical */}
            <div className="relative w-full overflow-hidden bg-[#1A1A24] text-white">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1558066164-9a896f64be87?auto=format&fit=crop&q=80&w=2000" 
                        alt="Magical toys background" 
                        className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A24] via-[#1A1A24]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A24] via-transparent to-[#1A1A24]"></div>
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 pt-24 pb-32 md:pt-32 md:pb-40 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-down">
                        <Sparkles className="w-5 h-5 text-[#FFD700]" />
                        <span className="text-sm font-bold tracking-widest uppercase text-[#FFD700]">Little Joys VIP Club</span>
                    </div>
                    
                    <h1 className="text-[42px] md:text-[72px] lg:text-[84px] font-black leading-[1.1] mb-6 tracking-tight font-serif drop-shadow-2xl">
                        Where Playtime <br className="hidden md:block"/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF4500]">
                            Pays Off.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl font-medium text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Join our exclusive rewards program. Earn magical points on every purchase, unlock premium tiers, and give your kids the VIP treatment they deserve.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                        <button className="w-full sm:w-auto bg-gradient-to-r from-[#E51A22] to-[#FF4500] text-white px-10 py-5 rounded-full font-black text-lg tracking-wide hover:shadow-[0_0_30px_rgba(229,26,34,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                            Join For Free <ChevronRight className="w-6 h-6" />
                        </button>
                        <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                            Already a Member? Login
                        </button>
                    </div>
                </div>

                {/* Floating Elements Animation */}
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-10 w-24 h-24 bg-[#E51A22] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-[#4169E1] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* How It Works - Clean & Modern */}
            <div className="py-20 md:py-32 max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 -mt-10">
                <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-16 border border-gray-100">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] md:text-[48px] font-black text-[#1A1A24] mb-4">How It Works</h2>
                        <p className="text-gray-500 text-lg">Three simple steps to unlock a world of wonder.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[40px] left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 -z-10"></div>
                        
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-dashed border-[#E51A22] group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#E51A22] group-hover:border-transparent group-hover:text-white text-[#E51A22]">
                                <Heart className="w-10 h-10 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A24] mb-3">1. Join</h3>
                            <p className="text-gray-500 leading-relaxed">Create a free account and instantly get 50 bonus points to start your journey.</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-dashed border-[#FFA500] group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#FFA500] group-hover:border-transparent group-hover:text-white text-[#FFA500]">
                                <Star className="w-10 h-10 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A24] mb-3">2. Earn</h3>
                            <p className="text-gray-500 leading-relaxed">Earn 1 point for every ₹10 spent. Plus, get points for reviews and birthdays!</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-dashed border-[#4169E1] group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#4169E1] group-hover:border-transparent group-hover:text-white text-[#4169E1]">
                                <Gift className="w-10 h-10 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A24] mb-3">3. Redeem</h3>
                            <p className="text-gray-500 leading-relaxed">Turn your points into discounts, free shipping, and exclusive magical toys.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* VIP Tiers Section */}
            <div className="py-20 bg-[#1A1A24] text-white">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-2 block">STATUS MATTERS</span>
                        <h2 className="text-[36px] md:text-[56px] font-black font-serif mb-4">VIP Tiers & Benefits</h2>
                        <p className="text-gray-400 text-lg">The more you play, the more you earn.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Member Tier */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-8 hover:-translate-y-4 transition-transform duration-500">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6">
                                <Star className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-3xl font-black mb-1">Explorer</h3>
                            <p className="text-gray-400 mb-8 font-medium">Free to Join</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> <span className="text-gray-300">Earn 1 point per ₹10</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> <span className="text-gray-300">Birthday Month Double Points</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> <span className="text-gray-300">Member-only sale access</span></li>
                            </ul>
                        </div>

                        {/* Gold Tier (Highlighted) */}
                        <div className="bg-gradient-to-b from-[#FFA500]/20 to-[#E51A22]/20 backdrop-blur-md border border-[#FFA500]/50 rounded-[32px] p-8 transform scale-105 shadow-[0_0_50px_rgba(255,165,0,0.15)] relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFA500] to-[#E51A22] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                Most Popular
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]">Adventurer</h3>
                            <p className="text-[#FFA500] mb-8 font-medium">Spend ₹5,000 / year</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" /> <span className="text-gray-100 font-bold">Earn 1.5 points per ₹10</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" /> <span className="text-gray-100 font-bold">Free standard shipping</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" /> <span className="text-gray-300">Birthday Month Double Points</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" /> <span className="text-gray-300">Early access to new drops</span></li>
                            </ul>
                        </div>

                        {/* Diamond Tier */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-8 hover:-translate-y-4 transition-transform duration-500">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Champion</h3>
                            <p className="text-purple-400 mb-8 font-medium">Spend ₹15,000 / year</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> <span className="text-gray-100 font-bold">Earn 2 points per ₹10</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> <span className="text-gray-100 font-bold">Free express shipping</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> <span className="text-gray-100 font-bold">Exclusive birthday toy gift</span></li>
                                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> <span className="text-gray-300">VIP customer support</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exclusive Perks Grid */}
            <div className="py-20 md:py-32 max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[48px] font-black text-[#1A1A24] mb-4">More Than Just Points</h2>
                    <p className="text-gray-500 text-lg">Unlock experiences crafted for the ultimate joy.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                        <PartyPopper className="w-12 h-12 text-[#E51A22] mb-6 group-hover:scale-125 transition-transform duration-300" />
                        <h4 className="text-xl font-bold mb-2">Birthday Surprises</h4>
                        <p className="text-gray-500 text-sm">Special discounts and gifts during your child's birthday month.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                        <Truck className="w-12 h-12 text-[#4169E1] mb-6 group-hover:scale-125 transition-transform duration-300" />
                        <h4 className="text-xl font-bold mb-2">Free Shipping</h4>
                        <p className="text-gray-500 text-sm">Higher tiers enjoy free standard or express shipping on all orders.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                        <Star className="w-12 h-12 text-[#FFA500] mb-6 group-hover:scale-125 transition-transform duration-300" />
                        <h4 className="text-xl font-bold mb-2">Early Access</h4>
                        <p className="text-gray-500 text-sm">Shop new toy drops and limited editions 24 hours before everyone else.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                        <Sparkles className="w-12 h-12 text-purple-500 mb-6 group-hover:scale-125 transition-transform duration-300" />
                        <h4 className="text-xl font-bold mb-2">Exclusive Events</h4>
                        <p className="text-gray-500 text-sm">Invites to in-store events, magical toy unboxings, and playdates.</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-[800px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] md:text-[40px] font-black text-[#1A1A24]">Got Questions?</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className={`bg-white rounded-2xl border ${activeFaq === idx ? 'border-[#E51A22] shadow-md' : 'border-gray-200'} overflow-hidden transition-all duration-300`}
                            >
                                <button 
                                    className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-[#1A1A24] text-lg"
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                >
                                    {faq.q}
                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-90 text-[#E51A22]' : ''}`} />
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-600">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Club;
