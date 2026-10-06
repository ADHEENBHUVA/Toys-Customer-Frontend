import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, Calendar, CreditCard, ChevronRight, Star, Heart, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'cancel' | 'return', orderId: '...' }

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
                    setOrders(data);
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
        order.orderItems.forEach(item => {
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
        // Fallback for orders that were marked delivered before we added deliveredAt tracking
        return true;
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending': 
                return { color: 'bg-[#fcf3ea] text-[#e6a27a] border-[#e6a27a]/30', icon: Clock };
            case 'Processing': 
                return { color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Package };
            case 'Shipped': 
                return { color: 'bg-indigo-50 text-indigo-600 border-indigo-200', icon: Truck };
            case 'Delivered': 
            case 'Paid':
            case 'Confirmed':
                return { color: 'bg-[#f0f7f4] text-[#71966a] border-[#93b38c]/40', icon: CheckCircle2 };
            case 'Cancelled': 
                return { color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle };
            default: 
                return { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Package };
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-gradient-to-br from-[#fcfaf7] to-[#f3eee7] flex flex-col items-center justify-center p-8">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-[#f3eee7] rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#e6a27a] border-t-transparent rounded-full animate-spin"></div>
                    <Heart className="absolute inset-0 m-auto w-6 h-6 text-[#e6a27a] animate-pulse" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-[#3d3130] font-serif">Finding your magical orders...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fcf3ea]/60 via-[#fcfaf7] to-[#fcfaf7] pb-20 relative">
            
            {/* Soft decorative background shapes */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#fcf3ea] via-[#f7e6d8]/30 to-transparent pointer-events-none -z-10"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-[#f0f7f4]/40 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            {/* Elegant Header Section */}
            <div className="pt-16 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-8 left-[15%] text-[#e6a27a]/20"><Star className="w-12 h-12" /></div>
                <div className="absolute bottom-4 right-[20%] text-[#93b38c]/20"><Heart className="w-16 h-16 fill-current" /></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-[#3d3130] font-serif mb-4">
                        My Orders
                    </h1>
                    <p className="text-[#8b7e7c] font-medium text-lg max-w-xl mx-auto">
                        Review your recent purchases and find your magical items here.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] p-12 md:p-20 text-center shadow-[0_20px_60px_rgba(230,162,122,0.1)] border border-white"
                    >
                        <div className="w-32 h-32 bg-[#fcf3ea] rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <Package className="w-16 h-16 text-[#e6a27a]" />
                            <Star className="absolute top-2 right-2 w-6 h-6 text-[#e8b960] animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#3d3130] mb-4 font-serif">No orders yet!</h2>
                        <p className="text-[#8b7e7c] mb-10 max-w-md mx-auto text-lg">
                            Looks like your toy box is empty. Explore our collection and find something wonderful to bring home!
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center gap-2 bg-[#e6a27a] hover:bg-[#d99268] text-white font-bold py-4 px-10 rounded-full shadow-[0_8px_20px_rgba(230,162,122,0.4)] transition-all hover:-translate-y-1"
                        >
                            Start Shopping
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, i) => {
                            const status = getStatusConfig(order.orderStatus);
                            const StatusIcon = status.icon;

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={order._id} 
                                    className="bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_rgba(230,162,122,0.08)] border border-[#f3eee7] overflow-hidden transition-all duration-300 group"
                                >
                                    {/* Order Header */}
                                    <div className="bg-white px-6 md:px-8 py-5 border-b border-[#f3eee7] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-6 md:gap-10">
                                            <div>
                                                <p className="text-[11px] font-bold text-[#b5a8a6] uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Package className="w-3 h-3" /> Order ID
                                                </p>
                                                <p className="text-[15px] font-bold text-[#3d3130]">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#b5a8a6] uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Date Placed
                                                </p>
                                                <p className="text-[15px] font-bold text-[#3d3130]">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#b5a8a6] uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <CreditCard className="w-3 h-3" /> Total Amount
                                                </p>
                                                <p className="text-[15px] font-black text-[#e6a27a]">₹{order.totalAmount}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex shrink-0">
                                            <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border flex items-center gap-2 ${status.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {order.orderStatus}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6 md:p-8">
                                        <ul className="space-y-6">
                                            {order.orderItems.map((item, index) => (
                                                <li key={index} className="flex items-center gap-6">
                                                    <div className="w-24 h-24 bg-[#fcfaf7] rounded-2xl border border-[#f3eee7] p-2 shrink-0 group-hover:border-[#e6a27a]/30 transition-colors relative overflow-hidden">
                                                        {item.product?.images && item.product.images.length > 0 ? (
                                                            <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-3xl">🧸</div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-[#3d3130] truncate font-serif">{item.product?.name || 'Magical Toy'}</h4>
                                                            <div className="flex items-center gap-3 mt-1 text-[13px] font-medium text-[#8b7e7c]">
                                                                <span className="bg-[#fcfaf7] px-2 py-1 rounded-md border border-[#f3eee7]">Qty: {item.quantity}</span>
                                                                <span>•</span>
                                                                <span>₹{item.price} each</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                                                            <p className="text-xl font-black text-[#3d3130]">₹{item.price * item.quantity}</p>
                                                            {item.product && order.orderStatus === 'Delivered' && (
                                                                item.hasReviewed ? (
                                                                    <span className="text-[12px] font-bold text-[#71966a] bg-[#f0f7f4] border border-[#93b38c]/30 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                                                                    </span>
                                                                ) : (
                                                                    <Link 
                                                                        to={`/product/${item.product._id}#reviews`} 
                                                                        className="text-[12px] font-bold text-[#e6a27a] hover:text-white bg-white border-2 border-[#e6a27a] hover:bg-[#e6a27a] px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                                                                    >
                                                                        <Star className="w-3.5 h-3.5" /> Rate Product
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {/* Order Footer */}
                                    <div className="bg-[#fcfaf7] px-6 md:px-8 py-5 border-t border-[#f3eee7] flex flex-wrap justify-between items-center gap-4">
                                        <p className="text-sm font-medium text-[#8b7e7c]">
                                            Paid via <span className="font-bold text-[#3d3130] capitalize">{order.paymentMethod}</span>
                                        </p>
                                        <div className="flex items-center gap-4">
                                            {order.orderStatus === 'Pending' && (
                                                <button 
                                                    onClick={() => setConfirmAction({ type: 'cancel', orderId: order._id })}
                                                    className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors mr-2 flex items-center gap-1"
                                                >
                                                    <XCircle className="w-4 h-4" /> Cancel Order
                                                </button>
                                            )}
                                            {isOrderReturnable(order) && (
                                                <button 
                                                    onClick={() => setConfirmAction({ type: 'return', orderId: order._id })}
                                                    className="text-orange-500 hover:text-orange-700 text-sm font-bold transition-colors mr-2 flex items-center gap-1"
                                                >
                                                    <XCircle className="w-4 h-4" /> Return Order
                                                </button>
                                            )}
                                            <Link to="/contact" className="text-[#8b7e7c] hover:text-[#e6a27a] text-sm font-bold transition-colors">
                                                Need Help?
                                            </Link>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#e8b960]"></div>
                                            <Link to={`/products`} className="text-[#e6a27a] hover:text-[#d99268] text-sm font-bold transition-colors">
                                                Buy Again
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Custom Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-[#3d3130]/40 backdrop-blur-sm"
                        onClick={() => setConfirmAction(null)}
                    ></div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#fcfaf7] w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-[#f3eee7]"
                    >
                        <div className="p-8 text-center">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5 ${confirmAction.type === 'cancel' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                <XCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#3d3130] font-serif mb-2">
                                {confirmAction.type === 'cancel' ? 'Cancel Order?' : 'Return Order?'}
                            </h3>
                            <p className="text-[#8b7e7c] text-sm font-medium mb-8 leading-relaxed">
                                {confirmAction.type === 'cancel' 
                                    ? "Are you sure you want to cancel this order? This action cannot be undone." 
                                    : "Are you sure you want to return this order? We'll guide you through the return process."}
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setConfirmAction(null)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-[#3d3130] bg-white border-2 border-[#f3eee7] hover:bg-[#f3eee7] transition-colors"
                                >
                                    Keep It
                                </button>
                                <button 
                                    onClick={() => confirmAction.type === 'cancel' ? executeCancelOrder(confirmAction.orderId) : executeReturnOrder(confirmAction.orderId)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors shadow-lg ${confirmAction.type === 'cancel' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
                                >
                                    Yes, {confirmAction.type === 'cancel' ? 'Cancel' : 'Return'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Orders;
