import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, appleProvider } from '../firebase';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    RefreshCw, 
    ArrowLeft, 
    Smile, 
    ShieldCheck, 
    Truck, 
    ArrowRight,
    Heart
} from 'lucide-react';

/* ========================================================================= */
/* SOFT & SUBTLE (AACHHA) 3D TOY ICONS IN BACKGROUND                         */
/* Always Upright (Sidha), Never Inverted (Undha), Soft Dreamy Opacity       */
/* ========================================================================= */

// 1. Caramel Teddy Bear
const ToyTeddy = () => (
    <svg viewBox="0 0 72 78" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <defs>
            <radialGradient id="softTeddyGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
        </defs>
        <circle cx="18" cy="18" r="11" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <circle cx="18" cy="18" r="6" fill="#FDE68A" />
        <circle cx="54" cy="18" r="11" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <circle cx="54" cy="18" r="6" fill="#FDE68A" />
        <ellipse cx="11" cy="46" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(-15 11 46)" />
        <ellipse cx="61" cy="46" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(15 61 46)" />
        <ellipse cx="36" cy="50" rx="22" ry="24" fill="url(#softTeddyGrad)" stroke="#92400E" strokeWidth="2.5" />
        <ellipse cx="36" cy="52" rx="14" ry="16" fill="#FEF3C7" />
        <ellipse cx="23" cy="71" rx="9" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="49" cy="71" rx="9" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <circle cx="36" cy="27" r="21" fill="url(#softTeddyGrad)" stroke="#92400E" strokeWidth="2.5" />
        <ellipse cx="36" cy="33" rx="11" ry="8" fill="#FEF3C7" />
        <ellipse cx="36" cy="29" rx="4" ry="3" fill="#78350F" />
        <path d="M33 34 Q36 37 39 34" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="28" cy="24" r="3" fill="#0F172A" />
        <circle cx="27" cy="23" r="1" fill="#FFFFFF" />
        <circle cx="44" cy="24" r="3" fill="#0F172A" />
        <circle cx="43" cy="23" r="1" fill="#FFFFFF" />
        <polygon points="36,41 28,37 28,45" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <polygon points="36,41 44,37 44,45" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <circle cx="36" cy="41" r="3" fill="#DC2626" />
    </svg>
);

// 2. White Bunny with Carrot
const ToyBunny = () => (
    <svg viewBox="0 0 70 78" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <ellipse cx="27" cy="15" rx="6.5" ry="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" transform="rotate(-8 27 15)" />
        <ellipse cx="27" cy="15" rx="3.5" ry="11" fill="#FBCFE8" transform="rotate(-8 27 15)" />
        <ellipse cx="43" cy="15" rx="6.5" ry="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" transform="rotate(8 43 15)" />
        <ellipse cx="43" cy="15" rx="3.5" ry="11" fill="#FBCFE8" transform="rotate(8 43 15)" />
        <ellipse cx="35" cy="53" rx="19" ry="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        <ellipse cx="35" cy="54" rx="12" ry="13" fill="#FDF2F8" />
        <ellipse cx="24" cy="71" rx="8" ry="5.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        <ellipse cx="46" cy="71" rx="8" ry="5.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="35" cy="34" r="17" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <polygon points="35,38 32,35 38,35" fill="#F472B6" />
        <path d="M32 40 Q35 43 38 40" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="36" x2="26" y2="37" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="17" y1="40" x2="26" y2="39" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="53" y1="36" x2="44" y2="37" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="53" y1="40" x2="44" y2="39" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="28" cy="32" r="3" fill="#0F172A" />
        <circle cx="27" cy="31" r="1.2" fill="#FFFFFF" />
        <circle cx="42" cy="32" r="3" fill="#0F172A" />
        <circle cx="41" cy="31" r="1.2" fill="#FFFFFF" />
        <polygon points="35,53 32,62 38,62" fill="#EA580C" />
        <path d="M35 53 L33 49 M35 53 L37 49" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// 3. Retro Turquoise Robot
const ToyRobot = () => (
    <svg viewBox="0 0 70 78" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <circle cx="35" cy="5" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <circle cx="35" cy="5" r="3.5" fill="#F87171" />
        <path d="M35 9 L33 13 L37 16 L35 19" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <rect x="21" y="19" width="28" height="22" rx="4" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
        <rect x="17" y="25" width="4" height="8" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
        <rect x="49" y="25" width="4" height="8" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
        <rect x="25" y="24" width="20" height="8" rx="2" fill="#0F172A" />
        <circle cx="29" cy="28" r="2.2" fill="#FACC15" />
        <circle cx="41" cy="28" r="2.2" fill="#FACC15" />
        <line x1="27" y1="36" x2="43" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 1" />
        <path d="M19 46 L12 50 L12 58" stroke="#0891B2" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="12" cy="59" r="3" fill="#F59E0B" />
        <path d="M51 46 L58 50 L58 58" stroke="#0891B2" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="58" cy="59" r="3" fill="#F59E0B" />
        <rect x="19" y="42" width="32" height="24" rx="4" fill="#0891B2" stroke="#0E7490" strokeWidth="2" />
        <rect x="24" y="46" width="22" height="10" rx="2" fill="#1E293B" />
        <line x1="27" y1="51" x2="33" y2="48" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="41" cy="51" r="2" fill="#EF4444" />
        <circle cx="28" cy="60" r="2" fill="#F59E0B" />
        <circle cx="35" cy="60" r="2" fill="#3B82F6" />
        <circle cx="42" cy="60" r="2" fill="#10B981" />
        <rect x="23" y="66" width="9" height="7" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="38" y="66" width="9" height="7" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
    </svg>
);

// 4. Red Racing Car Number 7
const ToyCar = () => (
    <svg viewBox="0 0 88 62" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <defs>
            <linearGradient id="softCarRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="25%" stopColor="#EF4444" />
                <stop offset="70%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <radialGradient id="softCarGoldRim" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="90%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
        </defs>
        <path d="M4 27 L14 27 L12 32 L2 32 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="5" y1="32" x2="6" y2="38" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="32" x2="11" y2="38" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
        <path d="M 6 44 C 4 41, 6 36, 12 34 C 16 33, 20 23, 27 16 C 33 11, 46 11, 52 16 C 56 20, 60 27, 65 31 L 77 33 C 81 35, 84 38, 84 41 L 83 45 C 83 47, 80 47, 77 47 L 74 47 C 74 39, 60 39, 60 47 L 32 47 C 32 39, 18 39, 18 47 L 8 47 C 6 47, 6 44, 6 40 Z" fill="url(#softCarRedGrad)" stroke="#7F1D1D" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 28 17 C 34 13, 44 13, 49 17 C 46 19, 31 19, 28 17 Z" fill="#FFFFFF" opacity="0.6" />
        <path d="M 24 30 L 29 18 C 33 17, 36 17, 37 17 L 37 30 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1" />
        <path d="M 40 17 C 45 17, 49 19, 52 23 L 60 30 L 40 30 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1" />
        <line x1="8" y1="41" x2="81" y2="41" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="8" y1="43.5" x2="81" y2="43.5" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
        <circle cx="44" cy="41" r="6.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
        <text x="44" y="44.2" fill="#B91C1C" fontSize="8.5" fontWeight="900" textAnchor="middle">7</text>
        <ellipse cx="79" cy="38" rx="4" ry="4.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.2" />
        <circle cx="25" cy="49" r="10.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="25" cy="49" r="6.8" fill="url(#softCarGoldRim)" stroke="#78350F" strokeWidth="0.8" />
        <circle cx="25" cy="49" r="2.4" fill="#FFFFFF" />
        <circle cx="67" cy="49" r="10.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="67" cy="49" r="6.8" fill="url(#softCarGoldRim)" stroke="#78350F" strokeWidth="0.8" />
        <circle cx="67" cy="49" r="2.4" fill="#FFFFFF" />
    </svg>
);

// 5. Royal Peacock
const ToyPeacock = () => (
    <svg viewBox="0 0 96 88" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <defs>
            <radialGradient id="softPeacockBlue" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="40%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>
            <radialGradient id="softFanEmerald" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="60%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>
        </defs>
        <path d="M34 52 C22 36 10 42 4 54 C0 66 8 76 22 74 C30 72 36 62 38 54 Z" fill="url(#softFanEmerald)" stroke="#047857" strokeWidth="2.2" />
        <circle cx="16" cy="52" r="5" fill="#0284C7" stroke="#FBBF24" strokeWidth="1.5" />
        <circle cx="16" cy="64" r="5" fill="#0284C7" stroke="#FBBF24" strokeWidth="1.5" />
        <circle cx="26" cy="44" r="5" fill="#0284C7" stroke="#FBBF24" strokeWidth="1.5" />
        <ellipse cx="44" cy="52" rx="14" ry="18" fill="url(#softPeacockBlue)" stroke="#1E3A8A" strokeWidth="2.2" />
        <circle cx="55" cy="22" r="11" fill="url(#softPeacockBlue)" stroke="#1E3A8A" strokeWidth="2.2" />
        <circle cx="57" cy="20" r="3.5" fill="#0F172A" />
        <circle cx="56" cy="19" r="1.2" fill="#FFFFFF" />
        <path d="M63 19 C68 21 73 22 73 23 C73 24 68 25 63 27 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
        <line x1="53" y1="14" x2="49" y2="6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="49" cy="5" r="3" fill="#06B6D4" stroke="#F59E0B" strokeWidth="1.2" />
        <line x1="56" y1="13" x2="56" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="56" cy="4" r="3" fill="#06B6D4" stroke="#F59E0B" strokeWidth="1.2" />
        <line x1="59" y1="14" x2="63" y2="6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="63" cy="5" r="3" fill="#06B6D4" stroke="#F59E0B" strokeWidth="1.2" />
        <rect x="36" y="65" width="4" height="15" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
        <rect x="46" y="65" width="4" height="15" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
    </svg>
);

// 6. Indian Dhol Drum
const ToyDhol = () => (
    <svg viewBox="0 0 74 78" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <defs>
            <linearGradient id="softDholShell" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="35%" stopColor="#3B82F6" />
                <stop offset="70%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#172554" />
            </linearGradient>
        </defs>
        <path d="M16 12 Q30 20 48 33" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="12" r="3.2" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
        <line x1="58" y1="12" x2="26" y2="33" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="12" r="3.2" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="37" cy="33" rx="27" ry="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        <ellipse cx="37" cy="33" rx="24" ry="6.5" fill="#FFFFFF" />
        <rect x="10" y="33" width="54" height="30" fill="url(#softDholShell)" stroke="#1E3A8A" strokeWidth="2" />
        <polygon points="10,33 23,63 37,33 50,63 64,33" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="23" cy="63" r="2.5" fill="#D97706" />
        <circle cx="37" cy="33" r="2.5" fill="#D97706" />
        <circle cx="50" cy="63" r="2.5" fill="#D97706" />
        <polygon points="37,45 39,49 43,49 40,52 41,56 37,53 33,56 34,52 31,49 35,49" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
        <ellipse cx="37" cy="63" rx="27" ry="8" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
        <ellipse cx="37" cy="63" rx="24" ry="6.5" fill="#D97706" />
    </svg>
);

// 7. Authentic Rocking Horse
const ToyHorse = () => (
    <img
        src="/images/toy_rocking_horse.png"
        alt="Rocking Horse"
        className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
        loading="eager"
    />
);

// 8. Space Rocket
const ToyRocket = () => (
    <svg viewBox="0 0 68 76" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <path d="M34 6 C24 18 20 32 20 48 L48 48 C48 32 44 18 34 6 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
        <circle cx="34" cy="28" r="7" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        <circle cx="34" cy="28" r="4.5" fill="#38BDF8" />
        <path d="M20 38 L10 50 L20 48 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
        <path d="M48 38 L58 50 L48 48 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
        <polygon points="26,48 34,64 42,48" fill="#FBBF24" />
        <polygon points="29,48 34,58 39,48" fill="#EF4444" />
    </svg>
);

// 9. Steam Train Engine
const ToyTrain = () => (
    <svg viewBox="0 0 76 60" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <rect x="8" y="24" width="36" height="22" rx="3" fill="#10B981" stroke="#047857" strokeWidth="2" />
        <rect x="44" y="16" width="24" height="30" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <rect x="48" y="20" width="16" height="11" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
        <rect x="14" y="12" width="9" height="12" rx="1.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <path d="M10 12 L27 12 L24 8 L13 8 Z" fill="#EF4444" />
        <polygon points="4,35 8,26 8,44" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <circle cx="18" cy="46" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="18" cy="46" r="3" fill="#FBBF24" />
        <circle cx="34" cy="46" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="34" cy="46" r="3" fill="#FBBF24" />
        <circle cx="56" cy="46" r="8" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="56" cy="46" r="4" fill="#FBBF24" />
    </svg>
);

// 10. Stacked ABC Wooden Blocks
const ToyBlocks = () => (
    <svg viewBox="0 0 68 68" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <rect x="8" y="30" width="24" height="24" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <text x="20" y="47" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">A</text>
        <rect x="36" y="30" width="24" height="24" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <text x="48" y="47" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">B</text>
        <rect x="22" y="8" width="24" height="24" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <text x="34" y="25" fill="#78350F" fontSize="14" fontWeight="900" textAnchor="middle">C</text>
    </svg>
);

// 11. Rubber Duckling
const ToyDuck = () => (
    <svg viewBox="0 0 68 68" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <ellipse cx="30" cy="42" rx="20" ry="16" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="44" cy="24" r="13" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="47" cy="22" r="2.5" fill="#0F172A" />
        <path d="M55 24 C60 25 63 26 63 28 C63 30 58 30 55 29 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
        <ellipse cx="28" cy="44" rx="11" ry="8" fill="#EAB308" />
    </svg>
);

// 12. Vintage Biplane
const ToyPlane = () => (
    <svg viewBox="0 0 70 70" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <ellipse cx="35" cy="35" rx="24" ry="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <ellipse cx="48" cy="33" rx="7" ry="4" fill="#E0F2FE" />
        <polygon points="12,35 6,26 10,26 18,35" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <polygon points="28,35 32,12 42,12 38,35" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <polygon points="30,35 34,54 42,54 38,35" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
        <circle cx="58" cy="35" r="2.5" fill="#1E293B" />
        <line x1="58" y1="26" x2="58" y2="44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

// 13. Festive Helium Balloons
const ToyBalloons = () => (
    <svg viewBox="0 0 68 72" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <ellipse cx="24" cy="24" rx="12" ry="15" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
        <ellipse cx="21" cy="20" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.45" />
        <ellipse cx="44" cy="22" rx="12" ry="15" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
        <ellipse cx="41" cy="18" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.45" />
        <ellipse cx="34" cy="32" rx="13" ry="16" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="31" cy="27" rx="4" ry="6.5" fill="#FFFFFF" opacity="0.5" />
        <path d="M24 39 Q28 52 34 64" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        <path d="M44 37 Q40 50 34 64" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        <path d="M34 48 L34 64" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
    </svg>
);

// 14. Colorful Spinning Top
const ToySpinningTop = () => (
    <svg viewBox="0 0 68 68" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <rect x="32" y="8" width="4" height="12" rx="2" fill="#EF4444" />
        <polygon points="12,30 56,30 34,56" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
        <polygon points="12,30 56,30 34,20" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <line x1="18" y1="36" x2="50" y2="36" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="24" y1="44" x2="44" y2="44" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        <circle cx="34" cy="58" r="3" fill="#1E293B" />
    </svg>
);

// 15. Rainbow Baby Xylophone with Mallet
const ToyXylophone = () => (
    <svg viewBox="0 0 74 68" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <polygon points="12,14 62,22 58,54 8,50" fill="#B45309" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="15,17 59,24 55,51 11,47" fill="#D97706" />
        {/* 5 Vibrant Tone Bars */}
        <rect x="14" y="10" width="8" height="46" rx="2.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" transform="rotate(-3 18 33)" />
        <circle cx="18" cy="15" r="1.5" fill="#FFFFFF" />
        <circle cx="17" cy="51" r="1.5" fill="#FFFFFF" />
        <rect x="24" y="13" width="8" height="41" rx="2.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" transform="rotate(-1 28 33)" />
        <circle cx="28" cy="18" r="1.5" fill="#FFFFFF" />
        <circle cx="27" cy="49" r="1.5" fill="#FFFFFF" />
        <rect x="34" y="16" width="8" height="36" rx="2.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.2" />
        <circle cx="38" cy="20" r="1.5" fill="#FFFFFF" />
        <circle cx="38" cy="47" r="1.5" fill="#FFFFFF" />
        <rect x="44" y="19" width="8" height="31" rx="2.5" fill="#10B981" stroke="#047857" strokeWidth="1.2" transform="rotate(1 48 34)" />
        <circle cx="48" cy="23" r="1.5" fill="#FFFFFF" />
        <circle cx="48" cy="45" r="1.5" fill="#FFFFFF" />
        <rect x="54" y="22" width="8" height="26" rx="2.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" transform="rotate(3 58 35)" />
        <circle cx="58" cy="25" r="1.5" fill="#FFFFFF" />
        <circle cx="58" cy="44" r="1.5" fill="#FFFFFF" />
        {/* Mallet */}
        <line x1="8" y1="58" x2="48" y2="28" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="49" cy="27" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
    </svg>
);

// 16. Nautical Wooden Toy Sailboat
const ToyBoat = () => (
    <svg viewBox="0 0 74 72" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <path d="M12 46 L20 62 L54 62 L62 46 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15 48 L21 60 L53 60 L59 48 Z" fill="#38BDF8" />
        <line x1="16" y1="54" x2="58" y2="54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="12" x2="38" y2="46" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <polygon points="38,15 38,43 58,43" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points="40,24 40,36 52,36" fill="#F43F5E" />
        <polygon points="36,18 36,43 18,43" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="38,12 47,8 38,5" fill="#EF4444" />
        <path d="M10 65 Q20 68 30 65 Q40 62 50 65 Q60 68 66 65" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
);

// 17. Vibrant 4-Blade Spinning Pinwheel (Chakri)
const ToyPinwheel = () => (
    <svg viewBox="0 0 72 74" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <line x1="36" y1="36" x2="36" y2="70" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M36 36 L36 12 C36 12, 56 16, 56 36 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <path d="M36 36 L60 36 C60 36, 56 56, 36 56 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
        <path d="M36 36 L36 60 C36 60, 16 56, 16 36 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <path d="M36 36 L12 36 C12 36, 16 16, 36 16 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <circle cx="36" cy="36" r="4.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="36" cy="36" r="2" fill="#FEF08A" />
    </svg>
);

// 18. Classic Wooden Yo-Yo with Star
const ToyYoyo = () => (
    <svg viewBox="0 0 70 70" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <path d="M35 10 Q28 18 35 26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="35" cy="8" r="2" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
        <ellipse cx="38" cy="40" rx="22" ry="22" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
        <ellipse cx="35" cy="40" rx="21" ry="21" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="21" ry="21" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <ellipse cx="32" cy="40" rx="14" ry="14" fill="#DC2626" />
        <polygon points="32,32 34,37 39,37 35,40 37,45 32,42 27,45 29,40 25,37 30,37" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
        <path d="M22 28 A18 18 0 0 1 38 24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
);

// 19. Sparkling Star Magic Wand with Ribbons
const ToyStarWand = () => (
    <svg viewBox="0 0 72 74" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <line x1="18" y1="64" x2="42" y2="34" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="17" y1="65" x2="23" y2="58" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M40 35 Q48 44 44 56 Q40 68 46 72" stroke="#F472B6" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M41 37 Q52 42 50 52 Q48 62 54 66" stroke="#38BDF8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <polygon points="46,8 50,19 62,20 53,28 56,40 46,33 36,40 39,28 30,20 42,19" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="46" cy="24" r="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
        <circle cx="45" cy="23" r="1" fill="#FFFFFF" />
        <polygon points="26,14 28,18 32,18 29,20 30,24 26,22 22,24 23,20 20,18 24,18" fill="#FACC15" opacity="0.8" />
        <polygon points="58,6 59,9 62,9 60,11 61,14 58,12 55,14 56,11 54,9 57,9" fill="#FACC15" opacity="0.8" />
    </svg>
);

// 20. Sky-Blue Toy Helicopter
const ToyHelicopter = () => (
    <svg viewBox="0 0 76 66" fill="none" className="w-full h-full filter drop-shadow-sm overflow-visible">
        <line x1="14" y1="12" x2="62" y2="12" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" />
        <rect x="36" y="12" width="4" height="6" fill="#1E293B" rx="1" />
        <path d="M22 28 C22 20, 32 18, 44 18 C54 18, 58 24, 58 32 C58 40, 52 44, 40 44 C26 44, 22 36, 22 28 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
        <path d="M42 21 C48 21, 54 24, 54 30 L42 30 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
        <path d="M24 30 L8 28 L8 24" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="24" r="2.5" fill="#F59E0B" />
        <line x1="8" y1="18" x2="8" y2="30" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="44" x2="30" y2="52" stroke="#475569" strokeWidth="2" />
        <line x1="46" y1="44" x2="48" y2="52" stroke="#475569" strokeWidth="2" />
        <line x1="22" y1="52" x2="56" y2="52" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

/* Map of all 20 unique toy designs */
const TOY_MAP = {
    teddy: <ToyTeddy />,
    bunny: <ToyBunny />,
    robot: <ToyRobot />,
    car: <ToyCar />,
    peacock: <ToyPeacock />,
    dhol: <ToyDhol />,
    horse: <ToyHorse />,
    rocket: <ToyRocket />,
    train: <ToyTrain />,
    blocks: <ToyBlocks />,
    duck: <ToyDuck />,
    plane: <ToyPlane />,
    balloons: <ToyBalloons />,
    spinningtop: <ToySpinningTop />,
    xylophone: <ToyXylophone />,
    boat: <ToyBoat />,
    pinwheel: <ToyPinwheel />,
    yoyo: <ToyYoyo />,
    starwand: <ToyStarWand />,
    helicopter: <ToyHelicopter />
};

/* 
 * 20 COMPLETELY UNIQUE TOYS (Every toy appears EXACTLY ONCE - "Aek j var").
 * Filling the outer zones, mid zones, AND the spaces on BOTH SIDES directly flanking the Login Box ("Box Ni baju ma bane Baju").
 * All toys are soft & faint ("Thodak Aachha"), strictly upright ("Sidha", never inverted), gently floating.
 */
const SOFT_BACKGROUND_TOYS = [
    // -------------------------------------------------------------
    // LEFT SIDE (9 Unique Toys across Outer, Mid, and Flank Beside Box)
    // -------------------------------------------------------------
    // 1. Far Top-Left Outer Edge (Lowered to top-[8%] with clear breathing space)
    { id: 1, type: 'teddy', pos: 'top-[8%] left-[4%]', anim: 'animate-soft-1', dur: '9.2s', delay: '-1.4s', opacity: 'opacity-28 sm:opacity-35' },
    // 2. Mid Top-Left Area
    { id: 2, type: 'robot', pos: 'top-[18%] left-[13%]', anim: 'animate-soft-2', dur: '11.5s', delay: '-3.8s', opacity: 'opacity-28 sm:opacity-35' },
    // 3. FLANK-LEFT TOP: Directly in the space beside the top-left of the box!
    { id: 3, type: 'blocks', pos: 'top-[14%] left-[26%]', anim: 'animate-soft-3', dur: '10.0s', delay: '-5.2s', opacity: 'opacity-28 sm:opacity-35' },
    // 4. Far Mid-Left Outer Edge
    { id: 4, type: 'car', pos: 'top-[42%] left-[2%]', anim: 'animate-soft-4', dur: '9.8s', delay: '-3.3s', opacity: 'opacity-28 sm:opacity-35' },
    // 5. FLANK-LEFT CENTER: Directly in the space beside the left wall of the box!
    { id: 5, type: 'xylophone', pos: 'top-[44%] left-[23%]', anim: 'animate-soft-1', dur: '11.0s', delay: '-2.5s', opacity: 'opacity-28 sm:opacity-35' },
    // 6. Mid Center-Left Area
    { id: 6, type: 'duck', pos: 'top-[60%] left-[12%]', anim: 'animate-soft-2', dur: '11.2s', delay: '-7.6s', opacity: 'opacity-28 sm:opacity-35' },
    // 7. FLANK-LEFT BOTTOM: Directly in the space beside the bottom-left of the box!
    { id: 7, type: 'pinwheel', pos: 'top-[73%] left-[26%]', anim: 'animate-soft-3', dur: '10.4s', delay: '-4.6s', opacity: 'opacity-28 sm:opacity-35' },
    // 8. Far Bottom-Left Outer Edge
    { id: 8, type: 'plane', pos: 'bottom-[12%] left-[4%]', anim: 'animate-soft-4', dur: '11.8s', delay: '-2.7s', opacity: 'opacity-28 sm:opacity-35' },
    // 9. Mid Bottom-Left Area
    { id: 9, type: 'boat', pos: 'bottom-[4%] left-[15%]', anim: 'animate-soft-1', dur: '12.2s', delay: '-6.0s', opacity: 'opacity-28 sm:opacity-35' },

    // -------------------------------------------------------------
    // RIGHT SIDE (9 Unique Toys across Outer, Mid, and Flank Beside Box)
    // -------------------------------------------------------------
    // 10. Far Top-Right Outer Edge (Lowered to top-[8%] with clear breathing space)
    { id: 10, type: 'horse', pos: 'top-[8%] right-[4%]', anim: 'animate-soft-4', dur: '12.4s', delay: '-2.1s', opacity: 'opacity-28 sm:opacity-35' },
    // 11. Mid Top-Right Area
    { id: 11, type: 'bunny', pos: 'top-[18%] right-[13%]', anim: 'animate-soft-1', dur: '8.8s', delay: '-4.7s', opacity: 'opacity-28 sm:opacity-35' },
    // 12. FLANK-RIGHT TOP: Directly in the space beside the top-right of the box!
    { id: 12, type: 'rocket', pos: 'top-[14%] right-[26%]', anim: 'animate-soft-2', dur: '10.6s', delay: '-6.5s', opacity: 'opacity-28 sm:opacity-35' },
    // 13. Far Mid-Right Outer Edge
    { id: 13, type: 'peacock', pos: 'top-[42%] right-[2%]', anim: 'animate-soft-3', dur: '13.0s', delay: '-1.9s', opacity: 'opacity-28 sm:opacity-35' },
    // 14. FLANK-RIGHT CENTER: Directly in the space beside the right wall of the box!
    { id: 14, type: 'starwand', pos: 'top-[44%] right-[23%]', anim: 'animate-soft-4', dur: '9.6s', delay: '-3.7s', opacity: 'opacity-28 sm:opacity-35' },
    // 15. Mid Center-Right Area
    { id: 15, type: 'dhol', pos: 'top-[60%] right-[12%]', anim: 'animate-soft-1', dur: '10.4s', delay: '-5.8s', opacity: 'opacity-28 sm:opacity-35' },
    // 16. FLANK-RIGHT BOTTOM: Directly in the space beside the bottom-right of the box!
    { id: 16, type: 'yoyo', pos: 'top-[73%] right-[26%]', anim: 'animate-soft-2', dur: '11.4s', delay: '-7.2s', opacity: 'opacity-28 sm:opacity-35' },
    // 17. Far Bottom-Right Outer Edge
    { id: 17, type: 'spinningtop', pos: 'bottom-[12%] right-[4%]', anim: 'animate-soft-3', dur: '10.8s', delay: '-6.2s', opacity: 'opacity-28 sm:opacity-35' },
    // 18. Mid Bottom-Right Area
    { id: 18, type: 'helicopter', pos: 'bottom-[4%] right-[15%]', anim: 'animate-soft-4', dur: '8.6s', delay: '-3.5s', opacity: 'opacity-28 sm:opacity-35' },

    // -------------------------------------------------------------
    // TOP & BOTTOM CENTER MARGINS (2 Unique Toys filling Vertical Gaps)
    // -------------------------------------------------------------
    // 19. Top-Center Gap (Above the Card)
    { id: 19, type: 'train', pos: 'top-[3%] left-[50%] -translate-x-1/2', anim: 'animate-soft-3', dur: '11.0s', delay: '-7.1s', opacity: 'opacity-24 sm:opacity-30' },
    // 20. Bottom-Center Gap (Below the Card)
    { id: 20, type: 'balloons', pos: 'bottom-[2.5%] left-[50%] -translate-x-1/2', anim: 'animate-soft-2', dur: '9.4s', delay: '-4.9s', opacity: 'opacity-24 sm:opacity-30' }
];

/* ========================================================================= */
/* MAIN LOGIN INNER COMPONENT                                                */
/* ========================================================================= */

const LoginInner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Only show checkout notice if explicitly arriving directly from checkout in this active session
    const isFromCheckout = Boolean(location.state?.from?.includes('checkout'));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRocketLaunching, setIsRocketLaunching] = useState(false);
    const [isFlightTakingOff, setIsFlightTakingOff] = useState(false);

    const lastGoogleClickRef = useRef(0);
    const lastAppleClickRef = useRef(0);

    // Auto-reset loading states on focus & clean up stale checkout flags if not actively coming from checkout
    useEffect(() => {
        if (!location.state?.from?.includes('checkout')) {
            localStorage.removeItem('toyjoy_checkout_redirect');
        }

        const handleWindowFocus = () => {
            setIsRocketLaunching(false);
            setIsFlightTakingOff(false);
        };
        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
    }, [location.state]);

    // Centralized login success handler with checkout redirect support
    const handleLoginSuccess = (data, toastId, defaultMsg = 'Welcome to Little Joys! ✨') => {
        localStorage.setItem('token', data.token);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        const redirectUrl = location.state?.from || localStorage.getItem('toyjoy_checkout_redirect');
        if (redirectUrl) {
            localStorage.removeItem('toyjoy_checkout_redirect');
            toast.success(`Welcome back, ${data.user?.name || 'Friend'}! Resuming your checkout... 💳✨`, { id: toastId, duration: 4000 });
            navigate(redirectUrl, { replace: true });
        } else {
            toast.success(defaultMsg, { id: toastId });
            navigate('/', { state: { showConfetti: true } });
        }
    };

    // Standard Email/Username & Password Authentication
    const handleAuthSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email/username and password.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Verifying credentials... 🎁");

        try {
            const endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/email-login`;
            const payload = { 
                email: email.trim().toLowerCase(), 
                password 
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.ok) {
                handleLoginSuccess(data, toastId, `Welcome back, ${data.user?.name || 'Friend'}! 🧸✨`);
            } else {
                toast.error(data.message || 'Invalid email or password.', { id: toastId });
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error("Server connection error. Please try again.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google Login API handler
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const toastId = toast.loading("Signing in with Google... 🚀");
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/social`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accessToken: tokenResponse.access_token,
                        provider: 'google'
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    handleLoginSuccess(data, toastId, `Welcome to Little Joys, ${data.user?.name || ''}! ✨`);
                } else {
                    throw new Error(data.message || 'Authentication failed');
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                toast.error(err.message || "Failed to log in with Google.", { id: toastId });
            } finally {
                setIsRocketLaunching(false);
            }
        },
        onError: (err) => {
            setIsRocketLaunching(false);
            console.error("Google Login Error details:", err);
            if (err?.error === 'popup_closed_by_user') {
                toast('Google login window closed.', { icon: 'ℹ️' });
            } else {
                toast.error("Google Login was cancelled or failed. Please check popup settings.");
            }
        },
        onNonOAuthError: (nonOAuthError) => {
            setIsRocketLaunching(false);
            console.warn("Google nonOAuthError:", nonOAuthError);
            if (nonOAuthError?.type === 'popup_closed') {
                toast('Google login window closed.', { icon: 'ℹ️' });
            } else if (nonOAuthError?.type === 'popup_blocked') {
                toast.error("Google Login popup was blocked. Please allow popups.");
            }
        }
    });

    const handleGoogleClick = () => {
        const now = Date.now();
        if (now - lastGoogleClickRef.current < 600) return;
        lastGoogleClickRef.current = now;

        setIsRocketLaunching(true);
        try {
            googleLogin();
        } catch (err) {
            console.error("Error opening googleLogin:", err);
            setIsRocketLaunching(false);
            toast.error("Unable to open Google sign-in window.");
        }

        setTimeout(() => {
            setIsRocketLaunching(false);
        }, 1800);
    };

    const handleAppleClick = () => {
        const now = Date.now();
        if (now - lastAppleClickRef.current < 600) return;
        lastAppleClickRef.current = now;

        setIsFlightTakingOff(true);
        const toastId = toast.loading("Connecting to Apple... ✈️");

        (async () => {
            try {
                const provider = appleProvider;
                const result = await signInWithPopup(auth, provider);
                const idToken = await result.user.getIdToken();

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/social`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken, provider: 'apple' })
                });

                const data = await response.json();
                if (response.ok) {
                    handleLoginSuccess(data, toastId, "Welcome to Little Joys! ✨");
                } else {
                    throw new Error(data.message || 'Authentication failed on server');
                }
            } catch (error) {
                console.error("Apple Login Error:", error);
                if (error.code !== 'auth/popup-closed-by-user') {
                    toast.error("Could not log in with Apple.", { id: toastId });
                } else {
                    toast.dismiss(toastId);
                }
            } finally {
                setIsFlightTakingOff(false);
            }
        })();

        setTimeout(() => {
            setIsFlightTakingOff(false);
        }, 2000);
    };

    return (
        <div className="h-screen w-screen max-w-full overflow-hidden flex flex-col justify-between p-3.5 sm:p-5 relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE5] text-slate-900 select-none selection:bg-[#E51A22] selection:text-white font-sans">
            
            {/* Custom Animations: Sheen Button & Gentle Soft Floating Loops ("Thodak Aachha & Sidha") */}
            <style>{`
                @keyframes sheenShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .toy-sheen-btn {
                    position: relative;
                    overflow: hidden;
                }
                .toy-sheen-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
                    transform: translateX(-100%);
                    animation: sheenShine 3.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Gentle Soft Trajectory 1: Ambient Upward Lift & Gentle Lean */
                @keyframes floatSoft1 {
                    0%, 100% {
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50% {
                        transform: translate(10px, -16px) rotate(4deg);
                    }
                }

                /* Gentle Soft Trajectory 2: Ambient Leftward Drift & Soft Bob */
                @keyframes floatSoft2 {
                    0%, 100% {
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50% {
                        transform: translate(-12px, -18px) rotate(-4deg);
                    }
                }

                /* Gentle Soft Trajectory 3: Horizontal Air Sway */
                @keyframes floatSoft3 {
                    0%, 100% {
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50% {
                        transform: translate(14px, -12px) rotate(-3deg);
                    }
                }

                /* Gentle Soft Trajectory 4: Gentle Vertical Wave */
                @keyframes floatSoft4 {
                    0%, 100% {
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50% {
                        transform: translate(-10px, -20px) rotate(3deg);
                    }
                }

                .animate-soft-1 { animation: floatSoft1 ease-in-out infinite; }
                .animate-soft-2 { animation: floatSoft2 ease-in-out infinite; }
                .animate-soft-3 { animation: floatSoft3 ease-in-out infinite; }
                .animate-soft-4 { animation: floatSoft4 ease-in-out infinite; }
            `}</style>

            {/* ========================================================================= */}
            {/* AMBIENT SOFT COLOR GLOWS IN BACKGROUND CORNERS                             */}
            {/* ========================================================================= */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -right-24 w-72 h-72 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* ========================================================================= */}
            {/* BACKGROUND TOYS LAYER: SOFT & FAINT ("THODAK AACHHA")                     */}
            {/* Subtle, dreamy opacity, always strictly upright (Sidha), peaceful drift   */}
            {/* ========================================================================= */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                {SOFT_BACKGROUND_TOYS.map((toy) => (
                    <div
                        key={toy.id}
                        className={`absolute ${toy.pos} w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 flex items-center justify-center ${toy.anim} ${toy.opacity} pointer-events-auto hover:opacity-95 hover:scale-115 transition-all duration-300 drop-shadow-xs cursor-default`}
                        style={{ 
                            animationDuration: toy.dur,
                            animationDelay: toy.delay 
                        }}
                    >
                        {TOY_MAP[toy.type]}
                    </div>
                ))}
            </div>

            {/* ========================================================================= */}
            {/* TOP BAR: BACK TO STORE (LEFT)                                             */}
            {/* Right side is completely clear so top-right background toys are fully visible */}
            {/* ========================================================================= */}
            <header className="w-full flex items-center justify-start z-30 shrink-0 px-3 sm:px-6 py-1">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 py-1.5 px-2 rounded-full text-slate-800 hover:text-[#E51A22] font-black text-xs sm:text-sm transition-all group cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#E51A22] stroke-[2.5]" />
                    <span className="text-[#1E293B] group-hover:text-[#E51A22] transition-colors">Back to Store</span>
                </Link>
            </header>

            {/* ========================================================================= */}
            {/* CENTER: PRISTINE WHITE LUXURY LOGIN CARD IN THE EXACT MIDDLE OF SCREEN    */}
            {/* ========================================================================= */}
            <main className="w-full max-w-[430px] sm:max-w-[450px] mx-auto my-auto z-20 relative bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-rose-100/70 p-5 sm:p-6.5">
                
                {/* Brand Crowned Emblem */}
                <div className="flex flex-col items-center mb-3 select-none">
                    <div className="relative group cursor-pointer">
                        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white p-1 shadow-md shadow-rose-500/15 border border-rose-100/90 transition-transform duration-300 group-hover:scale-105">
                            <div className="w-full h-full bg-[#E51A22] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                                <Smile className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        <span className="absolute -top-2.5 -right-1.5 text-base select-none">👑</span>
                    </div>

                    <div className="text-center mt-2">
                        <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-1.5">
                            <span>Welcome to </span>
                            <span className="text-[#E51A22]">Little Joys</span>
                            <span className="text-amber-400 text-base sm:text-lg">✨</span>
                        </h1>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-500 mt-0.5">
                            Sign in to your exclusive Toy Kingdom account
                        </p>
                    </div>
                </div>

                {/* Checkout In-Progress Priority Notice */}
                {isFromCheckout && (
                    <div className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/90 flex items-start gap-2.5 shadow-2xs">
                        <span className="text-base leading-none shrink-0 mt-0.5">🛒</span>
                        <div className="text-xs sm:text-[13px]">
                            <p className="font-black text-[#E51A22]">Checkout in Progress</p>
                            <p className="text-xs text-slate-600 mt-0.5 font-semibold leading-tight">
                                Log in below to finish payment. Your cart &amp; address are safely saved!
                            </p>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* 1. USERNAME / EMAIL & PASSWORD FORM ON TOP (UPPER)        */}
                {/* ========================================================= */}
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                    
                    {/* Email or Username Input */}
                    <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#E51A22] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username or Email Address"
                            required
                            autoComplete="username email"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E51A22] focus:ring-4 focus:ring-rose-500/10 transition-all shadow-2xs"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#E51A22] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            autoComplete="current-password"
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E51A22] focus:ring-4 focus:ring-rose-500/10 transition-all shadow-2xs"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1 rounded-md"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-[#E51A22] focus:ring-[#E51A22] border-slate-300 cursor-pointer accent-[#E51A22]"
                            />
                            <span className="font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                Remember Me
                            </span>
                        </label>
                        <Link 
                            to="/forgot-password" 
                            className="font-black text-[#E51A22] hover:text-[#b31016] transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Action Button with Ruby Sheen */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="toy-sheen-btn w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#E51A22] via-[#F43F5E] to-[#E51A22] bg-[length:200%_auto] hover:bg-right active:scale-[0.98] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(229,26,34,0.4)] transition-all cursor-pointer disabled:opacity-60 mt-0.5"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span>Login to Little Joys</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200/80 w-full" />
                    <span className="bg-white px-2.5 text-[10.5px] sm:text-xs font-black tracking-wider text-slate-400 uppercase whitespace-nowrap">
                        or continue with
                    </span>
                    <div className="border-t border-slate-200/80 w-full" />
                </div>

                {/* ========================================================= */}
                {/* 2. GOOGLE & APPLE BUTTONS BELOW (NICHE)                   */}
                {/* ========================================================= */}
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleClick}
                        className="py-2.5 sm:py-3 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer"
                    >
                        {isRocketLaunching ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-[#E51A22]" />
                        ) : (
                            <>
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                    <path fill="#FBBC05" d="M5.28 14.27A7.098 7.098 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.968 11.968 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
                                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                </svg>
                                <span>Google</span>
                            </>
                        )}
                    </button>

                    {/* Apple Button */}
                    <button
                        type="button"
                        onClick={handleAppleClick}
                        className="py-2.5 sm:py-3 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-xs active:scale-[0.97] transition-all cursor-pointer"
                    >
                        {isFlightTakingOff ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-800" />
                        ) : (
                            <>
                                <svg className="w-4 h-4 shrink-0 fill-current text-black" viewBox="0 0 170 170">
                                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.58-7.79-11.66-14.19-6.07-9.52-10.74-20.15-14.02-31.89-3.28-11.74-4.92-22.95-4.92-33.62 0-14.34 3.73-26.24 11.19-35.69 7.46-9.45 16.73-14.28 27.81-14.5 5.01 0 10.38 1.25 16.12 3.76 5.74 2.51 9.61 3.82 11.61 3.93 1.74 0 5.88-1.42 12.43-4.26 6.54-2.84 12.18-4.04 16.92-3.6 12.63 1.09 22.84 6.2 30.63 15.34-11.08 6.74-16.51 15.98-16.3 27.72.22 9.13 3.75 16.85 10.6 23.16 6.85 6.31 15.01 10.01 24.48 11.1-2.18 6.52-4.8 12.83-7.86 18.93zM119.22 31.85c0-7.39 2.66-14.29 7.97-20.7 5.31-6.41 11.85-10.45 19.62-12.13.33 1.2.5 2.39.5 3.59 0 7.39-2.77 14.39-8.31 21-5.54 6.61-12.12 10.51-19.78 11.7-.55-1.2-.82-2.36-.82-3.46z"/>
                                </svg>
                                <span>Apple</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Integrated Trust Strip Below Form */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        100% Child-Safe
                    </span>
                    <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#E51A22]" />
                        Fast Delivery
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Genuine Toys
                    </span>
                </div>

            </main>

            {/* ========================================================================= */}
            {/* BOTTOM: FOOTER                                                            */}
            {/* ========================================================================= */}
            <footer className="w-full text-center text-xs text-slate-400 font-bold z-30 shrink-0 py-1">
                <p>© {new Date().getFullYear()} Little Joys Toys. Bringing Smiles with Genuine &amp; Safe Toys.</p>
            </footer>

        </div>
    );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "78513809226-3ga8bce79l1c5fthbv7c9j3mpnrqcnc5.apps.googleusercontent.com";

const Login = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginInner />
        </GoogleOAuthProvider>
    );
};

export default Login;
