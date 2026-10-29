import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MobileBottomNav = () => {
    const location = useLocation();
    const { getCartCount, getWaitlistCount, openCart } = useCart();

    // On Product Details and Checkout pages, let dedicated action bars take focus
    if (location.pathname.startsWith('/product/') || location.pathname === '/checkout') {
        return null;
    }

    const cartCount = getCartCount();
    const waitlistCount = getWaitlistCount();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Categories', path: '/categories', icon: LayoutGrid },
        { label: 'Shop', path: '/products', icon: ShoppingBag },
        { label: 'Wishlist', path: '/waitlist', icon: Heart, badge: waitlistCount },
        { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: cartCount, isAction: true },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] md:hidden flex items-center justify-around h-16 px-1 safe-area-pb">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(item.path);

                if (item.isAction) {
                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={openCart}
                            className="flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-200 active:scale-95 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5 stroke-[1.8]" />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-[#E51A22] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-1 font-bold tracking-tight text-slate-600">
                                {item.label}
                            </span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-200 active:scale-95 ${
                            isActive ? 'text-[#E51A22]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <div className="relative">
                            <Icon 
                                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} 
                            />
                            {item.badge > 0 && (
                                <span className="absolute -top-1.5 -right-2.5 bg-[#E51A22] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] mt-1 font-bold tracking-tight ${isActive ? 'text-[#E51A22]' : 'text-slate-600'}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <span className="w-1 h-1 bg-[#E51A22] rounded-full mt-0.5" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileBottomNav;
