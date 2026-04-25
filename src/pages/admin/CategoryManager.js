import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search, MoreHorizontal, Edit, Trash2,
  ChevronDown, ChevronUp, Plus, X, Image as ImageIcon
} from "react-feather";
import "./CategoryManager.css";

const API_BASE = "https://grocerrybackend.onrender.com/api/categories";

const emptyCategoryForm = { name: "", image: null };
const emptySubForm      = { name: "", image: null };
const emptySubSubForm   = { name: "", image: null };

const CategoryManager = () => {
  const [categories, setCategories]     = useState([]);
  const [catForm, setCatForm]           = useState(emptyCategoryForm);
  const [editCatId, setEditCatId]       = useState(null);
  const [showCatForm, setShowCatForm]   = useState(false);

  const [openMenuId, setOpenMenuId]     = useState(null);
  const [expandedCat, setExpandedCat]   = useState(null); // Level 1 → 2 toggle
  const [expandedSub, setExpandedSub]   = useState(null); // Level 2 → 3 toggle

  const [subForm, setSubForm]           = useState(emptySubForm);
  const [subSubForm, setSubSubForm]     = useState(emptySubSubForm);

  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 6;
  const [searchText, setSearchText]     = useState("");

  // Modal — one unified modal for all 3 levels
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [modalMode, setModalMode]       = useState("category"); // "category" | "subcategory" | "subsubcategory"
  const [modalTarget, setModalTarget]   = useState({ catId: null, subId: null, subSubId: null });
  const [modalPreview, setModalPreview] = useState(null);
  const [modalForm, setModalForm]       = useState({ name: "", image: null });

  /* ─────────── Fetch ─────────── */
  const fetchCategories = async () => {
    try {
      const res  = await axios.get(API_BASE);
      const cats = res.data.categories || res.data.data || [];
      setCategories(
        cats.map((c) => ({
          ...c,
          subcategories: (c.subcategories || []).map((s) => ({
            ...s,
            subSubcategories: Array.isArray(s.subSubcategories) ? s.subSubcategories : [],
          })),
        }))
      );
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  /* ─────────── Filter / Pagination ─────────── */
  const filterCategories = (cats, q) => {
    if (!q?.trim()) return cats;
    const t = q.toLowerCase();
    return cats.map((c) => {
      if (c.name.toLowerCase().includes(t)) return c;
      const matchedSubs = (c.subcategories || []).filter(
        (s) =>
          s.name.toLowerCase().includes(t) ||
          (s.subSubcategories || []).some((ss) => ss.name.toLowerCase().includes(t))
      );
      if (matchedSubs.length) return { ...c, subcategories: matchedSubs };
      return null;
    }).filter(Boolean);
  };

  const filtered    = filterCategories(categories, searchText);
  const totalPages  = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentCats = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ─────────── Category CRUD ─────────── */
  const submitCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return toast.warn("Enter category name");
    const fd = new FormData();
    fd.append("name", catForm.name);
    if (catForm.image) fd.append("image", catForm.image);
    try {
      if (editCatId) { await axios.put(`${API_BASE}/${editCatId}`, fd); toast.success("Category updated"); }
      else           { await axios.post(API_BASE, fd);                   toast.success("Category added");   }
      setCatForm(emptyCategoryForm); setEditCatId(null); setShowCatForm(false); fetchCategories();
    } catch { toast.error("Failed to save category"); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category and all its data?")) return;
    try { await axios.delete(`${API_BASE}/${id}`); toast.success("Category deleted"); fetchCategories(); }
    catch { toast.error("Delete failed"); }
  };

  /* ─────────── Subcategory CRUD ─────────── */
  const submitSub = async (e, catId) => {
    e.preventDefault();
    if (!subForm.name.trim()) return toast.warn("Enter subcategory name");
    const fd = new FormData();
    fd.append("name", subForm.name);
    if (subForm.image) fd.append("image", subForm.image);
    try {
      await axios.post(`${API_BASE}/${catId}/sub`, fd);
      toast.success("Subcategory added");
      setSubForm(emptySubForm);
      fetchCategories();
    } catch { toast.error("Failed to save subcategory"); }
  };

  const deleteSub = async (catId, subId) => {
    if (!window.confirm("Delete subcategory?")) return;
    try { await axios.delete(`${API_BASE}/${catId}/sub/${subId}`); toast.success("Subcategory deleted"); fetchCategories(); }
    catch { toast.error("Delete failed"); }
  };

  /* ─────────── Sub-Subcategory CRUD ─────────── */
  const submitSubSub = async (e, catId, subId) => {
    e.preventDefault();
    if (!subSubForm.name.trim()) return toast.warn("Enter item name");
    const fd = new FormData();
    fd.append("name", subSubForm.name);
    if (subSubForm.image) fd.append("image", subSubForm.image);
    try {
      await axios.post(`${API_BASE}/${catId}/sub/${subId}/subsub`, fd);
      toast.success("Item added");
      setSubSubForm(emptySubSubForm);
      fetchCategories();
    } catch { toast.error("Failed to add item"); }
  };

  const deleteSubSub = async (catId, subId, subSubId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_BASE}/${catId}/sub/${subId}/subsub/${subSubId}`);
      toast.success("Item deleted");
      fetchCategories();
    } catch { toast.error("Delete failed"); }
  };

  /* ─────────── Unified Modal ─────────── */
  const openModal = (mode, target, name, image) => {
    setModalMode(mode);
    setModalTarget(target);
    setModalPreview(image || null);
    setModalForm({ name, image: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPreview(null);
    setModalForm({ name: "", image: null });
  };

  const saveModal = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return toast.warn("Name cannot be empty");
    const fd = new FormData();
    fd.append("name", modalForm.name);
    if (modalForm.image) fd.append("image", modalForm.image);
    try {
      const { catId, subId, subSubId } = modalTarget;
      if      (modalMode === "category")       await axios.put(`${API_BASE}/${catId}`, fd);
      else if (modalMode === "subcategory")    await axios.put(`${API_BASE}/${catId}/sub/${subId}`, fd);
      else if (modalMode === "subsubcategory") await axios.put(`${API_BASE}/${catId}/sub/${subId}/subsub/${subSubId}`, fd);
      toast.success("Updated successfully");
      closeModal();
      fetchCategories();
    } catch { toast.error("Update failed"); }
  };

  /* ─────────── Render ─────────── */
  return (
    <div className="tm-wrapper">
      <ToastContainer position="top-right" />

      {/* ── Header ── */}
      <div className="flex flex-row justify-between items-center gap-2 mb-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] md:text-xl font-bold text-slate-800 uppercase tracking-tighter">
            Category Manager
          </h2>
        </div>
        <button
          onClick={() => { setEditCatId(null); setCatForm(emptyCategoryForm); setShowCatForm((p) => !p); }}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* ── Inline Add Category Form ── */}
      {showCatForm && (
        <div className="tm-card tm-form-card">
          <form className="tm-grid-form" onSubmit={submitCategory}>
            <div className="tm-input-group">
              <label>Category Name</label>
              <input
                name="name" placeholder="Ex: Groceries"
                value={catForm.name}
                onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="tm-input-group">
              <label>Icon / Image</label>
              <input type="file" onChange={(e) => setCatForm((p) => ({ ...p, image: e.target.files[0] }))} />
            </div>
            <button type="submit" className="tm-btn-save">
              {editCatId ? "Update" : "Save Category"}
            </button>
          </form>
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="tm-card tm-table-card">
        <div className="tm-table-toolbar">
          <div className="tm-search-wrapper">
            <Search size={18} />
            <input
              placeholder="Search category, sub or item..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="tm-responsive-table">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Items</th>
                <th>Status</th>
                <th className="tm-action-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCats.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                    No categories found
                  </td>
                </tr>
              )}

              {currentCats.map((cat, i) => (
                <React.Fragment key={cat._id}>

                  {/* ══ Level 1: Category Row ══ */}
                  <tr>
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>
                      <div className="tm-item-info">
                        <div className="tm-img-container">
                          {cat.image ? <img src={cat.image} alt="" /> : <ImageIcon size={20} />}
                        </div>
                        <span className="tm-item-name">{cat.name}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="tm-pill-btn"
                        onClick={() => {
                          setExpandedCat(expandedCat === cat._id ? null : cat._id);
                          setExpandedSub(null);
                        }}
                      >
                        {cat.subcategories.length} Sub
                        {expandedCat === cat._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td><span className="tm-badge-active">Active</span></td>
                    <td className="tm-action-cell">
                      <div className="tm-dots-container">
                        <MoreHorizontal
                          className="tm-dots-icon"
                          onClick={() => setOpenMenuId(openMenuId === cat._id ? null : cat._id)}
                        />
                        {openMenuId === cat._id && (
                          <div className="tm-dropdown-menu">
                            <button onClick={() => {
                              openModal("category", { catId: cat._id }, cat.name, cat.image);
                              setOpenMenuId(null);
                            }}>
                              <Edit size={14} /> Edit
                            </button>
                            <button className="text-red" onClick={() => { deleteCategory(cat._id); setOpenMenuId(null); }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* ══ Level 2: Subcategory Panel ══ */}
                  {expandedCat === cat._id && (
                    <tr className="tm-expand-row">
                      <td colSpan="5">
                        <div className="tm-sub-container">
                          <h4 className="tm-sub-title">
                            Subcategories of <strong>{cat.name}</strong>
                          </h4>

                          <div className="tm-sub-list">
                            {cat.subcategories.length === 0 && (
                              <p className="tm-empty-msg">No subcategories yet.</p>
                            )}

                            {cat.subcategories.map((sub) => (
                              <React.Fragment key={sub._id}>

                                {/* ── Subcategory Item ── */}
                                <div className="tm-sub-item">
                                  <div className="tm-sub-left">
                                    {sub.image && <img src={sub.image} alt="" />}
                                    <span>{sub.name}</span>
                                    {/* Toggle Level 3 */}
                                    <button
                                      className="tm-pill-btn tm-pill-sm"
                                      onClick={() => setExpandedSub(expandedSub === sub._id ? null : sub._id)}
                                    >
                                      {(sub.subSubcategories || []).length} Items
                                      {expandedSub === sub._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                  </div>
                                  <div className="tm-sub-right">
                                    <Edit
                                      size={14}
                                      onClick={() =>
                                        openModal("subcategory", { catId: cat._id, subId: sub._id }, sub.name, sub.image)
                                      }
                                    />
                                    <Trash2 size={14} className="text-red" onClick={() => deleteSub(cat._id, sub._id)} />
                                  </div>
                                </div>

                                {/* ══ Level 3: Sub-Subcategory Panel (Optional) ══ */}
                                {expandedSub === sub._id && (
                                  <div className="tm-subsub-panel">
                                    <p className="tm-subsub-title">
                                      Items inside <strong>{sub.name}</strong>
                                    </p>

                                    <div className="tm-sub-list">
                                      {(sub.subSubcategories || []).length === 0 && (
                                        <p className="tm-empty-msg" style={{ fontSize: 12 }}>No items yet.</p>
                                      )}
                                      {(sub.subSubcategories || []).map((ss) => (
                                        <div key={ss._id} className="tm-sub-item tm-subsub-item">
                                          <div className="tm-sub-left">
                                            {ss.image
                                              ? <img src={ss.image} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
                                              : <ImageIcon size={14} style={{ color: "#94a3b8" }} />
                                            }
                                            <span>{ss.name}</span>
                                            <span className={`tm-status-tag ${ss.active ? "tm-status-active" : "tm-status-inactive"}`}>
                                              {ss.active ? "Active" : "Inactive"}
                                            </span>
                                          </div>
                                          <div className="tm-sub-right">
                                            <Edit
                                              size={13}
                                              onClick={() =>
                                                openModal(
                                                  "subsubcategory",
                                                  { catId: cat._id, subId: sub._id, subSubId: ss._id },
                                                  ss.name, ss.image
                                                )
                                              }
                                            />
                                            <Trash2
                                              size={13}
                                              className="text-red"
                                              onClick={() => deleteSubSub(cat._id, sub._id, ss._id)}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Add Sub-Subcategory Form */}
                                    <form
                                      className="tm-sub-add-form"
                                      onSubmit={(e) => submitSubSub(e, cat._id, sub._id)}
                                    >
                                      <input
                                        placeholder="New item name..."
                                        value={subSubForm.name}
                                        name="name"
                                        onChange={(e) => setSubSubForm((p) => ({ ...p, name: e.target.value }))}
                                      />
                                      <input
                                        type="file"
                                        className="tm-file-input"
                                        onChange={(e) => setSubSubForm((p) => ({ ...p, image: e.target.files[0] }))}
                                      />
                                      <button type="submit">+ Add Item</button>
                                    </form>
                                  </div>
                                )}

                              </React.Fragment>
                            ))}
                          </div>

                          {/* Add Subcategory Form */}
                          <form className="tm-sub-add-form tm-sub-add-form--top" onSubmit={(e) => submitSub(e, cat._id)}>
                            <input
                              placeholder="New subcategory name..."
                              value={subForm.name}
                              name="name"
                              onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
                            />
                            <input
                              type="file"
                              className="tm-file-input"
                              onChange={(e) => setSubForm((p) => ({ ...p, image: e.target.files[0] }))}
                            />
                            <button type="submit">Add Sub</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="tm-pagination">
          <p>Page {currentPage} of {totalPages}</p>
          <div className="tm-pagination-btns">
            <button disabled={currentPage === 1}          onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* ── Edit Modal (Category / Subcategory / Item) ── */}
      {isModalOpen && (
        <div className="tm-modal-overlay" onClick={closeModal}>
          <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>
                Edit{" "}
                {modalMode === "category"
                  ? "Category"
                  : modalMode === "subcategory"
                  ? "Subcategory"
                  : "Item"}
              </h3>
              <X className="cursor-pointer" onClick={closeModal} />
            </div>
            <form className="tm-modal-body" onSubmit={saveModal}>
              <div className="tm-form-group">
                <label>Name</label>
                <input
                  value={modalForm.name}
                  onChange={(e) => setModalForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="tm-form-group">
                <label>
                  Update Image{" "}
                  <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setModalPreview(URL.createObjectURL(file));
                      setModalForm((p) => ({ ...p, image: file }));
                    }
                  }}
                />
              </div>
              {modalPreview && <img src={modalPreview} className="tm-modal-preview" alt="" />}
              <div className="tm-modal-footer">
                <button type="button" className="tm-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="tm-btn-save">Update Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;