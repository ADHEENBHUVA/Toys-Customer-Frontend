import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped': return 'bg-sky-100 text-sky-800 border-sky-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="mt-6 text-xl font-bold text-slate-700 animate-pulse">Loading your orders...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Orders</h1>
                <p className="text-slate-500 mt-2 font-medium">Track and view your recent purchases</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-5xl">📦</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders yet</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't made any purchases yet. Explore our magic toy collection and find something wonderful!</p>
                    <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300">
                            {/* Order Header */}
                            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
                                    <p className="text-sm font-mono font-bold text-slate-700">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-sm font-bold text-slate-900">₹{order.totalAmount}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <ul className="divide-y divide-slate-100">
                                    {order.orderItems.map((item, index) => (
                                        <li key={index} className="py-4 flex items-center gap-6">
                                            <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 p-2 shrink-0">
                                                {item.product?.images && item.product.images.length > 0 ? (
                                                    <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">🧸</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-bold text-slate-800 truncate">{item.product?.name || 'Unknown Product'}</h4>
                                                <p className="text-sm text-slate-500 mt-1 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right shrink-0 flex flex-col items-end justify-center">
                                                <p className="text-base font-bold text-slate-900 mb-2">₹{item.price * item.quantity}</p>
                                                {item.product && (
                                                    item.hasReviewed ? (
                                                        <span className="text-[12px] font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-lg flex items-center gap-1 cursor-default">
                                                            <span className="text-sm leading-none mt-[-2px]">✓</span> Reviewed
                                                        </span>
                                                    ) : (
                                                        <Link to={`/product/${item.product._id}#reviews`} className="text-[12px] font-bold text-[#fbdf14] hover:text-yellow-500 bg-yellow-50/50 border border-yellow-200 hover:bg-yellow-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                                                            <span className="text-lg leading-none mt-[-2px]">★</span> Rate Product
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Order Footer */}
                            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500">
                                    Paid via <span className="font-bold text-slate-700 capitalize">{order.paymentMethod}</span>
                                </p>
                                <Link to="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors">
                                    Need Help?
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
