import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "https://grocerrybackend.onrender.com/api/banners";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "", ok: true });
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast({ show: false, msg: "", ok: true }), 2800);
  };

  /* ─── READ ─── */
  const fetchBanners = async () => {
    try {
      setFetching(true);
      const res = await axios.get(API);
      setBanners(res.data.data || []);
    } catch {
      showToast("Could not load banners", false);
    } finally {
      setFetching(false);
    }
  };

  /* ─── File ─── */
  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ─── Modal ─── */
  const openCreate = () => {
    setEditBanner(null);
    clearFile();
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditBanner(banner);
    setFile(null);
    setPreview(banner.image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditBanner(null);
    clearFile();
  };

  /* ─── CREATE ─── */
  const handleCreate = async () => {
    if (!file) return showToast("Please select an image", false);
    const fd = new FormData();
    fd.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(API, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        showToast("Banner created!");
        closeModal();
        fetchBanners();
      }
    } catch {
      showToast("Create failed", false);
    } finally {
      setLoading(false);
    }
  };

  /* ─── UPDATE ─── */
  const handleUpdate = async () => {
    if (!editBanner) return;
    if (!file) return showToast("Select a new image to update", false);
    const fd = new FormData();
    fd.append("image", file);
    try {
      setLoading(true);
      const res = await axios.put(`${API}/${editBanner._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        showToast("Banner updated!");
        closeModal();
        fetchBanners();
      }
    } catch {
      showToast("Update failed", false);
    } finally {
      setLoading(false);
    }
  };

  /* ─── DELETE ─── */
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      showToast("Banner deleted");
      setDeleteId(null);
      fetchBanners();
    } catch {
      showToast("Delete failed", false);
    }
  };

  /* ─── TOGGLE ─── */
  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${API}/toggle/${id}`);
      showToast(`Status: ${res.data.data.status}`);
      fetchBanners();
    } catch {
      showToast("Toggle failed", false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Banner Manager</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {banners.length} banner{banners.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            <span className="text-base leading-none">+</span> Create Banner
          </button>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm border-collapse">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-[80px]">
                    Image
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Banner ID
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-[110px]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-[120px]">
                    Created At
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-[90px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {fetching ? (
                  <tr>
                    <td colSpan={5} className="text-center py-14 text-gray-400 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-14 text-gray-400 text-sm">
                      No banners yet. Click "Create Banner" to add one.
                    </td>
                  </tr>
                ) : (
                  banners.map((b, i) => (
                    <tr
                      key={b._id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                        i === banners.length - 1 ? "border-none" : ""
                      }`}
                    >
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        <img
                          src={b.image}
                          alt="banner"
                          className="w-[56px] h-[36px] object-cover rounded-lg border border-gray-100 bg-gray-100"
                        />
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-gray-400 block truncate max-w-[180px]">
                          {b._id}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(b._id)}
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition whitespace-nowrap ${
                            b.status === "active"
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                          {b.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">
                        {formatDate(b.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(b)}
                            title="Edit"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition text-xs"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteId(b._id)}
                            title="Delete"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ CREATE / EDIT MODAL ══ */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md p-6 shadow-xl">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900">
                {editBanner ? "Edit Banner" : "Create New Banner"}
              </h2>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 text-xs transition"
              >
                ✕
              </button>
            </div>

            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
              {editBanner ? "Replace Image (optional)" : "Banner Image *"}
            </label>

            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <p className="text-sm text-gray-500">
                Click to browse or{" "}
                <span className="font-semibold text-gray-700">drag & drop</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {preview && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />
                {file && (
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full hover:bg-black/70"
                  >
                    ✕ Remove
                  </button>
                )}
                {editBanner && !file && (
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                    Current Image
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={editBanner ? handleUpdate : handleCreate}
                disabled={loading || (!file && !editBanner)}
                className="flex-1 bg-gray-900 text-white text-sm font-semibold py-2 rounded-xl hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? editBanner ? "Updating..." : "Creating..."
                  : editBanner ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 text-center shadow-xl">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Delete Banner?</h3>
            <p className="text-xs text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg z-50 ${
            toast.ok ? "bg-gray-900" : "bg-red-500"
          }`}
        >
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}