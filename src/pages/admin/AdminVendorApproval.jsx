import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "https://grocerrybackend.onrender.com/api/admin";

const AVATAR_COLORS = [
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#FBEAF0", color: "#72243E" },
];

const STATUS_STYLES = {
  APPROVED: { bg: "#E1F5EE", color: "#0F6E56", dot: "#0F6E56" },
  REJECTED: { bg: "#FCEBEB", color: "#A32D2D", dot: "#A32D2D" },
  PENDING:  { bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
};

function getInitials(name = "") {
  return name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
      opacity: visible ? 1 : 0, pointerEvents: "none", transition: "opacity 0.25s",
      background: type === "success" ? "#E1F5EE" : "#FCEBEB",
      color:      type === "success" ? "#0F6E56"  : "#A32D2D",
      border: `0.5px solid ${type === "success" ? "#5DCAA5" : "#F09595"}`,
    }}>
      {message}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueColor }) {
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e5e5",
      borderRadius: 8, padding: "14px 16px", flex: 1,
    }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: valueColor || "#111" }}>{value}</div>
    </div>
  );
}


function ActionButtons({ vendor, onUpdate }) {
  const [busy, setBusy] = useState(false);

  const handle = async (status) => {
    setBusy(true);
    await onUpdate(vendor._id, status);
    setBusy(false);
  };

  const approveBtn = (
    <button
      key="approve"
      disabled={busy}
      onClick={() => handle("APPROVED")}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 8,
        cursor: busy ? "not-allowed" : "pointer",
        border: "0.5px solid #5DCAA5", background: "#E1F5EE", color: "#0F6E56",
        opacity: busy ? 0.6 : 1, transition: "opacity 0.15s",
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>✓</span> Approve
    </button>
  );

  const rejectBtn = (
    <button
      key="reject"
      disabled={busy}
      onClick={() => handle("REJECTED")}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 8,
        cursor: busy ? "not-allowed" : "pointer",
        border: "0.5px solid #F09595", background: "#FCEBEB", color: "#A32D2D",
        opacity: busy ? 0.6 : 1, transition: "opacity 0.15s",
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>✕</span> Reject
    </button>
  );

  if (vendor.status === "PENDING")  return <div style={{ display: "flex", gap: 8 }}>{approveBtn}{rejectBtn}</div>;
  if (vendor.status === "APPROVED") return rejectBtn;
  if (vendor.status === "REJECTED") return approveBtn;
  return <span style={{ fontSize: 12, color: "#aaa" }}>—</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminVendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState({ message: "", type: "success", visible: false });

  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch {
      showToast("Failed to load vendors", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/vendor/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Vendor ${status.toLowerCase()} successfully`, "success");
      await fetchVendors();
    } catch {
      showToast("Update failed. Please try again.", "error");
    }
  };

  const total    = vendors.length;
  const pending  = vendors.filter((v) => v.status === "PENDING").length;
  const approved = vendors.filter((v) => v.status === "APPROVED").length;

  return (
    <div style={{ padding: 24, background: "#f5f5f3", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "#111", margin: 0 }}>Vendor Approvals</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 2, marginBottom: 0 }}>
            Manage vendor registration requests
          </p>
        </div>
        <button
          onClick={fetchVendors}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 8,
            cursor: "pointer", border: "0.5px solid #d5d5d5",
            background: "#fff", color: "#555",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total vendors" value={loading ? "…" : total} />
        <StatCard label="Pending"       value={loading ? "…" : pending}  valueColor="#BA7517" />
        <StatCard label="Approved"      value={loading ? "…" : approved} valueColor="#0F6E56" />
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>

        {/* Card header */}
        <div style={{
          padding: "14px 20px", borderBottom: "0.5px solid #e5e5e5",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>👥</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>Vendor list</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#888", fontSize: 13 }}>
            Loading vendors…
          </div>
        )}

        {/* Empty state */}
        {!loading && vendors.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#888", fontSize: 13 }}>
            No vendors found
          </div>
        )}

        {/* Table */}
        {!loading && vendors.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  {["Vendor", "Phone", "Status", "Joined", "Action"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 20px", textAlign: "left",
                      fontSize: 12, fontWeight: 500, color: "#888",
                      background: "#fafaf8", borderBottom: "0.5px solid #e5e5e5",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.map((v, i) => {
                  const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const s  = STATUS_STYLES[v.status] || STATUS_STYLES.PENDING;

                  return (
                    <tr
                      key={v._id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Vendor name + email */}
                      <td style={{ padding: "14px 20px", borderBottom: "0.5px solid #f0f0f0", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: av.bg, color: av.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 500,
                          }}>
                            {getInitials(v.name)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{v.name || "—"}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{v.email || "—"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#888", borderBottom: "0.5px solid #f0f0f0", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        {v.phone || "—"}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "14px 20px", borderBottom: "0.5px solid #f0f0f0", verticalAlign: "middle" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: 12, fontWeight: 500, padding: "3px 10px",
                          borderRadius: 8, background: s.bg, color: s.color, whiteSpace: "nowrap",
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                          {v.status}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#888", borderBottom: "0.5px solid #f0f0f0", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        {formatDate(v.createdAt)}
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: "14px 20px", borderBottom: "0.5px solid #f0f0f0", verticalAlign: "middle" }}>
                        <ActionButtons vendor={v} onUpdate={updateStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast notification */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}