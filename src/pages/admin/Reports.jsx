// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   BarChart3, 
//   FileText, 
//   CloudUpload, 
//   Trash2, 
//   Eye, 
//   X, 
//   Plus,
//   FileCheck,
//   Type,
//   Loader2
// } from "lucide-react";

// const API = "https://grocerrybackend.onrender.com/api/reports";

// export default function Reports() {
//   const [reports, setReports] = useState([]);
//   const [file, setFile] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     fileType: "pdf",
//   });

//   const loadReports = async () => {
//     try {
//       const res = await axios.get(API);
//       setReports(res.data.data || []);
//     } catch (err) {
//       console.error("Load failed");
//     }
//   };

//   useEffect(() => {
//     loadReports();
//   }, []);

//   const submit = async () => {
//     if (!file || !form.title) return alert("Title & file required");

//     setIsUploading(true); // Start Loader
//     const fd = new FormData();
//     fd.append("title", form.title);
//     fd.append("description", form.description);
//     fd.append("fileType", form.fileType);
//     fd.append("file", file);

//     try {
//       await axios.post(API, fd);
//       alert("Report Uploaded Successfully");
//       setForm({ title: "", description: "", fileType: "pdf" });
//       setFile(null);
//       setShowForm(false);
//       loadReports();
//     } catch (err) {
//       alert("Upload failed");
//     } finally {
//       setIsUploading(false); // Stop Loader
//     }
//   };

//   const remove = async (id) => {
//     if (!window.confirm("Delete this report?")) return;
//     try {
//       await axios.delete(`${API}/${id}`);
//       loadReports();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="p-3 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">
//       {/* HEADER SECTION */}
//       <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
//         <div>
//           <h2 className="text-lg md:text-xl font-bold text-[#1C2434] flex items-center gap-2">
//             Reports & Docs
//           </h2>
//         </div>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           disabled={isUploading}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-lg ${
//             showForm ? "bg-slate-100 text-slate-600" : "bg-[#3C50E0] text-white hover:bg-blue-700 disabled:opacity-50"
//           }`}
//         >
//           {showForm ? <X size={16} /> : <Plus size={16} />}
//           <span>{showForm ? "Cancel" : "New Report"}</span>
//         </button>
//       </div>

//       {/* COMPACT UPLOAD FORM */}
//       {showForm && (
//         <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-slate-200 animate-in fade-in zoom-in duration-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-3">
//               <div>
//                 <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Report Title</label>
//                 <input
//                   placeholder="e.g. Monthly Sales Jan"
//                   value={form.title}
//                   disabled={isUploading}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none transition-all disabled:opacity-70"
//                 />
//               </div>

//               <div>
//                 <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Description</label>
//                 <textarea
//                   placeholder="Details about the report..."
//                   value={form.description}
//                   rows="2"
//                   disabled={isUploading}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none transition-all resize-none disabled:opacity-70"
//                 />
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">File Type</label>
//                 <select
//                   value={form.fileType}
//                   disabled={isUploading}
//                   onChange={(e) => setForm({ ...form, fileType: e.target.value })}
//                   className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs appearance-none outline-none focus:border-[#3C50E0] disabled:opacity-70"
//                 >
//                   <option value="pdf">PDF Document</option>
//                   <option value="image">Image File</option>
//                   <option value="text">Text Report</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Choose File</label>
//                 <div className="flex items-center justify-center w-full">
//                   <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-[#E2E8F0] border-dashed rounded-lg cursor-pointer bg-[#F8FAFC] hover:bg-slate-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <CloudUpload className="w-8 h-8 mb-2 text-[#64748B]" />
//                       <p className="text-[10px] text-[#64748B] px-2 text-center">
//                         <span className="font-bold truncate block max-w-[200px]">{file ? file.name : "Click to upload"}</span>
//                       </p>
//                     </div>
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       disabled={isUploading}
//                       onChange={(e) => setFile(e.target.files[0])} 
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-end border-t pt-4">
//             <button 
//               onClick={submit} 
//               disabled={isUploading}
//               className="w-full md:w-auto bg-[#3C50E0] text-white font-bold py-2.5 px-8 rounded-lg text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-400 disabled:cursor-not-allowed"
//             >
//               {isUploading ? (
//                 <><Loader2 size={16} className="animate-spin" /> Uploading...</>
//               ) : (
//                 <><FileCheck size={16}/> Upload & Save Report</>
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* REPORTS LIST - Compact Card Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {reports.length === 0 ? (
//           <div className="col-span-full bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
//              <BarChart3 className="mx-auto text-slate-200 mb-2" size={40} />
//              <p className="text-slate-400 font-medium">No reports available</p>
//           </div>
//         ) : (
//           reports.map((r) => (
//             <div key={r._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow group">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="bg-[#F1F5F9] p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
//                   {r.fileType === 'pdf' ? <FileText className="text-red-500" size={20}/> : 
//                    r.fileType === 'image' ? <CloudUpload className="text-blue-500" size={20}/> : 
//                    <Type className="text-slate-500" size={20}/>}
//                 </div>
//                 <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
//                   {r.fileType}
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <h3 className="text-sm font-bold text-[#1C2434] truncate mb-1">{r.title}</h3>
//                 <p className="text-[11px] text-[#64748B] line-clamp-2 h-8 leading-relaxed">
//                   {r.description || "No description provided for this report."}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
//                 <a
//                   href={r.fileUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="flex-1 flex items-center justify-center gap-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#1C2434] py-2 rounded-lg text-[11px] font-bold transition-all border border-slate-200"
//                 >
//                   <Eye size={14} /> View
//                 </a>
//                 <button 
//                   className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-[11px] font-bold transition-all border border-red-100 disabled:opacity-50"
//                   onClick={() => remove(r._id)}
//                   disabled={isUploading}
//                 >
//                   <Trash2 size={14} /> Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <style>{`
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;  
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart3, 
  FileText, 
  CloudUpload, 
  Trash2, 
  Eye, 
  X, 
  Plus,
  FileCheck,
  Type,
  Loader,
  Download,
  Calendar,
  Search
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/reports";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileType: "pdf",
  });

  const loadReports = async () => {
    try {
      const res = await axios.get(API);
      setReports(res.data.data || []);
    } catch (err) {
      console.error("Load failed");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const submit = async () => {
    if (!file || !form.title) return alert("Title & file required");
    setIsUploading(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("fileType", form.fileType);
    fd.append("file", file);
    try {
      await axios.post(API, fd);
      alert("Report Uploaded Successfully");
      setForm({ title: "", description: "", fileType: "pdf" });
      setFile(null);
      setShowForm(false);
      loadReports();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      loadReports();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "pdf")   return <FileText size={15} className="text-red-500" />;
    if (fileType === "image") return <CloudUpload size={15} className="text-blue-500" />;
    return <Type size={15} className="text-slate-500" />;
  };

  const getFileBadge = (fileType) => {
    const map = {
      pdf:   "bg-red-50 text-red-600 border-red-100",
      image: "bg-blue-50 text-blue-600 border-blue-100",
      text:  "bg-slate-100 text-slate-600 border-slate-200",
    };
    return map[fileType] || map.text;
  };

  const filtered = reports.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.fileType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base md:text-xl font-bold text-[#1C2434]">
          Reports & Docs
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={isUploading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 ${
            showForm ? "bg-slate-100 text-slate-600" : "bg-[#3C50E0] text-white hover:bg-blue-700"
          }`}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? "Cancel" : "New Report"}</span>
        </button>
      </div>

      {/* UPLOAD FORM */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Report Title *</label>
                <input
                  placeholder="e.g. Monthly Sales Jan"
                  value={form.title}
                  disabled={isUploading}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none transition-all disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Description</label>
                <textarea
                  placeholder="Details about the report..."
                  value={form.description}
                  rows="3"
                  disabled={isUploading}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:border-[#3C50E0] outline-none transition-all resize-none disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">File Type</label>
                <select
                  value={form.fileType}
                  disabled={isUploading}
                  onChange={e => setForm({ ...form, fileType: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#3C50E0] disabled:opacity-70"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="image">Image File</option>
                  <option value="text">Text Report</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Choose File *</label>
                <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                  ${file ? "border-[#3C50E0] bg-blue-50" : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100"}
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <CloudUpload className={`mb-2 ${file ? "text-[#3C50E0]" : "text-[#94A3B8]"}`} size={28} />
                  <p className="text-[11px] font-semibold text-center px-4 text-[#64748B]">
                    {file ? file.name : "Click to upload file"}
                  </p>
                  {file && (
                    <p className="text-[10px] text-[#3C50E0] mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  <input type="file" className="hidden" disabled={isUploading} onChange={e => setFile(e.target.files[0])} />
                </label>
              </div>

              <button
                onClick={submit}
                disabled={isUploading}
                className="w-full bg-[#3C50E0] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isUploading
                  ? <><Loader size={15} className="animate-spin" /> Uploading...</>
                  : <><FileCheck size={15} /> Upload & Save Report</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl px-3 py-2.5 mb-4 shadow-sm border border-slate-200 flex items-center gap-2">
        <Search size={15} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search reports by title, description or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-xs outline-none text-[#1C2434] placeholder:text-slate-400 bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
            <X size={13} />
          </button>
        )}
        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-left whitespace-nowrap">#</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-left whitespace-nowrap">Title</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-left whitespace-nowrap">Description</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-center whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-center whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center">
                    <BarChart3 className="mx-auto text-slate-200 mb-3" size={36} />
                    <p className="text-sm font-semibold text-slate-400">
                      {search ? `No results for "${search}"` : "No reports uploaded yet"}
                    </p>
                    {!search && (
                      <p className="text-xs text-slate-300 mt-1">Click "New Report" to upload your first report</p>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r._id} className="hover:bg-[#F8FAFC] transition-colors">

                    {/* Serial */}
                    <td className="px-4 py-3 text-[11px] font-bold text-slate-400 w-10">
                      {idx + 1}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#F1F5F9] rounded-lg flex-shrink-0">
                          {getFileIcon(r.fileType)}
                        </div>
                        <span className="text-[13px] font-bold text-[#1C2434] whitespace-nowrap">
                          {r.title}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-[260px]">
                      <p className="text-[11px] text-[#64748B] truncate">
                        {r.description || <span className="text-slate-300 italic">No description</span>}
                      </p>
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${getFileBadge(r.fileType)}`}>
                        {r.fileType}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#64748B]">
                        <Calendar size={11} className="text-slate-400" />
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="View"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] hover:bg-blue-50 text-[#64748B] hover:text-[#3C50E0] border border-slate-200 hover:border-blue-200 transition-all"
                        >
                          <Eye size={14} />
                        </a>
                        <a
                          href={r.fileUrl}
                          download
                          title="Download"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] hover:bg-green-50 text-[#64748B] hover:text-green-600 border border-slate-200 hover:border-green-200 transition-all"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => remove(r._id)}
                          disabled={isUploading}
                          title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 hover:border-red-200 transition-all disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Showing {filtered.length} of {reports.length} report{reports.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> PDF: {reports.filter(r => r.fileType === "pdf").length}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Image: {reports.filter(r => r.fileType === "image").length}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Text: {reports.filter(r => r.fileType === "text").length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}