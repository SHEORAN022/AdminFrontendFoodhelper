import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Edit, Trash2, Plus, X, Truck, Phone, MapPin, 
  Bike, CheckCircle, Smartphone, Loader2 
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/riders";

export default function Riders() {
  const empty = {
    name: "",
    phone: "",
    baseLocation: "",
    vehicleType: "bike",
    status: "offline",
  };

  const [riders, setRiders] = useState([]);
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- SAARI FUNCTIONALITIES EKDUM SAME HAIN ---
  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setRiders(res.data.data || []);
    } catch (err) {
      console.error("Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.name || !form.phone) return alert("Required fields");
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
        alert("Rider updated");
      } else {
        await axios.post(API, form);
        alert("Rider added");
      }
      setShow(false);
      setEditId(null);
      setForm(empty);
      load();
    } catch (err) {
      alert("Save failed");
    }
  };

  const edit = (r) => {
    setForm(r);
    setEditId(r._id);
    setShow(true);
  };

  const del = async (id) => {
    if (!window.confirm("Delete rider?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      load();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-2 md:p-6 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER - Tight for Mobile */}
      <div className="flex flex-row justify-between items-center gap-2 mb-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] md:text-xl font-bold text-slate-800 uppercase tracking-tighter">
           Delivery Partners
          </h2>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setForm(empty);
            setShow(true);
          }}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          <Plus size={14} /> <span className="hidden xs:inline">Add Rider</span><span className="xs:hidden">Add</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-blue-600 font-bold text-xs uppercase tracking-widest animate-pulse">
          <Loader2 className="animate-spin mr-2" size={16} /> Syncing Riders...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {/* Table: Zero Extra Space Logic */}
            <table className="w-full text-left border-collapse table-fixed min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-[42%] px-2 py-3 text-[9px] font-black text-gray-500 uppercase tracking-tighter text-left">Rider Detail</th>
                  <th className="w-[18%] px-1 py-3 text-[9px] font-black text-gray-500 uppercase text-center">Status</th>
                  <th className="w-[20%] px-1 py-3 text-[9px] font-black text-gray-500 uppercase text-center">Stats</th>
                  <th className="w-[20%] px-2 py-3 text-[9px] font-black text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {riders.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2.5">
                      <div className="font-bold text-slate-800 text-[11px] md:text-[13px] truncate leading-tight">{r.name}</div>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5 truncate">
                        <Smartphone size={9} className="shrink-0" /> {r.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] text-gray-400 truncate opacity-70">
                        <MapPin size={8} className="shrink-0" /> {r.baseLocation || "No Base"}
                      </div>
                    </td>
                    
                    <td className="px-1 py-2.5 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border ${
                        r.status === 'online' ? 'bg-green-50 text-green-600 border-green-100' : 
                        r.status === 'on_delivery' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}>
                        {r.status === 'on_delivery' ? 'BUSY' : r.status.substring(0, 4)}
                      </span>
                    </td>

                    <td className="px-1 py-2.5 text-center">
                      <div className="text-[10px] font-black text-slate-700 leading-none">{r.deliveries || 0}D</div>
                      <div className="text-[9px] text-green-600 font-black mt-0.5 tracking-tighter">₹{r.earnings || 0}</div>
                    </td>

                    <td className="px-2 py-2.5">
                      <div className="flex items-center justify-center gap-2 md:gap-4">
                        <button onClick={() => edit(r)} className="text-slate-400 hover:text-blue-600 transition-all">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => del(r._id)} className="text-slate-400 hover:text-red-600 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL - SARI FUNCTIONALITIES PRESERVED */}
      {show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 backdrop-blur-sm bg-slate-900/20">
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">{editId ? "Update" : "New"} Partner</h3>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Name</label>
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Phone</label>
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Base Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all" value={form.baseLocation} onChange={(e) => setForm({ ...form, baseLocation: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Vehicle</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-xs outline-none appearance-none" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
                    <option value="bike">Bike</option><option value="scooter">Scooter</option><option value="cycle">Cycle</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Status</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-xs outline-none appearance-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="online">Online</option><option value="offline">Offline</option><option value="on_delivery">On Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 flex gap-3">
              <button onClick={() => setShow(false)} className="flex-1 py-2.5 text-gray-500 text-xs font-bold border border-gray-200 rounded-xl hover:bg-white transition-all">Cancel</button>
              <button onClick={save} className="flex-[2] py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`}</style>
    </div>
  );
}