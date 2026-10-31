import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePopup } from '../context/PopupContext';
import toast from 'react-hot-toast';
import { 
    ShieldCheck, Lock, CreditCard, MapPin, User, Phone, Mail, 
    ArrowLeft, Building2, Map, CheckCircle2, Truck, Tag, Sparkles,
    PackageCheck, HelpCircle, ChevronRight, Trash2, Plus, Check,
    AlertCircle, Edit3, Loader2
} from 'lucide-react';

const Checkout = () => {
    const { 
        cartItems, 
        removeFromCart,
        updateQuantity, 
        clearCart, 
        shippingSettings, 
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orderNotes,
        setOrderNotes
    } = useCart();
    
    const { showSuccess, showError, openConfirm } = usePopup();
    
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Saved addresses from user profile
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [saveToProfile, setSaveToProfile] = useState(true);
    const [fetchingUserData, setFetchingUserData] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Dedicated state for entering new delivery address ("Niche Option")
    const [newAddressFields, setNewAddressFields] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        orderNotes: ''
    });

    // Check if user came via Buy Now
    const [buyNowItem, setBuyNowItem] = useState(() => {
        if (location.state?.buyNowItem) return location.state.buyNowItem;
        try {
            const saved = sessionStorage.getItem('magic_toys_buynow');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const isBuyNow = Boolean(buyNowItem);
    const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;

    const handleQuantityChange = (id, delta) => {
        if (isBuyNow) {
            const currentQty = buyNowItem.quantity || 1;
            const newQty = currentQty + delta;
            if (newQty < 1) return;
            const updated = { ...buyNowItem, quantity: newQty };
            setBuyNowItem(updated);
            sessionStorage.setItem('magic_toys_buynow', JSON.stringify(updated));
        } else {
            const item = cartItems.find(i => i._id === id);
            if (!item) return;
            const currentQty = item.quantity || 1;
            const newQty = currentQty + delta;
            if (newQty < 1) return;
            updateQuantity(id, newQty);
        }
    };

    const handleRemoveItem = (id) => {
        openConfirm({
            title: 'Remove Product?',
            message: 'Are you sure you want to remove this toy from your checkout queue?',
            confirmText: 'Remove',
            cancelText: 'Keep Item',
            confirmColor: 'red',
            badgeText: 'REMOVE ITEM',
            onConfirm: () => {
                if (isBuyNow) {
                    sessionStorage.removeItem('magic_toys_buynow');
                    setBuyNowItem(null);
                    showSuccess({
                        title: 'Product Removed 🗑️',
                        message: 'Item has been removed from your direct checkout.',
                        badgeText: 'REMOVED',
                        triggerConfetti: false
                    });
                    navigate('/products');
                } else {
                    removeFromCart(id);
                    showSuccess({
                        title: 'Product Removed 🗑️',
                        message: 'Item has been removed from your cart.',
                        badgeText: 'REMOVED',
                        triggerConfetti: false
                    });
                }
            }
        });
    };

    const isLoggedIn = !!localStorage.getItem('token');

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        fullName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        orderNotes: orderNotes || ''
    });

    // Populate active delivery address state
    const populateAddressState = (addr, fallbackEmail = '') => {
        const rawName = (addr.fullName || '').trim();
        const parts = rawName.split(' ');
        const fName = parts[0] || '';
        const lName = parts.slice(1).join(' ') || (fName ? '' : 'Customer');

        setAddress(prev => ({
            ...prev,
            firstName: fName,
            lastName: lName,
            fullName: rawName,
            streetAddress: addr.streetAddress || '',
            city: addr.city || '',
            state: addr.state || '',
            zipCode: addr.zipCode || '',
            phone: addr.phone || '',
            email: prev.email || fallbackEmail || userProfile?.email || ''
        }));
    };

    // Load saved addresses and profile from backend
    useEffect(() => {
        const loadUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setFetchingUserData(false);
                return;
            }

            try {
                setFetchingUserData(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserProfile(data);
                    const addrs = data.addresses || [];
                    setSavedAddresses(addrs);

                    const parts = (data.name || '').trim().split(' ');
                    const initialNew = {
                        firstName: parts[0] || '',
                        lastName: parts.slice(1).join(' ') || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        streetAddress: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        orderNotes: orderNotes || ''
                    };
                    setNewAddressFields(initialNew);

                    if (addrs.length > 0) {
                        // Pick default address or first address
                        const def = addrs.find(a => a.isDefault) || addrs[0];
                        setSelectedAddressId(def._id);
                        populateAddressState(def, data.email);
                        setIsAddingNewAddress(false);
                    } else {
                        // No address saved yet, open form prefilled with user's name & email & phone
                        setIsAddingNewAddress(true);
                        setAddress(prev => ({
                            ...prev,
                            ...initialNew,
                            fullName: data.name || ''
                        }));
                    }
                }
            } catch (err) {
                console.error('Error loading checkout user profile:', err);
            } finally {
                setFetchingUserData(false);
            }
        };

        loadUserData();
    }, []);

    // Select a saved address
    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr._id);
        populateAddressState(addr);
        setIsAddingNewAddress(false);
    };

    // Delete a saved address inline with Unique Confirm Popup
    const handleDeleteSavedAddress = (addrId, e) => {
        e.stopPropagation();
        const target = savedAddresses.find(a => a._id === addrId);
        const name = target?.fullName || 'this';

        openConfirm({
            title: 'Delete Delivery Address?',
            message: `Are you sure you want to delete ${name}'s address from your profile? This slot will become free for new addresses.`,
            confirmText: 'Yes, Delete Address',
            cancelText: 'Keep Address',
            confirmColor: 'red',
            badgeText: 'DELETE CONFIRMATION',
            onConfirm: async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses/${addrId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const remaining = data.addresses || [];
                        setSavedAddresses(remaining);
                        showSuccess({
                            title: 'Address Deleted 🗑️',
                            message: `The address has been removed. You now have ${5 - remaining.length} slots free.`,
                            badgeText: 'DELETED',
                            triggerConfetti: false
                        });

                        if (selectedAddressId === addrId) {
                            if (remaining.length > 0) {
                                const nextDef = remaining.find(a => a.isDefault) || remaining[0];
                                setSelectedAddressId(nextDef._id);
                                populateAddressState(nextDef);
                                setIsAddingNewAddress(false);
                            } else {
                                setSelectedAddressId(null);
                                setIsAddingNewAddress(true);
                            }
                        }
                    } else {
                        showError({
                            title: 'Delete Failed',
                            message: 'Could not delete address.'
                        });
                    }
                } catch (err) {
                    console.error('Error deleting address:', err);
                    showError({
                        title: 'Connection Error',
                        message: 'Server error deleting address'
                    });
                }
            }
        });
    };

    const subTotal = checkoutItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    const checkoutItemCount = checkoutItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

    const calculateShippingCharge = () => {
        if (!shippingSettings || !shippingSettings.isFreeShippingActive) {
            return shippingSettings?.baseShippingCharge ?? 50;
        }
        const minAmount = shippingSettings.freeShippingMinAmount || 0;
        const minItems = shippingSettings.freeShippingMinItems || 0;

        if (minAmount === 0 && minItems === 0) {
            return shippingSettings.baseShippingCharge ?? 50;
        }
        const amountMet = minAmount > 0 && subTotal >= minAmount;
        const itemsMet = minItems > 0 && checkoutItemCount >= minItems;
        if (amountMet || itemsMet) return 0;
        return shippingSettings.baseShippingCharge ?? 50;
    };

    const shippingCharge = calculateShippingCharge();
    
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            discount = (subTotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        if (discount > subTotal) discount = subTotal;
    }
    
    const totalAmount = Math.max(0, subTotal + shippingCharge - discount);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));

        if (name === 'orderNotes') {
            setOrderNotes?.(value);
        }

        if (name === 'zipCode' && value.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setAddress(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                    toast.success(`Detected: ${postOffice.District}, ${postOffice.State}`);
                }
            } catch (error) {
                console.error('Failed to fetch pincode details', error);
            }
        }
    };

    // Dedicated handler for new address form ("Niche Option") with auto mutual exclusivity
    const handleNewAddressChange = async (e) => {
        const { name, value } = e.target;
        // Automatically switch active selection to new address mode
        setIsAddingNewAddress(true);
        setSelectedAddressId(null);

        setNewAddressFields(prev => ({ ...prev, [name]: value }));

        if (name === 'orderNotes') {
            setOrderNotes?.(value);
        }

        if (name === 'zipCode' && value.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setNewAddressFields(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                    toast.success(`Detected: ${postOffice.District}, ${postOffice.State}`);
                }
            } catch (error) {
                console.error('Failed to fetch pincode details', error);
            }
        }
    };

    const handleApplyCouponInline = async (e) => {
        e?.preventDefault();
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        const res = await applyCoupon(couponInput.trim(), subTotal);
        if (res.success) {
            setCouponInput('');
        }
        setIsApplyingCoupon(false);
    };

    const handlePayment = async () => {
        if (!isLoggedIn) {
            toast.error('Please login to proceed to payment.');
            navigate('/login');
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error('No items to checkout!');
            return;
        }

        // Mutual exclusivity: Pick from saved address OR new address form
        const activeAddress = isAddingNewAddress ? {
            firstName: newAddressFields.firstName,
            lastName: newAddressFields.lastName,
            fullName: `${newAddressFields.firstName || ''} ${newAddressFields.lastName || ''}`.trim(),
            streetAddress: newAddressFields.streetAddress,
            city: newAddressFields.city,
            state: newAddressFields.state,
            zipCode: newAddressFields.zipCode,
            phone: newAddressFields.phone,
            email: newAddressFields.email || userProfile?.email || address.email || '',
            orderNotes: newAddressFields.orderNotes || address.orderNotes || ''
        } : address;

        const finalFullName = (activeAddress.fullName || `${activeAddress.firstName || ''} ${activeAddress.lastName || ''}`).trim();

        if (!finalFullName || !activeAddress.streetAddress || !activeAddress.city || !activeAddress.zipCode || !activeAddress.phone || !activeAddress.email) {
            toast.error('Please fill in all required delivery fields.');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // If user used the new address entered below ("Niche Option"), auto-save to user profile
            if (isAddingNewAddress) {
                if (savedAddresses.length < 5) {
                    try {
                        const saveRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                fullName: finalFullName,
                                phone: activeAddress.phone,
                                streetAddress: activeAddress.streetAddress,
                                city: activeAddress.city,
                                state: activeAddress.state,
                                zipCode: activeAddress.zipCode,
                                isDefault: savedAddresses.length === 0
                            })
                        });
                        if (saveRes.ok) {
                            const savedData = await saveRes.json();
                            setSavedAddresses(savedData.addresses || []);
                            toast.success('Address saved to your profile! 🏡');
                        }
                    } catch (saveErr) {
                        console.warn('Could not save address to profile:', saveErr);
                    }
                }
            }

            const createOrderRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: totalAmount })
            });
            const orderData = await createOrderRes.json();

            if (!orderData.success) {
                toast.error('Failed to initialize payment');
                setLoading(false);
                return;
            }

            const options = {
                key: 'rzp_test_TciOZDXIMiQnYr',
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Little Joys Toys',
                description: 'Purchase from Little Joys',
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: checkoutItems.map(item => ({ productId: item._id, quantity: item.quantity, price: item.price })),
                                    shippingAddress: { 
                                        ...activeAddress, 
                                        fullName: finalFullName,
                                        addressLine1: activeAddress.streetAddress,
                                        postalCode: activeAddress.zipCode
                                    },
                                    subTotal,
                                    shippingCharge,
                                    discountAmount: discount,
                                    couponCode: appliedCoupon?.code,
                                    totalAmount
                                }
                            })
                        });
                        
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            toast.success('Payment successful! Order placed.');
                            if (isBuyNow) {
                                sessionStorage.removeItem('magic_toys_buynow');
                            } else {
                                clearCart();
                            }
                            navigate('/order-success', { state: { orderId: verifyData.orderId } });
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('An error occurred during verification');
                    }
                },
                prefill: {
                    name: finalFullName,
                    email: activeAddress.email,
                    contact: activeAddress.phone
                },
                theme: {
                    color: '#E51A22'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            console.error('Payment flow error:', error);
            toast.error('An error occurred during payment processing');
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-24 min-h-[60vh] flex flex-col justify-center items-center text-center font-sans">
                <div className="w-20 h-20 bg-rose-50 text-[#E51A22] rounded-full flex items-center justify-center mb-5 shadow-xs">
                    <PackageCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A24] mb-3">No items to checkout</h2>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Your checkout queue is empty. Choose playful, developmental toys for your little ones!</p>
                <Link to="/products" className="bg-[#1A1A24] hover:bg-[#E51A22] text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] font-sans pb-20">
            {/* Top Checkout Header */}
            <div className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-xl font-black text-[#1A1A24] tracking-tight hover:text-[#E51A22] transition-colors">
                            Little Joys <span className="text-[#E51A22]">Toys</span>
                        </Link>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Secured
                        </span>
                    </div>

                    <Link to="/products" className="text-xs font-bold text-slate-600 hover:text-[#E51A22] flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Main Checkout Container */}
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
                {isBuyNow && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-xs animate-fadeIn">
                        <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E51A22] animate-pulse shrink-0"></span>
                            <span>Direct Buy Now: Checking out <strong>"{buyNowItem.name}"</strong> ({buyNowItem.quantity} {buyNowItem.quantity === 1 ? 'item' : 'items'}).</span>
                        </div>
                        {cartItems.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setBuyNowItem(null);
                                    sessionStorage.removeItem('magic_toys_buynow');
                                }}
                                className="text-xs font-bold text-[#E51A22] hover:underline cursor-pointer shrink-0"
                            >
                                Checkout Full Cart ({cartItems.length} items) instead →
                            </button>
                        )}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
                    
                    {/* LEFT COLUMN: Full Delivery Address Selection (Saved Address OR New Address Form) */}
                    <div className="w-full lg:w-[62%] flex flex-col gap-6">
                        
                        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E51A22] flex items-center justify-center font-black shadow-xs">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-black text-[#1A1A24]">Delivery Address</h2>
                                        <p className="text-xs text-slate-500 font-medium">Choose a saved address or enter a new address below.</p>
                                    </div>
                                </div>
                                
                                {savedAddresses.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                                            {savedAddresses.length}/5 Saved Slots
                                        </span>
                                        <Link 
                                            to="/profile" 
                                            className="text-xs font-bold text-[#E51A22] hover:underline flex items-center gap-1"
                                        >
                                            Manage Profile →
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* OPTION 1: SAVED ADDRESSES SECTION (MUTUALLY EXCLUSIVE) */}
                            {savedAddresses.length > 0 && (
                                <div className="mb-8">
                                    {/* Option 1 Header with Radio Selector */}
                                    <div 
                                        onClick={() => {
                                            setIsAddingNewAddress(false);
                                            const def = savedAddresses.find(a => a._id === selectedAddressId) || savedAddresses[0];
                                            if (def) {
                                                setSelectedAddressId(def._id);
                                                populateAddressState(def);
                                            }
                                        }}
                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer mb-4 flex items-center justify-between gap-3 ${
                                            !isAddingNewAddress 
                                                ? 'border-[#E51A22] bg-rose-50/30 shadow-xs ring-2 ring-[#E51A22]/10' 
                                                : 'border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                !isAddingNewAddress ? 'border-[#E51A22]' : 'border-slate-300'
                                            }`}>
                                                {!isAddingNewAddress && <div className="w-2.5 h-2.5 rounded-full bg-[#E51A22]" />}
                                            </div>
                                            <div>
                                                <span className="font-black text-sm text-[#1A1A24] block">
                                                    Option 1: Deliver to a Saved Address
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    Select one of your {savedAddresses.length} saved delivery locations
                                                </span>
                                            </div>
                                        </div>
                                        {!isAddingNewAddress && (
                                            <span className="text-[11px] font-black text-[#E51A22] bg-white border border-[#E51A22]/30 px-2.5 py-1 rounded-full shadow-2xs">
                                                Active Choice
                                            </span>
                                        )}
                                    </div>

                                    {/* Saved Address Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pl-2 sm:pl-3">
                                        {savedAddresses.map((addr) => {
                                            const isSelected = selectedAddressId === addr._id && !isAddingNewAddress;
                                            return (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => handleSelectSavedAddress(addr)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'border-[#E51A22] bg-rose-50/40 shadow-xs ring-1 ring-[#E51A22]/20'
                                                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                                    isSelected ? 'border-[#E51A22]' : 'border-slate-300'
                                                                }`}>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#E51A22]" />}
                                                                </div>
                                                                <span className="font-black text-sm text-[#1A1A24]">
                                                                    {addr.fullName}
                                                                </span>
                                                            </div>
                                                            {addr.isDefault && (
                                                                <span className="text-[10px] font-black text-[#E51A22] bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-xs text-slate-600 line-clamp-2 pl-6 mb-1">
                                                            {addr.streetAddress}
                                                        </p>
                                                        <p className="text-xs font-semibold text-slate-700 pl-6">
                                                            {addr.city}, {addr.state} - {addr.zipCode}
                                                        </p>
                                                        <p className="text-[11px] font-bold text-slate-500 pl-6 pt-1 flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-[#E51A22]" /> +91 {addr.phone}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 pl-6">
                                                        <span className="text-[11px] font-bold text-[#E51A22]">
                                                            {isSelected ? '✓ Deliver to this Address' : 'Click to select'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDeleteSavedAddress(addr._id, e)}
                                                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                                                            title="Delete this address"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* OPTION 2: ENTER NEW DELIVERY ADDRESS FORM ("NICHE OPTION") */}
                            <div className={`rounded-2xl border-2 transition-all p-4 sm:p-6 ${
                                isAddingNewAddress || savedAddresses.length === 0
                                    ? 'border-[#E51A22] bg-white ring-2 ring-[#E51A22]/10 shadow-xs'
                                    : 'border-slate-200/90 bg-slate-50/40 hover:border-slate-300'
                            }`}>
                                {/* Option 2 Header with Radio Selector */}
                                <div 
                                    onClick={() => {
                                        setIsAddingNewAddress(true);
                                        setSelectedAddressId(null);
                                    }}
                                    className="flex items-center justify-between gap-3 mb-5 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            isAddingNewAddress || savedAddresses.length === 0 ? 'border-[#E51A22]' : 'border-slate-300'
                                        }`}>
                                            {(isAddingNewAddress || savedAddresses.length === 0) && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#E51A22]" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-[#1A1A24] uppercase tracking-wider">
                                                {savedAddresses.length > 0 ? 'Option 2: Enter New Delivery Address' : 'Enter Delivery Address'}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Fill in full address details below. This will automatically be saved to your profile.
                                            </p>
                                        </div>
                                    </div>
                                    {(isAddingNewAddress || savedAddresses.length === 0) && (
                                        <span className="text-[11px] font-black text-[#E51A22] bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                                            Active Choice
                                        </span>
                                    )}
                                </div>

                                {/* Form Fields: Full & Explicit view */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">First Name *</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                name="firstName" 
                                                value={newAddressFields.firstName} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                placeholder="e.g. Rahul" 
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Last Name *</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                name="lastName" 
                                                value={newAddressFields.lastName} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                placeholder="e.g. Sharma" 
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={newAddressFields.email} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                placeholder="rahul@example.com" 
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Phone Number * (10 Digits)</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                value={newAddressFields.phone} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                placeholder="9876543210" 
                                                maxLength={10}
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* Street Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Flat, House No., Building & Street Address *</label>
                                        <div className="relative">
                                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                name="streetAddress" 
                                                value={newAddressFields.streetAddress} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                placeholder="e.g. 402, Shivalik Residency, Near Riverfront, Ashram Road" 
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* ZIP Code */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Pincode * (Auto Detects City & State)</label>
                                        <div className="relative">
                                            <Map className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                name="zipCode" 
                                                value={newAddressFields.zipCode} 
                                                onChange={handleNewAddressChange}
                                                onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                                maxLength={6}
                                                placeholder="380015" 
                                                required
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Town / City *</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={newAddressFields.city} 
                                            onChange={handleNewAddressChange}
                                            onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                            placeholder="Ahmedabad" 
                                            required
                                            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                        />
                                    </div>

                                    {/* State */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">State *</label>
                                        <input 
                                            type="text" 
                                            name="state" 
                                            value={newAddressFields.state} 
                                            onChange={handleNewAddressChange}
                                            onFocus={() => { setIsAddingNewAddress(true); setSelectedAddressId(null); }}
                                            placeholder="Gujarat" 
                                            required
                                            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400" 
                                        />
                                    </div>

                                    {/* Auto-Save Confirmation Banner */}
                                    <div className="md:col-span-2 pt-1">
                                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>
                                                Auto-Save Active: This new address will automatically be saved to your profile upon placing this order.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes / Special Instructions from Cart */}
                            <div className="mt-6 pt-5 border-t border-slate-100">
                                <label className="block text-xs font-bold text-[#1A1A24] uppercase tracking-wider mb-1.5 pl-0.5">Order Notes & Landmark Instructions (Optional)</label>
                                <textarea 
                                    name="orderNotes" 
                                    value={newAddressFields.orderNotes || address.orderNotes} 
                                    onChange={handleNewAddressChange} 
                                    placeholder="Any special gift message or landmark instructions for the delivery rider..." 
                                    rows="2" 
                                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A24] font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-slate-400 resize-none"
                                ></textarea>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sticky Order Summary & Guarantees */}
                    <div className="w-full lg:w-[38%] sticky top-24">
                        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-md">
                            
                            {/* Summary Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                                <h3 className="text-lg font-black text-[#1A1A24] tracking-tight">Order Summary</h3>
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {checkoutItemCount} {checkoutItemCount === 1 ? 'item' : 'items'}
                                </span>
                            </div>

                            {/* Items List */}
                            <div className="flex flex-col divide-y divide-slate-100 max-h-[320px] overflow-y-auto py-2 px-1.5 custom-scrollbar">
                                {checkoutItems.map((item) => {
                                    const unitPrice = Number(item.price || 0);
                                    const qty = Number(item.quantity || 1);
                                    const itemImg = item.thumbnailImage || item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';

                                    return (
                                        <div key={item._id} className="py-2.5 flex items-center gap-3.5">
                                            {/* Thumbnail with quantity pill (Click to open product page) */}
                                            <div className="relative shrink-0 pt-2 pr-2">
                                                <Link 
                                                    to={`/product/${item.productId || item._id}`}
                                                    className="w-16 h-16 rounded-xl border border-slate-100 bg-gray-50 p-1 flex items-center justify-center overflow-hidden block group cursor-pointer"
                                                    title={`View ${item.name}`}
                                                >
                                                    <img 
                                                        src={itemImg} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';
                                                        }}
                                                    />
                                                </Link>
                                                <span className="absolute top-0.5 right-0.5 min-w-[22px] h-[22px] px-1 bg-[#1A1A24] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm z-10 leading-none">
                                                    {qty}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <Link 
                                                    to={`/product/${item.productId || item._id}`}
                                                    className="text-xs sm:text-sm font-bold text-[#1A1A24] line-clamp-2 leading-tight hover:text-[#E51A22] transition-colors cursor-pointer block"
                                                    title={`View ${item.name}`}
                                                >
                                                    {item.name}
                                                </Link>
                                                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    ₹{unitPrice.toLocaleString('en-IN')} × {qty}
                                                </div>

                                                {/* In-place Quantity adjuster & Remove Button */}
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="inline-flex items-center border border-gray-200 rounded-md bg-white h-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item._id, -1)}
                                                            disabled={qty <= 1}
                                                            className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black font-bold text-xs disabled:opacity-30 cursor-pointer"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-6 text-center text-[11px] font-bold text-gray-800">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item._id, 1)}
                                                            className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black font-bold text-xs cursor-pointer"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        title="Remove product"
                                                        className="text-slate-400 hover:text-[#E51A22] p-1 rounded-md hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Remove</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Line Price */}
                                            <div className="text-right shrink-0">
                                                <span className="text-xs sm:text-sm font-black text-[#1A1A24] block">
                                                    ₹{(unitPrice * qty).toLocaleString('en-IN')}.00
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Coupon Code Section */}
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span>{appliedCoupon.code}</span>
                                            <span className="text-emerald-600 font-normal">(-₹{discount.toFixed(0)})</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={removeCoupon}
                                            className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCouponInline} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder="Promo Code" 
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs uppercase font-medium focus:outline-none focus:bg-white focus:border-[#E51A22]"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isApplyingCoupon || !couponInput.trim()}
                                            className="px-4 py-2 bg-[#1A1A24] hover:bg-[#E51A22] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#1A1A24]">₹{subTotal.toLocaleString('en-IN')}.00</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-bold">-₹{discount.toLocaleString('en-IN')}.00</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-[#1A1A24]">
                                        {shippingCharge === 0 ? (
                                            <span className="text-emerald-600 font-black">FREE</span>
                                        ) : (
                                            `₹${shippingCharge.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                {/* Grand Total */}
                                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base sm:text-lg font-black text-[#1A1A24]">
                                    <span>Total to Pay</span>
                                    <span className="text-2xl font-black text-[#E51A22] tracking-tight">
                                        ₹{totalAmount.toLocaleString('en-IN')}.00
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 text-right">All taxes & duties included</p>
                            </div>

                            {/* Pay Button */}
                            <button 
                                onClick={handlePayment} 
                                disabled={loading}
                                className="w-full mt-6 bg-[#E51A22] hover:bg-[#c9141b] active:scale-[0.99] text-white py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shadow-red-500/20 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing Order...
                                    </span>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Pay & Complete Order (₹{totalAmount.toLocaleString('en-IN')})
                                    </>
                                )}
                            </button>

                            {/* Trust Guarantees */}
                            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5 text-[11.5px] text-slate-500 font-medium">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span>100% Genuine & Certified Child-Safe Toys</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Encrypted & Guaranteed Razorpay Checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>Quick dispatch with live SMS & tracking updates</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
