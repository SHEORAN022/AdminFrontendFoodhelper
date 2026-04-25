// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /* ================= CONFIG ================= */
// const API = "https://grocerrybackend.onrender.com/api/admin/categories";

// const api = axios.create();
// api.interceptors.request.use((req) => {
//   // 🔥 Apne admin localStorage key ke hisaab se change karo
//   const token =
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("token");
//   if (token) req.headers.Authorization = `Bearer ${token}`;
//   return req;
// });

// const STATUS_META = {
//   approved: { color: "#16a34a", bg: "#dcfce7", label: "✅ Approved" },
//   rejected: { color: "#dc2626", bg: "#fee2e2", label: "❌ Rejected" },
//   pending:  { color: "#d97706", bg: "#fef9c3", label: "⏳ Pending"  },
// };

// export default function AdminCategoryApproval() {
//   const [categories,    setCategories]    = useState([]);
//   const [loading,       setLoading]       = useState(false);
//   const [filter,        setFilter]        = useState("pending"); // default pending dikhao
//   const [actionId,      setActionId]      = useState(null);
//   const [expandedId,    setExpandedId]    = useState(null);

//   /* ---------- FETCH ---------- */
//   const loadCategories = async () => {
//     try {
//       setLoading(true);
//       const url = filter === "all" ? API : `${API}?status=${filter}`;
//       const res = await api.get(url);
//       setCategories(res.data.categories || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadCategories(); }, [filter]); // eslint-disable-line

//   /* ---------- APPROVE ---------- */
//   const handleApprove = async (id) => {
//     setActionId(id + "_a");
//     try {
//       const res = await api.put(`${API}/${id}/approve`);
//       toast.success(res.data.message || "Category Approved ✅");
//       loadCategories();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Approve failed");
//     } finally {
//       setActionId(null);
//     }
//   };

//   /* ---------- REJECT ---------- */
//   const handleReject = async (id) => {
//     if (!window.confirm("Are you sure you want to reject this category?")) return;
//     setActionId(id + "_r");
//     try {
//       const res = await api.put(`${API}/${id}/reject`);
//       toast.warn(res.data.message || "Category Rejected ❌");
//       loadCategories();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Reject failed");
//     } finally {
//       setActionId(null);
//     }
//   };

//   /* ---------- COUNT helpers ---------- */
//   const countOf = (status) =>
//     status === "all"
//       ? categories.length
//       : categories.filter((c) => c.status === status).length;

//   /* ============================== UI ============================== */
//   return (
//     <div style={styles.page}>
//       <ToastContainer position="top-right" autoClose={2500} />

//       {/* ── Header ── */}
//       <div style={styles.header}>
//         <div>
//           <h2 style={styles.title}>Vendor Category Approvals</h2>
//           <p style={styles.subtitle}>Review and approve vendor-submitted categories</p>
//         </div>
//         <button style={styles.refreshBtn} onClick={loadCategories}>
//           🔄 Refresh
//         </button>
//       </div>

//       {/* ── Filter Tabs ── */}
//       <div style={styles.tabWrap}>
//         {["pending", "all", "approved", "rejected"].map((f) => {
//           const icon = f === "pending" ? "⏳" : f === "approved" ? "✅" : f === "rejected" ? "❌" : "📋";
//           return (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               style={styles.tab(filter === f, f)}
//             >
//               {icon} {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Body ── */}
//       {loading ? (
//         <div style={styles.center}>
//           <div style={styles.spinner} />
//           <p style={{ color: "#6b7280", marginTop: 12 }}>Loading categories...</p>
//         </div>
//       ) : categories.length === 0 ? (
//         <div style={styles.empty}>
//           <div style={{ fontSize: 56 }}>📭</div>
//           <p style={{ marginTop: 10, fontWeight: 600 }}>
//             No <span style={{ color: "#2563eb" }}>{filter}</span> categories found
//           </p>
//           <p style={{ color: "#9ca3af", fontSize: 13 }}>
//             {filter === "pending"
//               ? "All caught up! No categories waiting for review."
//               : "Try switching the filter above."}
//           </p>
//         </div>
//       ) : (
//         <div style={styles.cardGrid}>
//           {categories.map((cat) => {
//             const meta   = STATUS_META[cat.status] || STATUS_META.pending;
//             const isOpen = expandedId === cat._id;
//             const aBusy  = actionId === cat._id + "_a";
//             const rBusy  = actionId === cat._id + "_r";
//             const anyBusy = aBusy || rBusy;

//             return (
//               <div key={cat._id} style={styles.card}>

//                 {/* ── Card Top ── */}
//                 <div style={styles.cardTop}>

//                   {/* Image */}
//                   <div style={styles.imgBox}>
//                     {cat.image
//                       ? <img src={cat.image} alt={cat.name} style={styles.img} />
//                       : <span style={{ fontSize: 28 }}>🖼️</span>
//                     }
//                   </div>

//                   {/* Info */}
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={styles.catName}>{cat.name}</div>
//                     <div style={styles.vendorInfo}>
//                       <span style={styles.vendorName}>{cat.vendor?.name || "—"}</span>
//                       <span style={styles.vendorEmail}>{cat.vendor?.email}</span>
//                     </div>
//                     <span style={{ ...styles.badge, color: meta.color, background: meta.bg }}>
//                       {meta.label}
//                     </span>
//                   </div>

//                   {/* Sub toggle */}
//                   <button
//                     style={styles.subToggle}
//                     onClick={() => setExpandedId(isOpen ? null : cat._id)}
//                   >
//                     {cat.subcategories?.length || 0} sub
//                     <span style={{ marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
//                   </button>
//                 </div>

//                 {/* ── Subcategories (expandable) ── */}
//                 {isOpen && (
//                   <div style={styles.subWrap}>
//                     {cat.subcategories?.length > 0 ? (
//                       cat.subcategories.map((s) => (
//                         <div key={s._id} style={styles.subRow}>
//                           {s.image
//                             ? <img src={s.image} alt={s.name} style={styles.subImg} />
//                             : <span style={{ fontSize: 16 }}>📁</span>
//                           }
//                           <span style={{ flex: 1, fontSize: 13 }}>{s.name}</span>
//                           <span style={{
//                             fontSize: 11,
//                             padding: "2px 8px",
//                             borderRadius: 10,
//                             background: s.active ? "#dcfce7" : "#fef9c3",
//                             color:      s.active ? "#16a34a" : "#d97706",
//                             fontWeight: 600,
//                           }}>
//                             {s.active ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       ))
//                     ) : (
//                       <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>No subcategories</p>
//                     )}
//                   </div>
//                 )}

//                 {/* ── Action Buttons (only for pending) ── */}
//                 {cat.status === "pending" && (
//                   <div style={styles.actionRow}>
//                     <button
//                       style={styles.approveBtn(anyBusy)}
//                       disabled={anyBusy}
//                       onClick={() => handleApprove(cat._id)}
//                     >
//                       {aBusy ? "Approving..." : "✅ Approve"}
//                     </button>
//                     <button
//                       style={styles.rejectBtn(anyBusy)}
//                       disabled={anyBusy}
//                       onClick={() => handleReject(cat._id)}
//                     >
//                       {rBusy ? "Rejecting..." : "❌ Reject"}
//                     </button>
//                   </div>
//                 )}

//                 {/* ── Already actioned ── */}
//                 {cat.status !== "pending" && (
//                   <div style={styles.actionRow}>
//                     <span style={{ color: "#9ca3af", fontSize: 12 }}>
//                       {cat.status === "approved"
//                         ? "✅ This category is approved"
//                         : "❌ This category was rejected"}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================== STYLES ============================== */
// const styles = {
//   page: {
//     padding: "28px 32px",
//     fontFamily: "'Inter', 'Segoe UI', sans-serif",
//     background: "#f8fafc",
//     minHeight: "100vh",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//   },
//   title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" },
//   subtitle: { margin: "4px 0 0", color: "#6b7280", fontSize: 14 },
//   refreshBtn: {
//     padding: "8px 18px",
//     borderRadius: 8,
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#374151",
//   },
//   tabWrap: {
//     display: "flex",
//     gap: 8,
//     marginBottom: 24,
//     flexWrap: "wrap",
//   },
//   tab: (active, f) => ({
//     padding: "8px 18px",
//     borderRadius: 20,
//     border: "1.5px solid",
//     borderColor: active
//       ? (f === "approved" ? "#16a34a" : f === "rejected" ? "#dc2626" : f === "pending" ? "#d97706" : "#2563eb")
//       : "#e5e7eb",
//     background: active
//       ? (f === "approved" ? "#dcfce7" : f === "rejected" ? "#fee2e2" : f === "pending" ? "#fef9c3" : "#eff6ff")
//       : "#fff",
//     color: active
//       ? (f === "approved" ? "#16a34a" : f === "rejected" ? "#dc2626" : f === "pending" ? "#d97706" : "#2563eb")
//       : "#6b7280",
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: active ? 700 : 500,
//     transition: "all 0.15s",
//   }),
//   center: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 },
//   spinner: {
//     width: 36,
//     height: 36,
//     border: "3px solid #e5e7eb",
//     borderTop: "3px solid #2563eb",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   empty: {
//     textAlign: "center",
//     padding: "80px 20px",
//     color: "#374151",
//   },
//   cardGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
//     gap: 16,
//   },
//   card: {
//     background: "#fff",
//     borderRadius: 12,
//     border: "1px solid #e5e7eb",
//     overflow: "hidden",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   },
//   cardTop: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 12,
//     padding: "16px 16px 12px",
//   },
//   imgBox: {
//     width: 52,
//     height: 52,
//     borderRadius: 10,
//     background: "#f3f4f6",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//     overflow: "hidden",
//   },
//   img: { width: "100%", height: "100%", objectFit: "cover" },
//   catName: { fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 },
//   vendorInfo: { display: "flex", flexDirection: "column", marginBottom: 6 },
//   vendorName: { fontSize: 12, fontWeight: 600, color: "#374151" },
//   vendorEmail: { fontSize: 11, color: "#9ca3af" },
//   badge: {
//     display: "inline-block",
//     fontSize: 11,
//     fontWeight: 700,
//     padding: "3px 10px",
//     borderRadius: 20,
//   },
//   subToggle: {
//     padding: "4px 10px",
//     border: "1px solid #e5e7eb",
//     borderRadius: 6,
//     background: "#f9fafb",
//     cursor: "pointer",
//     fontSize: 12,
//     color: "#374151",
//     flexShrink: 0,
//     whiteSpace: "nowrap",
//   },
//   subWrap: {
//     borderTop: "1px solid #f3f4f6",
//     padding: "10px 16px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 6,
//     background: "#fafafa",
//   },
//   subRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "6px 10px",
//     background: "#fff",
//     borderRadius: 8,
//     border: "1px solid #f3f4f6",
//   },
//   subImg: { width: 28, height: 28, objectFit: "cover", borderRadius: 4 },
//   actionRow: {
//     display: "flex",
//     gap: 10,
//     padding: "12px 16px",
//     borderTop: "1px solid #f3f4f6",
//     background: "#fafafa",
//     alignItems: "center",
//   },
//   approveBtn: (dis) => ({
//     flex: 1,
//     padding: "9px 0",
//     background: dis ? "#f0fdf4" : "#16a34a",
//     color: dis ? "#9ca3af" : "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: dis ? "not-allowed" : "pointer",
//     fontSize: 13,
//     fontWeight: 700,
//     transition: "background 0.15s",
//   }),
//   rejectBtn: (dis) => ({
//     flex: 1,
//     padding: "9px 0",
//     background: dis ? "#fef2f2" : "#dc2626",
//     color: dis ? "#9ca3af" : "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: dis ? "not-allowed" : "pointer",
//     fontSize: 13,
//     fontWeight: 700,
//     transition: "background 0.15s",
//   }),
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ============================================================
   CONFIG
   ============================================================ */
const API = "https://grocerrybackend.onrender.com/api/admin/categories";

const api = axios.create();
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/* ============================================================
   CONSTANTS
   ============================================================ */
const STATUS_META = {
  approved: { color: "#16a34a", bg: "#dcfce7", label: "✅ Approved" },
  rejected: { color: "#dc2626", bg: "#fee2e2", label: "❌ Rejected" },
  pending:  { color: "#d97706", bg: "#fef9c3", label: "⏳ Pending"  },
};

const FILTERS = [
  { key: "pending",  icon: "⏳", label: "Pending"  },
  { key: "approved", icon: "✅", label: "Approved" },
  { key: "rejected", icon: "❌", label: "Rejected" },
  { key: "all",      icon: "📋", label: "All"      },
];

/* ============================================================
   SMALL HELPERS
   ============================================================ */
function Thumb({ src, size = 48 }) {
  if (src)
    return <img src={src} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb" }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5 }}>
      🖼️
    </div>
  );
}

function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: m.bg, color: m.color, whiteSpace: "nowrap" }}>
      {m.label}
    </span>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function AdminCategoryApproval() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [filter,     setFilter]     = useState("pending");
  const [actionId,   setActionId]   = useState(null);
  const [expanded,   setExpanded]   = useState({}); // { [catId]: "sub" | "subsub_<subId>" | null }
  const [delId,      setDelId]      = useState(null);

  /* ── FETCH ── */
  const load = async () => {
    try {
      setLoading(true);
      const url = filter === "all" ? API : `${API}?status=${filter}`;
      const res = await api.get(url);
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  /* ── APPROVE ── */
  const approve = async (id) => {
    setActionId(id + "_a");
    try {
      const res = await api.put(`${API}/${id}/approve`);
      toast.success(res.data.message || "Approved ✅");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    } finally { setActionId(null); }
  };

  /* ── REJECT ── */
  const reject = async (id) => {
    if (!window.confirm("Reject this category?")) return;
    setActionId(id + "_r");
    try {
      const res = await api.put(`${API}/${id}/reject`);
      toast.warn(res.data.message || "Rejected ❌");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    } finally { setActionId(null); }
  };

  /* ── DELETE ── */
  const del = async (id) => {
    if (!window.confirm("Permanently delete this category?")) return;
    setDelId(id);
    try {
      await api.delete(`${API}/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally { setDelId(null); }
  };

  /* ── TOGGLE expand ── */
  const toggleExpand = (catId, key) => {
    setExpanded(prev => ({ ...prev, [catId]: prev[catId] === key ? null : key }));
  };

  /* ── COUNTS ── */
  const allCats = categories;
  const pendingCount  = allCats.filter(c => c.status === "pending").length;
  const approvedCount = allCats.filter(c => c.status === "approved").length;
  const rejectedCount = allCats.filter(c => c.status === "rejected").length;
  const countOf = (f) => f === "all" ? allCats.length : f === "pending" ? pendingCount : f === "approved" ? approvedCount : rejectedCount;

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div style={S.page}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Vendor Category Approvals</h2>
          <p style={S.sub}>Review and manage vendor-submitted categories</p>
        </div>
        <button style={S.refreshBtn} onClick={load}>🔄 Refresh</button>
      </div>

      {/* ── STATS BAR ── */}
      <div style={S.statsBar}>
        {[
          { label: "Pending",  count: pendingCount,  color: "#d97706", bg: "#fef9c3" },
          { label: "Approved", count: approvedCount, color: "#16a34a", bg: "#dcfce7" },
          { label: "Rejected", count: rejectedCount, color: "#dc2626", bg: "#fee2e2" },
          { label: "Total",    count: allCats.length, color: "#2563eb", bg: "#eff6ff" },
        ].map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── FILTER TABS ── */}
      <div style={S.tabWrap}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={S.tab(filter === f.key, f.key)}
          >
            {f.icon} {f.label}
            <span style={{ marginLeft: 6, background: "rgba(0,0,0,0.08)", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>
              {countOf(f.key)}
            </span>
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      {loading ? (
        <div style={S.center}>
          <div style={S.spinner} />
          <p style={{ color: "#6b7280", marginTop: 14 }}>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 60 }}>📭</div>
          <p style={{ marginTop: 12, fontWeight: 700, fontSize: 16 }}>
            No <span style={{ color: "#2563eb" }}>{filter}</span> categories
          </p>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>
            {filter === "pending" ? "All caught up! No categories waiting for review." : "Try switching the filter above."}
          </p>
        </div>
      ) : (
        <div style={S.grid}>
          {categories.map((cat) => {
            const meta   = STATUS_META[cat.status] || STATUS_META.pending;
            const aBusy  = actionId === cat._id + "_a";
            const rBusy  = actionId === cat._id + "_r";
            const busy   = aBusy || rBusy;
            const dBusy  = delId === cat._id;
            const subList   = cat.subcategories || [];
            const totalSSub = subList.reduce((acc, s) => acc + (s.subSubCategories?.length || 0), 0);
            const totalProd = subList.reduce((acc, s) =>
              acc + (s.subSubCategories || []).reduce((a2, ss) => a2 + (ss.products?.length || 0), 0), 0
            );

            return (
              <div key={cat._id} style={S.card}>

                {/* ── Card Top ── */}
                <div style={S.cardTop}>
                  <Thumb src={cat.image} size={52} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.catName}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginBottom: 2 }}>
                      {cat.vendor?.name || "Unknown Vendor"}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>{cat.vendor?.email}</div>
                    <Badge status={cat.status} />
                  </div>
                </div>

                {/* ── Stats Row ── */}
                <div style={S.statsRow}>
                  {[
                    { icon: "📂", count: subList.length,  label: "Subcategories" },
                    { icon: "📁", count: totalSSub,        label: "Sub-Subs" },
                    { icon: "🛍️", count: totalProd,       label: "Products" },
                  ].map(st => (
                    <div key={st.label} style={S.statPill}>
                      <span>{st.icon}</span>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{st.count}</span>
                      <span style={{ color: "#94a3b8", fontSize: 10 }}>{st.label}</span>
                    </div>
                  ))}
                </div>

                {/* ── Subcategories Expand ── */}
                {subList.length > 0 && (
                  <div style={S.expandSection}>
                    <button
                      style={S.expandBtn(expanded[cat._id] === "subs")}
                      onClick={() => toggleExpand(cat._id, "subs")}
                    >
                      📂 Subcategories ({subList.length})
                      <span style={{ marginLeft: "auto" }}>{expanded[cat._id] === "subs" ? "▲" : "▼"}</span>
                    </button>

                    {expanded[cat._id] === "subs" && (
                      <div style={S.subList}>
                        {subList.map((sub) => (
                          <div key={sub._id} style={{ marginBottom: 6 }}>
                            {/* Sub row */}
                            <div style={S.subRow}>
                              {sub.image
                                ? <img src={sub.image} alt="" style={{ width: 26, height: 26, borderRadius: 5, objectFit: "cover" }} />
                                : <span>📁</span>
                              }
                              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{sub.name}</span>
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>{sub.subSubCategories?.length || 0} sub-subs</span>
                              <span style={S.activePill(sub.active)}>{sub.active ? "Active" : "Inactive"}</span>

                              {/* Toggle sub-subcategories */}
                              {(sub.subSubCategories?.length > 0) && (
                                <button
                                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", marginLeft: 4 }}
                                  onClick={() => toggleExpand(cat._id, `ss_${sub._id}`)}
                                >
                                  {expanded[cat._id] === `ss_${sub._id}` ? "▲" : "▼"}
                                </button>
                              )}
                            </div>

                            {/* Sub-subcategories */}
                            {expanded[cat._id] === `ss_${sub._id}` && (
                              <div style={{ paddingLeft: 28, marginTop: 4 }}>
                                {(sub.subSubCategories || []).map((ss) => (
                                  <div key={ss._id} style={{ ...S.subRow, background: "#f8fafc", marginBottom: 4 }}>
                                    {ss.image
                                      ? <img src={ss.image} alt="" style={{ width: 22, height: 22, borderRadius: 4, objectFit: "cover" }} />
                                      : <span style={{ fontSize: 14 }}>📦</span>
                                    }
                                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{ss.name}</span>
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{ss.products?.length || 0} products</span>
                                    <span style={S.activePill(ss.active)}>{ss.active ? "Active" : "Inactive"}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Action Buttons ── */}
                <div style={S.actionRow}>
                  {cat.status === "pending" ? (
                    <>
                      <button style={S.approveBtn(busy)} disabled={busy} onClick={() => approve(cat._id)}>
                        {aBusy ? "Approving..." : "✅ Approve"}
                      </button>
                      <button style={S.rejectBtn(busy)} disabled={busy} onClick={() => reject(cat._id)}>
                        {rBusy ? "Rejecting..." : "❌ Reject"}
                      </button>
                    </>
                  ) : (
                    <>
                      {cat.status === "rejected" && (
                        <button style={{ ...S.approveBtn(busy), flex: 1 }} disabled={busy} onClick={() => approve(cat._id)}>
                          {aBusy ? "Approving..." : "✅ Approve Now"}
                        </button>
                      )}
                      {cat.status === "approved" && (
                        <button style={{ ...S.rejectBtn(busy), flex: 1 }} disabled={busy} onClick={() => reject(cat._id)}>
                          {rBusy ? "Rejecting..." : "❌ Revoke"}
                        </button>
                      )}
                      <button
                        style={{ flex: 1, padding: "9px 0", background: dBusy ? "#f3f4f6" : "#fff", color: dBusy ? "#9ca3af" : "#dc2626", border: "1.5px solid #fecaca", borderRadius: 8, cursor: dBusy ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }}
                        disabled={dBusy}
                        onClick={() => del(cat._id)}
                      >
                        {dBusy ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </>
                  )}
                </div>

                {/* ── Timestamp ── */}
                <div style={{ padding: "6px 16px 10px", fontSize: 11, color: "#cbd5e1", textAlign: "right" }}>
                  Added: {new Date(cat.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>

              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const S = {
  page: { padding: "28px 32px", fontFamily: "'DM Sans','Inter','Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" },
  sub: { margin: "4px 0 0", color: "#6b7280", fontSize: 14 },
  refreshBtn: { padding: "8px 18px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" },

  statsBar: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 10px", borderRadius: 12, border: "1px solid #e5e7eb" },

  tabWrap: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  tab: (active, f) => {
    const clr = f === "approved" ? "#16a34a" : f === "rejected" ? "#dc2626" : f === "pending" ? "#d97706" : "#2563eb";
    const bgClr = f === "approved" ? "#dcfce7" : f === "rejected" ? "#fee2e2" : f === "pending" ? "#fef9c3" : "#eff6ff";
    return {
      padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${active ? clr : "#e5e7eb"}`,
      background: active ? bgClr : "#fff", color: active ? clr : "#6b7280",
      cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, transition: "all 0.15s",
    };
  },

  center: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 },
  spinner: { width: 36, height: 36, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  empty: { textAlign: "center", padding: "80px 20px", color: "#374151" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 },

  card: { background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  cardTop: { display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 18px 12px" },
  catName: { fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 3 },

  statsRow: { display: "flex", gap: 0, borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" },
  statPill: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "8px 4px", fontSize: 12, borderRight: "1px solid #f1f5f9" },

  expandSection: { padding: "10px 14px" },
  expandBtn: (active) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
    background: active ? "#eff6ff" : "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 600, color: active ? "#2563eb" : "#374151",
  }),
  subList: { marginTop: 8 },
  subRow: { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#fff", borderRadius: 8, border: "1px solid #f3f4f6", marginBottom: 4 },
  activePill: (active) => ({
    fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
    background: active ? "#dcfce7" : "#fef9c3", color: active ? "#16a34a" : "#d97706",
  }),

  actionRow: { display: "flex", gap: 10, padding: "12px 16px", borderTop: "1px solid #f1f5f9", marginTop: "auto" },
  approveBtn: (dis) => ({ flex: 1, padding: "9px 0", background: dis ? "#f0fdf4" : "#16a34a", color: dis ? "#9ca3af" : "#fff", border: "none", borderRadius: 8, cursor: dis ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }),
  rejectBtn: (dis) => ({ flex: 1, padding: "9px 0", background: dis ? "#fef2f2" : "#dc2626", color: dis ? "#9ca3af" : "#fff", border: "none", borderRadius: 8, cursor: dis ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }),
};