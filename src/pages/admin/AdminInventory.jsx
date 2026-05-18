// // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // import axios from "axios";
// // import {
// //   Plus, X, AlertTriangle, ArrowDownCircle, ArrowUpCircle,
// //   Layers, RefreshCw, Trash2, Search,
// //   Package, ShieldAlert, CheckCircle2,
// //   Download, Pencil,
// // } from "lucide-react";

// // const API = "https://grocerrybackend.onrender.com/api/inventory";

// // /* ── Helpers ─────────────────────────────────────────── */
// // const fmt = (d) =>
// //   d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// // const cls = (...a) => a.filter(Boolean).join(" ");
// // const exportCSV = (rows, filename) => {
// //   const csv = rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
// //   const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
// //   const a = document.createElement("a");
// //   a.href = URL.createObjectURL(blob); a.download = filename; a.click();
// // };

// // /* ── Sub-components ──────────────────────────────────── */
// // const StockBadge = ({ stock, minStock }) => {
// //   if (stock === 0)
// //     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-200"><ShieldAlert size={9} /> Out</span>;
// //   if (stock <= minStock)
// //     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200"><AlertTriangle size={9} /> Low</span>;
// //   return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200"><CheckCircle2 size={9} /> OK</span>;
// // };

// // const Field = ({ label, children }) => (
// //   <div>
// //     <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
// //     {children}
// //   </div>
// // );

// // const inputCls = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300";

// // const ProductSelect = ({ value, onChange, products, loading }) => (
// //   <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
// //     <option value="">{loading ? "Loading..." : products.length === 0 ? "No products" : "Select product..."}</option>
// //     {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
// //   </select>
// // );

// // const Empty = ({ message = "No records found" }) => (
// //   <tr><td colSpan={99} className="py-14 text-center">
// //     <Package size={32} className="mx-auto text-slate-200 mb-2" />
// //     <p className="text-xs text-slate-400">{message}</p>
// //   </td></tr>
// // );

// // const TH = ({ children, center }) => (
// //   <th className={cls("px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap", center ? "text-center" : "text-left")}>
// //     {children}
// //   </th>
// // );

// // const SearchBar = ({ value, onChange, placeholder }) => (
// //   <div className="relative flex-1">
// //     <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
// //     <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
// //       className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300" />
// //   </div>
// // );

// // const TableSkeleton = ({ cols = 5 }) => (
// //   <>{[1,2,3,4,5].map(i => (
// //     <tr key={i} className="border-b border-slate-50">
// //       {Array(cols).fill(0).map((_, j) => (
// //         <td key={j} className="px-3 py-3">
// //           <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + j * 5}%` }} />
// //         </td>
// //       ))}
// //     </tr>
// //   ))}</>
// // );

// // /* ── Confirm Dialog ─────────────────────────────────── */
// // const Confirm = ({ open, message, onConfirm, onCancel }) => !open ? null : (
// //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
// //     <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-80">
// //       <p className="text-sm font-semibold text-[#1C2434] mb-4">{message}</p>
// //       <div className="flex gap-2 justify-end">
// //         <button onClick={onCancel} className="px-4 py-2 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Cancel</button>
// //         <button onClick={onConfirm} className="px-4 py-2 text-xs bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Delete</button>
// //       </div>
// //     </div>
// //   </div>
// // );

// // /* ══════════════════════════════════════
// //    MAIN COMPONENT
// // ══════════════════════════════════════ */
// // export default function AdminInventory() {
// //   const [tab, setTab] = useState("inventory");

// //   /* ── data ── */
// //   const [products,  setProducts]  = useState([]);
// //   const [inventory, setInventory] = useState([]);

// //   /* ── loading ── */
// //   const [prodLoading, setProdLoading] = useState(true);
// //   const [invLoading,  setInvLoading]  = useState(true);
// //   const [saving,      setSaving]      = useState(false);

// //   /* ── search/filter ── */
// //   const [invSearch, setInvSearch] = useState("");
// //   const [invStatus, setInvStatus] = useState("ALL");

// //   /* ── inventory form (create / edit) ── */
// //   const emptyInv = { product: "", stock: "", minStock: "", expiryDate: "" };
// //   const [showInvForm, setShowInvForm] = useState(false);
// //   const [invForm,     setInvForm]     = useState(emptyInv);
// //   const [editingInvId, setEditingInvId] = useState(null);

// //   /* ── batch ── */
// //   const emptyRow = () => ({ id: Date.now() + Math.random(), product: "", stock: "", minStock: "", expiryDate: "", note: "" });
// //   const [batchRows, setBatchRows] = useState([emptyRow()]);

// //   /* ── confirm dialog ── */
// //   const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: null });
// //   const askConfirm = (message, onConfirm) => setConfirm({ open: true, message, onConfirm });
// //   const closeConfirm = () => setConfirm({ open: false, message: "", onConfirm: null });

// //   /* ══ LOADERS ══ */
// //   const loadProducts = useCallback(async () => {
// //     setProdLoading(true);
// //     try {
// //       const res  = await axios.get("https://grocerrybackend.onrender.com/api/prices");
// //       const list = [];
// //       (res.data.data || []).forEach(cat =>
// //         (cat.subcategories || []).forEach(sub => {
// //           (sub.subSubcategories || []).forEach(ss => (ss.products || []).forEach(p => list.push(p)));
// //           (sub.products || []).forEach(p => list.push(p));
// //         })
// //       );
// //       const seen = new Set();
// //       setProducts(list.filter(p => { if (!p._id || seen.has(p._id)) return false; seen.add(p._id); return true; }));
// //     } catch (e) { console.error(e); }
// //     finally { setProdLoading(false); }
// //   }, []);

// //   const loadInventory = useCallback(async () => {
// //     setInvLoading(true);
// //     try { const r = await axios.get(API); setInventory(r.data.data || []); }
// //     catch { setInventory([]); }
// //     finally { setInvLoading(false); }
// //   }, []);

// //   useEffect(() => { loadProducts(); loadInventory(); }, []);

// //   /* ══ FILTERED + SORTED DATA ══
// //      Sorting logic:
// //      1. Items with expiry date, sorted by nearest expiry first
// //      2. Items without expiry date at the bottom
// //   ══ */
// //   const filteredInv = useMemo(() => {
// //     const q = invSearch.toLowerCase();
// //     const filtered = inventory.filter(i => {
// //       const nameOk   = !q || i.product?.name?.toLowerCase().includes(q);
// //       const statusOk = invStatus === "ALL"
// //         || (invStatus === "OUT_OF_STOCK" && i.stock === 0)
// //         || (invStatus === "LOW"          && i.stock > 0 && i.stock <= i.minStock)
// //         || (invStatus === "OK"           && i.stock > i.minStock);
// //       return nameOk && statusOk;
// //     });

// //     // Sort: items with expiry first (nearest expiry at top), then items without expiry
// //     return filtered.sort((a, b) => {
// //       const hasA = !!a.expiryDate;
// //       const hasB = !!b.expiryDate;
// //       if (hasA && hasB) return new Date(a.expiryDate) - new Date(b.expiryDate); // nearest expiry first
// //       if (hasA && !hasB) return -1; // a has expiry, b doesn't → a comes first
// //       if (!hasA && hasB) return 1;  // b has expiry, a doesn't → b comes first
// //       return 0;
// //     });
// //   }, [inventory, invSearch, invStatus]);

// //   /* ══ CRUD: INVENTORY ══ */
// //   const openCreateForm = () => {
// //     setEditingInvId(null);
// //     setInvForm(emptyInv);
// //     setShowInvForm(true);
// //   };

// //   const openEditForm = (item) => {
// //     setEditingInvId(item._id);
// //     setInvForm({
// //       product:    item.product?._id || "",
// //       stock:      String(item.stock),
// //       minStock:   String(item.minStock),
// //       expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
// //     });
// //     setShowInvForm(true);
// //   };

// //   const saveInv = async () => {
// //     if (!editingInvId && !invForm.product) return alert("Product required");
// //     if (invForm.stock === "") return alert("Stock required");
// //     setSaving(true);
// //     try {
// //       const body = {
// //         stock:      Number(invForm.stock),
// //         minStock:   Number(invForm.minStock) || 0,
// //         expiryDate: invForm.expiryDate || undefined,
// //       };
// //       if (editingInvId) {
// //         await axios.put(`${API}/${editingInvId}`, body);
// //       } else {
// //         await axios.post(API, { ...body, product: invForm.product });
// //       }
// //       setShowInvForm(false);
// //       setInvForm(emptyInv);
// //       setEditingInvId(null);
// //       await loadInventory();
// //     } catch (e) { alert(e.response?.data?.message || "Save failed"); }
// //     finally { setSaving(false); }
// //   };

// //   const deleteInv = (item) => {
// //     askConfirm(
// //       `"${item.product?.name}" ko inventory se delete karein? Saare ledger entries bhi remove ho jayenge.`,
// //       async () => {
// //         closeConfirm();
// //         try {
// //           await axios.delete(`${API}/${item._id}`);
// //           await loadInventory();
// //         } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
// //       }
// //     );
// //   };

// //   /* ══ CRUD: BATCH ══ */
// //   const saveBatch = async () => {
// //     const valid = batchRows.filter(r => r.product && r.stock !== "");
// //     if (!valid.length) return alert("Kam se kam ek valid row fill karo");
// //     setSaving(true);
// //     try {
// //       await axios.post(`${API}/batch`, {
// //         items: valid.map(r => ({
// //           product:    r.product,
// //           stock:      Number(r.stock),
// //           minStock:   Number(r.minStock) || 0,
// //           expiryDate: r.expiryDate || undefined,
// //           note:       r.note || "Batch update",
// //         })),
// //       });
// //       setBatchRows([emptyRow()]);
// //       await loadInventory();
// //       alert(`${valid.length} item(s) successfully saved!`);
// //     } catch (e) { alert(e.response?.data?.message || "Batch save failed"); }
// //     finally { setSaving(false); }
// //   };

// //   const updateRow = (id, k, v) => setBatchRows(r => r.map(row => row.id === id ? { ...row, [k]: v } : row));
// //   const addRow    = ()          => setBatchRows(r => [...r, emptyRow()]);
// //   const removeRow = (id)        => setBatchRows(r => r.length > 1 ? r.filter(row => row.id !== id) : r);

// //   const TABS = [
// //     { id: "inventory", label: "Stock",  Icon: Layers },
// //     { id: "batch",     label: "Batch",  Icon: Plus   },
// //   ];

// //   /* ══ RENDER ══ */
// //   return (
// //     <div className="p-3 md:p-5 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
// //       <Confirm {...confirm} onCancel={closeConfirm} />

// //       {/* Header */}
// //       <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-3 flex items-center justify-between">
// //         <div>
// //           <h2 className="text-base font-extrabold text-[#1C2434] tracking-tight">Inventory Manager</h2>
// //           <p className="text-[10px] text-slate-400 mt-0.5">
// //             {invLoading ? "Loading..." : `${inventory.length} products tracked`}
// //           </p>
// //         </div>
// //         <button
// //           onClick={() => loadInventory()}
// //           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
// //         >
// //           <RefreshCw size={12} /> Refresh
// //         </button>
// //       </div>

// //       {/* Tabs */}
// //       <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm p-1 mb-3 gap-1">
// //         {TABS.map(({ id, label, Icon }) => (
// //           <button key={id} onClick={() => setTab(id)}
// //             className={cls(
// //               "flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all",
// //               tab === id ? "bg-[#3C50E0] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
// //             )}>
// //             <Icon size={13} /><span>{label}</span>
// //           </button>
// //         ))}
// //       </div>

// //       {/* ══ TAB 1: INVENTORY ══ */}
// //       {tab === "inventory" && (
// //         <>
// //           {/* Controls */}
// //           <div className="flex flex-wrap items-center gap-2 mb-3">
// //             <SearchBar value={invSearch} onChange={setInvSearch} placeholder="Search product..." />
// //             {/* Status filter */}
// //             <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
// //               {[
// //                 { k: "ALL", label: "All" },
// //                 { k: "OK",  label: "OK" },
// //                 { k: "LOW", label: "Low" },
// //                 { k: "OUT_OF_STOCK", label: "Out" },
// //               ].map(({ k, label }) => (
// //                 <button key={k} onClick={() => setInvStatus(k)}
// //                   className={cls(
// //                     "px-3 py-2 text-[10px] font-bold transition-all",
// //                     invStatus === k
// //                       ? k === "OK"  ? "bg-emerald-500 text-white"
// //                         : k === "LOW" ? "bg-orange-500 text-white"
// //                         : k === "OUT_OF_STOCK" ? "bg-red-500 text-white"
// //                         : "bg-[#3C50E0] text-white"
// //                       : "text-slate-500 hover:bg-slate-50"
// //                   )}>{label}</button>
// //               ))}
// //             </div>
// //             <button onClick={openCreateForm}
// //               className={cls(
// //                 "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex-shrink-0",
// //                 showInvForm && !editingInvId
// //                   ? "bg-slate-100 text-slate-600 border border-slate-200"
// //                   : "bg-[#3C50E0] text-white shadow-sm"
// //               )}>
// //               {showInvForm && !editingInvId ? <X size={13} /> : <Plus size={13} />}
// //               {showInvForm && !editingInvId ? "Close" : "Add New"}
// //             </button>
// //           </div>

// //           {/* Create / Edit Form */}
// //           {showInvForm && (
// //             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-3">
// //               <p className="text-[10px] font-black text-[#3C50E0] uppercase tracking-widest mb-3">
// //                 {editingInvId ? "Edit Stock" : "Add New Stock"}
// //               </p>
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {!editingInvId && (
// //                   <div className="col-span-2">
// //                     <Field label="Product *">
// //                       <ProductSelect value={invForm.product} onChange={v => setInvForm(f => ({ ...f, product: v }))} products={products} loading={prodLoading} />
// //                     </Field>
// //                   </div>
// //                 )}
// //                 {editingInvId && (
// //                   <div className="col-span-2 flex items-center">
// //                     <p className="text-xs font-semibold text-slate-600">
// //                       Editing: <span className="text-[#3C50E0]">{inventory.find(i => i._id === editingInvId)?.product?.name}</span>
// //                     </p>
// //                   </div>
// //                 )}
// //                 <Field label="Current Qty *">
// //                   <input type="number" min="0" placeholder="0" value={invForm.stock}
// //                     onChange={e => setInvForm(f => ({ ...f, stock: e.target.value }))} className={inputCls} />
// //                 </Field>
// //                 <Field label="Min Stock (Alert)">
// //                   <input type="number" min="0" placeholder="0" value={invForm.minStock}
// //                     onChange={e => setInvForm(f => ({ ...f, minStock: e.target.value }))} className={inputCls} />
// //                 </Field>
// //                 <Field label="Expiry Date">
// //                   <input type="date" value={invForm.expiryDate}
// //                     onChange={e => setInvForm(f => ({ ...f, expiryDate: e.target.value }))} className={inputCls} />
// //                 </Field>
// //                 <div className="flex items-end gap-2">
// //                   <button onClick={saveInv} disabled={saving}
// //                     className="flex-1 py-2 bg-[#3C50E0] text-white font-bold text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all">
// //                     {saving ? "Saving..." : editingInvId ? "Update" : "Save"}
// //                   </button>
// //                   <button onClick={() => { setShowInvForm(false); setInvForm(emptyInv); setEditingInvId(null); }}
// //                     className="px-3 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50">
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Table */}
// //           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
// //             <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
// //               <span className="text-xs font-bold text-slate-600">{filteredInv.length} products</span>
// //               <button onClick={() => exportCSV(
// //                 [["Product", "Stock", "Min Stock", "Status", "Expiry"],
// //                  ...filteredInv.map(i => [i.product?.name, i.stock, i.minStock, i.stock === 0 ? "OUT" : i.stock <= i.minStock ? "LOW" : "OK", fmt(i.expiryDate)])],
// //                 "inventory.csv"
// //               )} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600">
// //                 <Download size={11} /> Export CSV
// //               </button>
// //             </div>
// //             <div className="overflow-x-auto">
// //               <table className="w-full min-w-[520px]">
// //                 <thead>
// //                   <tr className="bg-[#F7F9FC] border-b border-slate-100">
// //                     <TH>Product</TH>
// //                     <TH center>Stock</TH>
// //                     <TH center>Min</TH>
// //                     <TH>Expiry</TH>
// //                     <TH>Status</TH>
// //                     <TH center>Actions</TH>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-50">
// //                   {invLoading ? <TableSkeleton cols={6} />
// //                     : filteredInv.length === 0 ? <Empty message={invSearch ? "Koi result nahi" : "Inventory empty hai"} />
// //                     : filteredInv.map(item => {
// //                       const daysLeft = item.expiryDate ? Math.ceil((new Date(item.expiryDate) - Date.now()) / 86400000) : null;
// //                       const expSoon  = daysLeft !== null && daysLeft <= 30;
// //                       const expired  = daysLeft !== null && daysLeft < 0;
// //                       return (
// //                         <tr key={item._id} className={cls(
// //                           "hover:bg-slate-50/60 transition-colors",
// //                           expired  && "bg-red-50/40",
// //                           !expired && expSoon && "bg-orange-50/30"
// //                         )}>
// //                           <td className="px-3 py-3 font-semibold text-[13px] text-[#1C2434]">{item.product?.name || "—"}</td>
// //                           <td className="px-3 py-3 text-center">
// //                             <span className={cls("text-[14px] font-extrabold",
// //                               item.stock === 0 ? "text-red-500" : item.stock <= item.minStock ? "text-orange-500" : "text-[#1C2434]"
// //                             )}>{item.stock}</span>
// //                           </td>
// //                           <td className="px-3 py-3 text-center text-[12px] text-slate-400">{item.minStock}</td>
// //                           <td className="px-3 py-3">
// //                             {item.expiryDate ? (
// //                               <div className="flex flex-col">
// //                                 <span className={cls("text-[11px] font-semibold",
// //                                   expired ? "text-red-500" : expSoon ? "text-orange-500" : "text-slate-500"
// //                                 )}>
// //                                   {expired ? "❌ " : expSoon ? "⚠ " : ""}{fmt(item.expiryDate)}
// //                                 </span>
// //                                 {daysLeft !== null && (
// //                                   <span className={cls("text-[10px]",
// //                                     expired ? "text-red-400" : expSoon ? "text-orange-400" : "text-slate-300"
// //                                   )}>
// //                                     {expired ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
// //                                   </span>
// //                                 )}
// //                               </div>
// //                             ) : (
// //                               <span className="text-slate-200 text-[11px]">—</span>
// //                             )}
// //                           </td>
// //                           <td className="px-3 py-3"><StockBadge stock={item.stock} minStock={item.minStock} /></td>
// //                           <td className="px-3 py-3">
// //                             <div className="flex items-center justify-center gap-2">
// //                               <button onClick={() => openEditForm(item)}
// //                                 className="p-1.5 rounded-lg text-slate-400 hover:text-[#3C50E0] hover:bg-blue-50 transition-colors">
// //                                 <Pencil size={13} />
// //                               </button>
// //                               <button onClick={() => deleteInv(item)}
// //                                 className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
// //                                 <Trash2 size={13} />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       );
// //                     })
// //                   }
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </>
// //       )}

// //       {/* ══ TAB 2: BATCH ══ */}
// //       {tab === "batch" && (
// //         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
// //           <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
// //             <div>
// //               <p className="text-xs font-bold text-slate-700">Batch Stock Update</p>
// //               <p className="text-[10px] text-slate-400 mt-0.5">Multiple products ek saath update karo</p>
// //             </div>
// //             <button onClick={addRow}
// //               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3C50E0]/10 text-[#3C50E0] text-[11px] font-bold hover:bg-[#3C50E0]/20 transition-colors">
// //               <Plus size={12} /> Row Add Karo
// //             </button>
// //           </div>
// //           <div className="overflow-x-auto">
// //             <table className="w-full min-w-[600px]">
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-[#F7F9FC]">
// //                   <TH>#</TH>
// //                   <TH>Product *</TH>
// //                   <TH>Stock *</TH>
// //                   <TH>Min Stock</TH>
// //                   <TH>Expiry</TH>
// //                   <TH>Note</TH>
// //                   <th className="w-8" />
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-50">
// //                 {batchRows.map((row, idx) => (
// //                   <tr key={row.id} className="hover:bg-slate-50/60">
// //                     <td className="px-3 py-2.5 text-[11px] text-slate-300 font-mono">{idx + 1}</td>
// //                     <td className="px-3 py-2 min-w-[180px]">
// //                       <ProductSelect value={row.product} onChange={v => updateRow(row.id, "product", v)} products={products} loading={prodLoading} />
// //                     </td>
// //                     <td className="px-3 py-2">
// //                       <input type="number" min="0" value={row.stock} placeholder="0"
// //                         onChange={e => updateRow(row.id, "stock", e.target.value)} className={cls(inputCls, "w-24")} />
// //                     </td>
// //                     <td className="px-3 py-2">
// //                       <input type="number" min="0" value={row.minStock} placeholder="0"
// //                         onChange={e => updateRow(row.id, "minStock", e.target.value)} className={cls(inputCls, "w-24")} />
// //                     </td>
// //                     <td className="px-3 py-2">
// //                       <input type="date" value={row.expiryDate}
// //                         onChange={e => updateRow(row.id, "expiryDate", e.target.value)} className={cls(inputCls, "w-36")} />
// //                     </td>
// //                     <td className="px-3 py-2">
// //                       <input type="text" value={row.note} placeholder="Optional"
// //                         onChange={e => updateRow(row.id, "note", e.target.value)} className={cls(inputCls, "w-32")} />
// //                     </td>
// //                     <td className="px-3 py-2">
// //                       <button onClick={() => removeRow(row.id)} disabled={batchRows.length === 1}
// //                         className="text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors">
// //                         <Trash2 size={14} />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //           <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
// //             <span className="text-[11px] text-slate-400">
// //               <span className="font-bold text-slate-600">{batchRows.filter(r => r.product && r.stock !== "").length}</span> valid /
// //               <span className="font-bold text-slate-600"> {batchRows.length}</span> rows
// //             </span>
// //             <div className="flex gap-2">
// //               <button onClick={() => setBatchRows([emptyRow()])}
// //                 className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-white">Reset</button>
// //               <button onClick={saveBatch} disabled={saving || batchRows.filter(r => r.product && r.stock !== "").length === 0}
// //                 className="px-4 py-1.5 rounded-lg bg-[#3C50E0] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 active:scale-95">
// //                 {saving ? "Saving..." : `Save ${batchRows.filter(r => r.product && r.stock !== "").length} Items`}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import axios from "axios";
// import {
//   Plus, X, AlertTriangle, Layers, RefreshCw, Trash2, Search,
//   Package, ShieldAlert, CheckCircle2, Download, Pencil,
// } from "lucide-react";

// const API = "https://grocerrybackend.onrender.com/api/inventory";

// /* ── Helpers ──────────────────────────────────────────────── */
// const fmt = (d) =>
//   d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const cls = (...a) => a.filter(Boolean).join(" ");
// const exportCSV = (rows, filename) => {
//   const csv = rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
//   const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob); a.download = filename; a.click();
// };

// /* ── Sub-components ───────────────────────────────────────── */
// const StockBadge = ({ stock, minStock }) => {
//   if (stock === 0)
//     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-200"><ShieldAlert size={9} /> Out</span>;
//   if (stock <= minStock)
//     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200"><AlertTriangle size={9} /> Low</span>;
//   return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200"><CheckCircle2 size={9} /> OK</span>;
// };

// const Field = ({ label, children }) => (
//   <div>
//     <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
//     {children}
//   </div>
// );

// const inputCls = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300";

// const ProductSelect = ({ value, onChange, products, loading, exclude = [] }) => (
//   <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
//     <option value="">{loading ? "Loading..." : products.length === 0 ? "No products" : "Select product..."}</option>
//     {products
//       .filter(p => !exclude.includes(p._id) || p._id === value)
//       .map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//   </select>
// );

// const Empty = ({ message = "No records found" }) => (
//   <tr><td colSpan={99} className="py-14 text-center">
//     <Package size={32} className="mx-auto text-slate-200 mb-2" />
//     <p className="text-xs text-slate-400">{message}</p>
//   </td></tr>
// );

// const TH = ({ children, center }) => (
//   <th className={cls("px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap", center ? "text-center" : "text-left")}>
//     {children}
//   </th>
// );

// const SearchBar = ({ value, onChange, placeholder }) => (
//   <div className="relative flex-1">
//     <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
//     <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
//       className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300" />
//   </div>
// );

// const TableSkeleton = ({ cols = 5 }) => (
//   <>{[1, 2, 3, 4, 5].map(i => (
//     <tr key={i} className="border-b border-slate-50">
//       {Array(cols).fill(0).map((_, j) => (
//         <td key={j} className="px-3 py-3">
//           <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + j * 5}%` }} />
//         </td>
//       ))}
//     </tr>
//   ))}</>
// );

// const Confirm = ({ open, message, onConfirm, onCancel }) => !open ? null : (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-80">
//       <p className="text-sm font-semibold text-[#1C2434] mb-4">{message}</p>
//       <div className="flex gap-2 justify-end">
//         <button onClick={onCancel} className="px-4 py-2 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Cancel</button>
//         <button onClick={onConfirm} className="px-4 py-2 text-xs bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Delete</button>
//       </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════ */
// export default function AdminInventory() {

//   /* ── data ── */
//   const [products,  setProducts]  = useState([]);
//   const [inventory, setInventory] = useState([]);

//   /* ── loading ── */
//   const [prodLoading, setProdLoading] = useState(true);
//   const [invLoading,  setInvLoading]  = useState(true);
//   const [saving,      setSaving]      = useState(false);

//   /* ── search / filter ── */
//   const [invSearch, setInvSearch] = useState("");
//   const [invStatus, setInvStatus] = useState("ALL");

//   /* ── form mode: null = hidden | "edit" | "add" ── */
//   const [formMode,     setFormMode]     = useState(null);
//   const [editingInvId, setEditingInvId] = useState(null);

//   /* ── edit form state (single item) ── */
//   const emptyEdit = { stock: "", minStock: "", expiryDate: "" };
//   const [editForm, setEditForm] = useState(emptyEdit);

//   /* ── add form: batch rows ── */
//   const newRow = () => ({ id: Date.now() + Math.random(), product: "", stock: "", minStock: "", expiryDate: "" });
//   const [addRows, setAddRows] = useState([newRow()]);

//   /* ── confirm dialog ── */
//   const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: null });
//   const askConfirm  = (message, fn) => setConfirm({ open: true, message, onConfirm: fn });
//   const closeConfirm = () => setConfirm({ open: false, message: "", onConfirm: null });

//   /* ══ LOADERS ══ */
//   const loadProducts = useCallback(async () => {
//     setProdLoading(true);
//     try {
//       const res  = await axios.get("https://grocerrybackend.onrender.com/api/prices");
//       const list = [];
//       (res.data.data || []).forEach(cat =>
//         (cat.subcategories || []).forEach(sub => {
//           (sub.subSubcategories || []).forEach(ss => (ss.products || []).forEach(p => list.push(p)));
//           (sub.products || []).forEach(p => list.push(p));
//         })
//       );
//       const seen = new Set();
//       setProducts(list.filter(p => { if (!p._id || seen.has(p._id)) return false; seen.add(p._id); return true; }));
//     } catch (e) { console.error(e); }
//     finally { setProdLoading(false); }
//   }, []);

//   const loadInventory = useCallback(async () => {
//     setInvLoading(true);
//     try { const r = await axios.get(API); setInventory(r.data.data || []); }
//     catch { setInventory([]); }
//     finally { setInvLoading(false); }
//   }, []);

//   useEffect(() => { loadProducts(); loadInventory(); }, []);

//   /* ══ FILTERED + SORTED ══ */
//   const filteredInv = useMemo(() => {
//     const q = invSearch.toLowerCase();
//     const filtered = inventory.filter(i => {
//       const nameOk   = !q || i.product?.name?.toLowerCase().includes(q);
//       const statusOk =
//         invStatus === "ALL"
//         || (invStatus === "OUT_OF_STOCK" && i.stock === 0)
//         || (invStatus === "LOW"          && i.stock > 0 && i.stock <= i.minStock)
//         || (invStatus === "OK"           && i.stock > i.minStock);
//       return nameOk && statusOk;
//     });
//     return filtered.sort((a, b) => {
//       const hasA = !!a.expiryDate, hasB = !!b.expiryDate;
//       if (hasA && hasB)  return new Date(a.expiryDate) - new Date(b.expiryDate);
//       if (hasA && !hasB) return -1;
//       if (!hasA && hasB) return 1;
//       return 0;
//     });
//   }, [inventory, invSearch, invStatus]);

//   /* already-tracked product IDs (to avoid duplicates in add form) */
//   const trackedIds = useMemo(() => inventory.map(i => i.product?._id), [inventory]);

//   /* ══ FORM OPEN / CLOSE ══ */
//   const openAddForm = () => {
//     setFormMode("add");
//     setEditingInvId(null);
//     setAddRows([newRow()]);
//   };

//   const openEditForm = (item) => {
//     setFormMode("edit");
//     setEditingInvId(item._id);
//     setEditForm({
//       stock:      String(item.stock),
//       minStock:   String(item.minStock),
//       expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
//     });
//   };

//   const closeForm = () => {
//     setFormMode(null);
//     setEditingInvId(null);
//     setEditForm(emptyEdit);
//     setAddRows([newRow()]);
//   };

//   /* ══ SAVE: EDIT (single PUT) ══ */
//   const saveEdit = async () => {
//     if (editForm.stock === "") return alert("Stock required");
//     setSaving(true);
//     try {
//       await axios.put(`${API}/${editingInvId}`, {
//         stock:      Number(editForm.stock),
//         minStock:   Number(editForm.minStock) || 0,
//         expiryDate: editForm.expiryDate || undefined,
//       });
//       closeForm();
//       await loadInventory();
//     } catch (e) { alert(e.response?.data?.message || "Update failed"); }
//     finally { setSaving(false); }
//   };

//   /* ══ SAVE: ADD (batch POST — one or many rows) ══ */
//   const saveAdd = async () => {
//     const valid = addRows.filter(r => r.product && r.stock !== "");
//     if (!valid.length) return alert("Kam se kam ek row properly fill karo");
//     setSaving(true);
//     try {
//       await axios.post(`${API}/batch`, {
//         items: valid.map(r => ({
//           product:    r.product,
//           stock:      Number(r.stock),
//           minStock:   Number(r.minStock) || 0,
//           expiryDate: r.expiryDate || undefined,
//           note:       "Opening stock",
//         })),
//       });
//       closeForm();
//       await loadInventory();
//     } catch (e) { alert(e.response?.data?.message || "Save failed"); }
//     finally { setSaving(false); }
//   };

//   /* ══ ADD ROWS helpers ══ */
//   const updateAddRow = (id, k, v) => setAddRows(r => r.map(row => row.id === id ? { ...row, [k]: v } : row));
//   const addOneRow    = ()          => setAddRows(r => [...r, newRow()]);
//   const removeAddRow = (id)        => setAddRows(r => r.length > 1 ? r.filter(row => row.id !== id) : r);

//   /* ══ DELETE inventory ══ */
//   const deleteInv = (item) => {
//     askConfirm(
//       `"${item.product?.name}" ko inventory se delete karein? Saare ledger entries bhi remove ho jayenge.`,
//       async () => {
//         closeConfirm();
//         try { await axios.delete(`${API}/${item._id}`); await loadInventory(); }
//         catch (e) { alert(e.response?.data?.message || "Delete failed"); }
//       }
//     );
//   };

//   /* ══ RENDER ══ */
//   return (
//     <div className="p-3 md:p-5 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
//       <Confirm {...confirm} onCancel={closeConfirm} />

//       {/* ── Header ── */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-3 flex items-center justify-between">
//         <div>
//           <h2 className="text-base font-extrabold text-[#1C2434] tracking-tight flex items-center gap-2">
//             <Layers size={16} className="text-[#3C50E0]" /> Inventory Manager
//           </h2>
//           <p className="text-[10px] text-slate-400 mt-0.5">
//             {invLoading ? "Loading..." : `${inventory.length} products tracked`}
//           </p>
//         </div>
//         <button onClick={loadInventory}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-all active:scale-95">
//           <RefreshCw size={12} /> Refresh
//         </button>
//       </div>

//       {/* ── Controls ── */}
//       <div className="flex flex-wrap items-center gap-2 mb-3">
//         <SearchBar value={invSearch} onChange={setInvSearch} placeholder="Search product..." />

//         {/* Status filter pills */}
//         <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
//           {[
//             { k: "ALL",          label: "All"  },
//             { k: "OK",           label: "OK"   },
//             { k: "LOW",          label: "Low"  },
//             { k: "OUT_OF_STOCK", label: "Out"  },
//           ].map(({ k, label }) => (
//             <button key={k} onClick={() => setInvStatus(k)}
//               className={cls(
//                 "px-3 py-2 text-[10px] font-bold transition-all",
//                 invStatus === k
//                   ? k === "OK"           ? "bg-emerald-500 text-white"
//                   : k === "LOW"          ? "bg-orange-500 text-white"
//                   : k === "OUT_OF_STOCK" ? "bg-red-500 text-white"
//                   : "bg-[#3C50E0] text-white"
//                   : "text-slate-500 hover:bg-slate-50"
//               )}>{label}</button>
//           ))}
//         </div>

//         {/* Add / Close button */}
//         <button onClick={formMode === "add" ? closeForm : openAddForm}
//           className={cls(
//             "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex-shrink-0",
//             formMode === "add"
//               ? "bg-slate-100 text-slate-600 border border-slate-200"
//               : "bg-[#3C50E0] text-white shadow-sm"
//           )}>
//           {formMode === "add" ? <X size={13} /> : <Plus size={13} />}
//           {formMode === "add" ? "Close" : "Add Stock"}
//         </button>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           ADD FORM  —  batch rows (one or many products)
//       ══════════════════════════════════════════════════ */}
//       {formMode === "add" && (
//         <div className="bg-white rounded-xl border border-[#3C50E0]/20 shadow-sm mb-3 overflow-hidden">
//           {/* Form header */}
//           <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-[#3C50E0]/5">
//             <div>
//               <p className="text-[11px] font-black text-[#3C50E0] uppercase tracking-widest">Add Stock</p>
//               <p className="text-[10px] text-slate-400 mt-0.5">Ek ya multiple products ek saath add karo</p>
//             </div>
//             <button onClick={addOneRow}
//               className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3C50E0]/10 text-[#3C50E0] text-[11px] font-bold hover:bg-[#3C50E0]/20 transition-colors">
//               <Plus size={11} /> Row Add Karo
//             </button>
//           </div>

//           {/* Rows table */}
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[580px]">
//               <thead>
//                 <tr className="bg-[#F7F9FC] border-b border-slate-100">
//                   <TH>#</TH>
//                   <TH>Product *</TH>
//                   <TH>Stock *</TH>
//                   <TH>Min Stock</TH>
//                   <TH>Expiry Date</TH>
//                   <th className="w-8" />
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {addRows.map((row, idx) => {
//                   /* products already selected in OTHER rows — prevent duplicate */
//                   const otherSelected = addRows.filter(r => r.id !== row.id).map(r => r.product);
//                   /* also exclude already-tracked products */
//                   const excludeIds = [...new Set([...trackedIds, ...otherSelected])];
//                   return (
//                     <tr key={row.id} className="hover:bg-slate-50/60">
//                       <td className="px-3 py-2.5 text-[11px] text-slate-300 font-mono w-8">{idx + 1}</td>
//                       <td className="px-3 py-2 min-w-[190px]">
//                         <ProductSelect
//                           value={row.product}
//                           onChange={v => updateAddRow(row.id, "product", v)}
//                           products={products}
//                           loading={prodLoading}
//                           exclude={excludeIds}
//                         />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input type="number" min="0" value={row.stock} placeholder="0"
//                           onChange={e => updateAddRow(row.id, "stock", e.target.value)}
//                           className={cls(inputCls, "w-24")} />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input type="number" min="0" value={row.minStock} placeholder="0"
//                           onChange={e => updateAddRow(row.id, "minStock", e.target.value)}
//                           className={cls(inputCls, "w-24")} />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input type="date" value={row.expiryDate}
//                           onChange={e => updateAddRow(row.id, "expiryDate", e.target.value)}
//                           className={cls(inputCls, "w-36")} />
//                       </td>
//                       <td className="px-3 py-2">
//                         <button onClick={() => removeAddRow(row.id)} disabled={addRows.length === 1}
//                           className="text-slate-300 hover:text-red-400 disabled:opacity-20 transition-colors">
//                           <Trash2 size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}
//           <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
//             <span className="text-[11px] text-slate-400">
//               <span className="font-bold text-slate-600">
//                 {addRows.filter(r => r.product && r.stock !== "").length}
//               </span> valid / <span className="font-bold text-slate-600">{addRows.length}</span> rows
//             </span>
//             <div className="flex gap-2">
//               <button onClick={closeForm}
//                 className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-white">
//                 Cancel
//               </button>
//               <button onClick={saveAdd} disabled={saving || addRows.filter(r => r.product && r.stock !== "").length === 0}
//                 className="px-4 py-1.5 rounded-lg bg-[#3C50E0] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 active:scale-95 transition-all">
//                 {saving
//                   ? "Saving..."
//                   : `Save ${addRows.filter(r => r.product && r.stock !== "").length} Item(s)`}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════
//           EDIT FORM  —  single item
//       ══════════════════════════════════════════════════ */}
//       {formMode === "edit" && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-3">
//           <p className="text-[10px] font-black text-[#3C50E0] uppercase tracking-widest mb-1">Edit Stock</p>
//           <p className="text-xs font-semibold text-slate-500 mb-3">
//             {inventory.find(i => i._id === editingInvId)?.product?.name}
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <Field label="Current Qty *">
//               <input type="number" min="0" placeholder="0" value={editForm.stock}
//                 onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} className={inputCls} />
//             </Field>
//             <Field label="Min Stock (Alert)">
//               <input type="number" min="0" placeholder="0" value={editForm.minStock}
//                 onChange={e => setEditForm(f => ({ ...f, minStock: e.target.value }))} className={inputCls} />
//             </Field>
//             <Field label="Expiry Date">
//               <input type="date" value={editForm.expiryDate}
//                 onChange={e => setEditForm(f => ({ ...f, expiryDate: e.target.value }))} className={inputCls} />
//             </Field>
//             <div className="flex items-end gap-2">
//               <button onClick={saveEdit} disabled={saving}
//                 className="flex-1 py-2 bg-[#3C50E0] text-white font-bold text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all">
//                 {saving ? "Saving..." : "Update"}
//               </button>
//               <button onClick={closeForm}
//                 className="px-3 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════
//           INVENTORY TABLE
//       ══════════════════════════════════════════════════ */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
//           <span className="text-xs font-bold text-slate-600">{filteredInv.length} products</span>
//           <button onClick={() => exportCSV(
//             [["Product", "Stock", "Min Stock", "Status", "Expiry"],
//              ...filteredInv.map(i => [
//                i.product?.name, i.stock, i.minStock,
//                i.stock === 0 ? "OUT" : i.stock <= i.minStock ? "LOW" : "OK",
//                fmt(i.expiryDate),
//              ])],
//             "inventory.csv"
//           )} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600">
//             <Download size={11} /> Export CSV
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[520px]">
//             <thead>
//               <tr className="bg-[#F7F9FC] border-b border-slate-100">
//                 <TH>Product</TH>
//                 <TH center>Stock</TH>
//                 <TH center>Min</TH>
//                 <TH>Expiry</TH>
//                 <TH>Status</TH>
//                 <TH center>Actions</TH>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {invLoading
//                 ? <TableSkeleton cols={6} />
//                 : filteredInv.length === 0
//                   ? <Empty message={invSearch ? "Koi result nahi" : "Inventory empty hai"} />
//                   : filteredInv.map(item => {
//                     const daysLeft = item.expiryDate
//                       ? Math.ceil((new Date(item.expiryDate) - Date.now()) / 86400000)
//                       : null;
//                     const expSoon = daysLeft !== null && daysLeft <= 30;
//                     const expired = daysLeft !== null && daysLeft < 0;
//                     return (
//                       <tr key={item._id} className={cls(
//                         "hover:bg-slate-50/60 transition-colors",
//                         expired          && "bg-red-50/40",
//                         !expired && expSoon && "bg-orange-50/30",
//                         formMode === "edit" && editingInvId === item._id && "ring-1 ring-inset ring-[#3C50E0]/30"
//                       )}>
//                         <td className="px-3 py-3 font-semibold text-[13px] text-[#1C2434]">{item.product?.name || "—"}</td>
//                         <td className="px-3 py-3 text-center">
//                           <span className={cls("text-[14px] font-extrabold",
//                             item.stock === 0 ? "text-red-500"
//                             : item.stock <= item.minStock ? "text-orange-500"
//                             : "text-[#1C2434]"
//                           )}>{item.stock}</span>
//                         </td>
//                         <td className="px-3 py-3 text-center text-[12px] text-slate-400">{item.minStock}</td>
//                         <td className="px-3 py-3">
//                           {item.expiryDate ? (
//                             <div className="flex flex-col">
//                               <span className={cls("text-[11px] font-semibold",
//                                 expired ? "text-red-500" : expSoon ? "text-orange-500" : "text-slate-500"
//                               )}>
//                                 {expired ? "❌ " : expSoon ? "⚠ " : ""}{fmt(item.expiryDate)}
//                               </span>
//                               <span className={cls("text-[10px]",
//                                 expired ? "text-red-400" : expSoon ? "text-orange-400" : "text-slate-300"
//                               )}>
//                                 {expired ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-slate-200 text-[11px]">—</span>
//                           )}
//                         </td>
//                         <td className="px-3 py-3">
//                           <StockBadge stock={item.stock} minStock={item.minStock} />
//                         </td>
//                         <td className="px-3 py-3">
//                           <div className="flex items-center justify-center gap-2">
//                             <button onClick={() => formMode === "edit" && editingInvId === item._id ? closeForm() : openEditForm(item)}
//                               className={cls(
//                                 "p-1.5 rounded-lg transition-colors",
//                                 formMode === "edit" && editingInvId === item._id
//                                   ? "text-[#3C50E0] bg-blue-50"
//                                   : "text-slate-400 hover:text-[#3C50E0] hover:bg-blue-50"
//                               )}>
//                               <Pencil size={13} />
//                             </button>
//                             <button onClick={() => deleteInv(item)}
//                               className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
//                               <Trash2 size={13} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//               }
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Plus, X, AlertTriangle, Layers, RefreshCw, Trash2, Search,
  Package, ShieldAlert, CheckCircle2, Download, Pencil, ChevronDown, ChevronUp,
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/inventory";

const newRow = () => ({
  id:         Date.now() + Math.random(),
  product:    "",
  stock:      "",   
  minStock:   "",
 
  batchNo:    "",
  mfgDate:    "",
  expiryDate: "",
  qty:        "",   
});

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const cls = (...a) => a.filter(Boolean).join(" ");

const exportCSV = (rows, filename) => {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

/* ── Sub-components ──────────────────────────────────────────────────────────── */
const StockBadge = ({ stock, minStock }) => {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-200"><ShieldAlert size={9} /> Out</span>;
  if (stock <= minStock)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200"><AlertTriangle size={9} /> Low</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200"><CheckCircle2 size={9} /> OK</span>;
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300";

const ProductSelect = ({ value, onChange, products, loading, alreadyTracked = [], otherSelected = [] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
    <option value="">{loading ? "Loading..." : products.length === 0 ? "No products" : "Select product..."}</option>
    {products.map((p) => {
      const sid        = String(p._id);
      const isTracked  = alreadyTracked.includes(sid);
      const isDupRow   = otherSelected.includes(sid);
      const isDisabled = (isTracked || isDupRow) && sid !== String(value);
      return (
        <option key={p._id} value={p._id} disabled={isDisabled}>
          {p.name}{isTracked ? " ✓" : ""}
        </option>
      );
    })}
  </select>
);

const Empty = ({ message = "No records found" }) => (
  <tr><td colSpan={99} className="py-14 text-center">
    <Package size={32} className="mx-auto text-slate-200 mb-2" />
    <p className="text-xs text-slate-400">{message}</p>
  </td></tr>
);

const TH = ({ children, center }) => (
  <th className={cls("px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap", center ? "text-center" : "text-left")}>
    {children}
  </th>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300" />
  </div>
);

const TableSkeleton = ({ cols = 7 }) => (
  <>{[1, 2, 3, 4, 5].map((i) => (
    <tr key={i} className="border-b border-slate-50">
      {Array(cols).fill(0).map((_, j) => (
        <td key={j} className="px-3 py-3">
          <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + j * 5}%` }} />
        </td>
      ))}
    </tr>
  ))}</>
);

const Confirm = ({ open, message, onConfirm, onCancel }) => !open ? null : (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-80">
      <p className="text-sm font-semibold text-[#1C2434] mb-4">{message}</p>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 text-xs bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Delete</button>
      </div>
    </div>
  </div>
);

/* ── Batch Pills — inventory table mein batches dikhane ke liye ─────────────── */
const BatchPills = ({ batches }) => {
  const [expanded, setExpanded] = useState(false);
  if (!batches || batches.length === 0)
    return <span className="text-slate-200 text-[11px]">—</span>;

  const show = expanded ? batches : batches.slice(0, 1);

  return (
    <div className="flex flex-col gap-1">
      {show.map((b, i) => {
        const daysLeft = b.expiryDate
          ? Math.ceil((new Date(b.expiryDate) - Date.now()) / 86400000)
          : null;
        const expired  = daysLeft !== null && daysLeft < 0;
        const expSoon  = daysLeft !== null && daysLeft <= 30 && !expired;

        return (
          <div key={i} className={cls(
            "text-[10px] px-2 py-1 rounded-lg border font-medium leading-tight",
            expired  ? "bg-red-50 border-red-200 text-red-600"
            : expSoon ? "bg-orange-50 border-orange-200 text-orange-600"
            : "bg-slate-50 border-slate-200 text-slate-600"
          )}>
            {b.batchNo && <span className="font-bold">{b.batchNo} · </span>}
            <span>Qty: {b.qty}</span>
            {b.expiryDate && (
              <span className="ml-1">
                · Exp: {fmt(b.expiryDate)}
                {expired  ? " ❌" : expSoon ? " ⚠" : ""}
              </span>
            )}
            {b.mfgDate && <span className="ml-1">· Mfg: {fmt(b.mfgDate)}</span>}
          </div>
        );
      })}
      {batches.length > 1 && (
        <button onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-0.5 text-[10px] text-[#3C50E0] font-bold mt-0.5">
          {expanded
            ? <><ChevronUp size={10} /> Hide</>
            : <><ChevronDown size={10} /> +{batches.length - 1} more batch{batches.length - 1 > 1 ? "es" : ""}</>}
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdminInventory() {

  /* ── data ── */
  const [products,  setProducts]  = useState([]);
  const [inventory, setInventory] = useState([]);

  /* ── loading ── */
  const [prodLoading, setProdLoading] = useState(true);
  const [invLoading,  setInvLoading]  = useState(true);
  const [saving,      setSaving]      = useState(false);

  /* ── search / filter ── */
  const [invSearch, setInvSearch] = useState("");
  const [invStatus, setInvStatus] = useState("ALL");

  /* ── form mode: null | "edit" | "add" ── */
  const [formMode,     setFormMode]     = useState(null);
  const [editingInvId, setEditingInvId] = useState(null);

  /* ── edit form state ── */
  const emptyEdit = { stock: "", minStock: "", batches: [] };
  const [editForm, setEditForm] = useState(emptyEdit);

  /* ── add form ── */
  const [batchName, setBatchName] = useState("");
  const [addRows,   setAddRows]   = useState([newRow()]);

  /* ── confirm dialog ── */
  const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: null });
  const askConfirm   = (message, fn) => setConfirm({ open: true, message, onConfirm: fn });
  const closeConfirm = () => setConfirm({ open: false, message: "", onConfirm: null });

  /* ══ LOADERS ══ */
  const loadProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const res  = await axios.get("https://grocerrybackend.onrender.com/api/prices");
      const list = [];
      (res.data.data || []).forEach((cat) =>
        (cat.subcategories || []).forEach((sub) => {
          (sub.subSubcategories || []).forEach((ss) => (ss.products || []).forEach((p) => list.push(p)));
          (sub.products || []).forEach((p) => list.push(p));
        })
      );
      const seen = new Set();
      setProducts(list.filter((p) => { if (!p._id || seen.has(p._id)) return false; seen.add(p._id); return true; }));
    } catch (e) { console.error(e); }
    finally { setProdLoading(false); }
  }, []);

  const loadInventory = useCallback(async () => {
    setInvLoading(true);
    try { const r = await axios.get(API); setInventory(r.data.data || []); }
    catch { setInventory([]); }
    finally { setInvLoading(false); }
  }, []);

  useEffect(() => { loadProducts(); loadInventory(); }, []);

  /* ══ FILTERED + SORTED ══ */
  const filteredInv = useMemo(() => {
    const q        = invSearch.toLowerCase();
    const filtered = inventory.filter((i) => {
      const nameOk   = !q || i.product?.name?.toLowerCase().includes(q);
      const statusOk =
        invStatus === "ALL"
        || (invStatus === "OUT_OF_STOCK" && i.stock === 0)
        || (invStatus === "LOW"          && i.stock > 0 && i.stock <= i.minStock)
        || (invStatus === "OK"           && i.stock > i.minStock);
      return nameOk && statusOk;
    });
    return filtered.sort((a, b) => {
      const hasA = !!a.expiryDate, hasB = !!b.expiryDate;
      if (hasA && hasB)   return new Date(a.expiryDate) - new Date(b.expiryDate);
      if (hasA && !hasB)  return -1;
      if (!hasA && hasB)  return 1;
      return 0;
    });
  }, [inventory, invSearch, invStatus]);

  const trackedIds = useMemo(() => inventory.map((i) => String(i.product?._id)), [inventory]);

  /* ══ FORM OPEN / CLOSE ══ */
  const openAddForm = () => {
    setFormMode("add");
    setEditingInvId(null);
    setBatchName("");
    setAddRows([newRow()]);
  };

  const openEditForm = (item) => {
    setFormMode("edit");
    setEditingInvId(item._id);
    setEditForm({
      stock:    String(item.stock),
      minStock: String(item.minStock),
      // Edit mein existing batches load karo
      batches:  (item.batches || []).map((b) => ({
        id:         Math.random(),
        batchNo:    b.batchNo    || "",
        mfgDate:    b.mfgDate    ? b.mfgDate.slice(0, 10)    : "",
        expiryDate: b.expiryDate ? b.expiryDate.slice(0, 10) : "",
        qty:        String(b.qty || ""),
      })),
    });
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingInvId(null);
    setEditForm(emptyEdit);
    setBatchName("");
    setAddRows([newRow()]);
  };

  /* ══ EDIT batch helpers ══ */
  const editBatchSet = (idx, key, val) =>
    setEditForm((f) => ({
      ...f,
      batches: f.batches.map((b, i) => (i === idx ? { ...b, [key]: val } : b)),
    }));

  const editBatchAdd = () =>
    setEditForm((f) => ({
      ...f,
      batches: [...f.batches, { id: Math.random(), batchNo: "", mfgDate: "", expiryDate: "", qty: "" }],
    }));

  const editBatchRemove = (idx) =>
    setEditForm((f) => ({ ...f, batches: f.batches.filter((_, i) => i !== idx) }));

  /* ══ SAVE: EDIT ══ */
  const saveEdit = async () => {
    const hasBatches = editForm.batches.length > 0 && editForm.batches.some((b) => b.qty);

    if (!hasBatches && editForm.stock === "")
      return alert("Stock ya batch qty required hai");

    setSaving(true);
    try {
      const payload = hasBatches
        ? {
            minStock: Number(editForm.minStock) || 0,
            batches:  editForm.batches
              .filter((b) => b.qty)
              .map((b) => ({
                batchNo:    b.batchNo    || "",
                mfgDate:    b.mfgDate    || undefined,
                expiryDate: b.expiryDate || undefined,
                qty:        Number(b.qty),
              })),
          }
        : {
            stock:    Number(editForm.stock),
            minStock: Number(editForm.minStock) || 0,
          };

      await axios.put(`${API}/${editingInvId}`, payload);
      closeForm();
      await loadInventory();
    } catch (e) { alert(e.response?.data?.message || "Update failed"); }
    finally { setSaving(false); }
  };

  /* ══ SAVE: ADD ══ */
  const saveAdd = async () => {
    const valid = addRows.filter((r) => r.product && (r.qty || r.stock) !== "");
    if (!valid.length) return alert("Kam se kam ek row properly fill karo");

    setSaving(true);
    try {
      const payload = {
        items: valid.map((r) => {
          const hasBatch = r.batchNo || r.mfgDate || r.expiryDate || r.qty;
          return {
            product:  r.product,
            minStock: Number(r.minStock) || 0,
            note:     batchName.trim() || "Opening stock",
            // Batch mode
            ...(hasBatch
              ? {
                  batches: [{
                    batchNo:    r.batchNo    || "",
                    mfgDate:    r.mfgDate    || undefined,
                    expiryDate: r.expiryDate || undefined,
                    qty:        Number(r.qty) || Number(r.stock) || 0,
                  }],
                }
              : {
                  // Legacy mode — sirf stock
                  stock: Number(r.stock) || 0,
                }),
          };
        }),
      };

      await axios.post(`${API}/batch`, payload);
      closeForm();
      await loadInventory();
    } catch (e) {
      alert(e.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  /* ══ ADD ROWS helpers ══ */
  const updateAddRow = (id, k, v) => setAddRows((r) => r.map((row) => row.id === id ? { ...row, [k]: v } : row));
  const addOneRow    = ()          => setAddRows((r) => [...r, newRow()]);
  const removeAddRow = (id)        => setAddRows((r) => r.length > 1 ? r.filter((row) => row.id !== id) : r);

  /* ══ DELETE ══ */
  const deleteInv = (item) => {
    askConfirm(
      `"${item.product?.name}" ko inventory se delete karein?`,
      async () => {
        closeConfirm();
        try { await axios.delete(`${API}/${item._id}`); await loadInventory(); }
        catch (e) { alert(e.response?.data?.message || "Delete failed"); }
      }
    );
  };

  /* ══ RENDER ══ */
  return (
    <div className="p-3 md:p-5 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
      <Confirm {...confirm} onCancel={closeConfirm} />

      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[#1C2434] tracking-tight flex items-center gap-2">
            <Layers size={16} className="text-[#3C50E0]" /> Inventory Manager
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {invLoading ? "Loading..." : `${inventory.length} products tracked`}
          </p>
        </div>
        <button onClick={loadInventory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-all active:scale-95">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SearchBar value={invSearch} onChange={setInvSearch} placeholder="Search product..." />

        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
          {[
            { k: "ALL",          label: "All" },
            { k: "OK",           label: "OK"  },
            { k: "LOW",          label: "Low" },
            { k: "OUT_OF_STOCK", label: "Out" },
          ].map(({ k, label }) => (
            <button key={k} onClick={() => setInvStatus(k)}
              className={cls(
                "px-3 py-2 text-[10px] font-bold transition-all",
                invStatus === k
                  ? k === "OK"           ? "bg-emerald-500 text-white"
                  : k === "LOW"          ? "bg-orange-500 text-white"
                  : k === "OUT_OF_STOCK" ? "bg-red-500 text-white"
                  : "bg-[#3C50E0] text-white"
                  : "text-slate-500 hover:bg-slate-50"
              )}>{label}</button>
          ))}
        </div>

        <button onClick={formMode === "add" ? closeForm : openAddForm}
          className={cls(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex-shrink-0",
            formMode === "add"
              ? "bg-slate-100 text-slate-600 border border-slate-200"
              : "bg-[#3C50E0] text-white shadow-sm"
          )}>
          {formMode === "add" ? <X size={13} /> : <Plus size={13} />}
          {formMode === "add" ? "Close" : "Add Stock"}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          ADD FORM — batch rows
      ══════════════════════════════════════════════════ */}
      {formMode === "add" && (
        <div className="bg-white rounded-xl border border-[#3C50E0]/20 shadow-sm mb-3 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-[#3C50E0]/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-black text-[#3C50E0] uppercase tracking-widest">Add Stock</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Ek ya multiple products ek saath add karo</p>
              </div>
              <button onClick={addOneRow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3C50E0]/10 text-[#3C50E0] text-[11px] font-bold hover:bg-[#3C50E0]/20 transition-colors">
                <Plus size={11} /> Row Add Karo
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Note / Batch Name</label>
              <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Morning Delivery, Supplier A, Weekly Restock..."
                className="flex-1 bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#3C50E0] focus:ring-1 focus:ring-[#3C50E0]/20 transition-all placeholder:text-slate-300" />
            </div>
          </div>

          {/* Rows table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-slate-100">
                  <TH>#</TH>
                  <TH>Product *</TH>
                  <TH>Batch No</TH>
                  <TH>Mfg Date</TH>
                  <TH>Expiry Date</TH>
                  <TH>Qty *</TH>
                  <TH>Min Stock</TH>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {addRows.map((row, idx) => {
                  const otherSelected = addRows.filter((r) => r.id !== row.id).map((r) => String(r.product));
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 text-[11px] text-slate-300 font-mono w-8">{idx + 1}</td>

                      {/* Product */}
                      <td className="px-3 py-2 min-w-[190px]">
                        <ProductSelect
                          value={row.product}
                          onChange={(v) => updateAddRow(row.id, "product", v)}
                          products={products}
                          loading={prodLoading}
                          alreadyTracked={trackedIds}
                          otherSelected={otherSelected}
                        />
                      </td>

                      {/* Batch No */}
                      <td className="px-3 py-2">
                        <input type="text" value={row.batchNo} placeholder="e.g. LOT-001"
                          onChange={(e) => updateAddRow(row.id, "batchNo", e.target.value)}
                          className={cls(inputCls, "w-28")} />
                      </td>

                      {/* Mfg Date */}
                      <td className="px-3 py-2">
                        <input type="date" value={row.mfgDate}
                          onChange={(e) => updateAddRow(row.id, "mfgDate", e.target.value)}
                          className={cls(inputCls, "w-36")} />
                      </td>

                      {/* Expiry Date */}
                      <td className="px-3 py-2">
                        <input type="date" value={row.expiryDate}
                          onChange={(e) => updateAddRow(row.id, "expiryDate", e.target.value)}
                          className={cls(inputCls, "w-36")} />
                      </td>

                      {/* Qty */}
                      <td className="px-3 py-2">
                        <input type="number" min="0" value={row.qty} placeholder="0"
                          onChange={(e) => updateAddRow(row.id, "qty", e.target.value)}
                          className={cls(inputCls, "w-20")} />
                      </td>

                      {/* Min Stock */}
                      <td className="px-3 py-2">
                        <input type="number" min="0" value={row.minStock} placeholder="0"
                          onChange={(e) => updateAddRow(row.id, "minStock", e.target.value)}
                          className={cls(inputCls, "w-20")} />
                      </td>

                      {/* Remove */}
                      <td className="px-3 py-2">
                        <button onClick={() => removeAddRow(row.id)} disabled={addRows.length === 1}
                          className="text-slate-300 hover:text-red-400 disabled:opacity-20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              <span className="font-bold text-slate-600">
                {addRows.filter((r) => r.product && (r.qty || r.stock) !== "").length}
              </span> valid / <span className="font-bold text-slate-600">{addRows.length}</span> rows
            </span>
            <div className="flex gap-2">
              <button onClick={closeForm}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-white">
                Cancel
              </button>
              <button onClick={saveAdd}
                disabled={saving || addRows.filter((r) => r.product && (r.qty || r.stock) !== "").length === 0}
                className="px-4 py-1.5 rounded-lg bg-[#3C50E0] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 active:scale-95 transition-all">
                {saving
                  ? "Saving..."
                  : `Save ${addRows.filter((r) => r.product && (r.qty || r.stock) !== "").length} Item(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          EDIT FORM — single item with batch management
      ══════════════════════════════════════════════════ */}
      {formMode === "edit" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-3">
          <p className="text-[10px] font-black text-[#3C50E0] uppercase tracking-widest mb-1">Edit Stock</p>
          <p className="text-xs font-semibold text-slate-500 mb-3">
            {inventory.find((i) => i._id === editingInvId)?.product?.name}
          </p>

          {/* Min Stock — always show */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Field label="Min Stock (Alert)">
              <input type="number" min="0" placeholder="0" value={editForm.minStock}
                onChange={(e) => setEditForm((f) => ({ ...f, minStock: e.target.value }))}
                className={inputCls} />
            </Field>
            {/* Agar koi batch nahi — direct stock edit karo */}
            {editForm.batches.length === 0 && (
              <Field label="Current Qty *">
                <input type="number" min="0" placeholder="0" value={editForm.stock}
                  onChange={(e) => setEditForm((f) => ({ ...f, stock: e.target.value }))}
                  className={inputCls} />
              </Field>
            )}
          </div>

          {/* Batch rows in edit mode */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Batches</p>
              <button onClick={editBatchAdd}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3C50E0]/10 text-[#3C50E0] text-[11px] font-bold hover:bg-[#3C50E0]/20">
                <Plus size={10} /> Batch Add
              </button>
            </div>

            {editForm.batches.length === 0 ? (
              <p className="text-[11px] text-slate-300 italic">Koi batch nahi — direct qty upar edit karo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-[#F7F9FC] border-b border-slate-100">
                      <TH>#</TH>
                      <TH>Batch No</TH>
                      <TH>Mfg Date</TH>
                      <TH>Expiry Date</TH>
                      <TH>Qty</TH>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {editForm.batches.map((b, idx) => (
                      <tr key={b.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2 text-[11px] text-slate-300 font-mono">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input type="text" value={b.batchNo} placeholder="e.g. LOT-001"
                            onChange={(e) => editBatchSet(idx, "batchNo", e.target.value)}
                            className={cls(inputCls, "w-28")} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="date" value={b.mfgDate}
                            onChange={(e) => editBatchSet(idx, "mfgDate", e.target.value)}
                            className={cls(inputCls, "w-36")} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="date" value={b.expiryDate}
                            onChange={(e) => editBatchSet(idx, "expiryDate", e.target.value)}
                            className={cls(inputCls, "w-36")} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min="0" value={b.qty} placeholder="0"
                            onChange={(e) => editBatchSet(idx, "qty", e.target.value)}
                            className={cls(inputCls, "w-20")} />
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => editBatchRemove(idx)}
                            className="text-slate-300 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-100">
                      <td colSpan={4} className="px-3 py-2 text-[10px] text-slate-400 font-semibold text-right">Total Qty:</td>
                      <td className="px-3 py-2 text-[12px] font-extrabold text-[#3C50E0]">
                        {editForm.batches.reduce((s, b) => s + (Number(b.qty) || 0), 0)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={closeForm}
              className="px-3 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={saveEdit} disabled={saving}
              className="px-4 py-2 bg-[#3C50E0] text-white font-bold text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all">
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          INVENTORY TABLE
      ══════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">{filteredInv.length} products</span>
          <button onClick={() => exportCSV(
            [
              ["Product", "Total Stock", "Min Stock", "Status", "Nearest Expiry", "Batch No", "Mfg Date", "Batch Expiry", "Batch Qty"],
              ...filteredInv.flatMap((i) => {
                if (!i.batches || i.batches.length === 0) {
                  return [[
                    i.product?.name, i.stock, i.minStock,
                    i.stock === 0 ? "OUT" : i.stock <= i.minStock ? "LOW" : "OK",
                    fmt(i.expiryDate), "", "", "", "",
                  ]];
                }
                return i.batches.map((b) => [
                  i.product?.name, i.stock, i.minStock,
                  i.stock === 0 ? "OUT" : i.stock <= i.minStock ? "LOW" : "OK",
                  fmt(i.expiryDate),
                  b.batchNo, fmt(b.mfgDate), fmt(b.expiryDate), b.qty,
                ]);
              }),
            ],
            "inventory.csv"
          )} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600">
            <Download size={11} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-slate-100">
                <TH>Product</TH>
                <TH center>Total Stock</TH>
                <TH center>Min</TH>
                <TH>Batches</TH>
                <TH>Status</TH>
                <TH center>Actions</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invLoading
                ? <TableSkeleton cols={6} />
                : filteredInv.length === 0
                  ? <Empty message={invSearch ? "Koi result nahi" : "Inventory empty hai"} />
                  : filteredInv.map((item) => {
                    // nearest expiry check for row highlight
                    const daysLeft = item.expiryDate
                      ? Math.ceil((new Date(item.expiryDate) - Date.now()) / 86400000)
                      : null;
                    const expSoon  = daysLeft !== null && daysLeft <= 30;
                    const expired  = daysLeft !== null && daysLeft < 0;

                    return (
                      <tr key={item._id} className={cls(
                        "hover:bg-slate-50/60 transition-colors",
                        expired              && "bg-red-50/40",
                        !expired && expSoon  && "bg-orange-50/30",
                        formMode === "edit" && editingInvId === item._id && "ring-1 ring-inset ring-[#3C50E0]/30"
                      )}>
                        {/* Product name */}
                        <td className="px-3 py-3 font-semibold text-[13px] text-[#1C2434]">
                          {item.product?.name || "—"}
                        </td>

                        {/* Total stock */}
                        <td className="px-3 py-3 text-center">
                          <span className={cls("text-[14px] font-extrabold",
                            item.stock === 0             ? "text-red-500"
                            : item.stock <= item.minStock ? "text-orange-500"
                            : "text-[#1C2434]"
                          )}>
                            {item.stock}
                          </span>
                        </td>

                        {/* Min stock */}
                        <td className="px-3 py-3 text-center text-[12px] text-slate-400">{item.minStock}</td>

                        {/* Batches */}
                        <td className="px-3 py-3 max-w-[260px]">
                          <BatchPills batches={item.batches} />
                        </td>

                        {/* Status badge */}
                        <td className="px-3 py-3">
                          <StockBadge stock={item.stock} minStock={item.minStock} />
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                formMode === "edit" && editingInvId === item._id
                                  ? closeForm()
                                  : openEditForm(item)
                              }
                              className={cls(
                                "p-1.5 rounded-lg transition-colors",
                                formMode === "edit" && editingInvId === item._id
                                  ? "text-[#3C50E0] bg-blue-50"
                                  : "text-slate-400 hover:text-[#3C50E0] hover:bg-blue-50"
                              )}>
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => deleteInv(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}