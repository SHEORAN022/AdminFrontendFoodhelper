
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Percent, Hash, Layers, Save, Plus, Trash2, Edit } from "react-feather";
import "./AdminGST.css";

const API = "https://grocerrybackend.onrender.com/api";

export default function AdminGST() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [gst, setGst] = useState("");
  const [hsn, setHsn] = useState("");
  const [taxType, setTaxType] = useState("cgst_sgst");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [gstList, setGstList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingGST, setEditingGST] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadProducts = async () => {
    try {
      const res = await axios.get(API + "/prices");
      const list = [];

      (res.data.data || []).forEach(cat => {
        (cat.subcategories || []).forEach(sub => {

          // ✅ FIX: subSubcategories ke andar products (PriceList ka actual structure)
          (sub.subSubcategories || []).forEach(subSub => {
            (subSub.products || []).forEach(p => list.push(p));
          });

          // ✅ FIX: direct sub.products bhi check karo (fallback)
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

      console.log("Products loaded:", unique.length, unique.map(p => p.name));
      setProducts(unique);
    } catch (err) {
      console.error("Product load error:", err);
    }
  };

  const loadGST = async () => {
    try {
      const res = await axios.get(API + "/gst/all");
      setGstList(res.data.data || res.data);
    } catch (err) {
      console.error("GST load error:", err);
    }
  };

  const loadDiscount = async () => {
    try {
      const res = await axios.get(API + "/discount/all");
      setDiscountList(res.data.data || res.data);
    } catch (err) {
      console.error("Discount load error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await Promise.all([loadProducts(), loadGST(), loadDiscount()]);
      setDataLoading(false);
    };
    loadData();
  }, []);

  /* ================= GST OPERATIONS ================= */
  const saveGST = async () => {
    if (!productId || gst === "" || hsn === "") {
      alert("Please select product, enter GST % and HSN code");
      return;
    }
    const gstNum = Number(gst);
    if (isNaN(gstNum) || gstNum < 0 || gstNum > 100) {
      alert("GST % must be a number between 0 and 100");
      return;
    }
    setLoading(true);
    try {
      if (editingGST) {
        await axios.put(API + `/gst/${editingGST._id}`, { gstPercent: gstNum, hsnCode: hsn, taxType });
        alert("GST Updated Successfully");
        setEditingGST(null);
      } else {
        await axios.post(API + "/gst/set", { productId, gstPercent: gstNum, hsnCode: hsn, taxType });
        alert("GST Saved Successfully");
      }
      setGst(""); setHsn(""); setTaxType("cgst_sgst"); setProductId("");
      loadGST();
    } catch (err) {
      console.error("GST save error:", err);
      alert("GST save failed: " + (err.response?.data?.message || err.message || "Operation failed"));
    }
    setLoading(false);
  };

  const editGST = (gstRule) => {
    setEditingGST(gstRule);
    const prodId = gstRule.product?._id || gstRule.product;
    setProductId(prodId || "");
    setGst(gstRule.gstPercent ? gstRule.gstPercent.toString() : "");
    setHsn(gstRule.hsnCode || "");
    setTaxType(gstRule.taxType || "cgst_sgst");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteGST = async (id) => {
    if (!window.confirm("Are you sure you want to delete this GST rule?")) return;
    setLoading(true);
    try {
      await axios.delete(API + `/gst/${id}`);
      alert("GST Deleted Successfully");
      loadGST();
    } catch (err) {
      console.error("Delete GST error:", err);
      alert("Delete failed: " + (err.response?.data?.message || err.message || "Delete failed"));
    }
    setLoading(false);
  };

  const cancelGSTEdit = () => {
    setEditingGST(null);
    setProductId(""); setGst(""); setHsn(""); setTaxType("cgst_sgst");
  };

  /* ================= DISCOUNT OPERATIONS ================= */
  const saveDiscount = async () => {
    if (!productId || minQty === "" || unitPrice === "") {
      alert("Please fill Product, Min Qty and Unit Price");
      return;
    }
    const minQtyNum = Number(minQty);
    const maxQtyNum = maxQty ? Number(maxQty) : null;
    const unitPriceNum = Number(unitPrice);

    if (isNaN(minQtyNum) || minQtyNum < 1) {
      alert("Min Qty must be a number greater than or equal to 1");
      return;
    }
    if (maxQtyNum !== null && (isNaN(maxQtyNum) || maxQtyNum < minQtyNum)) {
      alert("Max Qty must be greater than or equal to Min Qty");
      return;
    }
    if (isNaN(unitPriceNum) || unitPriceNum <= 0) {
      alert("Unit Price must be a number greater than 0");
      return;
    }

    setLoading(true);
    try {
      if (editingDiscount) {
        await axios.put(API + `/discount/${editingDiscount._id}`, { minQty: minQtyNum, maxQty: maxQtyNum, unitPrice: unitPriceNum });
        alert("Discount Updated Successfully");
        setEditingDiscount(null);
      } else {
        await axios.post(API + "/discount/add", { product: productId, minQty: minQtyNum, maxQty: maxQtyNum, unitPrice: unitPriceNum });
        alert("Discount Added Successfully");
      }
      setMinQty(""); setMaxQty(""); setUnitPrice(""); setProductId("");
      loadDiscount();
    } catch (err) {
      console.error("Discount operation error:", err);
      alert("Operation failed: " + (err.response?.data?.message || err.message || "Operation failed"));
    }
    setLoading(false);
  };

  const editDiscount = (discount) => {
    setEditingDiscount(discount);
    const prodId = discount.product?._id || discount.product;
    setProductId(prodId || "");
    setMinQty(discount.minQty ? discount.minQty.toString() : "");
    setMaxQty(discount.maxQty ? discount.maxQty.toString() : "");
    setUnitPrice(discount.unitPrice ? discount.unitPrice.toString() : "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteDiscount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount rule?")) return;
    setLoading(true);
    try {
      await axios.delete(API + `/discount/${id}`);
      alert("Discount Deleted Successfully");
      loadDiscount();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingDiscount(null);
    setProductId(""); setMinQty(""); setMaxQty(""); setUnitPrice("");
  };

  return (
    <div className="tm-gst-wrapper">
      {/* Page Header */}
      <div className="tm-gst-header">
        <h2 className="tm-gst-title">GST & Discount Manager</h2>
        <p className="tm-gst-subtitle">
          {dataLoading
            ? "Loading products..."
            : `${products.length} products loaded · Manage product tax rates and bulk discount pricing`}
        </p>
      </div>

      <div className="tm-gst-grid">
        {/* LEFT SIDE: FORM CONTROLS */}
        <div className="tm-gst-form-col">

          {/* 1. Product Select Card */}
          <div className="tm-gst-card">
            <div className="tm-gst-card-head">
              <h3>1. Target Selection</h3>
            </div>
            <div className="tm-gst-card-body">
              <div className="tm-gst-field">
                <label>Select Product</label>
                <div className="tm-gst-input-box">
                  <Package className="tm-gst-icon" size={18} />
                  <select
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    disabled={editingDiscount !== null || editingGST !== null}
                  >
                    <option value="">
                      {dataLoading
                        ? "Loading products..."
                        : products.length === 0
                        ? "No products found — check console"
                        : "Choose a product"}
                    </option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                {(editingDiscount || editingGST) && (
                  <small style={{ color: '#64748b', fontSize: '12px' }}>
                    Product cannot be changed while editing
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* 2. GST Setup Card */}
          <div className="tm-gst-card">
            <div className="tm-gst-card-head">
              <h3>2. GST Setup</h3>
              {editingGST && <span className="tm-gst-edit-badge">Editing Mode</span>}
            </div>
            <div className="tm-gst-card-body">
              <div className="tm-gst-row">
                <div className="tm-gst-field">
                  <label>GST %</label>
                  <div className="tm-gst-input-box">
                    <Percent className="tm-gst-icon" size={18} />
                    <input type="number" placeholder="18" value={gst} onChange={e => setGst(e.target.value)} />
                  </div>
                </div>
                <div className="tm-gst-field">
                  <label>HSN Code</label>
                  <div className="tm-gst-input-box">
                    <Hash className="tm-gst-icon" size={18} />
                    <input placeholder="e.g., 1234" value={hsn} onChange={e => setHsn(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="tm-gst-field">
                <label>Tax Type</label>
                <div className="tm-gst-input-box">
                  <Layers className="tm-gst-icon" size={18} />
                  <select value={taxType} onChange={e => setTaxType(e.target.value)}>
                    <option value="cgst_sgst">CGST + SGST</option>
                    <option value="igst">IGST</option>
                  </select>
                </div>
              </div>
              <div className="tm-gst-btn-group">
                <button className="tm-gst-btn-blue" onClick={saveGST} disabled={loading}>
                  {editingGST
                    ? <><Save size={18} /> Update GST Configuration</>
                    : <><Save size={18} /> {loading ? "Saving..." : "Save GST Configuration"}</>}
                </button>
                {editingGST && (
                  <button className="tm-gst-btn-gray" onClick={cancelGSTEdit} disabled={loading}>Cancel Edit</button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Discount Setup Card */}
          <div className="tm-gst-card">
            <div className="tm-gst-card-head">
              <h3>3. Bulk Discount Pricing</h3>
              {editingDiscount && <span className="tm-gst-edit-badge">Editing Mode</span>}
            </div>
            <div className="tm-gst-card-body">
              <div className="tm-gst-row">
                <div className="tm-gst-field">
                  <label>Min Qty</label>
                  <input className="tm-gst-basic-input" type="number" placeholder="1" value={minQty} onChange={e => setMinQty(e.target.value)} />
                </div>
                <div className="tm-gst-field">
                  <label>Max Qty (Optional)</label>
                  <input className="tm-gst-basic-input" type="number" placeholder="10" value={maxQty} onChange={e => setMaxQty(e.target.value)} />
                </div>
              </div>
              <div className="tm-gst-field">
                <label>Unit Price (₹)</label>
                <div className="tm-gst-input-box">
                  <input type="number" placeholder="145.00" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
                </div>
                <small style={{ color: '#64748b', fontSize: '12px' }}>Price per unit for this quantity range</small>
              </div>
              <div className="tm-gst-btn-group">
                <button className="tm-gst-btn-green" onClick={saveDiscount} disabled={loading}>
                  {editingDiscount
                    ? <><Save size={18} /> Update Discount</>
                    : <><Plus size={18} /> Add Discount Rule</>}
                </button>
                {editingDiscount && (
                  <button className="tm-gst-btn-gray" onClick={cancelEdit} disabled={loading}>Cancel Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: DATA TABLES */}
        <div className="tm-gst-table-col">

          {/* GST Rules Table */}
          <div className="tm-gst-card">
            <div className="tm-gst-card-head">
              <h3>Current GST Rules ({gstList.length})</h3>
            </div>
            <div className="tm-gst-scroll">
              <table className="tm-gst-table">
                <thead>
                  <tr><th>Product</th><th>HSN</th><th>GST</th><th>Type</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {gstList.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No GST rules configured yet</td></tr>
                  ) : gstList.map(g => {
                    const productName = g.product?.name || (typeof g.product === 'string' ? `ID: ${g.product.substring(0, 8)}...` : 'Unknown Product');
                    return (
                      <tr key={g._id}>
                        <td className="tm-gst-bold">{productName}</td>
                        <td><span className="tm-gst-badge-gray">{g.hsnCode}</span></td>
                        <td className="tm-gst-bold tm-gst-blue">{g.gstPercent}%</td>
                        <td>{g.taxType === "cgst_sgst" ? "CGST+SGST" : "IGST"}</td>
                        <td>
                          <div className="tm-gst-actions">
                            <button className="tm-gst-icon-btn tm-gst-edit" onClick={() => editGST(g)} title="Edit"><Edit size={16} /></button>
                            <button className="tm-gst-icon-btn tm-gst-delete" onClick={() => deleteGST(g._id)} title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount Rules Table */}
          <div className="tm-gst-card">
            <div className="tm-gst-card-head">
              <h3>Bulk Discount Rules ({discountList.length})</h3>
            </div>
            <div className="tm-gst-scroll">
              <table className="tm-gst-table">
                <thead>
                  <tr><th>Product</th><th>Quantity Range</th><th>Unit Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {discountList.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No discount rules configured yet</td></tr>
                  ) : discountList.map(d => {
                    const productName = d.product?.name || (typeof d.product === 'string' ? `ID: ${d.product.substring(0, 8)}...` : 'Unknown Product');
                    const displayPrice = d.unitPrice || 0;
                    return (
                      <tr key={d._id}>
                        <td className="tm-gst-bold">{productName}</td>
                        <td>{d.minQty || 0} {d.maxQty ? `- ${d.maxQty}` : '+'} Qty</td>
                        <td><span className="tm-gst-badge-green">₹{displayPrice.toFixed(2)}</span></td>
                        <td>
                          <div className="tm-gst-actions">
                            <button className="tm-gst-icon-btn tm-gst-edit" onClick={() => editDiscount(d)} title="Edit"><Edit size={16} /></button>
                            <button className="tm-gst-icon-btn tm-gst-delete" onClick={() => deleteDiscount(d._id)} title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}