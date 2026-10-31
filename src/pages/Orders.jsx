import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Package, Calendar, CreditCard, ChevronRight, Star, Heart, Clock, 
    CheckCircle2, Truck, XCircle, FileOutput, Search, Copy, Check,
    AlertCircle, RotateCcw, HelpCircle, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Invoice from '../components/Invoice';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'cancel' | 'return', orderId: '...' }
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedOrderId, setCopiedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(Array.isArray(data) ? data : []);
                } else if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                } else {
                    toast.error("Failed to load your orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast.error("An error occurred while loading orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const executeCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Order cancelled successfully!');
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
            } else {
                toast.error(data.message || 'Failed to cancel order.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setConfirmAction(null);
        }
    };

    const executeReturnOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/${orderId}/return`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Return requested successfully!');
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Returned' } : o));
            } else {
                toast.error(data.message || 'Failed to return order.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setConfirmAction(null);
        }
    };

    const isOrderReturnable = (order) => {
        if (order.orderStatus !== 'Delivered') return false;
        let maxReturnDays = 0;
        let hasReturnable = false;
        (order.orderItems || []).forEach(item => {
            if (item.product?.isReturnable) {
                hasReturnable = true;
                if (item.product.returnDays > maxReturnDays) maxReturnDays = item.product.returnDays;
            }
        });
        if (!hasReturnable) return false;
        if (order.deliveredAt) {
            const diffTime = Math.abs(new Date() - new Date(order.deliveredAt));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= maxReturnDays;
        }
        return true;
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending': 
                return { 
                    label: 'Order Placed',
                    color: 'bg-amber-50 text-amber-700 border-amber-200',
                    dotColor: 'bg-amber-500',
                    icon: Clock,
                    step: 1
                };
            case 'Confirmed':
            case 'Processing': 
                return { 
                    label: 'Processing',
                    color: 'bg-blue-50 text-blue-700 border-blue-200',
                    dotColor: 'bg-blue-500',
                    icon: Package,
                    step: 2
                };
            case 'Shipped': 
                return { 
                    label: 'Shipped',
                    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    dotColor: 'bg-indigo-500',
                    icon: Truck,
                    step: 3
                };
            case 'Delivered': 
            case 'Paid':
                return { 
                    label: 'Delivered',
                    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    dotColor: 'bg-emerald-500',
                    icon: CheckCircle2,
                    step: 4
                };
            case 'Cancelled': 
                return { 
                    label: 'Cancelled',
                    color: 'bg-rose-50 text-rose-700 border-rose-200',
                    dotColor: 'bg-rose-500',
                    icon: XCircle,
                    step: 0
                };
            case 'Returned': 
                return { 
                    label: 'Returned',
                    color: 'bg-purple-50 text-purple-700 border-purple-200',
                    dotColor: 'bg-purple-500',
                    icon: RotateCcw,
                    step: 0
                };
            default: 
                return { 
                    label: status || 'Placed',
                    color: 'bg-slate-50 text-slate-700 border-slate-200',
                    dotColor: 'bg-slate-500',
                    icon: Package,
                    step: 1
                };
        }
    };

    const handleCopyOrderId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedOrderId(id);
        toast.success('Order ID copied to clipboard!');
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    // Filtered and searched orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status tab filter
            if (activeFilter === 'ACTIVE') {
                if (['Delivered', 'Cancelled', 'Returned'].includes(order.orderStatus)) return false;
            } else if (activeFilter === 'DELIVERED') {
                if (order.orderStatus !== 'Delivered') return false;
            } else if (activeFilter === 'CANCELLED') {
                if (!['Cancelled', 'Returned'].includes(order.orderStatus)) return false;
            }

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const idMatch = (order._id || '').toLowerCase().includes(q) || (order.orderNumber || '').toLowerCase().includes(q);
                const itemMatch = (order.orderItems || []).some(item => 
                    (item.name || item.product?.name || '').toLowerCase().includes(q)
                );
                return idMatch || itemMatch;
            }

            return true;
        });
    }, [orders, activeFilter, searchQuery]);

    // Statistics counts
    const activeCount = orders.filter(o => !['Delivered', 'Cancelled', 'Returned'].includes(o.orderStatus)).length;
    const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledCount = orders.filter(o => ['Cancelled', 'Returned'].includes(o.orderStatus)).length;

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
                    <Package className="absolute inset-0 m-auto w-6 h-6 text-[#1c274c]" />
                </div>
                <h2 className="mt-5 text-lg font-bold text-[#1c274c]">Loading your orders...</h2>
                <p className="text-slate-400 text-xs mt-1">Retrieving your magical packages</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-20 font-sans">
            
            {/* CLEAN, ELEGANT HEADER (NO WATERMARKS / BACKGROUND NAMES) */}
            <div className="bg-white border-b border-slate-200/90 py-8 sm:py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <span className="p-2 rounded-xl bg-rose-50 text-[#E51A22] border border-rose-100">
                                    <Package className="w-5 h-5" />
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black text-[#1c274c] tracking-tight">
                                    My Orders
                                </h1>
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                Track, manage, and download invoices for all your purchases.
                            </p>
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
                                <p className="text-base font-extrabold text-[#1c274c]">{orders.length}</p>
                            </div>
                            <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl px-4 py-2 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">In Progress</p>
                                <p className="text-base font-extrabold text-blue-700">{activeCount}</p>
                            </div>
                            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl px-4 py-2 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Delivered</p>
                                <p className="text-base font-extrabold text-emerald-700">{deliveredCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs & Search Bar */}
                    <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setActiveFilter('ALL')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeFilter === 'ALL'
                                        ? 'bg-white text-[#1c274c] shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                All Orders ({orders.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('ACTIVE')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeFilter === 'ACTIVE'
                                        ? 'bg-white text-blue-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                In Progress ({activeCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('DELIVERED')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeFilter === 'DELIVERED'
                                        ? 'bg-white text-emerald-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Delivered ({deliveredCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('CANCELLED')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeFilter === 'CANCELLED'
                                        ? 'bg-white text-rose-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Cancelled ({cancelledCount})
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[260px]">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Order ID or toy..."
                                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E51A22] focus:ring-1 focus:ring-[#E51A22] transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ORDERS LIST CONTAINER */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                {orders.length === 0 ? (
                    /* Entirely Empty State */
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-xs border border-slate-200 max-w-xl mx-auto mt-6"
                    >
                        <div className="w-20 h-20 bg-rose-50 text-[#E51A22] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
                            <Package className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-[#1c274c] mb-2">No orders placed yet</h2>
                        <p className="text-slate-500 mb-8 text-sm max-w-sm mx-auto leading-relaxed">
                            Looks like you haven't bought any toys yet. Explore our handcrafted, safe and magical toys for children!
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center gap-2 bg-[#E51A22] hover:bg-[#c9141b] text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
                        >
                            Explore Toys Catalog
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : filteredOrders.length === 0 ? (
                    /* Search / Filter Empty State */
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No matching orders found</h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Try adjusting your filter or search query to find what you're looking for.
                        </p>
                        <button
                            type="button"
                            onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }}
                            className="text-xs font-bold text-[#E51A22] hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    /* Active Orders Grid */
                    <div className="space-y-6">
                        {filteredOrders.map((order, i) => {
                            const status = getStatusConfig(order.orderStatus);
                            const StatusIcon = status.icon;
                            const orderIdDisplay = order.orderNumber || `#OD-${order._id.slice(-8).toUpperCase()}`;
                            const isCancelled = ['Cancelled', 'Returned'].includes(order.orderStatus);

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={order._id} 
                                    className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200/90 overflow-hidden transition-all duration-200"
                                >
                                    {/* Order Top Bar */}
                                    <div className="bg-slate-50/80 px-5 sm:px-7 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                                            {/* Order Number */}
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                                    Order Reference
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-extrabold text-[#1c274c] font-mono">
                                                        {orderIdDisplay}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyOrderId(order._id)}
                                                        className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5"
                                                        title="Copy ID"
                                                    >
                                                        {copiedOrderId === order._id ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                                    Order Date
                                                </p>
                                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                                        day: '2-digit', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    })}
                                                </p>
                                            </div>

                                            {/* Total */}
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                                    Total Paid
                                                </p>
                                                <p className="text-sm font-black text-[#1c274c]">
                                                    ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Status Badge & Invoice CTA */}
                                        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                                            <div className={`px-3 py-1.5 text-xs font-extrabold rounded-full border flex items-center gap-2 ${status.color}`}>
                                                <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`}></span>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                <span>{status.label}</span>
                                            </div>

                                            <button 
                                                onClick={() => setViewingInvoice(order)}
                                                className="flex items-center gap-1.5 text-slate-700 hover:text-white hover:bg-[#1c274c] bg-white border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                                                title="View & Download Invoice"
                                            >
                                                <FileOutput className="w-3.5 h-3.5 text-[#E51A22]" /> 
                                                <span>Invoice</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Visual Delivery Progress Tracker (Amazon style) */}
                                    {!isCancelled && (
                                        <div className="px-5 sm:px-7 py-4 bg-slate-50/30 border-b border-slate-100">
                                            <div className="relative flex items-center justify-between max-w-2xl mx-auto py-2">
                                                {/* Connecting Bar */}
                                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0 rounded-full">
                                                    <div 
                                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: status.step === 1 ? '15%' : 
                                                                   status.step === 2 ? '50%' : 
                                                                   status.step === 3 ? '85%' : '100%' 
                                                        }}
                                                    ></div>
                                                </div>

                                                {/* Step 1: Placed */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                        status.step >= 1 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                                                    }`}>
                                                        <Check className="w-4 h-4 stroke-[3]" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 mt-1.5">Placed</span>
                                                </div>

                                                {/* Step 2: Processing */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                        status.step >= 2 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white border-2 border-slate-300 text-slate-400'
                                                    }`}>
                                                        <Package className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 mt-1.5">Packed</span>
                                                </div>

                                                {/* Step 3: Shipped */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                        status.step >= 3 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white border-2 border-slate-300 text-slate-400'
                                                    }`}>
                                                        <Truck className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 mt-1.5">Shipped</span>
                                                </div>

                                                {/* Step 4: Delivered */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                        status.step >= 4 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white border-2 border-slate-300 text-slate-400'
                                                    }`}>
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 mt-1.5">Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="p-5 sm:p-7 divide-y divide-slate-100">
                                        {(order.orderItems || []).map((item, index) => {
                                            const prodId = item.product?._id || item.product;
                                            const prodName = item.name || item.product?.name || 'Magical Toy';
                                            const prodImg = (item.product?.images && item.product.images.length > 0) ? item.product.images[0] : null;

                                            return (
                                                <div key={index} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        {/* Thumbnail (Clickable) */}
                                                        <Link 
                                                            to={prodId ? `/product/${prodId}` : '#'}
                                                            className="w-18 h-18 sm:w-20 sm:h-20 bg-slate-50 rounded-xl border border-slate-200/80 p-2 shrink-0 hover:border-[#E51A22] transition-colors flex items-center justify-center overflow-hidden group/img"
                                                        >
                                                            {prodImg ? (
                                                                <img 
                                                                    src={prodImg} 
                                                                    alt={prodName} 
                                                                    className="w-full h-full object-contain group-hover/img:scale-105 transition-transform" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-2xl">🧸</div>
                                                            )}
                                                        </Link>
                                                        
                                                        {/* Title & Details (Clickable) */}
                                                        <div className="min-w-0">
                                                            <Link 
                                                                to={prodId ? `/product/${prodId}` : '#'}
                                                                className="text-sm font-bold text-[#1c274c] hover:text-[#E51A22] transition-colors line-clamp-1"
                                                            >
                                                                {prodName}
                                                            </Link>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                                                                    Qty: {item.quantity}
                                                                </span>
                                                                <span>•</span>
                                                                <span>₹{Number(item.price || 0).toLocaleString('en-IN')} each</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Price & Review Action */}
                                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                        <div className="text-left sm:text-right">
                                                            <p className="text-base font-black text-[#1c274c]">
                                                                ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                                                            </p>
                                                        </div>

                                                        {prodId && item.hasReviewed === true && (
                                                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" /> Reviewed
                                                            </span>
                                                        )}
                                                        {prodId && item.hasReviewed === false && order.orderStatus === 'Delivered' && (
                                                            <Link 
                                                                to={`/product/${prodId}#reviews`} 
                                                                className="text-[11px] font-bold text-[#E51A22] hover:text-white bg-white hover:bg-[#E51A22] border border-[#E51A22] px-3 py-1 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                                                            >
                                                                <Star className="w-3 h-3 fill-current" /> Rate
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Order Footer & Action Buttons */}
                                    <div className="bg-slate-50/60 px-5 sm:px-7 py-3.5 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
                                        <p className="text-xs text-slate-500 font-medium">
                                            Payment: <span className="font-bold text-slate-800 capitalize">{order.paymentMethod || 'Online'}</span>
                                        </p>

                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            {order.orderStatus === 'Pending' && (
                                                <button 
                                                    onClick={() => setConfirmAction({ type: 'cancel', orderId: order._id })}
                                                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Cancel Order
                                                </button>
                                            )}

                                            {isOrderReturnable(order) && (
                                                <button 
                                                    onClick={() => setConfirmAction({ type: 'return', orderId: order._id })}
                                                    className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" /> Return Order
                                                </button>
                                            )}

                                            <Link 
                                                to="/contact" 
                                                className="text-slate-500 hover:text-[#1c274c] text-xs font-bold transition-colors flex items-center gap-1 px-2 py-1"
                                            >
                                                <HelpCircle className="w-3.5 h-3.5" /> Need Help?
                                            </Link>

                                            <Link 
                                                to="/products" 
                                                className="bg-[#E51A22] hover:bg-[#c9141b] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95 flex items-center gap-1"
                                            >
                                                Buy Again <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                            onClick={() => setConfirmAction(null)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-200"
                        >
                            <div className="p-6 text-center">
                                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                                    confirmAction.type === 'cancel' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {confirmAction.type === 'cancel' ? <XCircle className="w-7 h-7" /> : <RotateCcw className="w-7 h-7" />}
                                </div>
                                <h3 className="text-xl font-black text-[#1c274c] mb-1.5">
                                    {confirmAction.type === 'cancel' ? 'Cancel this order?' : 'Return this order?'}
                                </h3>
                                <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed">
                                    {confirmAction.type === 'cancel' 
                                        ? "Are you sure you want to cancel? If prepaid, the refund will be initiated to your original payment method within 3-5 business days." 
                                        : "Are you sure you want to request a return? Our pickup partner will collect the product in original packaging."}
                                </p>
                                <div className="flex gap-2.5">
                                    <button 
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                                    >
                                        Keep Order
                                    </button>
                                    <button 
                                        onClick={() => confirmAction.type === 'cancel' ? executeCancelOrder(confirmAction.orderId) : executeReturnOrder(confirmAction.orderId)}
                                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-sm active:scale-95 cursor-pointer ${
                                            confirmAction.type === 'cancel' ? 'bg-[#E51A22] hover:bg-[#c9141b]' : 'bg-amber-600 hover:bg-amber-700'
                                        }`}
                                    >
                                        Yes, {confirmAction.type === 'cancel' ? 'Cancel' : 'Return'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* High-Quality Invoice Modal */}
            {viewingInvoice && (
                <Invoice 
                    order={viewingInvoice} 
                    onClose={() => setViewingInvoice(null)} 
                />
            )}
        </div>
    );
};

export default Orders;
