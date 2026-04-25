// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Stores.css";

// const API = "https://grocerrybackend.onrender.com/api/stores";

// export default function Stores() {
//   const emptyForm = {
//     name: "",
//     type: "hub",
//     status: "active",
//     address: "",
//     openingTime: "06:00 AM",
//     closingTime: "11:00 PM",
//   };

//   const [stores, setStores] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // LOAD STORES
//   const loadStores = async () => {
//     try {
//       const res = await axios.get(API);
//       setStores(res.data.data || []);
//     } catch (err) {
//       alert("Failed to load stores");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStores();
//   }, []);

//   // CREATE / UPDATE
//   const submitStore = async () => {
//     if (!form.name) return alert("Store name required");

//     try {
//       if (editId) {
//         await axios.put(`${API}/${editId}`, form);
//         alert("Store updated");
//       } else {
//         await axios.post(API, form);
//         alert("Store created");
//       }

//       setShowModal(false);
//       setEditId(null);
//       setForm(emptyForm);
//       loadStores();
//     } catch {
//       alert("Save failed");
//     }
//   };

//   // EDIT
//   const editStore = (store) => {
//     setForm(store);
//     setEditId(store._id);
//     setShowModal(true);
//   };

//   // DELETE
//   const deleteStore = async (id) => {
//     if (!window.confirm("Delete this store?")) return;
//     await axios.delete(`${API}/${id}`);
//     loadStores();
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🏬 Stores / Warehouses</h2>

//       <button onClick={() => setShowModal(true)}>+ Add Store</button>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Timing</th>
//               <th>Address</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stores.map((s, i) => (
//               <tr key={s._id}>
//                 <td>{i + 1}</td>
//                 <td>{s.name}</td>
//                 <td>{s.type}</td>
//                 <td>{s.status}</td>
//                 <td>{s.openingTime} - {s.closingTime}</td>
//                 <td>{s.address}</td>
//                 <td>
//                   <button onClick={() => editStore(s)}>Edit</button>
//                   <button onClick={() => deleteStore(s._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* MODAL */}
//       {showModal && (
//         <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 20 }}>
//           <h3>{editId ? "Edit Store" : "Add Store"}</h3>

//           <input
//             placeholder="Store Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//           >
//             <option value="hub">Hub</option>
//             <option value="warehouse">Warehouse</option>
//             <option value="store">Store</option>
//           </select>

//           <select
//             value={form.status}
//             onChange={(e) => setForm({ ...form, status: e.target.value })}
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <input
//             placeholder="Address"
//             value={form.address}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//           />

//           <br /><br />

//           <button onClick={submitStore}>
//             {editId ? "Update" : "Save"}
//           </button>
//           <button
//             onClick={() => {
//               setShowModal(false);
//               setEditId(null);
//               setForm(emptyForm);
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
































// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Edit, Trash2, Plus, X, Store, MapPin, Clock, Loader2 } from "lucide-react";

// const API = "https://grocerrybackend.onrender.com/api/stores";

// export default function Stores() {
//   const emptyForm = {
//     name: "",
//     type: "hub",
//     status: "active",
//     address: "",
//     openingTime: "06:00 AM",
//     closingTime: "11:00 PM",
//   };

//   const [stores, setStores] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const loadStores = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API);
//       setStores(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to load stores");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStores();
//   }, []);

//   const submitStore = async () => {
//     if (!form.name) return alert("Store name required");
//     try {
//       if (editId) {
//         await axios.put(`${API}/${editId}`, form);
//         alert("Store updated");
//       } else {
//         await axios.post(API, form);
//         alert("Store created");
//       }
//       setShowModal(false);
//       setEditId(null);
//       setForm(emptyForm);
//       loadStores();
//     } catch {
//       alert("Save failed");
//     }
//   };

//   const editStore = (store) => {
//     setForm(store);
//     setEditId(store._id);
//     setShowModal(true);
//   };

//   const deleteStore = async (id) => {
//     if (!window.confirm("Delete this store?")) return;
//     try {
//       await axios.delete(`${API}/${id}`);
//       loadStores();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="p-2 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
      
//       {/* HEADER SECTION - Fixed Side-by-Side for Mobile */}
//       <div className="flex flex-row items-center justify-between gap-2 mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
//         <div className="flex items-center gap-1.5 md:gap-2">
//           <h2 className="text-sm md:text-lg font-bold text-[#1C2434] whitespace-nowrap">
//             Stores & Hubs
//           </h2>
//         </div>

//         <button
//           onClick={() => {
//             setEditId(null);
//             setForm(emptyForm);
//             setShowModal(true);
//           }}
//           className="flex items-center gap-1.5 bg-[#3C50E0] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-100"
//         >
//           <Plus size={14} /> <span className="hidden xs:inline">Add New</span>
//         </button>
//       </div>

//       {/* TABLE SECTION - Responsive & Compact */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-12 gap-2 text-[#3C50E0]">
//             <Loader2 className="animate-spin" size={24} />
//             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Stores...</span>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse table-fixed min-w-[450px]">
//               <thead>
//                 <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
//                   <th className="w-[45%] px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Location Info</th>
//                   <th className="w-[20%] px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Status</th>
//                   <th className="w-[15%] px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Type</th>
//                   <th className="w-[20%] px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#EEEEEE]">
//                 {stores.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="p-10 text-center text-slate-400 text-xs font-bold uppercase">No Stores Found</td>
//                   </tr>
//                 ) : (
//                   stores.map((s) => (
//                     <tr key={s._id} className="hover:bg-[#F8FAFC] transition-colors">
//                       <td className="px-3 py-2.5">
//                         <div className="font-bold text-[#1C2434] text-[12px] truncate leading-tight mb-0.5">{s.name}</div>
//                         <div className="flex items-center gap-1 text-[9px] text-[#64748B] truncate">
//                           <MapPin size={9} /> {s.address || "No Address"}
//                         </div>
//                       </td>
                      
//                       <td className="px-2 py-2.5 text-center">
//                         <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
//                           s.status === 'active' 
//                           ? 'bg-[#E1F9F0] text-[#10B981] border-[#10B981]/10' 
//                           : 'bg-[#FFF0F0] text-[#D34053] border-[#D34053]/10'
//                         }`}>
//                           {s.status}
//                         </span>
//                       </td>

//                       <td className="px-2 py-2.5 text-center">
//                         <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">
//                           {s.type}
//                         </span>
//                       </td>

//                       <td className="px-3 py-2.5">
//                         <div className="flex items-center justify-center gap-1">
//                           <button onClick={() => editStore(s)} className="p-1.5 text-slate-400 hover:text-[#3C50E0] hover:bg-blue-50 rounded-md transition-all">
//                             <Edit size={14} />
//                           </button>
//                           <button onClick={() => deleteStore(s._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* MODAL - Fixed Spacing & Animation */}
//       {showModal && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-[#1C2434]/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
//           <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="flex justify-between items-center p-4 border-b border-[#EEEEEE] bg-[#F7F9FC]">
//               <h3 className="font-bold text-[#1C2434] uppercase text-xs tracking-widest">
//                 {editId ? "Update Location" : "Add New Location"}
//               </h3>
//               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-5 space-y-4">
//               <div>
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Store / Hub Name</label>
//                 <input
//                   className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1 transition-all"
//                   placeholder="e.g. Downtown Warehouse"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Location Type</label>
//                   <select
//                     className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1 appearance-none"
//                     value={form.type}
//                     onChange={(e) => setForm({ ...form, type: e.target.value })}
//                   >
//                     <option value="hub">Hub</option>
//                     <option value="warehouse">Warehouse</option>
//                     <option value="store">Store</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Current Status</label>
//                   <select
//                     className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1 appearance-none"
//                     value={form.status}
//                     onChange={(e) => setForm({ ...form, status: e.target.value })}
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Detailed Address</label>
//                 <textarea
//                   rows="2"
//                   className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1 resize-none transition-all"
//                   placeholder="Street name, Area info..."
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                  <div>
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Opens At</label>
//                     <input 
//                       type="text" 
//                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1"
//                       value={form.openingTime}
//                       onChange={(e) => setForm({...form, openingTime: e.target.value})}
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Closes At</label>
//                     <input 
//                       type="text" 
//                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs focus:border-[#3C50E0] outline-none mt-1"
//                       value={form.closingTime}
//                       onChange={(e) => setForm({...form, closingTime: e.target.value})}
//                     />
//                  </div>
//               </div>
//             </div>

//             <div className="p-4 bg-[#F7F9FC] flex gap-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 py-2.5 text-slate-500 text-xs font-bold hover:bg-slate-100 rounded-xl transition-colors border border-[#E2E8F0]"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitStore}
//                 className="flex-[2] py-2.5 bg-[#3C50E0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
//               >
//                 {editId ? "Update Location" : "Confirm & Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`}</style>
//     </div>
//   );
// }





























import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, X, Store, MapPin, Loader2 } from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/stores";

export default function Stores() {
  const emptyForm = {
    name: "",
    type: "hub",
    status: "active",
    address: "",
    openingTime: "06:00 AM",
    closingTime: "11:00 PM",
  };

  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // functionality intact: Load data
  const loadStores = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setStores(res.data.data || []);
    } catch (err) {
      console.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  // functionality intact: Create/Update
  const submitStore = async () => {
    if (!form.name) return alert("Store name required");
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
        alert("Store updated");
      } else {
        await axios.post(API, form);
        alert("Store created");
      }
      setShowModal(false);
      setEditId(null);
      setForm(emptyForm);
      loadStores();
    } catch {
      alert("Save failed");
    }
  };

  // functionality intact: Edit Trigger
  const editStore = (store) => {
    setForm(store);
    setEditId(store._id);
    setShowModal(true);
  };

  // functionality intact: Delete
  const deleteStore = async (id) => {
    if (!window.confirm("Delete this store?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      loadStores();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-3 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
      
      {/* HEADER SECTION - Compact Mobile Layout */}
      <div className="flex flex-row items-center justify-between gap-2 mb-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-1">
          <h2 className="text-[13px] md:text-lg font-bold text-[#1C2434] uppercase tracking-tighter">
            Stores
          </h2>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setShowModal(true);
          }}
          className="flex items-center gap-1 bg-[#3C50E0] text-white px-2 py-1 rounded text-[10px] font-bold active:scale-95 transition-all shadow-sm"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* TABLE SECTION - Space Removed */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-10 text-[#3C50E0]"><Loader2 className="animate-spin" size={20} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[340px]">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
                  <th className="w-[52%] px-2 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tighter">Store</th>
                  <th className="w-[18%] px-1 py-2 text-[9px] font-black text-[#64748B] uppercase text-center">Status</th>
                  <th className="w-[15%] px-1 py-2 text-[9px] font-black text-[#64748B] uppercase text-center">Type</th>
                  <th className="w-[15%] px-1 py-2 text-[9px] font-black text-[#64748B] uppercase text-center">Opt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {stores.map((s) => (
                  <tr key={s._id} className="hover:bg-[#F8FAFC]">
                    <td className="px-2 py-1.5 overflow-hidden">
                      <div className="font-bold text-[#1C2434] text-[11px] truncate leading-none mb-0.5">{s.name}</div>
                      <div className="text-[9px] text-[#64748B] truncate opacity-70 flex items-center gap-0.5">
                        <MapPin size={8} className="shrink-0" /> {s.address || "No Addr"}
                      </div>
                    </td>
                    
                    <td className="px-1 py-1.5 text-center">
                      <span className={`inline-block px-1 py-0.5 rounded-[3px] text-[8px] font-black uppercase border ${
                        s.status === 'active' 
                        ? 'bg-[#E1F9F0] text-[#10B981] border-[#10B981]/10' 
                        : 'bg-[#FFF0F0] text-[#D34053] border-[#D34053]/10'
                      }`}>
                        {s.status === 'active' ? "ACT" : "OFF"}
                      </span>
                    </td>

                    <td className="px-1 py-1.5 text-center">
                      <span className="text-[8px] font-bold text-slate-500 bg-slate-50 px-1 py-0.5 rounded border border-slate-100 uppercase">
                        {s.type.substring(0, 3)}
                      </span>
                    </td>

                    <td className="px-1 py-1.5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => editStore(s)} className="text-slate-400 hover:text-[#3C50E0]">
                          <Edit size={12} />
                        </button>
                        <button onClick={() => deleteStore(s._id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL SECTION - Functionality 100% Intact */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 backdrop-blur-sm bg-black/20">
          <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl">
            <div className="flex justify-between items-center p-3 border-b border-slate-100">
              <h3 className="font-bold text-[#1C2434] text-xs uppercase tracking-widest">{editId ? "Edit" : "New"} Location</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-red-500"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Store Name</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#3C50E0]" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Type</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="hub">Hub</option><option value="warehouse">Warehouse</option><option value="store">Store</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Address</label>
                <textarea rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none resize-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="p-3 bg-slate-50 flex gap-2 rounded-b-xl">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-slate-500 text-[11px] font-bold">Cancel</button>
              <button onClick={submitStore} className="flex-[2] py-2 bg-[#3C50E0] text-white text-[11px] font-bold rounded-lg shadow-md">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`}</style>
    </div>
  );
}