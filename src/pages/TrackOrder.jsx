import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
    Search, Package, Truck, CheckCircle2, Clock, MapPin, 
    Calendar, ArrowRight, ShieldCheck, Phone, Mail, 
    AlertCircle, Sparkles, FileText, ChevronRight, RefreshCw,
    ExternalLink, Gift, Heart, ArrowLeft, Copy, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import Invoice from '../components/Invoice';

// Helper to format currency
const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(Number(val) || 0);
};

// Formatter for readable dates
const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return 'Within 2-4 business days';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const STAGES = [
    {
        key: 'Placed',
        title: 'Order Confirmed',
        shortDesc: 'Order placed & payment verified',
        icon: Gift,
        subtext: 'Your order has been safely placed with Little Joys'
    },
    {
        key: 'Packed',
        title: 'Toy Workshop Pack',
        shortDesc: 'Safety sanitized & gift-wrapped',
        icon: Package,
        subtext: 'Bubble-wrapped in 100% child-safe, non-toxic packaging'
    },
    {
        key: 'Shipped',
        title: 'Dispatched in Transit',
        shortDesc: 'Express highway transit to hub',
        icon: Truck,
        subtext: 'On the highway via Express Priority Courier Fleet'
    },
    {
        key: 'OutForDelivery',
        title: 'Out for Delivery',
        shortDesc: 'Rider on the way to your door',
        icon: MapPin,
        subtext: 'Your delivery hero is in your neighborhood'
    },
    {
        key: 'Delivered',
        title: 'Delivered with Joy!',
        shortDesc: 'Parcel arrived • Smiles unlocked',
        icon: CheckCircle2,
        subtext: 'Package safely handed over at destination'
    }
];

const TrackOrder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlOrderId = searchParams.get('orderId') || searchParams.get('id') || searchParams.get('order');

    const [orderNumberInput, setOrderNumberInput] = useState(urlOrderId || '');
    const [emailInput, setEmailInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [myRecentOrders, setMyRecentOrders] = useState([]);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [copiedAwb, setCopiedAwb] = useState(false);

    // Fetch user's orders if logged in to show quick selector
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserOrders = async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0) {
                            setMyRecentOrders(data.slice(0, 5));
                        }
                    }
                } catch {
                    // Silently ignore if offline
                }
            };
            fetchUserOrders();
        }
    }, []);

    // Pre-fill input if URL has orderId (do NOT auto-track; wait until user clicks 'Track Order' button)
    useEffect(() => {
        if (urlOrderId) {
            setOrderNumberInput(urlOrderId);
        }
    }, [urlOrderId]);

    const handleTrackOrder = async (queryId = orderNumberInput, queryEmail = emailInput) => {
        if (!queryId || !queryId.trim()) {
            setSearchError('Please enter your Order Number (e.g. #OD-12345678)');
            return;
        }

        const trimmed = queryId.trim();
        setSearchError('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderId: trimmed, 
                    email: queryEmail ? queryEmail.trim() : undefined 
                })
            });

            const data = await res.json();

            if (res.ok && data.order) {
                setOrderData(data.order);
                toast.success('Found your parcel tracking details! 🚚');
                if (data.order.orderStatus === 'Delivered') {
                    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
                }
            } else {
                // If not found in API, check recent user orders in memory
                const matchedInRecent = myRecentOrders.find(o => 
                    String(o._id).toLowerCase().includes(trimmed.toLowerCase()) || 
                    String(o.orderNumber || '').toLowerCase().includes(trimmed.toLowerCase())
                );

                if (matchedInRecent) {
                    setOrderData(matchedInRecent);
                    toast.success('Matched from your orders!');
                } else {
                    setSearchError(data.message || 'No parcel found matching this Order Number. Please check and retry.');
                    toast.error('Order not found');
                }
            }
        } catch {
            // Offline fallback: check if matches in recent
            const matchedInRecent = myRecentOrders.find(o => 
                String(o._id).toLowerCase().includes(trimmed.toLowerCase()) || 
                String(o.orderNumber || '').toLowerCase().includes(trimmed.toLowerCase())
            );

            if (matchedInRecent) {
                setOrderData(matchedInRecent);
            } else {
                setSearchError('Unable to connect to live tracking server. Please check your network and retry.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Determine current milestone step index (0 to 4)
    const currentStepIndex = useMemo(() => {
        if (!orderData) return 0;
        const status = (orderData.orderStatus || '').toLowerCase();
        if (status === 'cancelled' || status === 'returned') return -1;
        if (status === 'delivered') return 4;
        if (status === 'out for delivery' || status === 'out_for_delivery') return 3;
        if (status === 'shipped' || status === 'dispatched' || status === 'in transit') return 2;
        if (status === 'processing' || status === 'packed') return 1;
        return 0; // Placed / Pending / Confirmed
    }, [orderData]);

    // Live Journey & Driving Animation States
    const [truckProgress, setTruckProgress] = useState(10);
    const [isDrivingLive, setIsDrivingLive] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [activeVisualStage, setActiveVisualStage] = useState(0);
    const [isContinuousCruise, setIsContinuousCruise] = useState(false);
    const driveTimerRef = React.useRef(null);
    const cruiseLoopRef = React.useRef(null);

    // Real status checks
    const isOrderDelivered = (orderData?.orderStatus || '').toLowerCase() === 'delivered' || currentStepIndex === 4;
    const isCancelled = orderData && (orderData.orderStatus === 'Cancelled' || orderData.orderStatus === 'Returned');

    // Start live drive journey whenever order is tracked or loaded
    const startLiveDriveJourney = (targetOrder = orderData) => {
        if (!targetOrder) return;
        if (driveTimerRef.current) clearInterval(driveTimerRef.current);
        if (cruiseLoopRef.current) clearInterval(cruiseLoopRef.current);
        setIsContinuousCruise(false);

        const status = (targetOrder?.orderStatus || '').toLowerCase();
        const isDelivered = status === 'delivered';
        const isCancelledStatus = status === 'cancelled' || status === 'returned';

        if (isCancelledStatus) {
            setTruckProgress(10);
            setIsDrivingLive(false);
            setCurrentSpeed(0);
            setActiveVisualStage(-1);
            return;
        }

        let targetStage = 0;
        if (status === 'delivered') targetStage = 4;
        else if (status.includes('out for delivery')) targetStage = 3;
        else if (status.includes('shipped') || status.includes('in transit') || status.includes('dispatched')) targetStage = 2;
        else if (status.includes('packed') || status.includes('processing')) targetStage = 1;

        // Start live driving from Station 0
        setTruckProgress(10);
        setActiveVisualStage(0);
        setIsDrivingLive(true);
        setCurrentSpeed(52);

        const stagePercents = [10, 30, 50, 70, 90];
        let step = 0;

        driveTimerRef.current = setInterval(() => {
            step += 1;
            if (step <= targetStage) {
                setTruckProgress(stagePercents[step]);
                setActiveVisualStage(step);
            }

            if (step >= targetStage) {
                clearInterval(driveTimerRef.current);

                if (isDelivered) {
                    // Park when reached Delivered!
                    setTimeout(() => {
                        setIsDrivingLive(false);
                        setCurrentSpeed(0);
                        toast.success('Delivered with Joy! Package safely handed over. 🎁', { icon: '🏡' });
                    }, 800);
                } else {
                    // Keep cruising live on the highway for active orders!
                    setIsDrivingLive(true);
                    setCurrentSpeed(48);
                }
            }
        }, 900);
    };

    // Auto-launch drive when orderData changes
    useEffect(() => {
        if (orderData) {
            startLiveDriveJourney(orderData);
        }
        return () => {
            if (driveTimerRef.current) clearInterval(driveTimerRef.current);
            if (cruiseLoopRef.current) clearInterval(cruiseLoopRef.current);
        };
    }, [orderData]);

    const handleSelectMilestone = (idx) => {
        if (driveTimerRef.current) clearInterval(driveTimerRef.current);
        if (cruiseLoopRef.current) clearInterval(cruiseLoopRef.current);
        setIsContinuousCruise(false);

        const stagePercents = [10, 30, 50, 70, 90];
        setTruckProgress(stagePercents[idx]);
        setActiveVisualStage(idx);

        if (idx === 4) {
            setIsDrivingLive(false);
            setCurrentSpeed(0);
        } else {
            setIsDrivingLive(true);
            setCurrentSpeed(48);
        }
    };

    const toggleContinuousCruise = () => {
        if (driveTimerRef.current) clearInterval(driveTimerRef.current);
        
        if (isContinuousCruise) {
            setIsContinuousCruise(false);
            if (cruiseLoopRef.current) clearInterval(cruiseLoopRef.current);
            handleSelectMilestone(currentStepIndex >= 0 ? currentStepIndex : 0);
        } else {
            setIsContinuousCruise(true);
            setIsDrivingLive(true);
            setCurrentSpeed(55);
            let loopIndex = 0;
            const stagePercents = [10, 30, 50, 70, 90];

            cruiseLoopRef.current = setInterval(() => {
                loopIndex = (loopIndex + 1) % stagePercents.length;
                setTruckProgress(stagePercents[loopIndex]);
                setActiveVisualStage(loopIndex);
            }, 1000);
        }
    };

    const handleCopyAwb = (awb) => {
        if (!awb) return;
        navigator.clipboard.writeText(awb);
        setCopiedAwb(true);
        toast.success('Tracking AWB copied to clipboard!');
        setTimeout(() => setCopiedAwb(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FBF9F6] font-sans pb-28 pt-4 sm:pt-8 relative overflow-hidden">
            {/* Ambient Background Glows & Toy Motifs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-gradient-to-b from-rose-100/60 via-amber-50/40 to-transparent blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-20 left-10 text-4xl opacity-15 select-none pointer-events-none animate-bounce duration-1000">🧸</div>
            <div className="absolute top-36 right-16 text-4xl opacity-15 select-none pointer-events-none">🚂</div>
            <div className="absolute top-96 left-8 text-3xl opacity-10 select-none pointer-events-none">⭐</div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* TOP BREADCRUMB & BACK BUTTON */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#E51A22] hover:border-rose-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Link to="/" className="hover:text-[#E51A22]">Home</Link>
                        <span>/</span>
                        <span className="text-slate-800">Track Order</span>
                    </div>
                </div>

                {/* HERO BANNER CARD */}
                <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-10 mb-8 shadow-sm relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E51A22] via-amber-400 to-[#1c274c]"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-[11px] font-black uppercase tracking-wider text-[#E51A22] mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Real-Time Toy Parcel Radar</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-[#1c274c] tracking-tight leading-tight">
                                Follow Your Toy's <br className="hidden sm:inline" />
                                <span className="bg-gradient-to-r from-[#E51A22] to-rose-600 bg-clip-text text-transparent">
                                    Magical Delivery Journey!
                                </span> 🚚✨
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                                Enter your Order Number or Code below to watch the live express truck bring joy straight from our workshop to your doorstep.
                            </p>
                        </div>

                        {/* Interactive 3D Toy Van Graphic */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-[#E51A22] flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-rose-500/20 ring-4 ring-rose-50 shrink-0 select-none animate-pulse">
                            🚚
                        </div>
                    </div>

                    {/* SEARCH CONSOLE BOX */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleTrackOrder();
                            }}
                            className="flex flex-col sm:flex-row items-stretch gap-3"
                        >
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={orderNumberInput}
                                    onChange={(e) => {
                                        setOrderNumberInput(e.target.value);
                                        if (searchError) setSearchError('');
                                    }}
                                    placeholder="Enter your Order Number (e.g. #OD-12345678)..."
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-rose-100 transition-all shadow-inner"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E51A22] to-rose-600 hover:from-[#c9141b] hover:to-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-rose-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Locating Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <Truck className="w-4.5 h-4.5" />
                                        <span>Track Order</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {searchError && (
                            <div className="mt-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{searchError}</span>
                            </div>
                        )}

                        {/* Quick pick from user's logged in orders */}
                        {myRecentOrders.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                                    Quick Select from Your Recent Orders:
                                </p>
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                    {myRecentOrders.map((rec) => {
                                        const rawCode = rec.orderNumber || (rec._id ? String(rec._id).slice(-8).toUpperCase() : '');
                                        const isSelected = orderNumberInput === (rec.orderNumber || rec._id);
                                        return (
                                            <button
                                                key={rec._id}
                                                type="button"
                                                onClick={() => {
                                                    setOrderNumberInput(rec.orderNumber || rec._id);
                                                    if (searchError) setSearchError('');
                                                }}
                                                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-rose-50 text-[#E51A22] border-rose-300 ring-2 ring-rose-200 shadow-xs'
                                                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                <Package className="w-3 h-3 text-[#E51A22]" />
                                                <span>{rawCode}</span>
                                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                                                    rec.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {rec.orderStatus || 'Pending'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* INITIAL EMPTY STATE HINT BEFORE CLICKING TRACK ORDER */}
                {!orderData && !loading && (
                    <div className="mt-6 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center flex flex-col items-center justify-center max-w-xl mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-100 text-3xl flex items-center justify-center mb-3 shadow-inner">
                            🚚
                        </div>
                        <h3 className="text-base font-black text-[#1c274c]">Ready to Track Your Order</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-md leading-relaxed">
                            Enter your Order ID above and click <span className="font-bold text-[#E51A22]">&ldquo;Track Order&rdquo;</span> to view your package's live transit status.
                        </p>
                    </div>
                )}

                {/* TRACKING RESULTS DASHBOARD */}
                {orderData && (
                    <div className="space-y-8 animate-fadeIn">

                        {/* 1. STATUS & ESTIMATED DELIVERY BANNER */}
                        <div className="bg-white border border-slate-200/90 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracking Order:</span>
                                        <h2 className="text-xl sm:text-2xl font-black text-[#1c274c] font-mono tracking-tight">
                                            {orderData.orderNumber || `#OD-${String(orderData._id).slice(-8).toUpperCase()}`}
                                        </h2>
                                        <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                            isCancelled
                                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                                : orderData.orderStatus === 'Delivered'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                                        }`}>
                                            {orderData.orderStatus || 'Confirmed'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Ordered on {formatDeliveryDate(orderData.createdAt)}</span>
                                        <span>•</span>
                                        <span>{orderData.orderItems?.length || 1} Item(s)</span>
                                    </p>
                                </div>

                                {/* Right Side Actions: View Invoice */}
                                <div className="flex items-center gap-2.5 self-start md:self-center">
                                    <button
                                        type="button"
                                        onClick={() => setViewingInvoice(orderData)}
                                        className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer"
                                    >
                                        <FileText className="w-4 h-4 text-[#E51A22]" />
                                        <span>Tax Invoice</span>
                                    </button>

                                    <a
                                        href={`https://wa.me/918347640423?text=Hi%20Little%20Joys,%20I%20need%20help%20tracking%20my%20order%20${orderData.orderNumber || orderData._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                                    >
                                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Support</span>
                                    </a>
                                </div>
                            </div>

                            {/* ESTIMATED ARRIVAL HIGHLIGHT BOX */}
                            {!isCancelled && (
                                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                                            ⏰
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                                                Estimated Delivery Window
                                            </p>
                                            <p className="text-base sm:text-lg font-black text-[#1c274c]">
                                                {formatDeliveryDate(orderData.expectedDelivery || new Date(Date.now() + 72 * 3600 * 1000))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Courier Partner & AWB Tag */}
                                    <div className="flex items-center gap-2 self-start sm:self-center bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-mono">
                                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="text-slate-500">AWB:</span>
                                        <span className="font-bold text-slate-800">
                                            {orderData.courier?.trackingNumber || `LJ-EXP-${String(orderData._id).slice(-7).toUpperCase()}`}
                                        </span>
                                        <button 
                                            onClick={() => handleCopyAwb(orderData.courier?.trackingNumber || `LJ-EXP-${String(orderData._id).slice(-7).toUpperCase()}`)}
                                            className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                            title="Copy AWB"
                                        >
                                            {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 2. 3D TOY ROAD JOURNEY TRACKER */}
                            <div className="mt-10">
                                {/* Highway Track Container - Unique Light Theme Toy Landscape */}
                                <div className="relative p-3 sm:p-5 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F4] to-[#FFF3EC] rounded-3xl shadow-lg shadow-amber-500/5 border-2 border-amber-200/80 overflow-hidden">
                                    <style>{`
                                        @keyframes highwayStripesMove {
                                            0% { background-position: 0 0; }
                                            100% { background-position: -48px 0; }
                                        }
                                        @keyframes tempoDrivingBob {
                                            0%, 100% { transform: translateY(0px) rotate(0deg); }
                                            25% { transform: translateY(-2.5px) rotate(0.4deg); }
                                            50% { transform: translateY(0.5px) rotate(-0.2deg); }
                                            75% { transform: translateY(-2px) rotate(0.3deg); }
                                        }
                                        @keyframes spinningWheel {
                                            from { transform: rotate(0deg); }
                                            to { transform: rotate(360deg); }
                                        }
                                        @keyframes exhaustSmokeDrift {
                                            0% { opacity: 0.85; transform: translate(0, 0) scale(0.6); }
                                            50% { opacity: 0.45; transform: translate(-16px, -6px) scale(1.1); }
                                            100% { opacity: 0; transform: translate(-30px, -10px) scale(1.6); }
                                        }
                                        @keyframes headlightBeamGlow {
                                            0%, 100% { opacity: 0.75; }
                                            50% { opacity: 0.95; }
                                        }
                                        @keyframes radarPingBeacon {
                                            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                                            70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
                                            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                                        }
                                    `}</style>

                                    {/* CONTROLS & STATUS BAR */}
                                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-black text-[#1c274c] uppercase tracking-wider flex items-center gap-1.5">
                                                <span>🛣️ LIVE DELIVERY HIGHWAY</span>
                                                <span className="text-[9.5px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">NH-JOY 01</span>
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Drive Live Again / Replay Button */}
                                            <button
                                                type="button"
                                                onClick={() => startLiveDriveJourney(orderData)}
                                                className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-gradient-to-r from-[#1c274c] to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white active:scale-95"
                                                title="Watch the delivery tempo drive live across the highway from start to finish"
                                            >
                                                <span>▶️ Drive Live Journey</span>
                                            </button>

                                            {/* Continuous Highway Cruise Toggle */}
                                            <button
                                                type="button"
                                                onClick={toggleContinuousCruise}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                                                    isContinuousCruise
                                                        ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                                                        : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                                                }`}
                                                title="Continuous Highway Cruise loops the vehicle smoothly down the road non-stop"
                                            >
                                                <span>{isContinuousCruise ? '🔄 Continuous Cruise: ON' : '🔄 Continuous Cruise: OFF'}</span>
                                            </button>

                                            {/* Dynamic Vehicle State Indicator */}
                                            {isDrivingLive ? (
                                                <span className="flex items-center gap-1.5 text-emerald-700 font-black bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10.5px] shadow-2xs">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                                    <span>⚡ LIVE TRANSIT ({currentSpeed || 52} KM/H)</span>
                                                </span>
                                            ) : isCancelled ? (
                                                <span className="flex items-center gap-1.5 text-rose-700 font-black bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-[10.5px] shadow-2xs">
                                                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                                    <span>⛔ CANCELLED • STOPPED (0 KM/H)</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-emerald-800 font-black bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10.5px] shadow-2xs">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>🏁 {activeVisualStage === 4 ? 'DELIVERED • PARKED (0 KM/H)' : 'STATIONED (0 KM/H)'}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* LEVEL 1: THE REALISTIC ASPHALT HIGHWAY */}
                                    <div className="relative w-full">
                                        <div className="relative h-28 sm:h-32 w-full bg-gradient-to-b from-[#1c2331] via-[#141b27] to-[#0e141f] rounded-2xl shadow-inner border-2 border-slate-700/80 overflow-hidden flex flex-col justify-between p-1.5">
                                            {/* Top Road Verge / Kerb (Hazard yellow & black stripes) */}
                                            <div 
                                                className="w-full h-1.5 rounded-t-sm opacity-80"
                                                style={{
                                                    backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 8px, #1e293b 8px, #1e293b 16px)'
                                                }}
                                            ></div>

                                            {/* Road Lane with Running Dashed Yellow Centerline & Route Trail */}
                                            <div className="relative w-full h-16 flex items-center">
                                                {/* HIGH-VISIBILITY DASHED CENTER LINE (UNCOVERED & CLEARLY VISIBLE) */}
                                                <div 
                                                    className="w-full h-1.5 z-10 opacity-90"
                                                    style={{
                                                        backgroundImage: 'repeating-linear-gradient(to right, #facc15 0, #facc15 24px, transparent 24px, transparent 48px)',
                                                        backgroundSize: '48px 6px',
                                                        animation: isDrivingLive ? 'highwayStripesMove 0.65s linear infinite' : 'none'
                                                    }}
                                                ></div>

                                                {/* Completed Highway Route Trail (Underneath along bottom curb, NEVER covering the center line!) */}
                                                <div 
                                                    className="absolute left-0 bottom-1 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-700 z-0 opacity-75"
                                                    style={{ width: `${truckProgress}%` }}
                                                ></div>

                                                {/* THE 3D TOY DELIVERY TEMPO DRIVING / PARKED ON THE ROAD */}
                                                <div 
                                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-30 pointer-events-none select-none"
                                                    style={{ left: `${truckProgress}%` }}
                                                >
                                                    {/* Floating Vehicle Status Pill Badge */}
                                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-40">
                                                        {isCancelled ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[9.5px] font-black uppercase tracking-wider shadow-md border-2 border-white">
                                                                <span>⛔ Order Cancelled • Halted</span>
                                                            </span>
                                                        ) : isDrivingLive ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c274c]/95 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-amber-400/40">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'radarPingBeacon 1.4s infinite' }}></span>
                                                                <span>🚚 In Transit: {STAGES[activeVisualStage]?.title || 'Cruising'} ({currentSpeed || 52} km/h)</span>
                                                            </span>
                                                        ) : activeVisualStage === 4 ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-black uppercase tracking-wider shadow-md border-2 border-white">
                                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                                                <span>Delivered with Joy! • Parked</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c274c]/95 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-amber-400/40">
                                                                <span>🚚 Station: {STAGES[activeVisualStage]?.title || 'Stationed'}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Vehicle Assembly - Bobs on suspension ONLY when driving! */}
                                                    <div 
                                                        className="relative flex items-center"
                                                        style={{ animation: isDrivingLive ? 'tempoDrivingBob 0.55s ease-in-out infinite' : 'none' }}
                                                    >
                                                        {/* Exhaust Smoke Puffs - Visible ONLY when driving! */}
                                                        {isDrivingLive && (
                                                            <div className="absolute -left-4 bottom-2 flex gap-1 pointer-events-none">
                                                                <span className="text-xs" style={{ animation: 'exhaustSmokeDrift 0.8s ease-out infinite' }}>💨</span>
                                                                <span className="text-[10px]" style={{ animation: 'exhaustSmokeDrift 0.8s ease-out 0.4s infinite' }}>💨</span>
                                                            </div>
                                                        )}

                                                        {/* Tempo Body */}
                                                        <div className="relative flex items-end">
                                                            {/* Cargo Container (Back) */}
                                                            <div className="w-14 sm:w-16 h-10 sm:h-11 rounded-l-xl bg-gradient-to-tr from-[#C9141B] via-[#E51A22] to-[#ff5e57] border-t-2 border-l-2 border-b-2 border-amber-300/80 shadow-lg shadow-black/40 flex flex-col justify-between p-1 relative overflow-hidden">
                                                                {/* Chrome accent stripe */}
                                                                <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-white to-amber-300 rounded-full opacity-90 shadow-2xs"></div>
                                                                {/* Express Label */}
                                                                <div className="text-center">
                                                                    <span className="text-[7.5px] sm:text-[8px] font-black tracking-tight text-white uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] block leading-none">
                                                                        LITTLE JOYS
                                                                    </span>
                                                                    <span className="text-[6.5px] font-extrabold text-amber-200 tracking-widest block leading-none mt-0.5">
                                                                        EXPRESS
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center px-0.5 text-[7px] text-white/80">
                                                                    <span>★ #01</span>
                                                                    <span>🎁</span>
                                                                </div>
                                                            </div>

                                                            {/* Driver Cab (Front) */}
                                                            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-r-xl bg-gradient-to-tr from-[#990d13] to-[#E51A22] border-t-2 border-r-2 border-b-2 border-amber-300/80 shadow-lg shadow-black/40 flex flex-col justify-between p-0.5 relative">
                                                                {/* Windshield */}
                                                                <div className="w-full h-3.5 bg-gradient-to-br from-cyan-200 via-sky-300 to-sky-500 rounded-tr-lg rounded-tl-xs border border-white/80 shadow-inner flex items-center justify-center">
                                                                    <span className="text-[8px] select-none">👦</span>
                                                                </div>
                                                                {/* Front Grille & Bumper */}
                                                                <div className="w-full flex items-center justify-between px-0.5">
                                                                    <div className="w-3 h-1 bg-slate-200 rounded-xs"></div>
                                                                    {/* Headlight Bulb */}
                                                                    <div className={`w-2.5 h-2.5 rounded-full ring-2 transition-all ${
                                                                        isDrivingLive 
                                                                            ? 'bg-amber-300 ring-amber-100 shadow-[0_0_10px_#fde047]' 
                                                                            : 'bg-amber-400/50 ring-amber-200/40'
                                                                    }`}></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Headlight Light Beam - Visible ONLY when driving! */}
                                                        {isDrivingLive && (
                                                            <div 
                                                                className="absolute left-full top-3 w-16 sm:w-20 h-8 pointer-events-none -z-10 origin-left"
                                                                style={{
                                                                    background: 'linear-gradient(to right, rgba(254, 240, 138, 0.75) 0%, rgba(253, 224, 71, 0.35) 45%, transparent 100%)',
                                                                    clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                                                                    animation: 'headlightBeamGlow 1s ease-in-out infinite'
                                                                }}
                                                            ></div>
                                                        )}

                                                        {/* 3D Wheels with High-Contrast Spoke - SPINS ONLY WHEN DRIVING! */}
                                                        <div className="absolute -bottom-2.5 left-2 w-5 h-5 rounded-full bg-[#111827] border-2 border-slate-300 shadow-md flex items-center justify-center">
                                                            <div 
                                                                className="w-3 h-3 rounded-full bg-slate-700 relative flex items-center justify-center"
                                                                style={{ animation: isDrivingLive ? 'spinningWheel 0.35s linear infinite' : 'none' }}
                                                            >
                                                                <div className="absolute w-full h-0.5 bg-amber-400"></div>
                                                                <div className="absolute h-full w-0.5 bg-amber-400"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 z-10 shadow-xs"></div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-2.5 right-2 w-5 h-5 rounded-full bg-[#111827] border-2 border-slate-300 shadow-md flex items-center justify-center">
                                                            <div 
                                                                className="w-3 h-3 rounded-full bg-slate-700 relative flex items-center justify-center"
                                                                style={{ animation: isDrivingLive ? 'spinningWheel 0.35s linear infinite' : 'none' }}
                                                            >
                                                                <div className="absolute w-full h-0.5 bg-amber-400"></div>
                                                                <div className="absolute h-full w-0.5 bg-amber-400"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 z-10 shadow-xs"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Road Verge / Kerb (Hazard yellow & black stripes) */}
                                            <div 
                                                className="w-full h-1.5 rounded-b-sm opacity-80"
                                                style={{
                                                    backgroundImage: 'repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 8px, #1e293b 8px, #1e293b 16px)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* LEVEL 2: THE 5 JOURNEY CHECKPOINT STATIONS (INTERACTIVE & CLEARLY SEPARATED) */}
                                    <div className="relative pt-6">
                                        <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                            {STAGES.map((stg, idx) => {
                                                const isCompleted = idx <= activeVisualStage;
                                                const isCurrent = idx === activeVisualStage;
                                                const IconComp = stg.icon;

                                                return (
                                                    <div 
                                                        key={stg.key} 
                                                        onClick={() => handleSelectMilestone(idx)}
                                                        className="flex flex-col items-center text-center group relative cursor-pointer"
                                                        title={`Click to drive tempo to stage ${idx + 1}: ${stg.title}`}
                                                    >
                                                        {/* Vertical Station Connector Pin to Highway */}
                                                        <div className="w-0.5 h-3 -mt-3 mb-1 border-l-2 border-dashed border-amber-300/80"></div>

                                                        {/* Milestone Station Badge */}
                                                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                                                            isCurrent
                                                                ? 'bg-gradient-to-tr from-[#E51A22] to-amber-500 text-white ring-4 ring-rose-200/90 shadow-md scale-110 font-black'
                                                                : isCompleted
                                                                ? 'bg-emerald-500 text-white shadow-xs'
                                                                : 'bg-white text-slate-400 border-2 border-slate-200/90 shadow-2xs'
                                                        }`}>
                                                            {isCompleted ? (
                                                                <IconComp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                                                            ) : (
                                                                <span className="text-xs font-bold font-mono text-slate-400">{idx + 1}</span>
                                                            )}
                                                        </div>

                                                        {/* Milestone Name */}
                                                        <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center transition-colors max-w-[70px] sm:max-w-none leading-tight ${
                                                            isCurrent
                                                                ? 'text-[#E51A22] font-black'
                                                                : isCompleted
                                                                ? 'text-emerald-800 font-bold'
                                                                : 'text-slate-400'
                                                        }`}>
                                                            {stg.title}
                                                        </span>

                                                        {/* Milestone Subtext on larger screens */}
                                                        <span className="hidden md:block text-[9.5px] text-slate-400 font-medium mt-0.5 max-w-[100px] leading-tight">
                                                            {stg.shortDesc}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <p className="text-center text-[10.5px] text-slate-400 font-medium mt-3.5">
                                            💡 Tip: Click any stage above to drive the tempo there, or use &ldquo;▶️ Drive Live Journey&rdquo; / &ldquo;🔄 Continuous Cruise&rdquo; to watch it in action!
                                        </p>
                                    </div>
                                </div>

                                {/* Cancelled Notice if Order is Cancelled */}
                                {isCancelled && (
                                    <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                            <X className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-rose-700">Order {orderData?.orderStatus || 'Cancelled'}</p>
                                            <p className="text-xs text-rose-600/90 font-medium mt-0.5">
                                                This order has been cancelled or returned. The delivery tempo has been halted.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Current Milestone Detail Card */}
                                {!isCancelled && (
                                    <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/80 border border-rose-200/80 flex items-start gap-3.5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E51A22] to-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#1c274c]">
                                                Current Status: {STAGES[activeVisualStage >= 0 ? activeVisualStage : 0]?.title || 'Processing'}
                                            </p>
                                            <p className="text-xs text-slate-600 font-medium mt-0.5">
                                                {STAGES[activeVisualStage >= 0 ? activeVisualStage : 0]?.subtext}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>

                        {/* 3. PARCEL CONTENTS & DELIVERY DESTINATION GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Toys Inside the Box (2 Cols) */}
                            <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-[2rem] p-6 sm:p-7 shadow-sm">
                                <h3 className="text-sm font-black text-[#1c274c] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#E51A22]" />
                                    <span>Toys Inside Your Parcel ({orderData.orderItems?.length || 1})</span>
                                </h3>

                                <div className="divide-y divide-slate-100">
                                    {(orderData.orderItems || []).map((item, idx) => {
                                        const prodImg = item.image || item.product?.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&auto=format&fit=crop&q=80';
                                        const title = item.name || item.product?.name || 'Toy Item';
                                        const price = Number(item.price !== undefined ? item.price : (item.product?.price || 0));
                                        const qty = item.quantity || 1;

                                        return (
                                            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                                <img 
                                                    src={prodImg} 
                                                    alt={title} 
                                                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-100 shadow-2xs shrink-0" 
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
                                                    {item.variant && (
                                                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                            Option: {item.variant}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                                        Qty: <span className="font-bold text-slate-800">{qty}</span> × ₹{formatCurrency(price)}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-black text-slate-900">
                                                        ₹{formatCurrency(price * qty)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Financial Total */}
                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Total Order Value:</span>
                                    <span className="text-base font-black text-[#1c274c]">
                                        ₹{formatCurrency(orderData.totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery Address & Customer Info (1 Col) */}
                            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-[#1c274c] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        <span>Shipping Destination</span>
                                    </h3>

                                    <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 text-xs">
                                        <p className="font-black text-slate-900 text-sm">
                                            {orderData.shippingAddress?.fullName || orderData.customer?.name || 'Customer'}
                                        </p>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            {orderData.shippingAddress?.streetAddress || orderData.shippingAddress?.addressLine1 || 'Delivery Address'}
                                            {orderData.shippingAddress?.city && `, ${orderData.shippingAddress.city}`}
                                            {orderData.shippingAddress?.state && `, ${orderData.shippingAddress.state}`}
                                            {orderData.shippingAddress?.zipCode && ` - ${orderData.shippingAddress.zipCode}`}
                                        </p>
                                        {(orderData.shippingAddress?.phone || orderData.customer?.phone) && (
                                            <p className="text-slate-700 font-bold pt-1 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-[#E51A22]" />
                                                <span>+91 {orderData.shippingAddress?.phone || orderData.customer?.phone}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Contactless & Sanitized Handover Guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* HIGH-QUALITY TAX INVOICE MODAL INTEGRATION */}
            {viewingInvoice && (
                <Invoice 
                    order={viewingInvoice} 
                    onClose={() => setViewingInvoice(null)} 
                />
            )}
        </div>
    );
};

export default TrackOrder;