// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   Box, 
//   Plus, 
//   X, 
//   AlertTriangle, 
//   PackageCheck,
//   LayoutGrid
// } from "lucide-react";

// const API = "https://grocerrybackend.onrender.com/api";

// export default function AdminInventory() {
//   const [products, setProducts] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     product: "", sku: "", hsnCode: "", stock: "", minStock: "", costPrice: "", sellingPrice: "", gstPercent: "",
//   });

//   useEffect(() => {
//     loadProducts();
//     loadInventory();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       const res = await axios.get(API + "/prices");
//       const list = [];
//       res.data.data.forEach(c =>
//         c.subcategories.forEach(s =>
//           s.products.forEach(p => list.push(p))
//         )
//       );
//       setProducts(list);
//     } catch (err) { console.log(err); }
//   };

//   const loadInventory = async () => {
//     try {
//       const res = await axios.get(API + "/inventory/all");
//       setInventory(res.data.data || []);
//     } catch (err) { setInventory([]); }
//   };

//   const save = async () => {
//     if (!form.product || !form.stock || !form.sellingPrice) return alert("Fields missing");
//     setLoading(true);
//     try {
//       await axios.post(API + "/inventory/set", { 
//         ...form, 
//         stock: Number(form.stock), 
//         minStock: Number(form.minStock), 
//         costPrice: Number(form.costPrice), 
//         sellingPrice: Number(form.sellingPrice), 
//         gstPercent: Number(form.gstPercent) 
//       });
//       alert("Inventory Updated!");
//       setShowForm(false);
//       loadInventory();
//       setForm({ product: "", sku: "", hsnCode: "", stock: "", minStock: "", costPrice: "", sellingPrice: "", gstPercent: "" });
//     } catch (err) { alert("Save failed"); }
//     setLoading(false);
//   };

//   return (
//     <div className="p-4 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
//       {/* HEADER SECTION */}
//       <div className="flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200">
//         <h2 className="text-base md:text-xl font-bold text-[#1C2434] flex items-center gap-2">
//           Inventory
//         </h2>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 ${
//             showForm ? "bg-slate-100 text-slate-600" : "bg-[#3C50E0] text-white"
//           }`}
//         >
//           {showForm ? <X size={14} /> : <Plus size={14} />}
//           <span>{showForm ? "Close" : "Add"}</span>
//         </button>
//       </div>

//       {/* FORM SECTION - Compact Grid */}
//       {showForm && (
//         <div className="bg-white rounded-xl p-3 mb-4 shadow-sm border border-slate-200 animate-in fade-in zoom-in duration-200">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             <div className="col-span-2">
//               <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Product</label>
//               <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs outline-none focus:border-[#3C50E0]">
//                 <option value="">Select...</option>
//                 {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Qty</label>
//               <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
//             </div>
//             <div>
//               <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Min</label>
//               <input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Sale Price</label>
//               <input type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
//             </div>
//             <div className="col-span-2 md:col-span-1 flex items-end">
//               <button onClick={save} disabled={loading} className="w-full bg-[#3C50E0] text-white font-bold py-2 rounded-md text-xs hover:bg-blue-700 shadow-md">
//                 {loading ? "..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* COMPACT TABLE SECTION */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-auto min-w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
//                 <th className="px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase text-left whitespace-nowrap">Product</th>
//                 <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">Stock</th>
//                 <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">Min</th>
//                 <th className="px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase text-left whitespace-nowrap">Price</th>
//                 <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">GST</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#EEEEEE]">
//               {inventory.map(i => (
//                 <tr key={i._id} className="hover:bg-[#F8FAFC] transition-colors">
//                   <td className="px-3 py-2.5">
//                     <div className="font-bold text-[#1C2434] text-[13px] whitespace-nowrap">
//                       {i.product?.name}
//                     </div>
//                     {i.sku && <div className="text-[9px] text-[#64748B] leading-none uppercase tracking-tighter">SKU: {i.sku}</div>}
//                   </td>
//                   <td className="px-2 py-2.5 text-center">
//                     <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
//                       i.stock <= i.minStock ? 'bg-[#FFF0F0] text-[#D34053]' : 'bg-[#E1F9F0] text-[#10B981]'
//                     }`}>
//                       {i.stock <= i.minStock && <AlertTriangle size={10} className="mr-0.5" />}
//                       {i.stock}
//                     </div>
//                   </td>
//                   <td className="px-2 py-2.5 text-center text-[11px] font-medium text-[#64748B]">
//                     {i.minStock}
//                   </td>
//                   <td className="px-3 py-2.5 text-[13px] font-extrabold text-[#1C2434] whitespace-nowrap">
//                     ₹{i.sellingPrice}
//                   </td>
//                   <td className="px-2 py-2.5 text-center">
//                     <span className="text-[10px] font-bold text-[#64748B] bg-slate-100 px-1 py-0.5 rounded">
//                       {i.gstPercent}%
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Plus, 
  X, 
  AlertTriangle, 
  PackageCheck,
  LayoutGrid
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [form, setForm] = useState({
    product: "", sku: "", hsnCode: "", stock: "", minStock: "", costPrice: "", sellingPrice: "", gstPercent: "",
  });

  useEffect(() => {
    loadProducts();
    loadInventory();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get(API + "/prices");
      const list = [];

      (res.data.data || []).forEach(cat => {
        (cat.subcategories || []).forEach(sub => {

          // ✅ Level 3: subSubcategories → products (actual structure)
          (sub.subSubcategories || []).forEach(subSub => {
            (subSub.products || []).forEach(p => list.push(p));
          });

          // ✅ Level 2 fallback: direct sub → products
          (sub.products || []).forEach(p => list.push(p));
        });
      });

      // Duplicate _id remove
      const seen = new Set();
      const unique = list.filter(p => {
        if (!p._id || seen.has(String(p._id))) return false;
        seen.add(String(p._id));
        return true;
      });

      console.log("✅ Inventory products loaded:", unique.length, unique.map(p => p.name));
      setProducts(unique);
    } catch (err) {
      console.error("Product load error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const res = await axios.get(API + "/inventory/all");
      setInventory(res.data.data || []);
    } catch (err) { setInventory([]); }
  };

  const save = async () => {
    if (!form.product || !form.stock || !form.sellingPrice) return alert("Fields missing");
    setLoading(true);
    try {
      await axios.post(API + "/inventory/set", { 
        ...form, 
        stock: Number(form.stock), 
        minStock: Number(form.minStock), 
        costPrice: Number(form.costPrice), 
        sellingPrice: Number(form.sellingPrice), 
        gstPercent: Number(form.gstPercent) 
      });
      alert("Inventory Updated!");
      setShowForm(false);
      loadInventory();
      setForm({ product: "", sku: "", hsnCode: "", stock: "", minStock: "", costPrice: "", sellingPrice: "", gstPercent: "" });
    } catch (err) { alert("Save failed"); }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base md:text-xl font-bold text-[#1C2434] flex items-center gap-2">
          Inventory
          {dataLoading && <span className="text-xs text-slate-400 font-normal">Loading...</span>}
          {!dataLoading && <span className="text-xs text-slate-400 font-normal">({products.length} products)</span>}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 ${
            showForm ? "bg-slate-100 text-slate-600" : "bg-[#3C50E0] text-white"
          }`}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? "Close" : "Add"}</span>
        </button>
      </div>

      {/* FORM SECTION - Compact Grid */}
      {showForm && (
        <div className="bg-white rounded-xl p-3 mb-4 shadow-sm border border-slate-200 animate-in fade-in zoom-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="col-span-2">
              <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">
                Product {dataLoading && <span className="text-blue-400">(loading...)</span>}
              </label>
              <select
                value={form.product}
                onChange={e => setForm({ ...form, product: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs outline-none focus:border-[#3C50E0]"
              >
                <option value="">
                  {dataLoading
                    ? "Loading products..."
                    : products.length === 0
                    ? "No products found"
                    : "Select product..."}
                </option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Qty</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Min</label>
              <input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[9px] font-bold text-[#64748B] uppercase mb-0.5 block">Sale Price</label>
              <input type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1.5 text-xs" />
            </div>
            <div className="col-span-2 md:col-span-1 flex items-end">
              <button onClick={save} disabled={loading} className="w-full bg-[#3C50E0] text-white font-bold py-2 rounded-md text-xs hover:bg-blue-700 shadow-md">
                {loading ? "..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-auto min-w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
                <th className="px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase text-left whitespace-nowrap">Product</th>
                <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">Stock</th>
                <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">Min</th>
                <th className="px-3 py-3 text-[10px] font-bold text-[#64748B] uppercase text-left whitespace-nowrap">Price</th>
                <th className="px-2 py-3 text-[10px] font-bold text-[#64748B] uppercase text-center whitespace-nowrap">GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-8 text-center text-xs text-slate-400">
                    No inventory records yet
                  </td>
                </tr>
              ) : inventory.map(i => (
                <tr key={i._id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-[#1C2434] text-[13px] whitespace-nowrap">
                      {i.product?.name}
                    </div>
                    {i.sku && <div className="text-[9px] text-[#64748B] leading-none uppercase tracking-tighter">SKU: {i.sku}</div>}
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      i.stock <= i.minStock ? 'bg-[#FFF0F0] text-[#D34053]' : 'bg-[#E1F9F0] text-[#10B981]'
                    }`}>
                      {i.stock <= i.minStock && <AlertTriangle size={10} className="mr-0.5" />}
                      {i.stock}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-[11px] font-medium text-[#64748B]">
                    {i.minStock}
                  </td>
                  <td className="px-3 py-2.5 text-[13px] font-extrabold text-[#1C2434] whitespace-nowrap">
                    ₹{i.sellingPrice}
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="text-[10px] font-bold text-[#64748B] bg-slate-100 px-1 py-0.5 rounded">
                      {i.gstPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}