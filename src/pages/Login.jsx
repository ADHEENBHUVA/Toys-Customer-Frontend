import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, appleProvider } from '../firebase';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const LoginContent = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            toast.error("Please enter your email and password.");
            return;
        }
        // Simulated local login
        localStorage.setItem('token', 'mock_token_for_demo');
        toast.success("Welcome back to Magic Toys! ✨");
        navigate('/', { state: { showConfetti: true } });
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const toastId = toast.loading("Verifying Google Login...");
            try {
                // Sends access_token to the backend instead of auth code
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
                    toast.success("Welcome to Magic Toys!", { id: toastId, icon: '✨' });
                    navigate('/', { state: { showConfetti: true } });
                } else {
                    throw new Error(data.message || 'Authentication failed');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to log in with Google.", { id: toastId });
            }
        },
        onError: () => {
            toast.error("Google Login was unsuccessful or cancelled.");
        }
    });

    const handleSocialLogin = async (providerName) => {
        if (providerName === 'Google') {
            return googleLogin();
        }

        const toastId = toast.loading(`Connecting to ${providerName}...`);

        try {
            const provider = appleProvider;
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/social`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken, provider: providerName.toLowerCase() })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                toast.success(`Welcome to Magic Toys!`, { id: toastId, icon: '✨' });
                navigate('/', { state: { showConfetti: true } });
            } else {
                throw new Error(data.message || 'Authentication failed on server');
            }
        } catch (error) {
            console.error(`${providerName} Login Error:`, error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error(`Could not log in with ${providerName}.`, { id: toastId });
            } else {
                toast.dismiss(toastId);
            }
        }
    };

    return (
        <div className="h-screen w-full flex bg-[#fcfaf7] font-sans relative overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Left Side - Hero Image (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#3d3130]">
                {/* A vibrant toy image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599623560574-39d485900c95?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70"></div>
                {/* Subtle gradient just to make text readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3130] via-[#3d3130]/40 to-transparent"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white bg-[#e6a27a]/40 backdrop-blur-sm shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-3xl font-serif font-bold text-white tracking-tight">Little Joys</span>
                    </div>
                </div>

                <div className="relative z-10 mb-10">
                    <h1 className="text-5xl font-black text-white leading-tight mb-4 drop-shadow-md font-serif">
                        Discover the magic <br/>of playtime.
                    </h1>
                    <p className="text-white/90 text-lg font-medium max-w-md drop-shadow-sm">
                        Join thousands of happy families and explore our curated collection of premium toys, games, and educational wonders.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#fcfaf7] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6a27a]/20 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-100/50 rounded-full blur-[80px] opacity-60 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-full border-2 border-[#e6a27a] flex items-center justify-center text-[#e6a27a] bg-white shadow-lg">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                        </div>
                        <span className="text-3xl font-serif font-bold text-[#3d3130] tracking-tight">Little Joys</span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.03)] border border-white relative">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-[#3d3130] mb-2 tracking-tight font-serif">Welcome back</h2>
                            <p className="text-[#5e504f] font-medium">Please enter your details to sign in.</p>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            <div>
                                <label className="block text-xs font-bold text-[#8b7e7c] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[#8b7e7c] group-focus-within:text-[#e6a27a] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hello@example.com"
                                        className="w-full bg-white border border-[#f0e8e6] rounded-2xl pl-12 pr-4 py-3.5 text-[#3d3130] font-bold text-sm placeholder-[#8b7e7c]/50 focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all hover:border-[#e6a27a]/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#8b7e7c] uppercase tracking-wider mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[#8b7e7c] group-focus-within:text-[#e6a27a] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-[#f0e8e6] rounded-2xl pl-12 pr-4 py-3.5 text-[#3d3130] font-bold text-sm placeholder-[#8b7e7c]/50 focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all hover:border-[#e6a27a]/50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="w-4 h-4 rounded border-2 border-[#f0e8e6] bg-white group-hover:border-[#e6a27a] transition-colors flex items-center justify-center">
                                    </div>
                                    <span className="text-[#8b7e7c] font-medium text-sm group-hover:text-[#5e504f] transition-colors">Remember me</span>
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); toast.error("Password reset functionality coming soon."); }} className="font-bold text-[#e6a27a] text-sm hover:text-[#d8936c] transition-colors">Forgot password?</a>
                            </div>

                            <button type="submit" className="w-full mt-4 bg-[#3d3130] hover:bg-[#e6a27a] text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-[#e6a27a]/10 active:scale-[0.98] transition-all flex justify-center items-center gap-2 group">
                                Sign In
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </form>

                        <div className="mt-8 relative flex items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-[#f0e8e6]"></div>
                            <span className="relative bg-white px-4 text-xs font-bold text-[#8b7e7c] uppercase tracking-wider">Or continue with</span>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button 
                                type="button" 
                                onClick={() => handleSocialLogin('Google')} 
                                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-[#f0e8e6] text-[#5e504f] hover:bg-[#fcfaf7] hover:border-[#e6a27a]/50 transition-all shadow-sm active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span className="font-bold text-sm">Google</span>
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={() => handleSocialLogin('Apple')} 
                                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-[#f0e8e6] text-[#5e504f] hover:bg-[#fcfaf7] hover:border-[#e6a27a]/50 transition-all shadow-sm active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.83 1.48-.05 2.76.65 3.53 1.83-3.11 1.76-2.58 5.75.52 7-1.12 1.63-2.14 3.3-2.72 4.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                <span className="font-bold text-sm">Apple</span>
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-center text-[#5e504f] font-medium text-sm mt-6 mb-4">
                        Don't have an account? <Link to="/register" className="text-[#e6a27a] font-bold hover:text-[#d8936c] transition-colors">Sign up now</Link>
                    </p>
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
