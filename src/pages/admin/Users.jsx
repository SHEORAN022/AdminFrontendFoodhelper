import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Search,
  UserCheck,
  UserCog,
  Download,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Users as UsersIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/user/all";
function downloadCSV(users) {
  const headers = ["#", "Name", "Email", "Phone", "Role", "Email Verified", "Last Login", "Joined"];
  const rows = users.map((u, i) => [
    i + 1,
    `"${(u.name || "N/A").replace(/"/g, '""')}"`,
    `"${(u.email || "").replace(/"/g, '""')}"`,
    `"${(u.phone || "").replace(/"/g, '""')}"`,
    u.role || "user",
    u.isEmailVerified ? "Yes" : "No",
    u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never",
    u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ─── AVATAR INITIALS ───────────────────────────────────────── */
function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black flex-shrink-0 ${color}`}
    >
      {initials}
    </span>
  );
}

/* ─── SKELETON ROW ──────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {[10, 55, 18, 17].map((w, i) => (
        <td key={i} className="p-3">
          <div className={`h-3 bg-slate-100 rounded-full w-${w === 55 ? "3/4" : "1/2"}`} />
        </td>
      ))}
    </tr>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────── */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  /* fetch */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const res = await axios.get(API, config);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* sort toggle */
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  /* derived list */
  const filtered = users
    .filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" && u.isEmailVerified) ||
        (verifiedFilter === "pending" && !u.isEmailVerified);
      return matchSearch && matchRole && matchVerified;
    })
    .sort((a, b) => {
      let va = a[sortField] ?? "";
      let vb = b[sortField] ?? "";
      if (sortField === "createdAt" || sortField === "lastLoginAt") {
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  /* csv */
  const handleCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      downloadCSV(filtered);
      setDownloading(false);
    }, 400);
  };

  /* sort icon */
  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />
    ) : (
      <ChevronDown size={10} className="opacity-20" />
    );

  return (
    <div className="p-4 md:p-6 bg-[#F1F5F9] min-h-screen font-['Inter',sans-serif]">

      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#3C50E0]/10 flex items-center justify-center">
            <UsersIcon size={14} className="text-[#3C50E0]" />
          </span>
          <div>
            <h2 className="text-sm font-black text-[#1C2434] uppercase tracking-tight leading-none">
              Customers
            </h2>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">
              {loading ? "Loading…" : `${filtered.length} of ${users.length} records`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-[10px] outline-none focus:border-[#3C50E0] w-48 transition-all"
            />
          </div>

          {/* role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-[#3C50E0] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* verified filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-[#3C50E0] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>

          {/* refresh */}
          <button
            onClick={fetchUsers}
            disabled={loading}
            title="Refresh"
            className="w-7 h-7 rounded-lg border border-slate-200 bg-[#F8FAFC] flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* CSV download */}
          <button
            onClick={handleCSV}
            disabled={loading || filtered.length === 0}
            className="flex items-center gap-1.5 bg-[#3C50E0] hover:bg-[#2f41c7] disabled:opacity-40 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            {downloading ? (
              <RefreshCw size={11} className="animate-spin" />
            ) : (
              <Download size={11} />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="mb-3 bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-4 py-2.5 rounded-lg uppercase tracking-wide">
          ⚠ {error}
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[520px]">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#EEEEEE]">
                <th className="w-[6%] p-3 text-[9px] font-black text-[#64748B] uppercase text-center">#</th>
                <th
                  className="w-[42%] p-3 text-[9px] font-black text-[#64748B] uppercase cursor-pointer select-none hover:text-[#3C50E0] transition"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center gap-1">
                    User <SortIcon field="name" />
                  </span>
                </th>
                <th className="w-[16%] p-3 text-[9px] font-black text-[#64748B] uppercase text-center">Status</th>
                <th className="w-[14%] p-3 text-[9px] font-black text-[#64748B] uppercase text-center">Role</th>
                <th
                  className="w-[22%] p-3 text-[9px] font-black text-[#64748B] uppercase cursor-pointer select-none hover:text-[#3C50E0] transition"
                  onClick={() => toggleSort("createdAt")}
                >
                  <span className="flex items-center gap-1">
                    Joined <SortIcon field="createdAt" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <UsersIcon size={28} />
                      <span className="text-[10px] font-black uppercase tracking-widest">No records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u._id} className="hover:bg-[#F8FAFC] transition-colors group">
                    {/* # */}
                    <td className="p-3 text-[10px] text-slate-400 font-bold text-center">{i + 1}</td>

                    {/* user detail */}
                    <td className="p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={u.name} />
                        <div className="min-w-0">
                          <p className="font-bold text-[#1C2434] text-[11px] truncate leading-tight">
                            {u.name || "—"}
                          </p>
                          <p className="text-[9px] text-slate-400 truncate flex items-center gap-0.5 mt-0.5">
                            <Mail size={8} className="flex-shrink-0" />
                            {u.email}
                          </p>
                          {u.phone && (
                            <p className="text-[9px] text-slate-300 truncate mt-0.5">{u.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* verified */}
                    <td className="p-3 text-center">
                      {u.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <ShieldCheck size={8} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-rose-50 text-rose-500 border border-rose-100">
                          <ShieldX size={8} /> Pending
                        </span>
                      )}
                    </td>

                    {/* role */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          u.role === "admin"
                            ? "text-[#3C50E0] bg-blue-50 border-blue-200"
                            : "text-slate-400 bg-slate-50 border-slate-200"
                        }`}
                      >
                        {u.role === "admin" ? <UserCog size={8} /> : <UserCheck size={8} />}
                        {u.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* joined */}
                    <td className="p-3">
                      <p className="text-[10px] text-slate-500 font-semibold">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </p>
                      {u.lastLoginAt && (
                        <p className="text-[9px] text-slate-300 mt-0.5">
                          Login:{" "}
                          {new Date(u.lastLoginAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short",
                          })}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-[#F7F9FC] flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={handleCSV}
              className="text-[9px] text-[#3C50E0] font-black uppercase flex items-center gap-1 hover:underline"
            >
              <Download size={9} /> Download all as CSV
            </button>
          </div>
        )}
      </div>

      <style>{`
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        ::-webkit-scrollbar { height: 3px; width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}