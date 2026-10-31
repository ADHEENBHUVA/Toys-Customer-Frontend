import React, { useEffect } from 'react';
import { 
    Printer, X, Download, ShieldCheck, CheckCircle2, Clock, 
    MapPin, Phone, Mail, User, Check, Package, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { BRAND_LOGO_BASE64 } from './brandLogoBase64';

// Helper to format currency
const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(val) || 0);
};

// Number to Words for Indian Rupees
const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
               'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
        let str = '';
        if (n > 99) {
            str += a[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
        } else {
            str += a[n];
        }
        return str.trim();
    };

    const n = Math.floor(Math.abs(Number(num) || 0));
    if (n === 0) return 'Zero Rupees Only';

    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const remainder = n % 1000;

    let res = '';
    if (crore > 0) res += inWords(crore) + ' Crore ';
    if (lakh > 0) res += inWords(lakh) + ' Lakh ';
    if (thousand > 0) res += inWords(thousand) + ' Thousand ';
    if (remainder > 0) res += inWords(remainder);

    return (res.trim() + ' Rupees Only').replace(/\s+/g, ' ');
};

const COMPANY_LOGO_URL = BRAND_LOGO_BASE64 || "/brand-logo.png";

const Invoice = ({ order, onClose }) => {
    // ESC key to close invoice & body overflow lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (onClose) onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handlePrint = () => {
        window.print();
    };

    if (!order) return null;

    // Normalizing customer information
    const customerObj = order.customer && typeof order.customer === 'object' ? order.customer : {};
    const storedUser = (typeof localStorage !== 'undefined' && localStorage.getItem('user')) 
        ? (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return {}; } })() 
        : {};

    const customerName = order.shippingAddress?.fullName || 
        order.billingAddress?.fullName || 
        customerObj.name || 
        `${customerObj.firstName || ''} ${customerObj.lastName || ''}`.trim() || 
        storedUser?.name ||
        `${storedUser?.firstName || ''} ${storedUser?.lastName || ''}`.trim() || 
        'Valued Customer';
        
    const customerEmail = customerObj.email || 
        order.shippingAddress?.email || 
        order.billingAddress?.email || 
        storedUser?.email || 
        '';

    const customerPhone = order.shippingAddress?.phone || 
        order.billingAddress?.phone || 
        customerObj.phone || 
        storedUser?.phone || 
        '';

    // Normalizing address
    const shipAddr = order.shippingAddress || order.billingAddress || {};
    const formattedAddress = [
        shipAddr.addressLine1 || shipAddr.street || shipAddr.streetAddress || '',
        shipAddr.addressLine2 || '',
        [shipAddr.city, shipAddr.state].filter(Boolean).join(', '),
        (shipAddr.postalCode || shipAddr.zipCode) ? `PIN: ${shipAddr.postalCode || shipAddr.zipCode}` : '',
        shipAddr.country || 'India'
    ].filter(Boolean);

    // Normalizing order items
    const rawItems = order.orderItems || order.items || [];

    // Real Order ID and Invoice Number
    const rawId = order._id ? String(order._id) : (order.id ? String(order.id) : '');
    const realOrderCode = rawId 
        ? (rawId.length > 8 ? rawId.slice(-8).toUpperCase() : rawId.toUpperCase()) 
        : (order.orderNumber ? String(order.orderNumber).replace(/^OD-?/i, '') : '');

    const displayOrderId = order.orderNumber 
        ? order.orderNumber 
        : (realOrderCode ? `#OD-${realOrderCode}` : (order.orderId || 'ORD-PENDING'));

    const orderDateObj = order.createdAt ? new Date(order.createdAt) : (order.date ? new Date(order.date) : new Date());
    const invoiceYear = orderDateObj.getFullYear();
    const invoiceMonth = String(orderDateObj.getMonth() + 1).padStart(2, '0');

    const invoiceNumber = order.invoiceNumber || `INV/${invoiceYear}-${invoiceMonth}/${realOrderCode || '001'}`;

    const dateFormatted = orderDateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const subTotal = Number(order.subTotal !== undefined ? order.subTotal : (order.subtotal !== undefined ? order.subtotal : order.totalAmount || 0));
    const shippingCharge = Number(order.shippingCharge !== undefined ? order.shippingCharge : (order.shippingFee !== undefined ? order.shippingFee : 0));
    const discountAmount = Number(order.discountAmount || 0);
    const taxAmount = Number(order.taxAmount !== undefined ? order.taxAmount : (order.tax !== undefined ? order.tax : 0));
    const totalAmount = Number(order.totalAmount || (subTotal + shippingCharge + taxAmount - discountAmount));

    const paymentStatus = order.paymentStatus || (order.orderStatus === 'Cancelled' ? 'Cancelled' : 'Paid');
    const isPaid = paymentStatus.toLowerCase() === 'paid';

    const handleDownload = async () => {
        const loadingToast = toast.loading('Generating High-Quality PDF...');
        try {
            const element = document.getElementById('invoice-content');
            if (!element) throw new Error("Invoice content not found");

            const dataUrl = await toPng(element, { 
                quality: 0.98,
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${invoiceNumber.replace(/[\/\\]/g, '_')}.pdf`);
            
            toast.success('PDF Downloaded Successfully!', { id: loadingToast });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error(`Download failed: ${error.message || 'Unknown error'}`, { id: loadingToast });
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget && onClose) onClose();
            }}
        >
            {/* FLOATING PROMINENT TOP-RIGHT CORNER CLOSE BUTTON ("CHOKDI") */}
            <button
                type="button"
                onClick={onClose}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[120] w-11 h-11 sm:w-12 sm:h-12 bg-white hover:bg-[#E51A22] text-slate-800 hover:text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)] border-2 border-slate-300 hover:border-[#E51A22] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 group print:hidden"
                title="Close Invoice (Esc)"
                aria-label="Close Invoice"
            >
                <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div className="min-h-full flex items-start justify-center p-3 sm:p-6 py-6 sm:py-10">
                <div 
                    className="bg-white w-full max-w-[880px] rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 my-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top Decorative Brand Gradient Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#E51A22] via-[#ff4757] to-[#1c274c]"></div>

                    {/* Top Action Toolbar */}
                    <div className="bg-slate-900 text-white p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Invoice:</span>
                            <span className="text-sm font-extrabold text-white bg-slate-800 px-3 py-1 rounded-lg font-mono border border-slate-700">
                                {invoiceNumber}
                            </span>
                            <span className="text-xs text-slate-400">({displayOrderId})</span>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-2.5">
                            <button 
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-[#E51A22] hover:bg-[#c9141b] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm active:scale-95 cursor-pointer"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                            <button 
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all border border-slate-700 text-xs sm:text-sm active:scale-95 cursor-pointer"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                            {/* Inner Close Button */}
                            <button 
                                onClick={onClose}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/20 hover:bg-[#E51A22] text-rose-300 hover:text-white rounded-xl font-bold transition-all border border-rose-500/30 text-xs sm:text-sm active:scale-95 cursor-pointer"
                                title="Close dialog"
                            >
                                <X className="w-4 h-4" />
                                <span>Close</span>
                            </button>
                        </div>
                    </div>

                    {/* Clean Executive Tax Invoice Document */}
                    <div 
                        className="bg-white p-6 sm:p-12 text-[#1c274c] font-sans print:p-0 print:m-0 selection:bg-rose-100 relative" 
                        id="invoice-content"
                        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                    >
                        {/* 1. Header (Brand Logo, Details, Verified Seal & Invoice Meta) */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900 relative">
                            {/* Brand Details */}
                            <div className="flex flex-col items-start gap-2.5 max-w-sm">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src={COMPANY_LOGO_URL} 
                                        alt="Little Joys - Kids & Baby Store" 
                                        className="h-12 sm:h-14 w-auto object-contain"
                                    />
                                </div>
                                <div className="text-[12px] text-slate-600 space-y-1 font-medium leading-relaxed">
                                    <p className="font-extrabold text-slate-900 text-sm">Little Joys Retail Pvt. Ltd.</p>
                                    <p className="flex items-center gap-1 text-slate-600">
                                        <MapPin className="w-3.5 h-3.5 text-[#E51A22] shrink-0" />
                                        <span>Tulsi Arcade, Mota Varachha, Surat, Gujarat 394101</span>
                                    </p>
                                    <p className="flex items-center gap-1 text-slate-600">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>+91 8347640423 | adheenbhuva0007@gmail.com</span>
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-mono pt-0.5">
                                        GSTIN: <span className="font-bold text-slate-800">24AAACL1234F1Z5</span> • State: 24 (Gujarat)
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Tax Invoice Badge & Stamp */}
                            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                <div className="inline-block bg-[#1c274c] text-white px-4 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase mb-3 shadow-xs">
                                    ORIGINAL TAX INVOICE
                                </div>
                                
                                <div className="space-y-1 text-left sm:text-right font-mono text-xs">
                                    <p className="text-slate-500 font-semibold font-sans">Invoice Number:</p>
                                    <p className="text-base font-black text-[#1c274c] tracking-tight">{invoiceNumber}</p>
                                    <p className="text-[11px] text-slate-500 font-sans mt-1">
                                        Date: <span className="font-bold text-slate-900">{dateFormatted}</span>
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-sans">
                                        Order ID: <span className="font-bold text-slate-900">{displayOrderId}</span>
                                    </p>
                                </div>

                                {/* Verified Paid Stamp Graphic */}
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-[11px] font-black tracking-wider uppercase shadow-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>{isPaid ? 'VERIFIED & PAID' : paymentStatus}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Customer Billed To & Order Details Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
                            {/* Billed & Shipped To */}
                            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5">
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#E51A22]" /> Billed &amp; Shipped To:
                                </p>
                                <p className="font-black text-slate-900 text-sm mb-1">{customerName}</p>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                                    {formattedAddress.length > 0 ? formattedAddress.join(', ') : 'Delivery address on record'}
                                </p>
                                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200/80">
                                    {customerPhone && (
                                        <p className="flex items-center gap-1.5 font-medium">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <span>+91 {customerPhone}</span>
                                        </p>
                                    )}
                                    {customerEmail && (
                                        <p className="flex items-center gap-1.5 font-medium">
                                            <Mail className="w-3 h-3 text-slate-400" />
                                            <span>{customerEmail}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order & Payment Summary Card */}
                            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                                        <Package className="w-3.5 h-3.5 text-blue-600" /> Order &amp; Payment Overview:
                                    </p>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Payment Mode:</span>
                                            <span className="font-bold text-slate-900 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {order.paymentMethod || 'Online'}
                                            </span>
                                        </div>
                                        {order.razorpayPaymentId && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">Txn ID:</span>
                                                <span className="font-mono text-slate-800 font-bold">{order.razorpayPaymentId}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Fulfillment Status:</span>
                                            <span className="font-black text-[#1c274c] uppercase tracking-wider text-[11px]">
                                                {order.orderStatus || 'Confirmed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Barcode Visual for authentic e-commerce feel */}
                                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-0.5 h-6">
                                            <span className="w-1 h-6 bg-slate-800"></span>
                                            <span className="w-0.5 h-6 bg-slate-800"></span>
                                            <span className="w-2 h-6 bg-slate-800"></span>
                                            <span className="w-0.5 h-6 bg-slate-800"></span>
                                            <span className="w-1.5 h-6 bg-slate-800"></span>
                                            <span className="w-0.5 h-6 bg-slate-800"></span>
                                            <span className="w-2 h-6 bg-slate-800"></span>
                                            <span className="w-1 h-6 bg-slate-800"></span>
                                            <span className="w-0.5 h-6 bg-slate-800"></span>
                                            <span className="w-1.5 h-6 bg-slate-800"></span>
                                            <span className="w-2 h-6 bg-slate-800"></span>
                                            <span className="w-0.5 h-6 bg-slate-800"></span>
                                            <span className="w-1 h-6 bg-slate-800"></span>
                                        </div>
                                        <p className="text-[9px] font-mono text-slate-400">{displayOrderId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-medium">Place of Supply</p>
                                        <p className="text-xs font-bold text-slate-800">Gujarat (24)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Items Table */}
                        <div className="border border-slate-300 rounded-2xl overflow-hidden mb-6 shadow-xs">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1c274c] text-white font-bold text-center">
                                        <th className="py-3.5 px-3 w-12 border-r border-slate-700">#</th>
                                        <th className="py-3.5 px-4 text-left border-r border-slate-700">Item Description</th>
                                        <th className="py-3.5 px-3 w-20 border-r border-slate-700">Qty</th>
                                        <th className="py-3.5 px-4 text-right w-28 border-r border-slate-700">Unit Price (₹)</th>
                                        <th className="py-3.5 px-4 text-right w-28">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {rawItems.map((item, index) => {
                                        const itemName = item.name || item.product?.name || item.title || 'Toy Item';
                                        const qty = Number(item.quantity || 1);
                                        const unitPrice = Number(item.price !== undefined ? item.price : (item.product?.price || 0));
                                        const rowTotal = unitPrice * qty;

                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="py-3 px-3 text-center border-r border-slate-200 font-semibold text-slate-400">
                                                    {index + 1}
                                                </td>
                                                <td className="py-3 px-4 border-r border-slate-200 font-bold text-slate-900">
                                                    {itemName}
                                                    {item.variant && (
                                                        <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                                                            Option: {item.variant}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-center border-r border-slate-200 font-semibold text-slate-700">
                                                    {qty}
                                                </td>
                                                <td className="py-3 px-4 text-right border-r border-slate-200 font-medium text-slate-700">
                                                    ₹{formatCurrency(unitPrice)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-black text-slate-900">
                                                    ₹{formatCurrency(rowTotal)}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Sub Total */}
                                    <tr className="border-t-2 border-slate-300">
                                        <td colSpan="3" className="border-r border-slate-200 bg-slate-50/40"></td>
                                        <td className="py-2.5 px-4 text-right font-bold text-slate-600 border-r border-slate-200 bg-slate-50">
                                            Sub Total
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 bg-slate-50">
                                            ₹{formatCurrency(subTotal)}
                                        </td>
                                    </tr>

                                    {/* Shipping Charges */}
                                    <tr>
                                        <td colSpan="3" className="border-r border-slate-200 bg-slate-50/40"></td>
                                        <td className="py-2.5 px-4 text-right font-bold text-slate-600 border-r border-slate-200 bg-slate-50">
                                            Shipping Fee
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-bold bg-slate-50">
                                            {shippingCharge > 0 ? (
                                                `₹${formatCurrency(shippingCharge)}`
                                            ) : (
                                                <span className="text-emerald-700 font-black">FREE SHIPPING</span>
                                            )}
                                        </td>
                                    </tr>

                                    {/* Discount if any */}
                                    {discountAmount > 0 && (
                                        <tr>
                                            <td colSpan="3" className="border-r border-slate-200 bg-emerald-50/20"></td>
                                            <td className="py-2.5 px-4 text-right font-bold text-emerald-700 border-r border-slate-200 bg-emerald-50/40">
                                                Coupon Discount
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-black text-emerald-700 bg-emerald-50/40">
                                                -₹{formatCurrency(discountAmount)}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Estimated GST */}
                                    {taxAmount > 0 && (
                                        <tr>
                                            <td colSpan="3" className="border-r border-slate-200 bg-slate-50/40"></td>
                                            <td className="py-2.5 px-4 text-right font-medium text-slate-500 border-r border-slate-200 bg-slate-50">
                                                Taxes Included (GST)
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-medium text-slate-700 bg-slate-50">
                                                ₹{formatCurrency(taxAmount)}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Grand Total */}
                                    <tr className="bg-[#1c274c] text-white font-black text-sm">
                                        <td colSpan="3" className="border-r border-slate-800"></td>
                                        <td className="py-3.5 px-4 text-right border-r border-slate-800 uppercase tracking-wider text-xs">
                                            Grand Total
                                        </td>
                                        <td className="py-3.5 px-4 text-right text-base text-yellow-300 font-mono">
                                            ₹{formatCurrency(totalAmount)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Amount in Words Box */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-slate-200">
                            <div className="w-9 h-9 rounded-xl bg-[#1c274c] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                                ₹
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Total in Words: </span>
                                <span className="font-black text-[#1c274c] italic ml-1">
                                    {numberToWords(totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* 5. Policy Terms & Authorized Signatory */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                            <div className="text-xs text-slate-600 space-y-1.5">
                                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Terms &amp; Return Conditions:
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    • Eligible items can be returned or exchanged within 7 days from delivery date.<br />
                                    • All toys sold are child-safe and quality certified.<br />
                                    • Customer Support: adheenbhuva0007@gmail.com | +91 8347640423
                                </p>
                            </div>

                            <div className="text-left sm:text-right flex flex-col justify-between items-start sm:items-end">
                                <div>
                                    <p className="text-[11px] text-slate-500">For <span className="font-bold text-slate-800">Little Joys Retail Pvt. Ltd.</span></p>
                                </div>
                                <div className="mt-6 sm:mt-0 pt-3">
                                    <div className="inline-block border-t border-dashed border-slate-400 pt-1 text-[11px] text-slate-500">
                                        <p className="font-bold text-slate-800">Authorized Signatory</p>
                                        <p className="text-[10px] text-slate-400 italic">Computer Generated Invoice • No Physical Signature Required</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom line */}
                        <div className="border-t border-slate-100 mt-6 pt-3 flex flex-col sm:flex-row justify-between text-[10px] text-slate-400">
                            <span>Little Joys Online Store • https://littlejoys.com</span>
                            <span>Generated: {new Date().toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Bottom Action for Mobile */}
                    <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap justify-center items-center gap-3 print:hidden">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#E51A22] hover:bg-[#c9141b] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm active:scale-95 cursor-pointer"
                        >
                            <Download className="w-4 h-4" /> Download Invoice PDF
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition-all text-xs sm:text-sm active:scale-95 cursor-pointer"
                        >
                            <Printer className="w-4 h-4" /> Print
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all text-xs sm:text-sm active:scale-95 cursor-pointer"
                        >
                            <X className="w-4 h-4" /> Close
                        </button>
                    </div>

                    {/* Print CSS */}
                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #invoice-content, #invoice-content * {
                                visibility: visible;
                            }
                            #invoice-content {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                padding: 20px;
                            }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
