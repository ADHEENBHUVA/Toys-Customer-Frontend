import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
    CheckCircle2, AlertTriangle, Trash2, X, Info, 
    Sparkles, ArrowRight, Loader2, Check 
} from 'lucide-react';

const PopupContext = createContext(null);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

export const PopupProvider = ({ children }) => {
    // Modal states
    const [popupState, setPopupState] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'confirm' | 'error' | 'info'
        title: '',
        message: '',
        badgeText: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmColor: 'red', // 'red' | 'green' | 'blue'
        onConfirm: null,
        onCancel: null,
        autoCloseMs: 0,
        isLoading: false
    });

    const [progress, setProgress] = useState(100);

    // Close Popup helper
    const closePopup = useCallback(() => {
        setPopupState(prev => ({ ...prev, isOpen: false, isLoading: false }));
    }, []);

    // 1. Success Popup (CRUD: Created, Updated, Saved)
    const showSuccess = useCallback(({ title, message, badgeText = 'SUCCESS', autoCloseMs = 3000, triggerConfetti = true }) => {
        if (triggerConfetti) {
            try {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#E51A22', '#10B981', '#F59E0B', '#3B82F6']
                });
            } catch (err) {
                // Ignore if confetti not supported
            }
        }

        setProgress(100);
        setPopupState({
            isOpen: true,
            type: 'success',
            title: title || 'Action Successful!',
            message: message || 'Your changes have been saved successfully.',
            badgeText,
            confirmText: 'Done',
            cancelText: '',
            autoCloseMs,
            isLoading: false
        });
    }, []);

    // 2. Error Popup
    const showError = useCallback(({ title, message }) => {
        setPopupState({
            isOpen: true,
            type: 'error',
            title: title || 'Operation Failed',
            message: message || 'An error occurred while processing your request.',
            badgeText: 'ERROR',
            confirmText: 'Okay',
            cancelText: '',
            autoCloseMs: 0,
            isLoading: false
        });
    }, []);

    // 3. Confirm Popup (CRUD: Delete, Cancel, Clear)
    const openConfirm = useCallback(({ 
        title, 
        message, 
        confirmText = 'Yes, Delete', 
        cancelText = 'Cancel', 
        confirmColor = 'red',
        badgeText = 'CONFIRM ACTION',
        onConfirm,
        onCancel 
    }) => {
        setPopupState({
            isOpen: true,
            type: 'confirm',
            title: title || 'Are you sure?',
            message: message || 'This action cannot be undone.',
            badgeText,
            confirmText,
            cancelText,
            confirmColor,
            onConfirm,
            onCancel,
            autoCloseMs: 0,
            isLoading: false
        });
    }, []);

    // Handle Confirm Click with async loading support
    const handleConfirm = async () => {
        if (popupState.onConfirm) {
            try {
                setPopupState(prev => ({ ...prev, isLoading: true }));
                await popupState.onConfirm();
                closePopup();
            } catch (err) {
                console.error('Confirm action error:', err);
                setPopupState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            closePopup();
        }
    };

    // Handle Cancel Click
    const handleCancel = () => {
        if (popupState.onCancel) {
            popupState.onCancel();
        }
        closePopup();
    };

    // Auto-close countdown for Success popups
    useEffect(() => {
        if (popupState.isOpen && popupState.autoCloseMs > 0 && popupState.type === 'success') {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remainingPct = Math.max(0, 100 - (elapsed / popupState.autoCloseMs) * 100);
                setProgress(remainingPct);
                if (elapsed >= popupState.autoCloseMs) {
                    clearInterval(interval);
                    closePopup();
                }
            }, 30);

            return () => clearInterval(interval);
        }
    }, [popupState.isOpen, popupState.autoCloseMs, popupState.type, closePopup]);

    // Handle Escape Key and Body Scroll Lock
    useEffect(() => {
        if (popupState.isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => {
                if (e.key === 'Escape' && !popupState.isLoading) closePopup();
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [popupState.isOpen, popupState.isLoading, closePopup]);

    return (
        <PopupContext.Provider value={{ showSuccess, showError, openConfirm, closePopup }}>
            {children}

            {/* UNIQUE BRANDED POPUP MODAL */}
            <AnimatePresence>
                {popupState.isOpen && (
                    <div 
                        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={(e) => {
                            if (e.target === e.currentTarget && !popupState.isLoading) {
                                closePopup();
                            }
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-[420px] bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 text-center overflow-hidden"
                        >
                            {/* Top Ambient Glow / Decorative Line */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                                popupState.type === 'confirm' 
                                    ? 'bg-gradient-to-r from-amber-500 via-[#E51A22] to-rose-500' 
                                    : popupState.type === 'error'
                                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                                    : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600'
                            }`} />

                            {/* Close (X) Button */}
                            {!popupState.isLoading && (
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                                    title="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Floating Animated Icon */}
                            <div className="relative mx-auto mb-4 mt-1 flex items-center justify-center">
                                {popupState.type === 'confirm' ? (
                                    <div className="relative">
                                        <div className="w-18 h-18 rounded-3xl bg-rose-50 border-2 border-rose-200 text-[#E51A22] flex items-center justify-center shadow-lg shadow-rose-500/10 animate-bounce-subtle">
                                            <Trash2 className="w-9 h-9 stroke-[2.2]" />
                                        </div>
                                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-black text-amber-950">
                                            !
                                        </span>
                                    </div>
                                ) : popupState.type === 'error' ? (
                                    <div className="w-18 h-18 rounded-3xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center shadow-lg shadow-red-500/10">
                                        <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="w-18 h-18 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E51A22] border-2 border-white flex items-center justify-center shadow-xs">
                                            <Sparkles className="w-3.5 h-3.5 text-white" />
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Badge */}
                            {popupState.badgeText && (
                                <div className="mb-2">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                                        popupState.type === 'confirm'
                                            ? 'bg-rose-50 text-[#E51A22] border-rose-200'
                                            : popupState.type === 'error'
                                            ? 'bg-red-50 text-red-700 border-red-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                        {popupState.badgeText}
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-black text-[#1A1A24] tracking-tight mb-2">
                                {popupState.title}
                            </h3>

                            {/* Message */}
                            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6 px-2">
                                {popupState.message}
                            </p>

                            {/* Actions Buttons */}
                            {popupState.type === 'confirm' ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={popupState.isLoading}
                                        onClick={handleCancel}
                                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {popupState.cancelText || 'Cancel'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={popupState.isLoading}
                                        onClick={handleConfirm}
                                        className={`flex-1 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60 ${
                                            popupState.confirmColor === 'red'
                                                ? 'bg-[#E51A22] hover:bg-[#c9141b] shadow-red-500/25'
                                                : 'bg-slate-900 hover:bg-black shadow-slate-900/25'
                                        }`}
                                    >
                                        {popupState.isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                <span>{popupState.confirmText || 'Yes, Delete'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={closePopup}
                                        className="w-full py-3.5 rounded-2xl bg-[#E51A22] hover:bg-[#c9141b] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>{popupState.confirmText || 'Got it!'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Auto-Close Progress Bar for Success Popup */}
                            {popupState.type === 'success' && popupState.autoCloseMs > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PopupContext.Provider>
    );
};

