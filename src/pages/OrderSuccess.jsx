import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    useEffect(() => {
        // Play success sound
        try {
            const audio = new Audio('/success.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio autoplay blocked', e));
        } catch (e) {
            console.log('Audio playback error', e);
        }

        // Trigger confetti on mount
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#4F46E5', '#10B981', '#F59E0B']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#4F46E5', '#10B981', '#F59E0B']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white transform rotate-3">
                        <svg className="w-10 h-10 text-emerald-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Payment Successful!</h1>
                    <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
                        Thank you for your purchase. Your order has been placed securely via Razorpay and is now being processed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
