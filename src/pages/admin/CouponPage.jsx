// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://grocerrybackend.onrender.com/api/coupons";

// const AdminCouponPage = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [form, setForm] = useState({
//     headline: "",
//     couponCode: "",
//     discountType: "percentage",
//     discountValue: "",
//     minOrderValue: "",
//     maxDiscount: "",
//     expiryDate: "",
//   });

//   /* ================= FETCH (ADMIN ALL) ================= */
//   const fetchCoupons = async () => {
//     try {
//       const res = await axios.get(`${API}/admin`); // 🔥 FIX
//       if (res.data.success) setCoupons(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   /* ================= CREATE / UPDATE ================= */
//   const handleSubmit = async () => {
//     if (!form.couponCode || !form.discountValue) {
//       return alert("Required fields missing");
//     }

//     try {
//       setLoading(true);

//       if (editId) {
//         await axios.put(`${API}/${editId}`, form); // UPDATE
//       } else {
//         await axios.post(`${API}/admin`, form); // CREATE
//       }

//       setEditId(null);
//       fetchCoupons();

//       setForm({
//         headline: "",
//         couponCode: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderValue: "",
//         maxDiscount: "",
//         expiryDate: "",
//       });

//     } catch (err) {
//       alert(err.response?.data?.message || "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this coupon?")) return;

//     await axios.delete(`${API}/${id}`);
//     fetchCoupons();
//   };

//   /* ================= TOGGLE ================= */
//   const handleToggle = async (id) => {
//     await axios.put(`${API}/toggle/${id}`);
//     fetchCoupons();
//   };

//   /* ================= EDIT ================= */
//   const handleEdit = (c) => {
//     setEditId(c._id);
//     setForm({
//       headline: c.headline || "",
//       couponCode: c.couponCode || "",
//       discountType: c.discountType || "percentage",
//       discountValue: c.discountValue || "",
//       minOrderValue: c.minOrderValue || "",
//       maxDiscount: c.maxDiscount || "",
//       expiryDate: c.expiryDate?.split("T")[0] || "",
//     });
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🎯 Coupon Admin Panel</h2>

//       {/* ================= FORM ================= */}
//       <div style={{ marginBottom: 30, display: "grid", gap: 10 }}>
//         <input placeholder="Headline"
//           value={form.headline}
//           onChange={(e)=>setForm({...form, headline:e.target.value})}
//         />

//         <input placeholder="Coupon Code"
//           value={form.couponCode}
//           onChange={(e)=>setForm({...form, couponCode:e.target.value.toUpperCase()})}
//         />

//         <select value={form.discountType}
//           onChange={(e)=>setForm({...form, discountType:e.target.value})}>
//           <option value="percentage">Percentage</option>
//           <option value="flat">Flat</option>
//         </select>

//         <input type="number" placeholder="Discount"
//           value={form.discountValue}
//           onChange={(e)=>setForm({...form, discountValue:e.target.value})}
//         />

//         <input type="number" placeholder="Min Order"
//           value={form.minOrderValue}
//           onChange={(e)=>setForm({...form, minOrderValue:e.target.value})}
//         />

//         <input type="number" placeholder="Max Discount"
//           value={form.maxDiscount}
//           onChange={(e)=>setForm({...form, maxDiscount:e.target.value})}
//         />

//         <input type="date"
//           value={form.expiryDate}
//           onChange={(e)=>setForm({...form, expiryDate:e.target.value})}
//         />

//         <button onClick={handleSubmit}>
//           {loading ? "Saving..." : editId ? "Update Coupon" : "Create Coupon"}
//         </button>
//       </div>

//       {/* ================= LIST ================= */}
//       <h3>📋 All Coupons</h3>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
//         {coupons.map((c) => (
//           <div key={c._id} style={{
//             border:"1px solid #ddd",
//             padding:15,
//             borderRadius:10,
//             width:260
//           }}>
//             <h4>{c.headline}</h4>
//             <b>{c.couponCode}</b>

//             <p>
//               {c.discountType === "percentage"
//                 ? `${c.discountValue}% OFF`
//                 : `₹${c.discountValue} OFF`}
//             </p>

//             <p>Min: ₹{c.minOrderValue}</p>
//             <p>Max: ₹{c.maxDiscount}</p>
//             <p>Valid: {new Date(c.expiryDate).toLocaleDateString()}</p>
//             <p>Status: {c.status}</p>

//             <div style={{ display:"flex", gap:10 }}>
//               <button onClick={()=>handleEdit(c)}>Edit</button>
//               <button onClick={()=>handleToggle(c._id)}>Toggle</button>
//               <button onClick={()=>handleDelete(c._id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminCouponPage;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "https://grocerrybackend.onrender.com/api/coupons";

const EMPTY_FORM = {
  headline: "",
  couponCode: "",
  discountType: "percentage",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  expiryDate: "",
};

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

/* ── Badge ── */
const Badge = ({ color, children }) => {
  const map = {
    green:  { background: "#EAF3DE", color: "#3B6D11" },
    gray:   { background: "#F1EFE8", color: "#5F5E5A" },
    blue:   { background: "#E6F1FB", color: "#185FA5" },
    amber:  { background: "#FAEEDA", color: "#854F0B" },
  };
  return (
    <span style={{
      ...map[color],
      padding: "2px 8px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: "nowrap",
      display: "inline-block",
    }}>
      {children}
    </span>
  );
};

/* ── Modal ── */
const CouponModal = ({ open, onClose, onSave, editData, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(
      editData
        ? { ...editData, expiryDate: editData.expiryDate?.split("T")[0] || "" }
        : EMPTY_FORM
    );
  }, [editData, open]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  if (!open) return null;

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>{editData ? "Edit coupon" : "Create coupon"}</span>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={S.formGrid}>
          <div style={{ gridColumn: "1/-1" }}>
            <Lbl>Headline</Lbl>
            <Inp placeholder="e.g. Festive Sale Offer" value={form.headline} onChange={set("headline")} />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <Lbl req>Coupon code</Lbl>
            <Inp
              placeholder="e.g. SAVE20"
              value={form.couponCode}
              onChange={(e) => setForm((p) => ({ ...p, couponCode: e.target.value.toUpperCase() }))}
            />
          </div>

          <div>
            <Lbl>Discount type</Lbl>
            <select style={S.inp} value={form.discountType} onChange={set("discountType")}>
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>

          <div>
            <Lbl req>Discount value</Lbl>
            <Inp type="number" placeholder="e.g. 20" value={form.discountValue} onChange={set("discountValue")} />
          </div>

          <div>
            <Lbl>Min order (₹)</Lbl>
            <Inp type="number" placeholder="e.g. 500" value={form.minOrderValue} onChange={set("minOrderValue")} />
          </div>

          <div>
            <Lbl>Max discount (₹)</Lbl>
            <Inp
              type="number"
              placeholder={form.discountType === "flat" ? "N/A for flat" : "e.g. 200"}
              disabled={form.discountType === "flat"}
              value={form.maxDiscount}
              onChange={set("maxDiscount")}
              style={{ opacity: form.discountType === "flat" ? 0.4 : 1 }}
            />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <Lbl>Expiry date</Lbl>
            <Inp type="date" value={form.expiryDate} onChange={set("expiryDate")} />
          </div>
        </div>

        <div style={S.modalFooter}>
          <button style={S.btnSec} onClick={onClose}>Cancel</button>
          <button
            style={{ ...S.btnPri, opacity: loading ? 0.6 : 1 }}
            onClick={() => onSave(form)}
            disabled={loading}
          >
            {loading ? "Saving..." : editData ? "Update coupon" : "Save coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminCouponPage = () => {
  const [coupons, setCoupons]   = useState([]);
  const [modalOpen, setModal]   = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin`);
      if (res.data.success) setCoupons(res.data.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => { setEditData(null); setModal(true); };
  const openEdit   = (c) => { setEditData(c);   setModal(true); };
  const closeModal = () => { setModal(false); setEditData(null); };

  const handleSave = async (form) => {
    if (!form.couponCode || !form.discountValue)
      return alert("Coupon code and discount value required");
    try {
      setLoading(true);
      editData
        ? await axios.put(`${API}/${editData._id}`, form)
        : await axios.post(`${API}/admin`, form);
      closeModal();
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving coupon");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await axios.delete(`${API}/${id}`);
    fetchCoupons();
  };

  const handleToggle = async (id) => {
    await axios.put(`${API}/toggle/${id}`);
    fetchCoupons();
  };

  return (
    <div style={S.page}>
      {/* top bar */}
      <div style={S.topBar}>
        <h1 style={S.pageTitle}>Coupon management</h1>
        <button style={S.btnPri} onClick={openCreate}>+ Create coupon</button>
      </div>

      {/* scrollable wrapper so nothing ever cuts off */}
      <div style={S.tableOuter}>
        <table style={S.table}>
          <colgroup>
            <col style={{ width: "17%" }} />  {/* Headline */}
            <col style={{ width: "13%" }} />  {/* Code */}
            <col style={{ width: "13%" }} />  {/* Discount */}
            <col style={{ width: "12%" }} />  {/* Min order */}
            <col style={{ width: "13%" }} />  {/* Expiry */}
            <col style={{ width: "10%" }} />  {/* Status */}
            <col style={{ width: "22%" }} />  {/* Actions */}
          </colgroup>
          <thead>
            <tr>
              {["Headline","Code","Discount","Min Order","Expiry","Status","Actions"]
                .map((h) => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} style={S.emptyCell}>
                  No coupons yet — click "+ Create coupon" to add one
                </td>
              </tr>
            ) : coupons.map((c) => (
              <tr key={c._id} style={S.tr}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={S.td}>{c.headline || "—"}</td>
                <td style={{ ...S.td, fontWeight: 600, fontSize: 12, letterSpacing: "0.3px" }}>
                  {c.couponCode}
                </td>
                <td style={S.td}>
                  <Badge color={c.discountType === "percentage" ? "blue" : "amber"}>
                    {c.discountType === "percentage"
                      ? `${c.discountValue}% off`
                      : `₹${c.discountValue} off`}
                  </Badge>
                </td>
                <td style={S.td}>{c.minOrderValue ? `₹${c.minOrderValue}` : "—"}</td>
                <td style={{ ...S.td, fontSize: 12 }}>{fmt(c.expiryDate)}</td>
                <td style={S.td}>
                  <Badge color={c.status === "active" ? "green" : "gray"}>
                    {c.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td style={{ ...S.td, padding: "8px 8px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Abtn onClick={() => openEdit(c)}>Edit</Abtn>
                    <Abtn onClick={() => handleToggle(c._id)}>
                      {c.status === "active" ? "Disable" : "Enable"}
                    </Abtn>
                    <Abtn danger onClick={() => handleDelete(c._id)}>Delete</Abtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CouponModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editData={editData}
        loading={loading}
      />
    </div>
  );
};

/* ── tiny helpers ── */
const Lbl = ({ children, req }) => (
  <label style={S.label}>
    {children}{req && <span style={{ color: "#E24B4A" }}> *</span>}
  </label>
);

const Inp = ({ style, ...props }) => (
  <input style={{ ...S.inp, ...style }} {...props} />
);

const Abtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent",
      border: `1px solid ${danger ? "#F09595" : "#e5e5e5"}`,
      borderRadius: 6,
      padding: "4px 8px",
      fontSize: 11,
      cursor: "pointer",
      color: danger ? "#A32D2D" : "#555",
      fontWeight: 500,
      whiteSpace: "nowrap",
      transition: "background 0.12s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "#FCEBEB" : "#F1EFE8")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {children}
  </button>
);

/* ── styles ── */
const S = {
  page:        { padding: "1.5rem", fontFamily: "system-ui,sans-serif", background: "#fff", minHeight: "100vh" },
  topBar:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" },
  pageTitle:   { fontSize: 18, fontWeight: 500, color: "#1a1a1a", margin: 0 },
  btnPri:      { background: "#1a1a1a", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
  btnSec:      { background: "transparent", border: "1px solid #ddd", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#555" },

  /* table */
  tableOuter:  { border: "1px solid #eee", borderRadius: 12, overflowX: "auto", width: "100%" },
  table:       { width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed", minWidth: 760 },
  th:          { padding: "9px 8px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#999", background: "#fafafa", borderBottom: "1px solid #eee", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" },
  tr:          { transition: "background 0.1s" },
  td:          { padding: "10px 8px", borderBottom: "1px solid #f3f3f3", color: "#1a1a1a", verticalAlign: "middle", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  emptyCell:   { padding: "2.5rem", textAlign: "center", color: "#bbb", fontSize: 13 },

  /* modal */
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal:       { background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "1.5rem", width: 440, maxWidth: "94vw", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" },
  modalTitle:  { fontSize: 16, fontWeight: 500, color: "#1a1a1a" },
  closeBtn:    { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#aaa", padding: 0 },
  formGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  label:       { display: "block", fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 500 },
  inp:         { width: "100%", padding: "7px 10px", border: "1px solid #e5e5e5", borderRadius: 7, fontSize: 13, color: "#1a1a1a", background: "#fff", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.2rem" },
};

export default AdminCouponPage;