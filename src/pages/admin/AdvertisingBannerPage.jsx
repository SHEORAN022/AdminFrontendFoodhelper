// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";

// const API = "https://grocerrybackend.onrender.com/api/advertising-banner";
// const CAT_API = "https://grocerrybackend.onrender.com/api/categories";
// const PROD_API = "https://grocerrybackend.onrender.com/api/public/products?limit=90000";

// /* ─── helpers ─── */
// const formatDate = (d) =>
//   new Date(d).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

// const selectStyles = {
//   control: (base, state) => ({
//     ...base,
//     minHeight: 42,
//     borderRadius: 10,
//     borderColor: state.isFocused ? "#111827" : "#e5e7eb",
//     boxShadow: state.isFocused ? "0 0 0 1px #111827" : "none",
//     "&:hover": { borderColor: "#9ca3af" },
//     fontSize: 14,
//   }),
//   menu: (base) => ({ ...base, zIndex: 9999, borderRadius: 10, fontSize: 14 }),
//   menuList: (base) => ({ ...base, maxHeight: 260 }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected ? "#111827" : state.isFocused ? "#f3f4f6" : "white",
//     color: state.isSelected ? "white" : "#111827",
//   }),
// };

// /* ─── Toast ─── */
// function Toast({ toast }) {
//   if (!toast.show) return null;
//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 24,
//         right: 24,
//         zIndex: 9999,
//         display: "flex",
//         alignItems: "center",
//         gap: 8,
//         padding: "12px 18px",
//         borderRadius: 12,
//         fontSize: 14,
//         fontWeight: 500,
//         color: "white",
//         background: toast.ok ? "#111827" : "#ef4444",
//         boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
//         animation: "slideUp 0.22s ease",
//       }}
//     >
//       <span>{toast.ok ? "✓" : "✕"}</span>
//       {toast.msg}
//     </div>
//   );
// }

// /* ─── Stat Card ─── */
// function StatCard({ label, value, color }) {
//   return (
//     <div
//       style={{
//         flex: 1,
//         background: "white",
//         border: "1px solid #f0f0f0",
//         borderRadius: 14,
//         padding: "18px 20px",
//         minWidth: 0,
//       }}
//     >
//       <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
//         {label}
//       </p>
//       <p style={{ fontSize: 26, fontWeight: 600, color: color || "#111827", margin: 0 }}>{value}</p>
//     </div>
//   );
// }

// /* ─── Main Component ─── */
// export default function AdvertisingBannerPage() {
//   const [banners, setBanners] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editBanner, setEditBanner] = useState(null);
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [titleVal, setTitleVal] = useState("");
//   const [bannerType, setBannerType] = useState("category");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [deleteId, setDeleteId] = useState(null);
//   const [toast, setToast] = useState({ show: false, msg: "", ok: true });
//   const [dragOver, setDragOver] = useState(false);
//   const fileRef = useRef();

//   useEffect(() => {
//     fetchBanners();
//     fetchCategories();
//     fetchProducts();
//   }, []);

//   /* ── Toast ── */
//   const showToast = (msg, ok = true) => {
//     setToast({ show: true, msg, ok });
//     setTimeout(() => setToast({ show: false, msg: "", ok: true }), 3000);
//   };

//   /* ── Fetch ── */
//   const fetchBanners = async () => {
//     try {
//       setFetching(true);
//       const res = await axios.get(API);
//       setBanners(res.data.data || []);
//     } catch {
//       showToast("Could not load banners", false);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(CAT_API);
//       setCategories(res.data.categories || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(PROD_API);
//       const d = res.data;
//       let all = Array.isArray(d) ? d : d.products || d.data || d.allProducts || [];
//       const unique = all.filter(
//         (p, i, s) => i === s.findIndex((q) => (q._id || q.id) === (p._id || p.id))
//       );
//       setProducts(unique);
//     } catch (err) {
//       console.log("PRODUCT FETCH ERROR:", err);
//     }
//   };

//   /* ── File ── */
//   const handleFile = (f) => {
//     if (!f || !f.type.startsWith("image/")) return;
//     setFile(f);
//     setPreview(URL.createObjectURL(f));
//   };

//   const clearFile = () => {
//     setFile(null);
//     setPreview(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   /* ── Modal helpers ── */
//   const resetForm = () => {
//     setEditBanner(null);
//     clearFile();
//     setTitleVal("");
//     setBannerType("category");
//     setSelectedCategory("");
//     setSelectedProduct("");
//     setRedirectUrl("");
//   };

//   const openCreate = () => {
//     resetForm();
//     setModalOpen(true);
//   };

//   const openEdit = (banner) => {
//     setEditBanner(banner);
//     setFile(null);
//     setPreview(banner.image || null);
//     setTitleVal(banner.title || "");
//     setBannerType(banner.bannerType || "category");
//     setSelectedCategory(banner.bannerType === "category" ? banner.referenceId || "" : "");
//     setSelectedProduct(banner.bannerType === "product" ? banner.referenceId || "" : "");
//     setRedirectUrl(banner.redirectUrl || "");
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     resetForm();
//   };

//   /* ── Build FormData ── */
//   const buildFormData = () => {
//     const fd = new FormData();
//     if (file) fd.append("image", file);
//     fd.append("title", titleVal.trim());
//     fd.append("bannerType", bannerType);

//     if (bannerType === "category") {
//       const cat = categories.find((c) => c._id === selectedCategory);
//       fd.append("referenceId", selectedCategory);
//       fd.append("referenceName", cat?.name || cat?.title || "");
//     } else if (bannerType === "product") {
//       const prod = products.find((p) => (p._id || p.id) === selectedProduct);
//       fd.append("referenceId", selectedProduct);
//       fd.append("referenceName", prod?.name || prod?.productName || prod?.product_name || prod?.title || "");
//     } else if (bannerType === "url") {
//       fd.append("redirectUrl", redirectUrl);
//     }
//     return fd;
//   };

//   /* ── Create ── */
//   const handleCreate = async () => {
//     if (!file) return showToast("Please select an image", false);
//     if (!titleVal.trim()) return showToast("Title is required", false);

//     try {
//       setLoading(true);
//       const res = await axios.post(API, buildFormData(), {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.data.success) {
//         showToast("Banner created successfully!");
//         closeModal();
//         fetchBanners();
//       } else {
//         showToast(res.data.message || "Create failed", false);
//       }
//     } catch (err) {
//       console.log("CREATE ERROR:", err);
//       showToast("Create failed", false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Update ── */
//   const handleUpdate = async () => {
//     if (!editBanner) return;
//     if (!titleVal.trim()) return showToast("Title is required", false);

//     try {
//       setLoading(true);
//       const res = await axios.put(`${API}/${editBanner._id}`, buildFormData(), {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.data.success) {
//         showToast("Banner updated successfully!");
//         closeModal();
//         fetchBanners();
//       } else {
//         showToast(res.data.message || "Update failed", false);
//       }
//     } catch (err) {
//       console.log("UPDATE ERROR:", err);
//       showToast("Update failed", false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Delete ── */
//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     try {
//       await axios.delete(`${API}/${deleteId}`);
//       showToast("Banner deleted");
//       setDeleteId(null);
//       fetchBanners();
//     } catch {
//       showToast("Delete failed", false);
//     }
//   };

//   /* ── Toggle ── */
//   const toggleStatus = async (id) => {
//     try {
//       const res = await axios.put(`${API}/toggle/${id}`);
//       showToast(`Status updated: ${res.data.data?.status || "changed"}`);
//       fetchBanners();
//     } catch {
//       showToast("Toggle failed", false);
//     }
//   };

//   /* ── Category options ── */
//   const categoryOptions = categories.map((c) => ({
//     value: c._id,
//     label: c.name || c.title || "Unnamed Category",
//   }));

//   const productOptions = products.map((p) => ({
//     value: p._id || p.id,
//     label: p.name || p.productName || p.product_name || p.title || "Unnamed Product",
//   }));

//   /* ── Derived stats ── */
//   const activeCount = banners.filter((b) => b.status === "active").length;
//   const inactiveCount = banners.length - activeCount;

//   /* ────────────────── JSX ────────────────── */
//   return (
//     <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "32px 24px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
//         @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
//         @keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
//         .banner-row:hover { background: #fafafa !important; }
//         .action-btn { background:none; border:none; cursor:pointer; padding:7px 9px; border-radius:8px; color:#6b7280; font-size:15px; display:inline-flex; align-items:center; transition:all 0.15s; }
//         .action-btn:hover { background:#f3f4f6; color:#111827; }
//         .action-btn.danger:hover { background:#fef2f2; color:#ef4444; }
//         .upload-zone { border:2px dashed #e5e7eb; border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; }
//         .upload-zone:hover, .upload-zone.drag-over { border-color:#111827; background:#f9fafb; }
//         .form-input { width:100%; padding:10px 13px; border:1px solid #e5e7eb; border-radius:10px; font-size:14px; color:#111827; outline:none; transition:border-color 0.15s, box-shadow 0.15s; box-sizing:border-box; font-family:inherit; background:white; }
//         .form-input:focus { border-color:#111827; box-shadow:0 0 0 2px rgba(17,24,39,0.07); }
//         .form-label { display:block; font-size:12px; font-weight:500; color:#6b7280; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em; }
//         .btn-primary { background:#111827; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background 0.15s; font-family:inherit; }
//         .btn-primary:hover { background:#1f2937; }
//         .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
//         .btn-secondary { background:white; color:#374151; border:1px solid #e5e7eb; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; }
//         .btn-secondary:hover { background:#f9fafb; }
//         .btn-danger { background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; }
//         .btn-danger:hover { background:#dc2626; }
//         .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; animation:fadeIn 0.2s ease; }
//         .modal-box { background:white; border-radius:20px; width:100%; max-width:480px; padding:28px; animation:scaleIn 0.22s ease; max-height:90vh; overflow-y:auto; }
//         .status-badge { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:99px; font-size:12px; font-weight:500; cursor:pointer; border:none; font-family:inherit; }
//         .status-dot { width:6px; height:6px; border-radius:50%; display:inline-block; }
//         .type-pill { display:inline-block; padding:3px 10px; border-radius:99px; font-size:12px; font-weight:500; background:#f3f4f6; color:#4b5563; text-transform:capitalize; }
//         .scrollable-modal::-webkit-scrollbar { width:4px; }
//         .scrollable-modal::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }
//       `}</style>

//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>

//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
//           <div>
//             <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>Advertising Banners</h1>
//             <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4, margin: 0 }}>
//               {banners.length} banner{banners.length !== 1 ? "s" : ""} total
//             </p>
//           </div>
//           <button className="btn-primary" onClick={openCreate}>
//             <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Banner
//           </button>
//         </div>

//         {/* Stats */}
//         <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
//           <StatCard label="Total Banners" value={banners.length} />
//           <StatCard label="Active" value={activeCount} color="#16a34a" />
//           <StatCard label="Inactive" value={inactiveCount} color="#d97706" />
//         </div>

//         {/* Table */}
//         <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 14 }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
//                   {["Image", "Title", "Type", "Status", "Created", "Actions"].map((h) => (
//                     <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {fetching ? (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: 14 }}>
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
//                           <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//                         </svg>
//                         Loading banners...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : banners.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: "center", padding: "56px 0", color: "#9ca3af", fontSize: 14 }}>
//                       <div style={{ marginBottom: 8, fontSize: 32 }}>🖼️</div>
//                       No banners yet — click <strong style={{ color: "#111827" }}>Add Banner</strong> to create one
//                     </td>
//                   </tr>
//                 ) : (
//                   banners.map((b, i) => (
//                     <tr
//                       key={b._id}
//                       className="banner-row"
//                       style={{ borderBottom: i < banners.length - 1 ? "1px solid #f3f4f6" : "none", transition: "background 0.1s" }}
//                     >
//                       {/* Image */}
//                       <td style={{ padding: "14px 18px" }}>
//                         {b.image ? (
//                           <img
//                             src={b.image}
//                             alt={b.title}
//                             style={{ width: 72, height: 44, borderRadius: 8, objectFit: "cover", display: "block", background: "#f3f4f6" }}
//                             onError={(e) => { e.target.style.display = "none"; }}
//                           />
//                         ) : (
//                           <div style={{ width: 72, height: 44, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 18 }}>
//                             🖼
//                           </div>
//                         )}
//                       </td>

//                       {/* Title */}
//                       <td style={{ padding: "14px 18px", fontWeight: 500, color: "#111827" }}>
//                         {b.title || "—"}
//                       </td>

//                       {/* Type */}
//                       <td style={{ padding: "14px 18px" }}>
//                         <span className="type-pill">{b.bannerType || b.type || "—"}</span>
//                       </td>

//                       {/* Status */}
//                       <td style={{ padding: "14px 18px" }}>
//                         <button
//                           className="status-badge"
//                           onClick={() => toggleStatus(b._id)}
//                           title="Click to toggle status"
//                           style={
//                             b.status === "active"
//                               ? { background: "#f0fdf4", color: "#16a34a" }
//                               : { background: "#fffbeb", color: "#d97706" }
//                           }
//                         >
//                           <span
//                             className="status-dot"
//                             style={{ background: b.status === "active" ? "#16a34a" : "#d97706" }}
//                           />
//                           {b.status || "inactive"}
//                         </button>
//                       </td>

//                       {/* Date */}
//                       <td style={{ padding: "14px 18px", color: "#6b7280" }}>
//                         {formatDate(b.createdAt)}
//                       </td>

//                       {/* Actions */}
//                       <td style={{ padding: "14px 18px" }}>
//                         <div style={{ display: "flex", gap: 4 }}>
//                           <button className="action-btn" onClick={() => openEdit(b)} title="Edit">
//                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                               <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                               <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                             </svg>
//                           </button>
//                           <button className="action-btn danger" onClick={() => setDeleteId(b._id)} title="Delete">
//                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                               <polyline points="3 6 5 6 21 6" />
//                               <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//                               <path d="M10 11v6M14 11v6" />
//                               <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ── Create / Edit Modal ── */}
//       {modalOpen && (
//         <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
//           <div className="modal-box scrollable-modal">
//             {/* Modal Header */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//               <div>
//                 <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>
//                   {editBanner ? "Edit Banner" : "Create Banner"}
//                 </h2>
//                 <p style={{ fontSize: 13, color: "#9ca3af", margin: "3px 0 0" }}>
//                   {editBanner ? "Update banner details" : "Fill in the details to create a new banner"}
//                 </p>
//               </div>
//               <button
//                 onClick={closeModal}
//                 style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#6b7280", fontSize: 16, display: "flex", alignItems: "center" }}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Title */}
//             <div style={{ marginBottom: 18 }}>
//               <label className="form-label">Banner Title</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="e.g. Summer Sale Banner"
//                 value={titleVal}
//                 onChange={(e) => setTitleVal(e.target.value)}
//               />
//             </div>

//             {/* Type */}
//             <div style={{ marginBottom: 18 }}>
//               <label className="form-label">Banner Type</label>
//               <select
//                 className="form-input"
//                 value={bannerType}
//                 onChange={(e) => setBannerType(e.target.value)}
//               >
//                 <option value="category">Category</option>
//                 <option value="product">Product</option>
//                 <option value="url">Custom URL</option>
//               </select>
//             </div>

//             {/* Category */}
//             {bannerType === "category" && (
//               <div style={{ marginBottom: 18 }}>
//                 <label className="form-label">Select Category</label>
//                 <Select
//                   options={categoryOptions}
//                   value={categoryOptions.find((o) => o.value === selectedCategory) || null}
//                   onChange={(sel) => setSelectedCategory(sel ? sel.value : "")}
//                   placeholder="Search category..."
//                   isSearchable
//                   styles={selectStyles}
//                 />
//               </div>
//             )}

//             {/* Product */}
//             {bannerType === "product" && (
//               <div style={{ marginBottom: 18 }}>
//                 <label className="form-label">
//                   Select Product{" "}
//                   <span style={{ fontWeight: 400, color: "#d1d5db", textTransform: "none", letterSpacing: 0 }}>
//                     ({products.length} available)
//                   </span>
//                 </label>
//                 <Select
//                   options={productOptions}
//                   value={productOptions.find((o) => o.value === selectedProduct) || null}
//                   onChange={(sel) => setSelectedProduct(sel ? sel.value : "")}
//                   placeholder="Search product..."
//                   isSearchable
//                   styles={selectStyles}
//                 />
//               </div>
//             )}

//             {/* URL */}
//             {bannerType === "url" && (
//               <div style={{ marginBottom: 18 }}>
//                 <label className="form-label">Redirect URL</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   placeholder="https://example.com/offer"
//                   value={redirectUrl}
//                   onChange={(e) => setRedirectUrl(e.target.value)}
//                 />
//               </div>
//             )}

//             {/* Image Upload */}
//             <div style={{ marginBottom: 20 }}>
//               <label className="form-label">Banner Image {!editBanner && <span style={{ color: "#ef4444" }}>*</span>}</label>
//               <div
//                 className={`upload-zone${dragOver ? " drag-over" : ""}`}
//                 onClick={() => fileRef.current?.click()}
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="preview"
//                     style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 10, display: "block" }}
//                   />
//                 ) : (
//                   <>
//                     <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
//                     <p style={{ fontSize: 14, color: "#374151", fontWeight: 500, margin: 0 }}>
//                       Click to upload or drag & drop
//                     </p>
//                     <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, margin: "4px 0 0" }}>
//                       PNG, JPG, WEBP — max 10MB
//                     </p>
//                   </>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
//               {preview && (
//                 <button
//                   onClick={clearFile}
//                   style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#ef4444", padding: 0 }}
//                 >
//                   ✕ Remove image
//                 </button>
//               )}
//             </div>

//             {/* Divider */}
//             <div style={{ height: 1, background: "#f3f4f6", margin: "4px 0 20px" }} />

//             {/* Footer */}
//             <div style={{ display: "flex", gap: 10 }}>
//               <button className="btn-secondary" onClick={closeModal}>Cancel</button>
//               <button
//                 className="btn-primary"
//                 style={{ flex: 1, justifyContent: "center" }}
//                 onClick={editBanner ? handleUpdate : handleCreate}
//                 disabled={loading}
//               >
//                 {loading ? "Please wait..." : editBanner ? "Update Banner" : "Create Banner"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {deleteId && (
//         <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}>
//           <div className="modal-box" style={{ maxWidth: 380 }}>
//             <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>
//               🗑️
//             </div>
//             <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Delete this banner?</h3>
//             <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
//               This action is permanent and cannot be undone. The banner will be removed immediately.
//             </p>
//             <div style={{ display: "flex", gap: 10 }}>
//               <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
//               <button className="btn-danger" style={{ flex: 1 }} onClick={confirmDelete}>Delete Banner</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Toast toast={toast} />
//     </div>
//   );
// }

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Select from "react-select";

const API      = "https://grocerrybackend.onrender.com/api/advertising-banner";
const CAT_API  = "https://grocerrybackend.onrender.com/api/categories";
const PROD_API = "https://grocerrybackend.onrender.com/api/public/products?limit=90000";

/* ─── helpers ─── */
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    borderRadius: 10,
    borderColor: state.isFocused ? "#111827" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #111827" : "none",
    "&:hover": { borderColor: "#9ca3af" },
    fontSize: 14,
  }),
  menu:     (base) => ({ ...base, zIndex: 9999, borderRadius: 10, fontSize: 14 }),
  menuList: (base) => ({ ...base, maxHeight: 260 }),
  option:   (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#111827" : state.isFocused ? "#f3f4f6" : "white",
    color: state.isSelected ? "white" : "#111827",
  }),
};

/* ─── Toast ─── */
function Toast({ toast }) {
  if (!toast.show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 18px", borderRadius: 12, fontSize: 14, fontWeight: 500,
      color: "white",
      background: toast.ok ? "#111827" : "#ef4444",
      boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
      animation: "slideUp 0.22s ease",
    }}>
      <span>{toast.ok ? "✓" : "✕"}</span>
      {toast.msg}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, color }) {
  return (
    <div style={{ flex: 1, background: "white", border: "1px solid #f0f0f0", borderRadius: 14, padding: "18px 20px", minWidth: 0 }}>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 600, color: color || "#111827", margin: 0 }}>{value}</p>
    </div>
  );
}

/* ─── Main Component ─── */
export default function AdvertisingBannerPage() {
  const [banners,          setBanners]          = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [products,         setProducts]         = useState([]);
  const [modalOpen,        setModalOpen]        = useState(false);
  const [editBanner,       setEditBanner]       = useState(null);
  const [file,             setFile]             = useState(null);
  const [preview,          setPreview]          = useState(null);
  const [titleVal,         setTitleVal]         = useState("");
  const [bannerType,       setBannerType]       = useState("category");
  // FIX: store full {value,label} object so react-select renders correctly
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [redirectUrl,      setRedirectUrl]      = useState("");
  const [loading,          setLoading]          = useState(false);
  const [fetching,         setFetching]         = useState(true);
  const [deleteId,         setDeleteId]         = useState(null);
  const [toast,            setToast]            = useState({ show: false, msg: "", ok: true });
  const [dragOver,         setDragOver]         = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetchBanners();
    fetchCategories();
    fetchProducts();
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast({ show: false, msg: "", ok: true }), 3000);
  }, []);

  /* ── Fetch ── */
  const fetchBanners = async () => {
    try {
      setFetching(true);
      const res = await axios.get(API);
      setBanners(res.data.data || []);
    } catch {
      showToast("Could not load banners", false);
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CAT_API);
      setCategories(res.data.categories || []);
    } catch (err) { console.log(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PROD_API);
      const d = res.data;
      let all = Array.isArray(d) ? d : d.products || d.data || d.allProducts || [];
      const seen = new Set();
      setProducts(all.filter(p => {
        const id = p._id || p.id;
        if (seen.has(id)) return false;
        seen.add(id); return true;
      }));
    } catch (err) { console.log("PRODUCT FETCH ERROR:", err); }
  };

  /* ── File ── */
  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const clearFile = () => {
    setFile(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Modal helpers ── */
  const resetForm = () => {
    setEditBanner(null); clearFile();
    setTitleVal(""); setBannerType("category");
    setSelectedCategory(null); setSelectedProduct(null); setRedirectUrl("");
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };

  const openEdit = (banner) => {
    setEditBanner(banner);
    setFile(null);
    setPreview(banner.image || null);
    setTitleVal(banner.title || "");
    setBannerType(banner.bannerType || "category");

    // FIX: populate react-select with full option object
    setSelectedCategory(
      banner.bannerType === "category" && banner.referenceId
        ? { value: banner.referenceId, label: banner.referenceName || banner.referenceId }
        : null
    );
    setSelectedProduct(
      banner.bannerType === "product" && banner.referenceId
        ? { value: banner.referenceId, label: banner.referenceName || banner.referenceId }
        : null
    );
    setRedirectUrl(banner.redirectUrl || "");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); resetForm(); };

  /* ── Validate ── */
  const validate = (isCreate) => {
    if (!titleVal.trim())                               { showToast("Title is required", false); return false; }
    if (isCreate && !file)                              { showToast("Please select an image", false); return false; }
    if (bannerType === "category" && !selectedCategory) { showToast("Please select a category", false); return false; }
    if (bannerType === "product"  && !selectedProduct)  { showToast("Please select a product", false); return false; }
    if (bannerType === "url" && !redirectUrl.trim())    { showToast("Please enter a redirect URL", false); return false; }
    return true;
  };

  /* ── Build FormData ── */
  const buildFormData = () => {
    const fd = new FormData();
    if (file) fd.append("image", file);
    fd.append("title",      titleVal.trim());
    fd.append("bannerType", bannerType);
    if (bannerType === "category" && selectedCategory) {
      fd.append("referenceId",   selectedCategory.value);
      fd.append("referenceName", selectedCategory.label);
    } else if (bannerType === "product" && selectedProduct) {
      fd.append("referenceId",   selectedProduct.value);
      fd.append("referenceName", selectedProduct.label);
    } else if (bannerType === "url") {
      fd.append("redirectUrl", redirectUrl.trim());
    }
    return fd;
  };

  /* ── Create ── */
  const handleCreate = async () => {
    if (!validate(true)) return;
    try {
      setLoading(true);
      const res = await axios.post(API, buildFormData(), { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) {
        showToast("Banner created successfully!"); closeModal(); fetchBanners();
      } else { showToast(res.data.message || "Create failed", false); }
    } catch (err) { showToast(err.response?.data?.message || "Create failed", false); }
    finally { setLoading(false); }
  };

  /* ── Update ── */
  const handleUpdate = async () => {
    if (!editBanner || !validate(false)) return;
    try {
      setLoading(true);
      const res = await axios.put(`${API}/${editBanner._id}`, buildFormData(), { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) {
        showToast("Banner updated successfully!"); closeModal(); fetchBanners();
      } else { showToast(res.data.message || "Update failed", false); }
    } catch (err) { showToast(err.response?.data?.message || "Update failed", false); }
    finally { setLoading(false); }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      showToast("Banner deleted"); setDeleteId(null); fetchBanners();
    } catch { showToast("Delete failed", false); }
  };

  /* ── Toggle ── */
  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${API}/toggle/${id}`);
      showToast(`Status updated: ${res.data.data?.status || "changed"}`);
      fetchBanners();
    } catch { showToast("Toggle failed", false); }
  };

  /* ── Options ── */
  const categoryOptions = categories.map(c => ({ value: c._id, label: c.name || c.title || "Unnamed Category" }));
  const productOptions  = products.map(p  => ({ value: p._id || p.id, label: p.name || p.productName || p.product_name || p.title || "Unnamed Product" }));

  /* ── Stats ── */
  const activeCount   = banners.filter(b => b.status === "active").length;
  const inactiveCount = banners.length - activeCount;

  /* ════════════ JSX ════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "32px 24px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        .banner-row:hover { background: #fafafa !important; }
        .action-btn { background:none; border:none; cursor:pointer; padding:7px 9px; border-radius:8px; color:#6b7280; font-size:15px; display:inline-flex; align-items:center; transition:all 0.15s; }
        .action-btn:hover { background:#f3f4f6; color:#111827; }
        .action-btn.danger:hover { background:#fef2f2; color:#ef4444; }
        .upload-zone { border:2px dashed #e5e7eb; border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; }
        .upload-zone:hover, .upload-zone.drag-over { border-color:#111827; background:#f9fafb; }
        .form-input { width:100%; padding:10px 13px; border:1px solid #e5e7eb; border-radius:10px; font-size:14px; color:#111827; outline:none; transition:border-color 0.15s, box-shadow 0.15s; box-sizing:border-box; font-family:inherit; background:white; }
        .form-input:focus { border-color:#111827; box-shadow:0 0 0 2px rgba(17,24,39,0.07); }
        .form-label { display:block; font-size:12px; font-weight:500; color:#6b7280; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em; }
        .btn-primary { background:#111827; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background 0.15s; font-family:inherit; }
        .btn-primary:hover { background:#1f2937; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-secondary { background:white; color:#374151; border:1px solid #e5e7eb; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; }
        .btn-secondary:hover { background:#f9fafb; }
        .btn-danger { background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; }
        .btn-danger:hover { background:#dc2626; }
        .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; animation:fadeIn 0.2s ease; }
        .modal-box { background:white; border-radius:20px; width:100%; max-width:480px; padding:28px; animation:scaleIn 0.22s ease; max-height:90vh; overflow-y:auto; }
        .modal-box::-webkit-scrollbar { width:4px; }
        .modal-box::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }
        .status-badge { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:99px; font-size:12px; font-weight:500; cursor:pointer; border:none; font-family:inherit; }
        .status-dot { width:6px; height:6px; border-radius:50%; display:inline-block; }
        .type-pill { display:inline-block; padding:3px 10px; border-radius:99px; font-size:12px; font-weight:500; background:#f3f4f6; color:#4b5563; text-transform:capitalize; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>Advertising Banners</h1>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4, margin: 0 }}>
              {banners.length} banner{banners.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Banner
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Banners" value={banners.length} />
          <StatCard label="Active"        value={activeCount}   color="#16a34a" />
          <StatCard label="Inactive"      value={inactiveCount} color="#d97706" />
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                  {["Image", "Title", "Type", "Status", "Created", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Loading banners...
                      </div>
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "56px 0", color: "#9ca3af", fontSize: 14 }}>
                      <div style={{ marginBottom: 8, fontSize: 32 }}>🖼️</div>
                      No banners yet — click <strong style={{ color: "#111827" }}>Add Banner</strong> to create one
                    </td>
                  </tr>
                ) : banners.map((b, i) => (
                  <tr key={b._id} className="banner-row"
                    style={{ borderBottom: i < banners.length - 1 ? "1px solid #f3f4f6" : "none", transition: "background 0.1s" }}>
                    <td style={{ padding: "14px 18px" }}>
                      {b.image
                        ? <img src={b.image} alt={b.title} style={{ width: 72, height: 44, borderRadius: 8, objectFit: "cover", display: "block", background: "#f3f4f6" }} onError={e => { e.target.style.display = "none"; }} />
                        : <div style={{ width: 72, height: 44, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 18 }}>🖼</div>
                      }
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 500, color: "#111827" }}>{b.title || "—"}</td>
                    <td style={{ padding: "14px 18px" }}><span className="type-pill">{b.bannerType || b.type || "—"}</span></td>
                    <td style={{ padding: "14px 18px" }}>
                      <button className="status-badge" onClick={() => toggleStatus(b._id)} title="Click to toggle status"
                        style={b.status === "active" ? { background: "#f0fdf4", color: "#16a34a" } : { background: "#fffbeb", color: "#d97706" }}>
                        <span className="status-dot" style={{ background: b.status === "active" ? "#16a34a" : "#d97706" }} />
                        {b.status || "inactive"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 18px", color: "#6b7280" }}>{formatDate(b.createdAt)}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="action-btn" onClick={() => openEdit(b)} title="Edit">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="action-btn danger" onClick={() => setDeleteId(b._id)} title="Delete">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>
                  {editBanner ? "Edit Banner" : "Create Banner"}
                </h2>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "3px 0 0" }}>
                  {editBanner ? "Update banner details" : "Fill in the details to create a new banner"}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#6b7280", fontSize: 16, display: "flex", alignItems: "center" }}>✕</button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Banner Title</label>
              <input type="text" className="form-input" placeholder="e.g. Summer Sale Banner" value={titleVal} onChange={e => setTitleVal(e.target.value)} />
            </div>

            {/* Type */}
            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Banner Type</label>
              <select className="form-input" value={bannerType} onChange={e => { setBannerType(e.target.value); setSelectedCategory(null); setSelectedProduct(null); }}>
                <option value="category">Category</option>
                <option value="product">Product</option>
                <option value="url">Custom URL</option>
              </select>
            </div>

            {/* Category */}
            {bannerType === "category" && (
              <div style={{ marginBottom: 18 }}>
                <label className="form-label">Select Category</label>
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Search category..."
                  isSearchable
                  styles={selectStyles}
                  noOptionsMessage={() => categories.length === 0 ? "Loading…" : "No categories found"}
                />
              </div>
            )}

            {/* Product */}
            {bannerType === "product" && (
              <div style={{ marginBottom: 18 }}>
                <label className="form-label">
                  Select Product{" "}
                  <span style={{ fontWeight: 400, color: "#d1d5db", textTransform: "none", letterSpacing: 0 }}>({products.length} available)</span>
                </label>
                <Select
                  options={productOptions}
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  placeholder="Search product..."
                  isSearchable
                  styles={selectStyles}
                  noOptionsMessage={() => products.length === 0 ? "Loading…" : "No products found"}
                />
              </div>
            )}

            {/* URL */}
            {bannerType === "url" && (
              <div style={{ marginBottom: 18 }}>
                <label className="form-label">Redirect URL</label>
                <input type="text" className="form-input" placeholder="https://example.com/offer" value={redirectUrl} onChange={e => setRedirectUrl(e.target.value)} />
              </div>
            )}

            {/* Image Upload */}
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">
                Banner Image {!editBanner && <span style={{ color: "#ef4444" }}>*</span>}
                {editBanner && <span style={{ fontWeight: 400, color: "#d1d5db", textTransform: "none", letterSpacing: 0 }}> (leave blank to keep current)</span>}
              </label>
              <div
                className={`upload-zone${dragOver ? " drag-over" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              >
                {preview
                  ? <img src={preview} alt="preview" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 10, display: "block" }} />
                  : <>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                      <p style={{ fontSize: 14, color: "#374151", fontWeight: 500, margin: 0 }}>Click to upload or drag & drop</p>
                      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, margin: "4px 0 0" }}>PNG, JPG, WEBP — max 10MB</p>
                    </>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
              {preview && (
                <button onClick={clearFile} style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#ef4444", padding: 0 }}>
                  ✕ Remove image
                </button>
              )}
            </div>

            <div style={{ height: 1, background: "#f3f4f6", margin: "4px 0 20px" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={editBanner ? handleUpdate : handleCreate} disabled={loading}>
                {loading ? "Please wait..." : editBanner ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}>
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>🗑️</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Delete this banner?</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
              This action is permanent and cannot be undone. The banner will be removed immediately.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger"    style={{ flex: 1 }} onClick={confirmDelete}>Delete Banner</button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}