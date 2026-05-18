// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://grocerrybackend.onrender.com/api/service-areas";

// /* ── Icons ── */
// const IconPlus = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );
// const IconMap = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
//     <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
//   </svg>
// );
// const IconPin = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
//   </svg>
// );
// const IconTrash = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
//   </svg>
// );
// const IconEdit = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );
// const IconCheck = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );
// const IconX = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );
// const IconCity = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <rect x="2" y="7" width="20" height="15" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
//     <line x1="12" y1="12" x2="12" y2="12.01" />
//   </svg>
// );
// const IconChevron = ({ open }) => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
//     style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// const ServiceAreas = () => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cityForm, setCityForm] = useState({ city: "", state: "" });
//   const [areaForms, setAreaForms] = useState({});
//   const [expandedCities, setExpandedCities] = useState({});
//   const [editingArea, setEditingArea] = useState(null); // { cityId, areaId, name, pincode }
//   const [showAddArea, setShowAddArea] = useState({}); // { cityId: bool }

//   const fetchAreas = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API);
//       if (res.data?.success) setCities(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAreas(); }, []);

//   const createCity = async () => {
//     if (!cityForm.city || !cityForm.state) return alert("City and state required");
//     try {
//       const res = await axios.post(API, cityForm);
//       if (res.data?.success) {
//         setCityForm({ city: "", state: "" });
//         fetchAreas();
//       }
//     } catch (err) {
//       alert(err?.response?.data?.message || "Create city failed");
//     }
//   };

//   const addArea = async (cityId) => {
//     const form = areaForms[cityId];
//     if (!form?.name || !form?.pincode) return alert("Area and pincode required");
//     try {
//       const res = await axios.post(`${API}/${cityId}/areas`, form);
//       if (res.data?.success) {
//         setAreaForms((prev) => ({ ...prev, [cityId]: { name: "", pincode: "" } }));
//         setShowAddArea((prev) => ({ ...prev, [cityId]: false }));
//         fetchAreas();
//       }
//     } catch (err) {
//       alert(err?.response?.data?.message || "Add area failed");
//     }
//   };

//   const toggleAreaStatus = async (cityId, area) => {
//     try {
//       const res = await axios.put(`${API}/${cityId}/areas/${area._id}`, { active: !area.active });
//       if (res.data?.success) fetchAreas();
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   const deleteArea = async (cityId, areaId) => {
//     if (!window.confirm("Delete this area?")) return;
//     try {
//       const res = await axios.delete(`${API}/${cityId}/areas/${areaId}`);
//       if (res.data?.success) fetchAreas();
//     } catch (err) {
//       alert(err?.response?.data?.message || "Delete failed");
//     }
//   };

//   const saveEditArea = async () => {
//     if (!editingArea) return;
//     if (!editingArea.name || !editingArea.pincode) return alert("Name and pincode required");
//     try {
//       const res = await axios.put(`${API}/${editingArea.cityId}/areas/${editingArea.areaId}`, {
//         name: editingArea.name,
//         pincode: editingArea.pincode,
//       });
//       if (res.data?.success) {
//         setEditingArea(null);
//         fetchAreas();
//       }
//     } catch (err) {
//       alert(err?.response?.data?.message || "Update failed");
//     }
//   };

//   const toggleCity = (cityId) => {
//     setExpandedCities((prev) => ({ ...prev, [cityId]: !prev[cityId] }));
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div style={styles.headerIconWrap}>
//           <IconMap />
//         </div>
//         <div>
//           <h1 style={styles.headerTitle}>Service Areas</h1>
//           <p style={styles.headerSub}>Manage cities and delivery zones</p>
//         </div>
//       </div>

//       <div style={styles.wrap}>
//         {/* Add City */}
//         <div style={styles.card}>
//           <div style={styles.sectionLabel}>Add New City</div>
//           <div style={styles.row}>
//             <input
//               type="text"
//               placeholder="City name"
//               value={cityForm.city}
//               onChange={(e) => setCityForm((p) => ({ ...p, city: e.target.value }))}
//               style={styles.input}
//             />
//             <input
//               type="text"
//               placeholder="State name"
//               value={cityForm.state}
//               onChange={(e) => setCityForm((p) => ({ ...p, state: e.target.value }))}
//               style={styles.input}
//             />
//             <button onClick={createCity} style={styles.btnPrimary}>
//               <IconPlus /> Add City
//             </button>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div style={styles.loader}>
//             <div style={styles.spinner} />
//             <span style={{ color: "#64748b", fontSize: 13 }}>Loading…</span>
//           </div>
//         ) : cities.length === 0 ? (
//           <div style={{ ...styles.card, textAlign: "center", padding: "40px 24px", color: "#94a3b8" }}>
//             <IconCity />
//             <p style={{ marginTop: 10, fontSize: 13 }}>No cities added yet.</p>
//           </div>
//         ) : (
//           cities.map((city) => {
//             const isOpen = expandedCities[city._id] !== false; // default open
//             const showForm = showAddArea[city._id];
//             return (
//               <div key={city._id} style={styles.cityCard}>
//                 {/* City Header */}
//                 <div style={styles.cityHeader} onClick={() => toggleCity(city._id)}>
//                   <div style={styles.cityIconBox}><IconCity /></div>
//                   <span style={styles.cityName}>{city.city}</span>
//                   <span style={styles.cityState}>{city.state}</span>
//                   <span style={styles.areaBadge}>{city.areas?.length || 0} areas</span>
//                   <div style={styles.chevronWrap}><IconChevron open={isOpen} /></div>
//                 </div>

//                 {isOpen && (
//                   <div style={styles.cityBody}>
//                     {/* Toolbar */}
//                     <div style={styles.toolbar}>
//                       <span style={styles.tableTitle}>Areas in {city.city}</span>
//                       <button
//                         style={showForm ? styles.btnOutlineActive : styles.btnOutline}
//                         onClick={() => setShowAddArea((p) => ({ ...p, [city._id]: !showForm }))}
//                       >
//                         <IconPlus /> {showForm ? "Cancel" : "Add Area"}
//                       </button>
//                     </div>

//                     {/* Add Area Inline Form */}
//                     {showForm && (
//                       <div style={styles.addAreaForm}>
//                         <input
//                           type="text"
//                           placeholder="Area name"
//                           value={areaForms[city._id]?.name || ""}
//                           onChange={(e) =>
//                             setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], name: e.target.value } }))
//                           }
//                           style={{ ...styles.input, flex: "1 1 180px" }}
//                         />
//                         <input
//                           type="text"
//                           placeholder="Pincode"
//                           value={areaForms[city._id]?.pincode || ""}
//                           onChange={(e) =>
//                             setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], pincode: e.target.value } }))
//                           }
//                           style={{ ...styles.input, flex: "0 1 140px" }}
//                         />
//                         <button onClick={() => addArea(city._id)} style={styles.btnPrimary}>
//                           <IconCheck /> Save Area
//                         </button>
//                       </div>
//                     )}

//                     {/* Areas Table */}
//                     {city.areas?.length === 0 ? (
//                       <div style={styles.emptyTable}>No areas added yet.</div>
//                     ) : (
//                       <div style={styles.tableWrap}>
//                         <table style={styles.table}>
//                           <thead>
//                             <tr>
//                               <th style={styles.th}>#</th>
//                               <th style={styles.th}>Area Name</th>
//                               <th style={styles.th}>Pincode</th>
//                               <th style={styles.th}>
//   Delivery Charge
// </th>

// <th style={styles.th}>
//   Handling Charge
// </th>
//                               <th style={styles.th}>Status</th>
//                               <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {city.areas.map((area, idx) => {
//                               const isEditing =
//                                 editingArea?.areaId === area._id &&
//                                 editingArea?.cityId === city._id;
//                               return (
//                                 <tr key={area._id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
//                                   <td style={styles.td}>
//                                     <span style={styles.serialNo}>{idx + 1}</span>
//                                   </td>

//                                   {/* Name cell */}
//                                   <td style={styles.td}>
//                                     {isEditing ? (
//                                       <input
//                                         value={editingArea.name}
//                                         onChange={(e) =>
//                                           setEditingArea((p) => ({ ...p, name: e.target.value }))
//                                         }
//                                         style={styles.inlineInput}
//                                         autoFocus
//                                       />
//                                     ) : (
//                                       <span style={styles.areaNameCell}>{area.name}</span>
//                                     )}
//                                   </td>

//                                   {/* Pincode cell */}
//                                   <td style={styles.td}>
//                                     {isEditing ? (
//                                       <input
//                                         value={editingArea.pincode}
//                                         onChange={(e) =>
//                                           setEditingArea((p) => ({ ...p, pincode: e.target.value }))
//                                         }
//                                         style={{ ...styles.inlineInput, width: 100 }}
//                                       />
//                                     ) : (
//                                       <span style={styles.pincode}>
//                                         <IconPin /> {area.pincode}
//                                       </span>
//                                     )}
//                                   </td>
//                                   <td style={styles.td}>
//   ₹{area.deliveryCharge || 0}
// </td>

// <td style={styles.td}>
//   ₹{area.handlingCharge || 0}
// </td>

//                                   {/* Status */}
//                                   <td style={styles.td}>
//                                     <button
//                                       onClick={() => toggleAreaStatus(city._id, area)}
//                                       style={area.active ? styles.badgeActive : styles.badgeInactive}
//                                     >
//                                       <span style={styles.statusDot(area.active)} />
//                                       {area.active ? "Active" : "Inactive"}
//                                     </button>
//                                   </td>

//                                   {/* Actions */}
//                                   <td style={{ ...styles.td, textAlign: "right" }}>
//                                     <div style={styles.actionBtns}>
//                                       {isEditing ? (
//                                         <>
//                                           <button onClick={saveEditArea} style={styles.btnSave} title="Save">
//                                             <IconCheck /> Save
//                                           </button>
//                                           <button onClick={() => setEditingArea(null)} style={styles.btnCancel} title="Cancel">
//                                             <IconX /> Cancel
//                                           </button>
//                                         </>
//                                       ) : (
//                                         <>
//                                           <button
//                                             onClick={() =>
//                                             //   setEditingArea({
//                                             //     cityId: city._id,
//                                             //     areaId: area._id,
//                                             //     name: area.name,
//                                             //     pincode: area.pincode,
//                                             //   })
//                                             setEditingArea({
//   cityId: city._id,
//   areaId: area._id,
//   name: area.name,
//   pincode: area.pincode,

//   deliveryCharge:
//     area.deliveryCharge || 0,

//   handlingCharge:
//     area.handlingCharge || 0,
// })
//                                             }
//                                             style={styles.btnEdit}
//                                             title="Edit"
//                                           >
//                                             <IconEdit /> Edit
//                                           </button>
//                                           <button
//                                             onClick={() => deleteArea(city._id, area._id)}
//                                             style={styles.btnDelete}
//                                             title="Delete"
//                                           >
//                                             <IconTrash /> Delete
//                                           </button>
//                                         </>
//                                       )}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// /* ── Styles ── */
// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f1f5f9",
//     fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
//     padding: "32px 24px 60px",
//     color: "#0f172a",
//   },
//   header: {
//     maxWidth: 1000,
//     margin: "0 auto 28px",
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//   },
//   headerIconWrap: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     background: "#0f172a",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//     flexShrink: 0,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 700,
//     color: "#0f172a",
//     margin: 0,
//     letterSpacing: "-0.3px",
//   },
//   headerSub: {
//     fontSize: 13,
//     color: "#94a3b8",
//     margin: "2px 0 0",
//   },
//   wrap: {
//     maxWidth: 1000,
//     margin: "0 auto",
//   },
//   card: {
//     background: "#fff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 14,
//     padding: "22px 24px",
//     marginBottom: 20,
//     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//   },
//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: 700,
//     letterSpacing: "1px",
//     textTransform: "uppercase",
//     color: "#94a3b8",
//     marginBottom: 14,
//   },
//   row: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
//   input: {
//     flex: "1 1 180px",
//     padding: "9px 13px",
//     border: "1px solid #e2e8f0",
//     borderRadius: 9,
//     fontSize: 13,
//     color: "#0f172a",
//     background: "#f8fafc",
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   btnPrimary: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "9px 18px",
//     background: "#0f172a",
//     color: "#fff",
//     border: "none",
//     borderRadius: 9,
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//     flexShrink: 0,
//   },
//   btnOutline: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 14px",
//     background: "#fff",
//     color: "#475569",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   btnOutlineActive: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 14px",
//     background: "#fef2f2",
//     color: "#e11d48",
//     border: "1px solid #fecdd3",
//     borderRadius: 8,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },

//   /* City Card */
//   cityCard: {
//     background: "#fff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 14,
//     overflow: "hidden",
//     marginBottom: 20,
//     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//   },
//   cityHeader: {
//     background: "#0f172a",
//     padding: "16px 22px",
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     cursor: "pointer",
//     userSelect: "none",
//   },
//   cityIconBox: {
//     width: 30,
//     height: 30,
//     borderRadius: 7,
//     background: "#1e293b",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#94a3b8",
//     flexShrink: 0,
//   },
//   cityName: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "#f8fafc",
//     letterSpacing: "-0.2px",
//   },
//   cityState: {
//     fontSize: 12,
//     color: "#64748b",
//     marginLeft: 2,
//   },
//   areaBadge: {
//     marginLeft: "auto",
//     background: "#1e293b",
//     color: "#64748b",
//     fontSize: 11,
//     fontWeight: 600,
//     padding: "3px 10px",
//     borderRadius: 999,
//   },
//   chevronWrap: {
//     color: "#64748b",
//     marginLeft: 10,
//     display: "flex",
//     alignItems: "center",
//   },
//   cityBody: {
//     padding: "20px 22px 24px",
//   },

//   /* Toolbar */
//   toolbar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   tableTitle: {
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#334155",
//   },

//   /* Add Area Form */
//   addAreaForm: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//     alignItems: "center",
//     marginBottom: 16,
//     padding: "14px 16px",
//     background: "#f8fafc",
//     borderRadius: 10,
//     border: "1px dashed #cbd5e1",
//   },

//   /* Table */
//   tableWrap: {
//     overflowX: "auto",
//     borderRadius: 10,
//     border: "1px solid #e2e8f0",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: 13,
//   },
//   th: {
//     padding: "10px 14px",
//     textAlign: "left",
//     fontSize: 11,
//     fontWeight: 700,
//     textTransform: "uppercase",
//     letterSpacing: "0.7px",
//     color: "#64748b",
//     background: "#f8fafc",
//     borderBottom: "1px solid #e2e8f0",
//     whiteSpace: "nowrap",
//   },
//   td: {
//     padding: "11px 14px",
//     borderBottom: "1px solid #f1f5f9",
//     color: "#334155",
//     verticalAlign: "middle",
//   },
//   trEven: { background: "#fff" },
//   trOdd: { background: "#fafbfc" },

//   serialNo: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     background: "#f1f5f9",
//     color: "#64748b",
//     fontSize: 11,
//     fontWeight: 700,
//   },
//   areaNameCell: {
//     fontWeight: 600,
//     color: "#1e293b",
//     fontSize: 13,
//   },
//   pincode: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     fontFamily: "monospace",
//     fontSize: 12,
//     color: "#475569",
//     background: "#f1f5f9",
//     padding: "3px 8px",
//     borderRadius: 6,
//   },

//   /* Status badges */
//   badgeActive: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     background: "#f0fdf4",
//     color: "#16a34a",
//     border: "1px solid #bbf7d0",
//     borderRadius: 999,
//     padding: "3px 10px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "inherit",
//     letterSpacing: "0.3px",
//   },
//   badgeInactive: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     background: "#fff1f2",
//     color: "#e11d48",
//     border: "1px solid #fecdd3",
//     borderRadius: 999,
//     padding: "3px 10px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "inherit",
//     letterSpacing: "0.3px",
//   },
//   statusDot: (active) => ({
//     width: 6,
//     height: 6,
//     borderRadius: "50%",
//     background: active ? "#22c55e" : "#f43f5e",
//     flexShrink: 0,
//   }),

//   /* Action buttons */
//   actionBtns: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 7,
//   },
//   btnEdit: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 12px",
//     background: "#eff6ff",
//     color: "#2563eb",
//     border: "1px solid #bfdbfe",
//     borderRadius: 7,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   btnDelete: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 12px",
//     background: "#fff5f5",
//     color: "#e11d48",
//     border: "1px solid #fecdd3",
//     borderRadius: 7,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   btnSave: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 12px",
//     background: "#f0fdf4",
//     color: "#16a34a",
//     border: "1px solid #bbf7d0",
//     borderRadius: 7,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   btnCancel: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 12px",
//     background: "#f8fafc",
//     color: "#64748b",
//     border: "1px solid #e2e8f0",
//     borderRadius: 7,
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },

//   /* Inline edit inputs */
//   inlineInput: {
//     padding: "5px 10px",
//     border: "1.5px solid #3b82f6",
//     borderRadius: 7,
//     fontSize: 13,
//     color: "#0f172a",
//     background: "#eff6ff",
//     outline: "none",
//     fontFamily: "inherit",
//     width: 160,
//   },

//   emptyTable: {
//     textAlign: "center",
//     padding: "28px 0",
//     color: "#94a3b8",
//     fontSize: 13,
//     background: "#fafafa",
//     borderRadius: 10,
//     border: "1px dashed #e2e8f0",
//   },

//   loader: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 200,
//     gap: 12,
//   },
//   spinner: {
//     width: 28,
//     height: 28,
//     borderRadius: "50%",
//     border: "3px solid #e2e8f0",
//     borderTopColor: "#0f172a",
//     animation: "spin 0.7s linear infinite",
//   },
// };

// export default ServiceAreas;


import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://grocerrybackend.onrender.com/api/service-areas";

/* ── Icons ── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);
const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCity = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="15" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconRupee = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8L19 13" /><path d="M6 8a6 6 0 0 0 0 5h3" />
  </svg>
);

const ServiceAreas = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add city form
  const [cityForm, setCityForm] = useState({ city: "", state: "" });

  // Edit city state
  const [editingCity, setEditingCity] = useState(null); // { cityId, city, state }

  // Add area forms per city
  const [areaForms, setAreaForms] = useState({});
  const [showAddArea, setShowAddArea] = useState({});

  // Edit area state
  const [editingArea, setEditingArea] = useState(null); // { cityId, areaId, name, pincode, deliveryCharge, handlingCharge }

  // Expanded cities
  const [expandedCities, setExpandedCities] = useState({});

  // ── Fetch ──
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      if (res.data?.success) setCities(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAreas(); }, []);

  // ── Create City ──
  const createCity = async () => {
    if (!cityForm.city.trim() || !cityForm.state.trim()) {
      return alert("City aur State dono required hain");
    }
    try {
      const res = await axios.post(API, {
        city: cityForm.city.trim(),
        state: cityForm.state.trim(),
      });
      if (res.data?.success) {
        setCityForm({ city: "", state: "" });
        fetchAreas();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "City add karne mein error aaya");
    }
  };

  // ── Update City ──
  const saveCityEdit = async () => {
    if (!editingCity) return;
    if (!editingCity.city.trim() || !editingCity.state.trim()) {
      return alert("City aur State dono required hain");
    }
    try {
      const res = await axios.put(`${API}/${editingCity.cityId}`, {
        city: editingCity.city.trim(),
        state: editingCity.state.trim(),
      });
      if (res.data?.success) {
        setEditingCity(null);
        fetchAreas();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "City update karne mein error aaya");
    }
  };

  // ── Delete City ──
  const deleteCity = async (cityId, cityName) => {
    if (!window.confirm(`"${cityName}" city ko delete karna chahte hain? Iske saare areas bhi delete ho jayenge.`)) return;
    try {
      const res = await axios.delete(`${API}/${cityId}`);
      if (res.data?.success) fetchAreas();
    } catch (err) {
      alert(err?.response?.data?.message || "City delete karne mein error aaya");
    }
  };

  // ── Add Area ──
  const addArea = async (cityId) => {
    const form = areaForms[cityId];
    if (!form?.name?.trim() || !form?.pincode?.trim()) {
      return alert("Area name aur Pincode required hain");
    }
    try {
      const res = await axios.post(`${API}/${cityId}/areas`, {
        name: form.name.trim(),
        pincode: form.pincode.trim(),
        deliveryCharge: parseFloat(form.deliveryCharge) || 0,
        handlingCharge: parseFloat(form.handlingCharge) || 0,
      });
      if (res.data?.success) {
        setAreaForms((prev) => ({ ...prev, [cityId]: { name: "", pincode: "", deliveryCharge: "", handlingCharge: "" } }));
        setShowAddArea((prev) => ({ ...prev, [cityId]: false }));
        fetchAreas();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Area add karne mein error aaya");
    }
  };

  // ── Toggle Area Status ──
  const toggleAreaStatus = async (cityId, area) => {
    try {
      const res = await axios.put(`${API}/${cityId}/areas/${area._id}`, { active: !area.active });
      if (res.data?.success) fetchAreas();
    } catch (err) {
      alert("Status update karne mein error aaya");
    }
  };

  // ── Delete Area ──
  const deleteArea = async (cityId, areaId) => {
    if (!window.confirm("Is area ko delete karna chahte hain?")) return;
    try {
      const res = await axios.delete(`${API}/${cityId}/areas/${areaId}`);
      if (res.data?.success) fetchAreas();
    } catch (err) {
      alert(err?.response?.data?.message || "Area delete karne mein error aaya");
    }
  };

  // ── Save Edit Area ──
  const saveEditArea = async () => {
    if (!editingArea) return;
    if (!editingArea.name?.trim() || !editingArea.pincode?.trim()) {
      return alert("Name aur Pincode required hain");
    }
    try {
      const res = await axios.put(`${API}/${editingArea.cityId}/areas/${editingArea.areaId}`, {
        name: editingArea.name.trim(),
        pincode: editingArea.pincode.trim(),
        deliveryCharge: parseFloat(editingArea.deliveryCharge) || 0,
        handlingCharge: parseFloat(editingArea.handlingCharge) || 0,
      });
      if (res.data?.success) {
        setEditingArea(null);
        fetchAreas();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Area update karne mein error aaya");
    }
  };

  const toggleCity = (cityId) => {
    setExpandedCities((prev) => ({ ...prev, [cityId]: !prev[cityId] }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f5f9; }
        .sa-page { min-height: 100vh; background: #f1f5f9; font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif; padding: 32px 20px 60px; color: #0f172a; }
        .sa-input { width: 100%; padding: 9px 13px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 13px; color: #0f172a; background: #fff; outline: none; font-family: inherit; transition: border-color 0.15s; }
        .sa-input:focus { border-color: #3b82f6; }
        .sa-input::placeholder { color: #94a3b8; }
        .sa-inline-input { padding: 5px 9px; border: 1.5px solid #3b82f6; border-radius: 7px; font-size: 13px; color: #0f172a; background: #eff6ff; outline: none; font-family: inherit; width: 130px; }
        .sa-inline-input:focus { border-color: #2563eb; }
        .sa-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; background: #0f172a; color: #fff; border: none; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 0.15s; }
        .sa-btn-primary:hover { background: #1e293b; }
        .sa-btn-outline { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background: #fff; color: #475569; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; }
        .sa-btn-outline:hover { border-color: #cbd5e1; background: #f8fafc; }
        .sa-btn-outline-danger { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background: #fff5f5; color: #e11d48; border: 1.5px solid #fecdd3; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .sa-btn-edit { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .sa-btn-edit:hover { background: #dbeafe; }
        .sa-btn-delete { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; background: #fff5f5; color: #e11d48; border: 1px solid #fecdd3; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .sa-btn-delete:hover { background: #ffe4e6; }
        .sa-btn-save { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .sa-btn-cancel { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .sa-badge-active { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .sa-badge-inactive { display: inline-flex; align-items: center; gap: 5px; background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .sa-table tr:last-child td { border-bottom: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sa-spinner { width: 26px; height: 26px; border-radius: 50%; border: 3px solid #e2e8f0; border-top-color: #0f172a; animation: spin 0.7s linear infinite; }
        .sa-city-edit-form { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      `}</style>

      <div className="sa-page">
        {/* Header */}
        <div style={{ maxWidth: 1060, margin: "0 auto 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            <IconMap />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Service Areas</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Cities aur delivery zones manage karein</p>
          </div>
        </div>

        <div style={{ maxWidth: 1060, margin: "0 auto" }}>

          {/* ── Add City Card ── */}
          <div style={S.card}>
            <div style={S.sectionLabel}>Naya City Add Karein</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input
                className="sa-input"
                type="text"
                placeholder="City ka naam"
                value={cityForm.city}
                onChange={(e) => setCityForm((p) => ({ ...p, city: e.target.value }))}
                style={{ flex: "1 1 180px" }}
                onKeyDown={(e) => e.key === "Enter" && createCity()}
              />
              <input
                className="sa-input"
                type="text"
                placeholder="State ka naam"
                value={cityForm.state}
                onChange={(e) => setCityForm((p) => ({ ...p, state: e.target.value }))}
                style={{ flex: "1 1 180px" }}
                onKeyDown={(e) => e.key === "Enter" && createCity()}
              />
              <button className="sa-btn-primary" onClick={createCity}>
                <IconPlus /> City Add Karein
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 12 }}>
              <div className="sa-spinner" />
              <span style={{ color: "#64748b", fontSize: 13 }}>Loading…</span>
            </div>
          ) : cities.length === 0 ? (
            <div style={{ ...S.card, textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
              <IconCity />
              <p style={{ marginTop: 10, fontSize: 13 }}>Abhi tak koi city add nahi ki gayi.</p>
            </div>
          ) : (
            cities.map((city) => {
              const isOpen = expandedCities[city._id] !== false;
              const showForm = showAddArea[city._id];
              const isEditingThisCity = editingCity?.cityId === city._id;

              return (
                <div key={city._id} style={S.cityCard}>

                  {/* ── City Header ── */}
                  <div style={S.cityHeader}>
                    <div style={S.cityIconBox}><IconCity /></div>

                    {isEditingThisCity ? (
                      /* City Edit Form */
                      <div className="sa-city-edit-form" style={{ flex: 1 }}>
                        <input
                          className="sa-inline-input"
                          value={editingCity.city}
                          onChange={(e) => setEditingCity((p) => ({ ...p, city: e.target.value }))}
                          placeholder="City naam"
                          style={{ background: "#1e293b", color: "#f8fafc", borderColor: "#3b82f6", width: 160 }}
                          autoFocus
                        />
                        <input
                          className="sa-inline-input"
                          value={editingCity.state}
                          onChange={(e) => setEditingCity((p) => ({ ...p, state: e.target.value }))}
                          placeholder="State naam"
                          style={{ background: "#1e293b", color: "#f8fafc", borderColor: "#3b82f6", width: 160 }}
                        />
                        <button className="sa-btn-save" style={{ marginLeft: 4 }} onClick={saveCityEdit}>
                          <IconCheck /> Save
                        </button>
                        <button className="sa-btn-cancel" onClick={() => setEditingCity(null)}>
                          <IconX /> Cancel
                        </button>
                      </div>
                    ) : (
                      /* City Display */
                      <>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.2px" }}>{city.city}</span>
                        <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}>{city.state}</span>
                        <span style={{ marginLeft: "auto", background: "#1e293b", color: "#64748b", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                          {city.areas?.length || 0} areas
                        </span>

                        {/* City Actions */}
                        <button
                          className="sa-btn-edit"
                          style={{ marginLeft: 10, background: "#1e293b", borderColor: "#334155", color: "#93c5fd" }}
                          onClick={(e) => { e.stopPropagation(); setEditingCity({ cityId: city._id, city: city.city, state: city.state }); }}
                          title="City Edit Karein"
                        >
                          <IconEdit /> Edit
                        </button>
                        <button
                          className="sa-btn-delete"
                          style={{ background: "#1e293b", borderColor: "#334155", color: "#fca5a5" }}
                          onClick={(e) => { e.stopPropagation(); deleteCity(city._id, city.city); }}
                          title="City Delete Karein"
                        >
                          <IconTrash /> Delete
                        </button>
                        <div
                          style={{ color: "#64748b", marginLeft: 6, display: "flex", alignItems: "center", cursor: "pointer", padding: "4px" }}
                          onClick={() => toggleCity(city._id)}
                        >
                          <IconChevron open={isOpen} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── City Body ── */}
                  {isOpen && (
                    <div style={{ padding: "20px 22px 24px" }}>

                      {/* Toolbar */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                          {city.city} ke Areas
                        </span>
                        <button
                          className={showForm ? "sa-btn-outline-danger" : "sa-btn-outline"}
                          onClick={() => setShowAddArea((p) => ({ ...p, [city._id]: !showForm }))}
                        >
                          {showForm ? <><IconX /> Cancel</> : <><IconPlus /> Area Add Karein</>}
                        </button>
                      </div>

                      {/* Add Area Inline Form */}
                      {showForm && (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px dashed #cbd5e1" }}>
                          <input
                            className="sa-input"
                            type="text"
                            placeholder="Area ka naam"
                            value={areaForms[city._id]?.name || ""}
                            onChange={(e) => setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], name: e.target.value } }))}
                            style={{ flex: "1 1 160px" }}
                          />
                          <input
                            className="sa-input"
                            type="text"
                            placeholder="Pincode"
                            value={areaForms[city._id]?.pincode || ""}
                            onChange={(e) => setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], pincode: e.target.value } }))}
                            style={{ flex: "0 1 120px" }}
                          />
                          <input
                            className="sa-input"
                            type="number"
                            placeholder="Delivery Charge (₹)"
                            value={areaForms[city._id]?.deliveryCharge || ""}
                            onChange={(e) => setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], deliveryCharge: e.target.value } }))}
                            style={{ flex: "0 1 150px" }}
                          />
                          <input
                            className="sa-input"
                            type="number"
                            placeholder="Handling Charge (₹)"
                            value={areaForms[city._id]?.handlingCharge || ""}
                            onChange={(e) => setAreaForms((p) => ({ ...p, [city._id]: { ...p[city._id], handlingCharge: e.target.value } }))}
                            style={{ flex: "0 1 150px" }}
                          />
                          <button className="sa-btn-primary" onClick={() => addArea(city._id)}>
                            <IconCheck /> Area Save Karein
                          </button>
                        </div>
                      )}

                      {/* Areas Table */}
                      {!city.areas || city.areas.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: 13, background: "#fafafa", borderRadius: 10, border: "1px dashed #e2e8f0" }}>
                          Is city mein abhi koi area add nahi kiya.
                        </div>
                      ) : (
                        <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                          <table className="sa-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                              <tr>
                                <th style={S.th}>#</th>
                                <th style={S.th}>Area Naam</th>
                                <th style={S.th}>Pincode</th>
                                <th style={S.th}>Delivery Charge</th>
                                <th style={S.th}>Handling Charge</th>
                                <th style={S.th}>Status</th>
                                <th style={{ ...S.th, textAlign: "right" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {city.areas.map((area, idx) => {
                                const isEditing = editingArea?.areaId === area._id && editingArea?.cityId === city._id;
                                return (
                                  <tr key={area._id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafbfc" }}>

                                    {/* Serial */}
                                    <td style={S.td}>
                                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700 }}>
                                        {idx + 1}
                                      </span>
                                    </td>

                                    {/* Name */}
                                    <td style={S.td}>
                                      {isEditing ? (
                                        <input
                                          className="sa-inline-input"
                                          value={editingArea.name}
                                          onChange={(e) => setEditingArea((p) => ({ ...p, name: e.target.value }))}
                                          autoFocus
                                        />
                                      ) : (
                                        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{area.name}</span>
                                      )}
                                    </td>

                                    {/* Pincode */}
                                    <td style={S.td}>
                                      {isEditing ? (
                                        <input
                                          className="sa-inline-input"
                                          value={editingArea.pincode}
                                          onChange={(e) => setEditingArea((p) => ({ ...p, pincode: e.target.value }))}
                                          style={{ width: 110 }}
                                        />
                                      ) : (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "monospace", fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>
                                          <IconPin /> {area.pincode}
                                        </span>
                                      )}
                                    </td>

                                    {/* Delivery Charge */}
                                    <td style={S.td}>
                                      {isEditing ? (
                                        <input
                                          className="sa-inline-input"
                                          type="number"
                                          value={editingArea.deliveryCharge}
                                          onChange={(e) => setEditingArea((p) => ({ ...p, deliveryCharge: e.target.value }))}
                                          style={{ width: 110 }}
                                          placeholder="₹0"
                                        />
                                      ) : (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0f172a", fontWeight: 600 }}>
                                          <IconRupee /> {area.deliveryCharge || 0}
                                        </span>
                                      )}
                                    </td>

                                    {/* Handling Charge */}
                                    <td style={S.td}>
                                      {isEditing ? (
                                        <input
                                          className="sa-inline-input"
                                          type="number"
                                          value={editingArea.handlingCharge}
                                          onChange={(e) => setEditingArea((p) => ({ ...p, handlingCharge: e.target.value }))}
                                          style={{ width: 110 }}
                                          placeholder="₹0"
                                        />
                                      ) : (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0f172a", fontWeight: 600 }}>
                                          <IconRupee /> {area.handlingCharge || 0}
                                        </span>
                                      )}
                                    </td>

                                    {/* Status */}
                                    <td style={S.td}>
                                      <button
                                        className={area.active ? "sa-badge-active" : "sa-badge-inactive"}
                                        onClick={() => toggleAreaStatus(city._id, area)}
                                      >
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: area.active ? "#22c55e" : "#f43f5e", flexShrink: 0 }} />
                                        {area.active ? "Active" : "Inactive"}
                                      </button>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ ...S.td, textAlign: "right" }}>
                                      <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                                        {isEditing ? (
                                          <>
                                            <button className="sa-btn-save" onClick={saveEditArea}>
                                              <IconCheck /> Save
                                            </button>
                                            <button className="sa-btn-cancel" onClick={() => setEditingArea(null)}>
                                              <IconX /> Cancel
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              className="sa-btn-edit"
                                              onClick={() => setEditingArea({
                                                cityId: city._id,
                                                areaId: area._id,
                                                name: area.name,
                                                pincode: area.pincode,
                                                deliveryCharge: area.deliveryCharge || 0,
                                                handlingCharge: area.handlingCharge || 0,
                                              })}
                                            >
                                              <IconEdit /> Edit
                                            </button>
                                            <button className="sa-btn-delete" onClick={() => deleteArea(city._id, area._id)}>
                                              <IconTrash /> Delete
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

/* ── Static Styles ── */
const S = {
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "22px 24px",
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 14,
  },
  cityCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  cityHeader: {
    background: "#0f172a",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
    flexWrap: "wrap",
  },
  cityIconBox: {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    flexShrink: 0,
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    verticalAlign: "middle",
    background: "transparent",
  },
};

export default ServiceAreas;