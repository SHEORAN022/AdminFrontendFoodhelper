// import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Package, User, Phone, MapPin, Filter, Clock,
//   ChevronDown, Search, RefreshCw, ShoppingBag,
//   Bike, UserCheck, X, FileText, Pencil, Plus, Minus, ClipboardList,
//   Download, CheckCircle, Hourglass, TrendingUp, Wallet, Tag, Bell,
//   Store, Eye, Users,
// } from "lucide-react";

// const ORDER_API   = "https://grocerrybackend.onrender.com/api/orders";
// const RIDER_API   = "https://grocerrybackend.onrender.com/api/riders";
// const PRODUCT_API = "https://grocerrybackend.onrender.com/api/categories/with-products";

// const FALLBACK_POLL_INTERVAL = 30_000;

// const STATUS_CONFIG = {
//   placed:    { label: "Placed",    bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
//   confirmed: { label: "Confirmed", bg: "bg-blue-100",  text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500"  },
//   shipped:   { label: "Shipped",   bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
//   delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
//   cancelled: { label: "Cancelled", bg: "bg-red-100",   text: "text-red-600",   border: "border-red-200",   dot: "bg-red-500"   },
// };

// const getEffectiveTotal = (order) =>
//   order.finalPrice != null ? order.finalPrice : (order.totalPrice || 0);

// const getPaymentStatus = (order) => {
//   if (order.status === "cancelled") return "cancelled";
//   if (order.paymentStatus) return order.paymentStatus;
//   const paid  = order.paidAmount || 0;
//   const total = getEffectiveTotal(order);
//   if (paid <= 0)     return "unpaid";
//   if (paid >= total) return "paid";
//   return "partial";
// };

// const getAllVendorsFromItems = (items = []) => {
//   const vendorMap = new Map();
//   items.forEach((it) => {
//     if (it.ownerType === "vendor" && it.vendorId && typeof it.vendorId === "object") {
//       const v = it.vendorId;
//       const id = v._id?.toString();
//       if (!id) return;
//       if (!vendorMap.has(id)) {
//         vendorMap.set(id, {
//           _id:          id,
//           name:         v.name         || "",
//           businessName: v.businessName || v.name || "",
//           phone:        v.phone        || "",
//           gstin:        v.gstin        || "",
//           email:        v.email        || "",
//           products:     [],
//         });
//       }
//       vendorMap.get(id).products.push({
//         name:      it.name      || "—",
//         quantity:  it.quantity  || 1,
//         unitPrice: it.unitPrice || 0,
//         image:     it.image     || it.product?.image || "",
//         unit:      it.unit      || "pcs",
//         mrp:       it.mrp       || 0,
//         hsn:       it.hsn       || "",
//         gstRate:   it.gstRate   ?? 0,
//       });
//     }
//   });
//   return Array.from(vendorMap.values());
// };

// const getAdminItems = (items = []) =>
//   items.filter((it) => it.ownerType !== "vendor");

// const flattenProducts = (categories = []) => {
//   const products = [];
//   categories.forEach((cat) => {
//     cat.subcategories?.forEach((sub) => {
//       sub.subSubcategories?.forEach((ssub) => {
//         ssub.products?.forEach((p) => {
//           products.push({
//             _id:          p._id,
//             name:         p.name,
//             brand:        p.brand,
//             image:        p.image,
//             salePrice:    p.salePrice,
//             mrp:          p.mrp,
//             hsn:          p.hsn,
//             gstRate:      p.gstRate,
//             unit:         p.unit,
//             weight:       p.weight,
//             status:       p.status,
//             category:     cat.name,
//             subCategory:  sub.name,
//             ownerType:    "admin",
//             productModel: "Price",
//           });
//         });
//       });
//     });
//   });
//   return products;
// };

// const buildInvoiceOrder = (o, useOriginal = false) => {
//   const itemsSource = useOriginal
//     ? (o.originalItems && o.originalItems.length > 0 ? o.originalItems : o.items)
//     : o.items;

//   const items = (itemsSource || []).map((it) => {
//     const prod =
//       !useOriginal &&
//       it.product &&
//       typeof it.product === "object" &&
//       it.product.name
//         ? it.product
//         : {};

//     const name      = it.name      || prod.name     || "—";
//     const mrp       = it.mrp       ?? prod.mrp       ?? it.unitPrice ?? 0;
//     const hsn       = it.hsn       || prod.hsn       || "N/A";
//     const gstRate   = it.gstRate   ?? prod.gstRate   ?? 0;
//     const unit      = it.unit      || prod.unit      || "pcs";
//     const packing   = it.packing   || (prod.weight ? `${prod.weight.value}${prod.weight.unit}` : "—");
//     const unitPrice = it.unitPrice || prod.salePrice || 0;
//     const quantity  = it.quantity  || 1;

//     return {
//       name, quantity, rate: unitPrice, mrp, hsn, gstRate, unit, packing,
//       unitPrice, price: it.price ?? +(unitPrice * quantity).toFixed(2),
//     };
//   });

//   const grandTotal = useOriginal
//     ? (o.originalTotalPrice != null
//         ? o.originalTotalPrice
//         : +items.reduce((s, i) => s + i.unitPrice * i.quantity, 0).toFixed(2))
//     : getEffectiveTotal(o);

//   return {
//     _id:            o._id,
//     createdAt:      o.createdAt,
//     status:         o.status,
//     invoiceNo:      `INV-${o._id.slice(-6).toUpperCase()}`,
//     paymentMode:    o.paymentMode || "Cash",
//     couponCode:     o.couponCode     || null,
//     couponDiscount: o.couponDiscount || 0,
//     finalPrice:     o.finalPrice     || null,
//     deliveryCharge: o.deliveryCharge || 0,
//     handlingCharge: o.handlingCharge || 0,
//     vendor: {
//       name:    o.vendor?.name    || "Your Company Name",
//       gstin:   o.vendor?.gstin   || "GSTIN_HERE",
//       address: o.vendor?.address || "Company Address Here",
//       phone:   o.vendor?.phone   || "",
//       email:   o.vendor?.email   || "",
//     },
//     customer: {
//       name:  o.user?.name || o.userName || "—",
//       phone: o.address?.phone || "",
//       address: {
//         street:  o.address?.street  || "",
//         city:    o.address?.city    || "",
//         state:   o.address?.state   || "",
//         pincode: o.address?.pincode || "",
//       },
//     },
//     items,
//     totalPrice: grandTotal,
//   };
// };

// // ─── CSV HELPERS ──────────────────────────────────────────────────────────────
// const escapeCSV = (val) => {
//   if (val === null || val === undefined) return "";
//   const str = String(val);
//   if (str.includes(",") || str.includes('"') || str.includes("\n"))
//     return `"${str.replace(/"/g, '""')}"`;
//   return str;
// };

// const buildTallyCSV = (orders) => {
//   const headers = [
//     "Vch Ref", "Invoice No", "Voucher Date", "Invoice Date", "Voucher TYPE",
//     "Customer Code / Alias", "Customer Name", "Customer Mobile No", "Under Group",
//     "Address Name", "Street", "City", "State", "Pincode", "Full Address", "GST No",
//     "Product NO", "Product Description", "Stock Category", "HSN", "STORE", "UOM",
//     "Quantity", "Rate", "Amount", "GST %", "SGST Amount", "CGST Amount", "IGST Amount",
//     "Round off", "Line Total", "Remarks",
//   ];

//   const rows = [];
//   let vchRef = 1;

//   orders.forEach((o) => {
//     const invoiceNo = `INV-${o._id.slice(-6).toUpperCase()}`;
//     const fmtDate = (() => {
//       if (!o.createdAt) return "";
//       const d = new Date(o.createdAt);
//       if (isNaN(d.getTime())) return "";
//       return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
//     })();

//     const customerName   = o.user?.name || o.userName || "";
//     const customerMobile = o.address?.phone || "";
//     const gstin          = o.vendor?.gstin  || "";
//     const store          = o.vendor?.address || "Main Location";
//     const customerCode   = `A${String(vchRef).padStart(6, "0")}`;
//     const addrName  = o.address?.name    || customerName;
//     const street    = o.address?.street  || "";
//     const city      = o.address?.city    || "";
//     const state     = o.address?.state   || "";
//     const pincode   = o.address?.pincode || "";
//     const fullAddr  = [addrName, street, city, state, pincode].filter(Boolean).join(", ");
//     const items = o.items || [];
//     let isFirstItem = true;

//     if (items.length === 0) {
//       const total = getEffectiveTotal(o);
//       rows.push([
//         vchRef, invoiceNo, fmtDate, fmtDate, "GST Sales",
//         customerCode, customerName, customerMobile, "Sundry Debtors",
//         addrName, street, city, state, pincode, fullAddr, gstin,
//         "", "", "", "", store, "", "", "", total,
//         "", "", "", "", "-", total, o.paymentNote || "",
//       ]);
//     } else {
//       items.forEach((it) => {
//         const prod = it.product && typeof it.product === "object" && it.product.name ? it.product : {};
//         const productNo  = prod._id      || it.product  || "";
//         const name       = it.name       || prod.name   || "—";
//         const hsn        = it.hsn        || prod.hsn    || "N/A";
//         const unit       = it.unit       || prod.unit   || "pcs";
//         const gstRate    = it.gstRate    ?? prod.gstRate ?? 0;
//         const unitPrice  = it.unitPrice  || prod.salePrice || 0;
//         const quantity   = it.quantity   || 1;
//         const stockCat   = prod.category || "";
//         const remarks    = isFirstItem ? (o.paymentNote || "") : "";
//         const amount     = +(unitPrice * quantity).toFixed(2);
//         const halfGST    = gstRate / 2;
//         const sgst       = gstRate > 0 ? +(amount * halfGST / 100).toFixed(2) : "";
//         const cgst       = gstRate > 0 ? +(amount * halfGST / 100).toFixed(2) : "";
//         const igst       = "";
//         const gstTotal   = gstRate > 0 ? ((sgst || 0) + (cgst || 0)) : 0;
//         const lineRaw    = amount + gstTotal;
//         const lineRounded = Math.round(lineRaw);
//         const roundOff   = +(lineRounded - lineRaw).toFixed(2);

//         rows.push([
//           vchRef, invoiceNo, fmtDate, fmtDate, "GST Sales",
//           customerCode, customerName, customerMobile, "Sundry Debtors",
//           addrName, street, city, state, pincode, fullAddr, gstin,
//           productNo, name, stockCat, hsn, store, unit, quantity, unitPrice, amount,
//           gstRate, sgst, cgst, igst,
//           roundOff === 0 ? "-" : roundOff, lineRounded, remarks,
//         ]);
//         isFirstItem = false;
//       });
//     }
//     vchRef++;
//   });

//   return [
//     headers.map(escapeCSV).join(","),
//     ...rows.map((r) => r.map(escapeCSV).join(",")),
//   ].join("\n");
// };

// const downloadCSV = (csvString, filename) => {
//   const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
//   const url  = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href     = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

// // ─── ALERT SOUND ─────────────────────────────────────────────────────────────
// const playAlertSound = () => {
//   try {
//     const ctx   = new (window.AudioContext || window.webkitAudioContext)();
//     const notes = [880, 1100, 880, 1320];
//     notes.forEach((freq, i) => {
//       const osc  = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.type = "sine";
//       osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
//       gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
//       gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.03);
//       gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.11);
//       osc.start(ctx.currentTime + i * 0.12);
//       osc.stop(ctx.currentTime + i * 0.12 + 0.12);
//     });
//   } catch {}
// };

// // ─── NEW ORDER TOAST ──────────────────────────────────────────────────────────
// const NewOrderToast = ({ order, onDismiss, index }) => {
//   const [visible, setVisible] = useState(false);
//   const [leaving, setLeaving] = useState(false);

//   useEffect(() => {
//     const t    = setTimeout(() => setVisible(true), index * 80);
//     const auto = setTimeout(() => handleDismiss(), 12000 + index * 80);
//     return () => { clearTimeout(t); clearTimeout(auto); };
//   }, []);

//   const handleDismiss = () => {
//     setLeaving(true);
//     setTimeout(() => onDismiss(order._id), 350);
//   };

//   const timeStr = order.createdAt
//     ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
//     : "";

//   const itemNames = (order.items || [])
//     .slice(0, 2)
//     .map((it) => it.name || it.product?.name || "Item")
//     .join(", ");

//   const moreItems = (order.items?.length || 0) > 2
//     ? ` +${order.items.length - 2} more` : "";

//   return (
//     <div
//       style={{
//         transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
//         transform: leaving ? "translateX(110%)" : visible ? "translateX(0)" : "translateX(110%)",
//         opacity: leaving ? 0 : visible ? 1 : 0,
//       }}
//       className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
//     >
//       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />
//       <div className="px-4 py-3.5 flex items-start gap-3">
//         <div className="relative flex-shrink-0 mt-0.5">
//           <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
//             <ShoppingBag className="w-5 h-5 text-blue-600" />
//           </div>
//           <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//             <Bell className="w-2.5 h-2.5 text-white" />
//           </span>
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2 mb-0.5">
//             <p className="text-xs font-black text-slate-800 uppercase tracking-wide">🛒 Naya Order Aaya!</p>
//             <span className="text-[9px] text-slate-400 font-medium flex-shrink-0">{timeStr}</span>
//           </div>
//           <p className="text-[11px] font-bold text-slate-700 truncate">
//             {order.user?.name || order.userName || "Customer"}
//           </p>
//           {itemNames && (
//             <p className="text-[10px] text-slate-400 truncate mt-0.5">{itemNames}{moreItems}</p>
//           )}
//           <div className="flex items-center justify-between mt-2">
//             <span className="text-sm font-black text-blue-700">₹{getEffectiveTotal(order).toFixed(2)}</span>
//             <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
//               #{order._id.slice(-6).toUpperCase()}
//             </span>
//           </div>
//         </div>
//         <button onClick={handleDismiss}
//           className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all -mt-0.5 -mr-0.5">
//           <X size={11} />
//         </button>
//       </div>
//       <div className="h-0.5 bg-blue-50">
//         <div className="h-full bg-blue-400 rounded-full"
//           style={{ animation: `shrink ${12}s linear forwards`, animationDelay: `${index * 80}ms` }} />
//       </div>
//     </div>
//   );
// };

// const NewOrderAlerts = ({ alerts, onDismiss, onDismissAll }) => {
//   if (alerts.length === 0) return null;
//   return (
//     <>
//       <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
//       <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
//         {alerts.length >= 2 && (
//           <button onClick={onDismissAll}
//             className="pointer-events-auto mb-1 text-[10px] font-bold text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm transition-all">
//             Sab band karo ({alerts.length})
//           </button>
//         )}
//         {alerts.map((order, i) => (
//           <div key={order._id} className="pointer-events-auto">
//             <NewOrderToast order={order} onDismiss={onDismiss} index={i} />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// const SSEStatusBadge = ({ status }) => {
//   const cfg = {
//     connected:    { dot: "bg-green-500 animate-pulse", text: "text-green-700", label: "Live" },
//     connecting:   { dot: "bg-amber-400 animate-pulse", text: "text-amber-700", label: "Connecting..." },
//     disconnected: { dot: "bg-red-400",                 text: "text-red-600",   label: "Offline (polling)" },
//   }[status] || { dot: "bg-gray-400", text: "text-gray-500", label: "Unknown" };

//   return (
//     <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-100 shadow-sm ${cfg.text}`}>
//       <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
//       <span className="text-[10px] font-bold">{cfg.label}</span>
//     </div>
//   );
// };

// const CSVExportButton = ({ orders, filter }) => {
//   const [exporting, setExporting] = useState(false);
//   const handleExport = () => {
//     if (orders.length === 0) { alert("Export ke liye koi order nahi hai."); return; }
//     setExporting(true);
//     try {
//       const csv   = buildTallyCSV(orders);
//       const today = new Date().toISOString().slice(0, 10);
//       const label = filter !== "all" ? `_${filter}` : "";
//       downloadCSV(csv, `orders_tally${label}_${today}.csv`);
//     } catch (err) {
//       console.error("CSV export error:", err);
//       alert("CSV export fail ho gaya.");
//     } finally {
//       setExporting(false);
//     }
//   };

//   return (
//     <button onClick={handleExport} disabled={exporting || orders.length === 0}
//       className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all">
//       <Download className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
//       {exporting ? "Exporting..." : `Tally Export (${orders.length})`}
//     </button>
//   );
// };

// const PaymentSummary = ({ orders }) => {
//   const stats = useMemo(() => {
//     let received = 0, pending = 0, receivedCount = 0, pendingCount = 0, totalActive = 0;
//     orders.forEach((o) => {
//       const total = getEffectiveTotal(o);
//       const paid  = o.paidAmount || 0;
//       const ps    = getPaymentStatus(o);
//       if (ps !== "cancelled") {
//         received    += paid;
//         pending     += Math.max(0, total - paid);
//         totalActive += total;
//         if (paid > 0)     receivedCount++;
//         if (paid < total) pendingCount++;
//       }
//     });
//     const pct = totalActive > 0 ? Math.round((received / totalActive) * 100) : 0;
//     return { received, pending, receivedCount, pendingCount, pct, totalActive };
//   }, [orders]);

//   const fmtAmt = (n) =>
//     n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(2)}L`
//     : n >= 1_000  ? `₹${(n / 1_000).toFixed(1)}K`
//     : `₹${n.toFixed(0)}`;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
//       <div className="bg-white rounded-2xl border border-green-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-transparent pointer-events-none" />
//         <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
//           <CheckCircle className="w-5 h-5 text-green-600" />
//         </div>
//         <div className="z-10 min-w-0">
//           <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Payment Received</p>
//           <p className="text-xl font-black text-slate-800 leading-tight">{fmtAmt(stats.received)}</p>
//           <p className="text-[10px] text-slate-400 mt-0.5">{stats.receivedCount} orders</p>
//         </div>
//       </div>
//       <div className="bg-white rounded-2xl border border-amber-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 to-transparent pointer-events-none" />
//         <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 z-10">
//           <Hourglass className="w-5 h-5 text-amber-600" />
//         </div>
//         <div className="z-10 min-w-0">
//           <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Payment Pending</p>
//           <p className="text-xl font-black text-slate-800 leading-tight">{fmtAmt(stats.pending)}</p>
//           <p className="text-[10px] text-slate-400 mt-0.5">{stats.pendingCount} orders</p>
//         </div>
//       </div>
//       <div className="bg-white rounded-2xl border border-blue-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent pointer-events-none" />
//         <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
//           <TrendingUp className="w-5 h-5 text-blue-600" />
//         </div>
//         <div className="z-10 flex-1 min-w-0">
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Collection Rate</p>
//           <div className="flex items-end gap-2">
//             <p className="text-xl font-black text-slate-800 leading-tight">{stats.pct}%</p>
//             <p className="text-[10px] text-slate-400 mb-0.5">of {fmtAmt(stats.totalActive)}</p>
//           </div>
//           <div className="mt-1.5 h-1.5 bg-blue-100 rounded-full overflow-hidden">
//             <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${stats.pct}%` }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PaymentBadge = ({ order }) => {
//   const ps      = getPaymentStatus(order);
//   const paid    = order.paidAmount || 0;
//   const total   = getEffectiveTotal(order);
//   const pending = Math.max(0, total - paid);

//   if (ps === "cancelled")
//     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">— Cancelled</span>;

//   if (ps === "paid")
//     return (
//       <div className="flex flex-col gap-0.5">
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
//           <CheckCircle size={9} /> Paid
//         </span>
//         <span className="text-[9px] text-slate-400">₹{paid.toFixed(0)} received</span>
//       </div>
//     );

//   if (ps === "partial")
//     return (
//       <div className="flex flex-col gap-0.5">
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
//           <Wallet size={9} /> Partial
//         </span>
//         <span className="text-[9px] text-slate-400">₹{paid.toFixed(0)} / ₹{pending.toFixed(0)} left</span>
//       </div>
//     );

//   return (
//     <div className="flex flex-col gap-0.5">
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
//         <Hourglass size={9} /> Unpaid
//       </span>
//       <span className="text-[9px] text-slate-400">₹{total.toFixed(0)} pending</span>
//     </div>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// // ─── VENDOR DETAILS MODAL ─────────────────────────────────────────────────────
// const VENDOR_COLORS = [
//   { bg: "bg-purple-50", border: "border-purple-200", header: "bg-purple-100", text: "text-purple-700", badge: "bg-purple-600", dot: "bg-purple-400" },
//   { bg: "bg-blue-50",   border: "border-blue-200",   header: "bg-blue-100",   text: "text-blue-700",   badge: "bg-blue-600",   dot: "bg-blue-400"   },
//   { bg: "bg-teal-50",   border: "border-teal-200",   header: "bg-teal-100",   text: "text-teal-700",   badge: "bg-teal-600",   dot: "bg-teal-400"   },
//   { bg: "bg-rose-50",   border: "border-rose-200",   header: "bg-rose-100",   text: "text-rose-700",   badge: "bg-rose-600",   dot: "bg-rose-400"   },
//   { bg: "bg-amber-50",  border: "border-amber-200",  header: "bg-amber-100",  text: "text-amber-700",  badge: "bg-amber-600",  dot: "bg-amber-400"  },
// ];

// const VendorDetailsModal = ({ order, onClose }) => {
//   const vendors    = getAllVendorsFromItems(order.items || []);
//   const adminItems = getAdminItems(order.items || []);
//   const [activeTab, setActiveTab] = useState(vendors.length > 0 ? vendors[0]._id : "__admin__");

//   const allTabs = [
//     ...vendors.map((v, i) => ({ id: v._id, label: v.businessName || v.name || `Vendor ${i+1}`, type: "vendor", color: VENDOR_COLORS[i % VENDOR_COLORS.length], data: v })),
//     ...(adminItems.length > 0 ? [{ id: "__admin__", label: "Admin / Direct", type: "admin", color: VENDOR_COLORS[4], data: { products: adminItems.map(it => ({ name: it.name || it.product?.name || "—", quantity: it.quantity || 1, unitPrice: it.unitPrice || 0, image: it.image || it.product?.image || "", unit: it.unit || "pcs", mrp: it.mrp || 0, hsn: it.hsn || "", gstRate: it.gstRate ?? 0 })) } }] : []),
//   ];

//   const active = allTabs.find(t => t.id === activeTab) || allTabs[0];

//   const vendorTotal = (products) =>
//     products.reduce((s, p) => s + (p.unitPrice * p.quantity), 0);

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40">
//       <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
//         <div className="flex justify-between items-start p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
//                 <Users size={15} className="text-purple-600" />
//               </div>
//               <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Vendor Breakdown</h3>
//             </div>
//             <p className="text-[11px] text-gray-400 ml-10">
//               Order #{order._id.slice(-6).toUpperCase()} · {allTabs.length} source{allTabs.length !== 1 ? "s" : ""} · {order.items?.length || 0} items total
//             </p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-xl">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="flex gap-1.5 px-4 pt-3 pb-0 overflow-x-auto flex-shrink-0 border-b border-gray-100 bg-gray-50/50">
//           {allTabs.map((tab) => {
//             const isActive = tab.id === activeTab;
//             const tabTotal = vendorTotal(tab.data.products || []);
//             return (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//                 className={`flex-shrink-0 flex flex-col items-start px-3.5 py-2.5 rounded-t-xl border border-b-0 transition-all text-left ${
//                   isActive
//                     ? `bg-white border-gray-200 shadow-sm -mb-px z-10`
//                     : `bg-transparent border-transparent hover:bg-white/60 hover:border-gray-100`
//                 }`}>
//                 <div className="flex items-center gap-1.5 mb-0.5">
//                   <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? tab.color.dot : "bg-gray-300"}`} />
//                   <span className={`text-[11px] font-black uppercase tracking-wide truncate max-w-[120px] ${isActive ? tab.color.text : "text-gray-400"}`}>
//                     {tab.label}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 ml-3.5">
//                   <span className={`text-[10px] font-bold ${isActive ? "text-slate-700" : "text-gray-400"}`}>
//                     ₹{tabTotal.toFixed(0)}
//                   </span>
//                   <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? `${tab.color.bg} ${tab.color.text}` : "bg-gray-100 text-gray-400"}`}>
//                     {(tab.data.products || []).length} items
//                   </span>
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         {active && (
//           <div className="flex-1 overflow-y-auto">
//             {active.type === "vendor" && (
//               <div className={`px-5 py-3.5 flex items-center gap-4 border-b ${active.color.bg} ${active.color.border}`}>
//                 <div className={`w-10 h-10 rounded-xl ${active.color.header} flex items-center justify-center flex-shrink-0`}>
//                   <Store size={18} className={active.color.text} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className={`text-sm font-black ${active.color.text} truncate`}>
//                     {active.data.businessName || active.data.name || "—"}
//                   </div>
//                   <div className="flex flex-wrap items-center gap-3 mt-0.5">
//                     {active.data.phone && (
//                       <span className="text-[11px] text-slate-500 flex items-center gap-1">
//                         <Phone size={10} /> {active.data.phone}
//                       </span>
//                     )}
//                     {active.data.gstin && (
//                       <span className="text-[10px] font-mono text-slate-400">GSTIN: {active.data.gstin}</span>
//                     )}
//                     {active.data.email && (
//                       <span className="text-[11px] text-slate-400">{active.data.email}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vendor Total</div>
//                   <div className={`text-lg font-black ${active.color.text}`}>
//                     ₹{vendorTotal(active.data.products || []).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {active.type === "admin" && (
//               <div className="px-5 py-3.5 flex items-center gap-4 border-b bg-slate-50 border-slate-200">
//                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
//                   <Package size={18} className="text-slate-500" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-black text-slate-700">Admin / Direct Products</div>
//                   <div className="text-[11px] text-slate-400 mt-0.5">Products managed directly by admin</div>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</div>
//                   <div className="text-lg font-black text-slate-700">
//                     ₹{vendorTotal(active.data.products || []).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="p-4 space-y-2">
//               {(active.data.products || []).length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
//                   <Package className="w-10 h-10 text-slate-200" />
//                   <p className="text-sm">Koi product nahi</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-12 gap-2 px-3 pb-1 border-b border-gray-100">
//                     <div className="col-span-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</div>
//                     <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</div>
//                     <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rate</div>
//                     <div className="col-span-1 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">GST</div>
//                     <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</div>
//                   </div>

//                   {(active.data.products || []).map((prod, idx) => {
//                     const amount = (prod.unitPrice || 0) * (prod.quantity || 1);
//                     return (
//                       <div key={idx}
//                         className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-colors ${idx % 2 === 0 ? "bg-gray-50/80 border-gray-100" : "bg-white border-transparent"} hover:border-gray-200`}>
//                         <div className="col-span-5 flex items-center gap-2.5">
//                           <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
//                             {prod.image
//                               ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
//                               : <Package className="w-4 h-4 text-gray-300" />}
//                           </div>
//                           <div className="min-w-0">
//                             <div className="text-xs font-bold text-slate-700 leading-tight">{prod.name}</div>
//                             <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
//                               {prod.unit && (
//                                 <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{prod.unit}</span>
//                               )}
//                               {prod.hsn && (
//                                 <span className="text-[9px] text-slate-400 font-mono">HSN: {prod.hsn}</span>
//                               )}
//                               {prod.mrp > 0 && prod.mrp !== prod.unitPrice && (
//                                 <span className="text-[9px] text-slate-400 line-through">MRP ₹{prod.mrp}</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-span-2 text-center">
//                           <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${active.color.bg} ${active.color.text}`}>
//                             {prod.quantity}
//                           </span>
//                         </div>
//                         <div className="col-span-2 text-right">
//                           <div className="text-xs font-bold text-slate-700">₹{(prod.unitPrice || 0).toFixed(2)}</div>
//                         </div>
//                         <div className="col-span-1 text-center">
//                           {prod.gstRate > 0 ? (
//                             <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active.color.bg} ${active.color.text}`}>
//                               {prod.gstRate}%
//                             </span>
//                           ) : (
//                             <span className="text-[9px] text-slate-300">—</span>
//                           )}
//                         </div>
//                         <div className="col-span-2 text-right">
//                           <div className="text-sm font-black text-slate-800">₹{amount.toFixed(2)}</div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   <div className={`flex items-center justify-between p-3 rounded-xl border ${active.color.border} ${active.color.bg} mt-2`}>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-[10px] font-black uppercase tracking-widest ${active.color.text}`}>
//                         {active.type === "vendor" ? (active.data.businessName || active.data.name || "Vendor") : "Admin"} Subtotal
//                       </span>
//                       <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${active.color.badge} text-white`}>
//                         {(active.data.products || []).reduce((s, p) => s + (p.quantity || 1), 0)} qty
//                       </span>
//                     </div>
//                     <div className={`text-base font-black ${active.color.text}`}>
//                       ₹{vendorTotal(active.data.products || []).toFixed(2)}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="px-5 py-3.5 border-t border-gray-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-3 flex-wrap">
//             {allTabs.map((tab) => (
//               <div key={tab.id} className="flex items-center gap-1.5">
//                 <span className={`w-2 h-2 rounded-full ${tab.color.dot}`} />
//                 <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px]">{tab.label}</span>
//                 <span className={`text-[10px] font-black ${tab.color.text}`}>₹{vendorTotal(tab.data.products || []).toFixed(0)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="text-right flex-shrink-0 ml-4">
//             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grand Total</div>
//             <div className="text-lg font-black text-slate-800">₹{getEffectiveTotal(order).toFixed(2)}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── VENDOR CELL ──────────────────────────────────────────────────────────────
// const VendorCell = ({ order, onViewClick }) => {
//   const vendors    = getAllVendorsFromItems(order.items || []);
//   const adminItems = getAdminItems(order.items || []);

//   const hasVendors = vendors.length > 0;
//   const hasAdmin   = adminItems.length > 0;
//   const isMulti    = vendors.length > 1 || (hasVendors && hasAdmin);
//   const total      = vendors.length + (hasAdmin ? 1 : 0);

//   if (!hasVendors && !hasAdmin) {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
//         Admin
//       </span>
//     );
//   }

//   if (isMulti) {
//     return (
//       <button onClick={() => onViewClick(order)}
//         className="group flex flex-col gap-1 text-left">
//         <div className="flex items-center gap-1.5">
//           <div className="flex -space-x-1">
//             {[...vendors.slice(0, 2), ...(hasAdmin ? [{ _id: "__admin__", businessName: "Admin" }] : [])].slice(0, 3).map((v, i) => (
//               <div key={v._id} className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white ${VENDOR_COLORS[i % VENDOR_COLORS.length].badge}`}>
//                 {(v.businessName || v.name || "A").charAt(0).toUpperCase()}
//               </div>
//             ))}
//           </div>
//           <span className="text-[11px] font-black text-purple-700">{total} Sources</span>
//         </div>
//         <div className="flex items-center gap-1 ml-0.5">
//           <Eye size={9} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
//           <span className="text-[9px] text-purple-400 group-hover:text-purple-600 font-bold transition-colors">View breakdown</span>
//         </div>
//       </button>
//     );
//   }

//   if (hasVendors) {
//     const v = vendors[0];
//     return (
//       <button onClick={() => onViewClick(order)} className="group text-left min-w-[110px]">
//         <div className="flex items-center gap-1.5 mb-0.5">
//           <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
//             <Store size={10} className="text-purple-600" />
//           </div>
//           <div className="text-xs font-bold text-slate-700 truncate max-w-[100px] group-hover:text-purple-700 transition-colors">
//             {v.businessName || v.name || "—"}
//           </div>
//         </div>
//         {v.phone && (
//           <div className="text-[10px] text-slate-400 flex items-center gap-1 ml-6">
//             📞 {v.phone}
//           </div>
//         )}
//         <div className="flex items-center gap-1 ml-6 mt-0.5">
//           <Eye size={9} className="text-purple-300 group-hover:text-purple-500 transition-colors" />
//           <span className="text-[9px] text-purple-300 group-hover:text-purple-500 font-bold transition-colors">View products</span>
//         </div>
//       </button>
//     );
//   }

//   return (
//     <button onClick={() => onViewClick(order)} className="group text-left">
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 group-hover:border-gray-300 transition-colors">
//         Admin
//       </span>
//       <div className="flex items-center gap-1 mt-1">
//         <Eye size={9} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
//         <span className="text-[9px] text-gray-300 group-hover:text-gray-500 font-bold transition-colors">View items</span>
//       </div>
//     </button>
//   );
// };

// // ─── RIDER OPTION ─────────────────────────────────────────────────────────────
// const RiderOption = ({ rider, selected, onSelect }) => {
//   const statusColor = {
//     online:      "bg-green-100 text-green-700",
//     offline:     "bg-gray-100 text-gray-500",
//     on_delivery: "bg-amber-100 text-amber-700",
//   };
//   const vehicleIcon = { bike: "🏍️", scooter: "🛵", cycle: "🚲" };

//   return (
//     <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
//       <input type="radio" name="rider" value={rider._id} checked={selected} onChange={onSelect} className="accent-blue-600" />
//       <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
//         {vehicleIcon[rider.vehicleType] || "🏍️"}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm font-bold text-slate-800 truncate">{rider.name}</span>
//           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor[rider.status] || statusColor.offline}`}>
//             {rider.status === "on_delivery" ? "BUSY" : rider.status?.toUpperCase()}
//           </span>
//         </div>
//         <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-3">
//           <span>📞 {rider.phone}</span>
//           {rider.baseLocation && <span>📍 {rider.baseLocation}</span>}
//         </div>
//       </div>
//     </label>
//   );
// };

// // ─── ASSIGN RIDER MODAL ───────────────────────────────────────────────────────
// const AssignRiderModal = ({ order, riders, token, onClose, onAssigned }) => {
//   const currentRiderId = typeof order.assignedRider === "object"
//     ? order.assignedRider?._id
//     : order.assignedRider;

//   const [selectedRider, setSelectedRider] = useState(currentRiderId || "");
//   const [saving, setSaving]               = useState(false);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await axios.put(
//         `${ORDER_API}/${order._id}/assign-rider`,
//         { riderId: selectedRider || null },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         onAssigned(order._id, res.data.data.assignedRider);
//         onClose();
//       }
//     } catch {
//       alert("Rider assign fail ho gaya");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onlineRiders  = riders.filter((r) => r.status === "online");
//   const busyRiders    = riders.filter((r) => r.status === "on_delivery");
//   const offlineRiders = riders.filter((r) => r.status === "offline");

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
//           <div>
//             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Rider Assign Karo</h3>
//             <p className="text-[11px] text-gray-400 mt-0.5">Order #{order._id.slice(-6).toUpperCase()}</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
//         </div>
//         <div className="p-4 max-h-[420px] overflow-y-auto space-y-2">
//           <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedRider === "" ? "border-slate-700 bg-slate-50" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
//             <input type="radio" name="rider" value="" checked={selectedRider === ""} onChange={() => setSelectedRider("")} className="accent-slate-800" />
//             <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
//               <X size={14} className="text-gray-400" />
//             </div>
//             <div>
//               <div className="text-sm font-bold text-gray-600">Koi Rider Nahi (Unassign)</div>
//               <div className="text-[11px] text-gray-400">Rider hatao is order se</div>
//             </div>
//           </label>
//           {onlineRiders.length > 0 && (<>
//             <p className="text-[9px] font-black text-green-600 uppercase tracking-widest px-1 pt-2">Online ({onlineRiders.length})</p>
//             {onlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//           </>)}
//           {busyRiders.length > 0 && (<>
//             <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-1 pt-2">On Delivery ({busyRiders.length})</p>
//             {busyRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//           </>)}
//           {offlineRiders.length > 0 && (<>
//             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1 pt-2">Offline ({offlineRiders.length})</p>
//             {offlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//           </>)}
//           {riders.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">Koi rider registered nahi hai</div>}
//         </div>
//         <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
//           <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60">
//             {saving ? "Saving..." : "Confirm Assignment"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── EDIT ORDER MODAL ─────────────────────────────────────────────────────────
// const EditOrderModal = ({ order, token, onClose, onUpdated }) => {
//   const buildInitial = () => {
//     if (order.items && order.items.length > 0) {
//       return order.items.map((it) => {
//         const product = it.product && typeof it.product === "object" && it.product.name ? it.product : {};
//         return {
//           productId:    product._id  || it.product || "",
//           name:         product.name || it.name    || "—",
//           image:        product.image || it.image  || "",
//           unitPrice:    it.unitPrice || product.salePrice || 0,
//           quantity:     it.quantity  || 1,
//           ownerType:    it.ownerType    || "admin",
//           productModel: it.productModel || "Price",
//         };
//       });
//     }
//     return [];
//   };

//   const [cartItems, setCartItems]               = useState(buildInitial);
//   const [allProducts, setAllProducts]           = useState([]);
//   const [loadingProducts, setLoadingProducts]   = useState(false);
//   const [productSearch, setProductSearch]       = useState("");
//   const [saving, setSaving]                     = useState(false);
//   const [error, setError]                       = useState("");
//   const [showProductPanel, setShowProductPanel] = useState(false);
//   const token2 = localStorage.getItem("token");

//   useEffect(() => {
//     const load = async () => {
//       setLoadingProducts(true);
//       try {
//         const res = await axios.get(PRODUCT_API, { headers: { Authorization: `Bearer ${token2}` } });
//         setAllProducts(flattenProducts(res.data?.data || res.data || []));
//       } catch {
//         console.error("Products load nahi hue");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     load();
//   }, []);

//   const filteredProducts = useMemo(() => {
//     if (!productSearch.trim()) return allProducts.slice(0, 30);
//     const q = productSearch.toLowerCase();
//     return allProducts.filter((p) =>
//       p.name?.toLowerCase().includes(q) ||
//       p.brand?.toLowerCase().includes(q) ||
//       p.category?.toLowerCase().includes(q)
//     );
//   }, [productSearch, allProducts]);

//   const total = cartItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

//   const addProduct = (product) => {
//     setError("");
//     const existsIdx = cartItems.findIndex((it) => it.productId === product._id);
//     if (existsIdx !== -1) {
//       setCartItems((prev) => prev.map((it, i) => (i === existsIdx ? { ...it, quantity: it.quantity + 1 } : it)));
//     } else {
//       setCartItems((prev) => [...prev, {
//         productId:    product._id,
//         name:         product.name,
//         image:        product.image || "",
//         unitPrice:    product.salePrice,
//         quantity:     1,
//         ownerType:    product.ownerType    || "admin",
//         productModel: product.productModel || "Price",
//       }]);
//     }
//   };

//   const removeItem = (idx) => {
//     if (cartItems.length === 1) { setError("Order mein kam se kam ek item hona chahiye."); return; }
//     setError("");
//     setCartItems((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const changeQty = (idx, delta) => {
//     setCartItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)));
//   };

//   const handleSave = async () => {
//     setError("");
//     if (cartItems.length === 0) { setError("Order mein kam se kam ek item hona chahiye."); return; }
//     setSaving(true);
//     try {
//       const res = await axios.put(
//         `${ORDER_API}/${order._id}/items`,
//         { items: cartItems.map((it) => ({ productId: it.productId, quantity: it.quantity, type: it.ownerType || "admin" })) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) { onUpdated(res.data.data); onClose(); }
//       else setError(res.data.message || "Update fail ho gaya.");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Order update fail ho gaya.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
//       <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//         <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
//           <div>
//             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Order Edit Karo</h3>
//             <p className="text-[11px] text-gray-400 mt-0.5">#{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName}</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
//         </div>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="flex flex-col flex-1 border-r border-gray-100">
//             <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
//               <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Cart ({cartItems.length} items)</span>
//               <button onClick={() => setShowProductPanel((v) => !v)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95">
//                 <Plus size={11} /> Product Add Karo
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-3 space-y-2">
//               {cartItems.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-40 gap-2">
//                   <ShoppingBag className="w-10 h-10 text-gray-200" />
//                   <p className="text-sm text-gray-400">Cart empty hai</p>
//                 </div>
//               ) : (
//                 cartItems.map((it, idx) => (
//                   <div key={`${it.productId}-${idx}`} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
//                     <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                       {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-4 h-4 text-gray-300" />}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-xs font-bold text-slate-700 truncate">{it.name}</div>
//                       <div className="text-[10px] text-slate-400 mt-0.5">
//                         ₹{it.unitPrice} x {it.quantity} = <span className="font-bold text-slate-600">₹{(it.unitPrice * it.quantity).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <button onClick={() => changeQty(idx, -1)} disabled={it.quantity <= 1}
//                         className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all">
//                         <Minus size={10} />
//                       </button>
//                       <span className="w-7 text-center text-xs font-bold text-slate-800">{it.quantity}</span>
//                       <button onClick={() => changeQty(idx, 1)}
//                         className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all">
//                         <Plus size={10} />
//                       </button>
//                     </div>
//                     <button onClick={() => removeItem(idx)} className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//           {showProductPanel && (
//             <div className="w-64 flex flex-col flex-shrink-0 bg-gray-50">
//               <div className="p-3 border-b border-gray-100 flex-shrink-0">
//                 <div className="relative">
//                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                   <input type="text" placeholder="Product search karo..." value={productSearch}
//                     onChange={(e) => setProductSearch(e.target.value)} autoFocus
//                     className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                 </div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {loadingProducts ? (
//                   <div className="flex items-center justify-center h-32">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
//                   </div>
//                 ) : filteredProducts.length === 0 ? (
//                   <div className="text-center py-8 text-xs text-gray-400">Koi product nahi mila</div>
//                 ) : (
//                   filteredProducts.map((p) => {
//                     const inCart = cartItems.find((c) => c.productId === p._id);
//                     return (
//                       <button key={p._id} onClick={() => addProduct(p)}
//                         className="w-full flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left">
//                         <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                           {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-4 h-4 text-gray-300" />}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-[11px] font-bold text-slate-700 truncate">{p.name}</div>
//                           <div className="text-[10px] text-slate-400">{p.brand} · ₹{p.salePrice}</div>
//                         </div>
//                         {inCart
//                           ? <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">+{inCart.quantity}</span>
//                           : <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">ADD</span>}
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//         {error && (
//           <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex-shrink-0">
//             <X size={11} className="flex-shrink-0" /> {error}
//           </div>
//         )}
//         <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100 flex justify-between items-center flex-shrink-0">
//           <div>
//             <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Naya Total</div>
//             <div className="text-[10px] text-blue-400 mt-0.5">{cartItems.reduce((s, it) => s + it.quantity, 0)} qty · {cartItems.length} products</div>
//           </div>
//           <div className="text-2xl font-black text-blue-700">₹{total.toFixed(2)}</div>
//         </div>
//         <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100 flex-shrink-0">
//           <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
//           <button onClick={handleSave} disabled={saving || cartItems.length === 0}
//             className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
//             {saving ? "Saving..." : `Save Changes (${cartItems.length} items · ₹${total.toFixed(2)})`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── PAYMENT UPDATE MODAL ─────────────────────────────────────────────────────
// const PaymentUpdateModal = ({ order, token, onClose, onUpdated }) => {
//   const total = getEffectiveTotal(order);
//   const [paidAmount, setPaidAmount]   = useState(order.paidAmount ?? 0);
//   const [paymentNote, setPaymentNote] = useState(order.paymentNote || "");
//   const [saving, setSaving]           = useState(false);
//   const [error, setError]             = useState("");

//   const safePaid = Math.min(Math.max(0, Number(paidAmount) || 0), total);
//   const pending  = Math.max(0, total - safePaid);
//   const pct      = total > 0 ? Math.round((safePaid / total) * 100) : 0;

//   const computedStatus = safePaid <= 0 ? "unpaid" : safePaid >= total ? "paid" : "partial";
//   const statusCfg = {
//     unpaid:  { label: "Unpaid",  cls: "bg-amber-100 text-amber-700 border-amber-200" },
//     partial: { label: "Partial", cls: "bg-blue-100 text-blue-700 border-blue-200"   },
//     paid:    { label: "Paid",    cls: "bg-green-100 text-green-700 border-green-200" },
//   }[computedStatus];

//   const handleSave = async () => {
//     setSaving(true);
//     setError("");
//     try {
//       const res = await axios.put(
//         `${ORDER_API}/${order._id}/payment`,
//         { paidAmount: safePaid, paymentNote },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) { onUpdated(order._id, res.data.data); onClose(); }
//       else setError(res.data.message || "Update fail ho gaya.");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Payment update fail ho gaya.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const quickAmounts = [
//     { label: "₹0 (Clear)", value: 0 },
//     { label: "25%",         value: Math.round(total * 0.25) },
//     { label: "50%",         value: Math.round(total * 0.5)  },
//     { label: `Full ₹${total.toFixed(0)}`, value: total },
//   ];

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
//       <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
//           <div>
//             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Payment Update</h3>
//             <p className="text-[11px] text-gray-400 mt-0.5">#{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName || "—"}</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
//         </div>
//         <div className="p-4 space-y-4">
//           {order.couponCode && (
//             <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
//               <Tag size={13} className="text-green-600 flex-shrink-0" />
//               <div className="text-[11px] text-green-700 font-semibold flex-1">
//                 Coupon <span className="font-black">{order.couponCode}</span> applied — ₹{(order.couponDiscount || 0).toFixed(2)} off
//               </div>
//             </div>
//           )}
//           <div className="grid grid-cols-2 gap-3">
//             {order.couponCode && (
//               <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
//                 <p className="text-[10px] text-slate-400 mb-1">Original Total</p>
//                 <p className="text-sm font-bold text-slate-500 line-through">₹{(order.totalPrice || 0).toFixed(2)}</p>
//               </div>
//             )}
//             <div className={`bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5 ${!order.couponCode ? "col-span-1" : ""}`}>
//               <p className="text-[10px] text-slate-400 mb-1">{order.couponCode ? "Final Amount" : "Order Total"}</p>
//               <p className="text-base font-black text-slate-800">₹{total.toFixed(2)}</p>
//             </div>
//             <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
//               <p className="text-[10px] text-slate-400 mb-1">Payment Status</p>
//               <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.cls}`}>{statusCfg.label}</span>
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs font-bold text-slate-600 mb-1.5">Kitna payment mila? (₹)</label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
//               <input type="number" min="0" max={total} step="1" value={paidAmount}
//                 onChange={(e) => setPaidAmount(Math.min(Math.max(0, Number(e.target.value) || 0), total))}
//                 className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
//                 placeholder="0" />
//             </div>
//             <div className="flex flex-wrap gap-1.5 mt-2">
//               {quickAmounts.map((q) => (
//                 <button key={q.label} onClick={() => setPaidAmount(q.value)}
//                   className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${safePaid === q.value ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-slate-600 border-gray-200 hover:border-green-400 hover:text-green-700"}`}>
//                   {q.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-semibold">
//               <span className="text-green-600">Paid: ₹{safePaid.toFixed(2)} ({pct}%)</span>
//               <span className="text-amber-600">Pending: ₹{pending.toFixed(2)}</span>
//             </div>
//             <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
//               <div className="h-full rounded-full transition-all duration-300"
//                 style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#16a34a" : pct > 0 ? "#2563eb" : "#d1d5db" }} />
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs font-bold text-slate-600 mb-1.5">
//               Payment Note <span className="text-slate-400 font-normal">(optional)</span>
//             </label>
//             <textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={2}
//               placeholder="e.g. UPI ref: 9876543210, Cash collected by rider..."
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none" />
//           </div>
//           {error && (
//             <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
//               <X size={11} className="flex-shrink-0" /> {error}
//             </div>
//           )}
//         </div>
//         <div className="px-4 py-3 bg-gray-50 flex gap-3 border-t border-gray-100">
//           <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex-[2] py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
//             {saving ? "Saving..." : `Save — ₹${safePaid.toFixed(2)} (${pct}%)`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// export default function AdminOrders() {
//   const [orders, setOrders]                     = useState([]);
//   const [riders, setRiders]                     = useState([]);
//   const [loading, setLoading]                   = useState(true);
//   const [filter, setFilter]                     = useState("all");
//   const [search, setSearch]                     = useState("");
//   const [updating, setUpdating]                 = useState(null);
//   const [assignModal, setAssignModal]           = useState(null);
//   const [editModalId, setEditModalId]           = useState(null);
//   const [paymentModalId, setPaymentModalId]     = useState(null);
//   const [vendorViewOrder, setVendorViewOrder]   = useState(null);

//   const [newOrderAlerts, setNewOrderAlerts]     = useState([]);
//   const [sseStatus, setSseStatus]               = useState("connecting");

//   // ── TOP SCROLLBAR MIRROR REFS ──────────────────────────────────────────────
//   const tableScrollRef = useRef(null);
//   const topScrollRef   = useRef(null);
//   // Sync: top bar → table
//   const handleTopScroll = useCallback(() => {
//     if (tableScrollRef.current && topScrollRef.current) {
//       tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
//     }
//   }, []);
//   // Sync: table → top bar
//   const handleTableScroll = useCallback(() => {
//     if (topScrollRef.current && tableScrollRef.current) {
//       topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
//     }
//   }, []);

//   const knownOrderIds = useRef(null);
//   const isInitialized = useRef(false);
//   const tokenRef      = useRef(localStorage.getItem("token"));
//   const sseRef        = useRef(null);
//   const fallbackRef   = useRef(null);

//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

//   useEffect(() => { tokenRef.current = token; }, [token]);

//   const dismissAlert     = useCallback((orderId) => { setNewOrderAlerts((prev) => prev.filter((o) => o._id !== orderId)); }, []);
//   const dismissAllAlerts = useCallback(() => { setNewOrderAlerts([]); }, []);

//   const handleNewOrders = useCallback((brandNew) => {
//     if (!brandNew.length) return;
//     setNewOrderAlerts((prev) => [...brandNew, ...prev].slice(0, 5));
//     playAlertSound();
//     if ("Notification" in window && Notification.permission === "granted") {
//       brandNew.forEach((o) => {
//         try {
//           new Notification("🛒 Naya Order Aaya!", {
//             body: `${o.user?.name || o.userName || "Customer"} — ₹${getEffectiveTotal(o).toFixed(2)}`,
//             icon: "/favicon.ico",
//             tag:  o._id,
//           });
//         } catch {}
//       });
//     }
//   }, []);

//   const fetchInitialOrders = useCallback(async () => {
//     try {
//       const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
//       if (!res.data.success) return;
//       const fetched = res.data.data;
//       knownOrderIds.current = new Set(fetched.map((o) => o._id));
//       isInitialized.current = true;
//       setOrders(fetched);
//     } catch (err) {
//       console.error("[Orders] Initial fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const startFallbackPolling = useCallback(() => {
//     if (fallbackRef.current) return;
//     console.warn("[SSE] Falling back to polling");
//     setSseStatus("disconnected");
//     fallbackRef.current = setInterval(async () => {
//       try {
//         const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
//         if (!res.data.success) return;
//         const fetched = res.data.data;
//         if (!isInitialized.current) {
//           knownOrderIds.current = new Set(fetched.map((o) => o._id));
//           isInitialized.current = true;
//           setOrders(fetched);
//           return;
//         }
//         const brandNew = fetched.filter((o) => !knownOrderIds.current.has(o._id));
//         fetched.forEach((o) => knownOrderIds.current.add(o._id));
//         setOrders(fetched);
//         handleNewOrders(brandNew);
//       } catch (err) {
//         console.error("[Fallback Poll] Error:", err);
//       }
//     }, FALLBACK_POLL_INTERVAL);
//   }, [handleNewOrders]);

//   const connectSSE = useCallback(() => {
//     const url = `${ORDER_API}/sse?token=${encodeURIComponent(tokenRef.current || "")}`;
//     const es = new EventSource(url);
//     sseRef.current = es;

//     es.onopen = () => {
//       setSseStatus("connected");
//       if (fallbackRef.current) { clearInterval(fallbackRef.current); fallbackRef.current = null; }
//     };

//     es.onmessage = (e) => {
//       try {
//         const payload = JSON.parse(e.data);
//         if (payload.type === "CONNECTED") return;
//         if (payload.type === "NEW_ORDER") {
//           const order = payload.order;
//           if (!order?._id) return;
//           if (knownOrderIds.current?.has(order._id)) return;
//           knownOrderIds.current?.add(order._id);
//           setOrders((prev) => [order, ...prev]);
//           handleNewOrders([order]);
//         }
//       } catch (err) {
//         console.error("[SSE] Parse error:", err);
//       }
//     };

//     es.onerror = (err) => {
//       console.error("[SSE] Error / disconnected", err);
//       es.close();
//       setSseStatus("disconnected");
//       startFallbackPolling();
//     };
//   }, [handleNewOrders, startFallbackPolling]);

//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
//     fetchInitialOrders();
//     setSseStatus("connecting");
//     connectSSE();
//     axios.get(RIDER_API).then((res) => setRiders(res.data.data || [])).catch(() => {});
//     return () => {
//       if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
//       if (fallbackRef.current) { clearInterval(fallbackRef.current); fallbackRef.current = null; }
//     };
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.data.success) {
//         setOrders(res.data.data);
//         knownOrderIds.current = new Set(res.data.data.map((o) => o._id));
//         isInitialized.current = true;
//       }
//     } catch (err) {
//       console.error("fetchOrders error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     setUpdating(id);
//     try {
//       await axios.put(`${ORDER_API}/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
//       setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
//     } catch {
//       alert("Status update failed");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleRiderAssigned = (orderId, rider) => {
//     setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, assignedRider: rider } : o)));
//   };

//   const handleOrderUpdated = (updated) => {
//     setOrders((prev) =>
//       prev.map((o) => {
//         if (o._id !== updated._id) return o;
//         return { ...o, ...updated, originalItems: o.originalItems ?? updated.originalItems, originalTotalPrice: o.originalTotalPrice ?? updated.originalTotalPrice };
//       })
//     );
//   };

//   const handlePaymentUpdated = (orderId, paymentData) => {
//     setOrders((prev) =>
//       prev.map((o) =>
//         o._id === orderId
//           ? { ...o, paidAmount: paymentData.paidAmount, paymentStatus: paymentData.paymentStatus, paymentNote: paymentData.paymentNote }
//           : o
//       )
//     );
//   };

//   const filtered = orders.filter((o) => {
//     const matchFilter = filter === "all" || o.status === filter;
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       (o.user?.name || o.userName || "").toLowerCase().includes(q) ||
//       o._id.toLowerCase().includes(q) ||
//       (o.address?.city || "").toLowerCase().includes(q) ||
//       (o.couponCode || "").toLowerCase().includes(q) ||
//       (o.items || []).some((it) => {
//         const name = it.product && typeof it.product === "object" && it.product.name ? it.product.name : it.name || "";
//         return name.toLowerCase().includes(q);
//       });
//     return matchFilter && matchSearch;
//   });

//   const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
//     acc[s] = orders.filter((o) => o.status === s).length;
//     return acc;
//   }, {});

//   const editModalOrder    = editModalId    ? orders.find((o) => o._id === editModalId)    || null : null;
//   const paymentModalOrder = paymentModalId ? orders.find((o) => o._id === paymentModalId) || null : null;

//   return (
//     <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen">

//       <NewOrderAlerts alerts={newOrderAlerts} onDismiss={dismissAlert} onDismissAll={dismissAllAlerts} />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Order Management</h2>
//           <p className="text-xs text-slate-400 mt-0.5">{orders.length} total orders · {riders.length} riders</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <SSEStatusBadge status={sseStatus} />
//           <CSVExportButton orders={filtered} filter={filter} />
//           <button onClick={fetchOrders}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 shadow-sm transition-colors">
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* Payment Summary */}
//       <PaymentSummary orders={orders} />

//       {/* Status Filter Pills */}
//       <div className="flex flex-wrap gap-2 mb-5">
//         <button onClick={() => setFilter("all")}
//           className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
//           All · {orders.length}
//         </button>
//         {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
//           <button key={key} onClick={() => setFilter(key)}
//             className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === key ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
//             {cfg.label} · {counts[key] || 0}
//           </button>
//         ))}
//       </div>

//       {/* Search + Filter */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input type="text" placeholder="Search by name, product, order ID, city, coupon..."
//               value={search} onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all" />
//           </div>
//           <div className="relative w-full sm:w-48">
//             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <select value={filter} onChange={(e) => setFilter(e.target.value)}
//               className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
//               <option value="all">All Orders</option>
//               <option value="placed">Placed</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
//           <div>
//             <h3 className="font-bold text-slate-800">All Orders</h3>
//             <p className="text-xs text-slate-400 mt-0.5">Showing {filtered.length} of {orders.length} orders</p>
//           </div>
//           {filter !== "all" && filtered.length > 0 && (
//             <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
//               <Download size={11} />
//               CSV sirf <span className="font-black capitalize">{filter}</span> orders export karega ({filtered.length})
//             </div>
//           )}
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-64 gap-3 text-blue-600">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
//             <p className="font-medium animate-pulse text-sm">Fetching orders...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-64 gap-2">
//             <ShoppingBag className="w-12 h-12 text-gray-200" />
//             <p className="font-medium text-gray-400">No orders found</p>
//           </div>
//         ) : (
//           <>
//             {/* ── TOP MIRROR SCROLLBAR ── renders just above the table headers */}
//             <div
//               ref={topScrollRef}
//               onScroll={handleTopScroll}
//               style={{ overflowX: "auto", overflowY: "hidden", height: "10px" }}
//               className="border-b border-gray-100"
//             >
//               {/* phantom div same width as the table so the scrollbar appears */}
//               <div style={{ width: "1900px", height: "1px" }} />
//             </div>

//             {/* ── ACTUAL TABLE ── */}
//             <div
//               ref={tableScrollRef}
//               onScroll={handleTableScroll}
//               className="overflow-x-auto"
//             >
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     {[
//                       "Order", "Customer", "Items", "Vendors",
//                       "Price / Coupon", "Payment", "Address", "Status",
//                       "Update Status", "Rider", "Edit", "Payment", "Estimate", "Invoice",
//                     ].map((h) => (
//                       <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filtered.map((o) => {
//                     const itemCount      = o.items?.length || 0;
//                     const firstItem      = o.items?.[0];
//                     const firstProduct   = firstItem?.product && typeof firstItem.product === "object" && firstItem.product.name ? firstItem.product : {};
//                     const effectiveTotal = getEffectiveTotal(o);
//                     const hasCoupon      = !!o.couponCode;

//                     return (
//                       <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">

//                         {/* Order ID */}
//                         <td className="py-3.5 px-4">
//                           <span className="font-mono text-xs font-bold text-slate-500 bg-gray-100 px-2 py-1 rounded-lg">
//                             #{o._id.slice(-6).toUpperCase()}
//                           </span>
//                         </td>

//                         {/* Customer */}
//                         <td className="py-3.5 px-4">
//                           <div className="flex items-center gap-2.5">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
//                               <User className="w-4 h-4 text-blue-500" />
//                             </div>
//                             <div className="min-w-0">
//                               <div className="font-semibold text-slate-800 text-sm truncate max-w-[110px]">
//                                 {o.user?.name || o.userName || "—"}
//                               </div>
//                               {o.address?.phone && (
//                                 <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
//                                   <Phone className="w-3 h-3" /> {o.address.phone}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Items */}
//                         <td className="py-3.5 px-4">
//                           <div className="flex items-center gap-2 min-w-[130px]">
//                             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                               {firstProduct.image || firstItem?.image
//                                 ? <img src={firstProduct.image || firstItem?.image} alt="" className="w-full h-full object-cover rounded-lg" />
//                                 : <Package className="w-4 h-4 text-blue-400" />}
//                             </div>
//                             <div className="min-w-0">
//                               <div className="font-medium text-slate-700 text-xs truncate max-w-[110px]">
//                                 {itemCount > 1
//                                   ? `${firstProduct.name || firstItem?.name || "—"} +${itemCount - 1} more`
//                                   : firstProduct.name || firstItem?.name || "—"}
//                               </div>
//                               <div className="text-[10px] text-slate-400 mt-0.5">
//                                 {itemCount} product{itemCount !== 1 ? "s" : ""} · {o.items?.reduce((s, it) => s + it.quantity, 0) || 0} qty
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Vendors */}
//                         <td className="py-3.5 px-4">
//                           <VendorCell order={o} onViewClick={setVendorViewOrder} />
//                         </td>

//                         {/* Price / Coupon */}
//                         <td className="py-3.5 px-4 min-w-[130px]">
//                           {hasCoupon ? (
//                             <div>
//                               <div className="flex items-center gap-1.5">
//                                 <span className="text-xs text-slate-400 line-through">₹{(o.totalPrice || 0).toFixed(2)}</span>
//                                 <span className="font-bold text-slate-800 text-sm">₹{effectiveTotal.toFixed(2)}</span>
//                               </div>
//                               <div className="flex items-center gap-1 mt-0.5">
//                                 <Tag size={9} className="text-green-600 flex-shrink-0" />
//                                 <span className="text-[10px] text-green-700 font-bold">{o.couponCode}</span>
//                                 <span className="text-[10px] text-green-600">−₹{(o.couponDiscount || 0).toFixed(0)}</span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div>
//                               <div className="font-bold text-slate-800">₹{effectiveTotal.toFixed(2)}</div>
//                               {o.paidAmount > 0 && o.paidAmount < effectiveTotal && (
//                                 <div className="text-[9px] text-amber-600 mt-0.5">
//                                   ₹{Math.max(0, effectiveTotal - o.paidAmount).toFixed(2)} left
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </td>

//                         {/* Payment Badge */}
//                         <td className="py-3.5 px-4"><PaymentBadge order={o} /></td>

//                         {/* Address */}
//                         <td className="py-3.5 px-4">
//                           <div className="flex items-start gap-1.5 max-w-[160px]">
//                             <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
//                             <div className="text-xs text-slate-600 leading-relaxed">
//                               {o.address ? (
//                                 <>
//                                   <div className="font-semibold text-slate-700">{o.address.name}</div>
//                                   <div className="text-slate-500 truncate">{[o.address.street, o.address.city].filter(Boolean).join(", ")}</div>
//                                   <div className="text-slate-400">{[o.address.state, o.address.pincode].filter(Boolean).join(" - ")}</div>
//                                 </>
//                               ) : <span className="text-slate-400 italic">No address</span>}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Status Badge */}
//                         <td className="py-3.5 px-4"><StatusBadge status={o.status} /></td>

//                         {/* Update Status */}
//                         <td className="py-3.5 px-4">
//                           <div className="relative">
//                             <Clock className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none z-10 ${updating === o._id ? "text-blue-500 animate-pulse" : "text-gray-400"}`} />
//                             <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} disabled={updating === o._id}
//                               className="w-36 appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer disabled:opacity-60">
//                               <option value="placed">Placed</option>
//                               <option value="confirmed">Confirmed</option>
//                               <option value="shipped">Shipped</option>
//                               <option value="delivered">Delivered</option>
//                               <option value="cancelled">Cancelled</option>
//                             </select>
//                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                           </div>
//                         </td>

//                         {/* Rider */}
//                         <td className="py-3.5 px-4">
//                           {o.assignedRider ? (
//                             <div className="flex flex-col gap-1 min-w-[90px]">
//                               <div className="flex items-center gap-1.5">
//                                 <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//                                   <UserCheck size={12} className="text-green-600" />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <div className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{o.assignedRider?.name || "Assigned"}</div>
//                                   {o.assignedRider?.phone && <div className="text-[10px] text-gray-400">{o.assignedRider.phone}</div>}
//                                 </div>
//                               </div>
//                               <button onClick={() => setAssignModal(o)} className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold text-left">Change</button>
//                             </div>
//                           ) : (
//                             <button onClick={() => setAssignModal(o)}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-600 transition-all active:scale-95 whitespace-nowrap">
//                               <Bike size={12} /> Assign
//                             </button>
//                           )}
//                         </td>

//                         {/* Edit */}
//                         <td className="py-3.5 px-4">
//                           <button onClick={() => setEditModalId(o._id)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-[11px] font-bold text-violet-600 transition-all active:scale-95">
//                             <Pencil size={12} /> Edit
//                           </button>
//                         </td>

//                         {/* Payment Button */}
//                         <td className="py-3.5 px-4">
//                           <button onClick={() => setPaymentModalId(o._id)}
//                             className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[11px] font-bold transition-all active:scale-95 whitespace-nowrap ${
//                               getPaymentStatus(o) === "paid"
//                                 ? "bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
//                                 : getPaymentStatus(o) === "partial"
//                                 ? "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
//                                 : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
//                             }`}>
//                             <Wallet size={12} />
//                             {getPaymentStatus(o) === "paid"
//                               ? "Paid"
//                               : getPaymentStatus(o) === "partial"
//                               ? `₹${(o.paidAmount || 0).toFixed(0)} paid`
//                               : "Pay"}
//                           </button>
//                         </td>

//                         {/* Estimate */}
//                         <td className="py-3.5 px-4">
//                           <button
//                             onClick={() => navigate("/admin/estimate", { state: { order: buildInvoiceOrder(o, true) } })}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap">
//                             <ClipboardList size={12} /> Estimate
//                           </button>
//                         </td>

//                         {/* Invoice */}
//                         <td className="py-3.5 px-4">
//                           <button
//                             onClick={() => navigate("/invoice", { state: { order: buildInvoiceOrder(o, false) } })}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap">
//                             <FileText size={12} /> Invoice
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {!loading && filtered.length > 0 && (
//           <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
//             <p className="text-xs text-gray-400">
//               Showing <span className="font-semibold text-gray-600">{filtered.length}</span> orders
//               {filter !== "all" && <> · filtered by <span className="font-semibold text-gray-600 capitalize">{filter}</span></>}
//             </p>
//             <CSVExportButton orders={filtered} filter={filter} />
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {assignModal && (
//         <AssignRiderModal order={assignModal} riders={riders} token={token}
//           onClose={() => setAssignModal(null)} onAssigned={handleRiderAssigned} />
//       )}
//       {editModalOrder && (
//         <EditOrderModal order={editModalOrder} token={token}
//           onClose={() => setEditModalId(null)} onUpdated={handleOrderUpdated} />
//       )}
//       {paymentModalOrder && (
//         <PaymentUpdateModal order={paymentModalOrder} token={token}
//           onClose={() => setPaymentModalId(null)} onUpdated={handlePaymentUpdated} />
//       )}
//       {vendorViewOrder && (
//         <VendorDetailsModal order={vendorViewOrder} onClose={() => setVendorViewOrder(null)} />
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Package, User, Phone, MapPin, Filter, Clock,
  ChevronDown, Search, RefreshCw, ShoppingBag,
  Bike, UserCheck, X, FileText, Pencil, Plus, Minus, ClipboardList,
  Download, CheckCircle, Hourglass, TrendingUp, Wallet, Tag, Bell,
  Store, Eye, Users,
} from "lucide-react";

const ORDER_API   = "https://grocerrybackend.onrender.com/api/orders";
const RIDER_API   = "https://grocerrybackend.onrender.com/api/riders";
const PRODUCT_API = "https://grocerrybackend.onrender.com/api/categories/with-products";

const FALLBACK_POLL_INTERVAL = 30_000;

const STATUS_CONFIG = {
  placed:    { label: "Placed",    bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100",  text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500"  },
  shipped:   { label: "Shipped",   bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
  delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", bg: "bg-red-100",   text: "text-red-600",   border: "border-red-200",   dot: "bg-red-500"   },
};

const getEffectiveTotal = (order) =>
  order.finalPrice != null ? order.finalPrice : (order.totalPrice || 0);

const getPaymentStatus = (order) => {
  if (order.status === "cancelled") return "cancelled";
  if (order.paymentStatus) return order.paymentStatus;
  const paid  = order.paidAmount || 0;
  const total = getEffectiveTotal(order);
  if (paid <= 0)     return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
};

const getAllVendorsFromItems = (items = []) => {
  const vendorMap = new Map();
  items.forEach((it) => {
    if (it.ownerType === "vendor" && it.vendorId && typeof it.vendorId === "object") {
      const v = it.vendorId;
      const id = v._id?.toString();
      if (!id) return;
      if (!vendorMap.has(id)) {
        vendorMap.set(id, {
          _id:          id,
          name:         v.name         || "",
          businessName: v.businessName || v.name || "",
          phone:        v.phone        || "",
          gstin:        v.gstin        || "",
          email:        v.email        || "",
          products:     [],
        });
      }
      vendorMap.get(id).products.push({
        name:      it.name      || "—",
        quantity:  it.quantity  || 1,
        unitPrice: it.unitPrice || 0,
        image:     it.image     || it.product?.image || "",
        unit:      it.unit      || "pcs",
        mrp:       it.mrp       || 0,
        hsn:       it.hsn       || "",
        gstRate:   it.gstRate   ?? 0,
      });
    }
  });
  return Array.from(vendorMap.values());
};

const getAdminItems = (items = []) =>
  items.filter((it) => it.ownerType !== "vendor");

const flattenProducts = (categories = []) => {
  const products = [];
  categories.forEach((cat) => {
    cat.subcategories?.forEach((sub) => {
      sub.subSubcategories?.forEach((ssub) => {
        ssub.products?.forEach((p) => {
          products.push({
            _id:          p._id,
            name:         p.name,
            brand:        p.brand,
            image:        p.image,
            salePrice:    p.salePrice,
            mrp:          p.mrp,
            hsn:          p.hsn,
            gstRate:      p.gstRate,
            unit:         p.unit,
            weight:       p.weight,
            status:       p.status,
            category:     cat.name,
            subCategory:  sub.name,
            ownerType:    "admin",
            productModel: "Price",
          });
        });
      });
    });
  });
  return products;
};

// ─── buildInvoiceOrder — orderNo bhi pass hoga ────────────────────────────────
const buildInvoiceOrder = (o, useOriginal = false, srNo = null) => {
  const itemsSource = useOriginal
    ? (o.originalItems && o.originalItems.length > 0 ? o.originalItems : o.items)
    : o.items;

  const items = (itemsSource || []).map((it) => {
    const prod =
      !useOriginal &&
      it.product &&
      typeof it.product === "object" &&
      it.product.name
        ? it.product
        : {};

    const name      = it.name      || prod.name     || "—";
    const mrp       = it.mrp       ?? prod.mrp       ?? it.unitPrice ?? 0;
    const hsn       = it.hsn       || prod.hsn       || "N/A";
    const gstRate   = it.gstRate   ?? prod.gstRate   ?? 0;
    const unit      = it.unit      || prod.unit      || "pcs";
    const packing   = it.packing   || (prod.weight ? `${prod.weight.value}${prod.weight.unit}` : "—");
    const unitPrice = it.unitPrice || prod.salePrice || 0;
    const quantity  = it.quantity  || 1;

    return {
      name, quantity, rate: unitPrice, mrp, hsn, gstRate, unit, packing,
      unitPrice, price: it.price ?? +(unitPrice * quantity).toFixed(2),
    };
  });

  const grandTotal = useOriginal
    ? (o.originalTotalPrice != null
        ? o.originalTotalPrice
        : +items.reduce((s, i) => s + i.unitPrice * i.quantity, 0).toFixed(2))
    : getEffectiveTotal(o);

  return {
    _id:            o._id,
    orderNo:        srNo,                  // ← Sr. No. invoice mein jaayega
    createdAt:      o.createdAt,
    status:         o.status,
    invoiceNo:      `INV-${o._id.slice(-6).toUpperCase()}`,
    paymentMode:    o.paymentMode || "Cash",
    couponCode:     o.couponCode     || null,
    couponDiscount: o.couponDiscount || 0,
    finalPrice:     o.finalPrice     || null,
    deliveryCharge: o.deliveryCharge || 0,
    handlingCharge: o.handlingCharge || 0,
    vendor: {
      name:    o.vendor?.name    || "Your Company Name",
      gstin:   o.vendor?.gstin   || "GSTIN_HERE",
      address: o.vendor?.address || "Company Address Here",
      phone:   o.vendor?.phone   || "",
      email:   o.vendor?.email   || "",
    },
    customer: {
      name:  o.user?.name || o.userName || "—",
      phone: o.address?.phone || "",
      address: {
        street:  o.address?.street  || "",
        city:    o.address?.city    || "",
        state:   o.address?.state   || "",
        pincode: o.address?.pincode || "",
      },
    },
    items,
    totalPrice: grandTotal,
  };
};

// ─── CSV HELPERS ──────────────────────────────────────────────────────────────
const escapeCSV = (val) => {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n"))
    return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const buildTallyCSV = (orders) => {
  const headers = [
    "Sr. No.", "Vch Ref", "Invoice No", "Voucher Date", "Invoice Date", "Voucher TYPE",
    "Customer Code / Alias", "Customer Name", "Customer Mobile No", "Under Group",
    "Address Name", "Street", "City", "State", "Pincode", "Full Address", "GST No",
    "Product NO", "Product Description", "Stock Category", "HSN", "STORE", "UOM",
    "Quantity", "Rate", "Amount", "GST %", "SGST Amount", "CGST Amount", "IGST Amount",
    "Round off", "Line Total", "Remarks",
  ];

  const rows = [];
  let vchRef = 1;

  orders.forEach((o, idx) => {
    const srNo      = orders.length - idx;   // descending
    const invoiceNo = `INV-${o._id.slice(-6).toUpperCase()}`;
    const fmtDate = (() => {
      if (!o.createdAt) return "";
      const d = new Date(o.createdAt);
      if (isNaN(d.getTime())) return "";
      return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    })();

    const customerName   = o.user?.name || o.userName || "";
    const customerMobile = o.address?.phone || "";
    const gstin          = o.vendor?.gstin  || "";
    const store          = o.vendor?.address || "Main Location";
    const customerCode   = `A${String(vchRef).padStart(6, "0")}`;
    const addrName  = o.address?.name    || customerName;
    const street    = o.address?.street  || "";
    const city      = o.address?.city    || "";
    const state     = o.address?.state   || "";
    const pincode   = o.address?.pincode || "";
    const fullAddr  = [addrName, street, city, state, pincode].filter(Boolean).join(", ");
    const items = o.items || [];
    let isFirstItem = true;

    if (items.length === 0) {
      const total = getEffectiveTotal(o);
      rows.push([
        srNo, vchRef, invoiceNo, fmtDate, fmtDate, "GST Sales",
        customerCode, customerName, customerMobile, "Sundry Debtors",
        addrName, street, city, state, pincode, fullAddr, gstin,
        "", "", "", "", store, "", "", "", total,
        "", "", "", "", "-", total, o.paymentNote || "",
      ]);
    } else {
      items.forEach((it) => {
        const prod = it.product && typeof it.product === "object" && it.product.name ? it.product : {};
        const productNo  = prod._id      || it.product  || "";
        const name       = it.name       || prod.name   || "—";
        const hsn        = it.hsn        || prod.hsn    || "N/A";
        const unit       = it.unit       || prod.unit   || "pcs";
        const gstRate    = it.gstRate    ?? prod.gstRate ?? 0;
        const unitPrice  = it.unitPrice  || prod.salePrice || 0;
        const quantity   = it.quantity   || 1;
        const stockCat   = prod.category || "";
        const remarks    = isFirstItem ? (o.paymentNote || "") : "";
        const amount     = +(unitPrice * quantity).toFixed(2);
        const halfGST    = gstRate / 2;
        const sgst       = gstRate > 0 ? +(amount * halfGST / 100).toFixed(2) : "";
        const cgst       = gstRate > 0 ? +(amount * halfGST / 100).toFixed(2) : "";
        const igst       = "";
        const gstTotal   = gstRate > 0 ? ((sgst || 0) + (cgst || 0)) : 0;
        const lineRaw    = amount + gstTotal;
        const lineRounded = Math.round(lineRaw);
        const roundOff   = +(lineRounded - lineRaw).toFixed(2);

        rows.push([
          isFirstItem ? srNo : "", vchRef, invoiceNo, fmtDate, fmtDate, "GST Sales",
          customerCode, customerName, customerMobile, "Sundry Debtors",
          addrName, street, city, state, pincode, fullAddr, gstin,
          productNo, name, stockCat, hsn, store, unit, quantity, unitPrice, amount,
          gstRate, sgst, cgst, igst,
          roundOff === 0 ? "-" : roundOff, lineRounded, remarks,
        ]);
        isFirstItem = false;
      });
    }
    vchRef++;
  });

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((r) => r.map(escapeCSV).join(",")),
  ].join("\n");
};

const downloadCSV = (csvString, filename) => {
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─── ALERT SOUND ─────────────────────────────────────────────────────────────
const playAlertSound = () => {
  try {
    const ctx   = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1100, 880, 1320];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.11);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.12);
    });
  } catch {}
};

// ─── NEW ORDER TOAST ──────────────────────────────────────────────────────────
const NewOrderToast = ({ order, onDismiss, index }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t    = setTimeout(() => setVisible(true), index * 80);
    const auto = setTimeout(() => handleDismiss(), 12000 + index * 80);
    return () => { clearTimeout(t); clearTimeout(auto); };
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(order._id), 350);
  };

  const timeStr = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  const itemNames = (order.items || [])
    .slice(0, 2)
    .map((it) => it.name || it.product?.name || "Item")
    .join(", ");

  const moreItems = (order.items?.length || 0) > 2
    ? ` +${order.items.length - 2} more` : "";

  return (
    <div
      style={{
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: leaving ? "translateX(110%)" : visible ? "translateX(0)" : "translateX(110%)",
        opacity: leaving ? 0 : visible ? 1 : 0,
      }}
      className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
    >
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />
      <div className="px-4 py-3.5 flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Bell className="w-2.5 h-2.5 text-white" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide">🛒 Naya Order Aaya!</p>
            <span className="text-[9px] text-slate-400 font-medium flex-shrink-0">{timeStr}</span>
          </div>
          <p className="text-[11px] font-bold text-slate-700 truncate">
            {order.user?.name || order.userName || "Customer"}
          </p>
          {itemNames && (
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{itemNames}{moreItems}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-black text-blue-700">₹{getEffectiveTotal(order).toFixed(2)}</span>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
              #{order._id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>
        <button onClick={handleDismiss}
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all -mt-0.5 -mr-0.5">
          <X size={11} />
        </button>
      </div>
      <div className="h-0.5 bg-blue-50">
        <div className="h-full bg-blue-400 rounded-full"
          style={{ animation: `shrink ${12}s linear forwards`, animationDelay: `${index * 80}ms` }} />
      </div>
    </div>
  );
};

const NewOrderAlerts = ({ alerts, onDismiss, onDismissAll }) => {
  if (alerts.length === 0) return null;
  return (
    <>
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {alerts.length >= 2 && (
          <button onClick={onDismissAll}
            className="pointer-events-auto mb-1 text-[10px] font-bold text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm transition-all">
            Sab band karo ({alerts.length})
          </button>
        )}
        {alerts.map((order, i) => (
          <div key={order._id} className="pointer-events-auto">
            <NewOrderToast order={order} onDismiss={onDismiss} index={i} />
          </div>
        ))}
      </div>
    </>
  );
};

const SSEStatusBadge = ({ status }) => {
  const cfg = {
    connected:    { dot: "bg-green-500 animate-pulse", text: "text-green-700", label: "Live" },
    connecting:   { dot: "bg-amber-400 animate-pulse", text: "text-amber-700", label: "Connecting..." },
    disconnected: { dot: "bg-red-400",                 text: "text-red-600",   label: "Offline (polling)" },
  }[status] || { dot: "bg-gray-400", text: "text-gray-500", label: "Unknown" };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-100 shadow-sm ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <span className="text-[10px] font-bold">{cfg.label}</span>
    </div>
  );
};

const CSVExportButton = ({ orders, filter }) => {
  const [exporting, setExporting] = useState(false);
  const handleExport = () => {
    if (orders.length === 0) { alert("Export ke liye koi order nahi hai."); return; }
    setExporting(true);
    try {
      const csv   = buildTallyCSV(orders);
      const today = new Date().toISOString().slice(0, 10);
      const label = filter !== "all" ? `_${filter}` : "";
      downloadCSV(csv, `orders_tally${label}_${today}.csv`);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("CSV export fail ho gaya.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={exporting || orders.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all">
      <Download className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
      {exporting ? "Exporting..." : `Tally Export (${orders.length})`}
    </button>
  );
};

const PaymentSummary = ({ orders }) => {
  const stats = useMemo(() => {
    let received = 0, pending = 0, receivedCount = 0, pendingCount = 0, totalActive = 0;
    orders.forEach((o) => {
      const total = getEffectiveTotal(o);
      const paid  = o.paidAmount || 0;
      const ps    = getPaymentStatus(o);
      if (ps !== "cancelled") {
        received    += paid;
        pending     += Math.max(0, total - paid);
        totalActive += total;
        if (paid > 0)     receivedCount++;
        if (paid < total) pendingCount++;
      }
    });
    const pct = totalActive > 0 ? Math.round((received / totalActive) * 100) : 0;
    return { received, pending, receivedCount, pendingCount, pct, totalActive };
  }, [orders]);

  const fmtAmt = (n) =>
    n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(2)}L`
    : n >= 1_000  ? `₹${(n / 1_000).toFixed(1)}K`
    : `₹${n.toFixed(0)}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="z-10 min-w-0">
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Payment Received</p>
          <p className="text-xl font-black text-slate-800 leading-tight">{fmtAmt(stats.received)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{stats.receivedCount} orders</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 z-10">
          <Hourglass className="w-5 h-5 text-amber-600" />
        </div>
        <div className="z-10 min-w-0">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Payment Pending</p>
          <p className="text-xl font-black text-slate-800 leading-tight">{fmtAmt(stats.pending)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{stats.pendingCount} orders</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div className="z-10 flex-1 min-w-0">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Collection Rate</p>
          <div className="flex items-end gap-2">
            <p className="text-xl font-black text-slate-800 leading-tight">{stats.pct}%</p>
            <p className="text-[10px] text-slate-400 mb-0.5">of {fmtAmt(stats.totalActive)}</p>
          </div>
          <div className="mt-1.5 h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${stats.pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentBadge = ({ order }) => {
  const ps      = getPaymentStatus(order);
  const paid    = order.paidAmount || 0;
  const total   = getEffectiveTotal(order);
  const pending = Math.max(0, total - paid);

  if (ps === "cancelled")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">— Cancelled</span>;

  if (ps === "paid")
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
          <CheckCircle size={9} /> Paid
        </span>
        <span className="text-[9px] text-slate-400">₹{paid.toFixed(0)} received</span>
      </div>
    );

  if (ps === "partial")
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
          <Wallet size={9} /> Partial
        </span>
        <span className="text-[9px] text-slate-400">₹{paid.toFixed(0)} / ₹{pending.toFixed(0)} left</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <Hourglass size={9} /> Unpaid
      </span>
      <span className="text-[9px] text-slate-400">₹{total.toFixed(0)} pending</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── VENDOR DETAILS MODAL ─────────────────────────────────────────────────────
const VENDOR_COLORS = [
  { bg: "bg-purple-50", border: "border-purple-200", header: "bg-purple-100", text: "text-purple-700", badge: "bg-purple-600", dot: "bg-purple-400" },
  { bg: "bg-blue-50",   border: "border-blue-200",   header: "bg-blue-100",   text: "text-blue-700",   badge: "bg-blue-600",   dot: "bg-blue-400"   },
  { bg: "bg-teal-50",   border: "border-teal-200",   header: "bg-teal-100",   text: "text-teal-700",   badge: "bg-teal-600",   dot: "bg-teal-400"   },
  { bg: "bg-rose-50",   border: "border-rose-200",   header: "bg-rose-100",   text: "text-rose-700",   badge: "bg-rose-600",   dot: "bg-rose-400"   },
  { bg: "bg-amber-50",  border: "border-amber-200",  header: "bg-amber-100",  text: "text-amber-700",  badge: "bg-amber-600",  dot: "bg-amber-400"  },
];

const VendorDetailsModal = ({ order, onClose }) => {
  const vendors    = getAllVendorsFromItems(order.items || []);
  const adminItems = getAdminItems(order.items || []);
  const [activeTab, setActiveTab] = useState(vendors.length > 0 ? vendors[0]._id : "__admin__");

  const allTabs = [
    ...vendors.map((v, i) => ({ id: v._id, label: v.businessName || v.name || `Vendor ${i+1}`, type: "vendor", color: VENDOR_COLORS[i % VENDOR_COLORS.length], data: v })),
    ...(adminItems.length > 0 ? [{ id: "__admin__", label: "Admin / Direct", type: "admin", color: VENDOR_COLORS[4], data: { products: adminItems.map(it => ({ name: it.name || it.product?.name || "—", quantity: it.quantity || 1, unitPrice: it.unitPrice || 0, image: it.image || it.product?.image || "", unit: it.unit || "pcs", mrp: it.mrp || 0, hsn: it.hsn || "", gstRate: it.gstRate ?? 0 })) } }] : []),
  ];

  const active = allTabs.find(t => t.id === activeTab) || allTabs[0];

  const vendorTotal = (products) =>
    products.reduce((s, p) => s + (p.unitPrice * p.quantity), 0);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex justify-between items-start p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users size={15} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Vendor Breakdown</h3>
            </div>
            <p className="text-[11px] text-gray-400 ml-10">
              Order #{order._id.slice(-6).toUpperCase()} · {allTabs.length} source{allTabs.length !== 1 ? "s" : ""} · {order.items?.length || 0} items total
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-xl">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1.5 px-4 pt-3 pb-0 overflow-x-auto flex-shrink-0 border-b border-gray-100 bg-gray-50/50">
          {allTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const tabTotal = vendorTotal(tab.data.products || []);
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex flex-col items-start px-3.5 py-2.5 rounded-t-xl border border-b-0 transition-all text-left ${
                  isActive
                    ? `bg-white border-gray-200 shadow-sm -mb-px z-10`
                    : `bg-transparent border-transparent hover:bg-white/60 hover:border-gray-100`
                }`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? tab.color.dot : "bg-gray-300"}`} />
                  <span className={`text-[11px] font-black uppercase tracking-wide truncate max-w-[120px] ${isActive ? tab.color.text : "text-gray-400"}`}>
                    {tab.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-3.5">
                  <span className={`text-[10px] font-bold ${isActive ? "text-slate-700" : "text-gray-400"}`}>
                    ₹{tabTotal.toFixed(0)}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? `${tab.color.bg} ${tab.color.text}` : "bg-gray-100 text-gray-400"}`}>
                    {(tab.data.products || []).length} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {active && (
          <div className="flex-1 overflow-y-auto">
            {active.type === "vendor" && (
              <div className={`px-5 py-3.5 flex items-center gap-4 border-b ${active.color.bg} ${active.color.border}`}>
                <div className={`w-10 h-10 rounded-xl ${active.color.header} flex items-center justify-center flex-shrink-0`}>
                  <Store size={18} className={active.color.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-black ${active.color.text} truncate`}>
                    {active.data.businessName || active.data.name || "—"}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-0.5">
                    {active.data.phone && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone size={10} /> {active.data.phone}
                      </span>
                    )}
                    {active.data.gstin && (
                      <span className="text-[10px] font-mono text-slate-400">GSTIN: {active.data.gstin}</span>
                    )}
                    {active.data.email && (
                      <span className="text-[11px] text-slate-400">{active.data.email}</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vendor Total</div>
                  <div className={`text-lg font-black ${active.color.text}`}>
                    ₹{vendorTotal(active.data.products || []).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {active.type === "admin" && (
              <div className="px-5 py-3.5 flex items-center gap-4 border-b bg-slate-50 border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-700">Admin / Direct Products</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Products managed directly by admin</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</div>
                  <div className="text-lg font-black text-slate-700">
                    ₹{vendorTotal(active.data.products || []).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 space-y-2">
              {(active.data.products || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                  <Package className="w-10 h-10 text-slate-200" />
                  <p className="text-sm">Koi product nahi</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-12 gap-2 px-3 pb-1 border-b border-gray-100">
                    <div className="col-span-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</div>
                    <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</div>
                    <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rate</div>
                    <div className="col-span-1 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">GST</div>
                    <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</div>
                  </div>

                  {(active.data.products || []).map((prod, idx) => {
                    const amount = (prod.unitPrice || 0) * (prod.quantity || 1);
                    return (
                      <div key={idx}
                        className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-colors ${idx % 2 === 0 ? "bg-gray-50/80 border-gray-100" : "bg-white border-transparent"} hover:border-gray-200`}>
                        <div className="col-span-5 flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                            {prod.image
                              ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
                              : <Package className="w-4 h-4 text-gray-300" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-700 leading-tight">{prod.name}</div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {prod.unit && (
                                <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{prod.unit}</span>
                              )}
                              {prod.hsn && (
                                <span className="text-[9px] text-slate-400 font-mono">HSN: {prod.hsn}</span>
                              )}
                              {prod.mrp > 0 && prod.mrp !== prod.unitPrice && (
                                <span className="text-[9px] text-slate-400 line-through">MRP ₹{prod.mrp}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${active.color.bg} ${active.color.text}`}>
                            {prod.quantity}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-xs font-bold text-slate-700">₹{(prod.unitPrice || 0).toFixed(2)}</div>
                        </div>
                        <div className="col-span-1 text-center">
                          {prod.gstRate > 0 ? (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active.color.bg} ${active.color.text}`}>
                              {prod.gstRate}%
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-300">—</span>
                          )}
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-sm font-black text-slate-800">₹{amount.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}

                  <div className={`flex items-center justify-between p-3 rounded-xl border ${active.color.border} ${active.color.bg} mt-2`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${active.color.text}`}>
                        {active.type === "vendor" ? (active.data.businessName || active.data.name || "Vendor") : "Admin"} Subtotal
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${active.color.badge} text-white`}>
                        {(active.data.products || []).reduce((s, p) => s + (p.quantity || 1), 0)} qty
                      </span>
                    </div>
                    <div className={`text-base font-black ${active.color.text}`}>
                      ₹{vendorTotal(active.data.products || []).toFixed(2)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="px-5 py-3.5 border-t border-gray-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            {allTabs.map((tab) => (
              <div key={tab.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${tab.color.dot}`} />
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px]">{tab.label}</span>
                <span className={`text-[10px] font-black ${tab.color.text}`}>₹{vendorTotal(tab.data.products || []).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grand Total</div>
            <div className="text-lg font-black text-slate-800">₹{getEffectiveTotal(order).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── VENDOR CELL ──────────────────────────────────────────────────────────────
const VendorCell = ({ order, onViewClick }) => {
  const vendors    = getAllVendorsFromItems(order.items || []);
  const adminItems = getAdminItems(order.items || []);

  const hasVendors = vendors.length > 0;
  const hasAdmin   = adminItems.length > 0;
  const isMulti    = vendors.length > 1 || (hasVendors && hasAdmin);
  const total      = vendors.length + (hasAdmin ? 1 : 0);

  if (!hasVendors && !hasAdmin) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
        Admin
      </span>
    );
  }

  if (isMulti) {
    return (
      <button onClick={() => onViewClick(order)}
        className="group flex flex-col gap-1 text-left">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {[...vendors.slice(0, 2), ...(hasAdmin ? [{ _id: "__admin__", businessName: "Admin" }] : [])].slice(0, 3).map((v, i) => (
              <div key={v._id} className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white ${VENDOR_COLORS[i % VENDOR_COLORS.length].badge}`}>
                {(v.businessName || v.name || "A").charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-black text-purple-700">{total} Sources</span>
        </div>
        <div className="flex items-center gap-1 ml-0.5">
          <Eye size={9} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
          <span className="text-[9px] text-purple-400 group-hover:text-purple-600 font-bold transition-colors">View breakdown</span>
        </div>
      </button>
    );
  }

  if (hasVendors) {
    const v = vendors[0];
    return (
      <button onClick={() => onViewClick(order)} className="group text-left min-w-[110px]">
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Store size={10} className="text-purple-600" />
          </div>
          <div className="text-xs font-bold text-slate-700 truncate max-w-[100px] group-hover:text-purple-700 transition-colors">
            {v.businessName || v.name || "—"}
          </div>
        </div>
        {v.phone && (
          <div className="text-[10px] text-slate-400 flex items-center gap-1 ml-6">
            📞 {v.phone}
          </div>
        )}
        <div className="flex items-center gap-1 ml-6 mt-0.5">
          <Eye size={9} className="text-purple-300 group-hover:text-purple-500 transition-colors" />
          <span className="text-[9px] text-purple-300 group-hover:text-purple-500 font-bold transition-colors">View products</span>
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => onViewClick(order)} className="group text-left">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 group-hover:border-gray-300 transition-colors">
        Admin
      </span>
      <div className="flex items-center gap-1 mt-1">
        <Eye size={9} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        <span className="text-[9px] text-gray-300 group-hover:text-gray-500 font-bold transition-colors">View items</span>
      </div>
    </button>
  );
};

// ─── RIDER OPTION ─────────────────────────────────────────────────────────────
const RiderOption = ({ rider, selected, onSelect }) => {
  const statusColor = {
    online:      "bg-green-100 text-green-700",
    offline:     "bg-gray-100 text-gray-500",
    on_delivery: "bg-amber-100 text-amber-700",
  };
  const vehicleIcon = { bike: "🏍️", scooter: "🛵", cycle: "🚲" };

  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
      <input type="radio" name="rider" value={rider._id} checked={selected} onChange={onSelect} className="accent-blue-600" />
      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
        {vehicleIcon[rider.vehicleType] || "🏍️"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-800 truncate">{rider.name}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor[rider.status] || statusColor.offline}`}>
            {rider.status === "on_delivery" ? "BUSY" : rider.status?.toUpperCase()}
          </span>
        </div>
        <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-3">
          <span>📞 {rider.phone}</span>
          {rider.baseLocation && <span>📍 {rider.baseLocation}</span>}
        </div>
      </div>
    </label>
  );
};

// ─── ASSIGN RIDER MODAL ───────────────────────────────────────────────────────
const AssignRiderModal = ({ order, riders, token, onClose, onAssigned }) => {
  const currentRiderId = typeof order.assignedRider === "object"
    ? order.assignedRider?._id
    : order.assignedRider;

  const [selectedRider, setSelectedRider] = useState(currentRiderId || "");
  const [saving, setSaving]               = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${ORDER_API}/${order._id}/assign-rider`,
        { riderId: selectedRider || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        onAssigned(order._id, res.data.data.assignedRider);
        onClose();
      }
    } catch {
      alert("Rider assign fail ho gaya");
    } finally {
      setSaving(false);
    }
  };

  const onlineRiders  = riders.filter((r) => r.status === "online");
  const busyRiders    = riders.filter((r) => r.status === "on_delivery");
  const offlineRiders = riders.filter((r) => r.status === "offline");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Rider Assign Karo</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Order #{order._id.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
        </div>
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-2">
          <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedRider === "" ? "border-slate-700 bg-slate-50" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
            <input type="radio" name="rider" value="" checked={selectedRider === ""} onChange={() => setSelectedRider("")} className="accent-slate-800" />
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X size={14} className="text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-600">Koi Rider Nahi (Unassign)</div>
              <div className="text-[11px] text-gray-400">Rider hatao is order se</div>
            </div>
          </label>
          {onlineRiders.length > 0 && (<>
            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest px-1 pt-2">Online ({onlineRiders.length})</p>
            {onlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
          </>)}
          {busyRiders.length > 0 && (<>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-1 pt-2">On Delivery ({busyRiders.length})</p>
            {busyRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
          </>)}
          {offlineRiders.length > 0 && (<>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1 pt-2">Offline ({offlineRiders.length})</p>
            {offlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
          </>)}
          {riders.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">Koi rider registered nahi hai</div>}
        </div>
        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60">
            {saving ? "Saving..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── EDIT ORDER MODAL ─────────────────────────────────────────────────────────
const EditOrderModal = ({ order, token, onClose, onUpdated }) => {
  const buildInitial = () => {
    if (order.items && order.items.length > 0) {
      return order.items.map((it) => {
        const product = it.product && typeof it.product === "object" && it.product.name ? it.product : {};
        return {
          productId:    product._id  || it.product || "",
          name:         product.name || it.name    || "—",
          image:        product.image || it.image  || "",
          unitPrice:    it.unitPrice || product.salePrice || 0,
          quantity:     it.quantity  || 1,
          ownerType:    it.ownerType    || "admin",
          productModel: it.productModel || "Price",
        };
      });
    }
    return [];
  };

  const [cartItems, setCartItems]               = useState(buildInitial);
  const [allProducts, setAllProducts]           = useState([]);
  const [loadingProducts, setLoadingProducts]   = useState(false);
  const [productSearch, setProductSearch]       = useState("");
  const [saving, setSaving]                     = useState(false);
  const [error, setError]                       = useState("");
  const [showProductPanel, setShowProductPanel] = useState(false);
  const token2 = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get(PRODUCT_API, { headers: { Authorization: `Bearer ${token2}` } });
        setAllProducts(flattenProducts(res.data?.data || res.data || []));
      } catch {
        console.error("Products load nahi hue");
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return allProducts.slice(0, 30);
    const q = productSearch.toLowerCase();
    return allProducts.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [productSearch, allProducts]);

  const total = cartItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  const addProduct = (product) => {
    setError("");
    const existsIdx = cartItems.findIndex((it) => it.productId === product._id);
    if (existsIdx !== -1) {
      setCartItems((prev) => prev.map((it, i) => (i === existsIdx ? { ...it, quantity: it.quantity + 1 } : it)));
    } else {
      setCartItems((prev) => [...prev, {
        productId:    product._id,
        name:         product.name,
        image:        product.image || "",
        unitPrice:    product.salePrice,
        quantity:     1,
        ownerType:    product.ownerType    || "admin",
        productModel: product.productModel || "Price",
      }]);
    }
  };

  const removeItem = (idx) => {
    if (cartItems.length === 1) { setError("Order mein kam se kam ek item hona chahiye."); return; }
    setError("");
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const changeQty = (idx, delta) => {
    setCartItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)));
  };

  const handleSave = async () => {
    setError("");
    if (cartItems.length === 0) { setError("Order mein kam se kam ek item hona chahiye."); return; }
    setSaving(true);
    try {
      const res = await axios.put(
        `${ORDER_API}/${order._id}/items`,
        { items: cartItems.map((it) => ({ productId: it.productId, quantity: it.quantity, type: it.ownerType || "admin" })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) { onUpdated(res.data.data); onClose(); }
      else setError(res.data.message || "Update fail ho gaya.");
    } catch (err) {
      setError(err?.response?.data?.message || "Order update fail ho gaya.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Order Edit Karo</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">#{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 border-r border-gray-100">
            <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Cart ({cartItems.length} items)</span>
              <button onClick={() => setShowProductPanel((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95">
                <Plus size={11} /> Product Add Karo
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                  <p className="text-sm text-gray-400">Cart empty hai</p>
                </div>
              ) : (
                cartItems.map((it, idx) => (
                  <div key={`${it.productId}-${idx}`} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-4 h-4 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{it.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ₹{it.unitPrice} x {it.quantity} = <span className="font-bold text-slate-600">₹{(it.unitPrice * it.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => changeQty(idx, -1)} disabled={it.quantity <= 1}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all">
                        <Minus size={10} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-800">{it.quantity}</span>
                      <button onClick={() => changeQty(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all">
                        <Plus size={10} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(idx)} className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {showProductPanel && (
            <div className="w-64 flex flex-col flex-shrink-0 bg-gray-50">
              <div className="p-3 border-b border-gray-100 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="text" placeholder="Product search karo..." value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)} autoFocus
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loadingProducts ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">Koi product nahi mila</div>
                ) : (
                  filteredProducts.map((p) => {
                    const inCart = cartItems.find((c) => c.productId === p._id);
                    return (
                      <button key={p._id} onClick={() => addProduct(p)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-4 h-4 text-gray-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-slate-700 truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand} · ₹{p.salePrice}</div>
                        </div>
                        {inCart
                          ? <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">+{inCart.quantity}</span>
                          : <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">ADD</span>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex-shrink-0">
            <X size={11} className="flex-shrink-0" /> {error}
          </div>
        )}
        <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100 flex justify-between items-center flex-shrink-0">
          <div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Naya Total</div>
            <div className="text-[10px] text-blue-400 mt-0.5">{cartItems.reduce((s, it) => s + it.quantity, 0)} qty · {cartItems.length} products</div>
          </div>
          <div className="text-2xl font-black text-blue-700">₹{total.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving || cartItems.length === 0}
            className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? "Saving..." : `Save Changes (${cartItems.length} items · ₹${total.toFixed(2)})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PAYMENT UPDATE MODAL ─────────────────────────────────────────────────────
const PaymentUpdateModal = ({ order, token, onClose, onUpdated }) => {
  const total = getEffectiveTotal(order);
  const [paidAmount, setPaidAmount]   = useState(order.paidAmount ?? 0);
  const [paymentNote, setPaymentNote] = useState(order.paymentNote || "");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const safePaid = Math.min(Math.max(0, Number(paidAmount) || 0), total);
  const pending  = Math.max(0, total - safePaid);
  const pct      = total > 0 ? Math.round((safePaid / total) * 100) : 0;

  const computedStatus = safePaid <= 0 ? "unpaid" : safePaid >= total ? "paid" : "partial";
  const statusCfg = {
    unpaid:  { label: "Unpaid",  cls: "bg-amber-100 text-amber-700 border-amber-200" },
    partial: { label: "Partial", cls: "bg-blue-100 text-blue-700 border-blue-200"   },
    paid:    { label: "Paid",    cls: "bg-green-100 text-green-700 border-green-200" },
  }[computedStatus];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        `${ORDER_API}/${order._id}/payment`,
        { paidAmount: safePaid, paymentNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) { onUpdated(order._id, res.data.data); onClose(); }
      else setError(res.data.message || "Update fail ho gaya.");
    } catch (err) {
      setError(err?.response?.data?.message || "Payment update fail ho gaya.");
    } finally {
      setSaving(false);
    }
  };

  const quickAmounts = [
    { label: "₹0 (Clear)", value: 0 },
    { label: "25%",         value: Math.round(total * 0.25) },
    { label: "50%",         value: Math.round(total * 0.5)  },
    { label: `Full ₹${total.toFixed(0)}`, value: total },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/30">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Payment Update</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">#{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName || "—"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          {order.couponCode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
              <Tag size={13} className="text-green-600 flex-shrink-0" />
              <div className="text-[11px] text-green-700 font-semibold flex-1">
                Coupon <span className="font-black">{order.couponCode}</span> applied — ₹{(order.couponDiscount || 0).toFixed(2)} off
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {order.couponCode && (
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                <p className="text-[10px] text-slate-400 mb-1">Original Total</p>
                <p className="text-sm font-bold text-slate-500 line-through">₹{(order.totalPrice || 0).toFixed(2)}</p>
              </div>
            )}
            <div className={`bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5 ${!order.couponCode ? "col-span-1" : ""}`}>
              <p className="text-[10px] text-slate-400 mb-1">{order.couponCode ? "Final Amount" : "Order Total"}</p>
              <p className="text-base font-black text-slate-800">₹{total.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] text-slate-400 mb-1">Payment Status</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.cls}`}>{statusCfg.label}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Kitna payment mila? (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
              <input type="number" min="0" max={total} step="1" value={paidAmount}
                onChange={(e) => setPaidAmount(Math.min(Math.max(0, Number(e.target.value) || 0), total))}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                placeholder="0" />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((q) => (
                <button key={q.label} onClick={() => setPaidAmount(q.value)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${safePaid === q.value ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-slate-600 border-gray-200 hover:border-green-400 hover:text-green-700"}`}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-semibold">
              <span className="text-green-600">Paid: ₹{safePaid.toFixed(2)} ({pct}%)</span>
              <span className="text-amber-600">Pending: ₹{pending.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#16a34a" : pct > 0 ? "#2563eb" : "#d1d5db" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Payment Note <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={2}
              placeholder="e.g. UPI ref: 9876543210, Cash collected by rider..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none" />
          </div>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              <X size={11} className="flex-shrink-0" /> {error}
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-[2] py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? "Saving..." : `Save — ₹${safePaid.toFixed(2)} (${pct}%)`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders]                     = useState([]);
  const [riders, setRiders]                     = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [filter, setFilter]                     = useState("all");
  const [search, setSearch]                     = useState("");
  const [updating, setUpdating]                 = useState(null);
  const [assignModal, setAssignModal]           = useState(null);
  const [editModalId, setEditModalId]           = useState(null);
  const [paymentModalId, setPaymentModalId]     = useState(null);
  const [vendorViewOrder, setVendorViewOrder]   = useState(null);

  const [newOrderAlerts, setNewOrderAlerts]     = useState([]);
  const [sseStatus, setSseStatus]               = useState("connecting");

  const tableScrollRef = useRef(null);
  const topScrollRef   = useRef(null);
  const handleTopScroll = useCallback(() => {
    if (tableScrollRef.current && topScrollRef.current)
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
  }, []);
  const handleTableScroll = useCallback(() => {
    if (topScrollRef.current && tableScrollRef.current)
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
  }, []);

  const knownOrderIds = useRef(null);
  const isInitialized = useRef(false);
  const tokenRef      = useRef(localStorage.getItem("token"));
  const sseRef        = useRef(null);
  const fallbackRef   = useRef(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  useEffect(() => { tokenRef.current = token; }, [token]);

  const dismissAlert     = useCallback((orderId) => setNewOrderAlerts((prev) => prev.filter((o) => o._id !== orderId)), []);
  const dismissAllAlerts = useCallback(() => setNewOrderAlerts([]), []);

  const handleNewOrders = useCallback((brandNew) => {
    if (!brandNew.length) return;
    setNewOrderAlerts((prev) => [...brandNew, ...prev].slice(0, 5));
    playAlertSound();
    if ("Notification" in window && Notification.permission === "granted") {
      brandNew.forEach((o) => {
        try {
          new Notification("🛒 Naya Order Aaya!", {
            body: `${o.user?.name || o.userName || "Customer"} — ₹${getEffectiveTotal(o).toFixed(2)}`,
            icon: "/favicon.ico",
            tag:  o._id,
          });
        } catch {}
      });
    }
  }, []);

  const fetchInitialOrders = useCallback(async () => {
    try {
      const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
      if (!res.data.success) return;
      const fetched = res.data.data;
      knownOrderIds.current = new Set(fetched.map((o) => o._id));
      isInitialized.current = true;
      setOrders(fetched);
    } catch (err) {
      console.error("[Orders] Initial fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startFallbackPolling = useCallback(() => {
    if (fallbackRef.current) return;
    setSseStatus("disconnected");
    fallbackRef.current = setInterval(async () => {
      try {
        const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
        if (!res.data.success) return;
        const fetched = res.data.data;
        if (!isInitialized.current) {
          knownOrderIds.current = new Set(fetched.map((o) => o._id));
          isInitialized.current = true;
          setOrders(fetched);
          return;
        }
        const brandNew = fetched.filter((o) => !knownOrderIds.current.has(o._id));
        fetched.forEach((o) => knownOrderIds.current.add(o._id));
        setOrders(fetched);
        handleNewOrders(brandNew);
      } catch (err) {
        console.error("[Fallback Poll] Error:", err);
      }
    }, FALLBACK_POLL_INTERVAL);
  }, [handleNewOrders]);

  const connectSSE = useCallback(() => {
    const url = `${ORDER_API}/sse?token=${encodeURIComponent(tokenRef.current || "")}`;
    const es = new EventSource(url);
    sseRef.current = es;
    es.onopen = () => {
      setSseStatus("connected");
      if (fallbackRef.current) { clearInterval(fallbackRef.current); fallbackRef.current = null; }
    };
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "CONNECTED") return;
        if (payload.type === "NEW_ORDER") {
          const order = payload.order;
          if (!order?._id) return;
          if (knownOrderIds.current?.has(order._id)) return;
          knownOrderIds.current?.add(order._id);
          setOrders((prev) => [order, ...prev]);
          handleNewOrders([order]);
        }
      } catch (err) {
        console.error("[SSE] Parse error:", err);
      }
    };
    es.onerror = (err) => {
      console.error("[SSE] Error / disconnected", err);
      es.close();
      setSseStatus("disconnected");
      startFallbackPolling();
    };
  }, [handleNewOrders, startFallbackPolling]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    fetchInitialOrders();
    setSseStatus("connecting");
    connectSSE();
    axios.get(RIDER_API).then((res) => setRiders(res.data.data || [])).catch(() => {});
    return () => {
      if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
      if (fallbackRef.current) { clearInterval(fallbackRef.current); fallbackRef.current = null; }
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ORDER_API, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setOrders(res.data.data);
        knownOrderIds.current = new Set(res.data.data.map((o) => o._id));
        isInitialized.current = true;
      }
    } catch (err) {
      console.error("fetchOrders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(`${ORDER_API}/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch {
      alert("Status update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleRiderAssigned = (orderId, rider) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, assignedRider: rider } : o)));
  };

  const handleOrderUpdated = (updated) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o._id !== updated._id) return o;
        return { ...o, ...updated, originalItems: o.originalItems ?? updated.originalItems, originalTotalPrice: o.originalTotalPrice ?? updated.originalTotalPrice };
      })
    );
  };

  const handlePaymentUpdated = (orderId, paymentData) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, paidAmount: paymentData.paidAmount, paymentStatus: paymentData.paymentStatus, paymentNote: paymentData.paymentNote }
          : o
      )
    );
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.user?.name || o.userName || "").toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q) ||
      (o.address?.city || "").toLowerCase().includes(q) ||
      (o.couponCode || "").toLowerCase().includes(q) ||
      (o.items || []).some((it) => {
        const name = it.product && typeof it.product === "object" && it.product.name ? it.product.name : it.name || "";
        return name.toLowerCase().includes(q);
      });
    return matchFilter && matchSearch;
  });

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const editModalOrder    = editModalId    ? orders.find((o) => o._id === editModalId)    || null : null;
  const paymentModalOrder = paymentModalId ? orders.find((o) => o._id === paymentModalId) || null : null;

  // ── Descending Sr. No. helper ─────────────────────────────────────────────
  // filtered list mein index ke hisaab se descending number
  const getSrNo = (idxInFiltered) => filtered.length - idxInFiltered;

  return (
    <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen">

      <NewOrderAlerts alerts={newOrderAlerts} onDismiss={dismissAlert} onDismissAll={dismissAllAlerts} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Order Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">{orders.length} total orders · {riders.length} riders</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SSEStatusBadge status={sseStatus} />
          <CSVExportButton orders={filtered} filter={filter} />
          <button onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 shadow-sm transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <PaymentSummary orders={orders} />

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
          All · {orders.length}
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === key ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
            {cfg.label} · {counts[key] || 0}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, product, order ID, city, coupon..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all" />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              <option value="all">All Orders</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-800">All Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {filtered.length} of {orders.length} orders</p>
          </div>
          {filter !== "all" && filtered.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <Download size={11} />
              CSV sirf <span className="font-black capitalize">{filter}</span> orders export karega ({filtered.length})
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-blue-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="font-medium animate-pulse text-sm">Fetching orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <ShoppingBag className="w-12 h-12 text-gray-200" />
            <p className="font-medium text-gray-400">No orders found</p>
          </div>
        ) : (
          <>
            {/* Top mirror scrollbar */}
            <div
              ref={topScrollRef}
              onScroll={handleTopScroll}
              style={{ overflowX: "auto", overflowY: "hidden", height: "10px" }}
              className="border-b border-gray-100"
            >
              <div style={{ width: "2000px", height: "1px" }} />
            </div>

            {/* Table */}
            <div ref={tableScrollRef} onScroll={handleTableScroll} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      "Sr. No.", "Order", "Customer", "Items", "Vendors",
                      "Price / Coupon", "Payment", "Address", "Status",
                      "Update Status", "Rider", "Edit", "Payment", "Estimate", "Invoice",
                    ].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((o, idx) => {
                    const srNo           = getSrNo(idx);         // descending
                    const itemCount      = o.items?.length || 0;
                    const firstItem      = o.items?.[0];
                    const firstProduct   = firstItem?.product && typeof firstItem.product === "object" && firstItem.product.name ? firstItem.product : {};
                    const effectiveTotal = getEffectiveTotal(o);
                    const hasCoupon      = !!o.couponCode;

                    return (
                      <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">

                        {/* ── Sr. No. ── */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white text-xs font-black">
                            {srNo}
                          </span>
                        </td>

                        {/* Order ID */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-gray-100 px-2 py-1 rounded-lg">
                            #{o._id.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 text-sm truncate max-w-[110px]">
                                {o.user?.name || o.userName || "—"}
                              </div>
                              {o.address?.phone && (
                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                  <Phone className="w-3 h-3" /> {o.address.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 min-w-[130px]">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {firstProduct.image || firstItem?.image
                                ? <img src={firstProduct.image || firstItem?.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                : <Package className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-700 text-xs truncate max-w-[110px]">
                                {itemCount > 1
                                  ? `${firstProduct.name || firstItem?.name || "—"} +${itemCount - 1} more`
                                  : firstProduct.name || firstItem?.name || "—"}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {itemCount} product{itemCount !== 1 ? "s" : ""} · {o.items?.reduce((s, it) => s + it.quantity, 0) || 0} qty
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vendors */}
                        <td className="py-3.5 px-4">
                          <VendorCell order={o} onViewClick={setVendorViewOrder} />
                        </td>

                        {/* Price / Coupon */}
                        <td className="py-3.5 px-4 min-w-[130px]">
                          {hasCoupon ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400 line-through">₹{(o.totalPrice || 0).toFixed(2)}</span>
                                <span className="font-bold text-slate-800 text-sm">₹{effectiveTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Tag size={9} className="text-green-600 flex-shrink-0" />
                                <span className="text-[10px] text-green-700 font-bold">{o.couponCode}</span>
                                <span className="text-[10px] text-green-600">−₹{(o.couponDiscount || 0).toFixed(0)}</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-slate-800">₹{effectiveTotal.toFixed(2)}</div>
                              {o.paidAmount > 0 && o.paidAmount < effectiveTotal && (
                                <div className="text-[9px] text-amber-600 mt-0.5">
                                  ₹{Math.max(0, effectiveTotal - o.paidAmount).toFixed(2)} left
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Payment Badge */}
                        <td className="py-3.5 px-4"><PaymentBadge order={o} /></td>

                        {/* Address */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-1.5 max-w-[160px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-slate-600 leading-relaxed">
                              {o.address ? (
                                <>
                                  <div className="font-semibold text-slate-700">{o.address.name}</div>
                                  <div className="text-slate-500 truncate">{[o.address.street, o.address.city].filter(Boolean).join(", ")}</div>
                                  <div className="text-slate-400">{[o.address.state, o.address.pincode].filter(Boolean).join(" - ")}</div>
                                </>
                              ) : <span className="text-slate-400 italic">No address</span>}
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4"><StatusBadge status={o.status} /></td>

                        {/* Update Status */}
                        <td className="py-3.5 px-4">
                          <div className="relative">
                            <Clock className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none z-10 ${updating === o._id ? "text-blue-500 animate-pulse" : "text-gray-400"}`} />
                            <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} disabled={updating === o._id}
                              className="w-36 appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer disabled:opacity-60">
                              <option value="placed">Placed</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        </td>

                        {/* Rider */}
                        <td className="py-3.5 px-4">
                          {o.assignedRider ? (
                            <div className="flex flex-col gap-1 min-w-[90px]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                  <UserCheck size={12} className="text-green-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{o.assignedRider?.name || "Assigned"}</div>
                                  {o.assignedRider?.phone && <div className="text-[10px] text-gray-400">{o.assignedRider.phone}</div>}
                                </div>
                              </div>
                              <button onClick={() => setAssignModal(o)} className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold text-left">Change</button>
                            </div>
                          ) : (
                            <button onClick={() => setAssignModal(o)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-600 transition-all active:scale-95 whitespace-nowrap">
                              <Bike size={12} /> Assign
                            </button>
                          )}
                        </td>

                        {/* Edit */}
                        <td className="py-3.5 px-4">
                          <button onClick={() => setEditModalId(o._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-[11px] font-bold text-violet-600 transition-all active:scale-95">
                            <Pencil size={12} /> Edit
                          </button>
                        </td>

                        {/* Payment Button */}
                        <td className="py-3.5 px-4">
                          <button onClick={() => setPaymentModalId(o._id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[11px] font-bold transition-all active:scale-95 whitespace-nowrap ${
                              getPaymentStatus(o) === "paid"
                                ? "bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                                : getPaymentStatus(o) === "partial"
                                ? "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                                : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                            }`}>
                            <Wallet size={12} />
                            {getPaymentStatus(o) === "paid"
                              ? "Paid"
                              : getPaymentStatus(o) === "partial"
                              ? `₹${(o.paidAmount || 0).toFixed(0)} paid`
                              : "Pay"}
                          </button>
                        </td>

                        {/* Estimate */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => navigate("/admin/estimate", { state: { order: buildInvoiceOrder(o, true, srNo) } })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap">
                            <ClipboardList size={12} /> Estimate
                          </button>
                        </td>

                        {/* Invoice */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => navigate("/invoice", { state: { order: buildInvoiceOrder(o, false, srNo) } })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap">
                            <FileText size={12} /> Invoice
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> orders
              {filter !== "all" && <> · filtered by <span className="font-semibold text-gray-600 capitalize">{filter}</span></>}
            </p>
            <CSVExportButton orders={filtered} filter={filter} />
          </div>
        )}
      </div>

      {/* Modals */}
      {assignModal && (
        <AssignRiderModal order={assignModal} riders={riders} token={token}
          onClose={() => setAssignModal(null)} onAssigned={handleRiderAssigned} />
      )}
      {editModalOrder && (
        <EditOrderModal order={editModalOrder} token={token}
          onClose={() => setEditModalId(null)} onUpdated={handleOrderUpdated} />
      )}
      {paymentModalOrder && (
        <PaymentUpdateModal order={paymentModalOrder} token={token}
          onClose={() => setPaymentModalId(null)} onUpdated={handlePaymentUpdated} />
      )}
      {vendorViewOrder && (
        <VendorDetailsModal order={vendorViewOrder} onClose={() => setVendorViewOrder(null)} />
      )}
    </div>
  );
}