import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePopup } from '../context/PopupContext';
import {
    User, Mail, Phone, MapPin, Plus, Trash2, Edit3, CheckCircle, 
    ShieldCheck, AlertCircle, Sparkles, Package, Heart, LogOut,
    Home, Building, Check, ArrowRight, Loader2, X
} from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { showSuccess, showError, openConfirm } = usePopup();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'personal'

    // Personal details state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [nameError, setNameError] = useState('');

    // Addresses state
    const [addresses, setAddresses] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
    });
    const [pincodeLoading, setPincodeLoading] = useState(false);

    // Fetch user profile & addresses
    const fetchProfile = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setName(data.name || '');
                setPhone(data.phone || '');
                setAddresses(data.addresses || []);
                // Update local storage user if changed
                localStorage.setItem('user', JSON.stringify(data));
            } else {
                toast.error(data.message || 'Failed to load profile');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            toast.error('Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Prevent background scrolling and enable ESC to close modal
    useEffect(() => {
        if (isAddressModalOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => {
                if (e.key === 'Escape') setIsAddressModalOpen(false);
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isAddressModalOpen]);

    // Handle personal info update (Customer can change name, but Name is MANDATORY)
    const handleUpdatePersonal = async (e) => {
        e.preventDefault();
        setNameError('');

        // Strict name validation
        if (!name || !name.trim()) {
            setNameError('Name is mandatory and cannot be empty. Please enter your name.');
            toast.error('Please enter your name.');
            return;
        }

        setIsSavingProfile(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim()
                })
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setName(data.user.name);
                setPhone(data.user.phone || '');
                localStorage.setItem('user', JSON.stringify(data.user));
                showSuccess({
                    title: 'Profile Updated! ✨',
                    message: `Your name is now set to "${data.user.name}". Details saved successfully.`,
                    badgeText: 'PROFILE UPDATED'
                });
            } else {
                showError({
                    title: 'Update Failed',
                    message: data.message || 'Failed to update profile'
                });
            }
        } catch (err) {
            console.error('Update profile error:', err);
            showError({
                title: 'Connection Error',
                message: 'Server error updating profile. Please try again.'
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Pincode auto-lookup
    const handlePincodeChange = async (value) => {
        setAddressForm(prev => ({ ...prev, zipCode: value }));
        if (value.length === 6 && /^\d+$/.test(value)) {
            setPincodeLoading(true);
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setAddressForm(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                    toast.success(`Location detected: ${postOffice.District}, ${postOffice.State}`);
                }
            } catch (err) {
                console.error('Pincode fetch error:', err);
            } finally {
                setPincodeLoading(false);
            }
        }
    };

    // Open Modal for New Address
    const handleOpenAddAddress = () => {
        if (addresses.length >= 5) {
            toast.error('You can only save up to 5 addresses. Please delete an existing address to add a new one.', {
                duration: 5000,
                icon: '⚠️'
            });
            return;
        }
        setEditingAddressId(null);
        setAddressForm({
            fullName: user?.name || '',
            phone: user?.phone || '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: addresses.length === 0
        });
        setIsAddressModalOpen(true);
    };

    // Open Modal for Editing Address
    const handleOpenEditAddress = (addr) => {
        setEditingAddressId(addr._id);
        setAddressForm({
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            streetAddress: addr.streetAddress || '',
            city: addr.city || '',
            state: addr.state || '',
            zipCode: addr.zipCode || '',
            isDefault: Boolean(addr.isDefault)
        });
        setIsAddressModalOpen(true);
    };

    // Save or Edit Address
    const handleSaveAddress = async (e) => {
        e.preventDefault();

        if (!addressForm.fullName.trim()) {
            toast.error('Recipient name is required');
            return;
        }
        if (!addressForm.phone.trim() || addressForm.phone.trim().length < 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!addressForm.streetAddress.trim()) {
            toast.error('Street/House address is required');
            return;
        }
        if (!addressForm.zipCode.trim() || addressForm.zipCode.trim().length !== 6) {
            toast.error('Please enter a valid 6-digit Pincode');
            return;
        }
        if (!addressForm.city.trim() || !addressForm.state.trim()) {
            toast.error('City and State are required');
            return;
        }

        setIsSavingAddress(true);
        try {
            const url = editingAddressId 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses/${editingAddressId}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses`;
            const method = editingAddressId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });

            const data = await res.json();
            if (res.ok) {
                setAddresses(data.addresses);
                setIsAddressModalOpen(false);
                if (editingAddressId) {
                    showSuccess({
                        title: 'Address Updated! 📝',
                        message: `Delivery address for ${addressForm.fullName} has been updated successfully.`,
                        badgeText: 'UPDATED',
                        triggerConfetti: false
                    });
                } else {
                    showSuccess({
                        title: 'New Address Saved! 🎉',
                        message: `Delivery address for ${addressForm.fullName} has been saved (${data.addresses.length}/5 used).`,
                        badgeText: 'CREATED',
                        triggerConfetti: true
                    });
                }
            } else {
                showError({
                    title: 'Save Failed',
                    message: data.message || 'Failed to save address'
                });
            }
        } catch (err) {
            console.error('Save address error:', err);
            showError({
                title: 'Connection Error',
                message: 'Server error saving address. Please try again.'
            });
        } finally {
            setIsSavingAddress(false);
        }
    };

    // Delete Address (with Unique Animated Confirm Popup)
    const handleDeleteAddress = (addressId) => {
        const target = addresses.find(a => a._id === addressId);
        const recipient = target?.fullName || 'this';

        openConfirm({
            title: 'Delete Delivery Address?',
            message: `Are you sure you want to permanently remove ${recipient}'s address? This will free up 1 slot for new addresses.`,
            confirmText: 'Yes, Delete Address',
            cancelText: 'Keep Address',
            confirmColor: 'red',
            badgeText: 'DELETE CONFIRMATION',
            onConfirm: async () => {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses/${addressId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setAddresses(data.addresses);
                    showSuccess({
                        title: 'Address Deleted 🗑️',
                        message: `The address has been removed. You now have ${5 - (data.addresses?.length || 0)} slots available.`,
                        badgeText: 'DELETED',
                        triggerConfetti: false
                    });
                } else {
                    showError({
                        title: 'Delete Failed',
                        message: data.message || 'Failed to delete address'
                    });
                }
            }
        });
    };

    // Set Default Address
    const handleSetDefault = async (addressId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/user/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setAddresses(data.addresses);
                showSuccess({
                    title: 'Default Address Updated! ⭐',
                    message: 'This delivery address is now selected as your primary shipping location.',
                    badgeText: 'DEFAULT SET',
                    triggerConfetti: false
                });
            } else {
                showError({
                    title: 'Action Failed',
                    message: data.message || 'Failed to set default address'
                });
            }
        } catch (err) {
            console.error('Default address error:', err);
            showError({
                title: 'Connection Error',
                message: 'Server error setting default address'
            });
        }
    };

    // Logout (with Unique Confirm Popup)
    const handleLogout = () => {
        openConfirm({
            title: 'Sign Out of Little Joys?',
            message: 'Are you sure you want to logout from your customer account?',
            confirmText: 'Sign Out',
            cancelText: 'Stay Logged In',
            confirmColor: 'red',
            badgeText: 'LOGOUT CONFIRMATION',
            onConfirm: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-10 h-10 text-[#E51A22] animate-spin mb-4" />
                <p className="text-gray-500 font-bold text-sm">Loading your profile...</p>
            </div>
        );
    }

    const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const addressSlotsRemaining = 5 - (addresses?.length || 0);

    return (
        <div className="min-h-screen bg-[#FBF9F5] font-sans pb-20 pt-6 sm:pt-10">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

                {/* HERO PROFILE HEADER */}
                <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white shadow-md shrink-0"
                                />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#E51A22] to-rose-400 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md ring-4 ring-white shrink-0">
                                    {initials}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A24] tracking-tight">
                                        {user?.name || 'Customer Profile'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Account
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span>{user?.email}</span>
                                </p>
                                {user?.phone && (
                                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-[#E51A22]" />
                                        <span>+91 {user.phone}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats / Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/orders"
                                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
                            >
                                <Package className="w-4 h-4 text-[#E51A22]" />
                                <span>My Orders</span>
                            </Link>
                            <Link
                                to="/waitlist"
                                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
                            >
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span>Wishlist</span>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#E51A22] font-bold text-xs sm:text-sm border border-rose-200/60 flex items-center gap-2 transition-all cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            activeTab === 'addresses'
                                ? 'bg-[#1A1A24] text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <MapPin className="w-4 h-4 text-[#E51A22]" />
                        <span>Saved Delivery Addresses ({addresses.length}/5)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            activeTab === 'personal'
                                ? 'bg-[#1A1A24] text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <User className="w-4 h-4 text-[#E51A22]" />
                        <span>Personal Details</span>
                    </button>
                </div>

                {/* TAB 1: SAVED ADDRESSES */}
                {activeTab === 'addresses' && (
                    <div className="space-y-6">
                        
                        {/* Address Limits Banner */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1">
                                    <h2 className="text-lg font-black text-[#1A1A24]">
                                        Delivery Addresses
                                    </h2>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                                        addresses.length >= 5
                                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}>
                                        {addresses.length} / 5 Saved
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    {addresses.length >= 5 ? (
                                        <span className="text-amber-700 font-semibold flex items-center gap-1.5 mt-0.5">
                                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                            Maximum limit of 5 addresses reached. To add a new address, please delete any 1 address below.
                                        </span>
                                    ) : (
                                        `You can save up to 5 delivery addresses (${addressSlotsRemaining} ${addressSlotsRemaining === 1 ? 'slot' : 'slots'} available). Easily select one during checkout.`
                                    )}
                                </p>
                            </div>

                            {/* Add Address CTA button */}
                            {addresses.length < 5 ? (
                                <button
                                    type="button"
                                    onClick={handleOpenAddAddress}
                                    className="px-6 py-3 rounded-2xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,26,34,0.25)] hover:shadow-[0_6px_22px_rgba(229,26,34,0.35)] active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add New Address</span>
                                </button>
                            ) : (
                                <div className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs flex items-center gap-2 cursor-not-allowed shrink-0">
                                    <Plus className="w-4 h-4 opacity-50" />
                                    <span>Limit Reached (5/5)</span>
                                </div>
                            )}
                        </div>

                        {/* Addresses Grid */}
                        {addresses.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-14 text-center">
                                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E51A22] flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-black text-[#1A1A24] mb-2">No Saved Addresses Yet</h3>
                                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                                    Save your delivery address now so you can breeze through checkout with a single click!
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenAddAddress}
                                    className="px-6 py-3 rounded-2xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Your First Address</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative shadow-xs hover:shadow-md ${
                                            addr.isDefault 
                                                ? 'border-[#E51A22] ring-2 ring-[#E51A22]/15' 
                                                : 'border-slate-200/90'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-base text-[#1A1A24]">
                                                        {addr.fullName}
                                                    </span>
                                                </div>
                                                {addr.isDefault ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#E51A22] bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                                                        <Check className="w-3 h-3 text-[#E51A22]" /> Default
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetDefault(addr._id)}
                                                        className="text-[11px] font-bold text-slate-500 hover:text-[#E51A22] hover:underline cursor-pointer"
                                                    >
                                                        Set as default
                                                    </button>
                                                )}
                                            </div>

                                            <div className="text-xs sm:text-sm text-slate-600 space-y-1 mb-4 leading-relaxed">
                                                <p className="font-medium text-slate-800">{addr.streetAddress}</p>
                                                <p>{addr.city}, {addr.state} - <span className="font-bold text-slate-900">{addr.zipCode}</span></p>
                                                <p className="text-xs text-slate-500 font-bold pt-1 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-[#E51A22]" />
                                                    <span>+91 {addr.phone}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditAddress(addr)}
                                                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#E51A22] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAddress(addr._id)}
                                                className="px-3.5 py-1.5 rounded-xl border border-rose-100 bg-rose-50/60 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                title="Delete this address"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: PERSONAL DETAILS */}
                {activeTab === 'personal' && (
                    <div className="max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                        <div className="mb-6 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-black text-[#1A1A24]">Personal Profile Details</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Your name was automatically prefilled from your account login. You can edit your name, but it is mandatory.
                            </p>
                        </div>

                        {nameError && (
                            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{nameError}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdatePersonal} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                                    Full Name <span className="text-[#E51A22]">* (Mandatory)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (e.target.value.trim()) setNameError('');
                                        }}
                                        required
                                        placeholder="Enter your full name"
                                        className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium focus:outline-none transition-all ${
                                            nameError
                                                ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-200'
                                                : 'border-slate-200 bg-slate-50/40 focus:border-[#E51A22] focus:bg-white focus:ring-2 focus:ring-[#E51A22]/20'
                                        }`}
                                    />
                                    <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    You can change your name anytime, but you cannot leave this field empty.
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                                    Email Address (Account ID)
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-3.5 text-sm font-medium text-slate-500 cursor-not-allowed"
                                    />
                                    <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Connected via {user?.provider === 'google' ? 'Google' : 'Email'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="9876543210"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 pl-13 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                    />
                                    <Phone className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Used for order status SMS and delivery notifications.
                                </span>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="px-7 py-3.5 rounded-2xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,26,34,0.25)] hover:shadow-[0_6px_22px_rgba(229,26,34,0.35)] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                                >
                                    {isSavingProfile ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving Profile...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Save Profile Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* ADD / EDIT ADDRESS MODAL - Rendered directly onto document.body using Portal */}
            {isAddressModalOpen && createPortal(
                <div 
                    className="fixed inset-0 z-[9999999] overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsAddressModalOpen(false);
                    }}
                >
                    <div className="min-h-full flex items-center justify-center py-6 sm:py-10">
                        <div 
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header - Always Visible at the top */}
                            <div className="px-5 py-4 sm:px-7 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-black text-[#1A1A24]">
                                        {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                                    </h3>
                                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                                        {addresses.length}/5 addresses saved. Please enter delivery location details.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 ml-3"
                                    title="Close dialog"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSaveAddress} className="p-5 sm:p-7 space-y-3.5 bg-white">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                        Recipient Full Name <span className="text-[#E51A22]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        placeholder="e.g. Adheen Bhuva"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                        Mobile Phone Number <span className="text-[#E51A22]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            required
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                                            placeholder="9876543210"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                        House / Flat / Street Address <span className="text-[#E51A22]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.streetAddress}
                                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                                        placeholder="Flat 402, Sunshine Heights, Near City Mall"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                            Pincode <span className="text-[#E51A22]">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                value={addressForm.zipCode}
                                                onChange={(e) => handlePincodeChange(e.target.value)}
                                                placeholder="395007"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                            />
                                            {pincodeLoading && (
                                                <Loader2 className="w-4 h-4 text-[#E51A22] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                            City <span className="text-[#E51A22]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            placeholder="City"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                                            State <span className="text-[#E51A22]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                            placeholder="State"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E51A22] focus:ring-2 focus:ring-[#E51A22]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={addressForm.isDefault}
                                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                            className="w-4 h-4 rounded text-[#E51A22] focus:ring-[#E51A22]"
                                        />
                                        <span className="text-xs font-bold text-slate-700">
                                            Set as Default Delivery Address
                                        </span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isSavingAddress}
                                        className="flex-1 py-3 rounded-xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                                    >
                                        {isSavingAddress ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Saving Address...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(false)}
                                        className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Profile;

