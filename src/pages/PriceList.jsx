// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import axios from "axios";
// import {
//   Search, Plus, Edit, Trash2, Copy, MoreVertical, Check, X,
//   AlertCircle, CheckCircle, Info, Loader2,
//   ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
//   Download, Upload, Filter, Eye, EyeOff, ChevronDown, Tag,
//   ImagePlus, ZoomIn, Images, Star, DollarSign, Layers, Sparkles,
//   Hash, Settings, TrendingUp, TrendingDown, ArrowRight,
// } from "lucide-react";

// const API_URL      = "https://grocerrybackend.onrender.com/api/prices";
// const CATEGORY_URL = "https://grocerrybackend.onrender.com/api/categories";
// const DISCOUNT_URL = "https://grocerrybackend.onrender.com/api/discount";

// const GST_BADGE = {
//   0:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
//   5:  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
//   12: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
//   18: { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500"  },
//   28: { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
// };

// const MAX_GALLERY = 5;
// const EMPTY_ROW = () => ({
//   id:        Date.now() + Math.random(),
//   minQty:    "",
//   maxQty:    "",
//   profit:    "",
//   unitPrice: "",
// });

// const calcUnitPrice = (basePrice, profit) => {
//   const b = Number(basePrice) || 0;
//   const p = profit === "" || profit === null || profit === undefined ? 0 : Number(profit);
//   return Number((b + p).toFixed(2));
// };

// const calcProfit = (basePrice, unitPrice) => {
//   const b = Number(basePrice) || 0;
//   const u = Number(unitPrice) || 0;
//   return Number((u - b).toFixed(2));
// };

// const PriceRangesSection = ({ productId, basePrice, existingRanges, onRangesChange }) => {
//   const [rows,       setRows]       = useState([]);
//   const [saving,     setSaving]     = useState(false);
//   const [savedRanges, setSavedRanges] = useState(existingRanges || []);
//   const [deletingId, setDeletingId] = useState(null);
//   const [editingId,  setEditingId]  = useState(null);
//   const [editRow,    setEditRow]    = useState(null);
//   const [savingEdit, setSavingEdit] = useState(false);

//   const base = Number(basePrice) || 0;

//   useEffect(() => { setSavedRanges(existingRanges || []); }, [existingRanges]);

//   /* ── new row helpers ── */
//   const addRow    = () => setRows((p) => [...p, EMPTY_ROW()]);
//   const removeRow = (id) => setRows((p) => p.filter((r) => r.id !== id));

//   const updateRow = (id, field, value) => {
//     setRows((prev) => prev.map((r) => {
//       if (r.id !== id) return r;
//       const updated = { ...r, [field]: value };
//       // Auto-sync unitPrice <-> profit
//       if (field === "profit") {
//         updated.unitPrice = value === "" ? "" : String(calcUnitPrice(base, value));
//       }
//       if (field === "unitPrice") {
//         updated.profit = value === "" ? "" : String(calcProfit(base, value));
//       }
//       return updated;
//     }));
//   };

//   /* ── save new rows ── */
//   const saveRows = async () => {
//     // Validate
//     for (const row of rows) {
//       if (!row.minQty) return alert("Min Qty required hai.");
//       if (Number(row.minQty) < 1) return alert("Min Qty must be ≥ 1");
//       if (row.maxQty && Number(row.maxQty) < Number(row.minQty))
//         return alert("Max Qty must be ≥ Min Qty");
//       if (row.unitPrice === "" && row.profit === "")
//         return alert("Profit ya Unit Price enter karo.");
//     }
//     if (!productId) {
//       return alert("Pehle product save karo, phir price ranges add kar sakte ho.");
//     }

//     setSaving(true);
//     try {
//       const results = await Promise.all(
//         rows.map((row) => {
//           const finalProfit    = row.profit    !== "" ? Number(row.profit)    : calcProfit(base, row.unitPrice);
//           const finalUnitPrice = row.unitPrice !== "" ? Number(row.unitPrice) : calcUnitPrice(base, row.profit);
//           return axios.post(`${DISCOUNT_URL}/add`, {
//             product:   productId,
//             minQty:    Number(row.minQty),
//             maxQty:    row.maxQty !== "" ? Number(row.maxQty) : null,
//             basePrice: base,
//             profit:    finalProfit,
//             unitPrice: finalUnitPrice,
//           });
//         })
//       );
//       const newSaved = results.map((r) => r.data.data);
//       const updated  = [...savedRanges, ...newSaved];
//       setSavedRanges(updated);
//       setRows([]);
//       if (onRangesChange) onRangesChange(updated);
//     } catch (err) {
//       alert(err.response?.data?.message || "Price ranges save karne mein error aaya");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ── delete saved ── */
//   const deleteSaved = async (ruleId) => {
//     if (!window.confirm("Is price range ko delete karna chahte ho?")) return;
//     setDeletingId(ruleId);
//     try {
//       await axios.delete(`${DISCOUNT_URL}/${ruleId}`);
//       const updated = savedRanges.filter((r) => r._id !== ruleId);
//       setSavedRanges(updated);
//       if (onRangesChange) onRangesChange(updated);
//     } catch {
//       alert("Delete karne mein error aaya");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   /* ── inline edit saved ── */
//   const startEdit = (rule) => {
//     setEditingId(rule._id);
//     setEditRow({
//       minQty:    String(rule.minQty),
//       maxQty:    rule.maxQty != null ? String(rule.maxQty) : "",
//       profit:    String(rule.profit ?? calcProfit(rule.basePrice || base, rule.unitPrice)),
//       unitPrice: String(rule.unitPrice),
//       basePrice: String(rule.basePrice || base),
//     });
//   };

//   const cancelEdit = () => { setEditingId(null); setEditRow(null); };

//   const updateEditRow = (field, value) => {
//     setEditRow((prev) => {
//       const updated = { ...prev, [field]: value };
//       const editBase = Number(prev.basePrice) || base;
//       if (field === "profit") {
//         updated.unitPrice = value === "" ? "" : String(calcUnitPrice(editBase, value));
//       }
//       if (field === "unitPrice") {
//         updated.profit = value === "" ? "" : String(calcProfit(editBase, value));
//       }
//       return updated;
//     });
//   };

//   const saveEdit = async (ruleId) => {
//     if (!editRow.minQty) return alert("Min Qty required");
//     setSavingEdit(true);
//     try {
//       const editBase       = Number(editRow.basePrice) || base;
//       const finalProfit    = editRow.profit    !== "" ? Number(editRow.profit)    : calcProfit(editBase, editRow.unitPrice);
//       const finalUnitPrice = editRow.unitPrice !== "" ? Number(editRow.unitPrice) : calcUnitPrice(editBase, editRow.profit);
//       const res = await axios.put(`${DISCOUNT_URL}/${ruleId}`, {
//         minQty:    Number(editRow.minQty),
//         maxQty:    editRow.maxQty !== "" ? Number(editRow.maxQty) : null,
//         profit:    finalProfit,
//         unitPrice: finalUnitPrice,
//       });
//       const updated = savedRanges.map((r) =>
//         r._id === ruleId ? res.data.data : r
//       );
//       setSavedRanges(updated);
//       setEditingId(null);
//       setEditRow(null);
//       if (onRangesChange) onRangesChange(updated);
//     } catch (err) {
//       alert(err.response?.data?.message || "Update failed");
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   /* ── profit badge color ── */
//   const profitColor = (profit) => {
//     if (profit == null || profit === 0)
//       return { bg: "bg-gray-100", text: "text-gray-600", icon: null };
//     if (profit > 0)
//       return { bg: "bg-green-100", text: "text-green-700", icon: <TrendingUp className="w-3 h-3" /> };
//     return { bg: "bg-red-100", text: "text-red-700", icon: <TrendingDown className="w-3 h-3" /> };
//   };

//   return (
//     <div className="space-y-4">

//       {/* ── Base Price Banner ── */}
//       <div className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
//         <DollarSign className="w-4 h-4 text-blue-500 flex-shrink-0" />
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-xs font-semibold text-blue-700">Product Base Price:</span>
//           <span className="font-mono font-bold text-blue-800 text-sm">
//             {base > 0 ? `₹${base.toFixed(2)}` : "—"}
//           </span>
//           {base === 0 && (
//             <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
//               Pehle Base Price set karo
//             </span>
//           )}
//           <span className="text-[11px] text-blue-500">
//             Unit Price = Base Price + Profit/Loss
//           </span>
//         </div>
//       </div>

//       {/* ── Saved Ranges ── */}
//       {savedRanges.length > 0 && (
//         <div className="rounded-xl border border-green-200 bg-green-50/40 overflow-hidden">
//           <div className="px-4 py-2.5 border-b border-green-200 bg-green-50 flex items-center gap-2">
//             <Layers className="w-3.5 h-3.5 text-green-600" />
//             <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
//               Saved Price Ranges ({savedRanges.length})
//             </span>
//           </div>
//           <div className="divide-y divide-green-100">
//             {savedRanges.map((rule, idx) => {
//               const ruleBase   = Number(rule.basePrice || base);
//               const ruleProfit = rule.profit != null
//                 ? Number(rule.profit)
//                 : calcProfit(ruleBase, rule.unitPrice);
//               const pc = profitColor(ruleProfit);
//               const isEditing = editingId === rule._id;

//               return (
//                 <div key={rule._id || idx}>
//                   {isEditing ? (
//                     /* ── Edit Row ── */
//                     <div className="px-4 py-3 bg-blue-50/50">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
//                           Editing Range #{idx + 1}
//                         </span>
//                         <span className="text-[10px] text-gray-400">
//                           Base: ₹{Number(editRow.basePrice || base).toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
//                         {/* Min Qty */}
//                         <div>
//                           <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                             Min Qty <span className="text-red-500">*</span>
//                           </label>
//                           <input type="number" min="1" value={editRow.minQty}
//                             onChange={(e) => updateEditRow("minQty", e.target.value)}
//                             className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
//                         </div>
//                         {/* Max Qty */}
//                         <div>
//                           <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                             Max Qty <span className="text-gray-400 font-normal">(optional)</span>
//                           </label>
//                           <input type="number" min="1" value={editRow.maxQty}
//                             onChange={(e) => updateEditRow("maxQty", e.target.value)}
//                             placeholder="∞"
//                             className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
//                         </div>
//                         {/* Profit */}
//                         <div>
//                           <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                             Profit / Loss (₹)
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">±</span>
//                             <input type="number" step="0.01" value={editRow.profit}
//                               onChange={(e) => updateEditRow("profit", e.target.value)}
//                               placeholder="0.00"
//                               className="w-full border border-green-200 rounded-lg pl-6 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50/50" />
//                           </div>
//                         </div>
//                         {/* Unit Price */}
//                         <div>
//                           <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                             Unit Price (₹) <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₹</span>
//                             <input type="number" min="0" step="0.01" value={editRow.unitPrice}
//                               onChange={(e) => updateEditRow("unitPrice", e.target.value)}
//                               placeholder="0.00"
//                               className="w-full border border-blue-200 rounded-lg pl-6 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50" />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button type="button" onClick={() => saveEdit(rule._id)} disabled={savingEdit}
//                           className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-semibold disabled:opacity-70">
//                           {savingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
//                           Save
//                         </button>
//                         <button type="button" onClick={cancelEdit}
//                           className="px-3.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs">
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     /* ── Display Row ── */
//                     <div className="flex items-center gap-2 px-4 py-2.5">
//                       {/* Index */}
//                       <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
//                         <span className="text-[10px] font-bold text-green-700">{idx + 1}</span>
//                       </div>

//                       {/* Qty Range */}
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         <div className="bg-white border border-green-200 rounded-lg px-2.5 py-1.5 text-center min-w-[60px]">
//                           <div className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Min Qty</div>
//                           <div className="text-sm font-bold text-gray-800">{rule.minQty}</div>
//                         </div>
//                         <span className="text-gray-400 text-xs">—</span>
//                         <div className="bg-white border border-green-200 rounded-lg px-2.5 py-1.5 text-center min-w-[60px]">
//                           <div className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Max Qty</div>
//                           <div className="text-sm font-bold text-gray-800">
//                             {rule.maxQty != null ? rule.maxQty : <span className="text-gray-400 text-xs">∞</span>}
//                           </div>
//                         </div>
//                       </div>

//                       <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />

//                       {/* Base Price */}
//                       <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-center min-w-[80px] flex-shrink-0">
//                         <div className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Base</div>
//                         <div className="text-xs font-semibold text-gray-600">₹{ruleBase.toFixed(2)}</div>
//                       </div>

//                       {/* + / - */}
//                       <span className="text-gray-400 text-sm font-bold flex-shrink-0">
//                         {ruleProfit >= 0 ? "+" : ""}
//                       </span>

//                       {/* Profit badge */}
//                       <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-center min-w-[70px] flex-shrink-0 ${pc.bg}`}>
//                         {pc.icon && <span className={pc.text}>{pc.icon}</span>}
//                         <div>
//                           <div className={`text-[9px] uppercase font-semibold mb-0.5 ${pc.text}`}>Profit</div>
//                           <div className={`text-xs font-bold ${pc.text}`}>
//                             {ruleProfit >= 0 ? "+" : ""}₹{ruleProfit.toFixed(2)}
//                           </div>
//                         </div>
//                       </div>

//                       <span className="text-gray-300 font-bold flex-shrink-0">=</span>

//                       {/* Unit Price */}
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 text-center min-w-[90px] flex-shrink-0">
//                         <div className="text-[9px] text-blue-500 uppercase font-semibold mb-0.5">Unit Price</div>
//                         <div className="text-sm font-bold text-blue-700">
//                           ₹{Number(rule.unitPrice).toFixed(2)}
//                         </div>
//                       </div>

//                       {/* Base changed warning */}
//                       {ruleBase !== base && base > 0 && (
//                         <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
//                           ⚠ Base changed
//                         </span>
//                       )}

//                       {/* Actions */}
//                       <div className="ml-auto flex items-center gap-1 flex-shrink-0">
//                         <button type="button" onClick={() => startEdit(rule)}
//                           className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors border border-blue-100">
//                           <Edit className="w-3 h-3" />
//                         </button>
//                         <button type="button" onClick={() => deleteSaved(rule._id)} disabled={deletingId === rule._id}
//                           className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100 disabled:opacity-50">
//                           {deletingId === rule._id
//                             ? <Loader2 className="w-3 h-3 animate-spin" />
//                             : <Trash2 className="w-3 h-3" />}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* ── New Pending Rows ── */}
//       {rows.length > 0 && (
//         <div className="rounded-xl border border-blue-200 bg-blue-50/30 overflow-hidden">
//           <div className="px-4 py-2.5 border-b border-blue-200 bg-blue-50 flex items-center gap-2">
//             <Plus className="w-3.5 h-3.5 text-blue-600" />
//             <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
//               New Ranges (pending save)
//             </span>
//           </div>
//           <div className="p-3 space-y-3">
//             {rows.map((row, idx) => {
//               const rowProfit    = row.profit    !== "" ? Number(row.profit)    : 0;
//               const rowUnitPrice = row.unitPrice !== "" ? Number(row.unitPrice) : calcUnitPrice(base, rowProfit);
//               const pc = profitColor(rowProfit);

//               return (
//                 <div key={row.id} className="bg-white rounded-xl border border-blue-100 px-3 py-3 shadow-sm">
//                   {/* Row header */}
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-[10px] font-bold text-blue-700">
//                           {(savedRanges.length || 0) + idx + 1}
//                         </span>
//                       </div>
//                       {/* Preview formula */}
//                       {base > 0 && (
//                         <span className="text-[11px] text-gray-500">
//                           ₹{base.toFixed(2)}
//                           {rowProfit !== 0 && (
//                             <span className={rowProfit > 0 ? "text-green-600" : "text-red-600"}>
//                               {rowProfit >= 0 ? " + " : " - "}₹{Math.abs(rowProfit).toFixed(2)}
//                             </span>
//                           )}
//                           <span className="text-blue-700 font-semibold"> = ₹{rowUnitPrice.toFixed(2)}</span>
//                         </span>
//                       )}
//                     </div>
//                     <button type="button" onClick={() => removeRow(row.id)}
//                       className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>

//                   {/* Fields grid */}
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                     {/* Min Qty */}
//                     <div>
//                       <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                         Min Qty <span className="text-red-500">*</span>
//                       </label>
//                       <input type="number" min="1" value={row.minQty}
//                         onChange={(e) => updateRow(row.id, "minQty", e.target.value)}
//                         placeholder="1"
//                         className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
//                     </div>

//                     {/* Max Qty */}
//                     <div>
//                       <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                         Max Qty <span className="text-gray-400 font-normal">(optional)</span>
//                       </label>
//                       <input type="number" min="1" value={row.maxQty}
//                         onChange={(e) => updateRow(row.id, "maxQty", e.target.value)}
//                         placeholder="∞ Unlimited"
//                         className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
//                     </div>

//                     {/* Profit / Loss */}
//                     <div>
//                       <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                         Profit / Loss (₹)
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">±</span>
//                         <input type="number" step="0.01" value={row.profit}
//                           onChange={(e) => updateRow(row.id, "profit", e.target.value)}
//                           placeholder="0.00"
//                           className={`w-full border rounded-lg pl-7 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500
//                             ${rowProfit > 0 ? "border-green-200 bg-green-50/50" : rowProfit < 0 ? "border-red-200 bg-red-50/50" : "border-gray-200 bg-gray-50/50"}`}
//                         />
//                       </div>
//                       {base > 0 && row.profit !== "" && (
//                         <p className={`text-[10px] mt-0.5 font-medium ${rowProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
//                           {rowProfit >= 0 ? "+" : ""}{((rowProfit / base) * 100).toFixed(1)}% of base
//                         </p>
//                       )}
//                     </div>

//                     {/* Unit Price */}
//                     <div>
//                       <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
//                         Unit Price (₹) <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₹</span>
//                         <input type="number" min="0" step="0.01" value={row.unitPrice}
//                           onChange={(e) => updateRow(row.id, "unitPrice", e.target.value)}
//                           placeholder={base > 0 ? String(base.toFixed(2)) : "0.00"}
//                           className="w-full border border-blue-200 rounded-lg pl-6 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50" />
//                       </div>
//                       <p className="text-[10px] text-gray-400 mt-0.5">Base + Profit = Final</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* ── Action Buttons ── */}
//       <div className="flex items-center gap-2 flex-wrap">
//         <button type="button" onClick={addRow}
//           className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all text-xs font-semibold">
//           <Plus className="w-3.5 h-3.5" />Add Price Range
//         </button>

//         {rows.length > 0 && (
//           <>
//             <button type="button" onClick={saveRows} disabled={saving}
//               className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-semibold shadow-sm disabled:opacity-70">
//               {saving
//                 ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
//                 : <><Check className="w-3.5 h-3.5" />Save {rows.length} Range{rows.length !== 1 ? "s" : ""}</>}
//             </button>
//             <button type="button" onClick={() => setRows([])}
//               className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-xs font-medium">
//               Discard
//             </button>
//           </>
//         )}

//         {savedRanges.length === 0 && rows.length === 0 && (
//           <p className="text-xs text-gray-400 italic">No price ranges yet.</p>
//         )}
//       </div>

//       {rows.length > 0 && !productId && (
//         <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
//           <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
//           Product save hone ke baad price ranges save hongi.
//         </p>
//       )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    LIGHTBOX & IMAGE UPLOADERS
// ───────────────────────────────────────────────────────────── */
// const Lightbox = ({ src, onClose }) => (
//   <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
//     <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
//       <img src={src} alt="Preview" className="w-full rounded-2xl object-contain max-h-[80vh] shadow-2xl" />
//       <button onClick={onClose} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
//         <X className="w-4 h-4 text-gray-700" />
//       </button>
//     </div>
//   </div>
// );

// const PrimaryImageUploader = ({ existingUrl, file, onChange }) => {
//   const inputRef    = useRef(null);
//   const [lightbox, setLightbox] = useState(false);
//   const [dragOver, setDragOver] = useState(false);
//   const blobUrlRef  = useRef(null);

//   useEffect(() => {
//     return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
//   }, []);

//   let previewUrl = null;
//   if (file) {
//     if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
//     blobUrlRef.current = URL.createObjectURL(file);
//     previewUrl = blobUrlRef.current;
//   } else if (existingUrl) {
//     previewUrl = existingUrl;
//   }

//   const handleFile = (f) => { if (f && f.type.startsWith("image/")) onChange(f, "new"); };
//   const handleRemove = (e) => {
//     e.stopPropagation();
//     if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
//     onChange(null, "remove");
//   };

//   return (
//     <div className="space-y-2">
//       {previewUrl ? (
//         <div className="relative group w-full aspect-video max-h-52 rounded-xl overflow-hidden border-2 border-blue-200 bg-gray-50 shadow-sm">
//           <img src={previewUrl} alt="Primary" className="w-full h-full object-contain" />
//           <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10">
//             <Star className="w-3 h-3" /> Primary
//           </span>
//           {existingUrl && !file && (
//             <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded z-10">Saved</span>
//           )}
//           {file && (
//             <span className="absolute bottom-2 left-2 bg-green-600/80 text-white text-[10px] px-2 py-1 rounded z-10">New ✓</span>
//           )}
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
//             <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
//               className="p-2.5 bg-white/90 rounded-xl hover:bg-white transition-colors text-gray-700 shadow" title="Preview">
//               <ZoomIn className="w-4 h-4" />
//             </button>
//             <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
//               className="p-2.5 bg-blue-500/90 rounded-xl hover:bg-blue-500 text-white transition-colors shadow" title="Change Image">
//               <ImagePlus className="w-4 h-4" />
//             </button>
//             <button type="button" onClick={handleRemove}
//               className="p-2.5 bg-red-500/90 rounded-xl hover:bg-red-500 text-white transition-colors shadow" title="Remove Image">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div
//           onClick={() => inputRef.current?.click()}
//           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
//           className={`w-full aspect-video max-h-52 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200
//             ${dragOver ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"}`}
//         >
//           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
//             <ImagePlus className="w-6 h-6 text-blue-400" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">Click or drag to upload</p>
//           <p className="text-xs text-gray-400 mt-1">Primary product image (JPG, PNG, WEBP)</p>
//         </div>
//       )}
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
//       {lightbox && previewUrl && <Lightbox src={previewUrl} onClose={() => setLightbox(false)} />}
//     </div>
//   );
// };

// const GalleryImageUploader = ({ initialExistingUrls, initialNewFiles, onChange }) => {
//   const inputRef = useRef(null);
//   const [lightbox, setLightbox] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const idCounter = useRef(0);
//   const genId = () => `g_${++idCounter.current}_${Date.now()}`;

//   const buildInitialSlots = () => [
//     ...(initialExistingUrls || []).map((url) => ({ id: genId(), type: "existing", url, previewUrl: url })),
//     ...(initialNewFiles || []).map((file) => ({ id: genId(), type: "new", file, previewUrl: URL.createObjectURL(file) })),
//   ];
//   const [slots, setSlots] = useState(buildInitialSlots);

//   const propagate = useCallback((updated) => {
//     setSlots(updated);
//     onChange(
//       updated.filter((s) => s.type === "new").map((s) => s.file),
//       updated.filter((s) => s.type === "existing").map((s) => s.url)
//     );
//   }, [onChange]);

//   const addFiles = (incoming) => {
//     const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/")).slice(0, MAX_GALLERY - slots.length);
//     if (!valid.length) return;
//     propagate([...slots, ...valid.map((file) => ({ id: genId(), type: "new", file, previewUrl: URL.createObjectURL(file) }))]);
//   };

//   const removeSlot = (id) => propagate(slots.filter((s) => s.id !== id));
//   const totalFilled = slots.length;
//   const emptySlots  = Math.max(0, MAX_GALLERY - totalFilled);

//   return (
//     <div className="space-y-2">
//       <div className="grid grid-cols-3 gap-3">
//         {slots.map((slot, idx) => (
//           <div key={slot.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm">
//             <img src={slot.previewUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
//             <button type="button" onClick={() => removeSlot(slot.id)}
//               className="absolute top-1.5 right-1.5 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 border-2 border-white shadow transition-all">
//               <X className="w-3 h-3 text-white" strokeWidth={3} />
//             </button>
//             <span className={`absolute bottom-1 left-1 text-[9px] font-semibold px-1.5 py-0.5 rounded z-10 text-white ${slot.type === "existing" ? "bg-black/50" : "bg-green-600/80"}`}>
//               {slot.type === "existing" ? "Saved" : "New"}
//             </span>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
//               <button type="button" onClick={() => setLightbox(slot.previewUrl)} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:bg-white shadow">
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//         {Array.from({ length: emptySlots }).map((_, idx) => (
//           <div key={`empty-${idx}`}
//             onClick={() => totalFilled < MAX_GALLERY && inputRef.current?.click()}
//             onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//             onDragLeave={() => setDragOver(false)}
//             onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
//             className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200
//               ${dragOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"}`}>
//             <Plus className={`${idx === 0 && totalFilled === 0 ? "w-6 h-6" : "w-5 h-5"} text-gray-300`} />
//             {idx === 0 && totalFilled === 0 && (
//               <span className="text-[10px] text-gray-400 mt-1 text-center leading-tight px-1">Add gallery<br />images</span>
//             )}
//           </div>
//         ))}
//       </div>
//       <p className="text-[11px] text-gray-400 text-right">{totalFilled}/{MAX_GALLERY} gallery images · Click ✕ to remove</p>
//       <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
//         onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
//       {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
//     </div>
//   );
// };

// const ProductThumb = ({ image, galleryImages, name }) => {
//   const [lightbox, setLightbox] = useState(null);
//   const allImgs = [image, ...(galleryImages || [])].filter(Boolean);
//   if (!allImgs.length) {
//     return (
//       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
//         <span className="text-gray-300 text-[10px] font-bold">N/A</span>
//       </div>
//     );
//   }
//   return (
//     <>
//       <div className="relative flex-shrink-0">
//         <button type="button" onClick={() => setLightbox(image || allImgs[0])}
//           className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm block hover:scale-110 transition-transform">
//           <img src={image || allImgs[0]} alt={name} className="w-full h-full object-cover" />
//         </button>
//         {allImgs.length > 1 && (
//           <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white cursor-pointer"
//             onClick={() => setLightbox(allImgs[1])}>
//             {allImgs.length}
//           </span>
//         )}
//       </div>
//       {lightbox && (
//         <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
//           <div className="relative max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
//             <div className="flex gap-2 justify-center mb-3">
//               {allImgs.map((url, idx) => (
//                 <button key={idx} onClick={() => setLightbox(url)}
//                   className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${lightbox === url ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"}`}>
//                   <img src={url} alt="" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//             <img src={lightbox} alt="Preview" className="w-full rounded-2xl object-contain max-h-[70vh] shadow-2xl" />
//             <button onClick={() => setLightbox(null)} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
//               <X className="w-4 h-4 text-gray-700" />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════
//    HSN ADD MODAL
// ═══════════════════════════════════════════════════════════════ */
// const AddHsnModal = ({ onClose, onAdded, existingHsnCategories }) => {
//   const [form, setForm] = useState({ code: "", description: "", gst: "0", hsnCategory: "", newHsnCategory: "" });
//   const [saving,  setSaving]  = useState(false);
//   const [error,   setError]   = useState("");
//   const [success, setSuccess] = useState(false);
//   const [useNew,  setUseNew]  = useState(true);

//   const allHsnCategories = [...new Set([...(existingHsnCategories || [])])].filter(Boolean).sort();

//   const handleChange = (e) => {
//     setError("");
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const code        = form.code.trim().toUpperCase();
//     const description = form.description.trim();
//     const gst         = Number(form.gst);
//     const category    = useNew ? form.newHsnCategory.trim() : form.hsnCategory.trim();
//     if (!code)                     return setError("HSN code required hai.");
//     if (!/^\d{4,8}$/.test(code))   return setError("HSN code 4–8 digits ka hona chahiye.");
//     if (!description)              return setError("Description required hai.");
//     if (!category)                 return setError("HSN Category enter ya select karo.");
//     setSaving(true);
//     setError("");
//     try {
//       const response = await fetch(`${API_URL}/hsn/add`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code, description, gst, category }),
//       });
//       const data = await response.json();
//       if (!response.ok || !data.success) { setError(data?.message || "Save failed."); return; }
//       setSuccess(true);
//       if (onAdded) onAdded({ _id: data.data._id, code: data.data.code, description: data.data.description, gst: data.data.gst, category: data.data.category, isCustom: true });
//       setTimeout(() => onClose(), 1200);
//     } catch { setError("Network error — backend chal raha hai?"); }
//     finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose}>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
//         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
//               <Hash className="w-4 h-4 text-indigo-600" />
//             </div>
//             <div>
//               <h2 className="font-bold text-gray-900 text-base leading-tight">Add HSN Code</h2>
//               <p className="text-xs text-gray-500 mt-0.5">Naya HSN code database mein add karo</p>
//             </div>
//           </div>
//           <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 text-gray-400 hover:text-gray-700 transition-colors">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">HSN Code <span className="text-red-500">*</span></label>
//             <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. 0401" maxLength={8} autoFocus
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-semibold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description <span className="text-red-500">*</span></label>
//             <textarea name="description" value={form.description} onChange={handleChange} rows={2}
//               placeholder="e.g. Milk & Cream (not concentrated, no added sugar)"
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">GST Rate <span className="text-red-500">*</span></label>
//             <div className="grid grid-cols-5 gap-2">
//               {[0, 5, 12, 18, 28].map((rate) => {
//                 const b = GST_BADGE[rate]; const active = Number(form.gst) === rate;
//                 return (
//                   <button key={rate} type="button" onClick={() => { setError(""); setForm((p) => ({ ...p, gst: String(rate) })); }}
//                     className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${active ? `${b.bg} ${b.text} border-current scale-105 shadow-sm` : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200 hover:bg-gray-100"}`}>
//                     {rate}%
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//           <div>
//             <div className="flex items-center justify-between mb-1.5">
//               <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">HSN Category <span className="text-red-500">*</span></label>
//               {allHsnCategories.length > 0 && (
//                 <button type="button" onClick={() => { setUseNew((p) => !p); setError(""); }}
//                   className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${!useNew ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
//                   {!useNew ? "✏️ Type new" : "📋 Select existing"}
//                 </button>
//               )}
//             </div>
//             {useNew || allHsnCategories.length === 0 ? (
//               <input name="newHsnCategory" value={form.newHsnCategory} onChange={handleChange}
//                 placeholder="e.g. Dairy & Eggs, Vegetables, Spices & Condiments"
//                 className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//             ) : (
//               <div className="relative">
//                 <select name="hsnCategory" value={form.hsnCategory} onChange={handleChange}
//                   className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10">
//                   <option value="">— Existing HSN category select karo —</option>
//                   {allHsnCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//               </div>
//             )}
//           </div>
//           {error && (
//             <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700">
//               <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
//             </div>
//           )}
//           {success && (
//             <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700">
//               <CheckCircle className="w-4 h-4 flex-shrink-0" />HSN code save ho gaya! ✅
//             </div>
//           )}
//           <div className="flex gap-3 pt-2">
//             <button type="submit" disabled={saving || success}
//               className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm disabled:opacity-60">
//               {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> :
//                success ? <><CheckCircle className="w-4 h-4" />Saved!</> :
//                <><Plus className="w-4 h-4" />HSN Add Karo</>}
//             </button>
//             <button type="button" onClick={onClose} disabled={saving}
//               className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════
//    HSN MANAGE MODAL
// ═══════════════════════════════════════════════════════════════ */
// const HsnManageModal = ({ onClose, hsnList, onDelete, onAddNew }) => {
//   const [search,    setSearch]    = useState("");
//   const [catFilter, setCatFilter] = useState("");
//   const [deletingId, setDeleting] = useState(null);

//   const allCategories = useMemo(
//     () => [...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort(),
//     [hsnList]
//   );

//   const filtered = useMemo(() => hsnList.filter((h) => {
//     const q = search.toLowerCase();
//     const matchQ = !q || h.code.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || (h.category || "").toLowerCase().includes(q);
//     return matchQ && (!catFilter || h.category === catFilter);
//   }), [hsnList, search, catFilter]);

//   const handleDelete = async (hsn) => {
//     if (!window.confirm(`HSN code "${hsn.code}" delete karna chahte ho?`)) return;
//     setDeleting(hsn._id);
//     try {
//       const res = await fetch(`${API_URL}/hsn/${hsn._id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) { onDelete(hsn._id); }
//       else { alert(data.message || "Delete failed"); }
//     } catch { alert("Network error"); }
//     finally { setDeleting(null); }
//   };

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose}>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
//         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
//               <Settings className="w-4 h-4 text-indigo-600" />
//             </div>
//             <div>
//               <h2 className="font-bold text-gray-900 text-base leading-tight">HSN Code Management</h2>
//               <p className="text-xs text-gray-500 mt-0.5">{hsnList.length} HSN codes database mein hain</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button type="button" onClick={() => { onClose(); onAddNew(); }}
//               className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-xs font-semibold">
//               <Plus className="w-3.5 h-3.5" />Add New
//             </button>
//             <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 text-gray-400 hover:text-gray-700 transition-colors">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//         <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0 space-y-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//             <input value={search} onChange={(e) => setSearch(e.target.value)}
//               placeholder="Code, description ya category search karo…"
//               className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//           </div>
//           {allCategories.length > 0 && (
//             <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
//               <button onClick={() => setCatFilter("")}
//                 className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!catFilter ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
//                 All
//               </button>
//               {allCategories.map((cat) => (
//                 <button key={cat} onClick={() => setCatFilter(catFilter === cat ? "" : cat)}
//                   className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === cat ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {filtered.length === 0 ? (
//             <div className="py-16 flex flex-col items-center justify-center gap-2 text-center">
//               <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
//                 <Hash className="w-7 h-7 text-gray-300" />
//               </div>
//               <p className="font-medium text-gray-500">{hsnList.length === 0 ? "Koi HSN code nahi hai" : "Koi result nahi mila"}</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-50">
//               {filtered.map((hsn) => {
//                 const b = GST_BADGE[hsn.gst] ?? GST_BADGE[0];
//                 return (
//                   <div key={hsn._id || hsn.code} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
//                     <span className="flex-shrink-0 mt-0.5 font-mono text-[11px] font-bold px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 min-w-[60px] text-center">
//                       {hsn.code}
//                     </span>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-800 leading-snug">{hsn.description}</p>
//                       <div className="flex items-center gap-2 mt-1 flex-wrap">
//                         <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{hsn.category}</span>
//                         <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.bg} ${b.text}`}>
//                           <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />GST {hsn.gst}%
//                         </span>
//                         {hsn.isCustom && (
//                           <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">Custom</span>
//                         )}
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => handleDelete(hsn)} disabled={deletingId === hsn._id}
//                       className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100 disabled:opacity-50 mt-0.5">
//                       {deletingId === hsn._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//         <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-between">
//           <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""} dikh rahe hain</span>
//           <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors text-sm font-medium">Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════
//    HSN PICKER
// ═══════════════════════════════════════════════════════════════ */
// const HsnPicker = ({ value, onSelect, hsnList = [], onHsnAdded, onOpenManage }) => {
//   const [open,      setOpen]      = useState(false);
//   const [query,     setQuery]     = useState("");
//   const [catFilter, setCatFilter] = useState("");
//   const [highlighted, setHigh]   = useState(0);
//   const [showAddModal, setShowAdd] = useState(false);
//   const wrapRef  = useRef(null);
//   const inputRef = useRef(null);
//   const listRef  = useRef(null);

//   const allHsnCategories = useMemo(
//     () => [...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort(),
//     [hsnList]
//   );

//   const selected = useMemo(
//     () => hsnList.find((h) => h.code === value) ?? null,
//     [hsnList, value]
//   );

//   const filtered = useMemo(() => hsnList.filter((h) => {
//     const q = query.toLowerCase();
//     const matchQ = !q || h.code.includes(q) || h.description.toLowerCase().includes(q) || (h.category || "").toLowerCase().includes(q);
//     return matchQ && (!catFilter || h.category === catFilter);
//   }), [hsnList, query, catFilter]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (showAddModal) return;
//       if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [showAddModal]);

//   useEffect(() => setHigh(0), [query, catFilter]);
//   useEffect(() => {
//     if (!open) return;
//     listRef.current?.querySelector(`[data-idx="${highlighted}"]`)?.scrollIntoView({ block: "nearest" });
//   }, [highlighted, open]);

//   const pick  = (hsn) => { onSelect(hsn); setOpen(false); setQuery(""); setCatFilter(""); };
//   const clear = (e)   => { e.stopPropagation(); onSelect(null); setQuery(""); };

//   const handleKeyDown = (e) => {
//     if (!open) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } return; }
//     if (e.key === "ArrowDown") { e.preventDefault(); setHigh((p) => Math.min(p + 1, filtered.length - 1)); }
//     if (e.key === "ArrowUp")   { e.preventDefault(); setHigh((p) => Math.max(p - 1, 0)); }
//     if (e.key === "Enter")     { e.preventDefault(); if (filtered[highlighted]) pick(filtered[highlighted]); }
//     if (e.key === "Escape")    { setOpen(false); }
//   };

//   const handleHsnAdded = useCallback((newHsn) => {
//     if (onHsnAdded) onHsnAdded(newHsn);
//     setShowAdd(false);
//     setOpen(false);
//     setTimeout(() => {
//       onSelect({ code: newHsn.code, description: newHsn.description, gst: newHsn.gst, category: newHsn.category, isCustom: true, _id: newHsn._id });
//     }, 50);
//   }, [onSelect, onHsnAdded]);

//   const badge = selected ? (GST_BADGE[selected.gst] ?? GST_BADGE[0]) : null;

//   return (
//     <>
//       <div ref={wrapRef} className="relative w-full">
//         <div className="flex gap-2">
//           <button type="button" onKeyDown={handleKeyDown}
//             onClick={() => { setOpen((p) => !p); setTimeout(() => inputRef.current?.focus(), 60); }}
//             className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm bg-white text-left transition-all hover:border-gray-300
//               ${open ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"}`}>
//             <Tag className={`w-4 h-4 flex-shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`} />
//             {selected ? (
//               <>
//                 <span className="font-mono font-bold text-gray-900 flex-shrink-0 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{selected.code}</span>
//                 <span className="text-gray-700 truncate flex-1 text-xs">{selected.description}</span>
//                 <span className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />GST {selected.gst}%
//                 </span>
//                 <span onClick={clear} className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-400 hover:text-gray-600">
//                   <X className="w-3.5 h-3.5" />
//                 </span>
//               </>
//             ) : (
//               <>
//                 <span className="text-gray-400 flex-1 text-sm">{hsnList.length === 0 ? "Koi HSN nahi — + se add karo" : "HSN code search karo ya select karo…"}</span>
//                 <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
//               </>
//             )}
//           </button>
//           <button type="button" onClick={() => { setOpen(false); if (onOpenManage) onOpenManage(); }}
//             title="HSN codes manage karo"
//             className="flex-shrink-0 w-10 h-[42px] flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
//             <Settings className="w-4 h-4" />
//           </button>
//         </div>

//         {open && (
//           <div className="absolute z-[99998] mt-1.5 left-0 right-0 min-w-[340px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
//             <div className="p-2.5 bg-gray-50 border-b border-gray-100">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//                 <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
//                   placeholder="Code ya naam type karo…"
//                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
//               </div>
//             </div>
//             {allHsnCategories.length > 0 && (
//               <div className="flex gap-1.5 px-2.5 py-2 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
//                 <button onClick={() => setCatFilter("")}
//                   className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!catFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
//                   All
//                 </button>
//                 {allHsnCategories.map((cat) => (
//                   <button key={cat} onClick={() => setCatFilter(catFilter === cat ? "" : cat)}
//                     className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             )}
//             <div ref={listRef} className="max-h-56 overflow-y-auto">
//               {filtered.length === 0 ? (
//                 <div className="py-8 text-center">
//                   <Tag className="w-8 h-8 mx-auto mb-2 text-gray-200" />
//                   <p className="text-sm text-gray-400">{hsnList.length === 0 ? "Database mein koi HSN nahi hai" : "Koi result nahi mila"}</p>
//                 </div>
//               ) : (
//                 <div className="p-1.5 space-y-0.5">
//                   {filtered.map((hsn, idx) => {
//                     const isSelected = value === hsn.code;
//                     const isHigh     = highlighted === idx;
//                     const b          = GST_BADGE[hsn.gst] ?? GST_BADGE[0];
//                     return (
//                       <button key={hsn.code} data-idx={idx} type="button"
//                         onClick={() => pick(hsn)} onMouseEnter={() => setHigh(idx)}
//                         className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : isHigh ? "bg-gray-50" : "hover:bg-gray-50"}`}>
//                         <span className={`flex-shrink-0 mt-0.5 font-mono text-[11px] font-bold px-2 py-1 rounded-md ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>{hsn.code}</span>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-xs leading-snug text-gray-800">{hsn.description}</div>
//                           <div className="text-[10px] text-gray-400 mt-0.5">{hsn.category}</div>
//                         </div>
//                         <span className={`flex-shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.bg} ${b.text}`}>
//                           <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />{hsn.gst}%
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//             <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
//               <span className="text-[10px] text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""} · ↑↓ navigate · Esc close</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {showAddModal && (
//         <AddHsnModal onClose={() => setShowAdd(false)} onAdded={handleHsnAdded}
//           existingHsnCategories={allHsnCategories} />
//       )}
//     </>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SHARED FORM HELPERS
// ───────────────────────────────────────────────────────────── */
// const EMPTY_FORM = {
//   name: "", brand: "", category: "", subcategory: "", subSubcategory: "",
//   description: "", basePrice: "", profitLoss: "", gstPercent: "",
//   hsnCode: "", taxType: "cgst_sgst", weightValue: "1", weightUnit: "kg",
//   validTill: "", status: "inactive",
//   primaryImageFile: null,
//   existingPrimaryUrl: "",
//   keepPrimaryImage: true,
//   galleryNewFiles: [],
//   existingGallery: [],
// };

// const Label = ({ children, required }) => (
//   <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
//     {children}{required && <span className="text-red-500 normal-case"> *</span>}
//   </label>
// );

// const Input = ({ className = "", ...props }) => (
//   <input
//     className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder:text-gray-400
//       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150
//       hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
//     {...props}
//   />
// );

// const SelectInput = ({ children, className = "", ...props }) => (
//   <div className="relative">
//     <select
//       className={`w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
//         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150
//         hover:border-gray-300 disabled:bg-gray-50 pr-9 ${className}`}
//       {...props}
//     >{children}</select>
//     <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//   </div>
// );

// const SectionTitle = ({ children, icon: Icon, color = "blue" }) => {
//   const colorMap = { blue: "text-blue-600 bg-blue-100", green: "text-green-600 bg-green-100", purple: "text-purple-600 bg-purple-100", amber: "text-amber-600 bg-amber-100" };
//   return (
//     <div className="flex items-center gap-3 mb-4">
//       {Icon && (
//         <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
//           <Icon className="w-3.5 h-3.5" />
//         </div>
//       )}
//       <span className={`text-xs font-bold uppercase tracking-widest text-${color}-600`}>{children}</span>
//       <div className={`flex-1 h-px bg-${color}-100`} />
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    FORM FIELDS
// ───────────────────────────────────────────────────────────── */
// const FormFields = ({
//   form, handleChange, handleHsnSelect,
//   savedProductId,
//   handlePrimaryImageChange, handleGalleryChange,
//   categories, subcategories, subSubcategories,
//   onOpenCategoryModal, uploaderKey,
//   editId, productRanges, onRangesChange,
//   hsnList, onHsnAdded, onOpenHsnManage,
// }) => (
//   <div className="space-y-6">
//     {/* Basic Info */}
//     <div>
//       <SectionTitle icon={Tag} color="blue">Basic Information</SectionTitle>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div>
//           <Label required>Product Name</Label>
//           <Input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amul Gold Milk" />
//         </div>
//         <div>
//           <Label>Brand</Label>
//           <Input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Amul, Tata" />
//         </div>
//         <div>
//           <Label>Status</Label>
//           <SelectInput name="status" value={form.status} onChange={handleChange}>
//             <option value="active">✅ Active</option>
//             <option value="inactive">❌ Inactive</option>
//           </SelectInput>
//         </div>
//       </div>
//     </div>

//     {/* Category */}
//     <div>
//       <SectionTitle icon={Layers} color="purple">Category</SectionTitle>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div>
//           <Label required>Category</Label>
//           <div className="flex gap-2">
//             <div className="flex-1">
//               <SelectInput required name="category" value={form.category} onChange={handleChange}>
//                 <option value="">— Select Category —</option>
//                 {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//               </SelectInput>
//             </div>
//             <button type="button" onClick={onOpenCategoryModal}
//               className="flex-shrink-0 w-10 h-[42px] flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
//               <Plus className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//         <div>
//           <Label>Subcategory</Label>
//           <SelectInput name="subcategory" value={form.subcategory} onChange={handleChange} disabled={!subcategories.length}>
//             <option value="">{!form.category ? "Select category first" : subcategories.length ? "— Select Subcategory —" : "No subcategories"}</option>
//             {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
//           </SelectInput>
//         </div>
//         <div>
//           <Label>Sub-Subcategory</Label>
//           <SelectInput name="subSubcategory" value={form.subSubcategory} onChange={handleChange} disabled={!subSubcategories.length}>
//             <option value="">{!form.subcategory ? "Select subcategory first" : subSubcategories.length ? "— Select Sub-Subcategory —" : "None"}</option>
//             {subSubcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
//           </SelectInput>
//         </div>
//       </div>
//     </div>

//     {/* Pricing & Tax */}
//     <div>
//       <SectionTitle icon={DollarSign} color="amber">Pricing &amp; Tax</SectionTitle>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div>
//           <Label required>Base Price (₹)</Label>
//           <Input type="number" required name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
//         </div>
//         <div>
//           <Label>Profit / Loss (₹)</Label>
//           <Input type="number" name="profitLoss" value={form.profitLoss} onChange={handleChange} placeholder="0" />
//         </div>
//         <div>
//           <Label>GST %</Label>
//           <SelectInput name="gstPercent" value={form.gstPercent} onChange={handleChange}>
//             <option value="">— Select GST —</option>
//             <option value="0">0% (Exempt)</option>
//             <option value="5">5%</option>
//             <option value="12">12%</option>
//             <option value="18">18%</option>
//             <option value="28">28%</option>
//           </SelectInput>
//         </div>
//         <div className="sm:col-span-2">
//           <Label>HSN Code</Label>
//           <HsnPicker value={form.hsnCode} onSelect={handleHsnSelect} hsnList={hsnList} onHsnAdded={onHsnAdded} onOpenManage={onOpenHsnManage} />
//           {form.hsnCode && (() => {
//             const hsn    = hsnList.find((h) => h.code === form.hsnCode);
//             const gstKey = hsn ? hsn.gst : (form.gstPercent ? Number(form.gstPercent) : 0);
//             const b      = GST_BADGE[gstKey] ?? GST_BADGE[0];
//             return (
//               <div className="mt-2 flex items-start gap-2.5 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
//                 <Tag className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{form.hsnCode}</span>
//                     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${b.bg} ${b.text}`}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />GST {gstKey}%
//                     </span>
//                   </div>
//                   {hsn && <p className="text-xs text-blue-800 mt-1">{hsn.description}</p>}
//                   {hsn && <p className="text-[10px] text-blue-500 mt-0.5">{hsn.category}</p>}
//                 </div>
//               </div>
//             );
//           })()}
//         </div>
//         <div>
//           <Label>Tax Type</Label>
//           <SelectInput name="taxType" value={form.taxType} onChange={handleChange}>
//             <option value="cgst_sgst">CGST + SGST (Intra-state)</option>
//             <option value="igst">IGST (Inter-state)</option>
//           </SelectInput>
//         </div>
//         <div>
//           <Label>Valid Till</Label>
//           <Input type="date" name="validTill" value={form.validTill} onChange={handleChange} />
//         </div>
//       </div>
//     </div>

//     {/* ── PRICE RANGES — now receives basePrice ── */}
//     <div>
//       <div className="flex items-center gap-3 mb-1">
//         <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
//           <Layers className="w-3.5 h-3.5 text-green-600" />
//         </div>
//         <span className="text-xs font-bold uppercase tracking-widest text-green-600">Price Ranges</span>
//         <div className="flex-1 h-px bg-green-100" />
//         <span className="text-[10px] text-green-500 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium">Bulk / Quantity Pricing</span>
//       </div>
//       <p className="text-xs text-gray-400 mb-4 ml-9">
//         Alag alag quantities ke liye alag unit price set karo. Unit Price = Base Price + Profit/Loss.
//       </p>
//       <div className="bg-gradient-to-br from-green-50/60 to-emerald-50/30 rounded-2xl border border-green-200/60 p-4">
//         <PriceRangesSection
//           productId={savedProductId || editId || null}
//           basePrice={form.basePrice}
//           existingRanges={productRanges || []}
//           onRangesChange={onRangesChange}
//         />
//       </div>
//     </div>

//     {/* Weight */}
//     <div>
//       <SectionTitle color="blue">Weight</SectionTitle>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div>
//           <Label>Weight</Label>
//           <div className="flex gap-2">
//             <Input type="number" name="weightValue" value={form.weightValue} onChange={handleChange} placeholder="e.g. 500" className="flex-1" min="0" />
//             <div className="w-28">
//               <SelectInput name="weightUnit" value={form.weightUnit} onChange={handleChange}>
//                 <option value="kg">Kg</option>
//                 <option value="gm">Gram</option>
//                 <option value="ltr">Litre</option>
//                 <option value="ml">ML</option>
//                 <option value="pcs">Pcs</option>
//               </SelectInput>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Images */}
//     <div>
//       <SectionTitle color="blue">Product Images</SectionTitle>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/30">
//           <div className="flex items-center gap-2 mb-3">
//             <Star className="w-4 h-4 text-blue-500" />
//             <h4 className="text-sm font-semibold text-blue-700">Primary Image</h4>
//             <span className="text-[10px] text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">Shown in listings</span>
//           </div>
//           <PrimaryImageUploader key={`primary-${uploaderKey}`} existingUrl={form.existingPrimaryUrl} file={form.primaryImageFile} onChange={handlePrimaryImageChange} />
//         </div>
//         <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/30">
//           <div className="flex items-center gap-2 mb-3">
//             <Images className="w-4 h-4 text-gray-500" />
//             <h4 className="text-sm font-semibold text-gray-700">Gallery Images</h4>
//             <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Up to {MAX_GALLERY} extra photos</span>
//           </div>
//           <GalleryImageUploader key={`gallery-${uploaderKey}`} initialExistingUrls={form.existingGallery} initialNewFiles={form.galleryNewFiles} onChange={handleGalleryChange} />
//         </div>
//       </div>
//     </div>

//     {/* Description */}
//     <div>
//       <Label>Description</Label>
//       <textarea name="description" value={form.description} onChange={handleChange} rows={3}
//         placeholder="Product description (optional)..."
//         className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder:text-gray-400
//           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 resize-none" />
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════════ */
// export default function PriceList() {
//   const [items,           setItems]           = useState([]);
//   const [categories,      setCategories]      = useState([]);
//   const [subcategories,   setSubcategories]   = useState([]);
//   const [subSubcategories, setSubSubcategories] = useState([]);
//   const [hsnList,         setHsnList]         = useState([]);
//   const [search,          setSearch]          = useState("");
//   const [loading,         setLoading]         = useState(false);
//   const [isSubmitting,    setIsSubmitting]    = useState(false);
//   const [form,            setForm]            = useState(EMPTY_FORM);
//   const [activeMenu,      setActiveMenu]      = useState(null);
//   const [selectedItems,   setSelectedItems]   = useState([]);
//   const [bulkMode,        setBulkMode]        = useState(false);
//   const [currentPage,     setCurrentPage]     = useState(1);
//   const itemsPerPage = 15;
//   const [filterCategory,    setFilterCategory]    = useState("");
//   const [filterSubcategory, setFilterSubcategory] = useState("");
//   const [filterSubs,        setFilterSubs]        = useState([]);
//   const [quickBasePrices,   setQuickBasePrices]   = useState({});
//   const [quickProfitLoss,   setQuickProfitLoss]   = useState({});
//   const [sortOrder,         setSortOrder]         = useState("");
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [newCategoryName,   setNewCategoryName]   = useState("");
//   const [categoryLoading,   setCategoryLoading]   = useState(false);
//   const [alertBox,   setAlertBox]   = useState({ show: false, message: "", type: "success" });
//   const [showFilters, setShowFilters] = useState(false);
//   const [columnVisibility, setColumnVisibility] = useState({ category: true });
//   const [uploaderKey,   setUploaderKey]   = useState("init");
//   const [productRanges, setProductRanges] = useState([]);
//   const [savedProductId, setSavedProductId] = useState(null);
//   const [mode,   setMode]   = useState(null);
//   const [editId, setEditId] = useState(null);

//   const [showHsnAddModal,    setShowHsnAddModal]    = useState(false);
//   const [showHsnManageModal, setShowHsnManageModal] = useState(false);

//   const showForm  = mode === "add" || mode === "copy";
//   const showModal = mode === "edit";

//   const subsRef    = useRef([]);
//   const subSubsRef = useRef([]);
//   const formRef    = useRef(form);
//   useEffect(() => { formRef.current = form; }, [form]);

//   useEffect(() => {
//     if (!alertBox.show) return;
//     const t = setTimeout(() => setAlertBox((p) => ({ ...p, show: false })), 3500);
//     return () => clearTimeout(t);
//   }, [alertBox.show]);

//   useEffect(() => { fetchHsnList(); }, []);
//   useEffect(() => { fetchCategories(); }, []);
//   useEffect(() => { if (categories.length > 0) fetchItems(); }, [categories]);

//   const fetchHsnList = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/hsn/custom?_t=${Date.now()}`);
//       if (res.data?.success) setHsnList(res.data.data || []);
//       else if (Array.isArray(res.data)) setHsnList(res.data);
//       else setHsnList([]);
//     } catch { setHsnList([]); }
//   };

//   const handleHsnAddedInParent = useCallback((newHsn) => {
//     setHsnList((prev) => {
//       if (prev.find((h) => h.code === newHsn.code)) return prev;
//       return [...prev, { _id: newHsn._id, code: newHsn.code, description: newHsn.description, gst: newHsn.gst, category: newHsn.category, isCustom: true }];
//     });
//     setTimeout(() => fetchHsnList(), 500);
//   }, []);

//   const handleHsnDeletedInParent = useCallback((deletedId) => {
//     setHsnList((prev) => prev.filter((h) => h._id !== deletedId));
//     setForm((f) => {
//       const deleted = hsnList.find((h) => h._id === deletedId);
//       if (deleted && f.hsnCode === deleted.code) return { ...f, hsnCode: "", gstPercent: "" };
//       return f;
//     });
//   }, [hsnList]);

//   useEffect(() => {
//     if (!filterCategory) { setFilterSubs([]); setFilterSubcategory(""); return; }
//     const cat = categories.find((c) => c._id === filterCategory);
//     setFilterSubs(cat?.subcategories || []);
//     setFilterSubcategory("");
//   }, [filterCategory, categories]);

//   useEffect(() => {
//     if (!form.category) {
//       setSubcategories([]); setSubSubcategories([]);
//       subsRef.current = []; subSubsRef.current = [];
//       if (mode === "add") setForm((p) => ({ ...p, subcategory: "", subSubcategory: "" }));
//       return;
//     }
//     const cat  = categories.find((c) => c._id === form.category);
//     const subs = cat?.subcategories || [];
//     setSubcategories(subs);
//     subsRef.current = subs;
//     if (mode === "add") {
//       setSubSubcategories([]); subSubsRef.current = [];
//       setForm((p) => ({ ...p, subcategory: "", subSubcategory: "" }));
//     }
//   }, [form.category, categories]);

//   useEffect(() => {
//     if (!form.subcategory) {
//       setSubSubcategories([]); subSubsRef.current = [];
//       if (mode === "add") setForm((p) => ({ ...p, subSubcategory: "" }));
//       return;
//     }
//     const cat     = categories.find((c) => c._id === form.category);
//     const sub     = cat?.subcategories?.find((s) => s._id === form.subcategory);
//     const subSubs = sub?.subSubcategories || [];
//     setSubSubcategories(subSubs);
//     subSubsRef.current = subSubs;
//     if (mode === "add") setForm((p) => ({ ...p, subSubcategory: "" }));
//   }, [form.subcategory]);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(CATEGORY_URL);
//       if (res.data?.success) setCategories(res.data.categories || []);
//     } catch { showAlert("Could not fetch categories", "error"); }
//   };

//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL);
//       if (res.data?.success) {
//         const flat = [];
//         (res.data.data || []).forEach((cat) => {
//           (cat.subcategories || []).forEach((sub) => {
//             (sub.subSubcategories || []).forEach((subSub) => {
//               (subSub.products || []).forEach((p) => {
//                 flat.push({
//                   ...p,
//                   category:       { _id: cat.id,  name: cat.name,  image: cat.image  },
//                   subcategory:    { _id: sub.id,   name: sub.name,  image: sub.image  },
//                   subSubcategory: subSub.id ? { id: subSub.id, name: subSub.name, image: subSub.image } : null,
//                 });
//               });
//             });
//           });
//         });
//         flat.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setItems(flat);
//       }
//     } catch { showAlert("Could not fetch items", "error"); }
//     finally { setLoading(false); }
//   };

//   /* ── fetch ranges by product — uses new GET /product/:id route ── */
//   const fetchProductRanges = async (productId) => {
//     if (!productId) { setProductRanges([]); return; }
//     try {
//       const res = await axios.get(`${DISCOUNT_URL}/product/${productId}`);
//       setProductRanges(res.data?.data || []);
//     } catch { setProductRanges([]); }
//   };

//   const showAlert = (message, type = "success") => setAlertBox({ show: true, message, type });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const handlePrimaryImageChange = useCallback((file, flag) => {
//     if (flag === "new" && file) {
//       setForm((p) => ({ ...p, primaryImageFile: file, keepPrimaryImage: true }));
//     } else if (flag === "remove") {
//       setForm((p) => ({ ...p, primaryImageFile: null, existingPrimaryUrl: "", keepPrimaryImage: false }));
//     }
//   }, []);

//   const handleGalleryChange = useCallback((newFiles, existingUrls) => {
//     setForm((p) => ({ ...p, galleryNewFiles: newFiles, existingGallery: existingUrls }));
//   }, []);

//   const handleHsnSelect = useCallback((hsn) => {
//     setForm((prev) => ({
//       ...prev,
//       hsnCode:    hsn?.code || "",
//       gstPercent: hsn != null ? String(hsn.gst) : "",
//     }));
//   }, []);

//   const buildFD = (f) => {
//     const fd = new FormData();
//     fd.append("name",        f.name.trim());
//     fd.append("brand",       f.brand.trim());
//     fd.append("category",    f.category);
//     fd.append("status",      f.status);
//     fd.append("description", f.description || "");
//     fd.append("taxType",     f.taxType);
//     fd.append("gstPercent",  f.gstPercent || 0);
//     fd.append("hsnCode",     f.hsnCode || "");
//     fd.append("basePrice",   f.basePrice);
//     fd.append("profitLoss",  f.profitLoss || 0);
//     fd.append("weight",      JSON.stringify({ value: Math.max(1, Number(f.weightValue) || 1), unit: f.weightUnit || "kg" }));
//     if (f.validTill) fd.append("validTill", f.validTill);

//     if (f.subcategory) {
//       const sub = subsRef.current.find((s) => s._id === f.subcategory || s.id === f.subcategory);
//       if (sub) fd.append("subcategory", JSON.stringify({ id: sub._id || sub.id, name: sub.name, image: sub.image || "" }));
//     }
//     if (f.subSubcategory) {
//       const ss = subSubsRef.current.find((s) => s._id === f.subSubcategory || s.id === f.subSubcategory);
//       if (ss) fd.append("subSubcategory", JSON.stringify({ id: ss._id || ss.id, name: ss.name, image: ss.image || "" }));
//     }

//     if (f.primaryImageFile) {
//       fd.append("primaryImage", f.primaryImageFile);
//     } else if (f.existingPrimaryUrl) {
//       fd.append("existingPrimaryUrl", f.existingPrimaryUrl);
//     } else {
//       fd.append("keepPrimaryImage", "false");
//     }

//     (f.galleryNewFiles || []).forEach((file) => fd.append("galleryImages", file));
//     fd.append("existingGallery", JSON.stringify(f.existingGallery || []));
//     return fd;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const f = formRef.current;
//     if (!f.name.trim() || !f.category || !f.basePrice) {
//       showAlert("Name, category & base price required", "warning"); return;
//     }
//     const excludeId  = mode === "edit" ? editId : null;
//     const nameExists = items.some((p) => p.name.trim().toLowerCase() === f.name.trim().toLowerCase() && p._id !== excludeId);
//     if (nameExists) { showAlert("Yeh product naam pehle se exist karta hai! Naam badlo.", "error"); return; }

//     setIsSubmitting(true);
//     try {
//       const fd = buildFD(f);
//       if (mode === "edit" && editId) {
//         const res = await axios.put(`${API_URL}/${editId}`, fd);
//         if (res.data?.success !== false) {
//           await fetchItems();
//           showAlert("Product successfully update ho gaya! ✅", "success");
//           resetForm();
//         } else { showAlert(res.data?.message || "Update failed", "error"); }
//       } else {
//         const res = await axios.post(API_URL, fd);
//         const newProductId = res.data?.data?._id || res.data?._id;
//         if (newProductId) {
//           const msg = mode === "copy" ? "Product copy ho kar save ho gaya! 🎉" : "Product successfully add ho gaya! 🎉";
//           showAlert(msg, "success");
//           setSavedProductId(newProductId);
//           await fetchItems();
//           await fetchProductRanges(newProductId);
//           resetForm();
//         } else { showAlert(res.data?.message || "Save failed!", "error"); }
//       }
//     } catch (err) {
//       showAlert(err.response?.data?.message || err.message || "Save failed!", "error");
//     } finally { setIsSubmitting(false); }
//   };

//   const resetForm = () => {
//     setForm(EMPTY_FORM);
//     setMode(null);
//     setEditId(null);
//     setSavedProductId(null);
//     setUploaderKey(`reset-${Date.now()}`);
//     setSubcategories([]);
//     setSubSubcategories([]);
//     subsRef.current    = [];
//     subSubsRef.current = [];
//     setProductRanges([]);
//   };

//   const populateSubRefs = (item) => {
//     const cat     = categories.find((c) => c._id === (item.category?._id || item.category));
//     const subs    = cat?.subcategories || [];
//     const subId   = item.subcategory?._id || item.subcategory?.id || "";
//     const sub     = subs.find((s) => s._id === subId || s.id === subId);
//     const subSubs = sub?.subSubcategories || [];
//     subsRef.current    = subs;
//     subSubsRef.current = subSubs;
//     setSubcategories(subs);
//     setSubSubcategories(subSubs);
//   };

//   const buildFormFromItem = (item, overrides = {}) => {
//     const subId = item.subcategory?._id || item.subcategory?.id || "";
//     const ssId  = item.subSubcategory?.id || item.subSubcategory?._id || "";
//     return {
//       name:               item.name || "",
//       brand:              item.brand || "",
//       category:           item.category?._id?.toString() || item.category?.toString() || "",
//       subcategory:        subId,
//       subSubcategory:     ssId,
//       description:        item.description || "",
//       basePrice:          item.basePrice ?? "",
//       profitLoss:         item.profitLoss ?? 0,
//       weightValue:        item.weight?.value ?? 1,
//       weightUnit:         item.weight?.unit || "kg",
//       gstPercent:         item.gstPercent !== undefined ? String(item.gstPercent) : "",
//       hsnCode:            item.hsnCode || "",
//       taxType:            item.taxType || "cgst_sgst",
//       validTill:          item.validTill ? item.validTill.split("T")[0] : "",
//       status:             item.status || "inactive",
//       primaryImageFile:   null,
//       existingPrimaryUrl: item.image || "",
//       keepPrimaryImage:   true,
//       galleryNewFiles:    [],
//       existingGallery:    Array.isArray(item.galleryImages) ? item.galleryImages : [],
//       ...overrides,
//     };
//   };

//   const openCopyInForm = (item) => {
//     populateSubRefs(item);
//     const copyForm = buildFormFromItem(item, { name: item.name + " (Copy)", status: "inactive" });
//     setEditId(null); setSavedProductId(null); setProductRanges([]);
//     setUploaderKey(`copy-${item._id}-${Date.now()}`);
//     setActiveMenu(null); setForm(copyForm); setMode("copy");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     showAlert("Product copy hua — naam edit karo aur 'Save as New Product' dabao ✏️", "success");
//   };

//   const handleEdit = async (item) => {
//     populateSubRefs(item);
//     const editForm = buildFormFromItem(item);
//     setEditId(item._id); setSavedProductId(item._id); setProductRanges([]);
//     setUploaderKey(`edit-${item._id}`);
//     setActiveMenu(null); setForm(editForm); setMode("edit");
//     await fetchProductRanges(item._id);
//   };

//   const openAddForm = () => {
//     setForm(EMPTY_FORM); setMode("add"); setEditId(null); setSavedProductId(null);
//     setUploaderKey(`new-${Date.now()}`);
//     setSubcategories([]); setSubSubcategories([]);
//     subsRef.current = []; subSubsRef.current = [];
//     setProductRanges([]);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setItems((prev) => prev.filter((x) => x._id !== id));
//       setSelectedItems((prev) => prev.filter((x) => x !== id));
//       setActiveMenu(null);
//       showAlert("Item deleted successfully", "success");
//     } catch { showAlert("Delete failed", "error"); }
//   };

//   const handleStatusToggle = async (item) => {
//     try {
//       const newStatus = item.status === "active" ? "inactive" : "active";
//       await axios.put(`${API_URL}/status/${item._id}`, { status: newStatus });
//       setItems((prev) => prev.map((x) => x._id === item._id ? { ...x, status: newStatus } : x));
//       showAlert(`Status updated to ${newStatus}`, "success");
//     } catch { showAlert("Status update failed", "error"); }
//   };

//   const updateLocalItemField = (id, key, value) =>
//     setItems((prev) => prev.map((x) => x._id === id ? { ...x, [key]: value } : x));

//   const handleBulkSave = async () => {
//     if (!selectedItems.length) { showAlert("No items selected", "warning"); return; }
//     const updates = items.filter((x) => selectedItems.includes(x._id)).map((x) => ({
//       id: x._id, basePrice: Number(x.basePrice), profitLoss: Number(x.profitLoss),
//       gstPercent: Number(x.gstPercent || 0), hsnCode: x.hsnCode || "",
//       taxType: x.taxType || "cgst_sgst", brand: x.brand || "", status: x.status,
//     }));
//     try {
//       await axios.post(`${API_URL}/bulk-update`, { products: updates });
//       showAlert("Bulk save successful", "success");
//       setBulkMode(false); setSelectedItems([]); fetchItems();
//     } catch { showAlert("Bulk save failed", "error"); }
//   };

//   const handleBulkDelete = async () => {
//     if (!selectedItems.length) { showAlert("No items selected", "warning"); return; }
//     if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return;
//     try {
//       await Promise.all(selectedItems.map((id) => axios.delete(`${API_URL}/${id}`)));
//       setSelectedItems([]); fetchItems(); setBulkMode(false);
//       showAlert("Selected items deleted", "success");
//     } catch { showAlert("Bulk delete failed", "error"); }
//   };

//   const updateBasePrice = async (item) => {
//     const newBase = Number(quickBasePrices[item._id] ?? item.basePrice);
//     if (isNaN(newBase)) { showAlert("Invalid Base Price", "error"); return; }
//     try {
//       setLoading(true);
//       const fd = new FormData();
//       fd.append("name",        item.name);
//       fd.append("brand",       item.brand || "");
//       fd.append("category",    item.category?._id);
//       if (item.subcategory) fd.append("subcategory", JSON.stringify({ id: item.subcategory._id || item.subcategory.id, name: item.subcategory.name, image: item.subcategory.image || "" }));
//       if (item.subSubcategory?.id) fd.append("subSubcategory", JSON.stringify(item.subSubcategory));
//       fd.append("basePrice",   newBase);
//       fd.append("profitLoss",  item.profitLoss);
//       fd.append("status",      item.status);
//       fd.append("gstPercent",  item.gstPercent || 0);
//       fd.append("hsnCode",     item.hsnCode || "");
//       fd.append("taxType",     item.taxType || "cgst_sgst");
//       fd.append("weight",      JSON.stringify(item.weight));
//       fd.append("keepPrimaryImage", "true");
//       fd.append("existingGallery",  JSON.stringify(item.galleryImages || []));
//       const res = await axios.put(`${API_URL}/${item._id}`, fd);
//       if (res.data.success) {
//         await fetchItems();
//         setQuickBasePrices((p) => { const n = { ...p }; delete n[item._id]; return n; });
//         showAlert("Base price updated", "success");
//       }
//     } catch { showAlert("Update failed", "error"); }
//     finally { setLoading(false); }
//   };

//   const updateProfitLoss = async (item) => {
//     const diff = Number(quickProfitLoss[item._id] ?? 0);
//     if (isNaN(diff)) { showAlert("Invalid Profit/Loss", "error"); return; }
//     try {
//       setLoading(true);
//       const res = await axios.put(`${API_URL}/updateDiff/${item._id}`, { diff });
//       if (res.data.success) {
//         await fetchItems();
//         setQuickProfitLoss((p) => { const n = { ...p }; delete n[item._id]; return n; });
//         showAlert("Profit/Loss updated", "success");
//       }
//     } catch { showAlert("Update failed", "error"); }
//     finally { setLoading(false); }
//   };

//   const handleAddCategory = async () => {
//     if (!newCategoryName.trim()) { showAlert("Category name is required", "warning"); return; }
//     try {
//       setCategoryLoading(true);
//       const res = await axios.post(CATEGORY_URL, { name: newCategoryName.trim() });
//       if (res.data?.success) {
//         showAlert("Category added successfully", "success");
//         setNewCategoryName(""); setShowCategoryModal(false);
//         await fetchCategories();
//       }
//     } catch { showAlert("Error while adding category", "error"); }
//     finally { setCategoryLoading(false); }
//   };

//   const filteredItems = items.filter((item) => {
//     const t = search.toLowerCase();
//     const matchText =
//       (item.name || "").toLowerCase().includes(t)           ||
//       (item.brand || "").toLowerCase().includes(t)          ||
//       (item.category?.name || "").toLowerCase().includes(t) ||
//       (item.subcategory?.name || "").toLowerCase().includes(t) ||
//       (item.hsnCode || "").toLowerCase().includes(t);
//     const matchCategory = !filterCategory    || item.category?._id   === filterCategory;
//     const matchSub      = !filterSubcategory || item.subcategory?._id === filterSubcategory;
//     return matchText && matchCategory && matchSub;
//   });

//   let sortedItems = [...filteredItems];
//   if (sortOrder === "low")  sortedItems.sort((a, b) => (Number(a.salePrice) || 0) - (Number(b.salePrice) || 0));
//   if (sortOrder === "high") sortedItems.sort((a, b) => (Number(b.salePrice) || 0) - (Number(a.salePrice) || 0));

//   const totalPages   = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
//   const currentItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const getPageNumbers = () => {
//     const delta = 2, range = [], rangeWithDots = [];
//     let l;
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
//     }
//     range.forEach((i) => {
//       if (l) { if (i - l === 2) rangeWithDots.push(l + 1); else if (i - l !== 1) rangeWithDots.push("..."); }
//       rangeWithDots.push(i); l = i;
//     });
//     return rangeWithDots;
//   };

//   const handleSelectAll = () => {
//     if (selectedItems.length === currentItems.length) setSelectedItems([]);
//     else setSelectedItems(currentItems.map((i) => i._id));
//   };

//   const formFieldsProps = {
//     form, handleChange, handleHsnSelect,
//     savedProductId,
//     handlePrimaryImageChange, handleGalleryChange,
//     categories, subcategories, subSubcategories,
//     onOpenCategoryModal: () => setShowCategoryModal(true),
//     uploaderKey,
//     editId: savedProductId || editId || null,
//     productRanges,
//     onRangesChange: setProductRanges,
//     hsnList,
//     onHsnAdded: handleHsnAddedInParent,
//     onOpenHsnManage: () => setShowHsnManageModal(true),
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 md:p-5">

//       {/* Alert */}
//       {alertBox.show && (
//         <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-right">
//           <div className={`rounded-xl shadow-xl border p-4 flex items-center gap-3 min-w-72 max-w-sm ${
//             alertBox.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
//             alertBox.type === "error"   ? "bg-red-50 border-red-200 text-red-800"       :
//                                           "bg-amber-50 border-amber-200 text-amber-800"}`}>
//             {alertBox.type === "success" ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> :
//              alertBox.type === "error"   ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0"   /> :
//                                            <Info className="w-5 h-5 text-amber-500 flex-shrink-0"        />}
//             <p className="font-medium text-sm flex-1">{alertBox.message}</p>
//             <button onClick={() => setAlertBox((p) => ({ ...p, show: false }))} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
//           </div>
//         </div>
//       )}

//       {/* Page Header */}
//       <div className="mb-5">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
//             <p className="text-sm text-gray-500 mt-0.5">{items.length} products total</p>
//           </div>
//           <div className="flex items-center gap-2 flex-wrap">
//             <button
//               onClick={() => { if (showForm) { resetForm(); return; } openAddForm(); }}
//               className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
//               {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//               {showForm ? "Close Form" : "Add Product"}
//             </button>
//             <button onClick={() => setShowHsnManageModal(true)}
//               className="flex items-center gap-2 px-4 py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
//               <Hash className="w-4 h-4" />HSN Codes
//               {hsnList.length > 0 && (
//                 <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//                   {hsnList.length}
//                 </span>
//               )}
//             </button>
//             <button onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
//               <Filter className="w-4 h-4" />Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search + Import/Export */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
//         <div className="flex flex-col md:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input type="text" placeholder="Search by name, brand, category, HSN code..." value={search}
//               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all" />
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={() => window.open(`${API_URL}/export`, "_blank")}
//               className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
//               <Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span>
//             </button>
//             <label className="cursor-pointer">
//               <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
//                 try {
//                   const fd = new FormData(); fd.append("file", e.target.files[0]);
//                   await axios.post(`${API_URL}/import`, fd);
//                   showAlert("Imported successfully", "success"); fetchItems();
//                 } catch { showAlert("Import failed", "error"); }
//               }} />
//               <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
//                 <Upload className="w-4 h-4" /><span className="hidden sm:inline">Import</span>
//               </div>
//             </label>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div>
//               <Label>Filter by Category</Label>
//               <SelectInput value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//                 <option value="">All Categories</option>
//                 {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//               </SelectInput>
//             </div>
//             <div>
//               <Label>Filter by Subcategory</Label>
//               <SelectInput value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} disabled={!filterSubs.length}>
//                 <option value="">{!filterCategory ? "Select category first" : "All Subcategories"}</option>
//                 {filterSubs.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </SelectInput>
//             </div>
//             <div>
//               <Label>Sort by Price</Label>
//               <SelectInput value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="">Default</option>
//                 <option value="low">↑ Low to High</option>
//                 <option value="high">↓ High to Low</option>
//               </SelectInput>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bulk actions */}
//       {selectedItems.length > 0 && (
//         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
//           {!bulkMode ? (
//             <div className="flex flex-wrap items-center justify-between gap-3">
//               <span className="font-semibold text-amber-800 text-sm">{selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected</span>
//               <div className="flex gap-2 flex-wrap">
//                 <button onClick={handleBulkDelete}
//                   className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
//                   <Trash2 className="w-3.5 h-3.5" />Delete
//                 </button>
//                 <button onClick={() => setBulkMode(true)}
//                   className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
//                   <Edit className="w-3.5 h-3.5" />Bulk Edit
//                 </button>
//                 <button onClick={() => {
//                   if (selectedItems.length !== 1) { showAlert("Copy ke liye sirf ek item select karo", "warning"); return; }
//                   const item = items.find((x) => x._id === selectedItems[0]);
//                   if (item) openCopyInForm(item);
//                 }} className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
//                   <Copy className="w-3.5 h-3.5" />Copy &amp; Edit
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-gray-800">Bulk Edit Selected Items</h3>
//                 <button onClick={() => setBulkMode(false)}><X className="w-4 h-4 text-gray-500" /></button>
//               </div>
//               <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
//                 {items.filter((item) => selectedItems.includes(item._id)).map((item) => (
//                   <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-3">
//                     <h4 className="font-medium text-gray-800 text-sm mb-3">
//                       {item.name}{item.brand && <span className="ml-2 text-xs text-blue-600 font-normal">{item.brand}</span>}
//                     </h4>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
//                       {[
//                         { label: "Brand",       key: "brand",      type: "text"   },
//                         { label: "Base Price",  key: "basePrice",  type: "number" },
//                         { label: "Profit/Loss", key: "profitLoss", type: "number" },
//                         { label: "GST %",       key: "gstPercent", type: "number" },
//                         { label: "HSN Code",    key: "hsnCode",    type: "text"   },
//                       ].map(({ label, key, type }) => (
//                         <div key={key}>
//                           <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
//                           <input type={type} value={item[key] ?? ""}
//                             onChange={(e) => updateLocalItemField(item._id, key, type === "number" ? Number(e.target.value) : e.target.value)}
//                             className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                         </div>
//                       ))}
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1 font-medium">Tax Type</label>
//                         <select value={item.taxType || "cgst_sgst"} onChange={(e) => updateLocalItemField(item._id, "taxType", e.target.value)}
//                           className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
//                           <option value="cgst_sgst">CGST+SGST</option>
//                           <option value="igst">IGST</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1 font-medium">Status</label>
//                         <select value={item.status} onChange={(e) => updateLocalItemField(item._id, "status", e.target.value)}
//                           className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex flex-wrap gap-2 pt-3 border-t border-amber-200">
//                 <button onClick={handleBulkSave}
//                   className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
//                   <Check className="w-4 h-4" />Save All
//                 </button>
//                 <button onClick={async () => {
//                   if (!selectedItems.length) return;
//                   const res = await axios.post(`${API_URL}/export-selected`, { ids: selectedItems }, { responseType: "blob" });
//                   const url = window.URL.createObjectURL(new Blob([res.data]));
//                   const a   = document.createElement("a"); a.href = url; a.download = "selected.csv"; a.click();
//                 }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
//                   <Download className="w-4 h-4" />Export Selected
//                 </button>
//                 <button onClick={() => setBulkMode(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add / Copy Form */}
//       {showForm && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {mode === "copy" ? "✏️ Duplicate Product — Edit & Save" : "Add New Product"}
//               </h2>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {mode === "copy" ? "Copied product — naam edit karo aur 'Save as New Product' dabao" : "Fill in the details below to add a new product"}
//               </p>
//             </div>
//             <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <FormFields {...formFieldsProps} />
//             <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
//               <button type="submit" disabled={isSubmitting}
//                 className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-70">
//                 {isSubmitting
//                   ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                   : <><Plus className="w-4 h-4" />{mode === "copy" ? "Save as New Product" : "Add Product"}</>}
//               </button>
//               <button type="button" onClick={resetForm}
//                 className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//           <div>
//             <h2 className="font-bold text-gray-900">All Products</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Showing {currentItems.length} of {filteredItems.length} results</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
//             <button onClick={() => setColumnVisibility((p) => ({ ...p, category: !p.category }))}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               {columnVisibility.category ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="py-20 flex flex-col items-center justify-center gap-3">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//             <p className="text-sm text-gray-400">Loading products...</p>
//           </div>
//         ) : currentItems.length === 0 ? (
//           <div className="py-20 flex flex-col items-center justify-center gap-2 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
//               <Search className="w-8 h-8 text-gray-300" />
//             </div>
//             <p className="font-medium text-gray-500">No products found</p>
//             <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="py-3 px-4 text-left w-10">
//                       <input type="checkbox"
//                         checked={selectedItems.length === currentItems.length && currentItems.length > 0}
//                         onChange={handleSelectAll}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
//                     {columnVisibility.category && (
//                       <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
//                     )}
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Base Price</th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale Price</th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">HSN / GST</th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {currentItems.map((item) => {
//                     const hsnInfo = hsnList.find((h) => h.code === item.hsnCode);
//                     const gstKey  = item.gstPercent ?? hsnInfo?.gst ?? 0;
//                     const badge   = GST_BADGE[gstKey] ?? GST_BADGE[0];
//                     return (
//                       <tr key={item._id} className="hover:bg-gray-50 transition-colors">
//                         <td className="py-3 px-4">
//                           <input type="checkbox" checked={selectedItems.includes(item._id)}
//                             onChange={() => setSelectedItems((prev) =>
//                               prev.includes(item._id) ? prev.filter((x) => x !== item._id) : [...prev, item._id]
//                             )}
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-3">
//                             <ProductThumb image={item.image} galleryImages={item.galleryImages} name={item.name} />
//                             <div>
//                               <div className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</div>
//                               {item.brand && <div className="text-xs text-blue-600 font-medium mt-0.5">{item.brand}</div>}
//                               <div className="text-xs text-gray-400 mt-0.5">{item.weight ? `${item.weight.value} ${item.weight.unit}` : "1 kg"}</div>
//                               {item.galleryImages?.length > 0 && (
//                                 <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
//                                   <Images className="w-3 h-3" />{item.galleryImages.length} gallery
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         {columnVisibility.category && (
//                           <td className="py-3 px-4">
//                             <div className="text-sm font-medium text-gray-800">{item.category?.name || "—"}</div>
//                             {item.subcategory?.name    && <div className="text-xs text-gray-500 mt-0.5">↳ {item.subcategory.name}</div>}
//                             {item.subSubcategory?.name && <div className="text-xs text-purple-500 mt-0.5">↳ {item.subSubcategory.name}</div>}
//                           </td>
//                         )}
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-1.5">
//                             <span className="text-xs text-gray-400">₹</span>
//                             <input type="number"
//                               value={quickBasePrices[item._id] !== undefined ? quickBasePrices[item._id] : item.basePrice}
//                               onChange={(e) => setQuickBasePrices((p) => ({ ...p, [item._id]: e.target.value }))}
//                               className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
//                             <button onClick={() => updateBasePrice(item)}
//                               className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
//                               <Check className="w-3 h-3" />
//                             </button>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="font-bold text-gray-900">₹{Number(item.salePrice).toFixed(2)}</div>
//                           <div className="flex items-center gap-1.5 mt-1.5">
//                             <input type="number" placeholder="Δ P/L"
//                               value={quickProfitLoss[item._id] ?? ""}
//                               onChange={(e) => setQuickProfitLoss((p) => ({ ...p, [item._id]: e.target.value }))}
//                               className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-center" />
//                             <button onClick={() => updateProfitLoss(item)}
//                               className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
//                               <Check className="w-3 h-3" />
//                             </button>
//                           </div>
//                           <div className={`text-xs font-semibold mt-1 ${item.profitLoss >= 0 ? "text-green-600" : "text-red-500"}`}>
//                             {item.profitLoss >= 0 ? "▲" : "▼"} {Math.abs(item.profitLoss)}
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 min-w-[160px]">
//                           {item.hsnCode ? (
//                             <div>
//                               <div className="flex items-center gap-1.5 flex-wrap">
//                                 <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{item.hsnCode}</span>
//                                 <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
//                                   <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />GST {item.gstPercent ?? 0}%
//                                 </span>
//                               </div>
//                               {hsnInfo && <div className="text-[10px] text-gray-400 mt-1 max-w-[180px] truncate">{hsnInfo.description}</div>}
//                               <div className="text-[10px] text-gray-400 mt-0.5 uppercase">{item.taxType === "igst" ? "IGST" : "CGST+SGST"}</div>
//                             </div>
//                           ) : (
//                             <span className="text-xs text-gray-400 italic">Not set</span>
//                           )}
//                         </td>
//                         <td className="py-3 px-4">
//                           <button onClick={() => handleStatusToggle(item)}
//                             className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
//                               item.status === "active"
//                                 ? "bg-green-100 text-green-700 hover:bg-green-200"
//                                 : "bg-red-100 text-red-700 hover:bg-red-200"
//                             }`}>
//                             {item.status === "active" ? "Active" : "Inactive"}
//                           </button>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="relative">
//                             <button onClick={() => setActiveMenu(activeMenu === item._id ? null : item._id)}
//                               className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                               <MoreVertical className="w-4 h-4 text-gray-500" />
//                             </button>
//                             {activeMenu === item._id && (
//                               <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
//                                 <button onClick={() => handleEdit(item)}
//                                   className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                   <Edit className="w-3.5 h-3.5 text-blue-500" />Edit Product
//                                 </button>
//                                 <button onClick={() => openCopyInForm(item)}
//                                   className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                   <Copy className="w-3.5 h-3.5 text-purple-500" />Duplicate &amp; Edit
//                                 </button>
//                                 <div className="border-t border-gray-100" />
//                                 <button onClick={() => { handleDelete(item._id); setActiveMenu(null); }}
//                                   className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
//                                   <Trash2 className="w-3.5 h-3.5" />Delete
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-5 py-4 border-t border-gray-100">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div className="text-xs text-gray-500">
//                     Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {[
//                       { icon: <ChevronsLeft className="w-3.5 h-3.5" />,  action: () => setCurrentPage(1),               disabled: currentPage === 1         },
//                       { icon: <ChevronLeft className="w-3.5 h-3.5" />,   action: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1         },
//                     ].map((btn, i) => (
//                       <button key={i} onClick={btn.action} disabled={btn.disabled}
//                         className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
//                         {btn.icon}
//                       </button>
//                     ))}
//                     {getPageNumbers().map((pageNum, i) => (
//                       <button key={i} onClick={() => pageNum !== "..." && setCurrentPage(pageNum)}
//                         className={`min-w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
//                           currentPage === pageNum ? "bg-blue-600 text-white shadow-sm" :
//                           pageNum === "..."       ? "text-gray-400 cursor-default"     :
//                                                     "border border-gray-200 hover:bg-gray-50 text-gray-700"
//                         }`}>{pageNum}</button>
//                     ))}
//                     {[
//                       { icon: <ChevronRight className="w-3.5 h-3.5" />,  action: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages },
//                       { icon: <ChevronsRight className="w-3.5 h-3.5" />, action: () => setCurrentPage(totalPages),      disabled: currentPage === totalPages },
//                     ].map((btn, i) => (
//                       <button key={i} onClick={btn.action} disabled={btn.disabled}
//                         className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
//                         {btn.icon}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Edit Modal ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
//             <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
//               <div>
//                 <h2 className="font-bold text-gray-900 text-lg">Edit Product</h2>
//                 <p className="text-sm text-gray-500">Update product details, images &amp; price ranges</p>
//               </div>
//               <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="overflow-y-auto flex-1 p-6" style={{ overflowX: "visible" }}>
//               <form onSubmit={handleSubmit} id="edit-form">
//                 <FormFields {...formFieldsProps} />
//               </form>
//             </div>
//             <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50">
//               <button type="submit" form="edit-form" disabled={isSubmitting}
//                 className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-70">
//                 {isSubmitting
//                   ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</>
//                   : <><Check className="w-4 h-4" />Update Product</>}
//               </button>
//               <button type="button" onClick={resetForm}
//                 className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors text-sm font-medium">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Category Modal ── */}
//       {showCategoryModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-100">
//               <h2 className="font-bold text-gray-900">Add New Category</h2>
//               <p className="text-sm text-gray-500 mt-0.5">This category will be available immediately</p>
//             </div>
//             <div className="p-6">
//               <Label required>Category Name</Label>
//               <Input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
//                 placeholder="e.g. Dairy Products" autoFocus
//                 onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
//               <div className="flex gap-3 mt-5">
//                 <button onClick={handleAddCategory} disabled={categoryLoading}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-70">
//                   {categoryLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save Category"}
//                 </button>
//                 <button onClick={() => { setShowCategoryModal(false); setNewCategoryName(""); }}
//                   className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── HSN Add Modal ── */}
//       {showHsnAddModal && (
//         <AddHsnModal
//           onClose={() => setShowHsnAddModal(false)}
//           onAdded={(newHsn) => { handleHsnAddedInParent(newHsn); setShowHsnAddModal(false); }}
//           existingHsnCategories={[...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort()}
//         />
//       )}

//       {/* ── HSN Manage Modal ── */}
//       {showHsnManageModal && (
//         <HsnManageModal
//           onClose={() => setShowHsnManageModal(false)}
//           hsnList={hsnList}
//           onDelete={handleHsnDeletedInParent}
//           onAddNew={() => { setShowHsnManageModal(false); setShowHsnAddModal(true); }}
//         />
//       )}

//     </div>
//   );
// }

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Search, Plus, Edit, Trash2, Copy, MoreVertical, Check, X,
  AlertCircle, CheckCircle, Info, Loader2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Download, Upload, Filter, Eye, EyeOff, ChevronDown, Tag,
  ImagePlus, ZoomIn, Images, Star, DollarSign, Layers, Sparkles,
  Hash, Settings, TrendingUp, TrendingDown, ArrowRight, Receipt,
} from "lucide-react";

const API_URL      = "https://grocerrybackend.onrender.com/api/prices";
const CATEGORY_URL = "https://grocerrybackend.onrender.com/api/categories";
const DISCOUNT_URL = "https://grocerrybackend.onrender.com/api/discount";

const GST_BADGE = {
  0:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  5:  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  12: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
  18: { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500"  },
  28: { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
};

const MAX_GALLERY = 5;
const EMPTY_ROW = () => ({
  id:        Date.now() + Math.random(),
  minQty:    "",
  maxQty:    "",
  profit:    "",
  unitPrice: "",
});

const calcUnitPrice = (basePrice, profit) => {
  const b = Number(basePrice) || 0;
  const p = profit === "" || profit === null || profit === undefined ? 0 : Number(profit);
  return Number((b + p).toFixed(2));
};

const calcProfit = (basePrice, unitPrice) => {
  const b = Number(basePrice) || 0;
  const u = Number(unitPrice) || 0;
  return Number((u - b).toFixed(2));
};

// ─────────────────────────────────────────────
// GST + CESS live preview calculator (mirrors backend)
// ─────────────────────────────────────────────
function calcGstBreakdown(base, pl, gstPercent, cessPercent, taxType) {
  const priceExcludingGst = (Number(base) || 0) + (Number(pl) || 0);
  const gst  = Number(gstPercent)  || 0;
  const cess = Number(cessPercent) || 0;
  const gstAmount  = (priceExcludingGst * gst)  / 100;
  const cessAmount = (priceExcludingGst * cess) / 100;
  const totalTaxAmount = gstAmount + cessAmount;
  const salePrice      = priceExcludingGst + totalTaxAmount;

  const cgstPercent = taxType === "cgst_sgst" ? gst / 2 : 0;
  const sgstPercent = taxType === "cgst_sgst" ? gst / 2 : 0;
  const igstPercent = taxType === "igst"      ? gst     : 0;
  const cgstAmount  = taxType === "cgst_sgst" ? gstAmount / 2 : 0;
  const sgstAmount  = taxType === "cgst_sgst" ? gstAmount / 2 : 0;
  const igstAmount  = taxType === "igst"      ? gstAmount     : 0;

  const r2 = (n) => Math.round(n * 100) / 100;
  return {
    priceExcludingGst: r2(priceExcludingGst),
    gstAmount:         r2(gstAmount),
    cgstPercent:       r2(cgstPercent),
    sgstPercent:       r2(sgstPercent),
    igstPercent:       r2(igstPercent),
    cgstAmount:        r2(cgstAmount),
    sgstAmount:        r2(sgstAmount),
    igstAmount:        r2(igstAmount),
    cessAmount:        r2(cessAmount),
    totalTaxAmount:    r2(totalTaxAmount),
    salePrice:         r2(salePrice),
  };
}

/* ══════════════════════════════════════════════════════════════
   PRICE RANGES SECTION
══════════════════════════════════════════════════════════════ */
const PriceRangesSection = ({ productId, basePrice, existingRanges, onRangesChange }) => {
  const [rows,        setRows]        = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [savedRanges, setSavedRanges] = useState(existingRanges || []);
  const [deletingId,  setDeletingId]  = useState(null);
  const [editingId,   setEditingId]   = useState(null);
  const [editRow,     setEditRow]     = useState(null);
  const [savingEdit,  setSavingEdit]  = useState(false);

  const base = Number(basePrice) || 0;

  useEffect(() => { setSavedRanges(existingRanges || []); }, [existingRanges]);

  const addRow    = () => setRows((p) => [...p, EMPTY_ROW()]);
  const removeRow = (id) => setRows((p) => p.filter((r) => r.id !== id));

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === "profit")    updated.unitPrice = value === "" ? "" : String(calcUnitPrice(base, value));
      if (field === "unitPrice") updated.profit    = value === "" ? "" : String(calcProfit(base, value));
      return updated;
    }));
  };

  const saveRows = async () => {
    for (const row of rows) {
      if (!row.minQty)                                       return alert("Min Qty required hai.");
      if (Number(row.minQty) < 1)                            return alert("Min Qty must be ≥ 1");
      if (row.maxQty && Number(row.maxQty) < Number(row.minQty)) return alert("Max Qty must be ≥ Min Qty");
      if (row.unitPrice === "" && row.profit === "")         return alert("Profit ya Unit Price enter karo.");
    }
    if (!productId) return alert("Pehle product save karo, phir price ranges add kar sakte ho.");

    setSaving(true);
    try {
      const results = await Promise.all(
        rows.map((row) => {
          const finalProfit    = row.profit    !== "" ? Number(row.profit)    : calcProfit(base, row.unitPrice);
          const finalUnitPrice = row.unitPrice !== "" ? Number(row.unitPrice) : calcUnitPrice(base, row.profit);
          return axios.post(`${DISCOUNT_URL}/add`, {
            product: productId, minQty: Number(row.minQty),
            maxQty: row.maxQty !== "" ? Number(row.maxQty) : null,
            basePrice: base, profit: finalProfit, unitPrice: finalUnitPrice,
          });
        })
      );
      const newSaved = results.map((r) => r.data.data);
      const updated  = [...savedRanges, ...newSaved];
      setSavedRanges(updated);
      setRows([]);
      if (onRangesChange) onRangesChange(updated);
    } catch (err) {
      alert(err.response?.data?.message || "Price ranges save karne mein error aaya");
    } finally {
      setSaving(false);
    }
  };

  const deleteSaved = async (ruleId) => {
    if (!window.confirm("Is price range ko delete karna chahte ho?")) return;
    setDeletingId(ruleId);
    try {
      await axios.delete(`${DISCOUNT_URL}/${ruleId}`);
      const updated = savedRanges.filter((r) => r._id !== ruleId);
      setSavedRanges(updated);
      if (onRangesChange) onRangesChange(updated);
    } catch {
      alert("Delete karne mein error aaya");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (rule) => {
    setEditingId(rule._id);
    setEditRow({
      minQty:    String(rule.minQty),
      maxQty:    rule.maxQty != null ? String(rule.maxQty) : "",
      profit:    String(rule.profit ?? calcProfit(rule.basePrice || base, rule.unitPrice)),
      unitPrice: String(rule.unitPrice),
      basePrice: String(rule.basePrice || base),
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditRow(null); };

  const updateEditRow = (field, value) => {
    setEditRow((prev) => {
      const updated   = { ...prev, [field]: value };
      const editBase  = Number(prev.basePrice) || base;
      if (field === "profit")    updated.unitPrice = value === "" ? "" : String(calcUnitPrice(editBase, value));
      if (field === "unitPrice") updated.profit    = value === "" ? "" : String(calcProfit(editBase, value));
      return updated;
    });
  };

  const saveEdit = async (ruleId) => {
    if (!editRow.minQty) return alert("Min Qty required");
    setSavingEdit(true);
    try {
      const editBase       = Number(editRow.basePrice) || base;
      const finalProfit    = editRow.profit    !== "" ? Number(editRow.profit)    : calcProfit(editBase, editRow.unitPrice);
      const finalUnitPrice = editRow.unitPrice !== "" ? Number(editRow.unitPrice) : calcUnitPrice(editBase, editRow.profit);
      const res = await axios.put(`${DISCOUNT_URL}/${ruleId}`, {
        minQty: Number(editRow.minQty),
        maxQty: editRow.maxQty !== "" ? Number(editRow.maxQty) : null,
        profit: finalProfit, unitPrice: finalUnitPrice,
      });
      const updated = savedRanges.map((r) => r._id === ruleId ? res.data.data : r);
      setSavedRanges(updated);
      setEditingId(null);
      setEditRow(null);
      if (onRangesChange) onRangesChange(updated);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSavingEdit(false);
    }
  };

  const profitColor = (profit) => {
    if (profit == null || profit === 0)
      return { bg: "bg-gray-100", text: "text-gray-600", icon: null };
    if (profit > 0)
      return { bg: "bg-green-100", text: "text-green-700", icon: <TrendingUp className="w-3 h-3" /> };
    return { bg: "bg-red-100", text: "text-red-700", icon: <TrendingDown className="w-3 h-3" /> };
  };

  return (
    <div className="space-y-4">
      {/* Base Price Banner */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
        <DollarSign className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-blue-700">Product Base Price:</span>
          <span className="font-mono font-bold text-blue-800 text-sm">
            {base > 0 ? `₹${base.toFixed(2)}` : "—"}
          </span>
          {base === 0 && (
            <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Pehle Base Price set karo
            </span>
          )}
          <span className="text-[11px] text-blue-500">Unit Price = Base Price + Profit/Loss</span>
        </div>
      </div>

      {/* Saved Ranges */}
      {savedRanges.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50/40 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-green-200 bg-green-50 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Saved Price Ranges ({savedRanges.length})
            </span>
          </div>
          <div className="divide-y divide-green-100">
            {savedRanges.map((rule, idx) => {
              const ruleBase   = Number(rule.basePrice || base);
              const ruleProfit = rule.profit != null ? Number(rule.profit) : calcProfit(ruleBase, rule.unitPrice);
              const pc         = profitColor(ruleProfit);
              const isEditing  = editingId === rule._id;
              return (
                <div key={rule._id || idx}>
                  {isEditing ? (
                    <div className="px-4 py-3 bg-blue-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Editing Range #{idx + 1}</span>
                        <span className="text-[10px] text-gray-400">Base: ₹{Number(editRow.basePrice || base).toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        {[
                          { label: "Min Qty", key: "minQty", req: true, prefix: null, placeholder: "1" },
                          { label: "Max Qty", key: "maxQty", req: false, prefix: null, placeholder: "∞" },
                          { label: "Profit / Loss (₹)", key: "profit", req: false, prefix: "±", placeholder: "0.00" },
                          { label: "Unit Price (₹)", key: "unitPrice", req: true, prefix: "₹", placeholder: "0.00" },
                        ].map(({ label, key, req, prefix, placeholder }) => (
                          <div key={key}>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                              {label}{req && <span className="text-red-500"> *</span>}
                            </label>
                            <div className="relative">
                              {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{prefix}</span>}
                              <input type="number" min={key === "minQty" || key === "maxQty" ? "1" : undefined}
                                step={key === "profit" || key === "unitPrice" ? "0.01" : undefined}
                                value={editRow[key]}
                                onChange={(e) => updateEditRow(key, e.target.value)}
                                placeholder={placeholder}
                                className={`w-full border border-gray-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${prefix ? "pl-6 pr-2.5" : "px-2.5"}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => saveEdit(rule._id)} disabled={savingEdit}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-semibold disabled:opacity-70">
                          {savingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}Save
                        </button>
                        <button type="button" onClick={cancelEdit}
                          className="px-3.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-green-700">{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {[{ label: "Min Qty", val: rule.minQty }, { label: "Max Qty", val: rule.maxQty != null ? rule.maxQty : "∞" }].map(({ label, val }) => (
                          <div key={label} className="bg-white border border-green-200 rounded-lg px-2.5 py-1.5 text-center min-w-[60px]">
                            <div className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">{label}</div>
                            <div className="text-sm font-bold text-gray-800">{val}</div>
                          </div>
                        ))}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-center min-w-[80px] flex-shrink-0">
                        <div className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Base</div>
                        <div className="text-xs font-semibold text-gray-600">₹{ruleBase.toFixed(2)}</div>
                      </div>
                      <span className="text-gray-400 text-sm font-bold flex-shrink-0">{ruleProfit >= 0 ? "+" : ""}</span>
                      <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-center min-w-[70px] flex-shrink-0 ${pc.bg}`}>
                        {pc.icon && <span className={pc.text}>{pc.icon}</span>}
                        <div>
                          <div className={`text-[9px] uppercase font-semibold mb-0.5 ${pc.text}`}>Profit</div>
                          <div className={`text-xs font-bold ${pc.text}`}>{ruleProfit >= 0 ? "+" : ""}₹{ruleProfit.toFixed(2)}</div>
                        </div>
                      </div>
                      <span className="text-gray-300 font-bold flex-shrink-0">=</span>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 text-center min-w-[90px] flex-shrink-0">
                        <div className="text-[9px] text-blue-500 uppercase font-semibold mb-0.5">Unit Price</div>
                        <div className="text-sm font-bold text-blue-700">₹{Number(rule.unitPrice).toFixed(2)}</div>
                      </div>
                      {ruleBase !== base && base > 0 && (
                        <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0">⚠ Base changed</span>
                      )}
                      <div className="ml-auto flex items-center gap-1 flex-shrink-0">
                        <button type="button" onClick={() => startEdit(rule)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors border border-blue-100">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => deleteSaved(rule._id)} disabled={deletingId === rule._id}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100 disabled:opacity-50">
                          {deletingId === rule._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Pending Rows */}
      {rows.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-blue-200 bg-blue-50 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New Ranges (pending save)</span>
          </div>
          <div className="p-3 space-y-3">
            {rows.map((row, idx) => {
              const rowProfit    = row.profit    !== "" ? Number(row.profit)    : 0;
              const rowUnitPrice = row.unitPrice !== "" ? Number(row.unitPrice) : calcUnitPrice(base, rowProfit);
              const pc           = profitColor(rowProfit);
              return (
                <div key={row.id} className="bg-white rounded-xl border border-blue-100 px-3 py-3 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-700">{(savedRanges.length || 0) + idx + 1}</span>
                      </div>
                      {base > 0 && (
                        <span className="text-[11px] text-gray-500">
                          ₹{base.toFixed(2)}
                          {rowProfit !== 0 && (
                            <span className={rowProfit > 0 ? "text-green-600" : "text-red-600"}>
                              {rowProfit >= 0 ? " + " : " - "}₹{Math.abs(rowProfit).toFixed(2)}
                            </span>
                          )}
                          <span className="text-blue-700 font-semibold"> = ₹{rowUnitPrice.toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                    <button type="button" onClick={() => removeRow(row.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Min Qty <span className="text-red-500">*</span></label>
                      <input type="number" min="1" value={row.minQty} onChange={(e) => updateRow(row.id, "minQty", e.target.value)}
                        placeholder="1" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Max Qty <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="number" min="1" value={row.maxQty} onChange={(e) => updateRow(row.id, "maxQty", e.target.value)}
                        placeholder="∞ Unlimited" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Profit / Loss (₹)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">±</span>
                        <input type="number" step="0.01" value={row.profit} onChange={(e) => updateRow(row.id, "profit", e.target.value)}
                          placeholder="0.00"
                          className={`w-full border rounded-lg pl-7 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500
                            ${rowProfit > 0 ? "border-green-200 bg-green-50/50" : rowProfit < 0 ? "border-red-200 bg-red-50/50" : "border-gray-200 bg-gray-50/50"}`} />
                      </div>
                      {base > 0 && row.profit !== "" && (
                        <p className={`text-[10px] mt-0.5 font-medium ${rowProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {rowProfit >= 0 ? "+" : ""}{((rowProfit / base) * 100).toFixed(1)}% of base
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Unit Price (₹) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₹</span>
                        <input type="number" min="0" step="0.01" value={row.unitPrice} onChange={(e) => updateRow(row.id, "unitPrice", e.target.value)}
                          placeholder={base > 0 ? String(base.toFixed(2)) : "0.00"}
                          className="w-full border border-blue-200 rounded-lg pl-6 pr-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50" />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Base + Profit = Final</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={addRow}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" />Add Price Range
        </button>
        {rows.length > 0 && (
          <>
            <button type="button" onClick={saveRows} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-semibold shadow-sm disabled:opacity-70">
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Check className="w-3.5 h-3.5" />Save {rows.length} Range{rows.length !== 1 ? "s" : ""}</>}
            </button>
            <button type="button" onClick={() => setRows([])}
              className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-xs font-medium">Discard</button>
          </>
        )}
        {savedRanges.length === 0 && rows.length === 0 && (
          <p className="text-xs text-gray-400 italic">No price ranges yet.</p>
        )}
      </div>
      {rows.length > 0 && !productId && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />Product save hone ke baad price ranges save hongi.
        </p>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   IMAGE COMPONENTS
══════════════════════════════════════════════════════════════ */
const Lightbox = ({ src, onClose }) => (
  <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
      <img src={src} alt="Preview" className="w-full rounded-2xl object-contain max-h-[80vh] shadow-2xl" />
      <button onClick={onClose} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
        <X className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  </div>
);

const PrimaryImageUploader = ({ existingUrl, file, onChange }) => {
  const inputRef   = useRef(null);
  const [lightbox, setLightbox] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const blobUrlRef = useRef(null);

  useEffect(() => { return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); }; }, []);

  let previewUrl = null;
  if (file) {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = URL.createObjectURL(file);
    previewUrl = blobUrlRef.current;
  } else if (existingUrl) {
    previewUrl = existingUrl;
  }

  const handleFile   = (f) => { if (f && f.type.startsWith("image/")) onChange(f, "new"); };
  const handleRemove = (e) => {
    e.stopPropagation();
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
    onChange(null, "remove");
  };

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative group w-full aspect-video max-h-52 rounded-xl overflow-hidden border-2 border-blue-200 bg-gray-50 shadow-sm">
          <img src={previewUrl} alt="Primary" className="w-full h-full object-contain" />
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10">
            <Star className="w-3 h-3" /> Primary
          </span>
          {existingUrl && !file && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded z-10">Saved</span>}
          {file        && <span className="absolute bottom-2 left-2 bg-green-600/80 text-white text-[10px] px-2 py-1 rounded z-10">New ✓</span>}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
            <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
              className="p-2.5 bg-white/90 rounded-xl hover:bg-white transition-colors text-gray-700 shadow"><ZoomIn className="w-4 h-4" /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="p-2.5 bg-blue-500/90 rounded-xl hover:bg-blue-500 text-white transition-colors shadow"><ImagePlus className="w-4 h-4" /></button>
            <button type="button" onClick={handleRemove}
              className="p-2.5 bg-red-500/90 rounded-xl hover:bg-red-500 text-white transition-colors shadow"><X className="w-4 h-4" /></button>
          </div>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          className={`w-full aspect-video max-h-52 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200
            ${dragOver ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"}`}>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3"><ImagePlus className="w-6 h-6 text-blue-400" /></div>
          <p className="text-sm font-medium text-gray-600">Click or drag to upload</p>
          <p className="text-xs text-gray-400 mt-1">Primary product image (JPG, PNG, WEBP)</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      {lightbox && previewUrl && <Lightbox src={previewUrl} onClose={() => setLightbox(false)} />}
    </div>
  );
};

const GalleryImageUploader = ({ initialExistingUrls, initialNewFiles, onChange }) => {
  const inputRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const idCounter = useRef(0);
  const genId = () => `g_${++idCounter.current}_${Date.now()}`;

  const buildInitialSlots = () => [
    ...(initialExistingUrls || []).map((url)  => ({ id: genId(), type: "existing", url,  previewUrl: url })),
    ...(initialNewFiles    || []).map((file) => ({ id: genId(), type: "new",      file, previewUrl: URL.createObjectURL(file) })),
  ];
  const [slots, setSlots] = useState(buildInitialSlots);

  const propagate = useCallback((updated) => {
    setSlots(updated);
    onChange(
      updated.filter((s) => s.type === "new").map((s) => s.file),
      updated.filter((s) => s.type === "existing").map((s) => s.url)
    );
  }, [onChange]);

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/")).slice(0, MAX_GALLERY - slots.length);
    if (!valid.length) return;
    propagate([...slots, ...valid.map((file) => ({ id: genId(), type: "new", file, previewUrl: URL.createObjectURL(file) }))]);
  };

  const removeSlot   = (id) => propagate(slots.filter((s) => s.id !== id));
  const totalFilled  = slots.length;
  const emptySlots   = Math.max(0, MAX_GALLERY - totalFilled);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot, idx) => (
          <div key={slot.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm">
            <img src={slot.previewUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => removeSlot(slot.id)}
              className="absolute top-1.5 right-1.5 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 border-2 border-white shadow transition-all">
              <X className="w-3 h-3 text-white" strokeWidth={3} />
            </button>
            <span className={`absolute bottom-1 left-1 text-[9px] font-semibold px-1.5 py-0.5 rounded z-10 text-white ${slot.type === "existing" ? "bg-black/50" : "bg-green-600/80"}`}>
              {slot.type === "existing" ? "Saved" : "New"}
            </span>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <button type="button" onClick={() => setLightbox(slot.previewUrl)} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:bg-white shadow">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, idx) => (
          <div key={`empty-${idx}`}
            onClick={() => totalFilled < MAX_GALLERY && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200
              ${dragOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"}`}>
            <Plus className={`${idx === 0 && totalFilled === 0 ? "w-6 h-6" : "w-5 h-5"} text-gray-300`} />
            {idx === 0 && totalFilled === 0 && (
              <span className="text-[10px] text-gray-400 mt-1 text-center leading-tight px-1">Add gallery<br />images</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 text-right">{totalFilled}/{MAX_GALLERY} gallery images · Click ✕ to remove</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
};

const ProductThumb = ({ image, galleryImages, name }) => {
  const [lightbox, setLightbox] = useState(null);
  const allImgs = [image, ...(galleryImages || [])].filter(Boolean);
  if (!allImgs.length) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-300 text-[10px] font-bold">N/A</span>
      </div>
    );
  }
  return (
    <>
      <div className="relative flex-shrink-0">
        <button type="button" onClick={() => setLightbox(image || allImgs[0])}
          className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm block hover:scale-110 transition-transform">
          <img src={image || allImgs[0]} alt={name} className="w-full h-full object-cover" />
        </button>
        {allImgs.length > 1 && (
          <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white cursor-pointer"
            onClick={() => setLightbox(allImgs[1])}>
            {allImgs.length}
          </span>
        )}
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <div className="relative max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center mb-3">
              {allImgs.map((url, idx) => (
                <button key={idx} onClick={() => setLightbox(url)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${lightbox === url ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <img src={lightbox} alt="Preview" className="w-full rounded-2xl object-contain max-h-[70vh] shadow-2xl" />
            <button onClick={() => setLightbox(null)} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   GST BREAKDOWN PREVIEW PANEL
   Shows live CGST/SGST/IGST/CESS breakdown as user fills form
══════════════════════════════════════════════════════════════ */
const GstBreakdownPanel = ({ basePrice, profitLoss, gstPercent, cessPercent, taxType }) => {
  const base = Number(basePrice)  || 0;
  const pl   = Number(profitLoss) || 0;
  const gst  = Number(gstPercent) || 0;
  const cess = Number(cessPercent) || 0;

  if (base === 0 && gst === 0 && cess === 0) return null;

  const bd = calcGstBreakdown(base, pl, gst, cess, taxType || "cgst_sgst");
  const isIgst = (taxType || "cgst_sgst") === "igst";

  return (
    <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-indigo-100/70 border-b border-indigo-200 flex items-center gap-2">
        <Receipt className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Live Tax Breakdown</span>
        <span className="ml-auto text-[10px] text-indigo-500 bg-white/70 px-2 py-0.5 rounded-full font-medium">
          {isIgst ? "IGST (Inter-state)" : "CGST + SGST (Intra-state)"}
        </span>
      </div>

      {/* Breakdown rows */}
      <div className="p-3 space-y-1.5">
        {/* Taxable value */}
        <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-gray-100">
          <span className="text-xs text-gray-600 font-medium">Taxable Value (Base + P/L)</span>
          <span className="text-xs font-bold text-gray-800 font-mono">₹{bd.priceExcludingGst.toFixed(2)}</span>
        </div>

        {/* GST rows */}
        {isIgst ? (
          <div className="flex items-center justify-between py-1.5 px-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">IGST</span>
              <span className="text-xs text-orange-700">{bd.igstPercent}%</span>
            </div>
            <span className="text-xs font-bold text-orange-700 font-mono">+ ₹{bd.igstAmount.toFixed(2)}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-1.5 px-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">CGST</span>
                <span className="text-xs text-blue-700">{bd.cgstPercent}%</span>
              </div>
              <span className="text-xs font-bold text-blue-700 font-mono">+ ₹{bd.cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">SGST</span>
                <span className="text-xs text-blue-700">{bd.sgstPercent}%</span>
              </div>
              <span className="text-xs font-bold text-blue-700 font-mono">+ ₹{bd.sgstAmount.toFixed(2)}</span>
            </div>
          </>
        )}

        {/* CESS row — only shown when cess > 0 */}
        {cess > 0 && (
          <div className="flex items-center justify-between py-1.5 px-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">CESS</span>
              <span className="text-xs text-purple-700">{cess}%</span>
              <span className="text-[10px] text-purple-400">(Compensation Cess)</span>
            </div>
            <span className="text-xs font-bold text-purple-700 font-mono">+ ₹{bd.cessAmount.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-indigo-200 my-1" />

        {/* Total tax */}
        <div className="flex items-center justify-between py-1.5 px-3 bg-amber-50 rounded-lg border border-amber-100">
          <span className="text-xs font-semibold text-amber-700">Total Tax (GST{cess > 0 ? " + CESS" : ""})</span>
          <span className="text-xs font-bold text-amber-700 font-mono">₹{bd.totalTaxAmount.toFixed(2)}</span>
        </div>

        {/* Sale Price */}
        <div className="flex items-center justify-between py-2 px-3 bg-green-600 rounded-xl">
          <span className="text-xs font-bold text-white">Final Sale Price (incl. all taxes)</span>
          <span className="text-sm font-black text-white font-mono">₹{bd.salePrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HSN ADD MODAL
══════════════════════════════════════════════════════════════ */
const AddHsnModal = ({ onClose, onAdded, existingHsnCategories }) => {
  const [form,    setForm]    = useState({ code: "", description: "", gst: "0", cess: "0", hsnCategory: "", newHsnCategory: "" });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [useNew,  setUseNew]  = useState(true);

  const allHsnCategories = [...new Set([...(existingHsnCategories || [])])].filter(Boolean).sort();

  const handleChange = (e) => {
    setError("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const code        = form.code.trim().toUpperCase();
    const description = form.description.trim();
    const gst         = Number(form.gst);
    const cess        = Number(form.cess || 0);
    const category    = useNew ? form.newHsnCategory.trim() : form.hsnCategory.trim();
    if (!code)                    return setError("HSN code required hai.");
    if (!/^\d{4,8}$/.test(code))  return setError("HSN code 4–8 digits ka hona chahiye.");
    if (!description)             return setError("Description required hai.");
    if (!category)                return setError("HSN Category enter ya select karo.");
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/hsn/add`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code, description, gst, cess, category }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) { setError(data?.message || "Save failed."); return; }
      setSuccess(true);
      if (onAdded) onAdded({ _id: data.data._id, code: data.data.code, description: data.data.description, gst: data.data.gst, cess: data.data.cess ?? 0, category: data.data.category, isCustom: true });
      setTimeout(() => onClose(), 1200);
    } catch {
      setError("Network error — backend chal raha hai?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center"><Hash className="w-4 h-4 text-indigo-600" /></div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">Add HSN Code</h2>
              <p className="text-xs text-gray-500 mt-0.5">Naya HSN code database mein add karo</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* HSN Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">HSN Code <span className="text-red-500">*</span></label>
            <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. 0401" maxLength={8} autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-semibold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="e.g. Milk & Cream (not concentrated, no added sugar)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {/* GST Rate */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">GST Rate <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 5, 12, 18, 28].map((rate) => {
                const b      = GST_BADGE[rate];
                const active = Number(form.gst) === rate;
                return (
                  <button key={rate} type="button"
                    onClick={() => { setError(""); setForm((p) => ({ ...p, gst: String(rate) })); }}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${active ? `${b.bg} ${b.text} border-current scale-105 shadow-sm` : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200 hover:bg-gray-100"}`}>
                    {rate}%
                  </button>
                );
              })}
            </div>
          </div>
          {/* CESS Rate */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              CESS % <span className="text-gray-400 font-normal">(Compensation Cess — optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">%</span>
              <input type="number" name="cess" min="0" max="100" step="0.01"
                value={form.cess} onChange={handleChange} placeholder="0"
                className="w-full border border-purple-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/40" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              CESS is applicable on certain goods like tobacco, luxury cars, aerated drinks (typically 1%–15%)
            </p>
          </div>
          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">HSN Category <span className="text-red-500">*</span></label>
              {allHsnCategories.length > 0 && (
                <button type="button" onClick={() => { setUseNew((p) => !p); setError(""); }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${!useNew ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {!useNew ? "✏️ Type new" : "📋 Select existing"}
                </button>
              )}
            </div>
            {useNew || allHsnCategories.length === 0 ? (
              <input name="newHsnCategory" value={form.newHsnCategory} onChange={handleChange}
                placeholder="e.g. Dairy & Eggs, Vegetables, Spices & Condiments"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            ) : (
              <div className="relative">
                <select name="hsnCategory" value={form.hsnCategory} onChange={handleChange}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10">
                  <option value="">— Existing HSN category select karo —</option>
                  {allHsnCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />HSN code save ho gaya! ✅
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || success}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm disabled:opacity-60">
              {saving  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>  :
               success ? <><CheckCircle className="w-4 h-4" />Saved!</>              :
                         <><Plus className="w-4 h-4" />HSN Add Karo</>}
            </button>
            <button type="button" onClick={onClose} disabled={saving}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HSN MANAGE MODAL
══════════════════════════════════════════════════════════════ */
const HsnManageModal = ({ onClose, hsnList, onDelete, onAddNew }) => {
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [deletingId, setDeleting]   = useState(null);

  const allCategories = useMemo(
    () => [...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort(),
    [hsnList]
  );

  const filtered = useMemo(() => hsnList.filter((h) => {
    const q      = search.toLowerCase();
    const matchQ = !q || h.code.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || (h.category || "").toLowerCase().includes(q);
    return matchQ && (!catFilter || h.category === catFilter);
  }), [hsnList, search, catFilter]);

  const handleDelete = async (hsn) => {
    if (!window.confirm(`HSN code "${hsn.code}" delete karna chahte ho?`)) return;
    setDeleting(hsn._id);
    try {
      const res  = await fetch(`${API_URL}/hsn/${hsn._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { onDelete(hsn._id); }
      else { alert(data.message || "Delete failed"); }
    } catch { alert("Network error"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center"><Settings className="w-4 h-4 text-indigo-600" /></div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">HSN Code Management</h2>
              <p className="text-xs text-gray-500 mt-0.5">{hsnList.length} HSN codes database mein hain</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { onClose(); onAddNew(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" />Add New
            </button>
            <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 text-gray-400 hover:text-gray-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Code, description ya category search karo…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {allCategories.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
              <button onClick={() => setCatFilter("")}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!catFilter ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>All</button>
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => setCatFilter(catFilter === cat ? "" : cat)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === cat ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-2"><Hash className="w-7 h-7 text-gray-300" /></div>
              <p className="font-medium text-gray-500">{hsnList.length === 0 ? "Koi HSN code nahi hai" : "Koi result nahi mila"}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((hsn) => {
                const b = GST_BADGE[hsn.gst] ?? GST_BADGE[0];
                return (
                  <div key={hsn._id || hsn.code} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <span className="flex-shrink-0 mt-0.5 font-mono text-[11px] font-bold px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 min-w-[60px] text-center">
                      {hsn.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{hsn.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{hsn.category}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.bg} ${b.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />GST {hsn.gst}%
                        </span>
                        {(hsn.cess ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />CESS {hsn.cess}%
                          </span>
                        )}
                        {hsn.isCustom && (
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">Custom</span>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={() => handleDelete(hsn)} disabled={deletingId === hsn._id}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100 disabled:opacity-50 mt-0.5">
                      {deletingId === hsn._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""} dikh rahe hain</span>
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HSN PICKER
══════════════════════════════════════════════════════════════ */
const HsnPicker = ({ value, onSelect, hsnList = [], onHsnAdded, onOpenManage }) => {
  const [open,         setOpen]       = useState(false);
  const [query,        setQuery]      = useState("");
  const [catFilter,    setCatFilter]  = useState("");
  const [highlighted,  setHigh]       = useState(0);
  const [showAddModal, setShowAdd]    = useState(false);
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);
  const listRef  = useRef(null);

  const allHsnCategories = useMemo(
    () => [...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort(),
    [hsnList]
  );
  const selected = useMemo(() => hsnList.find((h) => h.code === value) ?? null, [hsnList, value]);
  const filtered = useMemo(() => hsnList.filter((h) => {
    const q      = query.toLowerCase();
    const matchQ = !q || h.code.includes(q) || h.description.toLowerCase().includes(q) || (h.category || "").toLowerCase().includes(q);
    return matchQ && (!catFilter || h.category === catFilter);
  }), [hsnList, query, catFilter]);

  useEffect(() => {
    const handler = (e) => {
      if (showAddModal) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAddModal]);

  useEffect(() => setHigh(0), [query, catFilter]);
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-idx="${highlighted}"]`)?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  const pick  = (hsn) => { onSelect(hsn); setOpen(false); setQuery(""); setCatFilter(""); };
  const clear = (e)   => { e.stopPropagation(); onSelect(null); setQuery(""); };

  const handleKeyDown = (e) => {
    if (!open) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHigh((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHigh((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); if (filtered[highlighted]) pick(filtered[highlighted]); }
    if (e.key === "Escape")    { setOpen(false); }
  };

  const handleHsnAdded = useCallback((newHsn) => {
    if (onHsnAdded) onHsnAdded(newHsn);
    setShowAdd(false);
    setOpen(false);
    setTimeout(() => {
      onSelect({ code: newHsn.code, description: newHsn.description, gst: newHsn.gst, cess: newHsn.cess ?? 0, category: newHsn.category, isCustom: true, _id: newHsn._id });
    }, 50);
  }, [onSelect, onHsnAdded]);

  const badge = selected ? (GST_BADGE[selected.gst] ?? GST_BADGE[0]) : null;

  return (
    <>
      <div ref={wrapRef} className="relative w-full">
        <div className="flex gap-2">
          <button type="button" onKeyDown={handleKeyDown}
            onClick={() => { setOpen((p) => !p); setTimeout(() => inputRef.current?.focus(), 60); }}
            className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm bg-white text-left transition-all hover:border-gray-300
              ${open ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"}`}>
            <Tag className={`w-4 h-4 flex-shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`} />
            {selected ? (
              <>
                <span className="font-mono font-bold text-gray-900 flex-shrink-0 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{selected.code}</span>
                <span className="text-gray-700 truncate flex-1 text-xs">{selected.description}</span>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />GST {selected.gst}%
                </span>
                {(selected.cess ?? 0) > 0 && (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />CESS {selected.cess}%
                  </span>
                )}
                <span onClick={clear} className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400 flex-1 text-sm">{hsnList.length === 0 ? "Koi HSN nahi — + se add karo" : "HSN code search karo ya select karo…"}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          <button type="button" onClick={() => { setOpen(false); if (onOpenManage) onOpenManage(); }}
            title="HSN codes manage karo"
            className="flex-shrink-0 w-10 h-[42px] flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {open && (
          <div className="absolute z-[99998] mt-1.5 left-0 right-0 min-w-[340px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2.5 bg-gray-50 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Code ya naam type karo…"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {allHsnCategories.length > 0 && (
              <div className="flex gap-1.5 px-2.5 py-2 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                <button onClick={() => setCatFilter("")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!catFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
                {allHsnCategories.map((cat) => (
                  <button key={cat} onClick={() => setCatFilter(catFilter === cat ? "" : cat)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <div ref={listRef} className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <Tag className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">{hsnList.length === 0 ? "Database mein koi HSN nahi hai" : "Koi result nahi mila"}</p>
                </div>
              ) : (
                <div className="p-1.5 space-y-0.5">
                  {filtered.map((hsn, idx) => {
                    const isSelected = value === hsn.code;
                    const isHigh     = highlighted === idx;
                    const b          = GST_BADGE[hsn.gst] ?? GST_BADGE[0];
                    return (
                      <button key={hsn.code} data-idx={idx} type="button"
                        onClick={() => pick(hsn)} onMouseEnter={() => setHigh(idx)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : isHigh ? "bg-gray-50" : "hover:bg-gray-50"}`}>
                        <span className={`flex-shrink-0 mt-0.5 font-mono text-[11px] font-bold px-2 py-1 rounded-md ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>{hsn.code}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs leading-snug text-gray-800">{hsn.description}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{hsn.category}</div>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.bg} ${b.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />{hsn.gst}%
                          </span>
                          {(hsn.cess ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />CESS {hsn.cess}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
              <span className="text-[10px] text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""} · ↑↓ navigate · Esc close</span>
            </div>
          </div>
        )}
      </div>
      {showAddModal && (
        <AddHsnModal onClose={() => setShowAdd(false)} onAdded={handleHsnAdded}
          existingHsnCategories={allHsnCategories} />
      )}
    </>
  );
};

/* ──────────────────────────────────────────────────────────────
   SHARED FORM HELPERS
────────────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  name: "", brand: "", category: "", subcategory: "", subSubcategory: "",
  description: "", basePrice: "", profitLoss: "", gstPercent: "",
  cessPercent: "0",
  hsnCode: "", taxType: "cgst_sgst", weightValue: "1", weightUnit: "kg",
  validTill: "", status: "inactive",
  primaryImageFile:   null,
  existingPrimaryUrl: "",
  keepPrimaryImage:   true,
  galleryNewFiles:    [],
  existingGallery:    [],
};

const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
    {children}{required && <span className="text-red-500 normal-case"> *</span>}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150
      hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
    {...props}
  />
);

const SelectInput = ({ children, className = "", ...props }) => (
  <div className="relative">
    <select
      className={`w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150
        hover:border-gray-300 disabled:bg-gray-50 pr-9 ${className}`}
      {...props}
    >{children}</select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

const SectionTitle = ({ children, icon: Icon, color = "blue" }) => {
  const colorMap = {
    blue:   "text-blue-600 bg-blue-100",
    green:  "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    amber:  "text-amber-600 bg-amber-100",
  };
  return (
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <span className={`text-xs font-bold uppercase tracking-widest text-${color}-600`}>{children}</span>
      <div className={`flex-1 h-px bg-${color}-100`} />
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   FORM FIELDS
────────────────────────────────────────────────────────────── */
const FormFields = ({
  form, handleChange, handleHsnSelect,
  savedProductId,
  handlePrimaryImageChange, handleGalleryChange,
  categories, subcategories, subSubcategories,
  onOpenCategoryModal, uploaderKey,
  editId, productRanges, onRangesChange,
  hsnList, onHsnAdded, onOpenHsnManage,
}) => (
  <div className="space-y-6">

    {/* ── Basic Info ── */}
    <div>
      <SectionTitle icon={Tag} color="blue">Basic Information</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>Product Name</Label>
          <Input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amul Gold Milk" />
        </div>
        <div>
          <Label>Brand</Label>
          <Input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Amul, Tata" />
        </div>
        <div>
          <Label>Status</Label>
          <SelectInput name="status" value={form.status} onChange={handleChange}>
            <option value="active">✅ Active</option>
            <option value="inactive">❌ Inactive</option>
          </SelectInput>
        </div>
      </div>
    </div>

    {/* ── Category ── */}
    <div>
      <SectionTitle icon={Layers} color="purple">Category</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>Category</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SelectInput required name="category" value={form.category} onChange={handleChange}>
                <option value="">— Select Category —</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </SelectInput>
            </div>
            <button type="button" onClick={onOpenCategoryModal}
              className="flex-shrink-0 w-10 h-[42px] flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <Label>Subcategory</Label>
          <SelectInput name="subcategory" value={form.subcategory} onChange={handleChange} disabled={!subcategories.length}>
            <option value="">{!form.category ? "Select category first" : subcategories.length ? "— Select Subcategory —" : "No subcategories"}</option>
            {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </SelectInput>
        </div>
        <div>
          <Label>Sub-Subcategory</Label>
          <SelectInput name="subSubcategory" value={form.subSubcategory} onChange={handleChange} disabled={!subSubcategories.length}>
            <option value="">{!form.subcategory ? "Select subcategory first" : subSubcategories.length ? "— Select Sub-Subcategory —" : "None"}</option>
            {subSubcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </SelectInput>
        </div>
      </div>
    </div>

    {/* ── Pricing & Tax ── */}
    <div>
      <SectionTitle icon={DollarSign} color="amber">Pricing &amp; Tax</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label required>Base Price (₹)</Label>
          <Input type="number" required name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
        </div>
        <div>
          <Label>Profit / Loss (₹)</Label>
          <Input type="number" name="profitLoss" value={form.profitLoss} onChange={handleChange} placeholder="0" />
        </div>
        <div>
          <Label>GST %</Label>
          <SelectInput name="gstPercent" value={form.gstPercent} onChange={handleChange}>
            <option value="">— Select GST —</option>
            <option value="0">0% (Exempt)</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </SelectInput>
        </div>

        {/* ── CESS % ── */}
        <div>
          <Label>CESS %</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs font-bold">%</span>
            <Input
              type="number"
              name="cessPercent"
              value={form.cessPercent}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
              className="pl-7 border-purple-200 focus:ring-purple-400 bg-purple-50/30"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Compensation Cess (tobacco, aerated drinks, luxury cars etc.)</p>
        </div>

        <div className="sm:col-span-2">
          <Label>HSN Code</Label>
          <HsnPicker value={form.hsnCode} onSelect={handleHsnSelect} hsnList={hsnList} onHsnAdded={onHsnAdded} onOpenManage={onOpenHsnManage} />
          {form.hsnCode && (() => {
            const hsn    = hsnList.find((h) => h.code === form.hsnCode);
            const gstKey = hsn ? hsn.gst : (form.gstPercent ? Number(form.gstPercent) : 0);
            const b      = GST_BADGE[gstKey] ?? GST_BADGE[0];
            return (
              <div className="mt-2 flex items-start gap-2.5 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <Tag className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{form.hsnCode}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${b.bg} ${b.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />GST {gstKey}%
                    </span>
                    {hsn && (hsn.cess ?? 0) > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-purple-100 text-purple-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />CESS {hsn.cess}%
                      </span>
                    )}
                  </div>
                  {hsn && <p className="text-xs text-blue-800 mt-1">{hsn.description}</p>}
                  {hsn && <p className="text-[10px] text-blue-500 mt-0.5">{hsn.category}</p>}
                </div>
              </div>
            );
          })()}
        </div>

        <div>
          <Label>Tax Type</Label>
          <SelectInput name="taxType" value={form.taxType} onChange={handleChange}>
            <option value="cgst_sgst">CGST + SGST (Intra-state)</option>
            <option value="igst">IGST (Inter-state)</option>
          </SelectInput>
        </div>
        <div>
          <Label>Valid Till</Label>
          <Input type="date" name="validTill" value={form.validTill} onChange={handleChange} />
        </div>
      </div>

      {/* ── Live GST + CESS breakdown panel ── */}
      <GstBreakdownPanel
        basePrice={form.basePrice}
        profitLoss={form.profitLoss}
        gstPercent={form.gstPercent}
        cessPercent={form.cessPercent}
        taxType={form.taxType}
      />
    </div>

    {/* ── Price Ranges ── */}
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
          <Layers className="w-3.5 h-3.5 text-green-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-green-600">Price Ranges</span>
        <div className="flex-1 h-px bg-green-100" />
        <span className="text-[10px] text-green-500 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium">Bulk / Quantity Pricing</span>
      </div>
      <p className="text-xs text-gray-400 mb-4 ml-9">
        Alag alag quantities ke liye alag unit price set karo. Unit Price = Base Price + Profit/Loss.
      </p>
      <div className="bg-gradient-to-br from-green-50/60 to-emerald-50/30 rounded-2xl border border-green-200/60 p-4">
        <PriceRangesSection
          productId={savedProductId || editId || null}
          basePrice={form.basePrice}
          existingRanges={productRanges || []}
          onRangesChange={onRangesChange}
        />
      </div>
    </div>

    {/* ── Weight ── */}
    <div>
      <SectionTitle color="blue">Weight</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Weight</Label>
          <div className="flex gap-2">
            <Input type="number" name="weightValue" value={form.weightValue} onChange={handleChange}
              placeholder="e.g. 500" className="flex-1" min="0" />
            <div className="w-28">
              <SelectInput name="weightUnit" value={form.weightUnit} onChange={handleChange}>
                <option value="kg">Kg</option>
                <option value="gm">Gram</option>
                <option value="ltr">Litre</option>
                <option value="ml">ML</option>
                <option value="pcs">Pcs</option>
              </SelectInput>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Images ── */}
    <div>
      <SectionTitle color="blue">Product Images</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-blue-700">Primary Image</h4>
            <span className="text-[10px] text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">Shown in listings</span>
          </div>
          <PrimaryImageUploader key={`primary-${uploaderKey}`} existingUrl={form.existingPrimaryUrl} file={form.primaryImageFile} onChange={handlePrimaryImageChange} />
        </div>
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Images className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700">Gallery Images</h4>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Up to {MAX_GALLERY} extra photos</span>
          </div>
          <GalleryImageUploader key={`gallery-${uploaderKey}`} initialExistingUrls={form.existingGallery} initialNewFiles={form.galleryNewFiles} onChange={handleGalleryChange} />
        </div>
      </div>
    </div>

    {/* ── Description ── */}
    <div>
      <Label>Description</Label>
      <textarea name="description" value={form.description} onChange={handleChange} rows={3}
        placeholder="Product description (optional)..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 resize-none" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function PriceList() {
  const [items,              setItems]              = useState([]);
  const [categories,         setCategories]         = useState([]);
  const [subcategories,      setSubcategories]      = useState([]);
  const [subSubcategories,   setSubSubcategories]   = useState([]);
  const [hsnList,            setHsnList]            = useState([]);
  const [search,             setSearch]             = useState("");
  const [loading,            setLoading]            = useState(false);
  const [isSubmitting,       setIsSubmitting]       = useState(false);
  const [form,               setForm]               = useState(EMPTY_FORM);
  const [activeMenu,         setActiveMenu]         = useState(null);
  const [selectedItems,      setSelectedItems]      = useState([]);
  const [bulkMode,           setBulkMode]           = useState(false);
  const [currentPage,        setCurrentPage]        = useState(1);
  const itemsPerPage = 15;
  const [filterCategory,    setFilterCategory]    = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterSubs,        setFilterSubs]        = useState([]);
  const [quickBasePrices,   setQuickBasePrices]   = useState({});
  const [quickProfitLoss,   setQuickProfitLoss]   = useState({});
  const [sortOrder,         setSortOrder]         = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName,   setNewCategoryName]   = useState("");
  const [categoryLoading,   setCategoryLoading]   = useState(false);
  const [alertBox,          setAlertBox]          = useState({ show: false, message: "", type: "success" });
  const [showFilters,       setShowFilters]       = useState(false);
  const [columnVisibility,  setColumnVisibility]  = useState({ category: true });
  const [uploaderKey,       setUploaderKey]       = useState("init");
  const [productRanges,     setProductRanges]     = useState([]);
  const [savedProductId,    setSavedProductId]    = useState(null);
  const [mode,              setMode]              = useState(null);
  const [editId,            setEditId]            = useState(null);
  const [showHsnAddModal,    setShowHsnAddModal]    = useState(false);
  const [showHsnManageModal, setShowHsnManageModal] = useState(false);

  const showForm  = mode === "add" || mode === "copy";
  const showModal = mode === "edit";

  const subsRef    = useRef([]);
  const subSubsRef = useRef([]);
  const formRef    = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  useEffect(() => {
    if (!alertBox.show) return;
    const t = setTimeout(() => setAlertBox((p) => ({ ...p, show: false })), 3500);
    return () => clearTimeout(t);
  }, [alertBox.show]);

  useEffect(() => { fetchHsnList(); }, []);
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (categories.length > 0) fetchItems(); }, [categories]);

  const fetchHsnList = async () => {
    try {
      const res = await axios.get(`${API_URL}/hsn/custom?_t=${Date.now()}`);
      if (res.data?.success) setHsnList(res.data.data || []);
      else if (Array.isArray(res.data)) setHsnList(res.data);
      else setHsnList([]);
    } catch { setHsnList([]); }
  };

  const handleHsnAddedInParent = useCallback((newHsn) => {
    setHsnList((prev) => {
      if (prev.find((h) => h.code === newHsn.code)) return prev;
      return [...prev, { _id: newHsn._id, code: newHsn.code, description: newHsn.description, gst: newHsn.gst, cess: newHsn.cess ?? 0, category: newHsn.category, isCustom: true }];
    });
    setTimeout(() => fetchHsnList(), 500);
  }, []);

  const handleHsnDeletedInParent = useCallback((deletedId) => {
    setHsnList((prev) => prev.filter((h) => h._id !== deletedId));
    setForm((f) => {
      const deleted = hsnList.find((h) => h._id === deletedId);
      if (deleted && f.hsnCode === deleted.code) return { ...f, hsnCode: "", gstPercent: "", cessPercent: "0" };
      return f;
    });
  }, [hsnList]);

  useEffect(() => {
    if (!filterCategory) { setFilterSubs([]); setFilterSubcategory(""); return; }
    const cat = categories.find((c) => c._id === filterCategory);
    setFilterSubs(cat?.subcategories || []);
    setFilterSubcategory("");
  }, [filterCategory, categories]);

  useEffect(() => {
    if (!form.category) {
      setSubcategories([]); setSubSubcategories([]);
      subsRef.current = []; subSubsRef.current = [];
      if (mode === "add") setForm((p) => ({ ...p, subcategory: "", subSubcategory: "" }));
      return;
    }
    const cat  = categories.find((c) => c._id === form.category);
    const subs = cat?.subcategories || [];
    setSubcategories(subs);
    subsRef.current = subs;
    if (mode === "add") {
      setSubSubcategories([]); subSubsRef.current = [];
      setForm((p) => ({ ...p, subcategory: "", subSubcategory: "" }));
    }
  }, [form.category, categories]);

  useEffect(() => {
    if (!form.subcategory) {
      setSubSubcategories([]); subSubsRef.current = [];
      if (mode === "add") setForm((p) => ({ ...p, subSubcategory: "" }));
      return;
    }
    const cat     = categories.find((c) => c._id === form.category);
    const sub     = cat?.subcategories?.find((s) => s._id === form.subcategory);
    const subSubs = sub?.subSubcategories || [];
    setSubSubcategories(subSubs);
    subSubsRef.current = subSubs;
    if (mode === "add") setForm((p) => ({ ...p, subSubcategory: "" }));
  }, [form.subcategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      if (res.data?.success) setCategories(res.data.categories || []);
    } catch { showAlert("Could not fetch categories", "error"); }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data?.success) {
        const flat = [];
        (res.data.data || []).forEach((cat) => {
          (cat.subcategories || []).forEach((sub) => {
            (sub.subSubcategories || []).forEach((subSub) => {
              (subSub.products || []).forEach((p) => {
                flat.push({
                  ...p,
                  category:       { _id: cat.id,  name: cat.name,  image: cat.image  },
                  subcategory:    { _id: sub.id,   name: sub.name,  image: sub.image  },
                  subSubcategory: subSub.id ? { id: subSub.id, name: subSub.name, image: subSub.image } : null,
                });
              });
            });
          });
        });
        flat.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(flat);
      }
    } catch { showAlert("Could not fetch items", "error"); }
    finally { setLoading(false); }
  };

  const fetchProductRanges = async (productId) => {
    if (!productId) { setProductRanges([]); return; }
    try {
      const res = await axios.get(`${DISCOUNT_URL}/product/${productId}`);
      setProductRanges(res.data?.data || []);
    } catch { setProductRanges([]); }
  };

  const showAlert = (message, type = "success") => setAlertBox({ show: true, message, type });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handlePrimaryImageChange = useCallback((file, flag) => {
    if (flag === "new" && file) {
      setForm((p) => ({ ...p, primaryImageFile: file, keepPrimaryImage: true }));
    } else if (flag === "remove") {
      setForm((p) => ({ ...p, primaryImageFile: null, existingPrimaryUrl: "", keepPrimaryImage: false }));
    }
  }, []);

  const handleGalleryChange = useCallback((newFiles, existingUrls) => {
    setForm((p) => ({ ...p, galleryNewFiles: newFiles, existingGallery: existingUrls }));
  }, []);

  // When HSN is picked, auto-fill GST and CESS from the HSN entry
  const handleHsnSelect = useCallback((hsn) => {
    setForm((prev) => ({
      ...prev,
      hsnCode:     hsn?.code || "",
      gstPercent:  hsn != null ? String(hsn.gst)       : "",
      cessPercent: hsn != null ? String(hsn.cess ?? 0) : "0",
    }));
  }, []);

  const buildFD = (f) => {
    const fd = new FormData();
    fd.append("name",        f.name.trim());
    fd.append("brand",       f.brand.trim());
    fd.append("category",    f.category);
    fd.append("status",      f.status);
    fd.append("description", f.description || "");
    fd.append("taxType",     f.taxType);
    fd.append("gstPercent",  f.gstPercent  || 0);
    fd.append("cessPercent", f.cessPercent || 0);
    fd.append("hsnCode",     f.hsnCode || "");
    fd.append("basePrice",   f.basePrice);
    fd.append("profitLoss",  f.profitLoss || 0);
    fd.append("weight",      JSON.stringify({ value: Math.max(1, Number(f.weightValue) || 1), unit: f.weightUnit || "kg" }));
    if (f.validTill) fd.append("validTill", f.validTill);

    if (f.subcategory) {
      const sub = subsRef.current.find((s) => s._id === f.subcategory || s.id === f.subcategory);
      if (sub) fd.append("subcategory", JSON.stringify({ id: sub._id || sub.id, name: sub.name, image: sub.image || "" }));
    }
    if (f.subSubcategory) {
      const ss = subSubsRef.current.find((s) => s._id === f.subSubcategory || s.id === f.subSubcategory);
      if (ss) fd.append("subSubcategory", JSON.stringify({ id: ss._id || ss.id, name: ss.name, image: ss.image || "" }));
    }

    if (f.primaryImageFile) {
      fd.append("primaryImage", f.primaryImageFile);
    } else if (f.existingPrimaryUrl) {
      fd.append("existingPrimaryUrl", f.existingPrimaryUrl);
    } else {
      fd.append("keepPrimaryImage", "false");
    }

    (f.galleryNewFiles || []).forEach((file) => fd.append("galleryImages", file));
    fd.append("existingGallery", JSON.stringify(f.existingGallery || []));
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = formRef.current;
    if (!f.name.trim() || !f.category || !f.basePrice) {
      showAlert("Name, category & base price required", "warning"); return;
    }
    const excludeId  = mode === "edit" ? editId : null;
    const nameExists = items.some((p) => p.name.trim().toLowerCase() === f.name.trim().toLowerCase() && p._id !== excludeId);
    if (nameExists) { showAlert("Yeh product naam pehle se exist karta hai! Naam badlo.", "error"); return; }

    setIsSubmitting(true);
    try {
      const fd = buildFD(f);
      if (mode === "edit" && editId) {
        const res = await axios.put(`${API_URL}/${editId}`, fd);
        if (res.data?.success !== false) {
          await fetchItems();
          showAlert("Product successfully update ho gaya! ✅", "success");
          resetForm();
        } else { showAlert(res.data?.message || "Update failed", "error"); }
      } else {
        const res         = await axios.post(API_URL, fd);
        const newProductId = res.data?.data?._id || res.data?._id;
        if (newProductId) {
          const msg = mode === "copy" ? "Product copy ho kar save ho gaya! 🎉" : "Product successfully add ho gaya! 🎉";
          showAlert(msg, "success");
          setSavedProductId(newProductId);
          await fetchItems();
          await fetchProductRanges(newProductId);
          resetForm();
        } else { showAlert(res.data?.message || "Save failed!", "error"); }
      }
    } catch (err) {
      showAlert(err.response?.data?.message || err.message || "Save failed!", "error");
    } finally { setIsSubmitting(false); }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setMode(null);
    setEditId(null);
    setSavedProductId(null);
    setUploaderKey(`reset-${Date.now()}`);
    setSubcategories([]);
    setSubSubcategories([]);
    subsRef.current    = [];
    subSubsRef.current = [];
    setProductRanges([]);
  };

  const populateSubRefs = (item) => {
    const cat     = categories.find((c) => c._id === (item.category?._id || item.category));
    const subs    = cat?.subcategories || [];
    const subId   = item.subcategory?._id || item.subcategory?.id || "";
    const sub     = subs.find((s) => s._id === subId || s.id === subId);
    const subSubs = sub?.subSubcategories || [];
    subsRef.current    = subs;
    subSubsRef.current = subSubs;
    setSubcategories(subs);
    setSubSubcategories(subSubs);
  };

  const buildFormFromItem = (item, overrides = {}) => {
    const subId = item.subcategory?._id || item.subcategory?.id || "";
    const ssId  = item.subSubcategory?.id || item.subSubcategory?._id || "";
    return {
      name:               item.name              || "",
      brand:              item.brand             || "",
      category:           item.category?._id?.toString() || item.category?.toString() || "",
      subcategory:        subId,
      subSubcategory:     ssId,
      description:        item.description       || "",
      basePrice:          item.basePrice          ?? "",
      profitLoss:         item.profitLoss         ?? 0,
      weightValue:        item.weight?.value      ?? 1,
      weightUnit:         item.weight?.unit       || "kg",
      gstPercent:         item.gstPercent  !== undefined ? String(item.gstPercent)        : "",
      cessPercent:        item.cessPercent !== undefined ? String(item.cessPercent)       : "0",
      hsnCode:            item.hsnCode            || "",
      taxType:            item.taxType            || "cgst_sgst",
      validTill:          item.validTill ? item.validTill.split("T")[0] : "",
      status:             item.status             || "inactive",
      primaryImageFile:   null,
      existingPrimaryUrl: item.image              || "",
      keepPrimaryImage:   true,
      galleryNewFiles:    [],
      existingGallery:    Array.isArray(item.galleryImages) ? item.galleryImages : [],
      ...overrides,
    };
  };

  const openCopyInForm = (item) => {
    populateSubRefs(item);
    const copyForm = buildFormFromItem(item, { name: item.name + " (Copy)", status: "inactive" });
    setEditId(null); setSavedProductId(null); setProductRanges([]);
    setUploaderKey(`copy-${item._id}-${Date.now()}`);
    setActiveMenu(null); setForm(copyForm); setMode("copy");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showAlert("Product copy hua — naam edit karo aur 'Save as New Product' dabao ✏️", "success");
  };

  const handleEdit = async (item) => {
    populateSubRefs(item);
    const editForm = buildFormFromItem(item);
    setEditId(item._id); setSavedProductId(item._id); setProductRanges([]);
    setUploaderKey(`edit-${item._id}`);
    setActiveMenu(null); setForm(editForm); setMode("edit");
    await fetchProductRanges(item._id);
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM); setMode("add"); setEditId(null); setSavedProductId(null);
    setUploaderKey(`new-${Date.now()}`);
    setSubcategories([]); setSubSubcategories([]);
    subsRef.current = []; subSubsRef.current = [];
    setProductRanges([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      setSelectedItems((prev) => prev.filter((x) => x !== id));
      setActiveMenu(null);
      showAlert("Item deleted successfully", "success");
    } catch { showAlert("Delete failed", "error"); }
  };

  const handleStatusToggle = async (item) => {
    try {
      const newStatus = item.status === "active" ? "inactive" : "active";
      await axios.put(`${API_URL}/status/${item._id}`, { status: newStatus });
      setItems((prev) => prev.map((x) => x._id === item._id ? { ...x, status: newStatus } : x));
      showAlert(`Status updated to ${newStatus}`, "success");
    } catch { showAlert("Status update failed", "error"); }
  };

  const updateLocalItemField = (id, key, value) =>
    setItems((prev) => prev.map((x) => x._id === id ? { ...x, [key]: value } : x));

  const handleBulkSave = async () => {
    if (!selectedItems.length) { showAlert("No items selected", "warning"); return; }
    const updates = items.filter((x) => selectedItems.includes(x._id)).map((x) => ({
      id:          x._id,
      basePrice:   Number(x.basePrice),
      profitLoss:  Number(x.profitLoss),
      gstPercent:  Number(x.gstPercent  || 0),
      cessPercent: Number(x.cessPercent || 0),
      hsnCode:     x.hsnCode  || "",
      taxType:     x.taxType  || "cgst_sgst",
      brand:       x.brand    || "",
      status:      x.status,
    }));
    try {
      await axios.post(`${API_URL}/bulk-update`, { products: updates });
      showAlert("Bulk save successful", "success");
      setBulkMode(false); setSelectedItems([]); fetchItems();
    } catch { showAlert("Bulk save failed", "error"); }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) { showAlert("No items selected", "warning"); return; }
    if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return;
    try {
      await Promise.all(selectedItems.map((id) => axios.delete(`${API_URL}/${id}`)));
      setSelectedItems([]); fetchItems(); setBulkMode(false);
      showAlert("Selected items deleted", "success");
    } catch { showAlert("Bulk delete failed", "error"); }
  };

  const updateBasePrice = async (item) => {
    const newBase = Number(quickBasePrices[item._id] ?? item.basePrice);
    if (isNaN(newBase)) { showAlert("Invalid Base Price", "error"); return; }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name",        item.name);
      fd.append("brand",       item.brand || "");
      fd.append("category",    item.category?._id);
      if (item.subcategory) fd.append("subcategory", JSON.stringify({ id: item.subcategory._id || item.subcategory.id, name: item.subcategory.name, image: item.subcategory.image || "" }));
      if (item.subSubcategory?.id) fd.append("subSubcategory", JSON.stringify(item.subSubcategory));
      fd.append("basePrice",   newBase);
      fd.append("profitLoss",  item.profitLoss);
      fd.append("status",      item.status);
      fd.append("gstPercent",  item.gstPercent  || 0);
      fd.append("cessPercent", item.cessPercent || 0);
      fd.append("hsnCode",     item.hsnCode  || "");
      fd.append("taxType",     item.taxType  || "cgst_sgst");
      fd.append("weight",      JSON.stringify(item.weight));
      fd.append("keepPrimaryImage", "true");
      fd.append("existingGallery",  JSON.stringify(item.galleryImages || []));
      const res = await axios.put(`${API_URL}/${item._id}`, fd);
      if (res.data.success) {
        await fetchItems();
        setQuickBasePrices((p) => { const n = { ...p }; delete n[item._id]; return n; });
        showAlert("Base price updated", "success");
      }
    } catch { showAlert("Update failed", "error"); }
    finally { setLoading(false); }
  };

  const updateProfitLoss = async (item) => {
    const diff = Number(quickProfitLoss[item._id] ?? 0);
    if (isNaN(diff)) { showAlert("Invalid Profit/Loss", "error"); return; }
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/updateDiff/${item._id}`, { diff });
      if (res.data.success) {
        await fetchItems();
        setQuickProfitLoss((p) => { const n = { ...p }; delete n[item._id]; return n; });
        showAlert("Profit/Loss updated", "success");
      }
    } catch { showAlert("Update failed", "error"); }
    finally { setLoading(false); }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) { showAlert("Category name is required", "warning"); return; }
    try {
      setCategoryLoading(true);
      const res = await axios.post(CATEGORY_URL, { name: newCategoryName.trim() });
      if (res.data?.success) {
        showAlert("Category added successfully", "success");
        setNewCategoryName(""); setShowCategoryModal(false);
        await fetchCategories();
      }
    } catch { showAlert("Error while adding category", "error"); }
    finally { setCategoryLoading(false); }
  };

  const filteredItems = items.filter((item) => {
    const t = search.toLowerCase();
    const matchText =
      (item.name || "").toLowerCase().includes(t)              ||
      (item.brand || "").toLowerCase().includes(t)             ||
      (item.category?.name || "").toLowerCase().includes(t)    ||
      (item.subcategory?.name || "").toLowerCase().includes(t) ||
      (item.hsnCode || "").toLowerCase().includes(t);
    const matchCategory = !filterCategory    || item.category?._id   === filterCategory;
    const matchSub      = !filterSubcategory || item.subcategory?._id === filterSubcategory;
    return matchText && matchCategory && matchSub;
  });

  let sortedItems = [...filteredItems];
  if (sortOrder === "low")  sortedItems.sort((a, b) => (Number(a.salePrice) || 0) - (Number(b.salePrice) || 0));
  if (sortOrder === "high") sortedItems.sort((a, b) => (Number(b.salePrice) || 0) - (Number(a.salePrice) || 0));

  const totalPages   = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const currentItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const delta = 2, range = [], rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    range.forEach((i) => {
      if (l) { if (i - l === 2) rangeWithDots.push(l + 1); else if (i - l !== 1) rangeWithDots.push("..."); }
      rangeWithDots.push(i); l = i;
    });
    return rangeWithDots;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) setSelectedItems([]);
    else setSelectedItems(currentItems.map((i) => i._id));
  };

  const formFieldsProps = {
    form, handleChange, handleHsnSelect,
    savedProductId,
    handlePrimaryImageChange, handleGalleryChange,
    categories, subcategories, subSubcategories,
    onOpenCategoryModal: () => setShowCategoryModal(true),
    uploaderKey,
    editId: savedProductId || editId || null,
    productRanges,
    onRangesChange: setProductRanges,
    hsnList,
    onHsnAdded:      handleHsnAddedInParent,
    onOpenHsnManage: () => setShowHsnManageModal(true),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-5">

      {/* Alert */}
      {alertBox.show && (
        <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-right">
          <div className={`rounded-xl shadow-xl border p-4 flex items-center gap-3 min-w-72 max-w-sm ${
            alertBox.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
            alertBox.type === "error"   ? "bg-red-50 border-red-200 text-red-800"       :
                                          "bg-amber-50 border-amber-200 text-amber-800"}`}>
            {alertBox.type === "success" ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> :
             alertBox.type === "error"   ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0"   /> :
                                           <Info        className="w-5 h-5 text-amber-500 flex-shrink-0" />}
            <p className="font-medium text-sm flex-1">{alertBox.message}</p>
            <button onClick={() => setAlertBox((p) => ({ ...p, show: false }))} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} products total</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => { if (showForm) { resetForm(); return; } openAddForm(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Close Form" : "Add Product"}
            </button>
            <button onClick={() => setShowHsnManageModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
              <Hash className="w-4 h-4" />HSN Codes
              {hsnList.length > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{hsnList.length}</span>
              )}
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              <Filter className="w-4 h-4" />Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search + Import/Export */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, brand, category, HSN code..." value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.open(`${API_URL}/export`, "_blank")}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
              <Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span>
            </button>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                try {
                  const fd = new FormData(); fd.append("file", e.target.files[0]);
                  await axios.post(`${API_URL}/import`, fd);
                  showAlert("Imported successfully", "success"); fetchItems();
                } catch { showAlert("Import failed", "error"); }
              }} />
              <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                <Upload className="w-4 h-4" /><span className="hidden sm:inline">Import</span>
              </div>
            </label>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Filter by Category</Label>
              <SelectInput value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </SelectInput>
            </div>
            <div>
              <Label>Filter by Subcategory</Label>
              <SelectInput value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} disabled={!filterSubs.length}>
                <option value="">{!filterCategory ? "Select category first" : "All Subcategories"}</option>
                {filterSubs.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </SelectInput>
            </div>
            <div>
              <Label>Sort by Price</Label>
              <SelectInput value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Default</option>
                <option value="low">↑ Low to High</option>
                <option value="high">↓ High to Low</option>
              </SelectInput>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          {!bulkMode ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-semibold text-amber-800 text-sm">{selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected</span>
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                  <Trash2 className="w-3.5 h-3.5" />Delete
                </button>
                <button onClick={() => setBulkMode(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                  <Edit className="w-3.5 h-3.5" />Bulk Edit
                </button>
                <button onClick={() => {
                  if (selectedItems.length !== 1) { showAlert("Copy ke liye sirf ek item select karo", "warning"); return; }
                  const item = items.find((x) => x._id === selectedItems[0]);
                  if (item) openCopyInForm(item);
                }} className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
                  <Copy className="w-3.5 h-3.5" />Copy &amp; Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Bulk Edit Selected Items</h3>
                <button onClick={() => setBulkMode(false)}><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.filter((item) => selectedItems.includes(item._id)).map((item) => (
                  <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-3">
                    <h4 className="font-medium text-gray-800 text-sm mb-3">
                      {item.name}{item.brand && <span className="ml-2 text-xs text-blue-600 font-normal">{item.brand}</span>}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {[
                        { label: "Brand",       key: "brand",       type: "text"   },
                        { label: "Base Price",  key: "basePrice",   type: "number" },
                        { label: "Profit/Loss", key: "profitLoss",  type: "number" },
                        { label: "GST %",       key: "gstPercent",  type: "number" },
                        { label: "CESS %",      key: "cessPercent", type: "number" },
                        { label: "HSN Code",    key: "hsnCode",     type: "text"   },
                      ].map(({ label, key, type }) => (
                        <div key={key}>
                          <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
                          <input type={type} value={item[key] ?? ""}
                            onChange={(e) => updateLocalItemField(item._id, key, type === "number" ? Number(e.target.value) : e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Tax Type</label>
                        <select value={item.taxType || "cgst_sgst"} onChange={(e) => updateLocalItemField(item._id, "taxType", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="cgst_sgst">CGST+SGST</option>
                          <option value="igst">IGST</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Status</label>
                        <select value={item.status} onChange={(e) => updateLocalItemField(item._id, "status", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-amber-200">
                <button onClick={handleBulkSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  <Check className="w-4 h-4" />Save All
                </button>
                <button onClick={async () => {
                  if (!selectedItems.length) return;
                  const res = await axios.post(`${API_URL}/export-selected`, { ids: selectedItems }, { responseType: "blob" });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const a   = document.createElement("a"); a.href = url; a.download = "selected.csv"; a.click();
                }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  <Download className="w-4 h-4" />Export Selected
                </button>
                <button onClick={() => setBulkMode(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Copy Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {mode === "copy" ? "✏️ Duplicate Product — Edit & Save" : "Add New Product"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === "copy" ? "Copied product — naam edit karo aur 'Save as New Product' dabao" : "Fill in the details below to add a new product"}
              </p>
            </div>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <FormFields {...formFieldsProps} />
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
              <button type="submit" disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-70">
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  : <><Plus className="w-4 h-4" />{mode === "copy" ? "Save as New Product" : "Add Product"}</>}
              </button>
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">All Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">Showing {currentItems.length} of {filteredItems.length} results</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setColumnVisibility((p) => ({ ...p, category: !p.category }))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              {columnVisibility.category ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-400">Loading products...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-left w-10">
                      <input type="checkbox"
                        checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                    {columnVisibility.category && (
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    )}
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Base Price</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale Price</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">HSN / GST / CESS</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.map((item) => {
                    const hsnInfo = hsnList.find((h) => h.code === item.hsnCode);
                    const gstKey  = item.gstPercent ?? hsnInfo?.gst ?? 0;
                    const badge   = GST_BADGE[gstKey] ?? GST_BADGE[0];
                    const hasCess = (item.cessPercent ?? 0) > 0;
                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <input type="checkbox" checked={selectedItems.includes(item._id)}
                            onChange={() => setSelectedItems((prev) =>
                              prev.includes(item._id) ? prev.filter((x) => x !== item._id) : [...prev, item._id]
                            )}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <ProductThumb image={item.image} galleryImages={item.galleryImages} name={item.name} />
                            <div>
                              <div className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</div>
                              {item.brand && <div className="text-xs text-blue-600 font-medium mt-0.5">{item.brand}</div>}
                              <div className="text-xs text-gray-400 mt-0.5">{item.weight ? `${item.weight.value} ${item.weight.unit}` : "1 kg"}</div>
                              {item.galleryImages?.length > 0 && (
                                <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                  <Images className="w-3 h-3" />{item.galleryImages.length} gallery
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        {columnVisibility.category && (
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-800">{item.category?.name || "—"}</div>
                            {item.subcategory?.name    && <div className="text-xs text-gray-500 mt-0.5">↳ {item.subcategory.name}</div>}
                            {item.subSubcategory?.name && <div className="text-xs text-purple-500 mt-0.5">↳ {item.subSubcategory.name}</div>}
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400">₹</span>
                            <input type="number"
                              value={quickBasePrices[item._id] !== undefined ? quickBasePrices[item._id] : item.basePrice}
                              onChange={(e) => setQuickBasePrices((p) => ({ ...p, [item._id]: e.target.value }))}
                              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                            <button onClick={() => updateBasePrice(item)}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">₹{Number(item.salePrice).toFixed(2)}</div>
                          {/* mini tax breakdown tooltip */}
                          {(item.gstAmount > 0 || item.cessAmount > 0) && (
                            <div className="text-[10px] text-gray-400 mt-0.5 space-y-0.5">
                              {item.taxType === "igst"
                                ? <div>IGST ₹{(item.igstAmount || 0).toFixed(2)}</div>
                                : <>
                                    <div>CGST ₹{(item.cgstAmount || 0).toFixed(2)} · SGST ₹{(item.sgstAmount || 0).toFixed(2)}</div>
                                  </>
                              }
                              {(item.cessAmount ?? 0) > 0 && <div className="text-purple-500">CESS ₹{item.cessAmount.toFixed(2)}</div>}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <input type="number" placeholder="Δ P/L"
                              value={quickProfitLoss[item._id] ?? ""}
                              onChange={(e) => setQuickProfitLoss((p) => ({ ...p, [item._id]: e.target.value }))}
                              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-center" />
                            <button onClick={() => updateProfitLoss(item)}
                              className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                          <div className={`text-xs font-semibold mt-1 ${item.profitLoss >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {item.profitLoss >= 0 ? "▲" : "▼"} {Math.abs(item.profitLoss)}
                          </div>
                        </td>
                        {/* HSN / GST / CESS column */}
                        <td className="py-3 px-4 min-w-[180px]">
                          {item.hsnCode ? (
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{item.hsnCode}</span>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />GST {item.gstPercent ?? 0}%
                                </span>
                                {hasCess && (
                                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />CESS {item.cessPercent}%
                                  </span>
                                )}
                              </div>
                              {hsnInfo && <div className="text-[10px] text-gray-400 mt-1 max-w-[180px] truncate">{hsnInfo.description}</div>}
                              <div className="text-[10px] text-gray-400 mt-0.5 uppercase">{item.taxType === "igst" ? "IGST" : "CGST+SGST"}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleStatusToggle(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              item.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}>
                            {item.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <button onClick={() => setActiveMenu(activeMenu === item._id ? null : item._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            {activeMenu === item._id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                                <button onClick={() => handleEdit(item)}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  <Edit className="w-3.5 h-3.5 text-blue-500" />Edit Product
                                </button>
                                <button onClick={() => openCopyInForm(item)}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  <Copy className="w-3.5 h-3.5 text-purple-500" />Duplicate &amp; Edit
                                </button>
                                <div className="border-t border-gray-100" />
                                <button onClick={() => { handleDelete(item._id); setActiveMenu(null); }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
                  </div>
                  <div className="flex items-center gap-1">
                    {[
                      { icon: <ChevronsLeft  className="w-3.5 h-3.5" />, action: () => setCurrentPage(1),               disabled: currentPage === 1          },
                      { icon: <ChevronLeft   className="w-3.5 h-3.5" />, action: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1          },
                    ].map((btn, i) => (
                      <button key={i} onClick={btn.action} disabled={btn.disabled}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        {btn.icon}
                      </button>
                    ))}
                    {getPageNumbers().map((pageNum, i) => (
                      <button key={i} onClick={() => pageNum !== "..." && setCurrentPage(pageNum)}
                        className={`min-w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum ? "bg-blue-600 text-white shadow-sm" :
                          pageNum === "..."       ? "text-gray-400 cursor-default"     :
                                                    "border border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}>{pageNum}</button>
                    ))}
                    {[
                      { icon: <ChevronRight  className="w-3.5 h-3.5" />, action: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages },
                      { icon: <ChevronsRight className="w-3.5 h-3.5" />, action: () => setCurrentPage(totalPages),      disabled: currentPage === totalPages },
                    ].map((btn, i) => (
                      <button key={i} onClick={btn.action} disabled={btn.disabled}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        {btn.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Edit Product</h2>
                <p className="text-sm text-gray-500">Update product details, images &amp; price ranges</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6" style={{ overflowX: "visible" }}>
              <form onSubmit={handleSubmit} id="edit-form">
                <FormFields {...formFieldsProps} />
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50">
              <button type="submit" form="edit-form" disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-70">
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</>
                  : <><Check className="w-4 h-4" />Update Product</>}
              </button>
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Add New Category</h2>
              <p className="text-sm text-gray-500 mt-0.5">This category will be available immediately</p>
            </div>
            <div className="p-6">
              <Label required>Category Name</Label>
              <Input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Dairy Products" autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
              <div className="flex gap-3 mt-5">
                <button onClick={handleAddCategory} disabled={categoryLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-70">
                  {categoryLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save Category"}
                </button>
                <button onClick={() => { setShowCategoryModal(false); setNewCategoryName(""); }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HSN Add Modal */}
      {showHsnAddModal && (
        <AddHsnModal
          onClose={() => setShowHsnAddModal(false)}
          onAdded={(newHsn) => { handleHsnAddedInParent(newHsn); setShowHsnAddModal(false); }}
          existingHsnCategories={[...new Set(hsnList.map((h) => h.category).filter(Boolean))].sort()}
        />
      )}

      {/* HSN Manage Modal */}
      {showHsnManageModal && (
        <HsnManageModal
          onClose={() => setShowHsnManageModal(false)}
          hsnList={hsnList}
          onDelete={handleHsnDeletedInParent}
          onAddNew={() => { setShowHsnManageModal(false); setShowHsnAddModal(true); }}
        />
      )}

    </div>
  );
}