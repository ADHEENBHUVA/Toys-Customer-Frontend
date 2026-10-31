import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, appleProvider } from '../firebase';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { 
    Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
    Heart, Star, Truck, Check, ArrowLeft, Sparkles, User as UserIcon
} from 'lucide-react';
import { BRAND_LOGO_BASE64 } from '../components/brandLogoBase64';

const COMPANY_LOGO_URL = BRAND_LOGO_BASE64 || "/brand-logo.png";
const TOYS_HERO_BG = "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop";

const LoginContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Toggle between Sign In and Create Account (Sign Up)
    const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Vehicle animation states
    const [isTrainChugging, setIsTrainChugging] = useState(false); // Vehicle 3 Steam Train chugs forward on tracks
    const [isRocketLaunching, setIsRocketLaunching] = useState(false); // Google Rocket shoots straight UP out of the screen
    const [isFlightTakingOff, setIsFlightTakingOff] = useState(false); // Apple Jet takes off diagonally out of the screen

    useEffect(() => {
        setIsSignUp(location.pathname === '/register');
    }, [location.pathname]);

    // 1. Sign In / Register Button Click -> Steam Train Chugs Away -> Success
    const handleAuthSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in both email and password.", { icon: '🚂' });
            return;
        }

        if (isSignUp && password.length < 6) {
            toast.error("Password must be at least 6 characters long.", { icon: '🔒' });
            return;
        }

        setIsSubmitting(true);
        setIsTrainChugging(true); // Steam Train starts chugging forward along the railway tracks!

        const actionText = isSignUp ? "Creating Your Account... 🚂💨" : "Steam Train Driving to Account... 🚂💨";
        const toastId = toast.loading(actionText);
        
        try {
            const endpoint = isSignUp 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/register`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/email-login`;

            const payload = isSignUp 
                ? { name: name.trim(), email: email.trim().toLowerCase(), password }
                : { email: email.trim().toLowerCase(), password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            
            // Allow train driving animation to zoom forward along the tracks
            await new Promise(res => setTimeout(res, 850));

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                const welcomeMsg = isSignUp 
                    ? `Account created! Welcome to Little Joys, ${data.user?.name || ''}! 🎉✨`
                    : `Welcome back, ${data.user?.name || 'Customer'}! 🚂✨`;
                toast.success(welcomeMsg, { id: toastId });
                navigate('/', { state: { showConfetti: true } });
            } else {
                setIsTrainChugging(false);
                toast.error(data.message || (isSignUp ? 'Registration failed.' : 'Invalid email or password.'), { id: toastId });
            }
        } catch (err) {
            console.error('Auth error:', err);
            setIsTrainChugging(false);
            toast.error("Network error. Please try again.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google Login API handler
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const toastId = toast.loading("Verifying Google account... 🚀");
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
                    localStorage.setItem('token', data.token);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    toast.success(`Welcome to Little Joys, ${data.user?.name || ''}! ✨`, { id: toastId });
                    navigate('/', { state: { showConfetti: true } });
                } else {
                    throw new Error(data.message || 'Authentication failed');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to log in with Google.", { id: toastId });
            } finally {
                setIsRocketLaunching(false);
            }
        },
        onError: () => {
            setIsRocketLaunching(false);
            toast.error("Google Login was cancelled or failed.");
        }
    });

    // 2. Google Button Click -> ONLY Rocket shoots UP and flies OUT of the screen, Button stays in place
    const handleGoogleClick = () => {
        setIsRocketLaunching(true);
        toast("Rocket Launching to Space... 🚀🔥", { icon: '🚀' });
        
        // Rocket shoots high up into space for 700ms before opening Google auth
        setTimeout(() => {
            googleLogin();
        }, 700);
    };

    // 3. Apple Button Click -> ONLY Flight takes OFF and flies OUT of the screen, Button stays in place
    const handleAppleClick = () => {
        setIsFlightTakingOff(true);
        toast("Flight Taking Off into Clouds... ✈️💨", { icon: '✈️' });
        
        setTimeout(async () => {
            const toastId = toast.loading("Connecting to Apple... ✈️");
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
                    localStorage.setItem('token', data.token);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    toast.success(`Welcome to Little Joys! ✨`, { id: toastId });
                    navigate('/', { state: { showConfetti: true } });
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
        }, 700);
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans bg-slate-50 m-0 p-0 select-none relative">
            
            {/* CSS FOR SKY LAUNCH ANIMATIONS: ONLY ROCKET & FLIGHT SOAR OFF TOP OF SCREEN */}
            <style>{`
                @keyframes rocketFlyOutOfScreen {
                    0% {
                        transform: translateY(0) scale(1.1);
                        opacity: 1;
                    }
                    35% {
                        transform: translateY(-40vh) scale(1.5) rotate(-5deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-135vh) scale(2.2) rotate(0deg);
                        opacity: 0;
                    }
                }
                @keyframes flightFlyOutOfScreen {
                    0% {
                        transform: translate(0, 0) scale(1.1) rotate(0deg);
                        opacity: 1;
                    }
                    35% {
                        transform: translate(25vw, -40vh) scale(1.5) rotate(-22deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(85vw, -135vh) scale(2.2) rotate(-35deg);
                        opacity: 0;
                    }
                }
                .animate-rocket-skyward {
                    animation: rocketFlyOutOfScreen 0.85s cubic-bezier(0.12, 0.8, 0.2, 1) forwards;
                }
                .animate-flight-skyward {
                    animation: flightFlyOutOfScreen 0.85s cubic-bezier(0.12, 0.8, 0.2, 1) forwards;
                }
            `}</style>

            {/* LEFT 50% PANEL: FULL SCREEN VEHICLES WONDERLAND */}
            <div className="hidden md:flex md:w-1/2 h-full relative overflow-hidden bg-cover bg-center text-white p-6 lg:p-8 xl:p-10 flex-col justify-between">
                {/* Background Photography with Warm Film Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${TOYS_HERO_BG}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-900/40"></div>

                {/* Top Row: ONLY 1 OFFICIAL LITTLE JOYS LOGO + RATING */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link 
                        to="/" 
                        className="inline-block bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-white/40 hover:scale-105 transition-transform duration-200"
                        title="Little Joys - Back to Home"
                    >
                        <img 
                            src={COMPANY_LOGO_URL} 
                            alt="Little Joys" 
                            className="h-8 sm:h-9 w-auto object-contain"
                        />
                    </Link>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-300 border border-white/25 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>★ 4.9 Rating by 10k+ Parents</span>
                    </div>
                </div>

                {/* Middle: 3 Unique Vehicles Showcase */}
                <div className="relative z-10 my-auto py-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/30 backdrop-blur-md border border-rose-400/40 text-rose-200 text-xs font-black mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                        <span>Handcrafted 3D Toy Vehicles Fleet</span>
                    </div>

                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight mb-2">
                        Ride the Bus, Haul the Truck &amp; Board the Train!
                    </h2>
                    
                    <p className="text-xs text-white/90 leading-relaxed max-w-md mb-4">
                        Discover 100% child-safe, imaginative toy vehicles engineered to inspire joy, creativity, and active playtime fun.
                    </p>

                    {/* 3 Vehicles Cards */}
                    <div className="grid grid-cols-3 gap-2.5 max-w-lg">
                        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 flex flex-col items-center text-center hover:bg-white/25 transition-all shadow-sm group">
                            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚌</span>
                            <p className="text-xs font-extrabold text-white leading-tight">3D Express Bus</p>
                            <p className="text-[10px] text-amber-200 font-medium">Passenger line</p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 flex flex-col items-center text-center hover:bg-white/25 transition-all shadow-sm group">
                            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚚</span>
                            <p className="text-xs font-extrabold text-white leading-tight">3D Cargo Truck</p>
                            <p className="text-[10px] text-blue-200 font-medium">Heavy freight vault</p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 flex flex-col items-center text-center hover:bg-white/25 transition-all shadow-sm group">
                            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚂</span>
                            <p className="text-xs font-extrabold text-white leading-tight">3D Steam Train</p>
                            <p className="text-[10px] text-rose-200 font-medium">Railway express</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Ribbons */}
                <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-300" />
                        <span>Fast Pan-India Dispatch</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400 fill-current" />
                        <span>Loved by 10,000+ Kids</span>
                    </div>
                </div>
            </div>

            {/* RIGHT 50% PANEL: 3 TRULY UNIQUE 3D VEHICLES (1 BUS, 2 TRUCK, 3 TRAIN) */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-3 sm:p-5 lg:p-6 xl:p-8 bg-white overflow-hidden relative">
                
                {/* Top Row: Back to Store + Official Trust Pill */}
                <div className="flex items-center justify-between w-full">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#E51A22] font-bold text-xs border border-slate-200 transition-all active:scale-95 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Store</span>
                    </Link>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Safe Checkout</span>
                    </div>
                </div>

                {/* Mobile Single Logo */}
                <div className="flex md:hidden items-center justify-center pt-0.5">
                    <img src={COMPANY_LOGO_URL} alt="Little Joys" className="h-6 w-auto object-contain" />
                </div>

                {/* Form Core (1 3D Bus, 2 3D Truck, 3 3D Train) */}
                <div className="max-w-md mx-auto w-full my-auto py-0.5">
                    
                    {/* Header */}
                    <div className="mb-2 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E51A22] text-[11px] font-black mb-1 border border-red-100">
                            <span>{isSignUp ? '🎉 Join the Fleet • Create Account' : '🚌 🚚 🚂 3D Toy Vehicles Sign In'}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1c274c] tracking-tight leading-tight">
                            {isSignUp ? 'Create Your Account' : 'Sign In to Little Joys'}
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium">
                            {isSignUp 
                                ? 'Type on the Bus, Truck & Train to create your driver account!'
                                : 'Type on the Bus (Email) & Truck (Password), then Board the Train!'}
                        </p>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-3">
                        
                        {/* DRIVER NAME FIELD (ONLY FOR SIGN UP) */}
                        {isSignUp && (
                            <div>
                                <div className="flex items-center justify-between px-1 mb-1">
                                    <span className="text-[11px] font-black text-amber-700 uppercase flex items-center gap-1">
                                        <span>🪪</span>
                                        <span>Driver License Name</span>
                                    </span>
                                </div>
                                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-1.5 flex items-center gap-2">
                                    <UserIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Enter your name (e.g. Adheen Bhuva)..."
                                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ========================================================= */}
                        {/* 🚌 VEHICLE 1: 3D EXPRESS TOY BUS (EMAIL INPUT) */}
                        {/* ========================================================= */}
                        <div>
                            {/* Bus Label Header with Clean Margins (No Overlap) */}
                            <div className="flex items-center justify-between px-1 mb-1">
                                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-600">
                                    <span className="text-base">🚌</span>
                                    <span>Vehicle 1: 3D Express Bus</span>
                                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider">
                                        ROUTE #01
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Driver Email</span>
                            </div>

                            {/* 3D Bus Body Container */}
                            <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-500 rounded-2xl p-2.5 pb-4 shadow-md border-2 border-red-700 transition-all focus-within:shadow-xl focus-within:border-red-800">
                                
                                {/* Bus Top Windows Row with Smiling Passengers */}
                                <div className="flex items-center justify-between px-2 mb-1.5 text-[10px] text-white/90">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-black/30 px-1.5 py-0.2 rounded text-[9px] font-bold flex items-center gap-1">
                                            <span>🧸</span>
                                            <span>🤖</span>
                                            <span>🐥</span>
                                            <span className="text-yellow-300 ml-1">PASSENGERS</span>
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-black text-yellow-300 uppercase tracking-wider">
                                        TOY BUS CABIN
                                    </span>
                                </div>

                                {/* Bus Cabin Inset: Email Typing Box */}
                                <div className="bg-white rounded-xl px-3 py-1.5 border border-red-200 shadow-inner flex items-center gap-2 relative z-10">
                                    <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                        <Mail className="w-3.5 h-3.5 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required
                                            placeholder="Write email on this 3D bus..."
                                            className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                                        />
                                    </div>

                                    {/* Front Bus Headlight Bulb + Soft Luminous Glow Halo */}
                                    <div className="relative flex items-center shrink-0">
                                        <div className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                                            rememberMe 
                                                ? 'bg-yellow-300 shadow-[0_0_15px_#FACC15]' 
                                                : 'bg-slate-300'
                                        }`}></div>
                                        {/* Soft Radial Headlight Glow Halo */}
                                        <div 
                                            className={`absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-10 pointer-events-none rounded-full blur-md transition-all duration-300 ${
                                                rememberMe ? 'opacity-80 scale-100 bg-yellow-300' : 'opacity-0 scale-75'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* 2 3D Bus Wheels with Wheel Wells */}
                                <div className="absolute -bottom-2.5 left-8 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 shadow-md flex items-center justify-center z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500"></div>
                                </div>
                                <div className="absolute -bottom-2.5 right-10 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 shadow-md flex items-center justify-center z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500"></div>
                                </div>
                            </div>
                        </div>

                        {/* ========================================================= */}
                        {/* 🚚 VEHICLE 2: 3D HEAVY CARGO TRUCK (PASSWORD VAULT) */}
                        {/* ========================================================= */}
                        <div>
                            {/* Truck Label Header with Clean Margins */}
                            <div className="flex items-center justify-between px-1 mb-1">
                                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-600">
                                    <span className="text-base">🚚</span>
                                    <span>Vehicle 2: 3D Cargo Delivery Truck</span>
                                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider">
                                        #02 FREIGHT
                                    </span>
                                </div>
                                {!isSignUp && (
                                    <a 
                                        href="#" 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            toast("To reset password, contact support at adheenbhuva0007@gmail.com", { icon: '🔑' }); 
                                        }} 
                                        className="text-[10px] font-bold text-[#E51A22] hover:underline"
                                    >
                                        Forgot Password?
                                    </a>
                                )}
                            </div>

                            {/* 3D Heavy Truck Body: Corrugated Container + Driver Cab */}
                            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-sky-800 rounded-2xl p-2.5 pb-4 shadow-md border-2 border-blue-950 transition-all focus-within:shadow-xl focus-within:border-blue-950">
                                
                                {/* Truck Header Row: Corrugated Container Ribs & Top Chrome Chimney */}
                                <div className="flex items-center justify-between px-2 mb-1.5 text-[10px] text-white/90">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-black/30 px-1.5 py-0.2 rounded text-[9px] font-bold text-sky-200">
                                            📦 STEEL CARGO VAULT
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                        <span>CAB CHIMNEY</span>
                                        <span className="text-slate-300">💨</span>
                                    </span>
                                </div>

                                {/* Truck Vault Inset: Password Typing Box */}
                                <div className="bg-white rounded-xl px-3 py-1.5 border border-blue-200 shadow-inner flex items-center gap-2 relative z-10">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={isSignUp ? "Set secure password (min 6 chars)..." : "Write password inside cargo truck..."}
                                            required
                                            className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                                        />
                                    </div>

                                    {/* Brass Cargo Lock Padlock Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-400 hover:text-blue-700 p-1 cursor-pointer transition-colors shrink-0"
                                        title={showPassword ? "Lock vault (hide password)" : "Unlock vault (show password)"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4" />}
                                    </button>

                                    {/* Front Truck Headlight Bulb + Soft Halo */}
                                    <div className="relative flex items-center shrink-0 ml-1">
                                        <div className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                                            rememberMe 
                                                ? 'bg-yellow-300 shadow-[0_0_15px_#FACC15]' 
                                                : 'bg-slate-300'
                                        }`}></div>
                                        {/* Soft Radial Headlight Glow Halo */}
                                        <div 
                                            className={`absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-10 pointer-events-none rounded-full blur-md transition-all duration-300 ${
                                                rememberMe ? 'opacity-80 scale-100 bg-yellow-300' : 'opacity-0 scale-75'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Heavy Truck Wheels: Tandem Dual Rear Wheels (Left) + Front Steer Wheel (Right) */}
                                <div className="absolute -bottom-2.5 left-7 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 shadow-md flex items-center justify-center z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-600"></div>
                                </div>
                                <div className="absolute -bottom-2.5 left-14 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 shadow-md flex items-center justify-center z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-600"></div>
                                </div>
                                <div className="absolute -bottom-2.5 right-10 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 shadow-md flex items-center justify-center z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-600"></div>
                                </div>
                            </div>
                        </div>

                        {/* ========================================================= */}
                        {/* 💡 VEHICLE HEADLIGHT IGNITION SWITCH (REMEMBER ME) */}
                        {/* ========================================================= */}
                        <div>
                            <label className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer select-none hover:bg-amber-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border-2 transition-all ${
                                        rememberMe ? 'bg-amber-500 border-amber-500 text-white shadow-xs' : 'border-slate-300 bg-white'
                                    }`}>
                                        {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="sr-only" 
                                    />
                                    <span className="text-xs font-bold text-slate-800">
                                        Remember this device
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[10px] font-black">
                                    <span className={rememberMe ? "text-amber-500 animate-pulse" : "text-slate-400"}>
                                        💡 Headlights {rememberMe ? 'ON (Glowing)' : 'OFF'}
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* ========================================================= */}
                        {/* 🚂 VEHICLE 3: 3D STEAM EXPRESS TRAIN (SUBMIT BUTTON) */}
                        {/* ========================================================= */}
                        <div>
                            {/* Train Label Header */}
                            <div className="flex items-center justify-between px-1 mb-1">
                                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-700">
                                    <span className="text-base">🚂</span>
                                    <span>Vehicle 3: 3D Steam Train</span>
                                    <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider">
                                        #03 LOCOMOTIVE
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Railway Boarding</span>
                            </div>

                            {/* THE 3D STEAM LOCOMOTIVE BUTTON: CHUGS ON TRACKS */}
                            <div className="relative">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`w-full relative py-3 px-4 rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(185,28,28,0.4)] hover:shadow-[0_10px_30px_rgba(185,28,28,0.5)] active:scale-95 transition-all duration-700 cursor-pointer overflow-visible flex items-center justify-between border-2 border-red-800 ${
                                        isTrainChugging ? 'translate-x-[140%] opacity-0 scale-95' : 'translate-x-0 opacity-100'
                                    }`}
                                >
                                    {/* Train Details & Icon */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 border border-amber-400/40">
                                            🚂
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-black text-xs sm:text-sm uppercase tracking-wider leading-tight">
                                                {isTrainChugging 
                                                    ? (isSignUp ? 'Train Boarding: Creating Account... 🚂💨' : 'Steam Train Chugging to Account... 🚂💨')
                                                    : (isSignUp ? 'Vehicle 3: Board Train & Register' : 'Vehicle 3: Steam Express Train')}
                                            </p>
                                            <p className="text-[10px] text-yellow-300 font-bold">
                                                {isTrainChugging 
                                                    ? 'Chugging down the railway track...' 
                                                    : (isSignUp ? 'Click to Board Train & Register ➔' : 'All Aboard! Click to Drive & Sign In ➔')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Front Train Lantern with Spotlight Beam on Tracks */}
                                    <div className="relative flex items-center shrink-0 pl-3">
                                        {/* Lantern Bulb */}
                                        <div className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                                            rememberMe ? 'bg-yellow-300 shadow-[0_0_15px_#FACC15]' : 'bg-slate-400'
                                        }`}></div>

                                        {/* Soft Luminous Spotlight Halo */}
                                        <div 
                                            className={`absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-10 pointer-events-none rounded-full blur-md transition-all duration-300 ${
                                                rememberMe ? 'opacity-80 scale-100 bg-yellow-300' : 'opacity-0 scale-75'
                                            }`}
                                        />
                                        
                                        <ArrowRight className="w-4 h-4 ml-2 text-white group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    {/* Train Wheels (3 Big Spoked Locomotive Driving Wheels + Connecting Rod) */}
                                    <div className="absolute -bottom-2.5 left-8 w-5 h-5 rounded-full bg-slate-950 border-2 border-amber-400 shadow-md flex items-center justify-center">
                                        <span className={`w-2 h-2 rounded-full bg-red-500 ${isTrainChugging ? 'animate-spin' : ''}`}></span>
                                    </div>
                                    <div className="absolute -bottom-2.5 left-18 w-5 h-5 rounded-full bg-slate-950 border-2 border-amber-400 shadow-md flex items-center justify-center">
                                        <span className={`w-2 h-2 rounded-full bg-red-500 ${isTrainChugging ? 'animate-spin' : ''}`}></span>
                                    </div>
                                    <div className="absolute -bottom-2.5 right-12 w-5 h-5 rounded-full bg-slate-950 border-2 border-amber-400 shadow-md flex items-center justify-center">
                                        <span className={`w-2 h-2 rounded-full bg-red-500 ${isTrainChugging ? 'animate-spin' : ''}`}></span>
                                    </div>
                                    {/* Train Wheels Connecting Rod */}
                                    <div className="absolute -bottom-1 left-9 w-24 h-0.5 bg-slate-300 shadow-xs pointer-events-none"></div>

                                    {/* Smoke puffs behind the locomotive */}
                                    {isTrainChugging && (
                                        <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xl animate-ping">💨</span>
                                    )}
                                </button>

                                {/* Realistic Railway Track beneath the train button */}
                                <div className="w-full h-2 bg-slate-800 rounded-sm mt-1.5 relative overflow-hidden flex items-center justify-between px-1 border-t border-b border-slate-500 shadow-xs">
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                    <span className="w-1.5 h-full bg-amber-700/90"></span>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* VEHICLE LAUNCHERS: 🚀 ROCKET (GOOGLE) & ✈️ JET (APPLE) */}
                    <div className="my-2 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <span className="relative bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Vehicle Launchers
                        </span>
                    </div>

                    {/* Google Rocket & Apple Flight Buttons (BUTTONS STAY FIRMLY IN PLACE) */}
                    <div className="grid grid-cols-2 gap-2 relative">
                        
                        {/* 🚀 GOOGLE ROCKET BUTTON: BUTTON STAYS HERE, ONLY ROCKET SHOOTS UP OFF-SCREEN */}
                        <button 
                            type="button" 
                            onClick={handleGoogleClick}
                            disabled={isRocketLaunching}
                            className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer active:scale-95 transition-all relative overflow-visible"
                        >
                            {/* THE ROCKET ITSELF: WHEN CLICKED, SHOOTS STRAIGHT UP AND COMPLETELY OUT OF THE SCREEN */}
                            <div className={`transition-all ${
                                isRocketLaunching 
                                    ? 'fixed z-[9999] pointer-events-none animate-rocket-skyward' 
                                    : 'relative'
                            }`}
                            style={isRocketLaunching ? {
                                bottom: '90px',
                                left: '60%'
                            } : {}}>
                                <span className="text-base select-none">🚀</span>
                                {isRocketLaunching && (
                                    <span className="absolute -bottom-2 left-0.5 text-xs animate-ping">🔥</span>
                                )}
                            </div>

                            <span className="truncate">
                                {isRocketLaunching ? 'Rocket Launching 🚀🔥' : 'Google Rocket'}
                            </span>
                        </button>
                        
                        {/* ✈️ APPLE FLIGHT BUTTON: BUTTON STAYS HERE, ONLY JET FLIES UP-RIGHT OFF-SCREEN */}
                        <button 
                            type="button" 
                            onClick={handleAppleClick}
                            disabled={isFlightTakingOff}
                            className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs cursor-pointer active:scale-95 transition-all relative overflow-visible"
                        >
                            {/* THE JET ITSELF: WHEN CLICKED, FLIES DIAGONALLY UP AND COMPLETELY OUT OF THE SCREEN */}
                            <div className={`transition-all ${
                                isFlightTakingOff 
                                    ? 'fixed z-[9999] pointer-events-none animate-flight-skyward' 
                                    : 'relative'
                            }`}
                            style={isFlightTakingOff ? {
                                bottom: '90px',
                                left: '80%'
                            } : {}}>
                                <span className="text-base select-none">✈️</span>
                                {isFlightTakingOff && (
                                    <span className="absolute -bottom-2 -left-1 text-xs animate-ping">💨</span>
                                )}
                            </div>

                            <span className="truncate">
                                {isFlightTakingOff ? 'Flight Taking Off ✈️💨' : 'Apple Flight'}
                            </span>
                        </button>
                    </div>

                    {/* Sign Up / Sign In Toggle Link */}
                    <div className="mt-2 text-center">
                        {isSignUp ? (
                            <p className="text-slate-500 font-medium text-xs">
                                Already registered your vehicle?{' '}
                                <button 
                                    type="button" 
                                    onClick={() => setIsSignUp(false)}
                                    className="text-[#E51A22] font-black hover:underline ml-1 cursor-pointer"
                                >
                                    Sign In here ➔
                                </button>
                            </p>
                        ) : (
                            <p className="text-slate-500 font-medium text-xs">
                                New driver at Little Joys?{' '}
                                <button 
                                    type="button" 
                                    onClick={() => setIsSignUp(true)}
                                    className="text-[#E51A22] font-black hover:underline ml-1 cursor-pointer"
                                >
                                    Create an account ➔
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Security Assurance */}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>256-bit SSL Secure Checkout • 100% Child-Safe Store</span>
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
};

export default Login;
