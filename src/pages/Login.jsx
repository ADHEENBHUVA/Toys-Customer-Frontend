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
        <div className="h-screen w-full flex font-sans overflow-hidden text-[#3d3130]">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#f3eee7]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3130]/90 via-[#3d3130]/30 to-transparent"></div>
                
                <div className="absolute top-10 left-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-[#e6a27a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <span className="text-3xl font-serif font-bold text-white tracking-wide">Little Joys</span>
                </div>

                <div className="absolute bottom-12 left-10 right-10 text-white">
                    <h1 className="text-5xl font-serif font-medium leading-tight mb-4">
                        Quality playtime, delivered. <span className="text-[#e6a27a]">♡</span>
                    </h1>
                    <p className="text-white/90 text-lg font-light max-w-md leading-relaxed">
                        Curated premium toys that inspire creativity, learning, and endless joy for your little ones.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-[#fcf3ea] via-[#f7e6d8] to-[#f0ccb6]">
                {/* Decorative background elements matching theme */}
                <div className="absolute top-10 right-10 text-[#e9b896] opacity-40 text-4xl">✦</div>
                <div className="absolute bottom-10 left-10 text-[#e9b896] opacity-40 text-2xl">✦</div>

                <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(230,162,122,0.2)] border border-white relative z-10">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#e6a27a] to-[#d99268] rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                        </div>
                        <span className="text-3xl font-serif font-bold text-[#3d3130] tracking-wide">Little Joys</span>
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-serif font-medium text-[#3d3130] mb-2">Welcome back</h2>
                        <p className="text-[#8b7e7c] font-medium text-sm">Please enter your details to access your account.</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-[#5e504f]">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                                placeholder="hello@example.com"
                                className="w-full bg-[#fcfaf7] border border-[#f3eee7] rounded-xl px-4 py-3.5 text-[#3d3130] placeholder-[#b3a8a6] focus:outline-none focus:border-[#e6a27a] focus:ring-2 focus:ring-[#e6a27a]/20 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-[#5e504f]">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-[#fcfaf7] border border-[#f3eee7] rounded-xl px-4 py-3.5 text-[#3d3130] placeholder-[#b3a8a6] focus:outline-none focus:border-[#e6a27a] focus:ring-2 focus:ring-[#e6a27a]/20 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#f3eee7] text-[#e6a27a] focus:ring-[#e6a27a] focus:ring-offset-0" />
                                <span className="text-[#8b7e7c] font-medium text-sm group-hover:text-[#5e504f] transition-colors">Remember for 30 days</span>
                            </label>
                            <a href="#" onClick={(e) => { e.preventDefault(); toast.error("Password reset functionality coming soon."); }} className="font-bold text-[#e6a27a] text-sm hover:text-[#d99268] transition-colors">Forgot password?</a>
                        </div>

                        <button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#e6a27a] to-[#d99268] hover:from-[#d99268] hover:to-[#cc855a] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_8px_20px_rgba(230,162,122,0.3)] hover:shadow-[0_10px_25px_rgba(230,162,122,0.4)] hover:-translate-y-0.5">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 relative flex items-center justify-center">
                        <div className="absolute inset-x-0 h-px bg-[#f3eee7]"></div>
                        <span className="relative bg-white px-4 text-xs font-bold text-[#b3a8a6] uppercase tracking-widest">Or continue with</span>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button 
                            type="button" 
                            onClick={() => handleSocialLogin('Google')} 
                            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-[#f3eee7] text-[#5e504f] hover:border-[#e6a27a] hover:bg-[#fcfaf7] transition-all shadow-sm group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
                            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-[#f3eee7] text-[#5e504f] hover:border-[#e6a27a] hover:bg-[#fcfaf7] transition-all shadow-sm group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.83 1.48-.05 2.76.65 3.53 1.83-3.11 1.76-2.58 5.75.52 7-1.12 1.63-2.14 3.3-2.72 4.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span className="font-bold text-sm">Apple</span>
                        </button>
                    </div>
                    
                    <p className="text-center text-[#8b7e7c] font-medium text-sm mt-8">
                        Don't have an account? <Link to="/register" className="text-[#e6a27a] font-bold hover:text-[#d99268] transition-colors underline-offset-4">Sign up</Link>
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
