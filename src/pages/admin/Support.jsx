// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Support.css";

// const API_BASE = "https://grocerrybackend.onrender.com/api";

// export default function Support() {
//   const [tickets, setTickets] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [showCreate, setShowCreate] = useState(false);

//   const [assignTicketId, setAssignTicketId] = useState(null);
//   const [assignedTo, setAssignedTo] = useState("");

//   const [form, setForm] = useState({
//     user: "",
//     subject: "",
//     description: "",
//     priority: "medium",
//   });

//   /* ================= LOAD DATA ================= */
//   const loadData = async () => {
//     const [t, u] = await Promise.all([
//       axios.get(`${API_BASE}/support`),
//       axios.get(`${API_BASE}/user/all`),
//     ]);
//     setTickets(t.data.data || []);
//     setUsers(u.data.data || []);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* ================= CREATE ================= */
//   const createTicket = async () => {
//     if (!form.user || !form.subject || !form.description) {
//       return alert("All fields required");
//     }

//     await axios.post(`${API_BASE}/support`, form);

//     setForm({ user: "", subject: "", description: "", priority: "medium" });
//     setShowCreate(false);
//     loadData();
//   };

//   /* ================= ASSIGN ================= */
//   const assignTicket = async () => {
//     if (!assignedTo) return alert("Select user");

//     await axios.put(`${API_BASE}/support/assign/${assignTicketId}`, {
//       assignedTo,
//     });

//     setAssignTicketId(null);
//     setAssignedTo("");
//     loadData();
//   };

//   /* ================= RESOLVE ================= */
//   const resolveTicket = async (id) => {
//     await axios.put(`${API_BASE}/support/resolve/${id}`);
//     loadData();
//   };

//   return (
//     <div className="support-wrapper">

//       {/* ================= HEADER ================= */}
//       {/* <div className="support-header">
//         <div>
//           <h2>Support & Ticketing</h2>
//           <p>Manage customer support tickets</p>
//         </div>

//         <button
//           className="primary-btn"
//           onClick={() => setShowCreate(!showCreate)}
//         >
//           {showCreate ? "✖ Close" : "+ Create Ticket"}
//         </button>
//       </div> */}

//       {/* ================= CREATE FORM ================= */}
//       {showCreate && (
//         <div className="create-box">
//           <h3>Create Ticket</h3>

//           <select
//             value={form.user}
//             onChange={(e) => setForm({ ...form, user: e.target.value })}
//           >
//             <option value="">Select User</option>
//             {users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name} ({u.email})
//               </option>
//             ))}
//           </select>

//           <input
//             placeholder="Subject"
//             value={form.subject}
//             onChange={(e) =>
//               setForm({ ...form, subject: e.target.value })
//             }
//           />

//           <textarea
//             placeholder="Description"
//             value={form.description}
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />

//           <select
//             value={form.priority}
//             onChange={(e) =>
//               setForm({ ...form, priority: e.target.value })
//             }
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>

//           <button className="primary-btn" onClick={createTicket}>
//             Create Ticket
//           </button>
//         </div>
//       )}

//       {/* ================= TABLE ================= */}
//       <div className="table-box">
//         <table>
//           <thead>
//             <tr>
//               <th>Ticket</th>
//               <th>User</th>
//               <th>Priority</th>
//               <th>Status</th>
//               <th>Assigned</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {tickets.map((t) => (
//               <tr key={t._id}>
//                 <td>
//                   <b>{t.ticketId}</b>
//                   <div className="sub">{t.subject}</div>
//                 </td>

//                 <td>{t.user?.name}</td>

//                 <td>
//                   <span className={`pill priority ${t.priority}`}>
//                     {t.priority}
//                   </span>
//                 </td>

//                 <td>
//                   <span className={`pill status ${t.status}`}>
//                     {t.status}
//                   </span>
//                 </td>

//                 <td>{t.assignedTo || "-"}</td>

//                 <td>
//                   {t.status === "open" && (
//                     <>
//                       <select
//                         onChange={(e) => {
//                           setAssignTicketId(t._id);
//                           setAssignedTo(e.target.value);
//                         }}
//                       >
//                         <option value="">Assign</option>
//                         {users.map((u) => (
//                           <option key={u._id} value={u._id}>
//                             {u.name}
//                           </option>
//                         ))}
//                       </select>

//                       <button
//                         className="btn-outline"
//                         onClick={assignTicket}
//                       >
//                         ✔
//                       </button>
//                     </>
//                   )}

//                   {t.status === "in_progress" && (
//                     <button
//                       className="btn-outline green"
//                       onClick={() => resolveTicket(t._id)}
//                     >
//                       Resolve
//                     </button>
//                   )}

//                   {t.status === "resolved" && "✔"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }






























import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  LifeBuoy, 
  Plus, 
  X, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Check,
  ChevronRight
} from "lucide-react";

const API_BASE = "https://grocerrybackend.onrender.com/api";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [assignTicketId, setAssignTicketId] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");

  const [form, setForm] = useState({
    user: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  // Config for API calls with Token
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [t, u] = await Promise.all([
        axios.get(`${API_BASE}/support`, config),
        axios.get(`${API_BASE}/user/all`, config),
      ]);
      setTickets(t.data.data || []);
      setUsers(u.data.data || []);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createTicket = async () => {
    if (!form.user || !form.subject || !form.description) {
      return alert("All fields required");
    }
    try {
      await axios.post(`${API_BASE}/support`, form, config);
      setForm({ user: "", subject: "", description: "", priority: "medium" });
      setShowCreate(false);
      loadData();
    } catch (err) {
      alert("Failed to create ticket");
    }
  };

  const assignTicket = async () => {
    if (!assignedTo) return alert("Select user");
    try {
      await axios.put(`${API_BASE}/support/assign/${assignTicketId}`, { assignedTo }, config);
      setAssignTicketId(null);
      setAssignedTo("");
      loadData();
    } catch (err) {
      alert("Assignment failed");
    }
  };

  const resolveTicket = async (id) => {
    try {
      await axios.put(`${API_BASE}/support/resolve/${id}`, {}, config);
      loadData();
    } catch (err) {
      alert("Resolution failed");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-base md:text-xl font-bold text-[#1C2434] flex items-center gap-2">
           Support Tickets
          </h2>
         </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 ${
            showCreate ? "bg-slate-100 text-slate-600" : "bg-[#3C50E0] text-white shadow-md shadow-blue-100"
          }`}
        >
          {showCreate ? <X size={14} /> : <Plus size={14} />}
          <span>{showCreate ? "Close" : "New Ticket"}</span>
        </button>
      </div>

      {/* CREATE TICKET FORM */}
      {showCreate && (
        <div className="bg-white rounded-xl p-4 mb-5 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Customer</label>
                <select
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#3C50E0]"
                  value={form.user}
                  onChange={(e) => setForm({ ...form, user: e.target.value })}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Subject</label>
                <input
                  placeholder="Problem with order..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Priority</label>
                <select
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#3C50E0]"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Issue Description</label>
                <textarea
                  placeholder="Detailed description..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none resize-none"
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={createTicket} 
            className="w-full md:w-auto bg-[#3C50E0] text-white font-bold py-2 px-8 rounded-lg text-xs hover:bg-blue-700 transition-all shadow-md"
          >
            Submit Ticket
          </button>
        </div>
      )}

      {/* TICKETS TABLE - Compact & Mobile Friendly */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-2">
            <Loader2 className="animate-spin text-[#3C50E0]" size={24} />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Loading Tickets...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
                  <th className="w-[18%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase">ID & Subject</th>
                  <th className="w-[12%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase">User</th>
                  <th className="w-[12%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Priority</th>
                  <th className="w-[12%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Status</th>
                  <th className="w-[15%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase">Assigned To</th>
                  <th className="w-[20%] px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-extrabold text-[#3C50E0] uppercase mb-0.5 tracking-tighter">#{t.ticketId}</div>
                      <div className="text-[12px] font-bold text-[#1C2434] truncate">{t.subject}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-[12px] font-medium text-[#1C2434]">{t.user?.name || "N/A"}</div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        t.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                        t.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        <AlertCircle size={10} className="mr-1"/> {t.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.status === 'resolved' ? 'bg-[#E1F9F0] text-[#10B981]' :
                        t.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {t.status === 'resolved' ? <CheckCircle size={10} className="mr-1"/> : <Clock size={10} className="mr-1"/>}
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500 font-medium italic">
                      {t.assignedTo || "Not Assigned"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {t.status === "open" && (
                          <div className="flex items-center gap-1">
                            <select
                              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-1.5 py-1 text-[10px] outline-none"
                              onChange={(e) => {
                                setAssignTicketId(t._id);
                                setAssignedTo(e.target.value);
                              }}
                            >
                              <option value="">Assign</option>
                              {users.map((u) => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={assignTicket}
                              className="p-1 bg-[#3C50E0] text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              <UserPlus size={14} />
                            </button>
                          </div>
                        )}

                        {t.status === "in_progress" && (
                          <button
                            onClick={() => resolveTicket(t._id)}
                            className="flex items-center gap-1 bg-[#10B981] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-sm"
                          >
                            <Check size={12} /> Resolve
                          </button>
                        )}

                        {t.status === "resolved" && (
                          <div className="flex items-center gap-1 text-[#10B981] font-bold text-[10px] uppercase">
                            <CheckCircle size={14} /> Done
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* MOBILE TIP */}
      <div className="mt-4 md:hidden text-center">
         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
           <ChevronRight size={10} /> Swipe left to see full ticket actions
         </p>
      </div>

    </div>
  );
}