// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Package, User, Phone, MapPin, Filter, Clock,
//   ChevronDown, Search, RefreshCw, ShoppingBag,
//   Bike, UserCheck, X, FileText, Pencil, Plus, Minus, ClipboardList,
// } from "lucide-react";

// const ORDER_API   = "https://grocerrybackend.onrender.com/api/orders";
// const RIDER_API   = "https://grocerrybackend.onrender.com/api/riders";
// const PRODUCT_API = "https://grocerrybackend.onrender.com/api/categories/with-products";

// const STATUS_CONFIG = {
//   placed:    { label: "Placed",    bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
//   confirmed: { label: "Confirmed", bg: "bg-blue-100",  text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500"  },
//   shipped:   { label: "Shipped",   bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
//   delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
//   cancelled: { label: "Cancelled", bg: "bg-red-100",   text: "text-red-600",   border: "border-red-200",   dot: "bg-red-500"   },
// };

// const flattenProducts = (categories = []) => {
//   const products = [];
//   categories.forEach((cat) => {
//     cat.subcategories?.forEach((sub) => {
//       sub.subSubcategories?.forEach((ssub) => {
//         ssub.products?.forEach((p) => {
//           products.push({
//             _id:         p._id,
//             name:        p.name,
//             brand:       p.brand,
//             image:       p.image,
//             salePrice:   p.salePrice,
//             mrp:         p.mrp,
//             hsn:         p.hsn,
//             gstRate:     p.gstRate,
//             unit:        p.unit,
//             weight:      p.weight,
//             status:      p.status,
//             category:    cat.name,
//             subCategory: sub.name,
//           });
//         });
//       });
//     });
//   });
//   return products;
// };

// // ── buildInvoiceOrder: originalOrder se product fields properly uthao ──
// const buildInvoiceOrder = (o) => {
//   const items = (o.items || []).map((it) => {
//     // populated product object ya plain object dono handle karo
//     const product = (it.product && typeof it.product === "object") ? it.product : {};

//     return {
//       name:      product.name     || it.name     || "—",
//       quantity:  it.quantity      || 1,
//       // ── rate: originalOrder ka unitPrice — fetch pe lock hua, edit se affect nahi ──
//       rate:      it.unitPrice     || 0,
//       // ── mrp: product se aao, fallback unitPrice ──
//       mrp:       product.mrp      || it.mrp       || it.unitPrice || 0,
//       // ── hsn, gstRate, unit: product se aao (ab populate mein hain) ──
//       hsn:       product.hsn      || it.hsn       || "N/A",
//       gstRate:   product.gstRate  || it.gstRate   || 0,
//       unit:      product.unit     || it.unit       || "pcs",
//       packing:   product.weight
//                    ? `${product.weight.value}${product.weight.unit}`
//                    : (it.packing  || "—"),
//       unitPrice: it.unitPrice     || 0,
//       price:     it.price         || 0,
//     };
//   });

//   const grandTotal = items.reduce((s, i) => s + i.rate * i.quantity, 0);

//   return {
//     _id:         o._id,
//     createdAt:   o.createdAt,
//     status:      o.status,
//     invoiceNo:   `INV-${o._id.slice(-6).toUpperCase()}`,
//     paymentMode: o.paymentMode || "Cash",
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

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

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
//         <div className="text-[10px] text-gray-400 mt-0.5">
//           {rider.deliveries || 0} deliveries · ₹{rider.earnings || 0} earned
//         </div>
//       </div>
//     </label>
//   );
// };

// const AssignRiderModal = ({ order, riders, token, onClose, onAssigned }) => {
//   const currentRiderId = typeof order.assignedRider === "object"
//     ? order.assignedRider?._id
//     : order.assignedRider;

//   const [selectedRider, setSelectedRider] = useState(currentRiderId || "");
//   const [saving, setSaving] = useState(false);

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
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
//             <X size={20} />
//           </button>
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

//           {onlineRiders.length > 0 && (
//             <>
//               <p className="text-[9px] font-black text-green-600 uppercase tracking-widest px-1 pt-2">Online ({onlineRiders.length})</p>
//               {onlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//             </>
//           )}
//           {busyRiders.length > 0 && (
//             <>
//               <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-1 pt-2">On Delivery ({busyRiders.length})</p>
//               {busyRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//             </>
//           )}
//           {offlineRiders.length > 0 && (
//             <>
//               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1 pt-2">Offline ({offlineRiders.length})</p>
//               {offlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
//             </>
//           )}
//           {riders.length === 0 && (
//             <div className="text-center py-8 text-gray-400 text-sm">Koi rider registered nahi hai</div>
//           )}
//         </div>

//         <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
//           <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
//           >
//             {saving ? "Saving..." : "Confirm Assignment"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EditOrderModal = ({ order, token, onClose, onUpdated }) => {

//   const buildInitial = () => {
//     if (order.items && order.items.length > 0) {
//       return order.items.map((it) => {
//         const product = (it.product && typeof it.product === "object") ? it.product : {};
//         return {
//           productId: product._id || it.product || "",
//           name:      product.name || it.name || "—",
//           image:     product.image || it.image || "",
//           unitPrice: it.unitPrice || product.salePrice || 0,
//           quantity:  it.quantity || 1,
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
//         const res = await axios.get(PRODUCT_API, {
//           headers: { Authorization: `Bearer ${token2}` },
//         });
//         const flat = flattenProducts(res.data?.data || res.data || []);
//         setAllProducts(flat);
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
//     return allProducts.filter(
//       (p) =>
//         p.name.toLowerCase().includes(q) ||
//         p.brand?.toLowerCase().includes(q) ||
//         p.category?.toLowerCase().includes(q)
//     );
//   }, [productSearch, allProducts]);

//   const total = cartItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

//   const addProduct = (product) => {
//     setError("");
//     const exists = cartItems.findIndex((it) => it.productId === product._id);
//     if (exists !== -1) {
//       setCartItems((prev) =>
//         prev.map((it, i) => (i === exists ? { ...it, quantity: it.quantity + 1 } : it))
//       );
//     } else {
//       setCartItems((prev) => [
//         ...prev,
//         {
//           productId: product._id,
//           name:      product.name,
//           image:     product.image || "",
//           unitPrice: product.salePrice,
//           quantity:  1,
//         },
//       ]);
//     }
//   };

//   const removeItem = (idx) => {
//     if (cartItems.length === 1) {
//       setError("Order mein kam se kam ek item hona chahiye.");
//       return;
//     }
//     setError("");
//     setCartItems((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const changeQty = (idx, delta) => {
//     setCartItems((prev) =>
//       prev.map((it, i) =>
//         i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
//       )
//     );
//   };

//   const handleSave = async () => {
//     setError("");
//     if (cartItems.length === 0) {
//       setError("Order mein kam se kam ek item hona chahiye.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const res = await axios.put(
//         `${ORDER_API}/${order._id}/items`,
//         {
//           items: cartItems.map((it) => ({
//             productId: it.productId,
//             quantity:  it.quantity,
//           })),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         onUpdated(res.data.data);
//         onClose();
//       } else {
//         setError(res.data.message || "Update fail ho gaya.");
//       }
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
//             <p className="text-[11px] text-gray-400 mt-0.5">
//               #{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//           <div className="flex flex-col flex-1 border-r border-gray-100">
//             <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
//               <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
//                 Cart ({cartItems.length} items)
//               </span>
//               <button
//                 onClick={() => setShowProductPanel((v) => !v)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95"
//               >
//                 <Plus size={11} /> Product Add Karo
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-3 space-y-2">
//               {cartItems.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-40 gap-2">
//                   <ShoppingBag className="w-10 h-10 text-gray-200" />
//                   <p className="text-sm text-gray-400">Cart empty hai</p>
//                   <p className="text-xs text-gray-300">Right side se product add karo</p>
//                 </div>
//               ) : (
//                 cartItems.map((it, idx) => (
//                   <div key={`${it.productId}-${idx}`} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
//                     <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                       {it.image ? (
//                         <img src={it.image} alt={it.name} className="w-full h-full object-cover rounded-lg" />
//                       ) : (
//                         <Package className="w-4 h-4 text-gray-300" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-xs font-bold text-slate-700 truncate">{it.name}</div>
//                       <div className="text-[10px] text-slate-400 mt-0.5">
//                         Rs.{it.unitPrice} x {it.quantity} ={" "}
//                         <span className="font-bold text-slate-600">Rs.{(it.unitPrice * it.quantity).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <button
//                         onClick={() => changeQty(idx, -1)}
//                         disabled={it.quantity <= 1}
//                         className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                       >
//                         <Minus size={10} />
//                       </button>
//                       <span className="w-7 text-center text-xs font-bold text-slate-800">{it.quantity}</span>
//                       <button
//                         onClick={() => changeQty(idx, 1)}
//                         className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
//                       >
//                         <Plus size={10} />
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => removeItem(idx)}
//                       className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
//                     >
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
//                   <input
//                     type="text"
//                     placeholder="Product search karo..."
//                     value={productSearch}
//                     onChange={(e) => setProductSearch(e.target.value)}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     autoFocus
//                   />
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
//                       <button
//                         key={p._id}
//                         onClick={() => addProduct(p)}
//                         className="w-full flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left"
//                       >
//                         <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                           {p.image ? (
//                             <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
//                           ) : (
//                             <Package className="w-4 h-4 text-gray-300" />
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-[11px] font-bold text-slate-700 truncate">{p.name}</div>
//                           <div className="text-[10px] text-slate-400">{p.brand} · Rs.{p.salePrice}</div>
//                           {p.weight && (
//                             <div className="text-[9px] text-slate-300">{p.weight.value}{p.weight.unit}</div>
//                           )}
//                         </div>
//                         {inCart ? (
//                           <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
//                             +{inCart.quantity}
//                           </span>
//                         ) : (
//                           <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">ADD</span>
//                         )}
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
//             <div className="text-[10px] text-blue-400 mt-0.5">
//               {cartItems.reduce((s, it) => s + it.quantity, 0)} qty · {cartItems.length} products
//             </div>
//           </div>
//           <div className="text-2xl font-black text-blue-700">Rs.{total.toFixed(2)}</div>
//         </div>

//         <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100 flex-shrink-0">
//           <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving || cartItems.length === 0}
//             className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {saving ? "Saving..." : `Save Changes (${cartItems.length} items · Rs.${total.toFixed(2)})`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function AdminOrders() {
//   const [orders, setOrders]           = useState([]);
//   const [riders, setRiders]           = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [filter, setFilter]           = useState("all");
//   const [search, setSearch]           = useState("");
//   const [updating, setUpdating]       = useState(null);
//   const [assignModal, setAssignModal] = useState(null);
//   const [editModalId, setEditModalId] = useState(null);

//   const originalMapRef = useRef({});

//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

// const fetchOrders = async () => {
//   try {
//     setLoading(true);

//     const res = await axios.get(ORDER_API, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (res.data.success) {
//       const data = res.data.data;

//       // 🔥 LOCAL STORAGE LOCK (FINAL FIX)
//       const stored = localStorage.getItem("originalOrders");

//       if (!stored) {
//         const newMap = {};
//         data.forEach((o) => {
//           newMap[o._id] = JSON.parse(JSON.stringify(o));
//         });

//         localStorage.setItem("originalOrders", JSON.stringify(newMap));
//         originalMapRef.current = newMap;
//       } else {
//         originalMapRef.current = JSON.parse(stored);
//       }

//       setOrders(data);
//     }

//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };
//   const fetchRiders = async () => {
//     try {
//       const res = await axios.get(RIDER_API);
//       setRiders(res.data.data || []);
//     } catch {
//       console.error("Riders load nahi hue");
//     }
//   };

//   useEffect(() => { fetchOrders(); fetchRiders(); }, []);

//   const updateStatus = async (id, status) => {
//     setUpdating(id);
//     try {
//       await axios.put(
//         `${ORDER_API}/${id}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // ── sirf orders state update — originalMapRef touch nahi ──
//       setOrders((prev) =>
//         prev.map((o) => (o._id === id ? { ...o, status } : o))
//       );
//     } catch {
//       alert("Status update failed");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleRiderAssigned = (orderId, rider) => {
//     // ── sirf orders state update — originalMapRef touch nahi ──
//     setOrders((prev) =>
//       prev.map((o) => (o._id === orderId ? { ...o, assignedRider: rider } : o))
//     );
//   };

//   const handleOrderUpdated = (updated) => {
//     // ── sirf orders state update — originalMapRef touch nahi ──
//     // originalMapRef.current yahan update NAHI hota — estimate ke liye original safe rehta hai
//     setOrders((prev) =>
//       prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
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
//       (o.items || []).some((it) => {
//         const name = (it.product && typeof it.product === "object")
//           ? it.product.name
//           : (it.name || "");
//         return name.toLowerCase().includes(q);
//       });
//     return matchFilter && matchSearch;
//   });

//   const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
//     acc[s] = orders.filter((o) => o.status === s).length;
//     return acc;
//   }, {});

//   const editModalOrder = editModalId
//     ? orders.find((o) => o._id === editModalId) || null
//     : null;

//   return (
//     <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen">

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Order Management</h2>
//           <p className="text-xs text-slate-400 mt-0.5">{orders.length} total orders · {riders.length} riders</p>
//         </div>
//         <button
//           onClick={() => window.location.reload()}
//           className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 shadow-sm transition-colors"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-5">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
//         >
//           All · {orders.length}
//         </button>
//         {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
//           <button
//             key={key}
//             onClick={() => setFilter(key)}
//             className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === key ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
//           >
//             {cfg.label} · {counts[key] || 0}
//           </button>
//         ))}
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by name, product, order ID, city..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all"
//             />
//           </div>
//           <div className="relative w-full sm:w-48">
//             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//             >
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

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100">
//           <h3 className="font-bold text-slate-800">All Orders</h3>
//           <p className="text-xs text-slate-400 mt-0.5">Showing {filtered.length} of {orders.length} orders</p>
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
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   {["Order ID", "Customer", "Items", "Total", "Address", "Status", "Update Status", "Rider", "Edit", "Estimate", "Invoice"].map((h) => (
//                     <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {filtered.map((o) => {
//                   const itemCount = o.items?.length || 0;
//                   const firstItem = o.items?.[0];
//                   const firstProduct = (firstItem?.product && typeof firstItem.product === "object")
//                     ? firstItem.product
//                     : {};

//                   return (
//                     <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">

//                       <td className="py-3.5 px-4">
//                         <span className="font-mono text-xs font-bold text-slate-500 bg-gray-100 px-2 py-1 rounded-lg">
//                           #{o._id.slice(-6).toUpperCase()}
//                         </span>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
//                             <User className="w-4 h-4 text-blue-500" />
//                           </div>
//                           <div className="min-w-0">
//                             <div className="font-semibold text-slate-800 text-sm truncate max-w-[110px]">
//                               {o.user?.name || o.userName || "—"}
//                             </div>
//                             {o.address?.phone && (
//                               <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
//                                 <Phone className="w-3 h-3" /> {o.address.phone}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <div className="flex items-center gap-2 min-w-[130px]">
//                           <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                             {firstProduct.image || firstItem?.image ? (
//                               <img
//                                 src={firstProduct.image || firstItem?.image}
//                                 alt=""
//                                 className="w-full h-full object-cover rounded-lg"
//                               />
//                             ) : (
//                               <Package className="w-4 h-4 text-blue-400" />
//                             )}
//                           </div>
//                           <div className="min-w-0">
//                             <div className="font-medium text-slate-700 text-xs truncate max-w-[110px]">
//                               {itemCount > 1
//                                 ? `${firstProduct.name || firstItem?.name || "—"} +${itemCount - 1} more`
//                                 : firstProduct.name || firstItem?.name || "—"}
//                             </div>
//                             <div className="text-[10px] text-slate-400 mt-0.5">
//                               {itemCount} product{itemCount !== 1 ? "s" : ""} ·{" "}
//                               {o.items?.reduce((s, it) => s + it.quantity, 0) || 0} qty
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <div className="font-bold text-slate-800">Rs.{(o.totalPrice || o.price || 0).toFixed(2)}</div>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <div className="flex items-start gap-1.5 max-w-[160px]">
//                           <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
//                           <div className="text-xs text-slate-600 leading-relaxed">
//                             {o.address ? (
//                               <>
//                                 <div className="font-semibold text-slate-700">{o.address.name}</div>
//                                 <div className="text-slate-500 truncate">{[o.address.street, o.address.city].filter(Boolean).join(", ")}</div>
//                                 <div className="text-slate-400">{[o.address.state, o.address.pincode].filter(Boolean).join(" - ")}</div>
//                               </>
//                             ) : <span className="text-slate-400 italic">No address</span>}
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4"><StatusBadge status={o.status} /></td>

//                       <td className="py-3.5 px-4">
//                         <div className="relative">
//                           <Clock className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none z-10 ${updating === o._id ? "text-blue-500 animate-pulse" : "text-gray-400"}`} />
//                           <select
//                             value={o.status}
//                             onChange={(e) => updateStatus(o._id, e.target.value)}
//                             disabled={updating === o._id}
//                             className="w-36 appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer disabled:opacity-60"
//                           >
//                             <option value="placed">Placed</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="delivered">Delivered</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                           <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         {o.assignedRider ? (
//                           <div className="flex flex-col gap-1 min-w-[90px]">
//                             <div className="flex items-center gap-1.5">
//                               <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//                                 <UserCheck size={12} className="text-green-600" />
//                               </div>
//                               <div className="min-w-0">
//                                 <div className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{o.assignedRider?.name || "Assigned"}</div>
//                                 {o.assignedRider?.phone && <div className="text-[10px] text-gray-400">{o.assignedRider.phone}</div>}
//                               </div>
//                             </div>
//                             <button onClick={() => setAssignModal(o)} className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold text-left">Change</button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => setAssignModal(o)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-600 transition-all active:scale-95 whitespace-nowrap"
//                           >
//                             <Bike size={12} /> Assign
//                           </button>
//                         )}
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <button
//                           onClick={() => setEditModalId(o._id)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-[11px] font-bold text-violet-600 transition-all active:scale-95"
//                         >
//                           <Pencil size={12} /> Edit
//                         </button>
//                       </td>

//                       {/* ── Estimate: strict originalMapRef — edit/status se unaffected ── */}
//                       <td className="py-3.5 px-4">
//                         <button
//                           onClick={() => {
//                             const originalOrder = originalMapRef.current[o._id];
//                             if (!originalOrder) {
//                               alert("Original data nahi mila. Page refresh karein.");
//                               return;
//                             }
//                             navigate("/admin/estimate", {
//                               state: { order: buildInvoiceOrder(originalOrder) },
//                             });
//                           }}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
//                         >
//                           <ClipboardList size={12} /> Estimate
//                         </button>
//                       </td>

//                       {/* ── Invoice: current (edited) order ── */}
//                       <td className="py-3.5 px-4">
//                         <button
//                           onClick={() =>
//                             navigate("/invoice", {
//                               state: { order: buildInvoiceOrder(o) },
//                             })
//                           }
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
//                         >
//                           <FileText size={12} /> Invoice
//                         </button>
//                       </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {!loading && filtered.length > 0 && (
//           <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
//             <p className="text-xs text-gray-400">
//               Showing <span className="font-semibold text-gray-600">{filtered.length}</span> orders
//               {filter !== "all" && <> · filtered by <span className="font-semibold text-gray-600 capitalize">{filter}</span></>}
//             </p>
//           </div>
//         )}
//       </div>

//       {assignModal && (
//         <AssignRiderModal
//           order={assignModal}
//           riders={riders}
//           token={token}
//           onClose={() => setAssignModal(null)}
//           onAssigned={handleRiderAssigned}
//         />
//       )}

//       {editModalOrder && (
//         <EditOrderModal
//           order={editModalOrder}
//           token={token}
//           onClose={() => setEditModalId(null)}
//           onUpdated={handleOrderUpdated}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Package, User, Phone, MapPin, Filter, Clock,
  ChevronDown, Search, RefreshCw, ShoppingBag,
  Bike, UserCheck, X, FileText, Pencil, Plus, Minus, ClipboardList,
  Download,
} from "lucide-react";

const ORDER_API   = "https://grocerrybackend.onrender.com/api/orders";
const RIDER_API   = "https://grocerrybackend.onrender.com/api/riders";
const PRODUCT_API = "https://grocerrybackend.onrender.com/api/categories/with-products";

const STATUS_CONFIG = {
  placed:    { label: "Placed",    bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100",  text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500"  },
  shipped:   { label: "Shipped",   bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
  delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", bg: "bg-red-100",   text: "text-red-600",   border: "border-red-200",   dot: "bg-red-500"   },
};

const flattenProducts = (categories = []) => {
  const products = [];
  categories.forEach((cat) => {
    cat.subcategories?.forEach((sub) => {
      sub.subSubcategories?.forEach((ssub) => {
        ssub.products?.forEach((p) => {
          products.push({
            _id:         p._id,
            name:        p.name,
            brand:       p.brand,
            image:       p.image,
            salePrice:   p.salePrice,
            mrp:         p.mrp,
            hsn:         p.hsn,
            gstRate:     p.gstRate,
            unit:        p.unit,
            weight:      p.weight,
            status:      p.status,
            category:    cat.name,
            subCategory: sub.name,
          });
        });
      });
    });
  });
  return products;
};

const buildInvoiceOrder = (o) => {
  const items = (o.items || []).map((it) => {
    const product = (it.product && typeof it.product === "object") ? it.product : {};
    return {
      name:      product.name     || it.name     || "—",
      quantity:  it.quantity      || 1,
      rate:      it.unitPrice     || 0,
      mrp:       product.mrp      || it.mrp       || it.unitPrice || 0,
      hsn:       product.hsn      || it.hsn       || "N/A",
      gstRate:   product.gstRate  || it.gstRate   || 0,
      unit:      product.unit     || it.unit       || "pcs",
      packing:   product.weight
                   ? `${product.weight.value}${product.weight.unit}`
                   : (it.packing  || "—"),
      unitPrice: it.unitPrice     || 0,
      price:     it.price         || 0,
    };
  });

  const grandTotal = items.reduce((s, i) => s + i.rate * i.quantity, 0);

  return {
    _id:         o._id,
    createdAt:   o.createdAt,
    status:      o.status,
    invoiceNo:   `INV-${o._id.slice(-6).toUpperCase()}`,
    paymentMode: o.paymentMode || "Cash",
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

const escapeCSV = (val) => {
  if (val === null || val === undefined) return "";
  const str = String(val);
 
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const buildCSV = (orders) => {
  const headers = [
    "Order ID",
    "Invoice No",
    "Date",
    "Status",
    "Payment Mode",
    "Customer Name",
    "Customer Phone",
    "Address Street",
    "Address City",
    "Address State",
    "Address Pincode",
    "Assigned Rider",
    "Rider Phone",
    "Product Name",
    "HSN",
    "Unit",
    "Packing",
    "GST Rate (%)",
    "MRP (Rs)",
    "Sale Price (Rs)",
    "Quantity",
    "Item Total (Rs)",
    "Order Total (Rs)",
  ];

  const rows = [];

  orders.forEach((o) => {
    const orderId    = o._id;
    const invoiceNo  = `INV-${o._id.slice(-6).toUpperCase()}`;
    const date = (() => {
      if (!o.createdAt) return "";
      const d = new Date(o.createdAt);
      if (isNaN(d.getTime())) return "";
      const dd   = String(d.getDate()).padStart(2, "0");
      const mm   = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    })();
    const status      = o.status || "";
    const paymentMode = o.paymentMode || "Cash";
    const custName    = o.user?.name || o.userName || "";
    const custPhone   = o.address?.phone || "";
    const street      = o.address?.street  || "";
    const city        = o.address?.city    || "";
    const state       = o.address?.state   || "";
    const pincode     = o.address?.pincode || "";
    const riderName   = o.assignedRider?.name  || (typeof o.assignedRider === "string" ? o.assignedRider : "") || "";
    const riderPhone  = o.assignedRider?.phone || "";
    const orderTotal  = (o.totalPrice || o.price || 0).toFixed(2);

    const items = o.items || [];

    if (items.length === 0) {
     
      rows.push([
        orderId, invoiceNo, (date ? `\t${date}` : ""), status, paymentMode,
        custName, custPhone,
        street, city, state, pincode,
        riderName, riderPhone,
        "", "", "", "", "", "", "", "", "",
        orderTotal,
      ]);
    } else {
      items.forEach((it) => {
        const product   = (it.product && typeof it.product === "object") ? it.product : {};
        const prodName  = product.name    || it.name    || "—";
        const hsn       = product.hsn     || it.hsn     || "N/A";
        const unit      = product.unit    || it.unit    || "pcs";
        const packing   = product.weight
          ? `${product.weight.value}${product.weight.unit}`
          : (it.packing || "—");
        const gstRate   = product.gstRate || it.gstRate || 0;
        const mrp       = product.mrp     || it.mrp     || it.unitPrice || 0;
        const salePrice = it.unitPrice    || 0;
        const qty       = it.quantity     || 1;
        const itemTotal = (salePrice * qty).toFixed(2);

        rows.push([
          orderId, invoiceNo, (date ? `\t${date}` : ""), status, paymentMode,
          custName, custPhone,
          street, city, state, pincode,
          riderName, riderPhone,
          prodName, hsn, unit, packing, gstRate, mrp, salePrice, qty, itemTotal,
          orderTotal,
        ]);
      });
    }
  });

  const csvLines = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ];

  return csvLines.join("\n");
};


const downloadCSV = (csvString, filename) => {
  const BOM = "\uFEFF"; // UTF-8 BOM — Excel ke liye zaroori
  const blob = new Blob([BOM + csvString], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


const CSVExportButton = ({ orders, filter }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (orders.length === 0) {
      alert("Export ke liye koi order nahi hai.");
      return;
    }
    setExporting(true);
    try {
      const csv      = buildCSV(orders);
      const today    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const label    = filter !== "all" ? `_${filter}` : "";
      const filename = `orders${label}_${today}.csv`;
      downloadCSV(csv, filename);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("CSV export fail ho gaya. Console check karein.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || orders.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all"
      title={`${orders.length} orders export karein CSV mein`}
    >
      <Download className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
      {exporting ? "Exporting..." : `CSV Export (${orders.length})`}
    </button>
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
        <div className="text-[10px] text-gray-400 mt-0.5">
          {rider.deliveries || 0} deliveries · ₹{rider.earnings || 0} earned
        </div>
      </div>
    </label>
  );
};


const AssignRiderModal = ({ order, riders, token, onClose, onAssigned }) => {
  const currentRiderId = typeof order.assignedRider === "object"
    ? order.assignedRider?._id
    : order.assignedRider;

  const [selectedRider, setSelectedRider] = useState(currentRiderId || "");
  const [saving, setSaving] = useState(false);

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
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={20} />
          </button>
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

          {onlineRiders.length > 0 && (
            <>
              <p className="text-[9px] font-black text-green-600 uppercase tracking-widest px-1 pt-2">Online ({onlineRiders.length})</p>
              {onlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
            </>
          )}
          {busyRiders.length > 0 && (
            <>
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-1 pt-2">On Delivery ({busyRiders.length})</p>
              {busyRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
            </>
          )}
          {offlineRiders.length > 0 && (
            <>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1 pt-2">Offline ({offlineRiders.length})</p>
              {offlineRiders.map((r) => <RiderOption key={r._id} rider={r} selected={selectedRider === r._id} onSelect={() => setSelectedRider(r._id)} />)}
            </>
          )}
          {riders.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">Koi rider registered nahi hai</div>
          )}
        </div>

        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};



const EditOrderModal = ({ order, token, onClose, onUpdated }) => {

  const buildInitial = () => {
    if (order.items && order.items.length > 0) {
      return order.items.map((it) => {
        const product = (it.product && typeof it.product === "object") ? it.product : {};
        return {
          productId: product._id || it.product || "",
          name:      product.name || it.name || "—",
          image:     product.image || it.image || "",
          unitPrice: it.unitPrice || product.salePrice || 0,
          quantity:  it.quantity || 1,
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
        const res = await axios.get(PRODUCT_API, {
          headers: { Authorization: `Bearer ${token2}` },
        });
        const flat = flattenProducts(res.data?.data || res.data || []);
        setAllProducts(flat);
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
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [productSearch, allProducts]);

  const total = cartItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  const addProduct = (product) => {
    setError("");
    const exists = cartItems.findIndex((it) => it.productId === product._id);
    if (exists !== -1) {
      setCartItems((prev) =>
        prev.map((it, i) => (i === exists ? { ...it, quantity: it.quantity + 1 } : it))
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          name:      product.name,
          image:     product.image || "",
          unitPrice: product.salePrice,
          quantity:  1,
        },
      ]);
    }
  };

  const removeItem = (idx) => {
    if (cartItems.length === 1) {
      setError("Order mein kam se kam ek item hona chahiye.");
      return;
    }
    setError("");
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const changeQty = (idx, delta) => {
    setCartItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
      )
    );
  };

  const handleSave = async () => {
    setError("");
    if (cartItems.length === 0) {
      setError("Order mein kam se kam ek item hona chahiye.");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(
        `${ORDER_API}/${order._id}/items`,
        {
          items: cartItems.map((it) => ({
            productId: it.productId,
            quantity:  it.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        onUpdated(res.data.data);
        onClose();
      } else {
        setError(res.data.message || "Update fail ho gaya.");
      }
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
            <p className="text-[11px] text-gray-400 mt-0.5">
              #{order._id.slice(-6).toUpperCase()} · {order.user?.name || order.userName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 border-r border-gray-100">
            <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                Cart ({cartItems.length} items)
              </span>
              <button
                onClick={() => setShowProductPanel((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95"
              >
                <Plus size={11} /> Product Add Karo
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                  <p className="text-sm text-gray-400">Cart empty hai</p>
                  <p className="text-xs text-gray-300">Right side se product add karo</p>
                </div>
              ) : (
                cartItems.map((it, idx) => (
                  <div key={`${it.productId}-${idx}`} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{it.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Rs.{it.unitPrice} x {it.quantity} ={" "}
                        <span className="font-bold text-slate-600">Rs.{(it.unitPrice * it.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => changeQty(idx, -1)}
                        disabled={it.quantity <= 1}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-800">{it.quantity}</span>
                      <button
                        onClick={() => changeQty(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
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
                  <input
                    type="text"
                    placeholder="Product search karo..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
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
                      <button
                        key={p._id}
                        onClick={() => addProduct(p)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-slate-700 truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand} · Rs.{p.salePrice}</div>
                          {p.weight && (
                            <div className="text-[9px] text-slate-300">{p.weight.value}{p.weight.unit}</div>
                          )}
                        </div>
                        {inCart ? (
                          <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            +{inCart.quantity}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">ADD</span>
                        )}
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
            <div className="text-[10px] text-blue-400 mt-0.5">
              {cartItems.reduce((s, it) => s + it.quantity, 0)} qty · {cartItems.length} products
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">Rs.{total.toFixed(2)}</div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || cartItems.length === 0}
            className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : `Save Changes (${cartItems.length} items · Rs.${total.toFixed(2)})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function AdminOrders() {
  const [orders, setOrders]           = useState([]);
  const [riders, setRiders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [updating, setUpdating]       = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [editModalId, setEditModalId] = useState(null);

  const originalMapRef = useRef({});

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ORDER_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const data = res.data.data;
        const stored = localStorage.getItem("originalOrders");
        if (!stored) {
          const newMap = {};
          data.forEach((o) => { newMap[o._id] = JSON.parse(JSON.stringify(o)); });
          localStorage.setItem("originalOrders", JSON.stringify(newMap));
          originalMapRef.current = newMap;
        } else {
          originalMapRef.current = JSON.parse(stored);
        }
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await axios.get(RIDER_API);
      setRiders(res.data.data || []);
    } catch {
      console.error("Riders load nahi hue");
    }
  };

  useEffect(() => { fetchOrders(); fetchRiders(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(
        `${ORDER_API}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)));
  };

  // filtered orders — search + status filter
  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.user?.name || o.userName || "").toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q) ||
      (o.address?.city || "").toLowerCase().includes(q) ||
      (o.items || []).some((it) => {
        const name = (it.product && typeof it.product === "object")
          ? it.product.name
          : (it.name || "");
        return name.toLowerCase().includes(q);
      });
    return matchFilter && matchSearch;
  });

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const editModalOrder = editModalId
    ? orders.find((o) => o._id === editModalId) || null
    : null;

  return (
    <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Order Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">{orders.length} total orders · {riders.length} riders</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* ── CSV Export Button ── */}
          <CSVExportButton orders={filtered} filter={filter} />

          {/* ── Refresh Button ── */}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Status Filter Pills ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
        >
          All · {orders.length}
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === key ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
          >
            {cfg.label} · {counts[key] || 0}
          </button>
        ))}
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, product, order ID, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
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

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-800">All Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {filtered.length} of {orders.length} orders</p>
          </div>
          {/* ── Inline CSV hint when filtered ── */}
          {filter !== "all" && filtered.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <Download size={11} />
              CSV button sirf <span className="font-black capitalize">{filter}</span> orders export karega ({filtered.length})
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Total", "Address", "Status", "Update Status", "Rider", "Edit", "Estimate", "Invoice"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((o) => {
                  const itemCount   = o.items?.length || 0;
                  const firstItem   = o.items?.[0];
                  const firstProduct = (firstItem?.product && typeof firstItem.product === "object")
                    ? firstItem.product
                    : {};

                  return (
                    <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-gray-100 px-2 py-1 rounded-lg">
                          #{o._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

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

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 min-w-[130px]">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {firstProduct.image || firstItem?.image ? (
                              <img src={firstProduct.image || firstItem?.image} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-700 text-xs truncate max-w-[110px]">
                              {itemCount > 1
                                ? `${firstProduct.name || firstItem?.name || "—"} +${itemCount - 1} more`
                                : firstProduct.name || firstItem?.name || "—"}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {itemCount} product{itemCount !== 1 ? "s" : ""} ·{" "}
                              {o.items?.reduce((s, it) => s + it.quantity, 0) || 0} qty
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">Rs.{(o.totalPrice || o.price || 0).toFixed(2)}</div>
                      </td>

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

                      <td className="py-3.5 px-4"><StatusBadge status={o.status} /></td>

                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <Clock className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none z-10 ${updating === o._id ? "text-blue-500 animate-pulse" : "text-gray-400"}`} />
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            disabled={updating === o._id}
                            className="w-36 appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer disabled:opacity-60"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </td>

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
                          <button
                            onClick={() => setAssignModal(o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-600 transition-all active:scale-95 whitespace-nowrap"
                          >
                            <Bike size={12} /> Assign
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setEditModalId(o._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-[11px] font-bold text-violet-600 transition-all active:scale-95"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const originalOrder = originalMapRef.current[o._id];
                            if (!originalOrder) { alert("Original data nahi mila. Page refresh karein."); return; }
                            navigate("/admin/estimate", { state: { order: buildInvoiceOrder(originalOrder) } });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
                        >
                          <ClipboardList size={12} /> Estimate
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => navigate("/invoice", { state: { order: buildInvoiceOrder(o) } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
                        >
                          <FileText size={12} /> Invoice
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> orders
              {filter !== "all" && <> · filtered by <span className="font-semibold text-gray-600 capitalize">{filter}</span></>}
            </p>
            {/* ── Bottom CSV shortcut ── */}
            <CSVExportButton orders={filtered} filter={filter} />
          </div>
        )}
      </div>

      {assignModal && (
        <AssignRiderModal
          order={assignModal}
          riders={riders}
          token={token}
          onClose={() => setAssignModal(null)}
          onAssigned={handleRiderAssigned}
        />
      )}

      {editModalOrder && (
        <EditOrderModal
          order={editModalOrder}
          token={token}
          onClose={() => setEditModalId(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}