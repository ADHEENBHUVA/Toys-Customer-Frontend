import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const FloatingActions = () => {
    const location = useLocation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isArrowClicked, setIsArrowClicked] = useState(false);

    // Hide completely on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    useEffect(() => {
        const checkScroll = () => {
            const currentScroll = 
                window.pageYOffset || 
                document.documentElement.scrollTop || 
                document.body.scrollTop || 
                0;
            
            setShowScrollTop(currentScroll > 120);
        };

        window.addEventListener('scroll', checkScroll, { passive: true });
        document.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();

        return () => {
            window.removeEventListener('scroll', checkScroll);
            document.removeEventListener('scroll', checkScroll);
        };
    }, []);

    const scrollToTop = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Trigger unique Red transformation burst on click
        setIsArrowClicked(true);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        if (document.documentElement) {
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (document.body) {
            document.body.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(() => {
            setIsArrowClicked(false);
        }, 900);
    };

    const whatsappNumber = '918347640423';
    const whatsappMessage = encodeURIComponent('Hello Little Joys Toys! I would like to inquire about toys.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <>
            <style>{`
                @keyframes toyjoyFloatWhatsapp {
                    0%, 100% {
                        transform: translateY(0px) scale(1);
                    }
                    50% {
                        transform: translateY(-6px) scale(1.04);
                    }
                }
                @keyframes toyjoyFloatArrow {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                @keyframes toyjoyPulseRing {
                    0% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.65), 0 10px 25px rgba(37, 211, 102, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 16px rgba(37, 211, 102, 0), 0 10px 25px rgba(37, 211, 102, 0.4);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 10px 25px rgba(37, 211, 102, 0.4);
                    }
                }
                @keyframes toyjoyRedBurstWave {
                    0% {
                        box-shadow: 0 0 0 0 rgba(229, 26, 34, 0.8), 0 12px 30px rgba(229, 26, 34, 0.5);
                    }
                    70% {
                        box-shadow: 0 0 0 18px rgba(229, 26, 34, 0), 0 12px 30px rgba(229, 26, 34, 0.5);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(229, 26, 34, 0), 0 12px 30px rgba(229, 26, 34, 0.5);
                    }
                }
                .toyjoy-btn-wa {
                    animation: toyjoyFloatWhatsapp 2.4s ease-in-out infinite, toyjoyPulseRing 2.4s infinite;
                    transition: transform 0.2s ease, filter 0.2s ease;
                }
                .toyjoy-btn-wa:hover {
                    animation-play-state: paused;
                    transform: scale(1.12) translateY(-2px) !important;
                    filter: brightness(1.06);
                }
                .toyjoy-btn-wa:active {
                    transform: scale(0.95) !important;
                }
                .toyjoy-btn-arrow {
                    animation: toyjoyFloatArrow 2.2s ease-in-out infinite;
                }
                .toyjoy-btn-arrow-clicked {
                    animation: toyjoyRedBurstWave 0.9s ease-out infinite !important;
                }
            `}</style>

            <div 
                id="toyjoy-floating-actions"
                className="fixed bottom-20 right-4 sm:right-6 md:bottom-8 md:right-8 z-[99999] flex flex-col items-center gap-3 select-none pointer-events-auto"
            >
                {/* 1. SCROLL TO TOP ARROW BUTTON (Turns into Unique Vibrant RED on Click) */}
                <div
                    className={`transition-all duration-300 ease-out transform ${
                        showScrollTop
                            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 scale-60 translate-y-3 pointer-events-none'
                    }`}
                >
                    <button
                        type="button"
                        onClick={scrollToTop}
                        title="Scroll to top"
                        aria-label="Scroll to top"
                        className={`toyjoy-btn-arrow w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer p-0 transition-all duration-300 group ${
                            isArrowClicked
                                ? 'toyjoy-btn-arrow-clicked bg-gradient-to-tr from-[#B31016] via-[#E51A22] to-[#FF4545] text-white border-2 border-white ring-4 ring-rose-200/90 scale-110 -translate-y-2 shadow-2xl shadow-rose-600/60'
                                : 'bg-white hover:bg-rose-50 text-slate-900 hover:text-[#E51A22] border-2 border-slate-200/90 hover:border-rose-300 shadow-xl shadow-slate-900/15 hover:scale-105'
                        }`}
                    >
                        <ArrowUp 
                            className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-all duration-300 ${
                                isArrowClicked 
                                    ? 'text-white -translate-y-1 scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]' 
                                    : 'text-slate-900 group-hover:text-[#E51A22] group-hover:-translate-y-0.5'
                            }`} 
                        />
                    </button>
                </div>

                {/* 2. WHATSAPP CHAT BUTTON (Bright green circle with official WhatsApp icon) */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat with Little Joys on WhatsApp"
                    aria-label="Chat with Little Joys on WhatsApp"
                    className="toyjoy-btn-wa w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center cursor-pointer shadow-xl shadow-emerald-500/40"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8 fill-white drop-shadow-xs"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.61 20.16 9.21 19.79 7.99 19.08L7.7 18.91L4.59 19.73L5.42 16.7L5.23 16.4C4.44 15.13 4.02 13.56 4.02 11.92C4.02 7.38 7.72 3.67 12.04 3.67ZM16.57 14.39C16.32 14.26 15.09 13.66 14.86 13.58C14.63 13.5 14.47 13.46 14.3 13.71C14.14 13.96 13.67 14.51 13.52 14.68C13.38 14.84 13.23 14.86 12.98 14.74C12.73 14.61 11.93 14.35 10.98 13.5C10.24 12.84 9.74 12.03 9.6 11.78C9.45 11.53 9.58 11.4 9.71 11.27C9.82 11.16 9.96 10.99 10.08 10.84C10.21 10.7 10.25 10.59 10.33 10.43C10.41 10.26 10.37 10.12 10.31 10C10.25 9.87 9.76 8.67 9.55 8.18C9.35 7.7 9.15 7.76 9 7.75H8.53C8.36 7.75 8.1 7.81 7.87 8.06C7.65 8.31 7.02 8.9 7.02 10.11C7.02 11.32 7.9 12.48 8.02 12.65C8.14 12.81 9.75 15.3 12.22 16.36C12.81 16.61 13.26 16.76 13.62 16.88C14.21 17.06 14.75 17.04 15.17 16.97C15.64 16.9 16.62 16.38 16.82 15.8C17.02 15.23 17.02 14.74 16.96 14.63C16.9 14.53 16.75 14.47 16.57 14.39Z"
                        />
                    </svg>
                </a>
            </div>
        </>
    );
};

export default FloatingActions;
